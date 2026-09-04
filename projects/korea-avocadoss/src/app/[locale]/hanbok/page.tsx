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

  return (
    <main className="stitchHanbokPage">
      <Suspense fallback={<div style={{minHeight: '540px'}} aria-hidden="true" />}>
        <HanbokVisualInspiration />
      </Suspense>
      <section className="prototype stitchHanbokMatcherWrap" id="hanbok-matcher">
        <Suspense fallback={<div className="prototypePanel" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Hanbok Studio...</div>}>
          <HanbokMatcher />
        </Suspense>
      </section>
    </main>
  );
}
