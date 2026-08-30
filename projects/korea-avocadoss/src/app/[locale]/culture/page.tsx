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
    <main>
      <section className="stitchSajuShell">
        <header className="stitchSajuMast">
          <span className="stitchPreviewBadge">{culture('planned')}</span>
          <p className="eyebrow">{culture('eyebrow')}</p>
          <h1>{culture('heroTitle')}</h1>
          <p>{culture('heroIntro')}</p>
        </header>
        <div className="stitchSajuGrid">
          <aside className="stitchSajuRail">
            <div className="stitchPreviewRow"><h2>{culture('todayVibeTitle')}</h2><span>{culture('planned')}</span></div>
            <div className="stitchMetricGrid" aria-describedby="culture-preview-note">
              <div className="stitchMetricCard"><small>{culture('todayEnergyLabel')}</small><strong>{culture('todayEnergyValue')}</strong></div>
              <div className="stitchMetricCard"><small>{culture('luckyDirectionLabel')}</small><strong>{culture('luckyDirectionValue')}</strong></div>
              <div className="stitchMetricCard"><small>{culture('luckyColorLabel')}</small><strong>{culture('luckyColorValue')}</strong></div>
              <div className="stitchMetricCard"><small>{culture('harmoniousMealLabel')}</small><strong>{culture('harmoniousMealValue')}</strong></div>
            </div>
            <p id="culture-preview-note" className="freshnessNote">{culture('intro')}</p>
          </aside>
          <section className="stitchSajuMain">
            <div className="stitchEditorialSection">
              <h2>{culture('sajuExplorerTitle')}</h2>
              <p>{culture('sajuExplorerIntro')}</p>
            </div>
            <div className="stitchEditorialSection">
              <div className="stepList">
                <div className="step"><b>띠</b><div><strong>{culture('zodiacTitle')}</strong><p>{culture('zodiacText')}</p></div></div>
                <div className="step"><b>四柱</b><div><strong>{culture('sajuTitle')}</strong><p>{culture('sajuText')}</p></div></div>
                <div className="step"><b>五行</b><div><strong>{culture('colorTitle')}</strong><p>{culture('colorText')}</p></div></div>
              </div>
            </div>
            <div className="stitchEditorialSection">
              <h2>{culture('photoSpotTitle')}</h2>
              <p>{culture('photoSpotName')}</p>
              <div className="cultureActionGroup">
                <Link href="/color" className="primaryButton">{culture('actionPairColor')}</Link>
                <Link href="/explore/gyeongbokgung" className="secondaryButton">{culture('actionExplorePalace')}</Link>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
