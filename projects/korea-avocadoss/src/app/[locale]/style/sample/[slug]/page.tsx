import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {setRequestLocale} from 'next-intl/server';
import {getSampleBySlug,getAllSampleSlugs} from '@/lib/looks/samples';
import {SampleView} from '@/features/looks/sample-view';
import {getSampleMetadata} from '@/features/looks/sample-localization';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

export function generateStaticParams(){return getAllSampleSlugs().map(slug=>({slug}));}

export async function generateMetadata({params}:{params:Promise<{locale:string;slug:string}>}):Promise<Metadata>{
 const {locale,slug}=await params;const sample=getSampleBySlug(slug);if(!sample)return{title:'Sample Not Found'};
 const localized=getSampleMetadata(locale,slug,sample);
 return{title:localized.title,description:localized.description,alternates:localizedAlternates(locale,`/style/sample/${slug}`)};
}

export default async function SamplePage({params}:{params:Promise<{locale:string;slug:string}>}){
 const {locale,slug}=await params;setRequestLocale(locale);const sample=getSampleBySlug(slug);if(!sample)notFound();
 return <main><SampleView stylebook={sample} currentSlug={slug}/></main>;
}
