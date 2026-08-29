import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');
const moduleCache = new Map();

function loadTsModule(relativePath) {
  const fullPath = path.resolve(projectRoot, relativePath);
  if (moduleCache.has(fullPath)) return moduleCache.get(fullPath);
  const source = readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true},
    fileName: fullPath,
    reportDiagnostics: true,
  });
  const errors = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `Transpile error in ${relativePath}: ${errors.map((e) => e.messageText).join('; ')}`);
  const runtimeModule = {exports: {}};
  moduleCache.set(fullPath, runtimeModule.exports);
  const baseRequire = createRequire(fullPath);
  const customRequire = (specifier) => {
    if (specifier.startsWith('.')) {
      const candidateTs = path.resolve(path.dirname(fullPath), specifier.endsWith('.ts') ? specifier : specifier + '.ts');
      if (existsSync(candidateTs)) {
        return loadTsModule(path.relative(projectRoot, candidateTs));
      }
    }
    return baseRequire(specifier);
  };
  const execute = new Function('exports', 'module', 'require', '__filename', '__dirname', transpiled.outputText);
  execute(runtimeModule.exports, runtimeModule, customRequire, fullPath, path.dirname(fullPath));
  return runtimeModule.exports;
}

const inputContracts = loadTsModule('src/lib/saju/input-contracts.ts');
const timezoneRes = loadTsModule('src/lib/saju/timezone-resolution.ts');
const dayBoundary = loadTsModule('src/lib/saju/day-boundary-policy.ts');
const trueSolar = loadTsModule('src/lib/saju/true-solar-time.ts');
const deterministicCore = loadTsModule('src/lib/saju/deterministic-core.ts');

const {
  SAJU_INPUT_CONTRACT_VERSION,
  SAJU_NARRATIVE_PAYLOAD_VERSION,
  normalizeSajuBirthInput,
  getLocalMinuteWindow,
  getSajuCalculationRequirements,
  buildSajuNarrativePayload,
  isExactBirthTime,
  isApproximateBirthTime,
  isUnknownBirthTime,
} = inputContracts;

const {resolveIanaWallClockMinute} = timezoneRes;
const {resolveSajuDayBoundaryFrame} = dayBoundary;
const {resolveTrueSolarClock} = trueSolar;

const {
  SAJU_DETERMINISTIC_CORE_VERSION,
  calculateSajuDeterministic,
  deriveHourPillarStem,
  deriveHourBranchCandidates,
  deriveHourBranchForMinute,
  countPillarElements,
  calculateFiveElementsBreakdown,
  validateNarrativePayloadImmutability,
  STEMS,
  BRANCHES,
} = deterministicCore;

console.log('--- Starting Comprehensive Saju Deterministic Core Tests (20 Criteria) ---');

// 1. standard exact birth time
{
  const input = {
    date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
    time: {precision: 'exact', hour: 14, minute: 30},
    location: {timeZone: 'Asia/Seoul'},
  };
  const result = calculateSajuDeterministic(input);
  assert.equal(result.inputPrecision, 'exact');
  assert.equal(result.scope, 'four-pillars');
  assert.ok(result.pillars.hour);
  assert.equal(result.pillars.hour.branch, '未'); // 14:30 is Wei (未)
  assert.equal(result.candidateHourBranches.length, 1);
  assert.equal(result.candidateHourBranches[0], '未');
  assert.equal(result.provenance.timezoneResolutionState, 'unique');
  console.log('✓ 1. Standard exact birth time passed.');
}

