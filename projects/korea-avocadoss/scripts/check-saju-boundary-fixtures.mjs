import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const sourcePath = path.join(projectRoot, 'src', 'lib', 'saju', 'input-contracts.ts');
const fixturePath = path.join(projectRoot, 'fixtures', 'saju', 'boundary-fixtures.json');

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
const {normalizeSajuBirthInput, getLocalMinuteWindow, getSajuCalculationRequirements} = runtimeModule.exports;

const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
assert.equal(fixture.schemaVersion, 'saju-boundary-fixtures-v1');
assert.ok(Array.isArray(fixture.contractCases) && fixture.contractCases.length >= 10);
assert.ok(Array.isArray(fixture.calculationBoundaryCases) && fixture.calculationBoundaryCases.length >= 5);

const seen = new Set();
for (const testCase of fixture.contractCases) {
  assert.equal(typeof testCase.id, 'string');
  assert.ok(testCase.id.length > 0);
  assert.equal(seen.has(testCase.id), false, `Duplicate fixture id: ${testCase.id}`);
  seen.add(testCase.id);

  if (testCase.kind === 'normalize-invalid') {
    assert.throws(
      () => normalizeSajuBirthInput(testCase.input),
      (error) => String(error?.message ?? error).includes(testCase.errorIncludes),
      testCase.id,
    );
    continue;
  }

  if (testCase.kind === 'requirements') {
    const actual = getSajuCalculationRequirements(testCase.input);
    for (const [key, expected] of Object.entries(testCase.expect)) {
      assert.deepEqual(actual[key], expected, `${testCase.id}: ${key}`);
    }
    continue;
  }

  assert.equal(testCase.kind, 'normalize-valid', `Unknown fixture kind: ${testCase.kind}`);
  const normalized = normalizeSajuBirthInput(testCase.input);
  if ('isLeapMonth' in testCase.expect) {
    assert.equal(normalized.date.isLeapMonth, testCase.expect.isLeapMonth, `${testCase.id}: isLeapMonth`);
  }
  if ('dayBoundary' in testCase.expect) {
    assert.equal(normalized.policy.dayBoundary, testCase.expect.dayBoundary, `${testCase.id}: dayBoundary`);
  }
  if ('window' in testCase.expect) {
    const actualWindow = getLocalMinuteWindow(normalized.time);
    assert.deepEqual(
      [actualWindow.startMinuteInclusive, actualWindow.endMinuteExclusive],
      testCase.expect.window,
      `${testCase.id}: local minute window`,
    );
  }
}

for (const boundaryCase of fixture.calculationBoundaryCases) {
  assert.equal(typeof boundaryCase.id, 'string');
  assert.equal(seen.has(boundaryCase.id), false, `Duplicate fixture id: ${boundaryCase.id}`);
  seen.add(boundaryCase.id);
  assert.equal(boundaryCase.status, 'research-pending', `${boundaryCase.id} must remain pending until expected values are independently verified.`);
  assert.ok(Array.isArray(boundaryCase.requiredEvidence) && boundaryCase.requiredEvidence.length >= 2, `${boundaryCase.id} needs at least two evidence classes.`);
  assert.ok(typeof boundaryCase.reason === 'string' && boundaryCase.reason.length >= 20, `${boundaryCase.id} needs an explicit anti-guessing reason.`);

  // A future fixture may be promoted only when the harness is deliberately
  // upgraded to validate exact expected calculator output + source provenance.
  for (const forbidden of ['expectedPillars', 'expectedInstant', 'verified']) {
    assert.equal(Object.hasOwn(boundaryCase, forbidden), false, `${boundaryCase.id} contains unverified calculator truth: ${forbidden}`);
  }
}

console.log(`Saju boundary fixture checks passed: ${fixture.contractCases.length} executable contract cases; ${fixture.calculationBoundaryCases.length} calculator-boundary cases remain evidence-gated.`);
