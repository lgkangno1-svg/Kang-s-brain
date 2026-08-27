import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, '..', 'src', 'lib', 'saju', 'input-contracts.ts');
const source = readFileSync(sourcePath, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2022,
    strict: true,
  },
  fileName: sourcePath,
  reportDiagnostics: true,
});

const errors = (transpiled.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
assert.equal(errors.length, 0, `TypeScript transpile diagnostics: ${errors.map((item) => item.messageText).join('; ')}`);

const runtimeModule = {exports: {}};
const execute = new Function('exports', 'module', 'require', '__filename', '__dirname', transpiled.outputText);
execute(runtimeModule.exports, runtimeModule, require, sourcePath, path.dirname(sourcePath));

const {
  SAJU_INPUT_CONTRACT_VERSION,
  SAJU_NARRATIVE_PAYLOAD_VERSION,
  normalizeSajuBirthInput,
  getLocalMinuteWindow,
  getSajuCalculationRequirements,
  buildSajuNarrativePayload,
} = runtimeModule.exports;

assert.equal(SAJU_INPUT_CONTRACT_VERSION, 'saju-input-v1');
assert.equal(SAJU_NARRATIVE_PAYLOAD_VERSION, 'saju-derived-v1');

const exact = normalizeSajuBirthInput({
  date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
  time: {precision: 'exact', hour: 14, minute: 30},
  location: {timeZone: 'Asia/Seoul', placeLabel: 'Seoul'},
});
assert.deepEqual(getLocalMinuteWindow(exact.time), {startMinuteInclusive: 870, endMinuteExclusive: 871});
assert.equal(exact.date.isLeapMonth, false);
assert.equal(exact.policy.dayBoundary, 'midnight');
assert.equal(exact.policy.solarTimeMode, 'civil');

const exactRequirements = getSajuCalculationRequirements({
  date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
  time: {precision: 'exact', hour: 14, minute: 30},
  location: {timeZone: 'Asia/Seoul'},
});
assert.equal(exactRequirements.timeZone, 'required');
assert.equal(exactRequirements.canCalculateFullScope, true);
assert.deepEqual(exactRequirements.missingRequired, []);

const approximate = normalizeSajuBirthInput({
  date: {calendar: 'gregorian', year: 2001, month: 9, day: 9},
  time: {precision: 'approximate', startHour: 6, startMinute: 0, endHour: 10, endMinute: 0},
  location: {timeZone: 'Asia/Bangkok'},
});
assert.deepEqual(getLocalMinuteWindow(approximate.time), {startMinuteInclusive: 360, endMinuteExclusive: 600});

const unknown = normalizeSajuBirthInput({
  date: {calendar: 'gregorian', year: 1988, month: 2, day: 4},
  time: {precision: 'unknown'},
});
assert.deepEqual(getLocalMinuteWindow(unknown.time), {startMinuteInclusive: 0, endMinuteExclusive: 1440});
const unknownRequirements = getSajuCalculationRequirements(unknown);
assert.equal(unknownRequirements.timeZone, 'conditional');
assert.equal(unknownRequirements.canCalculateFullScope, false);
assert.equal(unknownRequirements.canCalculateReducedScope, true);
assert.ok(unknownRequirements.reasons.some((reason) => reason.includes('never receives a guessed hour pillar')));

const trueSolarMissingLongitude = getSajuCalculationRequirements({
  date: {calendar: 'gregorian', year: 1999, month: 12, day: 31},
  time: {precision: 'exact', hour: 23, minute: 20},
  location: {timeZone: 'America/Los_Angeles'},
  policy: {solarTimeMode: 'true-solar'},
});
assert.equal(trueSolarMissingLongitude.longitude, 'required');
assert.deepEqual(trueSolarMissingLongitude.missingRequired, ['longitude']);
assert.equal(trueSolarMissingLongitude.canCalculateFullScope, false);

const trueSolarReady = getSajuCalculationRequirements({
  date: {calendar: 'gregorian', year: 1999, month: 12, day: 31},
  time: {precision: 'exact', hour: 23, minute: 20},
  location: {timeZone: 'America/Los_Angeles', longitude: -118.2437},
  policy: {solarTimeMode: 'true-solar', dayBoundary: 'jasi'},
});
assert.deepEqual(trueSolarReady.missingRequired, []);
assert.equal(trueSolarReady.canCalculateFullScope, true);

assert.throws(
  () => normalizeSajuBirthInput({
    date: {calendar: 'gregorian', year: 2000, month: 1, day: 1},
    time: {precision: 'approximate', startHour: 22, startMinute: 0, endHour: 2, endMinute: 0},
  }),
  /must stay within one local birth date/,
);
assert.throws(
  () => normalizeSajuBirthInput({
    date: {calendar: 'gregorian', year: 2026, month: 2, day: 30},
    time: {precision: 'unknown'},
  }),
  /Invalid Gregorian birth date/,
);
assert.throws(
  () => normalizeSajuBirthInput({
    date: {calendar: 'gregorian', year: 2000, month: 1, day: 1},
    time: {precision: 'exact', hour: 12, minute: 0},
    location: {timeZone: 'Not/AZone'},
  }),
  /Invalid IANA time zone/,
);

const lunar = normalizeSajuBirthInput({
  date: {calendar: 'lunar', year: 1995, month: 8, day: 15, isLeapMonth: false},
  time: {precision: 'unknown'},
});
assert.equal(lunar.date.calendar, 'lunar');
assert.equal(lunar.date.isLeapMonth, false);

const narrativeSource = {
  calculationVersion: 'fixture-engine-1',
  inputPrecision: 'unknown',
  scope: 'three-pillars',
  pillars: {
    year: {stem: '甲', branch: '子'},
    month: {stem: '乙', branch: '丑'},
    day: {stem: '丙', branch: '寅'},
  },
  candidateHourPillars: [{stem: '丁', branch: '卯'}],
  fiveElements: {wood: 2, fire: 1, earth: 1, metal: 0, water: 2},
  uncertaintyCodes: ['UNKNOWN_BIRTH_TIME', 'UNKNOWN_BIRTH_TIME', ''],
  policy: {dayBoundary: 'midnight', solarTimeMode: 'civil'},
  birthDate: '1990-06-15',
  birthTime: 'unknown',
  city: 'Seoul',
  timeZone: 'Asia/Seoul',
  name: 'private-name',
  accountId: 'private-account',
};
const narrative = buildSajuNarrativePayload(narrativeSource);
assert.equal(narrative.payloadVersion, 'saju-derived-v1');
assert.deepEqual(narrative.uncertaintyCodes, ['UNKNOWN_BIRTH_TIME']);
assert.equal(narrative.pillars.hour, undefined);
const serializedNarrative = JSON.stringify(narrative);
for (const forbidden of ['birthDate', 'birthTime', 'city', 'timeZone', 'private-name', 'private-account', 'accountId']) {
  assert.equal(serializedNarrative.includes(forbidden), false, `Narrative payload leaked raw field/value: ${forbidden}`);
}

console.log('Saju input contract checks passed: exact / approximate / unknown, timezone/longitude gates, no guessed hour, raw-field stripping.');
