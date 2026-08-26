"use client";

import {NextIntlClientProvider} from 'next-intl';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ReactNode} from 'react';

import coreEnglishMessages from '../../messages/en.json';
import {QuickHelp} from '@/features/quick-help/QuickHelp';
import {P0_LOCALES} from '@/lib/i18n/locales';

const nav = [
  ['My Color', '/color'],
  ['Hanbok', '/hanbok'],
  ['Gyeongbokgung', '/explore/gyeongbokgung'],
  ['K-Culture', '/culture'],
  ['Credits', '/credits'],
] as const;

function isLocaleRoute(pathname: string) {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return (P0_LOCALES as readonly string[]).includes(firstSegment ?? '');
}

export function LegacyShell({children}: {children: ReactNode}) {
  const pathname = usePathname();

  if (isLocaleRoute(pathname)) {
    return children;
  }

  return (
    <>
      <header className="siteHeader">
        <Link className="brand" href="/">KOREA CONCIERGE</Link>
        <nav aria-label="Primary navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <span className="langButton" aria-label="Current language: English">EN</span>
      </header>
      {children}
      <footer className="siteFooter">
        <strong>Korea Concierge</strong>
        <p>Personalized Korea travel and culture, designed for international visitors.</p>
        <span>Production target: korea.avocadoss.co.kr</span>
      </footer>
      <NextIntlClientProvider locale="en" messages={{QuickHelp: coreEnglishMessages.QuickHelp}}>
        <QuickHelp />
      </NextIntlClientProvider>
    </>
  );
}
