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
  ask: string;
  askAction: string;
};

const HOME_COPY: Record<P0Locale, HomeCopy> = {
  en: {
    hero: 'Your Gateway to a Personalized Korean Experience.',
    color: 'FIND YOUR KOREAN COLOR PALETTE', colorAction: 'Analyze Now',
    hanbok: 'DISCOVER YOUR HANBOK STYLE', hanbokAction: 'Browse Designs',
    saju: 'EXPLORE YOUR SAJU', sajuAction: 'Read Insights',
    naming: 'CREATE YOUR KOREAN NAME', namingAction: 'Coming Soon',
    ask: 'ASK ABOUT KOREA', askAction: 'Quick Help',
  },
  'zh-CN': {
    hero: '开启专属于你的韩国体验。',
    color: '找到你的韩式个人色彩', colorAction: '开始分析',
    hanbok: '发现适合你的韩服风格', hanbokAction: '浏览风格',
    saju: '探索你的四柱', sajuAction: '查看解读',
    naming: '创建你的韩国名字', namingAction: '即将推出',
    ask: '询问韩国旅行', askAction: '快速帮助',
  },
  ja: {
    hero: 'あなたのための韓国体験への入り口。',
    color: 'あなたの韓国パーソナルカラー', colorAction: '分析する',
    hanbok: 'あなたの韓服スタイルを発見', hanbokAction: 'スタイルを見る',
    saju: '四柱を探る', sajuAction: '解説を見る',
    naming: '韓国名をつくる', namingAction: '近日公開',
    ask: '韓国について聞く', askAction: 'クイックヘルプ',
  },
  'zh-TW': {
    hero: '開啟專屬於你的韓國體驗。',
    color: '找到你的韓式個人色彩', colorAction: '開始分析',
    hanbok: '探索適合你的韓服風格', hanbokAction: '瀏覽風格',
    saju: '探索你的四柱', sajuAction: '查看解讀',
    naming: '建立你的韓國名字', namingAction: '即將推出',
    ask: '詢問韓國旅行', askAction: '快速幫助',
  },
  vi: {
    hero: 'Cánh cửa đến trải nghiệm Hàn Quốc dành riêng cho bạn.',
    color: 'TÌM BẢNG MÀU HÀN QUỐC CỦA BẠN', colorAction: 'Phân tích',
    hanbok: 'KHÁM PHÁ PHONG CÁCH HANBOK', hanbokAction: 'Xem phong cách',
    saju: 'KHÁM PHÁ SAJU CỦA BẠN', sajuAction: 'Xem diễn giải',
    naming: 'TẠO TÊN HÀN QUỐC', namingAction: 'Sắp ra mắt',
    ask: 'HỎI VỀ HÀN QUỐC', askAction: 'Trợ giúp nhanh',
  },
  th: {
    hero: 'ประตูสู่ประสบการณ์เกาหลีที่ออกแบบเพื่อคุณ',
    color: 'ค้นหาโทนสีเกาหลีของคุณ', colorAction: 'วิเคราะห์',
    hanbok: 'ค้นหาสไตล์ฮันบกของคุณ', hanbokAction: 'ดูสไตล์',
    saju: 'สำรวจซาจูของคุณ', sajuAction: 'อ่านคำอธิบาย',
    naming: 'สร้างชื่อเกาหลีของคุณ', namingAction: 'เร็ว ๆ นี้',
    ask: 'ถามเรื่องเกาหลี', askAction: 'ช่วยเหลือด่วน',
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
        <img
          src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeonghoeru_Pavilion_at_Gyeongbokgung_Palace.jpg?width=1800"
          alt="Gyeonghoeru Pavilion at Gyeongbokgung Palace"
          referrerPolicy="no-referrer"
        />
        <div className="stitchReferenceHeroCopy"><h1 id="home-title">{copy.hero}</h1></div>
      </section>

      
      <section style={{
        margin: '20px auto 32px',
        maxWidth: '1200px',
        padding: '0 20px',
        width: '100%',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1C1917 0%, #2D5A4C 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        }}>
          <span style={{
            background: 'rgba(212, 175, 55, 0.25)',
            border: '1px solid #D4AF37',
            color: '#D4AF37',
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 12px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            Featured Paid Service · $12 USD
          </span>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, margin: 0 }}>
            My Korea Look — Personalized Styling & Palace Photo Guidebook
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', maxWidth: '640px', margin: 0, lineHeight: 1.6 }}>
            Get 3 complete curated Hanbok looks matched to your coloring, bilingual Korean shop cards to show rental staff in Seoul, and a 2-hour palace photo route.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '8px' }}>
            <Link href="/style" style={{
              background: 'var(--dancheong-crimson, #9E2A2B)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              padding: '12px 24px',
              borderRadius: '999px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(158, 42, 43, 0.4)',
            }}>
              Get My Korea Look ($12 USD) →
            </Link>
            <Link href="/style/sample/palace-elegance" style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '14px',
              padding: '12px 20px',
              borderRadius: '999px',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              View Curated Samples
            </Link>
          </div>
        </div>
      </section>

      <section className="stitchReferenceServices" aria-label="Korea Concierge services">
        <Link className="stitchReferenceCard" href="/color">
          <span className="stitchReferenceMedia stitchColorMedia" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </span>
          <strong>{copy.color}</strong>
          <span className="stitchReferenceButton">{copy.colorAction}</span>
        </Link>

        <Link className="stitchReferenceCard" href="/hanbok">
          <span className="stitchReferenceMedia">
            <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/One_girl_wearing_traditional_Korean_costume_in_Gyeongbokgung%2Cthe_Seoul_palace_04.jpg?width=700" alt="" referrerPolicy="no-referrer" />
          </span>
          <strong>{copy.hanbok}</strong>
          <span className="stitchReferenceButton">{copy.hanbokAction}</span>
        </Link>

        <Link className="stitchReferenceCard" href="/culture">
          <span className="stitchReferenceMedia stitchSajuMedia" aria-hidden="true"><span>四柱</span></span>
          <strong>{copy.saju}</strong>
          <span className="stitchReferenceButton">{copy.sajuAction}</span>
        </Link>

        <article className="stitchReferenceCard stitchReferenceCardDisabled" aria-label={`${copy.naming}: ${copy.namingAction}`}>
          <span className="stitchReferenceMedia stitchNamingMedia" aria-hidden="true"><span>한글</span></span>
          <strong>{copy.naming}</strong>
          <span className="stitchReferenceButton" aria-disabled="true">{copy.namingAction}</span>
        </article>

        <a className="stitchReferenceCard" href="#quick-help">
          <span className="stitchReferenceMedia stitchAiMedia" aria-hidden="true"><RobotMark /></span>
          <strong>{copy.ask}</strong>
          <span className="stitchReferenceButton">{copy.askAction}</span>
        </a>
      </section>
    </main>
  );
}
