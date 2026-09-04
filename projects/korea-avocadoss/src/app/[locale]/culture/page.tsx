import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');
  return {title: meta('cultureTitle'), description: meta('cultureDescription'), alternates: localizedAlternates(locale, '/culture')};
}

export default async function LocalizedCulturePage({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const culture = await getTranslations('Culture');

  return (
    <main className="stitchSajuReferencePage">
      <section className="stitchSajuReference" aria-labelledby="saju-title">
        <header className="stitchSajuReferenceHead">
          <span className="stitchPreviewBadge">{culture('planned')}</span>
          <h1 id="saju-title">{culture('heroTitle')}</h1>
          <p>{culture('heroIntro')}</p>
        </header>

        <div className="stitchSajuReferenceBody">
          <div className="stitchSajuDiagram" aria-describedby="saju-preview-note">
            <div className="stitchSajuDiagramInner" aria-hidden="true">
              <div className="stitchSajuOrb">木<small>Wood</small></div>
              <div className="stitchSajuOrb">火<small>Fire</small></div>
              <div className="stitchSajuOrb">土<small>Earth</small></div>
              <div className="stitchSajuOrb">金<small>Metal</small></div>
              <div className="stitchSajuOrb">四柱<small>Saju</small></div>
              <div className="stitchSajuOrb">水<small>Water</small></div>
            </div>
          </div>

          <p id="saju-preview-note" className="freshnessNote">{culture('intro')}</p>

          <div className="stitchSajuReferenceGrid">
            <section className="stitchSajuExplanation">
              <h2>{culture('sajuExplorerTitle')}</h2>
              <p>{culture('sajuExplorerIntro')}</p>
              <div className="stepList">
                <div className="step"><b>띠</b><div><strong>{culture('zodiacTitle')}</strong><p>{culture('zodiacText')}</p></div></div>
                <div className="step"><b>四柱</b><div><strong>{culture('sajuTitle')}</strong><p>{culture('sajuText')}</p></div></div>
                <div className="step"><b>五行</b><div><strong>{culture('colorTitle')}</strong><p>{culture('colorText')}</p></div></div>
              </div>
            </section>

            <aside className="stitchSajuPremium">
              <h2>{culture('photoSpotTitle')}</h2>
              <p>{culture('photoSpotName')}</p>
              <div className="cultureActionGroup">
                <Link href="/color" className="primaryButton">{culture('actionPairColor')}</Link>
                <Link href="/explore/gyeongbokgung" className="secondaryButton">{culture('actionExplorePalace')}</Link>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
