import type {Metadata} from 'next';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {default: 'Korea Concierge — Your Personal Korea Companion', template: '%s | Korea Concierge'},
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};

export function generateStaticParams() { return routing.locales.map((locale) => ({locale})); }

type P0Locale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';

const NAV_COPY: Record<P0Locale, {explore: string; color: string; hanbok: string; saju: string; naming: string; ai: string}> = {
  en: {explore: 'EXPLORE', color: 'PERSONAL COLOR', hanbok: 'HANBOK', saju: 'SAJU', naming: 'NAMING STUDIO', ai: 'AI CONCIERGE'},
  'zh-CN': {explore: '探索', color: '个人色彩', hanbok: '韩服', saju: '四柱', naming: '韩文命名', ai: 'AI 礼宾'},
  ja: {explore: '探す', color: 'パーソナルカラー', hanbok: '韓服', saju: '四柱', naming: '韓国名スタジオ', ai: 'AI コンシェルジュ'},
  'zh-TW': {explore: '探索', color: '個人色彩', hanbok: '韓服', saju: '四柱', naming: '韓文命名', ai: 'AI 禮賓'},
  vi: {explore: 'KHÁM PHÁ', color: 'MÀU CÁ NHÂN', hanbok: 'HANBOK', saju: 'SAJU', naming: 'ĐẶT TÊN HÀN', ai: 'AI CONCIERGE'},
  th: {explore: 'สำรวจ', color: 'เพอร์ซันนัลคัลเลอร์', hanbok: 'ฮันบก', saju: 'ซาจู', naming: 'ตั้งชื่อเกาหลี', ai: 'AI CONCIERGE'},
};

export default async function LocaleLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>;}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('Global');
  const help = await getTranslations('QuickHelp');
  const definition = getLocaleDefinition(locale);
  const nav = NAV_COPY[locale as P0Locale] ?? NAV_COPY.en;

  return (
    <html lang={definition.htmlLang}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div data-locale={locale} className="kcReferenceApp">
            <header className="siteHeader stitchReferenceHeader">
              <Link className="brand stitchReferenceBrand" href="/">KOREA CONCIERGE</Link>
              <nav className="stitchReferenceNav" aria-label="Primary navigation">
                <Link href="/explore/gyeongbokgung">{nav.explore}</Link>
                <Link href="/color">{nav.color}</Link>
                <Link href="/hanbok">{nav.hanbok}</Link>
                <Link href="/culture">{nav.saju}</Link>
                <span className="stitchDisabledNav" aria-disabled="true" title="Coming soon">{nav.naming}</span>
                <span className="stitchDisabledNav" aria-disabled="true" title="Future premium concierge">{nav.ai}</span>
              </nav>
              <LanguageSwitcher />
            </header>
            {children}
            <footer className="siteFooter stitchReferenceFooter">
              <div className="stitchFooterLinks" aria-label="Footer">
                <span>About Us</span><span>Contact</span><span>Privacy Policy</span><span>Terms of Service</span>
              </div>
              <p>{t('footerTagline')}</p>
              <div className="stitchSocialMarks" aria-hidden="true"><span>f</span><span>♥</span><span>◎</span><span>▶</span></div>
            </footer>
            <nav className="mobileBottomNav" aria-label="Mobile bottom navigation">
              <Link className="mobileNavItem" href="/explore/gyeongbokgung"><span className="mobileNavIcon">⌖</span><span>{t('nav.gyeongbokgung')}</span></Link>
              <Link className="mobileNavItem" href="/color"><span className="mobileNavIcon">◐</span><span>{t('nav.myColor')}</span></Link>
              <Link className="mobileNavItem" href="/hanbok"><span className="mobileNavIcon">◇</span><span>{t('nav.hanbok')}</span></Link>
              <Link className="mobileNavItem" href="/culture"><span className="mobileNavIcon">◎</span><span>{t('nav.kCulture')}</span></Link>
              <Link className="mobileNavItem" href="/credits"><span className="mobileNavIcon">○</span><span>{t('nav.credits')}</span></Link>
            </nav>
            <QuickHelp localePrefix={`/${locale}`} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
