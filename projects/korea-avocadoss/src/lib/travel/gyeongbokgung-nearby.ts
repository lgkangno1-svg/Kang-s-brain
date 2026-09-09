export type NearbyFocus='seochon'|'bukchon'|'insadong'|'easy';
export type NearbyBudget=60|120|180;
export type NearbyAvailability='available'|'closed'|'outside-window'|'recheck';
export type NearbyStop={
 id:string;
 name:string;
 koreanName:string;
 mapQuery:string;
 minutes:number;
 transferMinutes:number;
 note:string;
 sourceUrl:string;
 checkedAt:string;
 restrictedWindow?:{openMinute:number;closeMinute:number;note:string};
 closedWeekdays?:number[];
 closureNote?:string;
};

const OFFICIAL={
 seochon:'https://english.visitseoul.net/PalaceArea/Seochon-Hanok-Village/ENN000624',
 bukchon:'https://english.visitseoul.net/area/Bukchon-Hanok-Village/ENP000261',
 insadong:'https://english.visitseoul.net/attractions/insa-dong/ENP000080',
 gwanghwamun:'https://english.visitseoul.net/attractions/gwanghwamun-square/ENP001899',
 info:'https://english.visitseoul.net/attractions/Gwanghwamun-Tourist-Information-Center/ENP027225'
} as const;

const STOP_LIBRARY:Record<string,NearbyStop>={
 gwanghwamun:{id:'gwanghwamun',name:'Gwanghwamun Square',koreanName:'광화문광장',mapQuery:'Gwanghwamun Square Seoul',minutes:30,transferMinutes:5,note:'Low-friction city-center stop with a broad palace-axis view.',sourceUrl:OFFICIAL.gwanghwamun,checkedAt:'2026-09-09'},
 info:{id:'info',name:'Gwanghwamun Tourist Information Center',koreanName:'광화문 관광안내소',mapQuery:'Gwanghwamun Tourist Information Center Seoul',minutes:15,transferMinutes:5,note:'Useful for maps and in-person travel help; official listing notes English, Chinese and Japanese assistance.',sourceUrl:OFFICIAL.info,checkedAt:'2026-09-09',restrictedWindow:{openMinute:600,closeMinute:1140,note:'Official listing: 10:00–19:00.'},closedWeekdays:[6],closureNote:'Official Visit Seoul listing: closed Saturdays; Lunar New Year and Chuseok closures also require a source re-check.'},
 seochon:{id:'seochon',name:'Seochon old alleys',koreanName:'서촌 골목',mapQuery:'Seochon Hanok Village Seoul',minutes:45,transferMinutes:12,note:'Quieter west-side neighborhood with old alleys, small shops and cultural traces.',sourceUrl:OFFICIAL.seochon,checkedAt:'2026-09-09'},
 suseongdong:{id:'suseongdong',name:'Suseongdong Valley direction',koreanName:'수성동계곡 방향',mapQuery:'Suseongdong Valley Seoul',minutes:45,transferMinutes:18,note:'A longer westward extension when you want a calmer walk rather than shopping.',sourceUrl:OFFICIAL.seochon,checkedAt:'2026-09-09'},
 bukchon:{id:'bukchon',name:'Bukchon Hanok Village',koreanName:'북촌한옥마을',mapQuery:'Bukchon Hanok Village Seoul',minutes:60,transferMinutes:18,note:'Residential hanok neighborhood. Keep voices low and respect resident-only or restricted access signs.',sourceUrl:OFFICIAL.bukchon,checkedAt:'2026-09-09',restrictedWindow:{openMinute:600,closeMinute:1020,note:'The official tourism listing notes 10:00–17:00 for the restricted Bukchon-ro 11-gil road area.'}},
 insadong:{id:'insadong',name:'Insadong',koreanName:'인사동',mapQuery:'Insadong Seoul',minutes:55,transferMinutes:15,note:'Traditional crafts, galleries, tea houses and souvenir browsing in a compact area.',sourceUrl:OFFICIAL.insadong,checkedAt:'2026-09-09'}
};

const ROUTES:Record<NearbyFocus,Record<NearbyBudget,string[]>>={
 easy:{60:['gwanghwamun','info'],120:['gwanghwamun','info','insadong'],180:['gwanghwamun','info','insadong']},
 seochon:{60:['seochon'],120:['seochon','suseongdong'],180:['seochon','suseongdong','gwanghwamun']},
 bukchon:{60:['bukchon'],120:['bukchon','insadong'],180:['bukchon','insadong','gwanghwamun']},
 insadong:{60:['insadong'],120:['insadong','gwanghwamun'],180:['insadong','gwanghwamun','info']}
};

function weekdayFromIso(date:string){
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
 if(!match)return null;
 const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
 const parsed=new Date(Date.UTC(year,month-1,day));
 if(parsed.getUTCFullYear()!==year||parsed.getUTCMonth()!==month-1||parsed.getUTCDate()!==day)return null;
 return parsed.getUTCDay();
}

export function nearbyStopAvailabilityAt(stop:NearbyStop,date:string,minute:number):NearbyAvailability{
 const weekday=weekdayFromIso(date);
 if(weekday===null)return'recheck';
 if(stop.closedWeekdays?.includes(weekday))return'closed';
 if(stop.restrictedWindow&&(minute<stop.restrictedWindow.openMinute||minute>=stop.restrictedWindow.closeMinute))return'outside-window';
 return'available';
}

export function nearbyRoute(focus:NearbyFocus,budget:NearbyBudget,date?:string){
 const ids=ROUTES[focus][budget];
 let remaining=budget;
 const result:NearbyStop[]=[];
 for(const id of ids){
  const base=STOP_LIBRARY[id];
  if(date&&nearbyStopAvailabilityAt(base,date,720)==='closed')continue;
  const required=(result.length?base.transferMinutes:0)+base.minutes;
  if(required>remaining&&result.length)break;
  const transfer=result.length?base.transferMinutes:0;
  const stay=Math.max(15,Math.min(base.minutes,remaining-transfer));
  if(stay<=0)break;
  result.push({...base,minutes:stay,transferMinutes:transfer});
  remaining-=transfer+stay;
 }
 return result;
}

export function nearbyMapUrl(query:string){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;}
