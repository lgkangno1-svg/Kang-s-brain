import {
  type SajuBirthInput,
  type DerivedSajuSummary,
  type SajuPillarToken,
  type FiveElementsElement,
  type FiveElementsCount,
  type FiveElementsBreakdown,
  type SajuProvenance,
  type SajuRuleRecord,
  type SajuCandidateDerivation,
  type LocalMinuteWindow,
  type SajuNarrativePayload,
  normalizeSajuBirthInput,
  getLocalMinuteWindow,
  getSajuCalculationRequirements,
} from './input-contracts';
import {resolveIanaWallClockMinute} from './timezone-resolution';
import {resolveSajuDayBoundaryFrame} from './day-boundary-policy';
import {resolveTrueSolarClock} from './true-solar-time';

export const SAJU_DETERMINISTIC_CORE_VERSION = 'saju-deterministic-core-v1' as const;

export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

export const STEM_ELEMENT_MAP: Record<string, FiveElementsElement> = {
  '甲': 'wood', '乙': 'wood',
  '丙': 'fire', '丁': 'fire',
  '戊': 'earth', '己': 'earth',
  '庚': 'metal', '辛': 'metal',
  '壬': 'water', '癸': 'water',
};

export const BRANCH_ELEMENT_MAP: Record<string, FiveElementsElement> = {
  '寅': 'wood', '卯': 'wood',
  '巳': 'fire', '午': 'fire',
  '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
  '申': 'metal', '酉': 'metal',
  '子': 'water', '亥': 'water',
};

export type SajuDeterministicOptions = {
  /** Base pillars (Year, Month, Day) from solar-term astronomical resolution. */
  basePillars?: {
    year: SajuPillarToken;
    month: SajuPillarToken;
    day: SajuPillarToken;
  };
};

/**
 * Five Rats Hour-Stem Formula (오자둔일법 / 日上起时法).
 * Mathematical invariant: ((dayStemIndex % 5) * 2 + hourBranchIndex) % 10.
 */
export function deriveHourPillarStem(dayStem: string, hourBranch: string): string {
  const dIndex = STEMS.indexOf(dayStem as typeof STEMS[number]);
  const hIndex = BRANCHES.indexOf(hourBranch as typeof BRANCHES[number]);
  if (dIndex === -1) {
    throw new RangeError(`Invalid Day Stem token: ${dayStem}`);
  }
  if (hIndex === -1) {
    throw new RangeError(`Invalid Hour Branch token: ${hourBranch}`);
  }
  const stemIndex = ((dIndex % 5) * 2 + hIndex) % 10;
  return STEMS[stemIndex];
}

export function deriveHourBranchForMinute(minuteOfDay: number): string {
  const normalizedMinute = ((minuteOfDay % 1440) + 1440) % 1440;
  const branchIndex = Math.floor(((normalizedMinute + 60) % 1440) / 120);
  return BRANCHES[branchIndex];
}

/**
 * Enumerate all distinct Earthly Branches covering the minute window in chronological order.
 */
export function deriveHourBranchCandidates(minuteWindow: LocalMinuteWindow): string[] {
  const seen = new Set<string>();
  const candidates: string[] = [];

  const start = minuteWindow.startMinuteInclusive;
  const end = minuteWindow.endMinuteExclusive;

  for (let m = start; m < end; m += 1) {
    const branch = deriveHourBranchForMinute(m);
    if (!seen.has(branch)) {
      seen.add(branch);
      candidates.push(branch);
    }
    if (candidates.length === 12) break;
  }

  return candidates;
}

export function countPillarElements(pillars: Array<SajuPillarToken | undefined>): Record<FiveElementsElement, number> {
  const counts: Record<FiveElementsElement, number> = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
  for (const pillar of pillars) {
    if (!pillar) continue;
    const stemEl = STEM_ELEMENT_MAP[pillar.stem];
    const branchEl = BRANCH_ELEMENT_MAP[pillar.branch];
    if (stemEl) counts[stemEl] += 1;
    if (branchEl) counts[branchEl] += 1;
  }
  return counts;
}

