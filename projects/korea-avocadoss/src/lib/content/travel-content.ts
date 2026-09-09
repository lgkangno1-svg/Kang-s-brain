import {GYEONGBOKGUNG_FOOD_PLACES} from '@/lib/travel/gyeongbokgung-food';
import type {FoodCategory,FoodPlace,ScheduleConfidence} from '@/lib/travel/gyeongbokgung-food-core';

export const CONTENT_TAGS={
 gyeongbokgungFood:'content:travel:gyeongbokgung-food'
} as const;

const FOOD_CATEGORIES=new Set<FoodCategory>(['korean-meal','halal','traditional-tea','coffee']);
const SCHEDULE_CONFIDENCE=new Set<ScheduleConfidence>(['verified','recheck']);

function isString(value:unknown):value is string{return typeof value==='string'&&value.trim().length>0;}
function isMinute(value:unknown):value is number{return Number.isInteger(value)&&Number(value)>=0&&Number(value)<=1440;}
function isWeekdayList(value:unknown):value is number[]{return Array.isArray(value)&&value.every(day=>Number.isInteger(day)&&day>=0&&day<=6);}

function isFoodPlace(value:unknown):value is FoodPlace{
 if(!value||typeof value!=='object')return false;
 const item=value as Record<string,unknown>;
 return isString(item.id)&&isString(item.name)&&FOOD_CATEGORIES.has(item.category as FoodCategory)&&
  isString(item.summary)&&isString(item.hours)&&isString(item.closed)&&isString(item.address)&&
  isString(item.sourceUrl)&&/^https:\/\//.test(item.sourceUrl)&&isString(item.checkedAt)&&/^\d{4}-\d{2}-\d{2}$/.test(item.checkedAt)&&
  (item.dietaryNote===undefined||typeof item.dietaryNote==='string')&&isMinute(item.openMinute)&&isMinute(item.closeMinute)&&
  isWeekdayList(item.closedWeekdays)&&SCHEDULE_CONFIDENCE.has(item.scheduleConfidence as ScheduleConfidence);
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

async function fetchSanityFoodPlaces():Promise<FoodPlace[]|null>{
 const config=sanityConfig();
 if(!config)return null;
 const query='*[_type == "travelFoodPlace" && region == "gyeongbokgung" && published == true] | order(name asc){id,name,category,summary,hours,closed,address,sourceUrl,checkedAt,dietaryNote,openMinute,closeMinute,closedWeekdays,scheduleConfidence}';
 const host=config.token?`${config.projectId}.api.sanity.io`:`${config.projectId}.apicdn.sanity.io`;
 const url=`https://${host}/v${config.apiVersion}/data/query/${encodeURIComponent(config.dataset)}?query=${encodeURIComponent(query)}`;
 try{
  const response=await fetch(url,{
   headers:config.token?{Authorization:`Bearer ${config.token}`}:{},
   next:{revalidate:21600,tags:[CONTENT_TAGS.gyeongbokgungFood]}
  });
  if(!response.ok)return null;
  const body=await response.json() as {result?:unknown};
  if(!Array.isArray(body.result))return null;
  const valid=body.result.filter(isFoodPlace);
  return valid.length===body.result.length&&valid.length>0?valid:null;
 }catch{return null;}
}

export async function getGyeongbokgungFoodPlaces():Promise<readonly FoodPlace[]>{
 const remote=await fetchSanityFoodPlaces();
 return remote??GYEONGBOKGUNG_FOOD_PLACES;
}

export function headlessContentEnabled(){return Boolean(sanityConfig());}
