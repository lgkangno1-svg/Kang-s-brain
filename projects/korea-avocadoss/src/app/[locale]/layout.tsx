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

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {
    default: 'Korea Concierge — Your Personal Korea Companion',
    template: '%s | Korea Concierge',
  },
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Readonly<{children: React.ReactNode; params: Promise<{locale: string}>;}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('Global');
  const help = await getTranslations('QuickHelp');
  const definition = getLocaleDefinition(locale);

  const nav = [
    [t('nav.gyeongbokgung'), '/explore/gyeongbokgung'],
    [t('nav.myColor'), '/color'],
    [t('nav.hanbok'), '/hanbok'],
    [t('nav.kCulture'), '/culture'],
    [t('nav.credits'), '/credits'],
  ] as const;

  return (
    <html lang={definition.htmlLang}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div data-locale={locale}>
            <header className="siteHeader">
              <Link className="brand" href="/">KOREA CONCIERGE</Link>
              <nav aria-label="Primary navigation">
                {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
                <a href="#quick-help">{help('launcherTitle')}</a>
              </nav>
              <LanguageSwitcher />
            </header>

            {children}

            <footer className="siteFooter">
              <strong>Korea Concierge</strong>
              <p>{t('footerTagline')}</p>
              <span>korea.avocadoss.co.kr</span>
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
