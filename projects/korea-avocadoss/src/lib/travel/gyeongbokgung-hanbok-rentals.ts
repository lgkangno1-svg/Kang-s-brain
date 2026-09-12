export type HanbokRentalLanguage='en'|'ja'|'zh';
export type HanbokRentalAvailability='open'|'closed'|'recheck';
export type HanbokRentalSourceFreshness='fresh'|'stale'|'invalid';

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

/**
 * Deliberately small, quality-first shortlist for foreign visitors.
 *
 * Inclusion rule (2026-09-12): keep the catalog under 10 shops and include only
 * operators with at least one strong signal such as very high current review
 * volume, large inventory/operation, strong international booking presence, or
 * sustained recognition among overseas visitors. A nearby shop is not included
 * merely because it exists or is cheap.
 *
 * Review counts change quickly, so the UI does not hard-code live counts. The
 * support note explains the durable reason each shop made the shortlist, while
 * hours/source data remain independently re-checkable.
 */
export const GYEONGBOKGUNG_HANBOK_RENTALS:readonly HanbokRentalShop[]=[
 {
  id:'hanboknam-gyeongbokgung',name:'Hanboknam — Gyeongbokgung',koreanName:'한복남 경복궁점',
  address:'133-5 Sajik-ro, Jongno-gu, Seoul',phone:'+82-10-6485-8507',
  hoursLabel:'09:00–19:00; seasonal return/closing rules can change',openMinute:540,closeMinute:1140,closedWeekdays:[],scheduleConfidence:'recheck',
  interpretationLanguages:[],websiteLanguages:[],
  supportNote:'Selected as a large, internationally recognized operator with one of the strongest review-volume signals among Gyeongbokgung rental listings. The branch is also widely sold to overseas travelers. Confirm the exact return deadline on the day of use.',
  sourceLabel:'Hanboknam branch information',sourceUrl:'https://hanboknam.com/hanboknam/branch/gyeongbok.html',checkedAt:'2026-09-12'
 },
 {
  id:'seohwa-hanbok',name:'Seohwa Hanbok',koreanName:'서화한복',
  address:'137 Sajik-ro, Jongno-gu, Seoul',phone:'+82-2-725-8560',priceFromKrw:24000,
  hoursLabel:'09:00–19:00 daily',openMinute:540,closeMinute:1140,closedWeekdays:[],scheduleConfidence:'verified',
  interpretationLanguages:['en','ja','zh'],websiteLanguages:['en','ja','zh'],
  supportNote:'Selected for very high review volume, a long-running reputation with overseas visitors, flat premium pricing, XS–4XL sizing and a location about one minute from the palace. The official site publishes English, Japanese and Chinese support.',
  sourceLabel:'Seohwa Hanbok official site',sourceUrl:'https://seohwahanbok.net/',checkedAt:'2026-09-12'
 },
 {
  id:'daehan-hanbok',name:'Daehan Hanbok — Gyeongbokgung',koreanName:'대한한복 경복궁점',
  address:'133-2 Sajik-ro, 2F, Jongno-gu, Seoul',phone:'+82-2-2088-7791',
  hoursLabel:'09:00–19:00 daily',openMinute:540,closeMinute:1140,closedWeekdays:[],scheduleConfidence:'verified',
  interpretationLanguages:[],websiteLanguages:['en'],
  supportNote:'Selected for very high current review volume, a sizeable operation near Exit 4 and an operator background focused on overseas travelers and travel-agency partnerships. The official site also lists a photo-studio area.',
  sourceLabel:'Daehan Hanbok official site',sourceUrl:'https://www.krcgroup.co/daehanhanbok',checkedAt:'2026-09-12'
 },
 {
  id:'oneday-hanbok',name:'Oneday Hanbok — Gyeongbokgung',koreanName:'원데이한복 경복궁점',
  address:'137 Sajik-ro, B1, Jongno-gu, Seoul',phone:'+82-70-4202-4310',
  hoursLabel:'09:00–19:00 daily; last rental published as 18:00',openMinute:540,closeMinute:1140,closedWeekdays:[],scheduleConfidence:'verified',
  interpretationLanguages:[],websiteLanguages:['en','ja','zh'],
  supportNote:'Selected for exceptional international booking/review volume and a long-standing foreign-tourist focus. The official location page is available in English, Japanese, Simplified/Traditional Chinese and Thai.',
  sourceLabel:'Oneday Hanbok official location page',sourceUrl:'https://www.onedayhanbok.com/where/',checkedAt:'2026-09-12'
 },
 {
  id:'yes-hanbok',name:'YES Hanbok — Gyeongbokgung',koreanName:'예스한복 경복궁점',
  address:'133-6 Sajik-ro, 1F, Jongno-gu, Seoul',phone:'+82-2-734-2567',
  hoursLabel:'09:00–18:00 daily',openMinute:540,closeMinute:1080,closedWeekdays:[],scheduleConfidence:'verified',
  interpretationLanguages:['en','ja','zh'],websiteLanguages:['en','ja','zh'],
  supportNote:'Selected as one of the largest nearby inventories: current international booking information states 1,000+ hanbok sets and staff support in English, Chinese and Japanese, with thousands of platform reviews.',
  sourceLabel:'Creatrip YES Hanbok listing',sourceUrl:'https://creatrip.com/en/spot/11006',checkedAt:'2026-09-12'
 },
 {
  id:'naye-hanbok',name:'NAYE Hanbok — Gyeongbokgung',koreanName:'나예한복 경복궁점',
  address:'133-10 Sajik-ro, 1F, Jongno-gu, Seoul',phone:'+82-50-71314-8386',priceFromKrw:25000,
  hoursLabel:'09:00–18:00 Wed–Mon; closed Tuesdays; winter return deadline can be earlier',openMinute:540,closeMinute:1080,closedWeekdays:[2],scheduleConfidence:'verified',
  interpretationLanguages:['en','ja','zh'],websiteLanguages:['en','ja','zh'],
  supportNote:'Selected for strong overseas-platform ratings/bookings, a growing review base, multilingual visitor support and repeated praise for clean garments and an all-inclusive setup. Recheck seasonal return deadlines before visiting.',
  sourceLabel:'Klook NAYE Hanbok listing',sourceUrl:'https://www.klook.com/activity/168236-nayehanbok-clean-beautiful-hanbok-photoshoot-in-gyeongbokgung/',checkedAt:'2026-09-12'
 },
 {
  id:'hanbok-day',name:'HANBOK DAY — Gyeongbokgung',koreanName:'한복데이',
  address:'7 Hyoja-ro, Jongno-gu, Seoul',phone:'+82-2-730-5277',
  hoursLabel:'09:00–18:00; closed Tuesdays',openMinute:540,closeMinute:1080,closedWeekdays:[2],scheduleConfidence:'verified',
  interpretationLanguages:[],websiteLanguages:['en'],
  supportNote:'Selected as an established foreign-visitor-facing shop with a substantial public review footprint, an English booking site, WhatsApp contact and an in-house palace photography option. It is about five minutes from Gyeongbokgung.',
  sourceLabel:'HANBOK DAY official site',sourceUrl:'https://www.hanbokday.com/',checkedAt:'2026-09-12'
 }
] as const;

