import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {SajuCompleteExperience} from '@/features/culture/SajuCompleteExperience';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps={params:Promise<{locale:string}>};
const TITLE:Record<string,string>={en:'Saju Fortune Reading · Korean Four Pillars','zh-CN':'四柱运势解读 · 韩国文化体验',ja:'四柱・運勢リーディング · 韓国文化体験','zh-TW':'四柱運勢解讀 · 韓國文化體驗',vi:'Đọc vận Saju · Trải nghiệm văn hóa Hàn Quốc',th:'อ่านดวงซาจู · ประสบการณ์วัฒนธรรมเกาหลี'};
const DESCRIPTION:Record<string,string>={en:'Calculate a deterministic Korean Four Pillars chart and explore a browser-local five-year cultural reading for work, money, relationships and life pace.','zh-CN':'输入出生信息计算确定性四柱，并查看未来五年在工作、资源、关系与生活节奏上的本地规则化文化解读。',ja:'出生情報から四柱を計算し、今後5年の仕事・資源・人間関係・生活ペースをブラウザ内の固定ルールで読み解きます。','zh-TW':'輸入出生資料計算確定性四柱，並查看未來五年在工作、資源、關係與生活節奏上的本機規則化文化解讀。',vi:'Tính Tứ trụ Saju xác định và xem diễn giải văn hóa 5 năm chạy cục bộ cho công việc, nguồn lực, quan hệ và nhịp sống.',th:'คำนวณสี่เสาซาจูแบบกำหนดแน่นอนและดูคำอ่านเชิงวัฒนธรรม 5 ปีในเบราว์เซอร์สำหรับงาน ทรัพยากร ความสัมพันธ์ และจังหวะชีวิต'};
export async function generateMetadata({params}:PageProps):Promise<Metadata>{const {locale}=await params;return{title:TITLE[locale]??TITLE.en,description:DESCRIPTION[locale]??DESCRIPTION.en,alternates:localizedAlternates(locale,'/culture/saju')}}
export default async function SajuPage({params}:PageProps){const {locale}=await params;setRequestLocale(locale);return <main className="kcSajuPage"><SajuCompleteExperience locale={locale}/></main>;}
