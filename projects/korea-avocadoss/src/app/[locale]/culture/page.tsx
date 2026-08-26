import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');

  return {
    title: meta('cultureTitle'),
    description: meta('cultureDescription'),
    alternates: localizedAlternates(locale, '/culture'),
  };
}

export default async function LocalizedCulturePage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const culture = await getTranslations('Culture');

  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">{culture('eyebrow')}</p>
        <h1>{culture('title')}</h1>
        <p>{culture('intro')}</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>{culture('planned')}</h2>
          <div className="stepList">
            <div className="step"><b>띠</b><div><strong>{culture('zodiacTitle')}</strong><p>{culture('zodiacText')}</p></div></div>
            <div className="step"><b>四柱</b><div><strong>{culture('sajuTitle')}</strong><p>{culture('sajuText')}</p></div></div>
            <div className="step"><b>✦</b><div><strong>{culture('colorTitle')}</strong><p>{culture('colorText')}</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
