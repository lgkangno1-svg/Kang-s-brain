import type {Metadata, Viewport} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {QuickHelp} from '@/features/quick-help/QuickHelp';
import {LanguageSwitcher} from '@/i18n/LanguageSwitcher';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getLocaleDefinition} from '@/lib/i18n/locales';
import '../globals.css';
import '../locale-overflow.css';
import '../stitch-premium.css';
import '../stitch-feature-polish.css';
import '../stitch-trust.css';
import '../stitch-reference-match.css';
import '../stitch-color-reference.css';
import '../stitch-state-overrides.css';
import '../stitch-quick-help-reference.css';
import '../stitch-quick-help-localized.css';
import '../responsive-system.css';
import '../editorial-redesign.css';
import '../editorial-fix.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {default: 'Korea Concierge — Your Personal Korea Companion', template: '%s | Korea Concierge'},
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover'};
export function generateStaticParams(){return routing.locales.map((locale)=>({locale}));}

type P0Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type ShellCopy={explore:string;style:string;color:string;hanbok:string;culture:string;quickHelp:string;about:string;contact:string;privacy:string;terms:string;beta:string;feedback:string};
const SHELL_COPY:Record<P0Locale,ShellCopy>={
 en:{explore:'EXPLORE',style:'MY LOOK',color:'PERSONAL COLOR',hanbok:'HANBOK',culture:'K-CULTURE',quickHelp:'QUICK HELP',about:'About Us',contact:'Contact',privacy:'Privacy Policy',terms:'Terms of Service',beta:'BETA',feedback:'Beta feedback'},
 'zh-CN':{explore:'探索',style:'定制造型',color:'个人色彩',hanbok:'韩服',culture:'韩国文化',quickHelp:'快速帮助',about:'关于我们',contact:'联系我们',privacy:'隐私政策',terms:'服务条款',beta:'测试版',feedback:'测试反馈'},
 ja:{explore:'探す',style:'マイルック',color:'パーソナルカラー',hanbok:'韓服',culture:'Kカルチャー',quickHelp:'クイックヘルプ',about:'私たちについて',contact:'お問い合わせ',privacy:'プライバシーポリシー',terms:'利用規約',beta:'ベータ',feedback:'ベータ版フィードバック'},
 'zh-TW':{explore:'探索',style:'客製造型',color:'個人色彩',hanbok:'韓服',culture:'韓國文化',quickHelp:'快速幫助',about:'關於我們',contact:'聯絡我們',privacy:'隱私政策',terms:'服務條款',beta:'測試版',feedback:'測試回饋'},
 vi:{explore:'KHÁM PHÁ',style:'PHONG CÁCH',color:'MÀU CÁ NHÂN',hanbok:'HANBOK',culture:'K-CULTURE',quickHelp:'TRỢ GIÚP NHANH',about:'Về chúng tôi',contact:'Liên hệ',privacy:'Chính sách riêng tư',terms:'Điều khoản dịch vụ',beta:'BETA',feedback:'Góp ý beta'},
 th:{explore:'สำรวจ',style:'สไตล์ของฉัน',color:'เพอร์ซันนัลคัลเลอร์',hanbok:'ฮันบก',culture:'K-CULTURE',quickHelp:'ช่วยเหลือด่วน',about:'เกี่ยวกับเรา',contact:'ติดต่อ',privacy:'นโยบายความเป็นส่วนตัว',terms:'ข้อกำหนดการใช้บริการ',beta:'เบต้า',feedback:'ส่งความคิดเห็นเบต้า'},
};

export default async function LocaleLayout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{locale:string}>}>){
 const {locale}=await params;if(!hasLocale(routing.locales,locale))notFound();setRequestLocale(locale);
 const [messages,t]=await Promise.all([getMessages(),getTranslations('Global')]);const definition=getLocaleDefinition(locale);const shell=SHELL_COPY[locale as P0Locale]??SHELL_COPY.en;
 return <html lang={definition.htmlLang}><body><NextIntlClientProvider messages={messages}><div data-locale={locale} className="kcReferenceApp"><header className="siteHeader stitchReferenceHeader"><div style={{display:'flex',alignItems:'center',gap:8,minWidth:0}}><Link className="brand stitchReferenceBrand" href="/">KOREA CONCIERGE</Link><span aria-label={shell.beta} title={shell.beta} style={{fontSize:10,fontWeight:800,letterSpacing:'.08em',padding:'3px 7px',borderRadius:999,border:'1px solid currentColor',lineHeight:1,whiteSpace:'nowrap'}}>{shell.beta}</span></div><nav className="stitchReferenceNav" aria-label="Primary navigation"><Link href="/explore/gyeongbokgung">{shell.explore}</Link><Link href="/style" style={{color:'var(--dancheong-crimson, #9E2A2B)',fontWeight:700}}>{shell.style}</Link><Link href="/color">{shell.color}</Link><Link href="/hanbok">{shell.hanbok}</Link><Link href="/culture">{shell.culture}</Link><Link href="/#quick-help">{shell.quickHelp}</Link></nav><LanguageSwitcher/></header>{children}<footer className="siteFooter stitchReferenceFooter"><div className="stitchFooterLinks" aria-label="Footer"><Link href="/about">{shell.about}</Link><Link href="/contact">{shell.contact}</Link><Link href="/privacy">{shell.privacy}</Link><Link href="/terms">{shell.terms}</Link><Link href="/contact">{shell.feedback}</Link></div><p>{t('footerTagline')}</p></footer><nav className="mobileBottomNav" aria-label="Mobile bottom navigation"><Link className="mobileNavItem" href="/style"><span className="mobileNavIcon">✦</span><span>{shell.style}</span></Link><Link className="mobileNavItem" href="/explore/gyeongbokgung"><span className="mobileNavIcon">⌖</span><span>{t('nav.gyeongbokgung')}</span></Link><Link className="mobileNavItem" href="/color"><span className="mobileNavIcon">◐</span><span>{t('nav.myColor')}</span></Link><Link className="mobileNavItem" href="/hanbok"><span className="mobileNavIcon">◇</span><span>{t('nav.hanbok')}</span></Link><Link className="mobileNavItem" href="/culture"><span className="mobileNavIcon">◎</span><span>{t('nav.kCulture')}</span></Link></nav><QuickHelp localePrefix={`/${locale}`}/></div></NextIntlClientProvider></body></html>;
}
