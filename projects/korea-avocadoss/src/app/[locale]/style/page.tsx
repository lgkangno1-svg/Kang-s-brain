import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {StyleConsultationV5} from '@/features/looks/style-consultation-v5';
import {StyleInputModeChoice} from '@/features/looks/style-input-mode-choice';
import {Link} from '@/i18n/navigation';
import {parseStyleHandoff} from '@/lib/looks/style-handoff';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type StyleMeta={title:string;description:string};
type SuggestRecovery={title:string;body:string;cta:string};
type SampleShowcase={eyebrow:string;title:string;body:string;price:string;availability:string;cta:string;sampleLabels:[string,string,string]};
type PageProps={params:Promise<{locale:string}>;searchParams:Promise<Record<string,string|string[]|undefined>>};

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

const SAMPLE_SHOWCASE:Record<Locale,SampleShowcase>={
  en:{eyebrow:'SEE THE FULL VALUE FIRST',title:'What the planned paid stylebook is designed to include',body:'Before paying for anything, review three complete fictitious one-adult samples. They show the intended depth: three curated looks, color rationale, practical trade-offs, a Korean rental-shop request card, and a palace photo route.',price:'Planned launch price: $12 USD · one-time',availability:'Paid checkout is still closed until account ownership, private delivery, refund recovery, and merchant requirements are production-verified.',cta:'View full sample',sampleLabels:['Palace Elegance','Modern Pastel','Royal Ceremony']},
  'zh-CN':{eyebrow:'先看完整价值',title:'计划中的付费造型册会包含什么',body:'付款前先查看3个完整的虚构单人示例，了解预期深度：3套造型、配色理由、实用取舍、韩文租赁店请求卡和宫殿拍照路线。',price:'计划首发价：12美元 · 一次性付费',availability:'在账户归属、私密交付、退款恢复与商户要求通过生产验证前，付费结账仍保持关闭。',cta:'查看完整示例',sampleLabels:['宫殿优雅','现代柔彩','王室仪典']},
  ja:{eyebrow:'購入前に完成イメージを確認',title:'有料スタイルブックで提供予定の内容',body:'支払い前に、架空の成人1名を使った完成サンプル3件を確認できます。3ルック、配色理由、実用面の注意、韓国語レンタル依頼カード、宮殿撮影ルートまで含む想定です。',price:'予定ローンチ価格：12米ドル · 1回払い',availability:'アカウント所有、非公開配信、返金復旧、事業者要件が本番検証されるまで有料決済は閉じたままです。',cta:'完成サンプルを見る',sampleLabels:['Palace Elegance','Modern Pastel','Royal Ceremony']},
  'zh-TW':{eyebrow:'付款前先看完整價值',title:'規劃中的付費造型冊會包含什麼',body:'付款前可先查看3個完整的虛構單人範例，了解預期深度：3套造型、配色理由、實用取捨、韓文租借店需求卡與宮殿拍照路線。',price:'規劃首發價：12美元 · 一次性付款',availability:'在帳號歸屬、私人交付、退款復原與商家要求通過正式環境驗證前，付費結帳仍維持關閉。',cta:'查看完整範例',sampleLabels:['宮殿優雅','現代柔彩','王室儀典']},
  vi:{eyebrow:'XEM ĐẦY ĐỦ GIÁ TRỊ TRƯỚC',title:'Stylebook trả phí dự kiến sẽ bao gồm những gì',body:'Trước khi trả tiền, hãy xem 3 mẫu hoàn chỉnh hư cấu dành cho một người lớn. Mỗi mẫu thể hiện độ sâu dự kiến: 3 look, lý do chọn màu, điểm đánh đổi thực tế, thẻ yêu cầu thuê bằng tiếng Hàn và tuyến chụp ảnh cung điện.',price:'Giá ra mắt dự kiến: 12 USD · thanh toán một lần',availability:'Thanh toán trả phí vẫn đóng cho đến khi quyền sở hữu tài khoản, giao kết quả riêng tư, khôi phục hoàn tiền và yêu cầu thương nhân được xác minh ở production.',cta:'Xem mẫu đầy đủ',sampleLabels:['Thanh lịch cung điện','Pastel hiện đại','Nghi lễ hoàng gia']},
  th:{eyebrow:'ดูก่อนว่าคุ้มค่าอย่างไร',title:'สิ่งที่สไตล์บุ๊กแบบชำระเงินวางแผนจะมีให้',body:'ก่อนจ่ายเงิน สามารถดูตัวอย่างสมมติแบบเต็ม 3 แบบสำหรับผู้ใหญ่ 1 คน เพื่อเห็นระดับผลลัพธ์ที่ตั้งใจไว้: 3 ลุค เหตุผลด้านสี ข้อแลกเปลี่ยนในการใช้งานจริง การ์ดขอเช่าชุดภาษาเกาหลี และเส้นทางถ่ายภาพในพระราชวัง',price:'ราคาเปิดตัวที่วางแผนไว้: 12 USD · จ่ายครั้งเดียว',availability:'ระบบชำระเงินยังปิดอยู่จนกว่าการเป็นเจ้าของบัญชี การส่งมอบแบบส่วนตัว การกู้คืนการคืนเงิน และข้อกำหนดผู้ค้าจะผ่านการตรวจสอบในระบบจริง',cta:'ดูตัวอย่างเต็ม',sampleLabels:['ความสง่างามในพระราชวัง','พาสเทลสมัยใหม่','พิธีการราชวงศ์']}
};

