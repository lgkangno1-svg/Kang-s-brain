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

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {default: 'Korea Concierge — Your Personal Korea Companion', template: '%s | Korea Concierge'},
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover'};
export function generateStaticParams(){return routing.locales.map((locale)=>({locale}));}

type P0Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type ShellCopy={explore:string;style:string;color:string;hanbok:string;saju:string;naming:string;ai:string;futureConcierge:string;about:string;contact:string;privacy:string;terms:string};
const SHELL_COPY:Record<P0Locale,ShellCopy>={
 en:{explore:'EXPLORE',style:'MY LOOK',color:'PERSONAL COLOR',hanbok:'HANBOK',saju:'SAJU',naming:'NAMING STUDIO',ai:'AI CONCIERGE',futureConcierge:'Future premium concierge',about:'About Us',contact:'Contact',privacy:'Privacy Policy',terms:'Terms of Service'},
 'zh-CN':{explore:'探索',style:'定制造型',color:'个人色彩',hanbok:'韩服',saju:'四柱',naming:'韩文命名',ai:'AI 礼宾',futureConcierge:'未来高级礼宾服务',about:'关于我们',contact:'联系我们',privacy:'隐私政策',terms:'服务条款'},
 ja:{explore:'探す',style:'マイルック',color:'パーソナルカラー',hanbok:'韓服',saju:'四柱',naming:'韓国名スタジオ',ai:'AI コンシェルジュ',futureConcierge:'今後のプレミアムコンシェルジュ',about:'私たちについて',contact:'お問い合わせ',privacy:'プライバシーポリシー',terms:'利用規約'},
 'zh-TW':{explore:'探索',style:'客製造型',color:'個人色彩',hanbok:'韓服',saju:'四柱',naming:'韓文命名',ai:'AI 禮賓',futureConcierge:'未來進階禮賓服務',about:'關於我們',contact:'聯絡我們',privacy:'隱私政策',terms:'服務條款'},
 vi:{explore:'KHÁM PHÁ',style:'PHONG CÁCH',color:'MÀU CÁ NHÂN',hanbok:'HANBOK',saju:'SAJU',naming:'ĐẶT TÊN HÀN',ai:'AI CONCIERGE',futureConcierge:'Dịch vụ concierge cao cấp trong tương lai',about:'Về chúng tôi',contact:'Liên hệ',privacy:'Chính sách riêng tư',terms:'Điều khoản dịch vụ'},
 th:{explore:'สำรวจ',style:'สไตล์ของฉัน',color:'เพอร์ซันนัลคัลเลอร์',hanbok:'ฮันบก',saju:'ซาจู',naming:'ตั้งชื่อเกาหลี',ai:'AI CONCIERGE',futureConcierge:'คอนเซียร์จพรีเมียมในอนาคต',about:'เกี่ยวกับเรา',contact:'ติดต่อ',privacy:'นโยบายความเป็นส่วนตัว',terms:'ข้อกำหนดการใช้บริการ'},
};

export default async function LocaleLayout({children,params}:Readonly<{children:React.ReactNode;params:Promise<{locale:string}>}>){
 const {locale}=await params;if(!hasLocale(routing.locales,locale))notFound();setRequestLocale(locale);
 const messages=await getMessages();const t=await getTranslations('Global');const definition=getLocaleDefinition(locale);const shell=SHELL_COPY[locale as P0Locale]??SHELL_COPY.en;
 return <html lang={definition.htmlLang}><body><NextIntlClientProvider messages={messages}><div data-locale={locale} className="kcReferenceApp"><header className="siteHeader stitchReferenceHeader"><Link className="brand stitchReferenceBrand" href="/">KOREA CONCIERGE</Link><nav className="stitchReferenceNav" aria-label="Primary navigation"><Link href="/explore/gyeongbokgung">{shell.explore}</Link><Link href="/style" style={{color:'var(--dancheong-crimson, #9E2A2B)',fontWeight:700}}>{shell.style}</Link><Link href="/color">{shell.color}</Link><Link href="/hanbok">{shell.hanbok}</Link><Link href="/culture/saju">{shell.saju}</Link><Link href="/culture/naming">{shell.naming}</Link><span className="stitchDisabledNav" aria-disabled="true" title={shell.futureConcierge}>{shell.ai}</span></nav><LanguageSwitcher/></header>{children}<footer className="siteFooter stitchReferenceFooter"><div className="stitchFooterLinks" aria-label="Footer"><span>{shell.about}</span><span>{shell.contact}</span><span>{shell.privacy}</span><span>{shell.terms}</span></div><p>{t('footerTagline')}</p><div className="stitchSocialMarks" aria-hidden="true"><span>f</span><span>♥</span><span>◎</span><span>▶</span></div></footer><nav className="mobileBottomNav" aria-label="Mobile bottom navigation"><Link className="mobileNavItem" href="/style"><span className="mobileNavIcon">✦</span><span>{shell.style}</span></Link><Link className="mobileNavItem" href="/explore/gyeongbokgung"><span className="mobileNavIcon">⌖</span><span>{t('nav.gyeongbokgung')}</span></Link><Link className="mobileNavItem" href="/color"><span className="mobileNavIcon">◐</span><span>{t('nav.myColor')}</span></Link><Link className="mobileNavItem" href="/hanbok"><span className="mobileNavIcon">◇</span><span>{t('nav.hanbok')}</span></Link><Link className="mobileNavItem" href="/culture"><span className="mobileNavIcon">◎</span><span>{t('nav.kCulture')}</span></Link><Link className="mobileNavItem" href="/credits"><span className="mobileNavIcon">○</span><span>{t('nav.credits')}</span></Link></nav><QuickHelp localePrefix={`/${locale}`}/></div></NextIntlClientProvider></body></html>;
}
