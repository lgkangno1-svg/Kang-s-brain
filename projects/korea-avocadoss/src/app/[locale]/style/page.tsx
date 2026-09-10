import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {StyleConsultationV3} from '@/features/looks/style-consultation-v3';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type StyleMeta={title:string;description:string};

const STYLE_META:Record<Locale,StyleMeta>={
  en:{title:'My Korea Look — Personalized Hanbok & Palace Style',description:'Choose style, garment, palette, mood, comfort, coverage, season or visit date, and destination for a free curated 3-look Seoul plan.'},
  'zh-CN':{title:'My Korea Look — 个性化韩服与宫殿造型',description:'选择风格、服装、配色、氛围、舒适度、遮盖度、季节或到访日期与目的地，免费获得3套首尔造型计划。'},
  ja:{title:'My Korea Look — あなた向け韓服・宮殿スタイル',description:'スタイル、衣装、配色、ムード、快適さ、カバー範囲、季節または訪問日、目的地を選び、無料3ルックプランを確認できます。'},
  'zh-TW':{title:'My Korea Look — 個人化韓服與宮殿造型',description:'選擇風格、服裝、配色、氛圍、舒適度、遮蓋度、季節或到訪日期與目的地，免費取得3套首爾造型計畫。'},
  vi:{title:'My Korea Look — Hanbok và phong cách cung điện dành cho bạn',description:'Chọn phong cách, trang phục, bảng màu, không khí, độ thoải mái, độ che phủ, mùa hoặc ngày đi và điểm đến để nhận kế hoạch 3 look miễn phí.'},
  th:{title:'My Korea Look — ฮันบกและสไตล์พระราชวังสำหรับคุณ',description:'เลือกสไตล์ ชุด พาเลต อารมณ์ ความสบาย การปกปิด ฤดูหรือวันที่ไป และจุดหมาย เพื่อรับแผน 3 ลุคฟรีสำหรับโซล'}
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
  return <main><StyleConsultationV3/></main>;
}
