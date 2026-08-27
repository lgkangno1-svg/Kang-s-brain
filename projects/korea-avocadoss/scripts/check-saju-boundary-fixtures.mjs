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
let trustedYearPillarBoundaryCount = 0;
for (const boundaryCase of fixture.calculationBoundaryCases) {
  assert.equal(typeof boundaryCase.id, 'string');
  assert.equal(seen.has(boundaryCase.id), false, `Duplicate fixture id: ${boundaryCase.id}`);
  seen.add(boundaryCase.id);
  assert.ok(Array.isArray(boundaryCase.requiredEvidence) && boundaryCase.requiredEvidence.length >= 2, `${boundaryCase.id} needs at least two evidence classes.`);
  assert.ok(typeof boundaryCase.reason === 'string' && boundaryCase.reason.length >= 20, `${boundaryCase.id} needs an explicit anti-guessing reason.`);

  if (boundaryCase.status === 'year-pillar-cross-checked') {
    officialInstantEvidenceCount += 1;
    trustedYearPillarBoundaryCount += 1;
    assert.equal(typeof boundaryCase.officialInstant, 'string', `${boundaryCase.id}: officialInstant required`);
    assert.equal(typeof boundaryCase.officialLocalTime, 'string', `${boundaryCase.id}: officialLocalTime required`);
    assert.equal(typeof boundaryCase.officialSource, 'string', `${boundaryCase.id}: officialSource required`);
    assert.ok(boundaryCase.officialSource.startsWith('https://astro.kasi.re.kr/'), `${boundaryCase.id}: official source must be KASI`);
    assert.equal(boundaryCase.resolutionSeconds, 60, `${boundaryCase.id}: current KASI fixture resolution is one minute`);

    const officialUtcMs = Date.parse(boundaryCase.officialInstant);
    const officialLocalMs = Date.parse(boundaryCase.officialLocalTime);
    assert.ok(Number.isFinite(officialUtcMs), `${boundaryCase.id}: officialInstant must be ISO parseable`);
    assert.ok(Number.isFinite(officialLocalMs), `${boundaryCase.id}: officialLocalTime must be ISO parseable`);
    assert.equal(officialUtcMs, officialLocalMs, `${boundaryCase.id}: UTC and KST records must identify the same instant`);

    assert.ok(Array.isArray(boundaryCase.trustedSamples) && boundaryCase.trustedSamples.length === 2, `${boundaryCase.id}: two trusted samples required`);
    const before = boundaryCase.trustedSamples.find((sample) => sample.position === 'before-official-boundary-minute');
    const after = boundaryCase.trustedSamples.find((sample) => sample.position === 'after-official-boundary-minute');
    assert.ok(before, `${boundaryCase.id}: before sample required`);
    assert.ok(after, `${boundaryCase.id}: after sample required`);
    assert.equal(before.expectedYearPillar, '癸卯', `${boundaryCase.id}: trusted pre-Ipchun year pillar`);
    assert.equal(after.expectedYearPillar, '甲辰', `${boundaryCase.id}: trusted post-Ipchun year pillar`);

    const beforeMs = Date.parse(before.instant);
    const beforeLocalMs = Date.parse(before.localTime);
    const afterMs = Date.parse(after.instant);
    const afterLocalMs = Date.parse(after.localTime);
    assert.ok([beforeMs, beforeLocalMs, afterMs, afterLocalMs].every(Number.isFinite), `${boundaryCase.id}: trusted sample instants must be ISO parseable`);
    assert.equal(beforeMs, beforeLocalMs, `${boundaryCase.id}: before UTC/KST sample mismatch`);
    assert.equal(afterMs, afterLocalMs, `${boundaryCase.id}: after UTC/KST sample mismatch`);
    assert.ok(beforeMs < officialUtcMs, `${boundaryCase.id}: before sample must precede official boundary minute`);
    assert.ok(afterMs >= officialUtcMs + boundaryCase.resolutionSeconds * 1000, `${boundaryCase.id}: after sample must start after the unresolved source minute`);

    const uncertaintyStartMs = Date.parse(boundaryCase.boundaryMinuteUncertainty?.startInclusive);
    const uncertaintyEndMs = Date.parse(boundaryCase.boundaryMinuteUncertainty?.endExclusive);
    assert.equal(uncertaintyStartMs, officialUtcMs, `${boundaryCase.id}: uncertainty starts at published minute`);
    assert.equal(uncertaintyEndMs, officialUtcMs + boundaryCase.resolutionSeconds * 1000, `${boundaryCase.id}: uncertainty spans exactly source resolution`);
    assert.ok(typeof boundaryCase.boundaryMinuteUncertainty?.reason === 'string' && boundaryCase.boundaryMinuteUncertainty.reason.length >= 20, `${boundaryCase.id}: minute-resolution limitation must be explicit`);

    assert.ok(Array.isArray(boundaryCase.independentEvidence) && boundaryCase.independentEvidence.length >= 2, `${boundaryCase.id}: independent evidence required`);
    const evidenceRoles = new Set();
    for (const evidence of boundaryCase.independentEvidence) {
      assert.ok(/^https:\/\//.test(evidence.source), `${boundaryCase.id}: evidence source must be HTTPS`);
      assert.ok(typeof evidence.role === 'string' && evidence.role.length > 0, `${boundaryCase.id}: evidence role required`);
      assert.ok(typeof evidence.finding === 'string' && evidence.finding.length >= 40, `${boundaryCase.id}: evidence finding must be explicit`);
      evidenceRoles.add(evidence.role);
    }
    assert.ok(evidenceRoles.has('independent-implementation-tests'), `${boundaryCase.id}: independent implementation tests required`);
    assert.ok(evidenceRoles.has('independent-implementation-example'), `${boundaryCase.id}: second independent implementation example required`);

    // The trusted output is deliberately limited to Year Pillar samples outside
    // KASI's unresolved minute. Full Four Pillars and second-level cutover remain
    // forbidden until stronger evidence exists.
    for (const forbidden of ['expectedPillars', 'verified', 'exactBoundarySecond']) {
      assert.equal(Object.hasOwn(boundaryCase, forbidden), false, `${boundaryCase.id} contains overclaimed calculator truth: ${forbidden}`);
    }
    continue;
  }

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

    for (const forbidden of ['expectedPillars', 'trustedSamples', 'verified']) {
      assert.equal(Object.hasOwn(boundaryCase, forbidden), false, `${boundaryCase.id} contains premature calculator truth: ${forbidden}`);
    }
    continue;
  }

  assert.equal(boundaryCase.status, 'research-pending', `${boundaryCase.id} has an unsupported evidence state.`);
  for (const forbidden of ['expectedPillars', 'expectedInstant', 'officialInstant', 'trustedSamples', 'verified']) {
    assert.equal(Object.hasOwn(boundaryCase, forbidden), false, `${boundaryCase.id} contains unverified calculator truth: ${forbidden}`);
  }
}

assert.ok(officialInstantEvidenceCount >= 1, 'At least one calculator-boundary case should carry official astronomical evidence once established.');
assert.ok(trustedYearPillarBoundaryCount >= 1, 'At least one independently cross-checked Year Pillar boundary should exist once trusted samples are promoted.');
console.log(`Saju boundary fixture checks passed: ${fixture.contractCases.length} executable contract cases; ${officialInstantEvidenceCount} official instant evidence record(s); ${trustedYearPillarBoundaryCount} trusted Year Pillar boundary record(s); remaining calculator outputs stay evidence-gated.`);
