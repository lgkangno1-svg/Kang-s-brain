import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {FoodFinder} from '@/features/explore/FoodFinder';
import {localizedAlternates} from '@/lib/seo/localized-metadata';
type Props={params:Promise<{locale:string}>};
const T:Record<string,string>={en:'Food near Gyeongbokgung','zh-CN':'景福宫附近美食',ja:'景福宮周辺の食事','zh-TW':'景福宮附近美食',vi:'Ăn uống gần Gyeongbokgung',th:'อาหารใกล้คยองบกกุง'};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params;return{title:T[locale]??T.en,description:'Source-checked Korean food, halal dining, traditional tea and coffee near Gyeongbokgung.',alternates:localizedAlternates(locale,'/explore/food')}}
export default async function FoodPage({params}:Props){const {locale}=await params;setRequestLocale(locale);return <main><FoodFinder locale={locale}/></main>}
