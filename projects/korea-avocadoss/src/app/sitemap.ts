import type {MetadataRoute} from 'next';

import {P0_LOCALES} from '@/lib/i18n/locales';
import {
  PUBLIC_LOCALE_PATHS,
  localizedLanguageAlternates,
  localizedPublicUrl,
} from '@/lib/seo/localized-metadata';

const ROUTE_SETTINGS = {
  '': {changeFrequency: 'weekly', priority: 1},
  '/color': {changeFrequency: 'monthly', priority: 0.9},
  '/hanbok': {changeFrequency: 'weekly', priority: 0.9},
  '/explore/gyeongbokgung': {changeFrequency: 'weekly', priority: 0.9},
  '/culture': {changeFrequency: 'weekly', priority: 0.8},
  '/credits': {changeFrequency: 'monthly', priority: 0.8},
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_LOCALE_PATHS.flatMap((path) =>
    P0_LOCALES.map((locale) => ({
      url: localizedPublicUrl(locale, path),
      changeFrequency: ROUTE_SETTINGS[path].changeFrequency,
      priority: ROUTE_SETTINGS[path].priority,
      alternates: {
        languages: localizedLanguageAlternates(path),
      },
    })),
  );
}
