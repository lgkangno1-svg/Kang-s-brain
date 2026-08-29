import {Suspense} from 'react';
import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {HanbokMatcher} from '@/features/hanbok/hanbok-matcher';
import {HanbokVisualInspiration} from '@/features/hanbok/hanbok-visual-inspiration';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});

  return {
    title: t('hanbokTitle'),
    description: t('hanbokDescription'),
    alternates: localizedAlternates(locale, '/hanbok'),
  };
}

export default async function HanbokPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Hanbok');

  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>{t('title')}</h1>
        <p>{t('intro')}</p>
      </section>
      <HanbokVisualInspiration />
      <section className="prototype">
        <Suspense fallback={<div className="prototypePanel" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Hanbok Studio...</div>}>
          <HanbokMatcher />
        </Suspense>
      </section>
    </main>
  );
}
