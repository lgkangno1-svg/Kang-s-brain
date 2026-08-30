import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');
  return {title: meta('gyeongbokgungTitle'), description: meta('gyeongbokgungDescription'), alternates: localizedAlternates(locale, '/explore/gyeongbokgung')};
}

export default async function LocalizedGyeongbokgungPage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const guide = await getTranslations('Gyeongbokgung');
  return (
    <main>
      <section className="stitchPalaceHero">
        <img src="https://commons.wikimedia.org/wiki/Special:Redirect/file/Gyeonghoeru_Pavilion_at_Gyeongbokgung_Palace.jpg?width=1800" alt="Gyeonghoeru Pavilion at Gyeongbokgung Palace" referrerPolicy="no-referrer" />
        <div className="stitchPalaceHeroCopy"><p className="eyebrow">{guide('eyebrow')}</p><h1>{guide('title')}</h1><p>{guide('intro')}</p></div>
      </section>
      <section className="stitchRoutePanel">
        <h2>{guide('routeModes')}</h2>
        <div className="stitchRouteGrid">
          <article className="stitchRoute"><b>1H</b><strong>{guide('oneHourTitle')}</strong><p>{guide('oneHourText')}</p></article>
          <article className="stitchRoute"><b>2H</b><strong>{guide('twoHourTitle')}</strong><p>{guide('twoHourText')}</p></article>
          <article className="stitchRoute"><b>4H</b><strong>{guide('fourHourTitle')}</strong><p>{guide('fourHourText')}</p></article>
        </div>
        <p className="freshnessNote">{guide('freshnessNote')}</p>
      </section>
    </main>
  );
}