// 2. approximate birth time
{
  // Narrow approximate window within single branch (e.g. 09:15 - 10:45 in Si / 巳)
  const narrowInput = {
    date: {calendar: 'gregorian', year: 1995, month: 4, day: 20},
    time: {precision: 'approximate', startHour: 9, startMinute: 15, endHour: 10, endMinute: 45},
    location: {timeZone: 'Asia/Seoul'},
  };
  const narrowResult = calculateSajuDeterministic(narrowInput);
  assert.equal(narrowResult.inputPrecision, 'approximate');
  assert.equal(narrowResult.scope, 'four-pillars');
  assert.equal(narrowResult.pillars.hour?.branch, '巳');
  assert.equal(narrowResult.candidateHourBranches.length, 1);

  // Broad approximate window across multiple branches (10:00 - 14:00: Si, Wu, Wei)
  const broadInput = {
    date: {calendar: 'gregorian', year: 1995, month: 4, day: 20},
    time: {precision: 'approximate', startHour: 10, startMinute: 0, endHour: 14, endMinute: 0},
    location: {timeZone: 'Asia/Seoul'},
  };
  const broadResult = calculateSajuDeterministic(broadInput);
  assert.equal(broadResult.inputPrecision, 'approximate');
  assert.equal(broadResult.scope, 'three-pillars');
  assert.equal(broadResult.pillars.hour, undefined); // strictly undefined!
  assert.deepEqual(broadResult.candidateHourBranches, ['巳', '午', '未']);
  assert.equal(broadResult.candidateHourPillars.length, 3);
  assert.ok(broadResult.uncertaintyCodes.includes('APPROXIMATE_TIME_MULTI_BRANCH'));
  console.log('✓ 2. Approximate birth time passed (single branch invariant vs multi-branch candidate set).');
}

// 3. unknown birth time
{
  const unknownInput = {
    date: {calendar: 'gregorian', year: 1988, month: 2, day: 4},
    time: {precision: 'unknown'},
  };
  const unknownResult = calculateSajuDeterministic(unknownInput);
  assert.equal(unknownResult.inputPrecision, 'unknown');
  assert.equal(unknownResult.scope, 'three-pillars');
  assert.equal(unknownResult.pillars.hour, undefined);
  assert.equal(unknownResult.candidateHourBranches.length, 12);
  assert.equal(unknownResult.candidateHourPillars.length, 12);
  assert.ok(unknownResult.uncertaintyCodes.includes('UNKNOWN_BIRTH_TIME'));
  assert.ok(unknownResult.provenance.unavailableReasons.hourPillar);
  console.log('✓ 3. Unknown birth time passed (strictly three-pillars, 12 candidates, no fabricated hour).');
}

// 4. DST ambiguous wall clock
{
  // 2024-11-03 01:30 in America/New_York (fall-back hour repeats)
  const dstAmbiguousInput = {
    date: {calendar: 'gregorian', year: 2024, month: 11, day: 3},
    time: {precision: 'exact', hour: 1, minute: 30},
    location: {timeZone: 'America/New_York'},
  };
  const dstAmbiguousResult = calculateSajuDeterministic(dstAmbiguousInput);
  assert.equal(dstAmbiguousResult.provenance.timezoneResolutionState, 'ambiguous');
  assert.ok(dstAmbiguousResult.uncertaintyCodes.includes('DST_AMBIGUOUS_WALL_CLOCK'));
  console.log('✓ 4. DST ambiguous wall clock passed.');
}

// 5. DST nonexistent wall clock
{
  // 2024-03-10 02:30 in America/New_York (spring-forward gap)
  const dstNonexistentInput = {
    date: {calendar: 'gregorian', year: 2024, month: 3, day: 10},
    time: {precision: 'exact', hour: 2, minute: 30},
    location: {timeZone: 'America/New_York'},
  };
  const dstNonexistentResult = calculateSajuDeterministic(dstNonexistentInput);
  assert.equal(dstNonexistentResult.provenance.timezoneResolutionState, 'nonexistent');
  assert.ok(dstNonexistentResult.uncertaintyCodes.includes('DST_NONEXISTENT_WALL_CLOCK'));
  assert.equal(dstNonexistentResult.pillars.hour, undefined);
  assert.equal(dstNonexistentResult.scope, 'ambiguous');
  console.log('✓ 5. DST nonexistent wall clock passed (not silently shifted).');
}

