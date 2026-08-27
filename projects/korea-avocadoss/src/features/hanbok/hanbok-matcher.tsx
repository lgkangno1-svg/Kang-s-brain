'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const COLOR_IDS = ['jadeIvory', 'roseNavy', 'moonBlue'] as const;
const MOOD_IDS = ['elegant', 'royal', 'romantic', 'minimal', 'kdrama'] as const;
const COMFORT_IDS = ['walking', 'balanced', 'photoFirst'] as const;
const DESTINATION_IDS = ['stoneWall', 'hyangwonjeong', 'bukchon'] as const;
const SEASON_IDS = ['springAutumn', 'summer', 'winter'] as const;

type ColorId = (typeof COLOR_IDS)[number];
type MoodId = (typeof MOOD_IDS)[number];
type ComfortId = (typeof COMFORT_IDS)[number];
type DestinationId = (typeof DESTINATION_IDS)[number];
type SeasonId = (typeof SEASON_IDS)[number];

export function HanbokMatcher() {
  const t = useTranslations('HanbokMatcher');
  const [color, setColor] = useState<ColorId>('jadeIvory');
  const [mood, setMood] = useState<MoodId>('elegant');
  const [comfort, setComfort] = useState<ComfortId>('balanced');
  const [destination, setDestination] = useState<DestinationId>('stoneWall');
  const [season, setSeason] = useState<SeasonId>('springAutumn');

  return (
    <div className="prototypePanel">
      <div className="sectionHead hanbokMatcherHead">
        <div>
          <p className="eyebrow">{t('freeEyebrow')}</p>
          <h2>{t('title')}</h2>
        </div>
        <p>{t('intro')}</p>
      </div>

      <div className="hanbokMatcherGrid">
        {/* 1. Color Direction */}
        <fieldset className="hanbokFieldset">
          <legend>{t('colorLegend')}</legend>
          <p className="hanbokFieldHelp">{t('colorHelp')}</p>
          <div className="hanbokChoiceGrid">
            {COLOR_IDS.map((id) => (
              <label className={`hanbokChoice ${color === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input
                  checked={color === id}
                  name="hanbok-color"
                  onChange={() => setColor(id)}
                  type="radio"
                  value={id}
                />
                <span>{t('colors.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 2. Mood */}
        <fieldset className="hanbokFieldset">
          <legend>{t('moodLegend')}</legend>
          <p className="hanbokFieldHelp">{t('moodHelp')}</p>
          <div className="hanbokChoiceGrid">
            {MOOD_IDS.map((id) => (
              <label className={`hanbokChoice ${mood === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input
                  checked={mood === id}
                  name="hanbok-mood"
                  onChange={() => setMood(id)}
                  type="radio"
                  value={id}
                />
                <span>{t('moods.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 3. Trip Priority */}
        <fieldset className="hanbokFieldset">
          <legend>{t('comfortLegend')}</legend>
          <p className="hanbokFieldHelp">{t('comfortHelp')}</p>
          <div className="hanbokChoiceGrid">
            {COMFORT_IDS.map((id) => (
              <label className={`hanbokChoice ${comfort === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input
                  checked={comfort === id}
                  name="hanbok-comfort"
                  onChange={() => setComfort(id)}
                  type="radio"
                  value={id}
                />
                <span>{t('comfort.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 4. Palace Destination */}
        <fieldset className="hanbokFieldset">
          <legend>{t('destinationLegend')}</legend>
          <div className="hanbokChoiceGrid">
            {DESTINATION_IDS.map((id) => (
              <label className={`hanbokChoice ${destination === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input
                  checked={destination === id}
                  name="hanbok-destination"
                  onChange={() => setDestination(id)}
                  type="radio"
                  value={id}
                />
                <span>{t('destinations.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* 5. Season & Fabric */}
        <fieldset className="hanbokFieldset">
          <legend>{t('seasonLegend')}</legend>
          <div className="hanbokChoiceGrid">
            {SEASON_IDS.map((id) => (
              <label className={`hanbokChoice ${season === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input
                  checked={season === id}
                  name="hanbok-season"
                  onChange={() => setSeason(id)}
                  type="radio"
                  value={id}
                />
                <span>{t('seasons.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Result Section */}
      <div className="hanbokResultCard">
        <div className="hanbokResultHeader">
          <span className="hanbokResultEyebrow">{t('resultEyebrow')}</span>
          <h3>{t('directions.' + mood + '.name')}</h3>
          <p>{t('directions.' + mood + '.reason')}</p>
        </div>

        <div className="hanbokResultSummary">
          <div>
            <small>{t('resultPalette')}</small>
            <strong>{t('colors.' + color)}</strong>
          </div>
          <div>
            <small>{t('resultTripPriority')}</small>
            <strong>{t('comfort.' + comfort)}</strong>
          </div>
        </div>

        <p className="hanbokComfortNote">{t('comfortNotes.' + comfort)}</p>

        {/* Top Recommended Hanbok Looks */}
        <div className="hanbokLooksSection">
          <h4>{t('looksTitle')}</h4>
          <div className="hanbokLooksGrid">
            {/* Look 1 */}
            <article className="hanbokLookCard hanbokLookCardFeatured">
              <div className="lookCardHeader">
                <span className="matchBadge">Top Match 96%</span>
                <h5>{t('look1Title')}</h5>
                <p>{t('look1Desc')}</p>
              </div>
              <div className="lookSwatches">
                <div className="swatchPair">
                  <i style={{ backgroundColor: '#B8D0D8' }} />
                  <span>Jeogori: Celadon</span>
                </div>
                <div className="swatchPair">
                  <i style={{ backgroundColor: '#4A1525' }} />
                  <span>Chima: Royal Plum</span>
                </div>
              </div>
              <div className="lookMetaList">
                <div><small>{t('fabricLabel')}</small><span>{t('seasons.' + season)}</span></div>
                <div><small>{t('accessoriesLabel')}</small><span>{t('accessoriesValue')}</span></div>
                <div><small>{t('backdropRating')}</small><span>★★★★★ (5.0 / 5.0)</span></div>
              </div>
              <div className="lookWhyList">
                <strong>{t('whySuitsTitle')}</strong>
                <ul>
                  <li>{t('why1')}</li>
                  <li>{t('why2')}</li>
                  <li>{t('why3')}</li>
                </ul>
              </div>
            </article>

            {/* Look 2 */}
            <article className="hanbokLookCard">
              <div className="lookCardHeader">
                <span className="matchBadgeSecondary">Match 91%</span>
                <h5>{t('look2Title')}</h5>
                <p>{t('look2Desc')}</p>
              </div>
              <div className="lookSwatches">
                <div className="swatchPair">
                  <i style={{ backgroundColor: '#C8B6DB' }} />
                  <span>Jeogori: Lavender</span>
                </div>
                <div className="swatchPair">
                  <i style={{ backgroundColor: '#1E293B' }} />
                  <span>Chima: Charcoal Indigo</span>
                </div>
              </div>
              <div className="lookMetaList">
                <div><small>{t('fabricLabel')}</small><span>{t('seasons.' + season)}</span></div>
                <div><small>{t('backdropRating')}</small><span>★★★★☆ (4.8 / 5.0)</span></div>
              </div>
            </article>

            {/* Look 3 */}
            <article className="hanbokLookCard">
              <div className="lookCardHeader">
                <span className="matchBadgeSecondary">Match 88%</span>
                <h5>{t('look3Title')}</h5>
                <p>{t('look3Desc')}</p>
              </div>
              <div className="lookSwatches">
                <div className="swatchPair">
                  <i style={{ backgroundColor: '#FDFBF7' }} />
                  <span>Jeogori: Ivory Silk</span>
                </div>
                <div className="swatchPair">
                  <i style={{ backgroundColor: '#D4A373' }} />
                  <span>Chima: Soft Rosegold</span>
                </div>
              </div>
              <div className="lookMetaList">
                <div><small>{t('fabricLabel')}</small><span>{t('seasons.' + season)}</span></div>
                <div><small>{t('backdropRating')}</small><span>★★★★☆ (4.7 / 5.0)</span></div>
              </div>
            </article>
          </div>
        </div>

        {/* Boutique finder & walking buffer */}
        <div className="boutiqueNoticeCard">
          <div className="boutiqueNoticeHead">
            <strong>📍 {t('rentalMapCta')}</strong>
            <p>{t('walkingTimeNotice')}</p>
          </div>
          <Link href="/explore/gyeongbokgung" className="primaryButton">
            {t('rentalMapCta')}
          </Link>
        </div>

        {/* Privacy & Boundary notes */}
        <div className="hanbokBoundaryCard">
          <strong>{t('freeBoundaryTitle')}</strong>
          <p>{t('freeBoundaryText')}</p>
          <p className="hanbokPaidNote">{t('paidBoundaryText')}</p>
        </div>
      </div>
    </div>
  );
}