const SAMPLE_SLUGS=['palace-elegance','modern-pastel','royal-ceremony'] as const;

export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{
  const {locale}=await params;
  const safeLocale=(locale in STYLE_META?locale:'en') as Locale;
  const meta=STYLE_META[safeLocale];
  return{title:meta.title,description:meta.description,alternates:localizedAlternates(safeLocale,'/style')};
}

export default async function StylePage({params,searchParams}:PageProps){
  const [{locale},query]=await Promise.all([params,searchParams]);
  setRequestLocale(locale);
  const safeLocale=(locale in SUGGEST_RECOVERY?locale:'en') as Locale;
  const recovery=SUGGEST_RECOVERY[safeLocale];
  const showcase=SAMPLE_SHOWCASE[safeLocale];
  const initialHandoff=parseStyleHandoff(query);
  return <main>
    <section aria-labelledby="style-paid-sample-title" style={{maxWidth:1080,margin:'24px auto 0',padding:'0 20px'}}>
      <div style={{border:'1px solid rgba(158,42,43,.32)',borderRadius:16,padding:'18px 18px 16px',background:'rgba(158,42,43,.035)'}}>
        <div style={{fontSize:11,fontWeight:800,letterSpacing:'.11em',color:'var(--dancheong-crimson, #9E2A2B)',marginBottom:6}}>{showcase.eyebrow}</div>
        <h2 id="style-paid-sample-title" style={{margin:'0 0 8px',fontSize:'clamp(1.2rem,3vw,1.65rem)'}}>{showcase.title}</h2>
        <p style={{margin:'0 0 10px',maxWidth:820}}>{showcase.body}</p>
        <p style={{margin:'0 0 4px',fontWeight:800}}>{showcase.price}</p>
        <p style={{margin:'0 0 14px',fontSize:13,opacity:.78,maxWidth:860}}>{showcase.availability}</p>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(205px,1fr))',gap:10}}>
          {SAMPLE_SLUGS.map((slug,index)=><Link key={slug} className="secondaryButton" href={`/style/sample/${slug}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,padding:'11px 13px'}}><span>{index+1}. {showcase.sampleLabels[index]}</span><span aria-hidden="true">→</span><span className="sr-only">{showcase.cta}</span></Link>)}
        </div>
      </div>
    </section>
    <aside aria-labelledby="style-suggest-recovery-title" style={{maxWidth:1080,margin:'22px auto 0',padding:'0 20px'}}>
      <div style={{border:'1px solid currentColor',borderRadius:12,padding:'14px 16px'}}>
        <strong id="style-suggest-recovery-title">{recovery.title}</strong>
        <p style={{margin:'8px 0'}}>{recovery.body}</p>
        <Link className="secondaryButton" href="/color">{recovery.cta}</Link>
      </div>
    </aside>
    <div style={{maxWidth:1080,margin:'0 auto',padding:'0 20px'}}><StyleInputModeChoice/></div>
    <StyleConsultationV5 initialHandoff={initialHandoff}/>
  </main>;
}
