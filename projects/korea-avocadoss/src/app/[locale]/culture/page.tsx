import {getTranslations, setRequestLocale} from 'next-intl/server';

export default async function LocalizedCulturePage({params}: {params: Promise<{locale: string}>}) {
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
