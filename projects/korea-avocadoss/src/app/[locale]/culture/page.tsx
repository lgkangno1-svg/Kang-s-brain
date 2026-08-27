import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { localizedAlternates } from '@/lib/seo/localized-metadata';

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');

  return {
    title: meta('cultureTitle'),
    description: meta('cultureDescription'),
    alternates: localizedAlternates(locale, '/culture'),
  };
}

export default async function LocalizedCulturePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const culture = await getTranslations('Culture');

  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">{culture('eyebrow')}</p>
        <h1>{culture('heroTitle')}</h1>
        <p>{culture('heroIntro')}</p>
      </section>

      {/* Daily Travel Harmony Card */}
      <section className="prototype">
        <div className="prototypePanel cultureHighlightPanel">
          <div className="cultureSectionHeader">
            <span className="matchBadge">✦ Daily Harmony</span>
            <h2>{culture('todayVibeTitle')}</h2>
          </div>

          <div className="cultureGrid">
            <div className="cultureCard">
              <small>{culture('todayEnergyLabel')}</small>
              <strong>{culture('todayEnergyValue')}</strong>
            </div>
            <div className="cultureCard">
              <small>{culture('luckyDirectionLabel')}</small>
              <strong>{culture('luckyDirectionValue')}</strong>
            </div>
            <div className="cultureCard">
              <small>{culture('luckyColorLabel')}</small>
              <div className="cultureColorSwatch">
                <i style={{ backgroundColor: '#2D5A4C' }} />
                <strong>{culture('luckyColorValue')}</strong>
              </div>
            </div>
            <div className="cultureCard">
              <small>{culture('harmoniousMealLabel')}</small>
              <strong>{culture('harmoniousMealValue')}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Traditional Zodiac & Four Pillars Explorer */}
      <section className="prototype">
        <div className="prototypePanel">
          <h2>{culture('sajuExplorerTitle')}</h2>
          <p>{culture('sajuExplorerIntro')}</p>

          <div className="stepList">
            <div className="step">
              <b>띠</b>
              <div>
                <strong>{culture('zodiacTitle')}</strong>
                <p>{culture('zodiacText')}</p>
              </div>
            </div>
            <div className="step">
              <b>四柱</b>
              <div>
                <strong>{culture('sajuTitle')}</strong>
                <p>{culture('sajuText')}</p>
              </div>
            </div>
            <div className="step">
              <b>五行</b>
              <div>
                <strong>{culture('colorTitle')}</strong>
                <p>{culture('colorText')}</p>
              </div>
            </div>
          </div>

          <div className="cultureNoticeCard">
            <p>{culture('privacySeal')}</p>
          </div>
        </div>
      </section>

      {/* Palace Photo Spot & Curated Moment */}
      <section className="prototype">
        <div className="prototypePanel">
          <div className="cultureSectionHeader">
            <span className="matchBadgeSecondary">📸 Curated Moment</span>
            <h2>{culture('photoSpotTitle')}</h2>
          </div>
          <div className="photoSpotCard">
            <strong>{culture('photoSpotName')}</strong>
            <p>{culture('goldenHourLabel')}: <em>{culture('goldenHourTime')}</em></p>
          </div>

          <div className="cultureActionGroup">
            <Link href="/color" className="primaryButton">
              {culture('actionPairColor')}
            </Link>
            <Link href="/explore/gyeongbokgung" className="secondaryButton">
              {culture('actionExplorePalace')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
