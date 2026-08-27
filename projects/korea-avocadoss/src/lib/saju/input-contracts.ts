export const SAJU_INPUT_CONTRACT_VERSION = 'saju-input-v1' as const;
export const SAJU_NARRATIVE_PAYLOAD_VERSION = 'saju-derived-v1' as const;

export type BirthCalendar = 'gregorian' | 'lunar';
export type BirthTimePrecision = 'exact' | 'approximate' | 'unknown';
export type SajuDayBoundary = 'midnight' | 'jasi' | 'splitJasi';
export type SajuSolarTimeMode = 'civil' | 'true-solar';
export type RequirementLevel = 'required' | 'conditional' | 'not-needed';

export type SajuBirthDate = {
  calendar: BirthCalendar;
  year: number;
  month: number;
  day: number;
  isLeapMonth?: boolean;
};

export type ExactBirthTime = {
  precision: 'exact';
  hour: number;
  minute: number;
};

/**
 * Approximate time is an explicit local-clock interval on the stated birth date.
 * `endHour: 24, endMinute: 0` is allowed to express an interval ending at midnight.
 * Cross-midnight intervals are intentionally rejected in v1 so the birth date is never silently shifted.
 */
export type ApproximateBirthTime = {
  precision: 'approximate';
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
};

export type UnknownBirthTime = {
  precision: 'unknown';
};

export type SajuBirthTime = ExactBirthTime | ApproximateBirthTime | UnknownBirthTime;

export type SajuBirthLocation = {
  /** IANA zone such as `Asia/Seoul` or `America/Los_Angeles`. */
  timeZone?: string;
  /** Degrees east, -180..180. Needed only for true-solar-time calculation. */
  longitude?: number;
  /** Display-only user input. Never include this in narrative-model payloads or general logs. */
  placeLabel?: string;
};

export type SajuCalculationPolicy = {
  dayBoundary: SajuDayBoundary;
  solarTimeMode: SajuSolarTimeMode;
};

export const DEFAULT_SAJU_CALCULATION_POLICY: Readonly<SajuCalculationPolicy> = Object.freeze({
  dayBoundary: 'midnight',
  solarTimeMode: 'civil',
});

export type SajuBirthInput = {
  date: SajuBirthDate;
  time: SajuBirthTime;
  location?: SajuBirthLocation;
  policy?: Partial<SajuCalculationPolicy>;
};

export type NormalizedSajuBirthInput = {
  contractVersion: typeof SAJU_INPUT_CONTRACT_VERSION;
  date: {
    calendar: BirthCalendar;
    year: number;
    month: number;
    day: number;
    isLeapMonth: boolean;
  };
  time: SajuBirthTime;
  location: SajuBirthLocation;
  policy: SajuCalculationPolicy;
};

export type LocalMinuteWindow = {
  startMinuteInclusive: number;
  endMinuteExclusive: number;
};

export type SajuCalculationRequirements = {
  timeZone: RequirementLevel;
  longitude: RequirementLevel;
  placeLabel: 'not-needed';
  canCalculateFullScope: boolean;
  canCalculateReducedScope: boolean;
  missingRequired: Array<'timeZone' | 'longitude'>;
  reasons: string[];
};

export type SajuPillarToken = {
  stem: string;
  branch: string;
};

export type DerivedSajuSummary = {
  calculationVersion: string;
  inputPrecision: BirthTimePrecision;
  scope: 'four-pillars' | 'three-pillars' | 'ambiguous';
  pillars: {
    year: SajuPillarToken;
    month: SajuPillarToken;
    day: SajuPillarToken;
    hour?: SajuPillarToken;
  };
  candidateHourPillars?: SajuPillarToken[];
  fiveElements?: Partial<Record<'wood' | 'fire' | 'earth' | 'metal' | 'water', number>>;
  uncertaintyCodes: string[];
  policy: SajuCalculationPolicy;
};

/**
 * Deliberately contains no raw birth date, clock time, city, timezone, longitude, name or account ID.
 * This is the maximum shape ordinary narrative AI should receive from the Saju calculation layer.
 */
export type SajuNarrativePayload = {
  payloadVersion: typeof SAJU_NARRATIVE_PAYLOAD_VERSION;
  calculationVersion: string;
  inputPrecision: BirthTimePrecision;
  scope: DerivedSajuSummary['scope'];
  pillars: DerivedSajuSummary['pillars'];
  candidateHourPillars: SajuPillarToken[];
  fiveElements?: DerivedSajuSummary['fiveElements'];
  uncertaintyCodes: string[];
  policy: SajuCalculationPolicy;
};

function assertIntegerInRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${label} must be an integer from ${min} to ${max}.`);
  }
}

function assertGregorianDate(year: number, month: number, day: number): void {
  assertIntegerInRange(year, 1, 9999, 'year');
  assertIntegerInRange(month, 1, 12, 'month');
  assertIntegerInRange(day, 1, 31, 'day');

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    throw new RangeError('Invalid Gregorian birth date.');
  }
}

function assertLunarDateShape(year: number, month: number, day: number): void {
  assertIntegerInRange(year, 1, 9999, 'year');
  assertIntegerInRange(month, 1, 12, 'lunar month');
  assertIntegerInRange(day, 1, 30, 'lunar day');
}

function assertTimeZone(timeZone: string): void {
  try {
    new Intl.DateTimeFormat('en', {timeZone}).format(0);
  } catch {
    throw new RangeError(`Invalid IANA time zone: ${timeZone}`);
  }
}

function minuteOfDay(hour: number, minute: number, allow24 = false): number {
  const maxHour = allow24 ? 24 : 23;
  assertIntegerInRange(hour, 0, maxHour, 'hour');
  assertIntegerInRange(minute, 0, 59, 'minute');
  if (hour === 24 && minute !== 0) {
    throw new RangeError('24:00 is the only valid time with hour 24.');
  }
  return hour * 60 + minute;
}

function normalizeTime(time: SajuBirthTime): SajuBirthTime {
  if (!time || typeof time !== 'object') {
    throw new TypeError('Birth time precision is required; use exact, approximate, or unknown.');
  }

  if (time.precision === 'unknown') {
    return {precision: 'unknown'};
  }

  if (time.precision === 'exact') {
    minuteOfDay(time.hour, time.minute);
    return {precision: 'exact', hour: time.hour, minute: time.minute};
  }

  if (time.precision !== 'approximate') {
    throw new RangeError('Birth time precision must be exact, approximate, or unknown.');
  }

  const start = minuteOfDay(time.startHour, time.startMinute);
  const end = minuteOfDay(time.endHour, time.endMinute, true);
  if (start >= end) {
    throw new RangeError('Approximate birth-time interval must stay within one local birth date and start before it ends.');
  }

  return {
    precision: 'approximate',
    startHour: time.startHour,
    startMinute: time.startMinute,
    endHour: time.endHour,
    endMinute: time.endMinute,
  };
}

export function normalizeSajuBirthInput(input: SajuBirthInput): NormalizedSajuBirthInput {
  if (!input || typeof input !== 'object') {
    throw new TypeError('Saju birth input must be an object.');
  }

  const {date} = input;
  if (!date || typeof date !== 'object') {
    throw new TypeError('Birth date is required.');
  }

  if (date.calendar === 'gregorian') {
    assertGregorianDate(date.year, date.month, date.day);
  } else if (date.calendar === 'lunar') {
    assertLunarDateShape(date.year, date.month, date.day);
  } else {
    throw new RangeError('Birth calendar must be gregorian or lunar.');
  }

  const time = normalizeTime(input.time);
  const location: SajuBirthLocation = {};
  if (input.location?.timeZone) {
    assertTimeZone(input.location.timeZone);
    location.timeZone = input.location.timeZone;
  }
  if (input.location?.longitude !== undefined) {
    if (!Number.isFinite(input.location.longitude) || input.location.longitude < -180 || input.location.longitude > 180) {
      throw new RangeError('Birth longitude must be between -180 and 180 degrees east.');
    }
    location.longitude = input.location.longitude;
  }
  if (input.location?.placeLabel) {
    const trimmed = input.location.placeLabel.trim();
    if (trimmed.length > 160) {
      throw new RangeError('Birth place label is too long.');
    }
    if (trimmed) location.placeLabel = trimmed;
  }

  const policy: SajuCalculationPolicy = {
    dayBoundary: input.policy?.dayBoundary ?? DEFAULT_SAJU_CALCULATION_POLICY.dayBoundary,
    solarTimeMode: input.policy?.solarTimeMode ?? DEFAULT_SAJU_CALCULATION_POLICY.solarTimeMode,
  };

  if (!['midnight', 'jasi', 'splitJasi'].includes(policy.dayBoundary)) {
    throw new RangeError('Unsupported Saju day-boundary convention.');
  }
  if (!['civil', 'true-solar'].includes(policy.solarTimeMode)) {
    throw new RangeError('Unsupported Saju solar-time mode.');
  }

  return {
    contractVersion: SAJU_INPUT_CONTRACT_VERSION,
    date: {
      calendar: date.calendar,
      year: date.year,
      month: date.month,
      day: date.day,
      isLeapMonth: date.calendar === 'lunar' ? Boolean(date.isLeapMonth) : false,
    },
    time,
    location,
    policy,
  };
}

export function getLocalMinuteWindow(time: SajuBirthTime): LocalMinuteWindow {
  if (time.precision === 'unknown') {
    return {startMinuteInclusive: 0, endMinuteExclusive: 1440};
  }
  if (time.precision === 'exact') {
    const minute = minuteOfDay(time.hour, time.minute);
    return {startMinuteInclusive: minute, endMinuteExclusive: minute + 1};
  }
  return {
    startMinuteInclusive: minuteOfDay(time.startHour, time.startMinute),
    endMinuteExclusive: minuteOfDay(time.endHour, time.endMinute, true),
  };
}

export function getSajuCalculationRequirements(input: SajuBirthInput): SajuCalculationRequirements {
  const normalized = normalizeSajuBirthInput(input);
  const hasTimeZone = Boolean(normalized.location.timeZone);
  const hasLongitude = normalized.location.longitude !== undefined;
  const hasClockRange = normalized.time.precision !== 'unknown';
  const wantsTrueSolar = normalized.policy.solarTimeMode === 'true-solar';

  const timeZone: RequirementLevel = hasClockRange ? 'required' : 'conditional';
  const longitude: RequirementLevel = wantsTrueSolar && hasClockRange ? 'required' : 'not-needed';
  const missingRequired: Array<'timeZone' | 'longitude'> = [];
  const reasons: string[] = [];

  if (timeZone === 'required' && !hasTimeZone) {
    missingRequired.push('timeZone');
    reasons.push('Exact or approximate local birth time needs an IANA timezone to map the wall clock to a real instant globally.');
  } else if (timeZone === 'conditional' && !hasTimeZone) {
    reasons.push('Unknown birth time can start with a reduced full-day window; timezone may still be needed to resolve a solar-term boundary ambiguity.');
  }

  if (longitude === 'required' && !hasLongitude) {
    missingRequired.push('longitude');
    reasons.push('True-solar-time mode needs birth longitude; a city label itself is not required once longitude is known.');
  }

  if (normalized.time.precision === 'unknown') {
    reasons.push('Unknown time never receives a guessed hour pillar; the calculation layer must omit it or expose explicit ambiguity.');
  }

  return {
    timeZone,
    longitude,
    placeLabel: 'not-needed',
    canCalculateFullScope: hasClockRange && missingRequired.length === 0,
    canCalculateReducedScope: normalized.time.precision === 'unknown',
    missingRequired,
    reasons,
  };
}

function sanitizePillar(pillar: SajuPillarToken, label: string): SajuPillarToken {
  if (!pillar || typeof pillar.stem !== 'string' || typeof pillar.branch !== 'string') {
    throw new TypeError(`${label} pillar is invalid.`);
  }
  const stem = pillar.stem.trim();
  const branch = pillar.branch.trim();
  if (!stem || !branch || stem.length > 16 || branch.length > 16) {
    throw new RangeError(`${label} pillar tokens are invalid.`);
  }
  return {stem, branch};
}

/**
 * Whitelist-only serializer for the future narrative layer.
 * Extra runtime fields such as birthDate, birthTime, city, timezone, name or accountId are intentionally dropped.
 */
export function buildSajuNarrativePayload(summary: DerivedSajuSummary): SajuNarrativePayload {
  if (!summary || typeof summary !== 'object') {
    throw new TypeError('Derived Saju summary is required.');
  }

  const pillars: SajuNarrativePayload['pillars'] = {
    year: sanitizePillar(summary.pillars.year, 'year'),
    month: sanitizePillar(summary.pillars.month, 'month'),
    day: sanitizePillar(summary.pillars.day, 'day'),
  };
  if (summary.pillars.hour) {
    pillars.hour = sanitizePillar(summary.pillars.hour, 'hour');
  }

  const candidateHourPillars = (summary.candidateHourPillars ?? [])
    .slice(0, 12)
    .map((pillar, index) => sanitizePillar(pillar, `candidateHour[${index}]`));

  const uncertaintyCodes = Array.from(new Set(summary.uncertaintyCodes.map((code) => code.trim()).filter(Boolean))).slice(0, 16);

  return {
    payloadVersion: SAJU_NARRATIVE_PAYLOAD_VERSION,
    calculationVersion: summary.calculationVersion,
    inputPrecision: summary.inputPrecision,
    scope: summary.scope,
    pillars,
    candidateHourPillars,
    fiveElements: summary.fiveElements ? {...summary.fiveElements} : undefined,
    uncertaintyCodes,
    policy: {
      dayBoundary: summary.policy.dayBoundary,
      solarTimeMode: summary.policy.solarTimeMode,
    },
  };
}
