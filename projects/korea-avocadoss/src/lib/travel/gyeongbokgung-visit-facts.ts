export type GyeongbokgungGuideLanguage='en'|'ja'|'zh-CN';

export const GYEONGBOKGUNG_GUIDED_TOURS:Record<GyeongbokgungGuideLanguage,readonly string[]>={
  en:['11:00','13:30','15:30'],
  ja:['10:00','14:30'],
  'zh-CN':['10:30','15:00']
};

export const GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE='https://royal.khs.go.kr/ROYAL/contents/R702000000.do';
export const GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE='https://royal.khs.go.kr/ROYAL/contents/R706010000.do';
export const GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT='2026-09-12';
export const GYEONGBOKGUNG_VISIT_FACTS_MAX_AGE_DAYS=30;

export type GyeongbokgungTemporaryNotice={
 id:string;
 startDate:string;
 endDate:string;
 title:string;
 sourceUrl:string;
 checkedAt:string;
};

const GYEONGBOKGUNG_TEMPORARY_NOTICES:readonly GyeongbokgungTemporaryNotice[]=[
 {
  id:'geunjeongjeon-woldae-2026-autumn',
  startDate:'2026-09-02',
  endDate:'2026-10-31',
  title:'Geunjeongjeon Woldae access is restricted during the autumn peak period.',
  sourceUrl:'https://royal.khs.go.kr/ROYAL/contents/R403000000.do?id=20260830151817711582&schBcid=notice01&schM=view',
  checkedAt:'2026-09-12'
 }
] as const;

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
  return{date:parsed,month,weekday:parsed.getUTCDay()};
}

export function isGyeongbokgungVisitFactsFresh(asOfDate:string){
  const checked=parseIsoDate(GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT).date.getTime();
  const asOf=parseIsoDate(asOfDate).date.getTime();
  const ageDays=Math.floor((asOf-checked)/86_400_000);
  return ageDays>=0&&ageDays<=GYEONGBOKGUNG_VISIT_FACTS_MAX_AGE_DAYS;
}

export function gyeongbokgungTemporaryNotices(date:string):readonly GyeongbokgungTemporaryNotice[]{
  const target=parseIsoDate(date).date.getTime();
  return GYEONGBOKGUNG_TEMPORARY_NOTICES.filter(notice=>{
    const start=parseIsoDate(notice.startDate).date.getTime();
    const end=parseIsoDate(notice.endDate).date.getTime();
    return target>=start&&target<=end;
  });
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
