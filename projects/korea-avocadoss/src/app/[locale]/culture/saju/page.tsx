import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {SajuDeepExperience} from '@/features/culture/SajuDeepExperience';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>};
const TITLE:Record<string,string>={en:'Saju Fortune Reading · Korean Four Pillars','zh-CN':'四柱运势解读 · 韩国文化体验',ja:'四柱・運勢リーディング · 韓国文化体験','zh-TW':'四柱運勢解讀 · 韓國文化體驗',vi:'Đọc vận Saju · Trải nghiệm văn hóa Hàn Quốc',th:'อ่านดวงซาจู · ประสบการณ์วัฒนธรรมเกาหลี'};
const DESCRIPTION:Record<string,string>={en:'Calculate a deterministic Korean Four Pillars chart and explore a browser-local cultural reading with Day Master, Five Elements, visible-stem Ten Gods and a five-year outlook.','zh-CN':'输入出生日期、出生地时区与可选出生时间，计算确定性四柱，并查看日主、五行、明透天干十神与未来五年走势。',ja:'生年月日・出生地タイムゾーン・任意の出生時刻から四柱を計算し、日主・五行・表の天干の十神・今後5年の流れを表示します。','zh-TW':'輸入出生日期、出生地時區與選填出生時間，計算確定性四柱，並查看日主、五行、明透天干十神與未來五年走勢。',vi:'Tính Tứ trụ Saju xác định từ ngày sinh, múi giờ nơi sinh và giờ sinh tùy chọn, rồi xem Nhật chủ, Ngũ hành, Thập thần của thiên can lộ và xu hướng 5 năm.',th:'คำนวณสี่เสาซาจูแบบกำหนดแน่นอนจากวันเกิด เขตเวลาสถานที่เกิด และเวลาเกิดที่เลือกได้ พร้อม Day Master ธาตุทั้งห้า สิบเทพของก้านฟ้าที่ปรากฏ และแนวโน้ม 5 ปี'};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {locale}=await params;return{title:TITLE[locale]??TITLE.en,description:DESCRIPTION[locale]??DESCRIPTION.en,alternates:localizedAlternates(locale,'/culture/saju')}}
export default async function SajuPage({params}:PageProps){const {locale}=await params;setRequestLocale(locale);return <main><SajuDeepExperience locale={locale}/></main>;}