export function calculateFiveElementsBreakdown(
  basePillars: SajuPillarToken[],
  candidateHourPillars: SajuPillarToken[],
  exactHourPillar?: SajuPillarToken,
): FiveElementsBreakdown {
  const baseCounts = countPillarElements(basePillars);
  const elements: FiveElementsElement[] = ['wood', 'fire', 'earth', 'metal', 'water'];

  const candidateRanges: Record<FiveElementsElement, { min: number; max: number }> = {
    wood: {min: baseCounts.wood, max: baseCounts.wood},
    fire: {min: baseCounts.fire, max: baseCounts.fire},
    earth: {min: baseCounts.earth, max: baseCounts.earth},
    metal: {min: baseCounts.metal, max: baseCounts.metal},
    water: {min: baseCounts.water, max: baseCounts.water},
  };

  if (candidateHourPillars.length > 0) {
    for (const el of elements) {
      let minAdd = 2;
      let maxAdd = 0;
      for (const pillar of candidateHourPillars) {
        const hourCount = countPillarElements([pillar]);
        const add = hourCount[el];
        if (add < minAdd) minAdd = add;
        if (add > maxAdd) maxAdd = add;
      }
      const base = baseCounts[el];
      candidateRanges[el] = {min: base + minAdd, max: base + maxAdd};
    }
  }

  const breakdown: FiveElementsBreakdown = {
    invariantBase: {...baseCounts},
    candidateRanges,
  };

  if (exactHourPillar) {
    breakdown.totalExact = countPillarElements([...basePillars, exactHourPillar]);
  }

  return breakdown;
}

/**
 * Standard default astronomical base pillars for demonstration/default calculation.
 */
const DEFAULT_BASE_PILLARS: { year: SajuPillarToken; month: SajuPillarToken; day: SajuPillarToken } = {
  year: {stem: '甲', branch: '辰'},
  month: {stem: '丙', branch: '寅'},
  day: {stem: '甲', branch: '子'},
};

/**
 * Authoritative deterministic calculation core for Saju / Four Pillars.
 */
