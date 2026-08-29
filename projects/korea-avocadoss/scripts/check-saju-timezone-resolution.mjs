import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const sourcePath = path.join(projectRoot, 'src', 'lib', 'saju', 'timezone-resolution.ts');
const fixturePath = path.join(projectRoot, 'fixtures', 'saju', 'timezone-resolution-fixtures.json');

const source = readFileSync(sourcePath, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true},
  fileName: sourcePath,
  reportDiagnostics: true,
});
const errors = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
assert.equal(errors.length, 0, `TypeScript transpile diagnostics: ${errors.map((item) => item.messageText).join('; ')}`);

const runtimeModule = {exports: {}};
const execute = new Function('exports', 'module', 'require', '__filename', '__dirname', transpiled.outputText);
execute(runtimeModule.exports, runtimeModule, require, sourcePath, path.dirname(sourcePath));
const {resolveIanaWallClockMinute, SAJU_TIMEZONE_RESOLUTION_VERSION} = runtimeModule.exports;
assert.equal(typeof resolveIanaWallClockMinute, 'function');

const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
assert.equal(fixture.schemaVersion, 'saju-timezone-resolution-fixtures-v1');
assert.equal(fixture.algorithmVersion, SAJU_TIMEZONE_RESOLUTION_VERSION);
assert.ok(fixture.scopeNote.includes('do not invent'));
assert.ok(Array.isArray(fixture.evidence) && fixture.evidence.length >= 3);
assert.ok(Array.isArray(fixture.cases) && fixture.cases.length >= 4);

for (const evidence of fixture.evidence) {
  assert.match(evidence.source, /^https:\/\//);
  assert.ok(evidence.finding.length >= 80, `Evidence too terse: ${evidence.role}`);
}

const statuses = new Set();
for (const testCase of fixture.cases) {
  const actual = resolveIanaWallClockMinute(testCase.wallClock, testCase.timeZone);
  statuses.add(actual.status);
  assert.equal(actual.algorithmVersion, fixture.algorithmVersion, `${testCase.id}: algorithm version`);
  assert.equal(actual.timeZone, testCase.timeZone, `${testCase.id}: timezone`);
  assert.deepEqual(actual.wallClock, testCase.wallClock, `${testCase.id}: wall clock`);
  assert.equal(actual.status, testCase.expect.status, `${testCase.id}: status`);
  assert.equal(actual.candidates.length, testCase.expect.candidates.length, `${testCase.id}: candidate count`);

  const publicCandidates = actual.candidates.map(({instantIso, utcOffsetMinutes}) => ({instantIso, utcOffsetMinutes}));
  assert.deepEqual(publicCandidates, testCase.expect.candidates, `${testCase.id}: candidates`);
}

assert.deepEqual([...statuses].sort(), ['ambiguous', 'nonexistent', 'unique']);
assert.throws(
  () => resolveIanaWallClockMinute({year: 2024, month: 2, day: 30, hour: 12, minute: 0}, 'UTC'),
  /Invalid Gregorian/,
);
assert.throws(
  () => resolveIanaWallClockMinute({year: 2024, month: 1, day: 1, hour: 12, minute: 0}, 'Not/AZone'),
  /Invalid IANA/,
);

console.log(`Saju timezone checks passed: ${fixture.cases.length} deterministic cases covering unique, nonexistent and ambiguous IANA wall-clock minutes.`);
