import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const sourcePath = path.join(projectRoot, 'src', 'lib', 'saju', 'day-boundary-policy.ts');
const fixturePath = path.join(projectRoot, 'fixtures', 'saju', 'day-boundary-policy-fixtures.json');

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
const {resolveSajuDayBoundaryFrame} = runtimeModule.exports;
assert.equal(typeof resolveSajuDayBoundaryFrame, 'function');

const fixture = JSON.parse(readFileSync(fixturePath, 'utf8'));
assert.equal(fixture.schemaVersion, 'saju-day-boundary-policy-v1');
assert.ok(Array.isArray(fixture.reference?.evidence) && fixture.reference.evidence.length >= 4);
assert.ok(Array.isArray(fixture.cases) && fixture.cases.length === 9);
assert.ok(typeof fixture.scopeNote === 'string' && fixture.scopeNote.includes('not claim'));

const evidenceRoles = new Set(fixture.reference.evidence.map((item) => item.role));
for (const role of [
  'independent-civil-date-reference',
  'independent-next-day-reference',
  'independent-policy-implementation',
  'independent-split-zi-explanation',
]) {
  assert.ok(evidenceRoles.has(role), `Missing evidence role: ${role}`);
}
for (const evidence of fixture.reference.evidence) {
  assert.match(evidence.source, /^https:\/\//);
  assert.ok(evidence.finding.length >= 50);
}

const stems = [...'甲乙丙丁戊己庚辛壬癸'];
const branches = [...'子丑寅卯辰巳午未申酉戌亥'];
const ratStartByDayStem = new Map([
  ['甲', 0], ['己', 0],
  ['乙', 2], ['庚', 2],
  ['丙', 4], ['辛', 4],
  ['丁', 6], ['壬', 6],
  ['戊', 8], ['癸', 8],
]);

function hourPillarFor(dayPillar, hourBranch) {
  const dayStem = dayPillar[0];
  const branchIndex = branches.indexOf(hourBranch);
  const start = ratStartByDayStem.get(dayStem);
  assert.notEqual(start, undefined, `Unsupported day stem: ${dayStem}`);
  assert.ok(branchIndex >= 0, `Unsupported hour branch: ${hourBranch}`);
  return `${stems[(start + branchIndex) % 10]}${hourBranch}`;
}

const dayByDate = new Map([
  [fixture.reference.civilDate, fixture.reference.civilDayPillar],
  [fixture.reference.nextCivilDate, fixture.reference.nextDayPillar],
]);

const seen = new Set();
for (const testCase of fixture.cases) {
  assert.equal(seen.has(testCase.id), false, `Duplicate case: ${testCase.id}`);
  seen.add(testCase.id);
  const actual = resolveSajuDayBoundaryFrame(testCase.clock.hour, testCase.clock.minute, testCase.policy);
  assert.deepEqual(actual, {
    dayPillarDateOffset: testCase.expect.dayPillarDateOffset,
    hourStemDateOffset: testCase.expect.hourStemDateOffset,
    hourBranch: testCase.expect.hourBranch,
  }, `${testCase.id}: policy frame`);

  const civilDate = testCase.civilDate ?? fixture.reference.civilDate;
  const civilDay = dayByDate.get(civilDate);
  assert.ok(civilDay, `${testCase.id}: unsupported civil-date reference`);
  let nextDay;
  if (civilDate === fixture.reference.civilDate) nextDay = fixture.reference.nextDayPillar;

  const displayedDay = actual.dayPillarDateOffset === 0 ? civilDay : nextDay;
  const hourStemDay = actual.hourStemDateOffset === 0 ? civilDay : nextDay;
  assert.ok(displayedDay, `${testCase.id}: next-day Day Pillar evidence required`);
  assert.ok(hourStemDay, `${testCase.id}: next-day hour-stem basis evidence required`);
  assert.equal(displayedDay, testCase.expect.dayPillar, `${testCase.id}: displayed Day Pillar`);
  assert.equal(hourPillarFor(hourStemDay, actual.hourBranch), testCase.expect.hourPillar, `${testCase.id}: Five-Rat hour pillar`);
}

const at23 = fixture.cases.filter((item) => item.clock.hour === 23);
assert.equal(at23.length, 3);
assert.equal(new Set(at23.map((item) => `${item.expect.dayPillar}/${item.expect.hourPillar}`)).size, 3,
  'All three supported late-Zi policies must remain distinguishable at 23:00.');

const at00 = fixture.cases.filter((item) => item.clock.hour === 0);
assert.equal(new Set(at00.map((item) => `${item.expect.dayPillar}/${item.expect.hourPillar}`)).size, 1,
  'All policies converge once the caller supplies the next civil date at 00:00.');
const at01 = fixture.cases.filter((item) => item.clock.hour === 1);
assert.equal(new Set(at01.map((item) => `${item.expect.dayPillar}/${item.expect.hourPillar}`)).size, 1,
  'All policies converge at the 01:00 Chou boundary for the next civil date.');

assert.throws(() => resolveSajuDayBoundaryFrame(24, 0, 'midnight'), /hour must be 0\.\.23/);
assert.throws(() => resolveSajuDayBoundaryFrame(23, 60, 'midnight'), /minute must be 0\.\.59/);
assert.throws(() => resolveSajuDayBoundaryFrame(23, 0, 'unsupported'), /Unsupported Saju day-boundary convention/);

console.log(`Saju day-boundary policy checks passed: ${fixture.cases.length} trusted 23:00/00:00/01:00 convention cases; no universal-school claim.`);
