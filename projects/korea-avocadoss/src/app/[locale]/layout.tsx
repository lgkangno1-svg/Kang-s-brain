import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { QuickHelp } from '@/features/quick-help/QuickHelp';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getLocaleDefinition } from '@/lib/i18n/locales';
import '../globals.css';
import '../locale-overflow.css';
import '../stitch-dashboard.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {
    default: 'Korea Concierge — Your Personal Korea Companion',
    template: '%s | Korea Concierge',
  },
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const primaryNav = [
  {label: 'Home', sub: '', icon: '⌂', href: '/'},
  {label: 'Plan Your Trip', sub: 'Itineraries · Attractions · Hotels', icon: '♙', href: '/explore/gyeongbokgung'},
  {label: 'Food & Dining', sub: 'Restaurants · Local Food', icon: '♨', href: '/culture'},
  {label: 'Culture & Experience', sub: 'Hanbok · Palaces · K-Culture', icon: '♜', href: '/hanbok'},
  {label: 'Saju & Fortune', sub: 'Four Pillars · Fortune · Personality', icon: '◉', href: '/culture'},
  {label: 'Quick Help', sub: 'Free · No Credits · No AI', icon: 'ⓘ', href: '/'},
] as const;

const accountNav = [
  {label: 'My Plan', icon: '▣', href: '/explore/gyeongbokgung'},
  {label: 'My Wallet', icon: '▤', href: '/credits'},
  {label: 'Settings', icon: '⚙', href: '/credits'},
] as const;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const definition = getLocaleDefinition(locale);

  return (
    <html lang={definition.htmlLang}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="kcAppShell" data-locale={locale}>
            <header className="kcTopbar">
              <Link className="kcBrand" href="/">
                <span className="kcBrandFlower" aria-hidden="true">✣</span>
                <span className="kcBrandCopy">
                  <strong>Korea Concierge</strong>
                  <small>Your Journey, Our AI Concierge</small>
                </span>
              </Link>
              <div className="kcTopActions">
                <LanguageSwitcher />
                <span className="kcCredits"><span className="kcCoin">●</span>1,250 credits</span>
                <span className="kcUserButton" aria-label="Account">●</span>
              </div>
            </header>

            <div className="kcWorkspace">
              <aside className="kcSidebar">
                <nav className="kcSideNav" aria-label="Primary navigation">
                  {primaryNav.map((item, index) => (
                    <Link key={`${item.label}-${index}`} className={`kcSideLink${index === 0 ? ' active' : ''}`} href={item.href}>
                      <span className="kcSideIcon" aria-hidden="true">{item.icon}</span>
                      <span className="kcSideText">
                        <b>{item.label}</b>
                        {item.sub ? <small>{item.sub}</small> : null}
                      </span>
                    </Link>
                  ))}
                  <span className="kcSideDivider" />
                  {accountNav.map((item) => (
                    <Link key={item.label} className="kcSideLink" href={item.href}>
                      <span className="kcSideIcon" aria-hidden="true">{item.icon}</span>
                      <span className="kcSideText"><b>{item.label}</b></span>
                    </Link>
                  ))}
                </nav>

                <div className="kcSidebarPromo">
                  <div className="kcPromoArt" aria-hidden="true" />
                  <div className="kcPromoCopy">
                    <strong>Discover a new side of Korea</strong>
                    <p>From ancient palaces to modern cities, we’re here to make your journey truly special.</p>
                  </div>
                </div>
              </aside>

              <div className="kcContent">{children}</div>
            </div>

            <QuickHelp localePrefix={`/${locale}`} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
