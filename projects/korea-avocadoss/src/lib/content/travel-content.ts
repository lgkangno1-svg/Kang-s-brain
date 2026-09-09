import {GYEONGBOKGUNG_FOOD_PLACES} from '@/lib/travel/gyeongbokgung-food';
import type {FoodCategory,FoodPlace,ScheduleConfidence} from '@/lib/travel/gyeongbokgung-food-core';
import {GYEONGBOKGUNG_HANBOK_RENTALS} from '@/lib/travel/gyeongbokgung-hanbok-rentals';
import type {HanbokRentalLanguage,HanbokRentalShop} from '@/lib/travel/gyeongbokgung-hanbok-rentals-core';

export const CONTENT_TAGS={
 gyeongbokgungFood:'content:travel:gyeongbokgung-food',
 gyeongbokgungHanbokRentals:'content:travel:gyeongbokgung-hanbok-rentals'
} as const;

const FOOD_CATEGORIES=new Set<FoodCategory>(['korean-meal','halal','traditional-tea','coffee']);
const SCHEDULE_CONFIDENCE=new Set<ScheduleConfidence>(['verified','recheck']);
const RENTAL_LANGUAGES=new Set<HanbokRentalLanguage>(['en','ja','zh']);

function isString(value:unknown):value is string{return typeof value==='string'&&value.trim().length>0;}
function isMinute(value:unknown):value is number{return Number.isInteger(value)&&Number(value)>=0&&Number(value)<=1440;}
function isWeekdayList(value:unknown):value is number[]{return Array.isArray(value)&&value.every(day=>Number.isInteger(day)&&day>=0&&day<=6);}
function isLanguageList(value:unknown):value is HanbokRentalLanguage[]{return Array.isArray(value)&&value.every(language=>RENTAL_LANGUAGES.has(language as HanbokRentalLanguage));}

function isFoodPlace(value:unknown):value is FoodPlace{
 if(!value||typeof value!=='object')return false;const item=value as Record<string,unknown>;
 return isString(item.id)&&isString(item.name)&&FOOD_CATEGORIES.has(item.category as FoodCategory)&&isString(item.summary)&&isString(item.hours)&&isString(item.closed)&&isString(item.address)&&isString(item.sourceUrl)&&/^https:\/\//.test(item.sourceUrl)&&isString(item.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt)&&(item.dietaryNote===undefined||typeof item.dietaryNote==='string')&&isMinute(item.openMinute)&&isMinute(item.closeMinute)&&isWeekdayList(item.closedWeekdays)&&SCHEDULE_CONFIDENCE.has(item.scheduleConfidence as ScheduleConfidence);
}
function isRentalShop(value:unknown):value is HanbokRentalShop{
 if(!value||typeof value!=='object')return false;const item=value as Record<string,unknown>;
 return isString(item.id)&&isString(item.name)&&isString(item.koreanName)&&isString(item.address)&&isString(item.phone)&&(item.priceFromKrw===undefined||(Number.isInteger(item.priceFromKrw)&&Number(item.priceFromKrw)>=0))&&isString(item.hoursLabel)&&isMinute(item.openMinute)&&isMinute(item.closeMinute)&&isWeekdayList(item.closedWeekdays)&&SCHEDULE_CONFIDENCE.has(item.scheduleConfidence as ScheduleConfidence)&&isLanguageList(item.interpretationLanguages)&&isLanguageList(item.websiteLanguages)&&isString(item.supportNote)&&isString(item.sourceLabel)&&isString(item.sourceUrl)&&/^https:\/\//.test(item.sourceUrl)&&isString(item.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt);
}

function sanityConfig(){
 const source=process.env.KOREA_CONTENT_SOURCE?.trim().toLowerCase();const projectId=process.env.SANITY_PROJECT_ID?.trim();const dataset=process.env.SANITY_DATASET?.trim()||'production';const apiVersion=process.env.SANITY_API_VERSION?.trim()||'2026-05-20';const token=process.env.SANITY_READ_TOKEN?.trim();
 if(source!=='sanity'||!projectId||!/^[a-z0-9-]+$/i.test(projectId)||!/^[a-z0-9_-]+$/i.test(dataset)||!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion))return null;return{projectId,dataset,apiVersion,token};
}
async function fetchSanityArray<T>(query:string,tag:string,validate:(value:unknown)=>value is T):Promise<T[]|null>{
 const config=sanityConfig();if(!config)return null;const host=config.token?`${config.projectId}.api.sanity.io`:`${config.projectId}.apicdn.sanity.io`;const url=`https://${host}/v${config.apiVersion}/data/query/${encodeURIComponent(config.dataset)}?query=${encodeURIComponent(query)}`;
 try{const response=await fetch(url,{headers:config.token?{Authorization:`Bearer ${config.token}`}:{},next:{revalidate:21600,tags:[tag]}});if(!response.ok)return null;const body=await response.json() as {result?:unknown};if(!Array.isArray(body.result))return null;const valid=body.result.filter(validate);return valid.length===body.result.length&&valid.length>0?valid:null;}catch{return null;}
}

export async function getGyeongbokgungFoodPlaces():Promise<readonly FoodPlace[]>{
 const query='*[_type == "travelFoodPlace" && region == "gyeongbokgung" && published == true] | order(name asc){id,name,category,summary,hours,closed,address,sourceUrl,checkedAt,dietaryNote,openMinute,closeMinute,closedWeekdays,scheduleConfidence}';
 return await fetchSanityArray(query,CONTENT_TAGS.gyeongbokgungFood,isFoodPlace)??GYEONGBOKGUNG_FOOD_PLACES;
}
export async function getGyeongbokgungHanbokRentals():Promise<readonly HanbokRentalShop[]>{
 const query='*[_type == "hanbokRentalShop" && region == "gyeongbokgung" && published == true] | order(name asc){id,name,koreanName,address,phone,priceFromKrw,hoursLabel,openMinute,closeMinute,closedWeekdays,scheduleConfidence,interpretationLanguages,websiteLanguages,supportNote,sourceLabel,sourceUrl,checkedAt}';
 return await fetchSanityArray(query,CONTENT_TAGS.gyeongbokgungHanbokRentals,isRentalShop)??GYEONGBOKGUNG_HANBOK_RENTALS;
}
export function headlessContentEnabled(){return Boolean(sanityConfig());}
