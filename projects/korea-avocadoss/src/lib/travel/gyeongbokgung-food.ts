export type FoodCategory='korean-meal'|'halal'|'traditional-tea'|'coffee';
export type ScheduleConfidence='verified'|'recheck';
export type FoodPlace={id:string;name:string;category:FoodCategory;summary:string;hours:string;closed:string;address:string;sourceUrl:string;checkedAt:string;dietaryNote?:string;openMinute:number;closeMinute:number;closedWeekdays:number[];scheduleConfidence:ScheduleConfidence};
export const GYEONGBOKGUNG_FOOD_PLACES:readonly FoodPlace[]=[
 {id:'tosokchon',name:'Tosokchon Samgyetang',category:'korean-meal',summary:'Traditional samgyetang (ginseng chicken soup) in a hanok near Gyeongbokgung.',hours:'10:00–22:00 · last order 21:00',closed:'Open all year according to the current official tourism listing.',address:'5 Jahamun-ro 5-gil, Jongno-gu, Seoul',sourceUrl:'https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=97919',checkedAt:'2026-09-09',openMinute:600,closeMinute:1320,closedWeekdays:[],scheduleConfidence:'verified'},
 {id:'iftar',name:'iftar',category:'halal',summary:'Traditional Korean dishes using ingredients described by Visit Seoul as certified under strict halal standards.',hours:'11:30–19:30',closed:'Check the current listing before visiting.',address:'1F, 50-1 Jahamun-ro 1-gil, Jongno-gu, Seoul',sourceUrl:'https://english.visitseoul.net/restaurants/iftar/ENPjp7b57',checkedAt:'2026-09-09',dietaryNote:'Visit Seoul lists no alcohol for sale and Muslim cooks available. Always confirm individual dietary requirements directly.',openMinute:690,closeMinute:1170,closedWeekdays:[],scheduleConfidence:'recheck'},
 {id:'seochon-dagwabang',name:'Seochon Dagwabang',category:'traditional-tea',summary:'Hanok cafe serving traditional tea and handmade Korean desserts near Gyeongbokgung Station.',hours:'11:00–20:00',closed:'Tuesday',address:'6 Pirundae-ro, Jongno-gu, Seoul',sourceUrl:'https://english.visitseoul.net/restaurants/dagwabang/ENPjmmeg3',checkedAt:'2026-09-09',openMinute:660,closeMinute:1200,closedWeekdays:[2],scheduleConfidence:'verified'},
 {id:'tailor-coffee-seochon',name:'Tailor Coffee Seochon Gyeongbokgung Branch',category:'coffee',summary:'Coffee and bakery stop along the western Gyeongbokgung stone-wall path.',hours:'08:00–21:00',closed:'Daily according to the current Visit Seoul listing.',address:'Seochon, west side of Gyeongbokgung Palace, Seoul',sourceUrl:'https://english.visitseoul.net/restaurants/tailorcoffee/ENPoy0arv',checkedAt:'2026-09-09',openMinute:480,closeMinute:1260,closedWeekdays:[],scheduleConfidence:'verified'},
];
export function filterFoodPlaces(category:FoodCategory|'all'){return category==='all'?[...GYEONGBOKGUNG_FOOD_PLACES]:GYEONGBOKGUNG_FOOD_PLACES.filter(place=>place.category===category);}
export function foodAvailabilityAt(place:FoodPlace,date:string,time:string):'open'|'closed'|'verify'|'unknown'{
 if(!date||!time||!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time))return 'unknown';
 if(place.scheduleConfidence==='recheck')return 'verify';
 const day=new Date(`${date}T12:00:00+09:00`).getUTCDay();
 if(place.closedWeekdays.includes(day))return 'closed';
 const [h,m]=time.split(':').map(Number);const minute=h*60+m;
 return minute>=place.openMinute&&minute<place.closeMinute?'open':'closed';
}
