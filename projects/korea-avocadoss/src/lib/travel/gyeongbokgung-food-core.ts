export type FoodCategory='korean-meal'|'halal'|'traditional-tea'|'coffee';
export type ScheduleConfidence='verified'|'recheck';
export type SourceFreshness='fresh'|'stale'|'invalid';

export type FoodPlace={
 id:string;
 name:string;
 category:FoodCategory;
 summary:string;
 hours:string;
 closed:string;
 address:string;
 sourceUrl:string;
 checkedAt:string;
 dietaryNote?:string;
 openMinute:number;
 closeMinute:number;
 closedWeekdays:number[];
 scheduleConfidence:ScheduleConfidence;
};

export function filterFoodPlaces(places:readonly FoodPlace[],category:FoodCategory|'all'){
 return category==='all'?[...places]:places.filter(place=>place.category===category);
}

export function foodAvailabilityAt(place:FoodPlace,date:string,time:string):'open'|'closed'|'verify'|'unknown'{
 if(!date||!time||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))return 'unknown';
 if(place.scheduleConfidence==='recheck')return 'verify';
 const day=new Date(`${date}T12:00:00+09:00`).getUTCDay();
 if(place.closedWeekdays.includes(day))return 'closed';
 const [h,m]=time.split(':').map(Number);const minute=h*60+m;
 return minute>=place.openMinute&&minute<place.closeMinute?'open':'closed';
}

export function foodSourceFreshness(checkedAt:string,now:Date=new Date()):SourceFreshness{
 const match=/^(\d{4})-(\d{2})-(\d{2})$/.exec(checkedAt);
 if(!match||Number.isNaN(now.getTime()))return 'invalid';
 const year=Number(match[1]),month=Number(match[2]),day=Number(match[3]);
 const checked=Date.UTC(year,month-1,day);
 const normalized=new Date(checked);
 if(normalized.getUTCFullYear()!==year||normalized.getUTCMonth()!==month-1||normalized.getUTCDate()!==day)return 'invalid';
 const today=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
 const ageDays=Math.floor((today-checked)/86_400_000);
 if(ageDays<0)return 'invalid';
 return ageDays>30?'stale':'fresh';
}