function weekdayInSeoul(date:string){const parsed=new Date(`${date}T12:00:00+09:00`);return Number.isNaN(parsed.getTime())?-1:parsed.getUTCDay();}
function toMinute(value:string){const [hour,minute]=value.split(':').map(Number);return Number.isFinite(hour)&&Number.isFinite(minute)?hour*60+minute:NaN;}
function referenceDateForVisit(date:string){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
 if(!match)return null;
 const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
 const parsed=new Date(Date.UTC(year,month-1,day,12));
 return parsed.getUTCFullYear()===year&&parsed.getUTCMonth()===month-1&&parsed.getUTCDate()===day?parsed:null;
}

export function hanbokRentalSourceFreshness(checkedAt:string,referenceDate:Date=new Date()):HanbokRentalSourceFreshness{
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(checkedAt);
 if(!match||Number.isNaN(referenceDate.getTime()))return'invalid';
 const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
 const checked=Date.UTC(year,month-1,day);
 const normalized=new Date(checked);
 if(normalized.getUTCFullYear()!==year||normalized.getUTCMonth()!==month-1||normalized.getUTCDate()!==day)return'invalid';
 const reference=Date.UTC(referenceDate.getUTCFullYear(),referenceDate.getUTCMonth(),referenceDate.getUTCDate());
 const ageDays=Math.floor((reference-checked)/86_400_000);
 if(ageDays<0)return'invalid';
 return ageDays>30?'stale':'fresh';
}

export function hanbokRentalAvailabilityAt(shop:HanbokRentalShop,date:string,time:string):HanbokRentalAvailability{
 const weekday=weekdayInSeoul(date);const minute=toMinute(time);const visitDate=referenceDateForVisit(date);
 if(weekday<0||!Number.isFinite(minute)||!visitDate)return 'recheck';
 if(hanbokRentalSourceFreshness(shop.checkedAt,visitDate)!=='fresh')return 'recheck';
 if(shop.closedWeekdays.includes(weekday))return 'closed';
 if(minute<shop.openMinute||minute>=shop.closeMinute)return 'closed';
 return shop.scheduleConfidence==='verified'?'open':'recheck';
}

export function hanbokRentalMinutesUntilPublishedClose(shop:HanbokRentalShop,time:string,referenceDate:Date=new Date()){
 if(hanbokRentalSourceFreshness(shop.checkedAt,referenceDate)!=='fresh')return null;
 const minute=toMinute(time);
 if(!Number.isFinite(minute)||minute<shop.openMinute||minute>=shop.closeMinute)return null;
 return shop.closeMinute-minute;
}

export function hanbokRentalMapHref(shop:HanbokRentalShop){
 return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address}`)}`;
}

export function hanbokRentalToPalaceDirectionsHref(shop:HanbokRentalShop){
 const origin=encodeURIComponent(`${shop.name}, ${shop.address}`);
 const destination=encodeURIComponent('Gyeongbokgung Palace, 161 Sajik-ro, Jongno-gu, Seoul');
 return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=walking`;
}