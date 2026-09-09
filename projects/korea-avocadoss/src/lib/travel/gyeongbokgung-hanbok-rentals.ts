export type HanbokRentalLanguage='en'|'ja'|'zh';
export type HanbokRentalAvailability='open'|'closed'|'recheck';

export type HanbokRentalShop={
 id:string;
 name:string;
 koreanName:string;
 address:string;
 phone:string;
 priceFromKrw?:number;
 hoursLabel:string;
 openMinute:number;
 closeMinute:number;
 closedWeekdays:number[];
 scheduleConfidence:'verified'|'recheck';
 interpretationLanguages:HanbokRentalLanguage[];
 websiteLanguages:HanbokRentalLanguage[];
 supportNote:string;
 sourceLabel:string;
 sourceUrl:string;
 checkedAt:string;
};

export const GYEONGBOKGUNG_HANBOK_RENTALS:readonly HanbokRentalShop[]=[
 {
  id:'hanboknam-gyeongbokgung',name:'Hanboknam — Gyeongbokgung',koreanName:'한복남 경복궁점',
  address:'133-5 Sajik-ro, Jongno-gu, Seoul',phone:'+82-10-6485-8507',
  hoursLabel:'09:00–19:00; the shop states seasonal closing times can change',openMinute:540,closeMinute:1140,closedWeekdays:[],scheduleConfidence:'recheck',
  interpretationLanguages:[],websiteLanguages:[],supportNote:'VISITKOREA lists the branch as open year-round. The shop website publishes a slightly later seasonal closing time, so confirm the return deadline before visiting.',
  sourceLabel:'Hanboknam branch information',sourceUrl:'https://hanboknam.com/hanboknam/branch/gyeongbok.html',checkedAt:'2026-09-09'
 },
 {
  id:'hanbok-that-day',name:'Hanbok That Day',koreanName:'한복 그날',
  address:'36, Yulgok-ro 1-gil, Jongno-gu, Seoul',phone:'+82-2-2039-7899',priceFromKrw:10000,
  hoursLabel:'09:30–19:00 daily',openMinute:570,closeMinute:1140,closedWeekdays:[],scheduleConfidence:'verified',
  interpretationLanguages:['en','ja','zh'],websiteLanguages:['en','ja','zh'],supportNote:'Visit Seoul explicitly lists foreign-language interpretation and English, Japanese and Chinese support.',
  sourceLabel:'Official Seoul travel guide',sourceUrl:'https://english.visitseoul.net/entertainment/Hanbok-That-Day/ENP027997',checkedAt:'2026-09-09'
 },
 {
  id:'3355-hanbok',name:'3355 Hanbok — Gyeongbokgung',koreanName:'3355 한복 경복궁점',
  address:'45 Sagan-dong, Jongno-gu, Seoul',phone:'+82-2-720-1255',priceFromKrw:15000,
  hoursLabel:'09:00–18:00; closed Tuesdays',openMinute:540,closeMinute:1080,closedWeekdays:[2],scheduleConfidence:'verified',
  interpretationLanguages:[],websiteLanguages:['en','ja','zh'],supportNote:'The shop site provides English, Japanese and Chinese visitor information. In-person interpretation is not assumed unless the shop confirms it.',
  sourceLabel:'3355 Hanbok official guide',sourceUrl:'https://www.go3355.net/default/guide/',checkedAt:'2026-09-09'
 }
] as const;

function weekdayInSeoul(date:string){const parsed=new Date(`${date}T12:00:00+09:00`);return Number.isNaN(parsed.getTime())?-1:parsed.getUTCDay();}
function toMinute(value:string){const [hour,minute]=value.split(':').map(Number);return Number.isFinite(hour)&&Number.isFinite(minute)?hour*60+minute:NaN;}

export function hanbokRentalAvailabilityAt(shop:HanbokRentalShop,date:string,time:string):HanbokRentalAvailability{
 const weekday=weekdayInSeoul(date);const minute=toMinute(time);
 if(weekday<0||!Number.isFinite(minute))return 'recheck';
 if(shop.closedWeekdays.includes(weekday))return 'closed';
 if(minute<shop.openMinute||minute>=shop.closeMinute)return 'closed';
 return shop.scheduleConfidence==='verified'?'open':'recheck';
}

export function hanbokRentalMapHref(shop:HanbokRentalShop){
 return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address}`)}`;
}
