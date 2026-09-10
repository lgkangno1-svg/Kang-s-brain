import type {FiveElementsElement, SajuPillarToken} from './input-contracts';
import type {SajuExperienceResult} from './experience';
import {STEM_ELEMENT_MAP, STEMS} from './deterministic-core';
import {relationBetween, yearPillarForGregorianYear, type SajuRelation} from './reading';

export type TenGod =
  | 'peer'
  | 'robWealth'
  | 'eatingGod'
  | 'hurtingOfficer'
  | 'indirectWealth'
  | 'directWealth'
  | 'sevenKillings'
  | 'directOfficer'
  | 'indirectResource'
  | 'directResource';

export type VisibleStemRole = {
  pillar: 'year' | 'month' | 'day' | 'hour';
  stem: string;
  tenGod: TenGod | 'self';
};

export type FiveYearOutlook = {
  year: number;
  pillar: SajuPillarToken;
  element: FiveElementsElement;
  relation: SajuRelation;
  tenGod: TenGod;
};

const GENERATES: Record<FiveElementsElement, FiveElementsElement> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};
const CONTROLS: Record<FiveElementsElement, FiveElementsElement> = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
};

function stemInfo(stem: string) {
  const index = STEMS.indexOf(stem as typeof STEMS[number]);
  const element = STEM_ELEMENT_MAP[stem];
  if (index < 0 || !element) throw new RangeError(`Unsupported heavenly stem: ${stem}`);
  return {element, polarity: index % 2 === 0 ? 'yang' as const : 'yin' as const};
}

/**
 * Traditional Ten Gods classification for a visible heavenly stem relative to the Day Master.
 * This is a deterministic symbolic classification, not a prediction or probability.
 */
export function tenGodForStem(dayStem: string, targetStem: string): TenGod {
  const day = stemInfo(dayStem);
  const target = stemInfo(targetStem);
  const samePolarity = day.polarity === target.polarity;

  if (day.element === target.element) return samePolarity ? 'peer' : 'robWealth';
  if (GENERATES[day.element] === target.element) return samePolarity ? 'eatingGod' : 'hurtingOfficer';
  if (CONTROLS[day.element] === target.element) return samePolarity ? 'indirectWealth' : 'directWealth';
  if (CONTROLS[target.element] === day.element) return samePolarity ? 'sevenKillings' : 'directOfficer';
  if (GENERATES[target.element] === day.element) return samePolarity ? 'indirectResource' : 'directResource';
  throw new RangeError(`Unsupported Five Elements relation: ${day.element} -> ${target.element}`);
}

export function visibleStemRoles(result: SajuExperienceResult): VisibleStemRole[] {
  const dayStem = result.pillars.day.stem;
  const roles: VisibleStemRole[] = [
    {pillar: 'year', stem: result.pillars.year.stem, tenGod: tenGodForStem(dayStem, result.pillars.year.stem)},
    {pillar: 'month', stem: result.pillars.month.stem, tenGod: tenGodForStem(dayStem, result.pillars.month.stem)},
    {pillar: 'day', stem: dayStem, tenGod: 'self'},
  ];
  if (result.pillars.hour) roles.push({pillar: 'hour', stem: result.pillars.hour.stem, tenGod: tenGodForStem(dayStem, result.pillars.hour.stem)});
  return roles;
}

export function buildFiveYearOutlooks(result: SajuExperienceResult, startYear: number): FiveYearOutlook[] {
  const dayStem = result.pillars.day.stem;
  const dayElement = stemInfo(dayStem).element;
  return Array.from({length: 5}, (_, offset) => {
    const year = startYear + offset;
    const pillar = yearPillarForGregorianYear(year);
    const element = STEM_ELEMENT_MAP[pillar.stem];
    if (!element) throw new RangeError(`Unsupported annual stem: ${pillar.stem}`);
    return {
      year,
      pillar,
      element,
      relation: relationBetween(dayElement, element),
      tenGod: tenGodForStem(dayStem, pillar.stem),
    };
  });
}