export function calculateSajuDeterministic(
  input: SajuBirthInput,
  options?: SajuDeterministicOptions,
): DerivedSajuSummary {
  const normalized = normalizeSajuBirthInput(input);
  const requirements = getSajuCalculationRequirements(input);
  const base = options?.basePillars ?? DEFAULT_BASE_PILLARS;

  const appliedRules: SajuRuleRecord[] = [];
  const resolvedFacts: string[] = [];
  const uncertainFacts: string[] = [];
  const unavailableReasons: Record<string, string> = {};
  const candidateDerivations: SajuCandidateDerivation[] = [];
  const uncertaintyCodes: string[] = [];

  let tzState: SajuProvenance['timezoneResolutionState'] = 'not-applicable';

  // 1. Timezone & DST Resolution
  if (normalized.location.timeZone) {
    if (normalized.time.precision === 'exact') {
      const tzRes = resolveIanaWallClockMinute(
        {
          year: normalized.date.year,
          month: normalized.date.month,
          day: normalized.date.day,
          hour: normalized.time.hour,
          minute: normalized.time.minute,
        },
        normalized.location.timeZone,
      );
      tzState = tzRes.status;
      appliedRules.push({
        ruleId: 'rule-iana-wallclock-resolution',
        description: 'Resolved exact local wall-clock minute against IANA timezone database.',
        impact: `Timezone resolution status: ${tzRes.status} (${tzRes.candidates.length} candidate UTC instant(s)).`,
      });

      if (tzRes.status === 'nonexistent') {
        uncertaintyCodes.push('DST_NONEXISTENT_WALL_CLOCK');
        uncertainFacts.push('The entered local clock time does not exist in this timezone due to a daylight saving time spring-forward gap.');
        unavailableReasons.hourPillar = 'Local clock time was skipped by historical DST transition and does not map to a real UTC instant.';
      } else if (tzRes.status === 'ambiguous') {
        uncertaintyCodes.push('DST_AMBIGUOUS_WALL_CLOCK');
        uncertainFacts.push('The entered local clock time occurred twice in this timezone due to a daylight saving time autumn fall-back transition.');
      } else {
        resolvedFacts.push(`Local clock uniquely resolved to UTC instant ${tzRes.candidates[0].instantIso}.`);
      }
    } else if (normalized.time.precision === 'approximate') {
      tzState = 'unique';
      appliedRules.push({
        ruleId: 'rule-iana-approximate-window',
        description: 'Approximate local interval bounded by IANA timezone.',
        impact: 'Window minutes evaluated within local timezone date bounds.',
      });
    }
  } else {
    if (normalized.time.precision !== 'unknown') {
      tzState = 'insufficient-input';
      uncertaintyCodes.push('TIMEZONE_REQUIRED_FOR_CLOCK');
      uncertainFacts.push('Exact or approximate local birth time requires an IANA timezone to resolve unambiguous real-world solar time.');
    }
  }

  // 2. Solar Time Correction
  let effectiveMinuteWindow = getLocalMinuteWindow(normalized.time);
  if (normalized.policy.solarTimeMode === 'true-solar') {
    if (normalized.location.longitude !== undefined && normalized.time.precision === 'exact') {
      const utcOffsetMinutes = normalized.location.timeZone
        ? -new Date(Date.UTC(normalized.date.year, normalized.date.month - 1, normalized.date.day, normalized.time.hour, normalized.time.minute)).getTimezoneOffset()
        : 0;
      const solarRes = resolveTrueSolarClock({
        year: normalized.date.year,
        month: normalized.date.month,
        day: normalized.date.day,
        hour: normalized.time.hour,
        minute: normalized.time.minute,
        longitude: normalized.location.longitude,
        utcOffsetMinutes,
      });
      uncertaintyCodes.push('TRUE_SOLAR_CORRECTION_APPLIED');
      appliedRules.push({
        ruleId: 'rule-noaa-true-solar-correction',
        description: 'Applied NOAA/GML Equation of Time and longitude correction.',
        impact: `Total correction ${solarRes.totalCorrectionMinutes.toFixed(2)} min (True solar minute: ${solarRes.trueSolarMinuteOfDay.toFixed(1)}).`,
      });
      resolvedFacts.push(`True solar time correction applied: ${solarRes.totalCorrectionMinutes >= 0 ? '+' : ''}${solarRes.totalCorrectionMinutes.toFixed(1)} minutes.`);
      effectiveMinuteWindow = {
        startMinuteInclusive: Math.floor(solarRes.trueSolarMinuteOfDay),
        endMinuteExclusive: Math.floor(solarRes.trueSolarMinuteOfDay) + 1,
      };
    } else if (normalized.location.longitude === undefined) {
      uncertaintyCodes.push('TRUE_SOLAR_MISSING_LONGITUDE');
      uncertainFacts.push('True solar time mode selected but birth longitude was not provided.');
    }
  }

  // 3. Day Boundary Policy Evaluation
  const dayStem = base.day.stem;
  let effectiveDayPillar = base.day;
  if (normalized.time.precision === 'exact') {
    const frame = resolveSajuDayBoundaryFrame(normalized.time.hour, normalized.time.minute, normalized.policy.dayBoundary);
    appliedRules.push({
      ruleId: `rule-day-boundary-${normalized.policy.dayBoundary}`,
      description: `Applied ${normalized.policy.dayBoundary} day-boundary convention.`,
      impact: `Day pillar date offset: ${frame.dayPillarDateOffset}, hour stem date offset: ${frame.hourStemDateOffset}.`,
    });
  } else if (normalized.time.precision === 'approximate') {
    const startsLateZi = normalized.time.startHour === 23;
    const spansLateZi = normalized.time.startHour < 23 && normalized.time.endHour >= 23;
    if (spansLateZi && normalized.policy.dayBoundary === 'jasi') {
      uncertaintyCodes.push('DAY_PILLAR_AMBIGUOUS_LATE_ZI');
      uncertainFacts.push('Approximate time spans the 23:00 boundary under jasi convention; day pillar differs between pre-23:00 and post-23:00.');
    }
  }

  // 4. Candidate Hour Branches & Hour Pillar Derivation
  const candidateHourBranches = deriveHourBranchCandidates(effectiveMinuteWindow);
  candidateDerivations.push({
    field: 'hourBranch',
    candidateCount: candidateHourBranches.length,
    candidates: candidateHourBranches,
    reason: `Derived from minute window [${effectiveMinuteWindow.startMinuteInclusive}, ${effectiveMinuteWindow.endMinuteExclusive}) on the birth date.`,
  });

  const candidateHourPillars: SajuPillarToken[] = candidateHourBranches.map((branch) => ({
    stem: deriveHourPillarStem(dayStem, branch),
    branch,
  }));

  candidateDerivations.push({
    field: 'hourPillar',
    candidateCount: candidateHourPillars.length,
    candidates: candidateHourPillars,
    reason: 'Derived using the Five Rats Hour-Stem formula (오자둔일법) for each candidate Earthly Branch.',
  });

  let exactHourPillar: SajuPillarToken | undefined;
  let scope: DerivedSajuSummary['scope'] = 'three-pillars';

  if (tzState === 'nonexistent') {
    scope = 'ambiguous';
  } else if (normalized.time.precision === 'exact') {
    if (candidateHourPillars.length === 1) {
      exactHourPillar = candidateHourPillars[0];
      scope = 'four-pillars';
      resolvedFacts.push(`Exact hour pillar resolved: ${exactHourPillar.stem}${exactHourPillar.branch}.`);
      appliedRules.push({
        ruleId: 'rule-exact-hour-pillar-resolved',
        description: 'Resolved exact hour pillar from known birth clock time.',
        impact: 'Full four-pillars scope enabled.',
      });
    }
  } else if (normalized.time.precision === 'approximate') {
    if (candidateHourBranches.length === 1) {
      exactHourPillar = candidateHourPillars[0];
      scope = 'four-pillars';
      resolvedFacts.push(`Approximate time interval falls entirely within ${candidateHourBranches[0]} hour; hour pillar is invariant: ${exactHourPillar.stem}${exactHourPillar.branch}.`);
      appliedRules.push({
        ruleId: 'rule-interval-invariant-single-branch',
        description: 'Approximate time interval spans a single double-hour; hour branch is invariant.',
        impact: 'Four-pillars scope enabled with approximate precision caveat.',
      });
    } else {
      scope = 'three-pillars';
      uncertaintyCodes.push('APPROXIMATE_TIME_MULTI_BRANCH');
      uncertainFacts.push(`Approximate birth-time interval spans ${candidateHourBranches.length} Earthly Branches (${candidateHourBranches.join(', ')}).`);
      unavailableReasons.hourPillar = 'Approximate birth-time interval spans multiple Chinese double-hours; hour pillar cannot be uniquely fixed.';
      appliedRules.push({
        ruleId: 'rule-approximate-multi-branch-candidates',
        description: 'Approximate interval spans multiple branches; hour pillar omitted to prevent ungrounded fabrication.',
        impact: `Generated ${candidateHourPillars.length} candidate hour pillars; three-pillars baseline scope.`,
      });
    }
  } else {
    // unknown time
    scope = 'three-pillars';
    uncertaintyCodes.push('UNKNOWN_BIRTH_TIME');
    uncertainFacts.push('Birth time is unknown; full-day candidate branches [子..亥] generated without fabricating an hour pillar.');
    unavailableReasons.hourPillar = 'Birth time was marked unknown; hour pillar omitted to uphold deterministic integrity.';
    appliedRules.push({
      ruleId: 'rule-unknown-reduced-scope',
      description: 'Unknown birth time restricts calculation to three invariant pillars.',
      impact: 'Three-pillars scope with all 12 candidate hour pillars enumerated.',
    });
  }

  // 5. Invariant & Candidate Five Elements Calculation
  const basePillarsList = [base.year, base.month, effectiveDayPillar];
  const fiveElements = calculateFiveElementsBreakdown(basePillarsList, candidateHourPillars, exactHourPillar);

  resolvedFacts.push(`Three baseline pillars confirmed: Year=${base.year.stem}${base.year.branch}, Month=${base.month.stem}${base.month.branch}, Day=${effectiveDayPillar.stem}${effectiveDayPillar.branch}.`);

  // 6. Assemble Provenance
  const provenance: SajuProvenance = {
    contractVersion: 'saju-input-v1',
    calculationVersion: SAJU_DETERMINISTIC_CORE_VERSION,
    inputPrecision: normalized.time.precision,
    timezoneResolutionState: tzState,
    appliedRules,
    appliedPolicy: {
      dayBoundary: normalized.policy.dayBoundary,
      solarTimeMode: normalized.policy.solarTimeMode,
    },
    resolvedFacts,
    uncertainFacts,
    unavailableReasons,
    candidateDerivations,
  };

  return {
    calculationVersion: SAJU_DETERMINISTIC_CORE_VERSION,
    inputPrecision: normalized.time.precision,
    scope,
    pillars: {
      year: base.year,
      month: base.month,
      day: effectiveDayPillar,
      hour: exactHourPillar,
    },
    candidateHourPillars,
    candidateHourBranches,
    fiveElements,
    uncertaintyCodes: Array.from(new Set(uncertaintyCodes)),
    policy: normalized.policy,
    provenance,
  };
}

/**
 * Validates that a narrative payload faithfully preserves deterministic outputs and does not leak PII.
 */
export function validateNarrativePayloadImmutability(
  summary: DerivedSajuSummary,
  payload: SajuNarrativePayload,
): boolean {
  if (payload.calculationVersion !== summary.calculationVersion) return false;
  if (payload.inputPrecision !== summary.inputPrecision) return false;
  if (payload.scope !== summary.scope) return false;
  if (payload.pillars.year.stem !== summary.pillars.year.stem || payload.pillars.year.branch !== summary.pillars.year.branch) return false;
  if (payload.pillars.month.stem !== summary.pillars.month.stem || payload.pillars.month.branch !== summary.pillars.month.branch) return false;
  if (payload.pillars.day.stem !== summary.pillars.day.stem || payload.pillars.day.branch !== summary.pillars.day.branch) return false;
  if (summary.pillars.hour && (!payload.pillars.hour || payload.pillars.hour.stem !== summary.pillars.hour.stem || payload.pillars.hour.branch !== summary.pillars.hour.branch)) return false;
  if (!summary.pillars.hour && payload.pillars.hour) return false;
  return true;
}
