import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

import {QuickHelp} from '@/features/quick-help/QuickHelp';
import {LanguageSwitcher} from '@/i18n/LanguageSwitcher';
import {Link} from '@/i18n/navigation';
import {routing} from '@/i18n/routing';
import {getLocaleDefinition} from '@/lib/i18n/locales';
import '../locale-overflow.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('Global');
  const definition = getLocaleDefinition(locale);

  const nav = [
    [t('nav.myColor'), '/color'],
    [t('nav.hanbok'), '/hanbok'],
    [t('nav.gyeongbokgung'), '/explore/gyeongbokgung'],
    [t('nav.kCulture'), '/culture'],
    [t('nav.credits'), '/credits'],
  ] as const;

  return (
    <NextIntlClientProvider messages={messages}>
      <div lang={definition.htmlLang} data-locale={locale}>
        <header className="siteHeader">
          <Link className="brand" href="/">KOREA CONCIERGE</Link>
          <nav aria-label="Primary navigation">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <LanguageSwitcher />
        </header>
        {children}
        <footer className="siteFooter">
          <strong>Korea Concierge</strong>
          <p>{t('footerTagline')}</p>
          <span>korea.avocadoss.co.kr</span>
        </footer>
        <QuickHelp localePrefix={`/${locale}`} />
      </div>
    </NextIntlClientProvider>
  );
}
