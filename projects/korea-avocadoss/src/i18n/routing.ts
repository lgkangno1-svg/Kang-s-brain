import {defineRouting} from 'next-intl/routing';

import {DEFAULT_LOCALE, P0_LOCALES} from '../lib/i18n/locales';

export const routing = defineRouting({
  locales: P0_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: true,
});
