import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {SajuFunctionalExperience} from '@/features/culture/SajuFunctionalExperience';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>};
const TITLE:Record<string,string>={en:'Saju Fortune Reading · Korean Four Pillars','zh-CN':'四柱运势解读 · 韩国文化体验',ja:'四柱・運勢リーディング · 韓国文化体験','zh-TW':'四柱運勢解讀 · 韓國文化體驗',vi:'Đọc vận Saju · Trải nghiệm văn hóa Hàn Quốc',th:'อ่านดวงซาจู · ประสบการณ์วัฒนธรรมเกาหลี'};
const DESCRIPTION:Record<string,string>={en:'Calculate a deterministic Korean Four Pillars chart and explore a browser-local, rule-based cultural reading for your Day Master, Five Elements and next two years.','zh-CN':'输入出生日期、出生地时区与可选出生时间，计算确定性四柱，并查看日主、五行与未来两年的规则化文化解读。',ja:'生年月日・出生地タイムゾーン・任意の出生時刻から四柱を計算し、日主・五行・今後2年のルールベース文化解釈を表示します。','zh-TW':'輸入出生日期、出生地時區與選填出生時間，計算確定性四柱，並查看日主、五行與未來兩年的規則化文化解讀。',vi:'Tính Tứ trụ Saju xác định từ ngày sinh, múi giờ nơi sinh và giờ sinh tùy chọn, rồi xem diễn giải văn hóa theo quy tắc cho Nhật chủ, Ngũ hành và hai năm tới.',th:'คำนวณสี่เสาซาจูแบบกำหนดแน่นอนจากวันเกิด เขตเวลาสถานที่เกิด และเวลาเกิดที่เลือกได้ พร้อมการตีความเชิงวัฒนธรรมตามกฎสำหรับ Day Master ธาตุทั้งห้า และสองปีข้างหน้า'};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {locale}=await params;return{title:TITLE[locale]??TITLE.en,description:DESCRIPTION[locale]??DESCRIPTION.en,alternates:localizedAlternates(locale,'/culture/saju')}}
export default async function SajuPage({params}:PageProps){const {locale}=await params;setRequestLocale(locale);return <main><SajuFunctionalExperience locale={locale}/></main>;}
