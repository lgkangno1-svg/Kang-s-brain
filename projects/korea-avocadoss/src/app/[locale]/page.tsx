import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');
  return {title: meta('homeTitle'), description: meta('homeDescription'), alternates: localizedAlternates(locale, '')};
}

export default async function LocalizedHome({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const home = await getTranslations('Home');
  const global = await getTranslations('Global');
  const help = await getTranslations('QuickHelp');

  return (
    <main className="stitchHome">
      <section className="stitchHero" aria-labelledby="home-title">
        <img
          src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeonghoeru_Pavilion_at_Gyeongbokgung_Palace.jpg?width=1800"
          alt="Gyeonghoeru Pavilion at Gyeongbokgung Palace"
          referrerPolicy="no-referrer"
        />
        <div className="stitchHeroCopy">
          <h1 id="home-title">{home('titleBefore')} {home('titleEmphasis')}</h1>
          <p>{home('intro')}</p>
        </div>
      </section>

      <section className="stitchServiceGrid" aria-label={home('modulesTitle')}>
        <Link className="stitchServiceCard" href="/color">
          <span className="stitchServiceMedia palette" aria-hidden="true" />
          <strong>{global('nav.myColor')}</strong>
          <span>{home('primaryAction')}</span>
        </Link>
        <Link className="stitchServiceCard" href="/hanbok">
          <span className="stitchServiceMedia"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/One_girl_wearing_traditional_Korean_costume_in_Gyeongbokgung%2Cthe_Seoul_palace_04.jpg?width=700" alt="" referrerPolicy="no-referrer" /></span>
          <strong>{global('nav.hanbok')}</strong>
          <span>→</span>
        </Link>
        <Link className="stitchServiceCard" href="/culture">
          <span className="stitchServiceMedia saju" aria-hidden="true">四柱</span>
          <strong>{global('nav.kCulture')}</strong>
          <span>→</span>
        </Link>
        <Link className="stitchServiceCard" href="/explore/gyeongbokgung">
          <span className="stitchServiceMedia"><img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeonghoeru_Pavilion_at_Gyeongbokgung_Palace.jpg?width=700" alt="" referrerPolicy="no-referrer" /></span>
          <strong>{global('nav.gyeongbokgung')}</strong>
          <span>→</span>
        </Link>
        <a className="stitchServiceCard" href="#quick-help">
          <span className="stitchServiceMedia ai" aria-hidden="true">◎</span>
          <strong>{help('launcherTitle')}</strong>
          <span>{help('launcherSubtitle')}</span>
        </a>
      </section>
    </main>
  );
}
