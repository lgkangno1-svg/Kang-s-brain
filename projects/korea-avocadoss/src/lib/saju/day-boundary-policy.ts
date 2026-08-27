import type {SajuDayBoundary} from './input-contracts';

export type SajuLateZiFrame = {
  /** Offset from the supplied civil calendar date used for the displayed Day Pillar. */
  dayPillarDateOffset: 0 | 1;
  /** Offset from the supplied civil calendar date whose day stem drives the Hour Pillar. */
  hourStemDateOffset: 0 | 1;
  hourBranch: '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';
};

const HOUR_BRANCHES: SajuLateZiFrame['hourBranch'][] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

function assertClock(hour: number, minute: number): void {
  if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new RangeError('hour must be 0..23');
  if (!Number.isInteger(minute) || minute < 0 || minute > 59) throw new RangeError('minute must be 0..59');
}

function hourBranchFor(hour: number): SajuLateZiFrame['hourBranch'] {
  // Zi spans [23:00, 01:00); every other branch starts on the following odd hour.
  const index = Math.floor(((hour + 1) % 24) / 2);
  return HOUR_BRANCHES[index];
}

/**
 * Resolve only the convention-dependent late-Zi frame. This deliberately does
 * not calculate a Day Pillar or Hour Pillar by itself.
 *
 * - midnight: civil date controls both displayed day and hour-stem basis.
 * - jasi: 23:00-23:59 is treated as the next astrological day for both.
 * - splitJasi: 23:00-23:59 keeps the civil-date Day Pillar, but the Hour Pillar
 *   uses the next day's stem basis. This matches the documented "晚子时日柱按当天"
 *   family used by 6tail sect 2 while preserving the late-Zi hour-stem behavior.
 *
 * At 00:00 the caller has already supplied the next civil date, so offsets are 0.
 */
export function resolveSajuDayBoundaryFrame(
  hour: number,
  minute: number,
  policy: SajuDayBoundary,
): SajuLateZiFrame {
  assertClock(hour, minute);
  if (!['midnight', 'jasi', 'splitJasi'].includes(policy)) {
    throw new RangeError('Unsupported Saju day-boundary convention.');
  }

  const lateZi = hour === 23;
  if (!lateZi) {
    return {dayPillarDateOffset: 0, hourStemDateOffset: 0, hourBranch: hourBranchFor(hour)};
  }

  if (policy === 'jasi') {
    return {dayPillarDateOffset: 1, hourStemDateOffset: 1, hourBranch: '子'};
  }
  if (policy === 'splitJasi') {
    return {dayPillarDateOffset: 0, hourStemDateOffset: 1, hourBranch: '子'};
  }
  return {dayPillarDateOffset: 0, hourStemDateOffset: 0, hourBranch: '子'};
}
