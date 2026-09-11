import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {NamingStudio} from '@/features/culture/NamingStudio';
import {NamingCatalogExplorer} from '@/features/culture/NamingCatalogExplorer';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>};
const TITLE:Record<string,string>={en:'Korean Naming Studio','zh-CN':'韩文命名工作室',ja:'韓国名スタジオ','zh-TW':'韓文命名工作室',vi:'Korean Naming Studio',th:'Korean Naming Studio'};
const DESCRIPTION:Record<string,string>={en:'Generate and compare free Korean-style name ideas from a curated catalog without an AI API.','zh-CN':'无需 AI API，免费从人工整理的名字库生成、搜索和比较韩文风格名字灵感。',ja:'AI APIを使わず、選定済みカタログから無料で韓国風の名前候補を生成・検索・比較できます。','zh-TW':'無需 AI API，免費從人工整理的名字庫產生、搜尋與比較韓文風格名字靈感。',vi:'Tạo, tìm và so sánh miễn phí ý tưởng tên kiểu Hàn từ danh mục tuyển chọn, không cần AI API.',th:'สร้าง ค้นหา และเปรียบเทียบไอเดียชื่อสไตล์เกาหลีฟรีจากคลังที่คัดสรร โดยไม่ใช้ AI API'};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {locale}=await params;return{title:TITLE[locale]??TITLE.en,description:DESCRIPTION[locale]??DESCRIPTION.en,alternates:localizedAlternates(locale,'/culture/naming')}}
export default async function NamingPage({params}:PageProps){const {locale}=await params;setRequestLocale(locale);return <main><NamingStudio locale={locale}/><NamingCatalogExplorer locale={locale}/></main>;}
