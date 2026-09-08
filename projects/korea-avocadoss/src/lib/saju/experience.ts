import type {FiveElementsElement, SajuPillarToken} from './input-contracts';
import {resolveIanaWallClockMinute} from './timezone-resolution';
import {
  BRANCHES,
  STEMS,
  calculateFiveElementsBreakdown,
  countPillarElements,
  deriveHourBranchCandidates,
  deriveHourPillarStem,
} from './deterministic-core';

/**
 * Customer-facing Saju experience layer.
 *
 * Calendar math is deterministic and costs no AI tokens. Solar-term solving is
 * adapted from the MIT-licensed `yhj1024/manseryeok` implementation (Meeus
 * apparent-solar-longitude method). The local implementation intentionally
 * keeps a conservative boundary warning because we do not ship manseryeok's
 * minute-correction table yet.
 */

const DEG2RAD = Math.PI / 180;
const SOLAR_TERM_WARNING_MS = 30 * 60 * 1000;
const JIE_BOUNDARIES: ReadonlyArray<readonly [number, number]> = [
  [2, 1], [4, 2], [6, 3], [8, 4], [10, 5], [12, 6],
  [14, 7], [16, 8], [18, 9], [20, 10], [22, 11], [0, 12],
];
const MONTH_BRANCHES = ['?', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑'] as const;
const ZODIAC_BY_BRANCH: Record<string, string> = {
  子: 'rat', 丑: 'ox', 寅: 'tiger', 卯: 'rabbit', 辰: 'dragon', 巳: 'snake',
  午: 'horse', 未: 'goat', 申: 'monkey', 酉: 'rooster', 戌: 'dog', 亥: 'pig',
};

export type SajuExperienceTime =
  | {mode: 'exact'; hour: number; minute: number}
  | {mode: 'rough'; period: 'night' | 'morning' | 'afternoon' | 'evening'}
  | {mode: 'unknown'};

export type SajuExperienceInput = {
  year: number;
  month: number;
  day: number;
  timeZone: string;
  time: SajuExperienceTime;
};

export type SajuExperienceResult = {
  scope: 'four-pillars' | 'three-pillars' | 'boundary-uncertain';
  pillars: {year?: SajuPillarToken; month?: SajuPillarToken; day: SajuPillarToken; hour?: SajuPillarToken};
  candidates: {year: SajuPillarToken[]; month: SajuPillarToken[]; hour: SajuPillarToken[]};
  fiveElements: {
    exact?: Record<FiveElementsElement, number>;
    base: Partial<Record<FiveElementsElement, number>>;
    ranges?: Record<FiveElementsElement, {min: number; max: number}>;
  };
  koreanZodiac: string;
  westernZodiac: string;
  warnings: string[];
  method: {timeBasis: 'civil-time'; dayBoundary: 'midnight'; solarTermBoundaryWarningMinutes: number};
};

function mod(value: number, divisor: number): number { return ((value % divisor) + divisor) % divisor; }
function assertDate(year: number, month: number, day: number): void {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) throw new RangeError('Birth year must be 1900–2100.');
  if (!Number.isInteger(month) || month < 1 || month > 12) throw new RangeError('Birth month must be 1–12.');
  if (!Number.isInteger(day) || day < 1 || day > 31) throw new RangeError('Birth day is invalid.');
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) throw new RangeError('Birth date is invalid.');
}
function assertTimeZone(timeZone: string): void {
  if (!timeZone || timeZone.length > 80) throw new RangeError('Birth timezone is required.');
  try { new Intl.DateTimeFormat('en', {timeZone}).format(0); }
  catch { throw new RangeError('Use a valid IANA timezone such as Asia/Seoul or America/New_York.'); }
}
function normalizeDegrees(value: number): number { return mod(value, 360); }
function julianDayFromMs(ms: number): number { return ms / 86400000 + 2440587.5; }
function apparentSolarLongitude(ms: number): number {
  const jd = julianDayFromMs(ms);
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalizeDegrees(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const Mrad = M * DEG2RAD;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) + 0.000289 * Math.sin(3 * Mrad);
  const omega = 125.04 - 1934.136 * T;
  return normalizeDegrees(L0 + C - 0.00569 - 0.00478 * Math.sin(omega * DEG2RAD));
}
function solveSolarLongitudeInstant(targetLongitude: number, guessMs: number): number {
  let ms = guessMs;
  const degreesPerDay = 360 / 365.2422;
  for (let i = 0; i < 8; i += 1) {
    const current = apparentSolarLongitude(ms);
    const diff = ((current - targetLongitude + 540) % 360) - 180;
    if (Math.abs(diff) < 1e-7) break;
    ms -= (diff / degreesPerDay) * 86400000;
  }
  return ms;
}
export function approximateSolarTermInstantMs(year: number, index: number): number {
  if (!Number.isInteger(index) || index < 0 || index > 23) throw new RangeError('Solar-term index must be 0–23.');
  const targetLongitude = (285 + 15 * index) % 360;
  return solveSolarLongitudeInstant(targetLongitude, Date.UTC(year, Math.floor(index / 2), 15, 0, 0, 0));
}
function pillarFromCycleIndex(index: number): SajuPillarToken { return {stem: STEMS[mod(index, 10)], branch: BRANCHES[mod(index, 12)]}; }
function yearPillarForSajuYear(year: number): SajuPillarToken { return pillarFromCycleIndex(year - 1984); }
function monthPillarFor(sajuYear: number, monthNumber: number): SajuPillarToken {
  const yearStemIndex = mod(sajuYear - 4, 10);
  const monthStemIndex = (yearStemIndex % 5 * 2 + monthNumber + 1) % 10;
  return {stem: STEMS[monthStemIndex], branch: MONTH_BRANCHES[monthNumber]};
}
function gregorianJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12); const y = year + 4800 - a; const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}
export function dayPillarForGregorianDate(year: number, month: number, day: number): SajuPillarToken { return pillarFromCycleIndex(gregorianJdn(year, month, day) + 49); }
function sajuYearForInstant(instantMs: number, calendarYear: number): number { return instantMs < approximateSolarTermInstantMs(calendarYear, 2) ? calendarYear - 1 : calendarYear; }
function sajuMonthForInstant(instantMs: number): number {
  const year = new Date(instantMs).getUTCFullYear(); let best = -Infinity; let monthNumber = 12;
  for (const candidateYear of [year - 1, year, year + 1]) for (const [index, month] of JIE_BOUNDARIES) {
    const boundary = approximateSolarTermInstantMs(candidateYear, index);
    if (boundary <= instantMs && boundary > best) { best = boundary; monthNumber = month; }
  }
  return monthNumber;
}
function basePillarsForInstant(instantMs: number, localYear: number): {year: SajuPillarToken; month: SajuPillarToken} {
  const sajuYear = sajuYearForInstant(instantMs, localYear);
  return {year: yearPillarForSajuYear(sajuYear), month: monthPillarFor(sajuYear, sajuMonthForInstant(instantMs))};
}
function wallClockCandidates(year: number, month: number, day: number, hour: number, minute: number, timeZone: string): number[] {
  const resolved = resolveIanaWallClockMinute({year, month, day, hour, minute}, timeZone);
  if (resolved.status === 'nonexistent') return [];
  return resolved.candidates.map((candidate) => candidate.epochMilliseconds);
}
function uniquePillars(values: SajuPillarToken[]): SajuPillarToken[] {
  const seen = new Set<string>();
  return values.filter((pillar) => { const key = `${pillar.stem}${pillar.branch}`; if (seen.has(key)) return false; seen.add(key); return true; });
}
function nearestJieBoundary(instantMs: number): {distanceMs: number; boundaryMs: number; index: number} {
  const year = new Date(instantMs).getUTCFullYear(); let nearest = {distanceMs: Infinity, boundaryMs: 0, index: -1};
  for (const candidateYear of [year - 1, year, year + 1]) for (const [index] of JIE_BOUNDARIES) {
    const boundaryMs = approximateSolarTermInstantMs(candidateYear, index); const distanceMs = Math.abs(instantMs - boundaryMs);
    if (distanceMs < nearest.distanceMs) nearest = {distanceMs, boundaryMs, index};
  }
  return nearest;
}
function roughWindow(period: SajuExperienceTime & {mode: 'rough'}): {start: number; end: number} {
  switch (period.period) {
    case 'night': return {start: 0, end: 6 * 60}; case 'morning': return {start: 6 * 60, end: 12 * 60};
    case 'afternoon': return {start: 12 * 60, end: 18 * 60}; case 'evening': return {start: 18 * 60, end: 23 * 60 + 59};
  }
}
function westernZodiac(month: number, day: number): string {
  const edges: Array<[number, string]> = [[120,'capricorn'],[219,'aquarius'],[321,'pisces'],[420,'aries'],[521,'taurus'],[622,'gemini'],[723,'cancer'],[823,'leo'],[923,'virgo'],[1024,'libra'],[1123,'scorpio'],[1222,'sagittarius'],[1232,'capricorn']];
  const key = month * 100 + day; for (const [edge, sign] of edges) if (key < edge) return sign; return 'capricorn';
}
function localIntervalInstants(input: SajuExperienceInput): {instants: number[]; minuteWindow: {startMinuteInclusive: number; endMinuteExclusive: number}} {
  if (input.time.mode === 'exact') {
    if (!Number.isInteger(input.time.hour) || input.time.hour < 0 || input.time.hour > 23) throw new RangeError('Birth hour must be 0–23.');
    if (!Number.isInteger(input.time.minute) || input.time.minute < 0 || input.time.minute > 59) throw new RangeError('Birth minute must be 0–59.');
    return {instants: wallClockCandidates(input.year,input.month,input.day,input.time.hour,input.time.minute,input.timeZone), minuteWindow:{startMinuteInclusive:input.time.hour*60+input.time.minute,endMinuteExclusive:input.time.hour*60+input.time.minute+1}};
  }
  if (input.time.mode === 'rough') {
    const window = roughWindow(input.time); const lastMinute = Math.max(window.start, window.end - 1);
    return {instants:[...wallClockCandidates(input.year,input.month,input.day,Math.floor(window.start/60),window.start%60,input.timeZone),...wallClockCandidates(input.year,input.month,input.day,Math.floor(lastMinute/60),lastMinute%60,input.timeZone)], minuteWindow:{startMinuteInclusive:window.start,endMinuteExclusive:window.end}};
  }
  return {instants:[...wallClockCandidates(input.year,input.month,input.day,0,0,input.timeZone),...wallClockCandidates(input.year,input.month,input.day,23,59,input.timeZone)],minuteWindow:{startMinuteInclusive:0,endMinuteExclusive:1440}};
}

