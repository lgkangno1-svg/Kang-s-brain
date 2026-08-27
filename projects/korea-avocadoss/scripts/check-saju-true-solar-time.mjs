import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const sourcePath = path.join(projectRoot, 'src', 'lib', 'saju', 'true-solar-time.ts');
const fixturePath = path.join(projectRoot, 'fixtures', 'saju', 'true-solar-time-fixtures.json');

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
const {resolveTrueSolarClock, hourBranchForSolarMinute, SAJU_TRUE_SOLAR_TIME_VERSION} = runtimeModule.exports;
assert.equal(typeof resolveTrueSolarClock, 'function');
assert.equal(typeof hourBranchForSolarMinute, 'function');

const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
assert.equal(fixture.schemaVersion, 'saju-true-solar-time-v1');
assert.equal(fixture.algorithmVersion, SAJU_TRUE_SOLAR_TIME_VERSION);
assert.ok(Array.isArray(fixture.evidence) && fixture.evidence.length >= 4);
assert.ok(Array.isArray(fixture.cases) && fixture.cases.length >= 4);
assert.ok(fixture.scopeNote.includes('do not claim'));

const evidenceRoles = new Set(fixture.evidence.map((item) => item.role));
for (const role of ['official-algorithm', 'official-definition', 'independent-community-cross-check', 'convention-contrast']) {
  assert.ok(evidenceRoles.has(role), `Missing evidence role: ${role}`);
}
for (const evidence of fixture.evidence) {
  assert.match(evidence.source, /^https:\/\//);
  assert.ok(evidence.finding.length >= 80, `Evidence too terse: ${evidence.role}`);
}

function close(actual, expected, tolerance = 1e-9, label = 'number') {
  assert.ok(Number.isFinite(actual), `${label}: actual must be finite`);
  assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: expected ${expected}, got ${actual}`);
}

const seen = new Set();
for (const testCase of fixture.cases) {
  assert.equal(seen.has(testCase.id), false, `Duplicate case: ${testCase.id}`);
  seen.add(testCase.id);
  const actual = resolveTrueSolarClock(testCase.input);
  assert.equal(actual.algorithmVersion, fixture.algorithmVersion, `${testCase.id}: algorithm version`);
  close(actual.equationOfTimeMinutes, testCase.expect.equationOfTimeMinutes, 1e-9, `${testCase.id}: EoT`);
  close(actual.longitudeCorrectionMinutes, testCase.expect.longitudeCorrectionMinutes, 1e-9, `${testCase.id}: longitude correction`);
  close(actual.totalCorrectionMinutes, testCase.expect.totalCorrectionMinutes, 1e-9, `${testCase.id}: total correction`);
  close(actual.trueSolarMinuteOfDay, testCase.expect.trueSolarMinuteOfDay, 1e-9, `${testCase.id}: true solar minute`);
  assert.equal(actual.dayOffset, testCase.expect.dayOffset, `${testCase.id}: day offset`);
  assert.equal(actual.hourBranch, testCase.expect.hourBranch, `${testCase.id}: solar hour branch`);
  assert.equal(hourBranchForSolarMinute(testCase.input.hour * 60 + testCase.input.minute), testCase.civilHourBranch, `${testCase.id}: civil hour branch`);
}

assert.equal(hourBranchForSolarMinute(0), '子');
assert.equal(hourBranchForSolarMinute(59.999), '子');
assert.equal(hourBranchForSolarMinute(60), '丑');
assert.equal(hourBranchForSolarMinute(1380), '子');
assert.throws(() => hourBranchForSolarMinute(-0.01), /true solar minute of day/);
assert.throws(() => resolveTrueSolarClock({...fixture.cases[0].input, longitude: 181}), /longitude/);
assert.throws(() => resolveTrueSolarClock({...fixture.cases[0].input, utcOffsetMinutes: 900}), /UTC offset minutes/);

const crossingCases = fixture.cases.filter((item) => item.civilHourBranch !== item.expect.hourBranch);
assert.ok(crossingCases.length >= 2, 'Fixtures must prove that true-solar correction can cross a two-hour branch boundary.');
assert.ok(fixture.cases.some((item) => item.expect.dayOffset !== 0), 'Fixtures must preserve civil-date crossing instead of wrapping it away silently.');

console.log(`Saju true-solar checks passed: ${fixture.cases.length} deterministic cases, ${crossingCases.length} branch crossings, NOAA/GML EoT + longitude correction.`);
