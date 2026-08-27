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

let officialInstantEvidenceCount = 0;
for (const boundaryCase of fixture.calculationBoundaryCases) {
  assert.equal(typeof boundaryCase.id, 'string');
  assert.equal(seen.has(boundaryCase.id), false, `Duplicate fixture id: ${boundaryCase.id}`);
  seen.add(boundaryCase.id);
  assert.ok(Array.isArray(boundaryCase.requiredEvidence) && boundaryCase.requiredEvidence.length >= 2, `${boundaryCase.id} needs at least two evidence classes.`);
  assert.ok(typeof boundaryCase.reason === 'string' && boundaryCase.reason.length >= 20, `${boundaryCase.id} needs an explicit anti-guessing reason.`);

  if (boundaryCase.status === 'official-instant-verified') {
    officialInstantEvidenceCount += 1;
    assert.equal(typeof boundaryCase.officialInstant, 'string', `${boundaryCase.id}: officialInstant required`);
    assert.equal(typeof boundaryCase.officialLocalTime, 'string', `${boundaryCase.id}: officialLocalTime required`);
    assert.equal(typeof boundaryCase.officialSource, 'string', `${boundaryCase.id}: officialSource required`);
    assert.ok(boundaryCase.officialSource.startsWith('https://astro.kasi.re.kr/'), `${boundaryCase.id}: official source must be KASI`);
    assert.equal(boundaryCase.resolutionSeconds, 60, `${boundaryCase.id}: current KASI fixture resolution is one minute`);

    const utcMs = Date.parse(boundaryCase.officialInstant);
    const localMs = Date.parse(boundaryCase.officialLocalTime);
    assert.ok(Number.isFinite(utcMs), `${boundaryCase.id}: officialInstant must be ISO parseable`);
    assert.ok(Number.isFinite(localMs), `${boundaryCase.id}: officialLocalTime must be ISO parseable`);
    assert.equal(utcMs, localMs, `${boundaryCase.id}: UTC and KST records must identify the same instant`);

    // Official astronomical time is evidence, not yet calculator truth. Until
    // a genuinely independent implementation cross-check is recorded, do not
    // let this fixture assert Saju pillar output or claim full verification.
    for (const forbidden of ['expectedPillars', 'verified']) {
      assert.equal(Object.hasOwn(boundaryCase, forbidden), false, `${boundaryCase.id} contains premature calculator truth: ${forbidden}`);
    }
    continue;
  }

  assert.equal(boundaryCase.status, 'research-pending', `${boundaryCase.id} has an unsupported evidence state.`);
  for (const forbidden of ['expectedPillars', 'expectedInstant', 'officialInstant', 'verified']) {
    assert.equal(Object.hasOwn(boundaryCase, forbidden), false, `${boundaryCase.id} contains unverified calculator truth: ${forbidden}`);
  }
}

assert.ok(officialInstantEvidenceCount >= 1, 'At least one calculator-boundary case should carry official astronomical evidence once established.');
console.log(`Saju boundary fixture checks passed: ${fixture.contractCases.length} executable contract cases; ${officialInstantEvidenceCount} official instant evidence record(s); remaining calculator outputs stay evidence-gated.`);