// 6. missing timezone
{
  const missingTzInput = {
    date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
    time: {precision: 'exact', hour: 14, minute: 30},
  };
  const missingTzResult = calculateSajuDeterministic(missingTzInput);
  assert.equal(missingTzResult.provenance.timezoneResolutionState, 'insufficient-input');
  assert.ok(missingTzResult.uncertaintyCodes.includes('TIMEZONE_REQUIRED_FOR_CLOCK'));
  console.log('✓ 6. Missing timezone for exact clock passed.');
}

// 7. invalid IANA timezone
{
  assert.throws(
    () => calculateSajuDeterministic({
      date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
      time: {precision: 'exact', hour: 14, minute: 30},
      location: {timeZone: 'Invalid/Non_Existent_Timezone'},
    }),
    /Invalid IANA time zone/,
  );
  console.log('✓ 7. Invalid IANA timezone fails explicitly.');
}

// 8. date boundary
{
  // 23:59 minute 1439
  const lastMinute = {
    date: {calendar: 'gregorian', year: 2024, month: 12, day: 31},
    time: {precision: 'exact', hour: 23, minute: 59},
    location: {timeZone: 'Asia/Seoul'},
    policy: {dayBoundary: 'midnight'},
  };
  const lastResult = calculateSajuDeterministic(lastMinute);
  assert.equal(lastResult.pillars.hour?.branch, '子'); // Zi hour
  console.log('✓ 8. Date boundary (23:59) passed.');
}

// 9. midnight
{
  // 00:00 minute 0
  const midnightInput = {
    date: {calendar: 'gregorian', year: 2025, month: 1, day: 1},
    time: {precision: 'exact', hour: 0, minute: 0},
    location: {timeZone: 'Asia/Seoul'},
    policy: {dayBoundary: 'midnight'},
  };
  const midnightResult = calculateSajuDeterministic(midnightInput);
  assert.equal(midnightResult.pillars.hour?.branch, '子');
  assert.equal(midnightResult.scope, 'four-pillars');
  console.log('✓ 9. Midnight (00:00) passed.');
}

// 10. transition boundary
{
  // Exactly 23:00 boundary
  const jasiTransition = {
    date: {calendar: 'gregorian', year: 2024, month: 5, day: 1},
    time: {precision: 'exact', hour: 23, minute: 0},
    location: {timeZone: 'Asia/Seoul'},
    policy: {dayBoundary: 'jasi'},
  };
  const jasiResult = calculateSajuDeterministic(jasiTransition);
  assert.equal(jasiResult.pillars.hour?.branch, '子');
  assert.ok(jasiResult.provenance.appliedRules.some((r) => r.ruleId === 'rule-day-boundary-jasi'));
  console.log('✓ 10. Transition boundary (23:00 Zi switch) passed.');
}

// 11. same absolute instant represented by different timezones
{
  // Instant: 2024-03-09T17:30:00Z
  // In Asia/Seoul (UTC+9): 2024-03-10 02:30
  // In UTC (UTC+0): 2024-03-09 17:30
  const seoulRes = resolveIanaWallClockMinute({year: 2024, month: 3, day: 10, hour: 2, minute: 30}, 'Asia/Seoul');
  const utcRes = resolveIanaWallClockMinute({year: 2024, month: 3, day: 9, hour: 17, minute: 30}, 'UTC');
  assert.equal(seoulRes.status, 'unique');
  assert.equal(utcRes.status, 'unique');
  assert.equal(seoulRes.candidates[0].instantIso, utcRes.candidates[0].instantIso);
  assert.equal(seoulRes.candidates[0].epochMilliseconds, utcRes.candidates[0].epochMilliseconds);
  console.log('✓ 11. Same absolute instant represented in different timezones matches perfectly.');
}

