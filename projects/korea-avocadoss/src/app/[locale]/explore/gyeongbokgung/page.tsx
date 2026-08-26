import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');

  return {
    title: meta('gyeongbokgungTitle'),
    description: meta('gyeongbokgungDescription'),
  };
}

export default async function LocalizedGyeongbokgungPage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const guide = await getTranslations('Gyeongbokgung');

  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">{guide('eyebrow')}</p>
        <h1>{guide('title')}</h1>
        <p>{guide('intro')}</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>{guide('routeModes')}</h2>
          <div className="stepList">
            <div className="step"><b>1H</b><div><strong>{guide('oneHourTitle')}</strong><p>{guide('oneHourText')}</p></div></div>
            <div className="step"><b>2H</b><div><strong>{guide('twoHourTitle')}</strong><p>{guide('twoHourText')}</p></div></div>
            <div className="step"><b>4H</b><div><strong>{guide('fourHourTitle')}</strong><p>{guide('fourHourText')}</p></div></div>
          </div>
          <p className="freshnessNote">{guide('freshnessNote')}</p>
        </div>
      </section>
    </main>
  );
}
