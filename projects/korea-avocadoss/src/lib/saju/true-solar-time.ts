export const SAJU_TRUE_SOLAR_TIME_VERSION = 'noaa-gml-eot-v1' as const;

export type TrueSolarClockInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  /** Degrees east of Greenwich, -180..180. */
  longitude: number;
  /** Effective legal UTC offset at the birth instant, in minutes; DST/history is resolved by the caller. */
  utcOffsetMinutes: number;
};

export type TrueSolarClockResult = {
  algorithmVersion: typeof SAJU_TRUE_SOLAR_TIME_VERSION;
  equationOfTimeMinutes: number;
  longitudeCorrectionMinutes: number;
  totalCorrectionMinutes: number;
  civilMinuteOfDay: number;
  trueSolarMinuteOfDay: number;
  dayOffset: number;
  hourBranch: '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
};

const HOUR_BRANCHES: readonly TrueSolarClockResult['hourBranch'][] = [
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
];

function assertFiniteInRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new RangeError(`${label} must be a finite number from ${min} to ${max}.`);
  }
}

function assertIntegerInRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${label} must be an integer from ${min} to ${max}.`);
  }
}

function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function assertGregorianDate(year: number, month: number, day: number): void {
  assertIntegerInRange(year, 1, 9999, 'year');
  assertIntegerInRange(month, 1, 12, 'month');
  assertIntegerInRange(day, 1, 31, 'day');
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() + 1 !== month || date.getUTCDate() !== day) {
    throw new RangeError('Invalid Gregorian date.');
  }
}

function dayOfYear(year: number, month: number, day: number): number {
  const current = Date.UTC(year, month - 1, day);
  const start = Date.UTC(year, 0, 1);
  return Math.floor((current - start) / 86_400_000) + 1;
}

/**
 * NOAA/GML's published fractional-year approximation of the Equation of Time.
 * Sign convention: apparent solar time minus local mean solar time, in minutes.
 */
export function estimateEquationOfTimeMinutes(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute = 0,
  second = 0,
): number {
  assertGregorianDate(year, month, day);
  assertIntegerInRange(hour, 0, 23, 'hour');
  assertIntegerInRange(minute, 0, 59, 'minute');
  assertIntegerInRange(second, 0, 59, 'second');

  const daysInYear = isLeapYear(year) ? 366 : 365;
  const fractionalHour = hour + minute / 60 + second / 3600;
  const gamma = (2 * Math.PI / daysInYear) * (dayOfYear(year, month, day) - 1 + (fractionalHour - 12) / 24);

  return 229.18 * (
    0.000075
    + 0.001868 * Math.cos(gamma)
    - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma)
    - 0.040849 * Math.sin(2 * gamma)
  );
}

export function hourBranchForSolarMinute(minuteOfDay: number): TrueSolarClockResult['hourBranch'] {
  assertFiniteInRange(minuteOfDay, 0, 1440, 'true solar minute of day');
  if (minuteOfDay === 1440) minuteOfDay = 0;
  const index = Math.floor(((minuteOfDay + 60) % 1440) / 120);
  const branch = HOUR_BRANCHES[index];
  if (!branch) throw new RangeError('Unable to resolve solar hour branch.');
  return branch;
}

/**
 * Converts a legal local wall clock to local apparent (true) solar time.
 *
 * NOAA/GML: time_offset = equation_of_time + 4*longitude - 60*timezone_hours.
 * Here `utcOffsetMinutes` is the same timezone term already expressed in minutes.
 * The caller must resolve the correct historical IANA offset first; this function
 * intentionally does not guess DST or ambiguous/nonexistent local times.
 */
export function resolveTrueSolarClock(input: TrueSolarClockInput): TrueSolarClockResult {
  const second = input.second ?? 0;
  assertGregorianDate(input.year, input.month, input.day);
  assertIntegerInRange(input.hour, 0, 23, 'hour');
  assertIntegerInRange(input.minute, 0, 59, 'minute');
  assertIntegerInRange(second, 0, 59, 'second');
  assertFiniteInRange(input.longitude, -180, 180, 'longitude');
  assertFiniteInRange(input.utcOffsetMinutes, -14 * 60, 14 * 60, 'UTC offset minutes');

  const equationOfTimeMinutes = estimateEquationOfTimeMinutes(
    input.year,
    input.month,
    input.day,
    input.hour,
    input.minute,
    second,
  );
  const longitudeCorrectionMinutes = 4 * input.longitude - input.utcOffsetMinutes;
  const totalCorrectionMinutes = longitudeCorrectionMinutes + equationOfTimeMinutes;
  const civilMinuteOfDay = input.hour * 60 + input.minute + second / 60;
  const unwrappedSolarMinute = civilMinuteOfDay + totalCorrectionMinutes;
  const dayOffset = Math.floor(unwrappedSolarMinute / 1440);
  const trueSolarMinuteOfDay = unwrappedSolarMinute - dayOffset * 1440;

  return {
    algorithmVersion: SAJU_TRUE_SOLAR_TIME_VERSION,
    equationOfTimeMinutes,
    longitudeCorrectionMinutes,
    totalCorrectionMinutes,
    civilMinuteOfDay,
    trueSolarMinuteOfDay,
    dayOffset,
    hourBranch: hourBranchForSolarMinute(trueSolarMinuteOfDay),
  };
}
