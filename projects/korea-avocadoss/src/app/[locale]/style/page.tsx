import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {StyleConsultationV2} from '@/features/looks/style-consultation-v2';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return{title:'My Korea Look — Personalized Hanbok & Palace Style',description:'Change your style, garment, color, walking/photo priority and season to get a real-time curated Korea Look recommendation.',alternates:localizedAlternates(locale,'/style')}}
export default async function StylePage({params}:{params:Promise<{locale:string}>}){const {locale}=await params;setRequestLocale(locale);return <main><StyleConsultationV2/></main>}
