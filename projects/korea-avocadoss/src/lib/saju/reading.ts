import type {FiveElementsElement, SajuPillarToken} from './input-contracts';
import type {SajuExperienceResult} from './experience';
import {STEM_ELEMENT_MAP, STEMS, BRANCHES} from './deterministic-core';

export type SajuRelation = 'reinforce'|'support'|'expression'|'opportunity'|'pressure';

export type SajuYearOutlook = {
  year:number;
  pillar:SajuPillarToken;
  element:FiveElementsElement;
  relation:SajuRelation;
};

export type SajuFunctionalReading = {
  dayMaster:{stem:string;element:FiveElementsElement;polarity:'yang'|'yin'};
  strongest:FiveElementsElement;
  weakest:FiveElementsElement;
  balanceIsPartial:boolean;
  outlooks:SajuYearOutlook[];
};

const ELEMENTS:FiveElementsElement[]=['wood','fire','earth','metal','water'];
const GENERATES:Record<FiveElementsElement,FiveElementsElement>={wood:'fire',fire:'earth',earth:'metal',metal:'water',water:'wood'};
const CONTROLS:Record<FiveElementsElement,FiveElementsElement>={wood:'earth',earth:'water',water:'fire',fire:'metal',metal:'wood'};

function mod(value:number,divisor:number){return ((value%divisor)+divisor)%divisor;}

export function yearPillarForGregorianYear(year:number):SajuPillarToken{
  if(!Number.isInteger(year)||year<1900||year>2200)throw new RangeError('Outlook year must be 1900–2200.');
  const index=mod(year-1984,60);
  return {stem:STEMS[index%10],branch:BRANCHES[index%12]};
}

export function relationBetween(dayMaster:FiveElementsElement,yearElement:FiveElementsElement):SajuRelation{
  if(dayMaster===yearElement)return 'reinforce';
  if(GENERATES[yearElement]===dayMaster)return 'support';
  if(GENERATES[dayMaster]===yearElement)return 'expression';
  if(CONTROLS[dayMaster]===yearElement)return 'opportunity';
  return 'pressure';
}

function extrema(counts:Partial<Record<FiveElementsElement,number>>){
  let strongest:FiveElementsElement='wood';
  let weakest:FiveElementsElement='wood';
  for(const element of ELEMENTS){
    const value=counts[element]??0;
    if(value>(counts[strongest]??0))strongest=element;
    if(value<(counts[weakest]??0))weakest=element;
  }
  return {strongest,weakest};
}

export function buildSajuFunctionalReading(result:SajuExperienceResult,startYear:number):SajuFunctionalReading{
  const stem=result.pillars.day.stem;
  const element=STEM_ELEMENT_MAP[stem];
  if(!element)throw new RangeError(`Unsupported day stem: ${stem}`);
  const stemIndex=STEMS.indexOf(stem as typeof STEMS[number]);
  const counts=result.fiveElements.exact??result.fiveElements.base;
  const {strongest,weakest}=extrema(counts);
  const outlooks=[startYear,startYear+1].map((year)=>{
    const pillar=yearPillarForGregorianYear(year);
    const yearElement=STEM_ELEMENT_MAP[pillar.stem];
    return {year,pillar,element:yearElement,relation:relationBetween(element,yearElement)};
  });
  return {
    dayMaster:{stem,element,polarity:stemIndex%2===0?'yang':'yin'},
    strongest,
    weakest,
    balanceIsPartial:!result.fiveElements.exact,
    outlooks,
  };
}
