import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {SajuExperience} from '@/features/culture/SajuExperience';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>};
const TITLE:Record<string,string>={en:'Saju · Korean Four Pillars','zh-CN':'四柱 · 韩国文化体验',ja:'四柱 · 韓国文化体験','zh-TW':'四柱 · 韓國文化體驗',vi:'Saju · Trải nghiệm văn hóa Hàn Quốc',th:'ซาจู · ประสบการณ์วัฒนธรรมเกาหลี'};
const DESCRIPTION:Record<string,string>={en:'Try a deterministic Korean Saju cultural chart with exact, approximate, or unknown birth time.','zh-CN':'输入出生日期，并可选择准确、大概或未知出生时间，体验确定性韩国四柱文化命盘。',ja:'生年月日と、正確・おおよそ・不明の出生時刻から韓国の四柱文化を体験できます。','zh-TW':'輸入出生日期，並可選擇準確、大概或未知出生時間，體驗確定性韓國四柱文化命盤。',vi:'Trải nghiệm biểu đồ Saju Hàn Quốc với giờ sinh chính xác, ước chừng hoặc không biết.',th:'ลองแผนผังซาจูเกาหลีแบบคำนวณกำหนดแน่นอน โดยเวลาเกิดอาจแม่นยำ โดยประมาณ หรือไม่ทราบ'};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {locale}=await params;return{title:TITLE[locale]??TITLE.en,description:DESCRIPTION[locale]??DESCRIPTION.en,alternates:localizedAlternates(locale,'/culture/saju')}}
export default async function SajuPage({params}:PageProps){const {locale}=await params;setRequestLocale(locale);return <main><SajuExperience locale={locale}/></main>;}
