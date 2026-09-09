import {GYEONGBOKGUNG_FOOD_PLACES} from '@/lib/travel/gyeongbokgung-food';
import type {FoodCategory,FoodPlace,ScheduleConfidence} from '@/lib/travel/gyeongbokgung-food-core';
import {GYEONGBOKGUNG_HANBOK_RENTALS,type HanbokRentalLanguage,type HanbokRentalShop} from '@/lib/travel/gyeongbokgung-hanbok-rentals';
import {GYEONGBOKGUNG_NEARBY_STOPS} from '@/lib/travel/gyeongbokgung-nearby';
import type {NearbyStop} from '@/lib/travel/gyeongbokgung-nearby-core';

export const CONTENT_TAGS={
 gyeongbokgungFood:'content:travel:gyeongbokgung-food',
 gyeongbokgungHanbokRentals:'content:travel:gyeongbokgung-hanbok-rentals',
 gyeongbokgungNearby:'content:travel:gyeongbokgung-nearby'
} as const;

const FOOD_CATEGORIES=new Set<FoodCategory>(['korean-meal','halal','traditional-tea','coffee']);
const SCHEDULE_CONFIDENCE=new Set<ScheduleConfidence>(['verified','recheck']);
const RENTAL_LANGUAGES=new Set<HanbokRentalLanguage>(['en','ja','zh']);

function isString(value:unknown):value is string{return typeof value==='string'&&value.trim().length>0;}
function isMinute(value:unknown):value is number{return Number.isInteger(value)&&Number(value)>=0&&Number(value)<=1440;}
function isPositiveMinute(value:unknown):value is number{return Number.isInteger(value)&&Number(value)>0&&Number(value)<=1440;}
function isWeekdayList(value:unknown):value is number[]{return Array.isArray(value)&&value.every(day=>Number.isInteger(day)&&day>=0&&day<=6);}
function isLanguageList(value:unknown):value is HanbokRentalLanguage[]{return Array.isArray(value)&&value.every(language=>RENTAL_LANGUAGES.has(language as HanbokRentalLanguage));}

function isFoodPlace(value:unknown):value is FoodPlace{
 if(!value||typeof value!=='object')return false;
 const item=value as Record<string,unknown>;
 return isString(item.id)&&isString(item.name)&&FOOD_CATEGORIES.has(item.category as FoodCategory)&&
  isString(item.summary)&&isString(item.hours)&&isString(item.closed)&&isString(item.address)&&
  isString(item.sourceUrl)&&/^https:\/\//.test(item.sourceUrl)&&isString(item.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt)&&
  (item.dietaryNote===undefined||typeof item.dietaryNote==='string')&&isMinute(item.openMinute)&&isMinute(item.closeMinute)&&
  isWeekdayList(item.closedWeekdays)&&SCHEDULE_CONFIDENCE.has(item.scheduleConfidence as ScheduleConfidence);
}

function isHanbokRentalShop(value:unknown):value is HanbokRentalShop{
 if(!value||typeof value!=='object')return false;
 const item=value as Record<string,unknown>;
 return isString(item.id)&&isString(item.name)&&isString(item.koreanName)&&isString(item.address)&&isString(item.phone)&&
  (item.priceFromKrw===undefined||(Number.isInteger(item.priceFromKrw)&&Number(item.priceFromKrw)>=0))&&isString(item.hoursLabel)&&
  isMinute(item.openMinute)&&isMinute(item.closeMinute)&&isWeekdayList(item.closedWeekdays)&&
  SCHEDULE_CONFIDENCE.has(item.scheduleConfidence as ScheduleConfidence)&&isLanguageList(item.interpretationLanguages)&&
  isLanguageList(item.websiteLanguages)&&isString(item.supportNote)&&isString(item.sourceLabel)&&
  isString(item.sourceUrl)&&/^https:\/\//.test(item.sourceUrl)&&isString(item.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt);
}

