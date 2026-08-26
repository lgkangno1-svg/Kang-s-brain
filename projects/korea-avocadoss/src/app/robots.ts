import type {MetadataRoute} from 'next';

import {P0_LOCALES} from '@/lib/i18n/locales';
import {SITE_ORIGIN} from '@/lib/seo/localized-metadata';

const PRIVATE_PATHS = [
  '/account/',
  '/saved/',
  '/credits/checkout',
  '/hanbok/results/',
  '/color/results/',
  '/culture/saju/results/',
] as const;

const disallow = [
  '/api/',
  ...PRIVATE_PATHS,
  ...P0_LOCALES.flatMap((locale) => PRIVATE_PATHS.map((path) => `/${locale}${path}`)),
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN,
  };
}