// 12. identical input produces deterministic identical output
{
  const inputA = {
    date: {calendar: 'gregorian', year: 1993, month: 8, day: 25},
    time: {precision: 'exact', hour: 16, minute: 45},
    location: {timeZone: 'America/Chicago'},
    policy: {dayBoundary: 'splitJasi', solarTimeMode: 'civil'},
  };
  const res1 = calculateSajuDeterministic(inputA);
  const res2 = calculateSajuDeterministic(inputA);
  assert.deepEqual(res1, res2);
  console.log('✓ 12. Identical input produces bit-identical deterministic output.');
}

// 13. approximate input cannot silently resolve time-dependent result
{
  const multiBranchApprox = {
    date: {calendar: 'gregorian', year: 2000, month: 7, day: 10},
    time: {precision: 'approximate', startHour: 8, startMinute: 0, endHour: 12, endMinute: 0},
    location: {timeZone: 'Asia/Tokyo'},
  };
  const result = calculateSajuDeterministic(multiBranchApprox);
  assert.equal(result.pillars.hour, undefined);
  assert.equal(result.scope, 'three-pillars');
  assert.deepEqual(result.candidateHourBranches, ['辰', '巳', '午']);
  console.log('✓ 13. Approximate multi-branch input cannot silently resolve hour pillar.');
}

// 14. unknown input cannot resolve hour-dependent result
{
  const unknownInput = {
    date: {calendar: 'gregorian', year: 1999, month: 11, day: 11},
    time: {precision: 'unknown'},
  };
  const result = calculateSajuDeterministic(unknownInput);
  assert.equal(result.pillars.hour, undefined);
  assert.equal(result.scope, 'three-pillars');
  assert.equal(result.candidateHourPillars.length, 12);
  console.log('✓ 14. Unknown input strictly omits hour pillar.');
}

