import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};
type P0Locale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';

type HomeCopy = {
  hero: string;
  color: string;
  colorAction: string;
  hanbok: string;
  hanbokAction: string;
  saju: string;
  sajuAction: string;
  naming: string;
  namingAction: string;
  explore: string;
  exploreAction: string;
  ask: string;
  askAction: string;
  prelaunchBadge: string;
  prelaunchTitle: string;
  prelaunchText: string;
  previewAction: string;
  sampleAction: string;
};

const HOME_COPY: Record<P0Locale, HomeCopy> = {
  en: {
    hero: 'Your Gateway to a Personalized Korean Experience.',
    color: 'FIND YOUR KOREAN COLOR PALETTE', colorAction: 'Analyze Now',
    hanbok: 'DISCOVER YOUR HANBOK STYLE', hanbokAction: 'Match My Style',
    saju: 'EXPLORE YOUR SAJU', sajuAction: 'Try Saju',
    naming: 'CREATE YOUR KOREAN NAME', namingAction: 'Create Names',
    explore: 'PLAN A GYEONGBOKGUNG DAY', exploreAction: 'Build My Route',
    ask: 'ASK ABOUT KOREA', askAction: 'Quick Help',
    prelaunchBadge: 'Premium guidebook preview · checkout not yet enabled',
    prelaunchTitle: 'My Korea Look — Personalized Styling & Palace Photo Guidebook',
    prelaunchText: 'Build your free look preview now. Paid checkout stays disabled until account ownership, delivery and payment recovery pass launch QA.',
    previewAction: 'Try the Free Style Preview',
    sampleAction: 'View Curated Samples',
  },
  'zh-CN': {
    hero: '开启专属于你的韩国体验。',
    color: '找到你的韩式个人色彩', colorAction: '开始分析',
    hanbok: '发现适合你的韩服风格', hanbokAction: '匹配风格',
    saju: '探索你的四柱', sajuAction: '体验四柱',
    naming: '创建你的韩国名字', namingAction: '生成名字',
    explore: '规划景福宫行程', exploreAction: '生成路线',
    ask: '询问韩国旅行', askAction: '快速帮助',
    prelaunchBadge: '高级指南预览 · 付款尚未开放',
    prelaunchTitle: 'My Korea Look — 个性化韩服与宫殿拍照指南',
    prelaunchText: '现在可以免费体验造型预览。账户归属、交付与支付恢复流程通过上线测试前不会开放真实付款。',
    previewAction: '免费体验造型',
    sampleAction: '查看示例',
  },
  ja: {
    hero: 'あなたのための韓国体験への入り口。',
    color: 'あなたの韓国パーソナルカラー', colorAction: '分析する',
    hanbok: 'あなたの韓服スタイルを発見', hanbokAction: 'スタイル診断',
    saju: '四柱を探る', sajuAction: '四柱を試す',
    naming: '韓国名をつくる', namingAction: '名前をつくる',
    explore: '景福宮の一日を計画', exploreAction: 'ルートを作る',
    ask: '韓国について聞く', askAction: 'クイックヘルプ',
    prelaunchBadge: 'プレミアムガイド試用版 · 決済はまだ未開放',
    prelaunchTitle: 'My Korea Look — パーソナル韓服＆宮殿フォトガイド',
    prelaunchText: '無料スタイルプレビューは利用できます。アカウント所有・納品・決済復旧のQAが完了するまで実決済は有効にしません。',
    previewAction: '無料スタイル診断',
    sampleAction: 'サンプルを見る',
  },
  'zh-TW': {
    hero: '開啟專屬於你的韓國體驗。',
    color: '找到你的韓式個人色彩', colorAction: '開始分析',
    hanbok: '探索適合你的韓服風格', hanbokAction: '配對風格',
    saju: '探索你的四柱', sajuAction: '體驗四柱',
    naming: '建立你的韓國名字', namingAction: '建立名字',
    explore: '規劃景福宮行程', exploreAction: '建立路線',
    ask: '詢問韓國旅行', askAction: '快速幫助',
    prelaunchBadge: '進階指南預覽 · 付款尚未開放',
    prelaunchTitle: 'My Korea Look — 個人化韓服與宮殿拍照指南',
    prelaunchText: '現在可免費體驗造型預覽。帳戶歸屬、交付與付款復原流程通過上線測試前不會開放真實付款。',
    previewAction: '免費體驗造型',
    sampleAction: '查看範例',
  },
  vi: {
    hero: 'Cánh cửa đến trải nghiệm Hàn Quốc dành riêng cho bạn.',
    color: 'TÌM BẢNG MÀU HÀN QUỐC CỦA BẠN', colorAction: 'Phân tích',
    hanbok: 'KHÁM PHÁ PHONG CÁCH HANBOK', hanbokAction: 'Ghép phong cách',
    saju: 'KHÁM PHÁ SAJU CỦA BẠN', sajuAction: 'Thử Saju',
    naming: 'TẠO TÊN HÀN QUỐC', namingAction: 'Tạo tên',
    explore: 'LÊN KẾ HOẠCH GYEONGBOKGUNG', exploreAction: 'Tạo lộ trình',
    ask: 'HỎI VỀ HÀN QUỐC', askAction: 'Trợ giúp nhanh',
    prelaunchBadge: 'Xem trước cẩm nang premium · chưa mở thanh toán',
    prelaunchTitle: 'My Korea Look — Cẩm nang Hanbok và chụp ảnh cung điện cá nhân hóa',
    prelaunchText: 'Bạn có thể dùng bản xem trước miễn phí ngay bây giờ. Thanh toán thật chỉ mở sau khi luồng tài khoản, giao kết quả và khôi phục thanh toán vượt qua QA.',
    previewAction: 'Thử phong cách miễn phí',
    sampleAction: 'Xem mẫu',
  },
  th: {
    hero: 'ประตูสู่ประสบการณ์เกาหลีที่ออกแบบเพื่อคุณ',
    color: 'ค้นหาโทนสีเกาหลีของคุณ', colorAction: 'วิเคราะห์',
    hanbok: 'ค้นหาสไตล์ฮันบกของคุณ', hanbokAction: 'จับคู่สไตล์',
    saju: 'สำรวจซาจูของคุณ', sajuAction: 'ลองซาจู',
    naming: 'สร้างชื่อเกาหลีของคุณ', namingAction: 'สร้างชื่อ',
    explore: 'วางแผนเที่ยวคยองบกกุง', exploreAction: 'สร้างเส้นทาง',
    ask: 'ถามเรื่องเกาหลี', askAction: 'ช่วยเหลือด่วน',
    prelaunchBadge: 'พรีวิวคู่มือพรีเมียม · ยังไม่เปิดชำระเงินจริง',
    prelaunchTitle: 'My Korea Look — คู่มือฮันบกและถ่ายภาพพระราชวังเฉพาะคุณ',
    prelaunchText: 'พรีวิวสไตล์ฟรีใช้งานได้แล้ว การชำระเงินจริงจะเปิดหลังระบบบัญชี การส่งมอบ และการกู้คืนการชำระเงินผ่าน QA เท่านั้น',
    previewAction: 'ลองพรีวิวสไตล์ฟรี',
    sampleAction: 'ดูตัวอย่าง',
  },
};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');
  return {title: meta('homeTitle'), description: meta('homeDescription'), alternates: localizedAlternates(locale, '')};
}

function RobotMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="14" y="19" width="36" height="29" rx="10" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M32 19v-7m-4 0h8M22 48v6m20-6v6M14 31H8m48 0h-6" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="25" cy="32" r="2.5" fill="currentColor" /><circle cx="39" cy="32" r="2.5" fill="currentColor" />
      <path d="M25 40c4 3 10 3 14 0" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default async function LocalizedHome({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const copy = HOME_COPY[locale as P0Locale] ?? HOME_COPY.en;

  return (
    <main className="stitchReferenceHome">
      <section className="stitchReferenceHero" aria-labelledby="home-title">
        <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeonghoeru_Pavilion_at_Gyeongbokgung_Palace.jpg?width=1800" alt="Gyeonghoeru Pavilion at Gyeongbokgung Palace" referrerPolicy="no-referrer" />
        <div className="stitchReferenceHeroCopy"><h1 id="home-title">{copy.hero}</h1></div>
      </section>

      <section style={{margin:'20px auto 32px',maxWidth:'1200px',padding:'0 20px',width:'100%'}}>
        <div style={{background:'linear-gradient(135deg, #1C1917 0%, #2D5A4C 100%)',borderRadius:'16px',padding:'28px 24px',color:'#FFFFFF',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:'12px',boxShadow:'0 8px 30px rgba(0,0,0,0.12)'}}>
          <span style={{background:'rgba(212, 175, 55, 0.25)',border:'1px solid #D4AF37',color:'#D4AF37',fontSize:'11px',fontWeight:700,padding:'3px 12px',borderRadius:'999px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{copy.prelaunchBadge}</span>
          <h2 style={{fontSize:'clamp(22px, 3vw, 28px)',fontWeight:800,margin:0}}>{copy.prelaunchTitle}</h2>
          <p style={{fontSize:'15px',color:'rgba(255,255,255,0.85)',maxWidth:'700px',margin:0,lineHeight:1.6}}>{copy.prelaunchText}</p>
          <div style={{display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center',marginTop:'8px'}}>
            <Link href="/style" style={{background:'var(--dancheong-crimson, #9E2A2B)',color:'#FFFFFF',fontWeight:700,fontSize:'14px',padding:'12px 24px',borderRadius:'999px',textDecoration:'none',boxShadow:'0 4px 14px rgba(158, 42, 43, 0.4)'}}>{copy.previewAction} →</Link>
            <Link href="/style/sample/palace-elegance" style={{background:'rgba(255,255,255,0.12)',color:'#FFFFFF',fontWeight:600,fontSize:'14px',padding:'12px 20px',borderRadius:'999px',textDecoration:'none',border:'1px solid rgba(255,255,255,0.2)'}}>{copy.sampleAction}</Link>
          </div>
        </div>
      </section>

      <section className="stitchReferenceServices" aria-label="Korea Concierge services">
        <Link className="stitchReferenceCard" href="/color"><span className="stitchReferenceMedia stitchColorMedia" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></span><strong>{copy.color}</strong><span className="stitchReferenceButton">{copy.colorAction}</span></Link>
        <Link className="stitchReferenceCard" href="/hanbok"><span className="stitchReferenceMedia"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/One_girl_wearing_traditional_Korean_costume_in_Gyeongbokgung%2Cthe_Seoul_palace_04.jpg?width=700" alt="" referrerPolicy="no-referrer" /></span><strong>{copy.hanbok}</strong><span className="stitchReferenceButton">{copy.hanbokAction}</span></Link>
        <Link className="stitchReferenceCard" href="/culture/saju"><span className="stitchReferenceMedia stitchSajuMedia" aria-hidden="true"><span>四柱</span></span><strong>{copy.saju}</strong><span className="stitchReferenceButton">{copy.sajuAction}</span></Link>
        <Link className="stitchReferenceCard" href="/culture/naming"><span className="stitchReferenceMedia stitchNamingMedia" aria-hidden="true"><span>한글</span></span><strong>{copy.naming}</strong><span className="stitchReferenceButton">{copy.namingAction}</span></Link>
        <Link className="stitchReferenceCard" href="/explore/gyeongbokgung"><span className="stitchReferenceMedia stitchSajuMedia" aria-hidden="true"><span>景福宮</span></span><strong>{copy.explore}</strong><span className="stitchReferenceButton">{copy.exploreAction}</span></Link>
        <a className="stitchReferenceCard" href="#quick-help"><span className="stitchReferenceMedia stitchAiMedia" aria-hidden="true"><RobotMark /></span><strong>{copy.ask}</strong><span className="stitchReferenceButton">{copy.askAction}</span></a>
      </section>
    </main>
  );
}
