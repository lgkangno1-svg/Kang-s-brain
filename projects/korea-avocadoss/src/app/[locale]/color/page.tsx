import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ColorScanner } from '@/features/color/color-scanner';
import { localizedAlternates } from '@/lib/seo/localized-metadata';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return {
    title: t('colorTitle'),
    description: t('colorDescription'),
    alternates: localizedAlternates(locale, '/color'),
  };
}

export default async function ColorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Color');

  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>{t('title')}</h1>
        <p>{t('intro')}</p>
      </section>
      <section className="prototype">
        <ColorScanner />
      </section>
    </main>
  );
}
