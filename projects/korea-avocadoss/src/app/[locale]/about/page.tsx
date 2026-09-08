import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {LegalPage} from '@/features/legal/LegalPage';
import {localizedAlternates} from '@/lib/seo/localized-metadata';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;return{title:'About Korea Concierge',description:'How Korea Concierge builds practical, privacy-conscious Korea travel and culture tools.',alternates:localizedAlternates(locale,'/about')}}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;setRequestLocale(locale);return <LegalPage locale={locale} kind="about"/>;}
