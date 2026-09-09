export type FoodCategory='korean-meal'|'halal'|'traditional-tea'|'coffee';
export type ScheduleConfidence='verified'|'recheck';

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
