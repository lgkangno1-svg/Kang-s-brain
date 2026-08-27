import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.join(here, '..', 'fixtures', 'saju', 'month-boundary-fixtures.json');
const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));

assert.equal(fixture.schemaVersion, 'saju-month-boundary-fixtures-v1');
assert.ok(Array.isArray(fixture.cases) && fixture.cases.length >= 1);

for (const testCase of fixture.cases) {
  assert.equal(testCase.status, 'month-pillar-cross-checked', `${testCase.id}: unsupported status`);
  assert.equal(testCase.officialTerm, '경칩', `${testCase.id}: this first trusted monthly case must be Jingzhe`);
  assert.ok(Array.isArray(testCase.requiredEvidence) && testCase.requiredEvidence.length >= 3, `${testCase.id}: evidence classes`);
  assert.equal(testCase.officialSource, 'https://astro.kasi.re.kr/life/post/calendardata');
  assert.equal(testCase.resolutionSeconds, 60, `${testCase.id}: KASI source resolution must remain one minute`);

  const officialUtcMs = Date.parse(testCase.officialInstant);
  const officialLocalMs = Date.parse(testCase.officialLocalTime);
  assert.ok(Number.isFinite(officialUtcMs) && Number.isFinite(officialLocalMs), `${testCase.id}: official times parse`);
  assert.equal(officialUtcMs, officialLocalMs, `${testCase.id}: UTC/KST official instant mismatch`);

  assert.ok(Array.isArray(testCase.trustedSamples) && testCase.trustedSamples.length === 2, `${testCase.id}: exactly two trusted samples`);
  const before = testCase.trustedSamples.find((sample) => sample.position === 'before-official-boundary-minute');
  const after = testCase.trustedSamples.find((sample) => sample.position === 'after-official-boundary-minute');
  assert.ok(before && after, `${testCase.id}: before/after samples required`);
  assert.equal(before.expectedMonthPillar, '丙寅', `${testCase.id}: pre-Jingzhe month pillar`);
  assert.equal(after.expectedMonthPillar, '丁卯', `${testCase.id}: post-Jingzhe month pillar`);

  const beforeMs = Date.parse(before.instant);
  const beforeLocalMs = Date.parse(before.localTime);
  const afterMs = Date.parse(after.instant);
  const afterLocalMs = Date.parse(after.localTime);
  assert.ok([beforeMs, beforeLocalMs, afterMs, afterLocalMs].every(Number.isFinite), `${testCase.id}: sample timestamps parse`);
  assert.equal(beforeMs, beforeLocalMs, `${testCase.id}: before UTC/KST mismatch`);
  assert.equal(afterMs, afterLocalMs, `${testCase.id}: after UTC/KST mismatch`);
  assert.ok(beforeMs < officialUtcMs, `${testCase.id}: before sample must precede KASI minute`);
  assert.ok(afterMs >= officialUtcMs + 60_000, `${testCase.id}: after sample must be beyond unresolved KASI minute`);

  const uncertaintyStart = Date.parse(testCase.boundaryMinuteUncertainty?.startInclusive);
  const uncertaintyEnd = Date.parse(testCase.boundaryMinuteUncertainty?.endExclusive);
  assert.equal(uncertaintyStart, officialUtcMs, `${testCase.id}: uncertainty start`);
  assert.equal(uncertaintyEnd, officialUtcMs + 60_000, `${testCase.id}: uncertainty end`);
  assert.ok((testCase.boundaryMinuteUncertainty?.reason ?? '').length >= 40, `${testCase.id}: precision limitation required`);

  assert.ok(Array.isArray(testCase.independentEvidence) && testCase.independentEvidence.length >= 2, `${testCase.id}: independent evidence`);
  const roles = new Set(testCase.independentEvidence.map((item) => item.role));
  assert.ok(roles.has('independent-implementation-tests'), `${testCase.id}: implementation tests required`);
  assert.ok(roles.has('independent-implementation-example'), `${testCase.id}: second implementation example required`);
  for (const evidence of testCase.independentEvidence) {
    assert.ok(/^https:\/\//.test(evidence.source), `${testCase.id}: HTTPS evidence URL`);
    assert.ok((evidence.finding ?? '').length >= 60, `${testCase.id}: explicit evidence finding`);
  }

  for (const forbidden of ['expectedPillars', 'exactBoundarySecond', 'verified']) {
    assert.equal(Object.hasOwn(testCase, forbidden), false, `${testCase.id}: overclaimed field ${forbidden}`);
  }
}

console.log(`Saju monthly boundary checks passed: ${fixture.cases.length} trusted case(s), with KASI minute-resolution uncertainty preserved.`);
