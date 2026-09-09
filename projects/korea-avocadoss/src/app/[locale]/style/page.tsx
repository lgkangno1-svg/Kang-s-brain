import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {StyleConsultationV2} from '@/features/looks/style-consultation-v2';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type StyleMeta={title:string;description:string};

const STYLE_META:Record<Locale,StyleMeta>={
  en:{title:'My Korea Look — Personalized Hanbok & Palace Style',description:'Choose your style, garment, color direction, trip priority and season to get a free curated 3-look plan for your Seoul visit.'},
  'zh-CN':{title:'My Korea Look — 个性化韩服与宫殿造型',description:'选择宫廷风格、服装类型、色彩方向、旅行重点和季节，免费获得适合首尔行程的3套精选造型计划。'},
  ja:{title:'My Korea Look — あなた向け韓服・宮殿スタイル',description:'宮殿スタイル、衣装、カラー方向、旅の優先、季節を選び、ソウル旅行向けの無料3ルックプランを確認できます。'},
  'zh-TW':{title:'My Korea Look — 個人化韓服與宮殿造型',description:'選擇宮廷風格、服裝類型、色彩方向、旅遊重點與季節，免費取得適合首爾行程的3套精選造型計畫。'},
  vi:{title:'My Korea Look — Hanbok và phong cách cung điện dành cho bạn',description:'Chọn phong cách, trang phục, hướng màu, ưu tiên chuyến đi và mùa để nhận kế hoạch 3 look miễn phí cho hành trình Seoul.'},
  th:{title:'My Korea Look — ฮันบกและสไตล์พระราชวังสำหรับคุณ',description:'เลือกสไตล์ ชุด โทนสี ความสำคัญของทริป และฤดู เพื่อรับแผน 3 ลุคฟรีที่คัดสรรสำหรับการเที่ยวโซลของคุณ'}
};

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  const safeLocale=(locale in STYLE_META?locale:'en') as Locale;
  const meta=STYLE_META[safeLocale];
  return{title:meta.title,description:meta.description,alternates:localizedAlternates(safeLocale,'/style')};
}

export default async function StylePage({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  setRequestLocale(locale);
  return <main><StyleConsultationV2/></main>;
}
