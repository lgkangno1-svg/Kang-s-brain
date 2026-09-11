import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {LegalPage} from '@/features/legal/LegalPage';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  return {
    title:'Refunds & Cancellations — Korea Concierge',
    description:'Pre-launch refund and cancellation status for Korea Concierge, including the planned My Korea Look recovery boundary.',
    alternates:localizedAlternates(locale,'/refunds'),
  };
}

export default async function Page({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  setRequestLocale(locale);
  return <LegalPage locale={locale} kind="refunds"/>;
}