// 15. candidate ordering deterministic
{
  const input = {
    date: {calendar: 'gregorian', year: 2005, month: 3, day: 15},
    time: {precision: 'unknown'},
  };
  const res = calculateSajuDeterministic(input);
  const branchOrder = res.candidateHourBranches;
  assert.deepEqual(branchOrder, ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']);
  console.log('✓ 15. Candidate ordering is strictly chronological & deterministic.');
}

// 16. nonexistent time not silently shifted
{
  const nonexistent = resolveIanaWallClockMinute({year: 2024, month: 3, day: 10, hour: 2, minute: 30}, 'America/New_York');
  assert.equal(nonexistent.status, 'nonexistent');
  assert.equal(nonexistent.candidates.length, 0);
  assert.equal(nonexistent.wallClock.hour, 2);
  assert.equal(nonexistent.wallClock.minute, 30);
  console.log('✓ 16. Nonexistent wall clock is not silently shifted to 03:30.');
}

// 17. ambiguous time not silently assigned an offset
{
  const ambiguous = resolveIanaWallClockMinute({year: 2024, month: 11, day: 3, hour: 1, minute: 30}, 'America/New_York');
  assert.equal(ambiguous.status, 'ambiguous');
  assert.equal(ambiguous.candidates.length, 2);
  assert.equal(ambiguous.candidates[0].utcOffsetMinutes, -240); // EDT
  assert.equal(ambiguous.candidates[1].utcOffsetMinutes, -300); // EST
  console.log('✓ 17. Ambiguous wall clock returns all candidate offsets without picking one.');
}

// 18. invalid input explicit failure
{
  // Feb 30 Gregorian
  assert.throws(
    () => normalizeSajuBirthInput({
      date: {calendar: 'gregorian', year: 2024, month: 2, day: 30},
      time: {precision: 'unknown'},
    }),
    /Invalid Gregorian birth date/,
  );

  // Month 13
  assert.throws(
    () => normalizeSajuBirthInput({
      date: {calendar: 'gregorian', year: 2024, month: 13, day: 1},
      time: {precision: 'unknown'},
    }),
    /month must be an integer from 1 to 12/,
  );

  // Approximate start >= end
  assert.throws(
    () => normalizeSajuBirthInput({
      date: {calendar: 'gregorian', year: 2024, month: 5, day: 1},
      time: {precision: 'approximate', startHour: 15, startMinute: 0, endHour: 14, endMinute: 0},
    }),
    /Approximate birth-time interval must stay within one local birth date and start before it ends/,
  );

  console.log('✓ 18. Invalid inputs fail explicitly and safely.');
}

// 19. narrative payload excludes unnecessary raw birth data
{
  const summary = calculateSajuDeterministic({
    date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
    time: {precision: 'exact', hour: 14, minute: 30},
    location: {timeZone: 'Asia/Seoul', placeLabel: 'Secret Hospital, Gangnam', longitude: 127.0276},
  });
  summary.rawBirthDate = '1990-06-15';
  summary.rawBirthTime = '14:30';
  summary.userRealName = 'John Doe';
  summary.userEmail = 'john@example.com';

  const narrativePayload = buildSajuNarrativePayload(summary);
  const serialized = JSON.stringify(narrativePayload);

  for (const forbidden of [
    'Secret Hospital',
    'Gangnam',
    'John Doe',
    'john@example.com',
    'rawBirthDate',
    'rawBirthTime',
    'userRealName',
    'userEmail',
  ]) {
    assert.equal(serialized.includes(forbidden), false, `Narrative payload leaked: ${forbidden}`);
  }
  console.log('✓ 19. Narrative payload strips all raw PII.');
}

// 20. deterministic output cannot be overwritten by narrative adapter
{
  const summary = calculateSajuDeterministic({
    date: {calendar: 'gregorian', year: 1990, month: 6, day: 15},
    time: {precision: 'exact', hour: 14, minute: 30},
    location: {timeZone: 'Asia/Seoul'},
  });
  const narrativePayload = buildSajuNarrativePayload(summary);
  assert.equal(validateNarrativePayloadImmutability(summary, narrativePayload), true);

  // Attempted tampering
  const tamperedPayload = JSON.parse(JSON.stringify(narrativePayload));
  tamperedPayload.pillars.year = {stem: '庚', branch: '申'};
  assert.equal(validateNarrativePayloadImmutability(summary, tamperedPayload), false);
  console.log('✓ 20. Narrative adapter cannot overwrite deterministic output.');
}

// 21. Property / Invariant tests
{
  // Test Five Rats Formula for all 10 Stems and 12 Branches (120 combinations)
  for (let s = 0; s < 10; s++) {
    const dayStem = STEMS[s];
    for (let b = 0; b < 12; b++) {
      const branch = BRANCHES[b];
      const hourStem = deriveHourPillarStem(dayStem, branch);
      assert.ok(STEMS.includes(hourStem));
      const expectedStemIndex = ((s % 5) * 2 + b) % 10;
      assert.equal(hourStem, STEMS[expectedStemIndex]);
    }
  }

  // Test Five Elements Range Bounds Invariants
  const basePillars = [
    {stem: '甲', branch: '寅'}, // wood + wood
    {stem: '丙', branch: '午'}, // fire + fire
    {stem: '戊', branch: '辰'}, // earth + earth
  ];
  const candidates = [
    {stem: '庚', branch: '申'}, // metal + metal
    {stem: '壬', branch: '子'}, // water + water
  ];
  const breakdown = calculateFiveElementsBreakdown(basePillars, candidates);
  assert.equal(breakdown.invariantBase.wood, 2);
  assert.equal(breakdown.invariantBase.fire, 2);
  assert.equal(breakdown.invariantBase.earth, 2);
  assert.equal(breakdown.invariantBase.metal, 0);
  assert.equal(breakdown.invariantBase.water, 0);
  assert.deepEqual(breakdown.candidateRanges.wood, {min: 2, max: 2});
  assert.deepEqual(breakdown.candidateRanges.metal, {min: 0, max: 2});
  assert.deepEqual(breakdown.candidateRanges.water, {min: 0, max: 2});

  console.log('✓ 21. Mathematical property and invariant tests passed.');
}

console.log('=== All 20+ Saju Deterministic Core Tests PASSED! ===');
