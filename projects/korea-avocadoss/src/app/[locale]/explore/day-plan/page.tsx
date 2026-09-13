import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {KoreaDayPlanner} from '@/features/explore/KoreaDayPlanner';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
const META:Record<Locale,{title:string;description:string}>={
 en:{title:'Seoul Hanbok & Gyeongbokgung Day Planner',description:'Build a practical Hanbok fitting, Gyeongbokgung visit and food or cafe schedule using source-checked local data.'},
 'zh-CN':{title:'首尔韩服与景福宫一日规划',description:'用已核对来源的数据安排韩服试穿、景福宫参观以及餐饮或咖啡时间。'},
 ja:{title:'ソウル韓服・景福宮1日プランナー',description:'出典確認済みデータから韓服試着、景福宮、食事・カフェを1つの実用的な日程にまとめます。'},
 'zh-TW':{title:'首爾韓服與景福宮一日規劃',description:'用已核對來源的資料安排韓服試穿、景福宮參觀以及餐飲或咖啡時間。'},
 vi:{title:'Lịch một ngày Hanbok & Gyeongbokgung ở Seoul',description:'Lập lịch thử Hanbok, tham quan Gyeongbokgung và ăn uống bằng dữ liệu địa phương đã kiểm tra nguồn.'},
 th:{title:'วางแผนหนึ่งวัน: ฮันบกและคยองบกกุง',description:'จัดเวลาลองฮันบก เที่ยวคยองบกกุง และอาหารหรือคาเฟ่จากข้อมูลที่ตรวจสอบแหล่งที่มาแล้ว'}
};

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
 const {locale}=await params;const l=(locale in META?locale:'en') as Locale;const meta=META[l];
 return{title:meta.title,description:meta.description,alternates:localizedAlternates(l,'/explore/day-plan')};
}

export default async function DayPlanPage({params}:{params:Promise<{locale:string}>}){
 const {locale}=await params;setRequestLocale(locale);return <main><KoreaDayPlanner locale={locale}/></main>;
}
