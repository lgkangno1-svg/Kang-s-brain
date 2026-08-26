import {getTranslations, setRequestLocale} from 'next-intl/server';

import {Link} from '@/i18n/navigation';

export default async function LocalizedHome({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);

  const global = await getTranslations('Global');
  const help = await getTranslations('QuickHelp');

  return (
    <main>
      <section className="hero">
        <div className="heroGrid">
          <div>
            <p className="eyebrow">Korea Concierge</p>
            <h1>Korea, shaped around <em>your trip.</em></h1>
          </div>
          <div>
            <p className="heroText">{global('footerTagline')}</p>
            <div className="heroActions">
              <Link className="primaryButton" href="/color">{global('nav.myColor')}</Link>
              <Link className="secondaryButton" href="/explore/gyeongbokgung">{global('nav.gyeongbokgung')}</Link>
            </div>
            <div className="contextBox">{help('rootAnswer')}</div>
          </div>
        </div>
      </section>
    </main>
  );
}
