export const SAJU_TIMEZONE_RESOLUTION_VERSION = 'saju-timezone-resolution-v1' as const;

export type GregorianWallClockMinute = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export type IanaWallClockCandidate = {
  instantIso: string;
  epochMilliseconds: number;
  utcOffsetMinutes: number;
};

export type IanaWallClockResolution = {
  algorithmVersion: typeof SAJU_TIMEZONE_RESOLUTION_VERSION;
  timeZone: string;
  wallClock: GregorianWallClockMinute;
  status: 'unique' | 'ambiguous' | 'nonexistent';
  candidates: IanaWallClockCandidate[];
};

function assertIntegerInRange(value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${label} must be an integer from ${min} to ${max}.`);
  }
}

function utcEpochForComponents(value: GregorianWallClockMinute): number {
  assertIntegerInRange(value.year, 1, 9999, 'year');
  assertIntegerInRange(value.month, 1, 12, 'month');
  assertIntegerInRange(value.day, 1, 31, 'day');
  assertIntegerInRange(value.hour, 0, 23, 'hour');
  assertIntegerInRange(value.minute, 0, 59, 'minute');

  // `Date.UTC()` treats years 0..99 as 1900..1999. Setting the full year on an
  // existing UTC date avoids that legacy behavior and keeps the contract valid
  // for the full supported 1..9999 range.
  const date = new Date(0);
  date.setUTCFullYear(value.year, value.month - 1, value.day);
  date.setUTCHours(value.hour, value.minute, 0, 0);

  if (
    date.getUTCFullYear() !== value.year ||
    date.getUTCMonth() + 1 !== value.month ||
    date.getUTCDate() !== value.day ||
    date.getUTCHours() !== value.hour ||
    date.getUTCMinutes() !== value.minute
  ) {
    throw new RangeError('Invalid Gregorian wall-clock date/time.');
  }

  return date.getTime();
}

function createFormatter(timeZone: string): Intl.DateTimeFormat {
  try {
    return new Intl.DateTimeFormat('en-US-u-ca-gregory-nu-latn', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });
  } catch {
    throw new RangeError(`Invalid IANA time zone: ${timeZone}`);
  }
}

function formattedWallClock(formatter: Intl.DateTimeFormat, epochMilliseconds: number): GregorianWallClockMinute {
  const parts = formatter.formatToParts(new Date(epochMilliseconds));
  const values = new Map(parts.map((part) => [part.type, part.value]));
  const read = (key: 'year' | 'month' | 'day' | 'hour' | 'minute'): number => {
    const parsed = Number(values.get(key));
    if (!Number.isInteger(parsed)) {
      throw new RangeError(`Unable to resolve ${key} from IANA timezone formatting.`);
    }
    return parsed;
  };

  return {
    year: read('year'),
    month: read('month'),
    day: read('day'),
    hour: read('hour'),
    minute: read('minute'),
  };
}

function sameWallClock(actual: GregorianWallClockMinute, expected: GregorianWallClockMinute): boolean {
  return actual.year === expected.year &&
    actual.month === expected.month &&
    actual.day === expected.day &&
    actual.hour === expected.hour &&
    actual.minute === expected.minute;
}

/**
 * Resolves one Gregorian local wall-clock minute in an IANA timezone without
 * silently choosing through a DST gap or repeated hour.
 *
 * The search enumerates every UTC minute in an 18-hour window on either side
 * of the same numeric UTC wall clock. That deliberately trades a small amount
 * of CPU for an auditable invariant: every real instant that formats back to
 * the requested local minute is returned. The window exceeds the modern IANA
 * UTC-offset range and avoids relying on host-local timezone state.
 *
 * Result semantics:
 * - `unique`: exactly one real instant maps to the wall clock;
 * - `ambiguous`: two or more instants map to it (for example a DST fall-back);
 * - `nonexistent`: no instant maps to it (for example a DST spring-forward gap).
 *
 * The caller must explicitly disambiguate an `ambiguous` result. This function
 * never picks the earlier/later candidate and never shifts a nonexistent time.
 */
export function resolveIanaWallClockMinute(
  wallClock: GregorianWallClockMinute,
  timeZone: string,
): IanaWallClockResolution {
  if (!wallClock || typeof wallClock !== 'object') {
    throw new TypeError('Gregorian wall-clock input is required.');
  }
  if (typeof timeZone !== 'string' || !timeZone.trim()) {
    throw new TypeError('IANA timezone is required.');
  }

  const normalizedTimeZone = timeZone.trim();
  const formatter = createFormatter(normalizedTimeZone);
  const wallEpoch = utcEpochForComponents(wallClock);
  const minuteMs = 60_000;
  const searchRadiusMinutes = 18 * 60;
  const candidates: IanaWallClockCandidate[] = [];

  for (let deltaMinutes = -searchRadiusMinutes; deltaMinutes <= searchRadiusMinutes; deltaMinutes += 1) {
    const epochMilliseconds = wallEpoch + deltaMinutes * minuteMs;
    if (!sameWallClock(formattedWallClock(formatter, epochMilliseconds), wallClock)) continue;

    candidates.push({
      instantIso: new Date(epochMilliseconds).toISOString(),
      epochMilliseconds,
      utcOffsetMinutes: (wallEpoch - epochMilliseconds) / minuteMs,
    });
  }

  candidates.sort((a, b) => a.epochMilliseconds - b.epochMilliseconds);
  const status: IanaWallClockResolution['status'] =
    candidates.length === 0 ? 'nonexistent' : candidates.length === 1 ? 'unique' : 'ambiguous';

  return {
    algorithmVersion: SAJU_TIMEZONE_RESOLUTION_VERSION,
    timeZone: normalizedTimeZone,
    wallClock: {...wallClock},
    status,
    candidates,
  };
}
