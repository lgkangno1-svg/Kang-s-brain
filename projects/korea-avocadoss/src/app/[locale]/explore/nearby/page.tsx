import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {NearbyExplorer} from '@/features/explore/NearbyExplorer';
import {getGyeongbokgungNearbyStops} from '@/lib/content/travel-content';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>;searchParams:Promise<{date?:string|string[];time?:string|string[]}>};
function one(value:string|string[]|undefined){return typeof value==='string'?value:undefined;}
function validDate(value:string|undefined){return value&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:undefined;}
function validTime(value:string|undefined){return value&&/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)?value:undefined;}
export async function generateMetadata({params}:PageProps):Promise<Metadata>{
 const {locale}=await params;setRequestLocale(locale);
 return{title:'Near Gyeongbokgung itinerary | Korea Concierge',description:'Build a free 1–3 hour Seochon, Bukchon, Insadong or Gwanghwamun route after Gyeongbokgung.',alternates:localizedAlternates(locale,'/explore/nearby')};
}
export default async function NearbyPage({params,searchParams}:PageProps){
 const [{locale},query]=await Promise.all([params,searchParams]);setRequestLocale(locale);
 const stops=await getGyeongbokgungNearbyStops();
 return <main><NearbyExplorer locale={locale} stops={stops} initialDate={validDate(one(query.date))} initialTime={validTime(one(query.time))}/></main>;
}