function isNearbyStop(value:unknown):value is NearbyStop{
 if(!value||typeof value!=='object')return false;
 const item=value as Record<string,unknown>;
 const restricted=item.restrictedWindow;
 const restrictedValid=restricted===undefined||(Boolean(restricted)&&typeof restricted==='object'&&
  isMinute((restricted as Record<string,unknown>).openMinute)&&isMinute((restricted as Record<string,unknown>).closeMinute)&&
  isString((restricted as Record<string,unknown>).note));
 return isString(item.id)&&isString(item.name)&&isString(item.koreanName)&&isString(item.mapQuery)&&
  isPositiveMinute(item.minutes)&&isMinute(item.transferMinutes)&&isString(item.note)&&
  isString(item.sourceUrl)&&/^https:\/\//.test(item.sourceUrl)&&isString(item.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt)&&
  restrictedValid&&(item.closedWeekdays===undefined||isWeekdayList(item.closedWeekdays))&&
  (item.closureNote===undefined||typeof item.closureNote==='string');
}

function sanityConfig(){
 const source=process.env.KOREA_CONTENT_SOURCE?.trim().toLowerCase();
 const projectId=process.env.SANITY_PROJECT_ID?.trim();
 const dataset=process.env.SANITY_DATASET?.trim()||'production';
 const apiVersion=process.env.SANITY_API_VERSION?.trim()||'2026-05-20';
 const token=process.env.SANITY_READ_TOKEN?.trim();
 if(source!=='sanity'||!projectId||!/^[a-z0-9-]+$/i.test(projectId)||!/^[a-z0-9_-]+$/i.test(dataset)||!/^\d{4}-\d{2}-\d{2}$/.test(apiVersion))return null;
 return{projectId,dataset,apiVersion,token};
}

async function fetchSanity<T>(query:string,tag:string,validate:(value:unknown)=>value is T):Promise<T[]|null>{
 const config=sanityConfig();
 if(!config)return null;
 const host=config.token?`${config.projectId}.api.sanity.io`:`${config.projectId}.apicdn.sanity.io`;
 const url=`https://${host}/v${config.apiVersion}/data/query/${encodeURIComponent(config.dataset)}?query=${encodeURIComponent(query)}`;
 try{
  const response=await fetch(url,{headers:config.token?{Authorization:`Bearer ${config.token}`}:{},next:{revalidate:21600,tags:[tag]}});
  if(!response.ok)return null;
  const body=await response.json() as {result?:unknown};
  if(!Array.isArray(body.result))return null;
  const valid=body.result.filter(validate);
  return valid.length===body.result.length&&valid.length>0?valid:null;
 }catch{return null;}
}

async function fetchSanityFoodPlaces():Promise<FoodPlace[]|null>{
 return fetchSanity('*[_type == "travelFoodPlace" && region == "gyeongbokgung" && published == true] | order(name asc){id,name,category,summary,hours,closed,address,sourceUrl,checkedAt,dietaryNote,openMinute,closeMinute,closedWeekdays,scheduleConfidence}',CONTENT_TAGS.gyeongbokgungFood,isFoodPlace);
}

async function fetchSanityHanbokRentalShops():Promise<HanbokRentalShop[]|null>{
 return fetchSanity('*[_type == "hanbokRentalShop" && region == "gyeongbokgung" && published == true] | order(name asc){id,name,koreanName,address,phone,priceFromKrw,hoursLabel,openMinute,closeMinute,closedWeekdays,scheduleConfidence,interpretationLanguages,websiteLanguages,supportNote,sourceLabel,sourceUrl,checkedAt}',CONTENT_TAGS.gyeongbokgungHanbokRentals,isHanbokRentalShop);
}

async function fetchSanityNearbyStops():Promise<NearbyStop[]|null>{
 return fetchSanity('*[_type == "nearbyPlace" && region == "gyeongbokgung" && published == true] | order(name asc){id,name,koreanName,mapQuery,minutes,transferMinutes,note,sourceUrl,checkedAt,restrictedWindow,closedWeekdays,closureNote}',CONTENT_TAGS.gyeongbokgungNearby,isNearbyStop);
}

export async function getGyeongbokgungFoodPlaces():Promise<readonly FoodPlace[]>{
 const remote=await fetchSanityFoodPlaces();
 return remote??GYEONGBOKGUNG_FOOD_PLACES;
}

export async function getGyeongbokgungHanbokRentalShops():Promise<readonly HanbokRentalShop[]>{
 const remote=await fetchSanityHanbokRentalShops();
 return remote??GYEONGBOKGUNG_HANBOK_RENTALS;
}

export async function getGyeongbokgungNearbyStops():Promise<readonly NearbyStop[]>{
 const remote=await fetchSanityNearbyStops();
 return remote??GYEONGBOKGUNG_NEARBY_STOPS;
}

export function headlessContentEnabled(){return Boolean(sanityConfig());}
