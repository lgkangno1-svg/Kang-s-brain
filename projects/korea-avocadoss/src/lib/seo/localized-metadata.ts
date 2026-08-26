import type {Metadata} from 'next';

import {DEFAULT_LOCALE, P0_LOCALES, type P0Locale} from '@/lib/i18n/locales';

export const SITE_ORIGIN = 'https://korea.avocadoss.co.kr';

export const PUBLIC_LOCALE_PATHS = [
  '',
  '/color',
  '/hanbok',
  '/explore/gyeongbokgung',
  '/culture',
  '/credits',
] as const;

export type PublicLocalePath = (typeof PUBLIC_LOCALE_PATHS)[number];

const HREFLANG: Record<P0Locale, string> = {
  en: 'en',
  'zh-CN': 'zh-Hans',
  ja: 'ja',
  'zh-TW': 'zh-Hant',
  vi: 'vi',
  th: 'th',
};

function requireP0Locale(locale: string): P0Locale {
  if (!(P0_LOCALES as readonly string[]).includes(locale)) {
    throw new Error(`Unsupported production locale: ${locale}`);
  }

  return locale as P0Locale;
}

export function localizedPublicUrl(locale: P0Locale, path: PublicLocalePath): string {
  return `${SITE_ORIGIN}/${locale}${path}`;
}

export function localizedAlternates(locale: string, path: PublicLocalePath): Metadata['alternates'] {
  const currentLocale = requireP0Locale(locale);
  const languages = Object.fromEntries(
    P0_LOCALES.map((candidate) => [HREFLANG[candidate], localizedPublicUrl(candidate, path)]),
  );

  return {
    canonical: localizedPublicUrl(currentLocale, path),
    languages: {
      ...languages,
      'x-default': localizedPublicUrl(DEFAULT_LOCALE, path),
    },
  };
}
