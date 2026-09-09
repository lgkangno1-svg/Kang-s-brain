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

export function nearbyRoute(stops:readonly NearbyStop[],focus:NearbyFocus,budget:NearbyBudget,date?:string){
 const byId=new Map(stops.map(stop=>[stop.id,stop]));
 const ids=ROUTES[focus][budget];
 let remaining=budget;
 const result:NearbyStop[]=[];
 for(const id of ids){
  const base=byId.get(id);
  if(!base)continue;
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

export function nearbyRouteMapUrl(stops:readonly NearbyStop[],origin='Gyeongbokgung Palace'){
 if(!stops.length)return'';
 const destination=stops.at(-1)?.mapQuery;
 if(!destination)return'';
 const waypoints=stops.slice(0,-1).map(stop=>stop.mapQuery).join('|');
 const params=new URLSearchParams({api:'1',origin,destination,travelmode:'walking'});
 if(waypoints)params.set('waypoints',waypoints);
 return`https://www.google.com/maps/dir/?${params.toString()}`;
}
