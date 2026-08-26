"use client";

import {useLocale, useTranslations} from 'next-intl';
import {ChangeEvent, useTransition} from 'react';

import {P0_LOCALES, getLocaleDefinition} from '@/lib/i18n/locales';
import {usePathname, useRouter} from './navigation';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Global');
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as (typeof P0_LOCALES)[number];
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <select
      className="langButton"
      aria-label={t('language')}
      value={locale}
      onChange={onChange}
      disabled={isPending}
    >
      {P0_LOCALES.map((code) => {
        const definition = getLocaleDefinition(code);
        return <option key={code} value={code}>{definition.nativeName}</option>;
      })}
    </select>
  );
}
