import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {NearbyExplorer} from '@/features/explore/NearbyExplorer';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{
 const {locale}=await params;setRequestLocale(locale);
 return{title:'Near Gyeongbokgung itinerary | Korea Concierge',description:'Build a free 1–3 hour Seochon, Bukchon, Insadong or Gwanghwamun route after Gyeongbokgung.',alternates:localizedAlternates(locale,'/explore/nearby')};
}
export default async function NearbyPage({params}:PageProps){const {locale}=await params;setRequestLocale(locale);return <main><NearbyExplorer locale={locale}/></main>;}