export function calculateSajuExperience(input: SajuExperienceInput): SajuExperienceResult {
  assertDate(input.year,input.month,input.day); assertTimeZone(input.timeZone);
  const warnings: string[] = []; const day = dayPillarForGregorianDate(input.year,input.month,input.day);
  const {instants,minuteWindow} = localIntervalInstants(input);
  if (instants.length === 0) throw new RangeError('That local clock time did not exist in the selected timezone because of a DST clock change. Choose another time or use rough/unknown time.');
  const bases = instants.map((instant)=>basePillarsForInstant(instant,input.year));
  let yearCandidates = uniquePillars(bases.map((base)=>base.year)); let monthCandidates = uniquePillars(bases.map((base)=>base.month));
  if (input.time.mode === 'exact' && instants.length > 1) warnings.push('This local clock time occurred more than once because of a historical DST clock change. Results are shown only where the pillar is invariant across both instants.');
  for (const instant of instants) {
    const nearest = nearestJieBoundary(instant);
    if (nearest.distanceMs <= SOLAR_TERM_WARNING_MS) {
      warnings.push('This birth time is close to a solar-term boundary. The exact year/month cutover is intentionally treated as uncertain within a 30-minute safety window.');
      const before = basePillarsForInstant(nearest.boundaryMs-SOLAR_TERM_WARNING_MS-60000,input.year); const after = basePillarsForInstant(nearest.boundaryMs+SOLAR_TERM_WARNING_MS+60000,input.year);
      monthCandidates = uniquePillars([...monthCandidates,before.month,after.month]); if (nearest.index===2) yearCandidates=uniquePillars([...yearCandidates,before.year,after.year]); break;
    }
  }
  if (yearCandidates.length>1 || monthCandidates.length>1) warnings.push('Your selected time range crosses a solar-term boundary, so the year or month pillar cannot be reduced to one value without a more exact birth time.');
  const hourBranches=deriveHourBranchCandidates(minuteWindow); const hourCandidates=hourBranches.map((branch)=>({stem:deriveHourPillarStem(day.stem,branch),branch}));
  let hour:SajuPillarToken|undefined; if(input.time.mode==='exact'||(input.time.mode==='rough'&&hourCandidates.length===1))hour=hourCandidates[0];
  if(input.time.mode==='unknown')warnings.push('Birth time was not provided. The hour pillar is intentionally omitted; all 12 possible hour branches remain candidates.');
  if(input.time.mode==='rough'&&hourCandidates.length>1)warnings.push('The rough time period spans multiple traditional double-hours, so the hour pillar is shown as candidates instead of being guessed.');
  const year=yearCandidates.length===1?yearCandidates[0]:undefined; const month=monthCandidates.length===1?monthCandidates[0]:undefined;
  const basePillars=[year,month,day].filter(Boolean) as SajuPillarToken[]; const breakdown=calculateFiveElementsBreakdown(basePillars,hourCandidates,hour);
  const exact=hour&&year&&month?countPillarElements([year,month,day,hour]):undefined; let scope:SajuExperienceResult['scope']=hour&&year&&month?'four-pillars':'three-pillars'; if(!year||!month)scope='boundary-uncertain';
  const zodiacPillar=yearCandidates.length===1?yearCandidates[0]:undefined;
  return {scope,pillars:{year,month,day,hour},candidates:{year:yearCandidates,month:monthCandidates,hour:uniquePillars(hourCandidates)},fiveElements:{exact,base:breakdown.invariantBase,ranges:breakdown.candidateRanges},koreanZodiac:zodiacPillar?(ZODIAC_BY_BRANCH[zodiacPillar.branch]??'unknown'):'unknown',westernZodiac:westernZodiac(input.month,input.day),warnings,method:{timeBasis:'civil-time',dayBoundary:'midnight',solarTermBoundaryWarningMinutes:30}};
}
