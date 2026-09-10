export type GyeongbokgungGuideLanguage='en'|'ja'|'zh-CN';

export const GYEONGBOKGUNG_GUIDED_TOURS:Record<GyeongbokgungGuideLanguage,readonly string[]>={
  en:['11:00','13:30','15:30'],
  ja:['10:00','14:30'],
  'zh-CN':['10:30','15:00']
};

export const GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE='https://royal.khs.go.kr/ROYAL/contents/R702000000.do';
export const GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE='https://royal.khs.go.kr/ROYAL/contents/R706010000.do';
export const GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT='2026-09-10';

export type GyeongbokgungVisitFacts={
  open:string;
  close:string;
  lastAdmission:string;
  regularTuesdayClosure:boolean;
  verificationRequired:boolean;
};

function parseIsoDate(date:string){
  const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if(!match)throw new RangeError('Use an ISO date in YYYY-MM-DD format.');
  const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
  const parsed=new Date(Date.UTC(year,month-1,day));
  if(parsed.getUTCFullYear()!==year||parsed.getUTCMonth()!==month-1||parsed.getUTCDate()!==day){
    throw new RangeError('Visit date is invalid.');
  }
  return{month,weekday:parsed.getUTCDay()};
}

export function gyeongbokgungVisitFacts(date:string):GyeongbokgungVisitFacts{
  const {month,weekday}=parseIsoDate(date);
  const regularTuesdayClosure=weekday===2;
  if(month===1||month===2||month===11||month===12){
    return{open:'09:00',close:'17:00',lastAdmission:'16:00',regularTuesdayClosure,verificationRequired:regularTuesdayClosure};
  }
  if(month>=6&&month<=8){
    return{open:'09:00',close:'18:30',lastAdmission:'17:30',regularTuesdayClosure,verificationRequired:regularTuesdayClosure};
  }
  return{open:'09:00',close:'18:00',lastAdmission:'17:00',regularTuesdayClosure,verificationRequired:regularTuesdayClosure};
}

export function gyeongbokgungGuidedTourTimes(date:string,language:GyeongbokgungGuideLanguage):readonly string[]{
  const facts=gyeongbokgungVisitFacts(date);
  return facts.verificationRequired?[]:GYEONGBOKGUNG_GUIDED_TOURS[language];
}
