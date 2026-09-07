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

      <div style={{
        maxWidth: '1200px',
        margin: '16px auto 24px',
        padding: '0 20px',
      }}>
        <div style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle, #E7E5E4)',
          borderLeft: '4px solid var(--dancheong-crimson, #9E2A2B)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div>
            <strong style={{ fontSize: '15px', color: 'var(--ink-charcoal, #1C1917)', display: 'block' }}>
              Want a complete 3-Look Guidebook with in-store Korean rental cards?
            </strong>
            <span style={{ fontSize: '13px', color: 'var(--stone-muted, #78716C)' }}>
              Get personalized color matching, shop staff scripts, and palace photo routes for $12 USD.
            </span>
          </div>
          <a href="/style" style={{
            background: 'var(--dancheong-crimson, #9E2A2B)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: 700,
            padding: '10px 18px',
            borderRadius: '999px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Get My Korea Look ($12) →
          </a>
        </div>
      </div>

      <section className="prototype stitchHanbokMatcherWrap">
        <Suspense fallback={<div className="prototypePanel" style={{minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading Hanbok Studio...</div>}>
          <HanbokMatcher />
        </Suspense>
      </section>
    </main>
  );
}
