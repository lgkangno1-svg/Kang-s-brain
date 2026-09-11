import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {StyleConsultationV5} from '@/features/looks/style-consultation-v5';
import {Link} from '@/i18n/navigation';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type StyleMeta={title:string;description:string};
type SuggestRecovery={title:string;body:string;cta:string};

const STYLE_META:Record<Locale,StyleMeta>={
  en:{title:'My Korea Look — Personalized Hanbok & Palace Style',description:'Choose style, garment, palette, mood, comfort, coverage, season or visit date, and destination for one free curated Seoul look preview.'},
  'zh-CN':{title:'My Korea Look — 个性化韩服与宫殿造型',description:'选择风格、服装、配色、氛围、舒适度、遮盖度、季节或到访日期与目的地，免费获得1套首尔造型预览。'},
  ja:{title:'My Korea Look — あなた向け韓服・宮殿スタイル',description:'スタイル、衣装、配色、ムード、快適さ、カバー範囲、季節または訪問日、目的地を選び、無料1ルックのプレビューを確認できます。'},
  'zh-TW':{title:'My Korea Look — 個人化韓服與宮殿造型',description:'選擇風格、服裝、配色、氛圍、舒適度、遮蓋度、季節或到訪日期與目的地，免費取得1套首爾造型預覽。'},
  vi:{title:'My Korea Look — Hanbok và phong cách cung điện dành cho bạn',description:'Chọn phong cách, trang phục, bảng màu, không khí, độ thoải mái, độ che phủ, mùa hoặc ngày đi và điểm đến để nhận bản xem trước 1 look miễn phí.'},
  th:{title:'My Korea Look — ฮันบกและสไตล์พระราชวังสำหรับคุณ',description:'เลือกสไตล์ ชุด พาเลต อารมณ์ ความสบาย การปกปิด ฤดูหรือวันที่ไป และจุดหมาย เพื่อรับพรีวิวลุคโซลฟรี 1 ลุค'}
};

const SUGGEST_RECOVERY:Record<Locale,SuggestRecovery>={
  en:{title:'Using “Suggest for me”?',body:'This free page does not guess a color direction from nothing. Run the browser-local Personal Color preview first, or choose one of the named palettes. Your photo stays on your device in the free preview.',cta:'Open Personal Color'},
  'zh-CN':{title:'想使用“帮我推荐”？',body:'此免费页面不会在没有依据时猜测配色方向。请先使用仅在浏览器本地处理的个人色彩预览，或直接选择一个明确的配色。免费预览中的照片会保留在你的设备上。',cta:'打开个人色彩'},
  ja:{title:'「おすすめ」を使う場合',body:'この無料ページは根拠なく色方向を推測しません。まずブラウザ内だけで処理するパーソナルカラーのプレビューを実行するか、明示された配色を選んでください。無料プレビューの写真は端末内に留まります。',cta:'パーソナルカラーを開く'},
  'zh-TW':{title:'想使用「幫我推薦」？',body:'此免費頁面不會在沒有依據時猜測配色方向。請先使用只在瀏覽器本地處理的個人色彩預覽，或直接選擇一個明確配色。免費預覽中的照片會留在你的裝置上。',cta:'開啟個人色彩'},
  vi:{title:'Muốn dùng “Gợi ý cho tôi”?',body:'Trang miễn phí này không tự đoán hướng màu khi không có căn cứ. Hãy chạy bản xem trước Personal Color xử lý ngay trong trình duyệt trước, hoặc chọn một bảng màu có tên. Ảnh của bạn vẫn ở trên thiết bị trong bản xem trước miễn phí.',cta:'Mở Personal Color'},
  th:{title:'ต้องการใช้ “ช่วยแนะนำ” ใช่ไหม?',body:'หน้าฟรีนี้จะไม่เดาทิศทางสีโดยไม่มีข้อมูลรองรับ ให้ลอง Personal Color ที่ประมวลผลในเบราว์เซอร์ก่อน หรือเลือกพาเลตที่ระบุชื่อไว้ รูปภาพจะอยู่บนอุปกรณ์ของคุณในพรีวิวฟรี',cta:'เปิด Personal Color'}
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
  const safeLocale=(locale in SUGGEST_RECOVERY?locale:'en') as Locale;
  const recovery=SUGGEST_RECOVERY[safeLocale];
  return <main>
    <aside aria-labelledby="style-suggest-recovery-title" style={{maxWidth:1080,margin:'22px auto 0',padding:'0 20px'}}>
      <div style={{border:'1px solid currentColor',borderRadius:12,padding:'14px 16px'}}>
        <strong id="style-suggest-recovery-title">{recovery.title}</strong>
        <p style={{margin:'8px 0'}}>{recovery.body}</p>
        <Link className="secondaryButton" href="/color">{recovery.cta}</Link>
      </div>
    </aside>
    <StyleConsultationV5/>
  </main>;
}
