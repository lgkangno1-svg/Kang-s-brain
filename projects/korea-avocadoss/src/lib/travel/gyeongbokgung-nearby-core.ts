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
 closedDates?:string[];
 closureNote?:string;
};
export type NearbyWalkingLeg={
 fromId:string;
 toId:string;
 minutes:number;
 sourceUrl:string;
 checkedAt:string;
 confidence:'medium';
 note:string;
};

const ROUTES:Record<NearbyFocus,Record<NearbyBudget,string[]>>={
 easy:{60:['gwanghwamun','info'],120:['gwanghwamun','info','insadong'],180:['gwanghwamun','info','insadong']},
 seochon:{60:['seochon'],120:['seochon','suseongdong'],180:['seochon','suseongdong','gwanghwamun']},
 bukchon:{60:['bukchon'],120:['bukchon','insadong'],180:['bukchon','insadong','gwanghwamun']},
 insadong:{60:['insadong'],120:['insadong','gwanghwamun'],180:['insadong','gwanghwamun','info']}
};

// Conservative planning values, not live routing. These are intentionally local deterministic
// data so route budgeting does not depend on a client API. Each leg is source-traceable and
// the generated result still hands the visitor to provider-native walking directions.
export const NEARBY_WALKING_LEGS:readonly NearbyWalkingLeg[]=[
 {fromId:'gyeongbokgung',toId:'gwanghwamun',minutes:5,sourceUrl:'https://koreadaddy.com/gwanghwamun-square-guide/',checkedAt:'2026-09-11',confidence:'medium',note:'Current 2026 guide places Gyeongbokgung about a 5-minute walk from Gwanghwamun Square; use the live map for crossings and exact exit position.'},
 {fromId:'gyeongbokgung',toId:'seochon',minutes:12,sourceUrl:'https://seoulhanbok.com/en/blog/where-to-stay-near-gyeongbokgung/',checkedAt:'2026-09-11',confidence:'medium',note:'Map-based visitor estimate is about 10–15 minutes from Seochon to Gwanghwamun main gate; 12 minutes is used only as a planning midpoint.'},
 {fromId:'gyeongbokgung',toId:'bukchon',minutes:15,sourceUrl:'https://www.rome2rio.com/s/Gyeongbokgung/Bukchon-Hanok-Village',checkedAt:'2026-09-11',confidence:'medium',note:'Current route reference reports roughly 13 minutes on foot; rounded up for conservative itinerary budgeting.'},
 {fromId:'gyeongbokgung',toId:'insadong',minutes:20,sourceUrl:'https://www.rome2rio.com/s/Gyeongbokgung/Insadong',checkedAt:'2026-09-11',confidence:'medium',note:'Current route reference reports roughly 19 minutes on foot; rounded up for conservative itinerary budgeting.'},
 {fromId:'gwanghwamun',toId:'info',minutes:5,sourceUrl:'https://english.visitseoul.net/attractions/Gwanghwamun-Tourist-Information-Center/ENP027225',checkedAt:'2026-09-11',confidence:'medium',note:'The information center is in the Gwanghwamun visitor area; five minutes reserves a short orientation/crossing buffer rather than claiming live routing.'},
 {fromId:'info',toId:'insadong',minutes:15,sourceUrl:'https://www.rome2rio.com/s/Gwanghwamun-Square/Insadong',checkedAt:'2026-09-11',confidence:'medium',note:'Gwanghwamun Square to Insadong is currently listed at about 15 minutes on foot; the information-center start is treated as the same visitor-area origin.'},
 {fromId:'seochon',toId:'suseongdong',minutes:18,sourceUrl:'https://www.kikispawprints.com/2026/06/suseongdong-valley-seoul-hidden-gem-seochon.html',checkedAt:'2026-09-11',confidence:'medium',note:'Current walking guidance from the Gyeongbokgung/Seochon approach to Suseongdong is about 15–20 minutes; 18 minutes is a planning midpoint.'},
 {fromId:'suseongdong',toId:'gwanghwamun',minutes:25,sourceUrl:'https://www.kikispawprints.com/2026/06/suseongdong-valley-seoul-hidden-gem-seochon.html',checkedAt:'2026-09-11',confidence:'medium',note:'Composite conservative return estimate: roughly 15–20 minutes from the valley toward Gyeongbokgung Station plus the short continuation toward Gwanghwamun; verify the exact live route.'},
 {fromId:'bukchon',toId:'insadong',minutes:15,sourceUrl:'https://www.rome2rio.com/s/Bukchon-Hanok-Village/Insadong',checkedAt:'2026-09-11',confidence:'medium',note:'Current route reference reports about 14 minutes on foot; rounded up for conservative itinerary budgeting.'},
 {fromId:'insadong',toId:'gwanghwamun',minutes:15,sourceUrl:'https://www.rome2rio.com/s/Insadong/Gwanghwamun-Square',checkedAt:'2026-09-11',confidence:'medium',note:'Current route reference reports about 15 minutes on foot.'},
 {fromId:'gwanghwamun',toId:'info',minutes:5,sourceUrl:'https://english.visitseoul.net/attractions/Gwanghwamun-Tourist-Information-Center/ENP027225',checkedAt:'2026-09-11',confidence:'medium',note:'The information center is in the Gwanghwamun visitor area; five minutes reserves a short orientation/crossing buffer rather than claiming live routing.'}
];

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
 if(stop.closedDates?.includes(date))return'closed';
 if(stop.closedWeekdays?.includes(weekday))return'closed';
 if(stop.restrictedWindow&&(minute<stop.restrictedWindow.openMinute||minute>=stop.restrictedWindow.closeMinute))return'outside-window';
 return'available';
}

export function nearbyWalkingLeg(fromId:string,toId:string){
 return NEARBY_WALKING_LEGS.find(leg=>leg.fromId===fromId&&leg.toId===toId)??null;
}

export function nearbyRoute(stops:readonly NearbyStop[],focus:NearbyFocus,budget:NearbyBudget,date?:string){
 const byId=new Map(stops.map(stop=>[stop.id,stop]));
 const ids=ROUTES[focus][budget];
 let remaining=budget;
 let previousId='gyeongbokgung';
 const result:Array<NearbyStop&{transferSourceUrl:string;transferCheckedAt:string;transferConfidence:'medium';transferNote:string}>=[];
 for(const id of ids){
  const base=byId.get(id);
  if(!base)continue;
  if(date&&nearbyStopAvailabilityAt(base,date,720)==='closed')continue;
  const leg=nearbyWalkingLeg(previousId,base.id);
  if(!leg)break;
  const availableStay=remaining-leg.minutes;
  if(availableStay<15)break;
  const stay=Math.min(base.minutes,availableStay);
  result.push({...base,minutes:stay,transferMinutes:leg.minutes,transferSourceUrl:leg.sourceUrl,transferCheckedAt:leg.checkedAt,transferConfidence:leg.confidence,transferNote:leg.note});
  remaining-=leg.minutes+stay;
  previousId=base.id;
 }
 return result;
}

export function nearbyMapUrl(query:string){return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;}

export function nearbyRouteMapUrl(stops:readonly NearbyStop[],origin='Gyeongbokgung Palace'){
 if(!stops.length)return'';
 const destination=stops.at(-1)?.mapQuery;
 if(!destination)return'';
 const waypoints=stops.slice(0,-1).map(stop=>stop.mapQuery).join('|');
 const params=new URLSearchParams({api:'1',origin,destination,travelmode:'walking'});
 if(waypoints)params.set('waypoints',waypoints);
 return`https://www.google.com/maps/dir/?${params.toString()}`;
}
