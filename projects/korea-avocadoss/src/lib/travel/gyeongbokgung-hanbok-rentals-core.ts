export type HanbokRentalLanguage='en'|'ja'|'zh';
export type HanbokRentalAvailability='open'|'closed'|'recheck';
export type HanbokRentalShop={
 id:string;name:string;koreanName:string;address:string;phone:string;priceFromKrw?:number;hoursLabel:string;
 openMinute:number;closeMinute:number;closedWeekdays:number[];scheduleConfidence:'verified'|'recheck';
 interpretationLanguages:HanbokRentalLanguage[];websiteLanguages:HanbokRentalLanguage[];supportNote:string;
 sourceLabel:string;sourceUrl:string;checkedAt:string;
};
function weekdayInSeoul(date:string){const parsed=new Date(`${date}T12:00:00+09:00`);return Number.isNaN(parsed.getTime())?-1:parsed.getUTCDay();}
function toMinute(value:string){const [hour,minute]=value.split(':').map(Number);return Number.isFinite(hour)&&Number.isFinite(minute)?hour*60+minute:NaN;}
export function hanbokRentalAvailabilityAt(shop:HanbokRentalShop,date:string,time:string):HanbokRentalAvailability{
 const weekday=weekdayInSeoul(date);const minute=toMinute(time);
 if(weekday<0||!Number.isFinite(minute))return 'recheck';
 if(shop.closedWeekdays.includes(weekday))return 'closed';
 if(minute<shop.openMinute||minute>=shop.closeMinute)return 'closed';
 return shop.scheduleConfidence==='verified'?'open':'recheck';
}
export function hanbokRentalMapHref(shop:HanbokRentalShop){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.name}, ${shop.address}`)}`;}
