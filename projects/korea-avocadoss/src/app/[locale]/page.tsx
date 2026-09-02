import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');

  return {
    title: meta('homeTitle'),
    description: meta('homeDescription'),
    alternates: localizedAlternates(locale, ''),
  };
}

export default async function LocalizedHome({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  const home = await getTranslations('Home');

  return (
    <main>
      <section className="hero">
        <div className="heroGrid">
          <div>
            <p className="eyebrow">{home('eyebrow')}</p>
            <h1>{home('titleBefore')} <em>{home('titleEmphasis')}</em></h1>
          </div>
          <div>
            <p className="heroText">{home('intro')}</p>
            <div className="heroActions">
              <Link className="primaryButton" href="/color">{home('primaryAction')}</Link>
              <Link className="secondaryButton" href="/explore/gyeongbokgung">{home('secondaryAction')}</Link>
            </div>
            <div className="contextBox">{home('context')}</div>
          </div>
        </div>
      </section>

      <section className="section sectionDark">
        <div className="sectionHead">
          <h2>{home('modulesTitle')}</h2>
          <p>{home('modulesIntro')}</p>
        </div>
      </section>

      <section className="section">
        <div className="sectionHead">
          <h2>{home('travelerTitle')}</h2>
          <p>{home('travelerIntro')}</p>
        </div>
        <div className="infoBand">
          <div><strong>{home('freeTitle')}</strong><span>{home('freeText')}</span></div>
          <div><strong>{home('paidTitle')}</strong><span>{home('paidText')}</span></div>
          <div><strong>{home('internationalTitle')}</strong><span>{home('internationalText')}</span></div>
        </div>
      </section>
    </main>
  );
}
