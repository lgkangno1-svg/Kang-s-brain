import {GYEONGBOKGUNG_FOOD_PLACES} from './gyeongbokgung-food';
import {filterFoodPlaces,foodAvailabilityAt,foodSourceFreshness,type FoodCategory,type FoodPlace} from './gyeongbokgung-food-core';
import {GYEONGBOKGUNG_HANBOK_RENTALS,hanbokRentalAvailabilityAt,type HanbokRentalShop} from './gyeongbokgung-hanbok-rentals';
import {gyeongbokgungVisitFacts} from './gyeongbokgung-visit-facts';

export type PalaceDuration=60|120|240;
export type DayPlanWarningCode=
 |'palace-closed'
 |'before-open'
 |'after-last-admission'
 |'past-closing'
 |'rental-closed'
 |'rental-recheck'
 |'food-unavailable'
 |'food-source-stale';

export type KoreaDayPlanInput={
 date:string;
 palaceEntry:string;
 palaceMinutes:PalaceDuration;
 useHanbok:boolean;
 rentalShopId?:string;
 mealCategory:FoodCategory;
};

export type KoreaDayPlanEvent={
 id:'fitting'|'walk-to-palace'|'palace'|'return-hanbok'|'meal';
 start:string;
 end?:string;
 label:string;
};

export type KoreaDayPlan={
 valid:boolean;
 input:KoreaDayPlanInput;
 rentalShop?:HanbokRentalShop;
 mealPlace?:FoodPlace;
 mealAvailability?:ReturnType<typeof foodAvailabilityAt>;
 mealArrival:string;
 palaceEnd:string;
 events:KoreaDayPlanEvent[];
 warnings:DayPlanWarningCode[];
};

function minuteValue(value:string){
 const match=/^(\d{2}):(\d{2})$/.exec(value);
 if(!match)throw new RangeError('Use time in HH:MM format.');
 const hour=Number(match[1]),minute=Number(match[2]);
 if(hour<0||hour>23||minute<0||minute>59)throw new RangeError('Time is outside a valid day.');
 return hour*60+minute;
}

export function dayPlanClock(totalMinutes:number){
 const normalized=((Math.round(totalMinutes)%1440)+1440)%1440;
 return `${String(Math.floor(normalized/60)).padStart(2,'0')}:${String(normalized%60).padStart(2,'0')}`;
}

function selectMealPlace(category:FoodCategory,date:string,time:string,now:Date){
 const candidates=filterFoodPlaces(GYEONGBOKGUNG_FOOD_PLACES,category);
 const ranked=candidates.map(place=>({
  place,
  availability:foodAvailabilityAt(place,date,time),
  freshness:foodSourceFreshness(place.checkedAt,now)
 })).sort((a,b)=>{
  const availabilityRank={open:0,verify:1,unknown:2,closed:3};
  const freshnessRank={fresh:0,stale:1,invalid:2};
  return availabilityRank[a.availability]-availabilityRank[b.availability]||freshnessRank[a.freshness]-freshnessRank[b.freshness];
 });
 return ranked[0];
}

export function buildKoreaDayPlan(input:KoreaDayPlanInput,now:Date=new Date()):KoreaDayPlan{
 const facts=gyeongbokgungVisitFacts(input.date);
 const entry=minuteValue(input.palaceEntry);
 const open=minuteValue(facts.open),lastAdmission=minuteValue(facts.lastAdmission),close=minuteValue(facts.close);
 const palaceEnd=entry+input.palaceMinutes;
 const warnings:DayPlanWarningCode[]=[];
 if(facts.regularTuesdayClosure)warnings.push('palace-closed');
 if(entry<open)warnings.push('before-open');
 if(entry>lastAdmission)warnings.push('after-last-admission');
 if(palaceEnd>close)warnings.push('past-closing');

 let rentalShop:HanbokRentalShop|undefined;
 let fittingStart=entry;
 if(input.useHanbok){
  rentalShop=GYEONGBOKGUNG_HANBOK_RENTALS.find(shop=>shop.id===input.rentalShopId)??GYEONGBOKGUNG_HANBOK_RENTALS[0];
  fittingStart=entry-60; // 45 min fitting + conservative 15 min walk/entry buffer.
  const availability=hanbokRentalAvailabilityAt(rentalShop,input.date,dayPlanClock(fittingStart));
  if(availability==='closed')warnings.push('rental-closed');
  if(availability==='recheck')warnings.push('rental-recheck');
 }

 const returnEnd=palaceEnd+(input.useHanbok?30:0); // walking + garment return buffer.
 const mealArrival=dayPlanClock(returnEnd+15);
 const mealChoice=selectMealPlace(input.mealCategory,input.date,mealArrival,now);
 if(!mealChoice||mealChoice.availability==='closed'||mealChoice.availability==='unknown')warnings.push('food-unavailable');
 if(mealChoice&&mealChoice.freshness!=='fresh')warnings.push('food-source-stale');

 const events:KoreaDayPlanEvent[]=[];
 if(input.useHanbok&&rentalShop){
  events.push({id:'fitting',start:dayPlanClock(fittingStart),end:dayPlanClock(entry-15),label:rentalShop.name});
  events.push({id:'walk-to-palace',start:dayPlanClock(entry-15),end:dayPlanClock(entry),label:'Gyeongbokgung Palace'});
 }
 events.push({id:'palace',start:input.palaceEntry,end:dayPlanClock(palaceEnd),label:'Gyeongbokgung Palace'});
 if(input.useHanbok&&rentalShop){
  events.push({id:'return-hanbok',start:dayPlanClock(palaceEnd),end:dayPlanClock(returnEnd),label:rentalShop.name});
 }
 if(mealChoice&&mealChoice.availability!=='closed'&&mealChoice.availability!=='unknown'){
  events.push({id:'meal',start:mealArrival,label:mealChoice.place.name});
 }

 const blocking=new Set<DayPlanWarningCode>(['palace-closed','before-open','after-last-admission','past-closing','rental-closed']);
 return{
  valid:!warnings.some(code=>blocking.has(code)),input,rentalShop,
  mealPlace:mealChoice?.place,mealAvailability:mealChoice?.availability,
  mealArrival,palaceEnd:dayPlanClock(palaceEnd),events,warnings
 };
}

export function dayPlanFoodMapHref(place:FoodPlace){
 return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name}, ${place.address}`)}`;
}
