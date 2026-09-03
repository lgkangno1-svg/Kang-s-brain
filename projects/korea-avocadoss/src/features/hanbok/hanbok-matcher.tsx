'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { isValidHanbokStyle, HANBOK_STYLE_CATEGORIES } from './hanbok-visual-library';
import {
  hanbokColorForUndertone,
  isPersonalColorUndertone,
  type HanbokMatcherColorId,
} from './personal-color-bridge';

const COLOR_IDS = ['jadeIvory', 'roseNavy', 'moonBlue'] as const satisfies readonly HanbokMatcherColorId[];
const MOOD_IDS = ['elegant', 'royal', 'romantic', 'minimal', 'kdrama'] as const;
const COMFORT_IDS = ['walking', 'balanced', 'photoFirst'] as const;
const DESTINATION_IDS = ['stoneWall', 'hyangwonjeong', 'bukchon'] as const;
const SEASON_IDS = ['springAutumn', 'summer', 'winter'] as const;

type ColorId = HanbokMatcherColorId;
type MoodId = (typeof MOOD_IDS)[number];
type ComfortId = (typeof COMFORT_IDS)[number];
type DestinationId = (typeof DESTINATION_IDS)[number];
type SeasonId = (typeof SEASON_IDS)[number];
type LookId = 'look1' | 'look2' | 'look3';

type HanbokLook = {
  id: LookId;
  color: ColorId;
  moods: readonly MoodId[];
  comforts: readonly ComfortId[];
  destinations: readonly DestinationId[];
  seasons: readonly SeasonId[];
  jeogoriColor: string;
  chimaColor: string;
};

const HANBOK_LOOKS: readonly HanbokLook[] = [
  {
    id: 'look1',
    color: 'jadeIvory',
    moods: ['elegant', 'romantic'],
    comforts: ['balanced', 'photoFirst'],
    destinations: ['hyangwonjeong', 'stoneWall'],
    seasons: ['springAutumn', 'summer'],
    jeogoriColor: '#B8D0D8',
    chimaColor: '#4A1525',
  },
  {
    id: 'look2',
    color: 'roseNavy',
    moods: ['minimal', 'romantic', 'royal'],
    comforts: ['walking', 'balanced', 'photoFirst'],
    destinations: ['stoneWall', 'bukchon'],
    seasons: ['springAutumn', 'winter'],
    jeogoriColor: '#C8B6DB',
    chimaColor: '#1E293B',
  },
  {
    id: 'look3',
    color: 'moonBlue',
    moods: ['royal', 'kdrama', 'elegant'],
    comforts: ['photoFirst', 'balanced'],
    destinations: ['bukchon', 'hyangwonjeong'],
    seasons: ['winter', 'springAutumn'],
    jeogoriColor: '#FDFBF7',
    chimaColor: '#D4A373',
  },
];

function scoreLook(
  look: HanbokLook,
  choices: {
    color: ColorId;
    mood: MoodId;
    comfort: ComfortId;
    destination: DestinationId;
    season: SeasonId;
  },
) {
  // Deterministic preference-fit rubric used only for ordering: 40 palette + 25 mood + 15 comfort + 10 destination + 10 season.
  // The numeric score is intentionally not shown to users because it is not calibrated confidence or attractiveness.
  return (
    (look.color === choices.color ? 40 : 0) +
    (look.moods.includes(choices.mood) ? 25 : 0) +
    (look.comforts.includes(choices.comfort) ? 15 : 0) +
    (look.destinations.includes(choices.destination) ? 10 : 0) +
    (look.seasons.includes(choices.season) ? 10 : 0)
  );
}

export function HanbokMatcher() {
  const t = useTranslations('HanbokMatcher');
  const searchParams = useSearchParams();
  const styleParam = searchParams.get('hanbokStyle');
  const undertoneParam = searchParams.get('undertone');

  const [color, setColor] = useState<ColorId>('jadeIvory');
  const [mood, setMood] = useState<MoodId>('elegant');
  const [comfort, setComfort] = useState<ComfortId>('balanced');
  const [destination, setDestination] = useState<DestinationId>('stoneWall');
  const [season, setSeason] = useState<SeasonId>('springAutumn');
  const [appliedPreset, setAppliedPreset] = useState<string | null>(null);

  useEffect(() => {
    let styleWasApplied = false;

    if (isValidHanbokStyle(styleParam)) {
      const category = HANBOK_STYLE_CATEGORIES.find((item) => item.id === styleParam);
      if (category) {
        setColor(category.matcherPreset.color);
        setMood(category.matcherPreset.mood);
        setComfort(category.matcherPreset.comfort);
        setAppliedPreset(category.name);
        styleWasApplied = true;
      }
    }

    // Personal Color is a browser-local explicit bridge. It only preselects the broad Hanbok palette;
    // explicit style still controls mood/comfort and the user can always override every choice.
    if (isPersonalColorUndertone(undertoneParam)) {
      setColor(hanbokColorForUndertone(undertoneParam));
    }

    if (!styleWasApplied) {
      setAppliedPreset(null);
    }
  }, [styleParam, undertoneParam]);

  const rankedLooks = useMemo(() => HANBOK_LOOKS
    .map((look) => ({
      look,
      score: scoreLook(look, { color, mood, comfort, destination, season }),
    }))
    .sort((a, b) => b.score - a.score), [color, mood, comfort, destination, season]);

  return (
    <div className="prototypePanel" id="hanbok-matcher">
      <div className="sectionHead hanbokMatcherHead">
        <div>
          <p className="eyebrow">{t('freeEyebrow')}</p>
          <h2>{t('title')}</h2>
        </div>
        <p>{t('intro')}</p>
        {appliedPreset && (
          <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.8rem', background: '#f8f5e9', borderRadius: '2px', border: '1px solid rgba(0, 31, 91, 0.15)', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content' }}>
            <span style={{ fontSize: '0.75rem', color: '#2d5a4c', fontWeight: 700 }}>
              {t('presetAppliedLabel')}: {appliedPreset}
            </span>
          </div>
        )}
      </div>

      <div className="hanbokMatcherGrid">
        <fieldset className="hanbokFieldset">
          <legend>{t('colorLegend')}</legend>
          <p className="hanbokFieldHelp">{t('colorHelp')}</p>
          <div className="hanbokChoiceGrid">
            {COLOR_IDS.map((id) => (
              <label className={`hanbokChoice ${color === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input checked={color === id} name="hanbok-color" onChange={() => setColor(id)} type="radio" value={id} />
                <span>{t('colors.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="hanbokFieldset">
          <legend>{t('moodLegend')}</legend>
          <p className="hanbokFieldHelp">{t('moodHelp')}</p>
          <div className="hanbokChoiceGrid">
            {MOOD_IDS.map((id) => (
              <label className={`hanbokChoice ${mood === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input checked={mood === id} name="hanbok-mood" onChange={() => setMood(id)} type="radio" value={id} />
                <span>{t('moods.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="hanbokFieldset">
          <legend>{t('comfortLegend')}</legend>
          <p className="hanbokFieldHelp">{t('comfortHelp')}</p>
          <div className="hanbokChoiceGrid">
            {COMFORT_IDS.map((id) => (
              <label className={`hanbokChoice ${comfort === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input checked={comfort === id} name="hanbok-comfort" onChange={() => setComfort(id)} type="radio" value={id} />
                <span>{t('comfort.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="hanbokFieldset">
          <legend>{t('destinationLegend')}</legend>
          <div className="hanbokChoiceGrid">
            {DESTINATION_IDS.map((id) => (
              <label className={`hanbokChoice ${destination === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input checked={destination === id} name="hanbok-destination" onChange={() => setDestination(id)} type="radio" value={id} />
                <span>{t('destinations.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="hanbokFieldset">
          <legend>{t('seasonLegend')}</legend>
          <div className="hanbokChoiceGrid">
            {SEASON_IDS.map((id) => (
              <label className={`hanbokChoice ${season === id ? 'hanbokChoiceActive' : ''}`} key={id}>
                <input checked={season === id} name="hanbok-season" onChange={() => setSeason(id)} type="radio" value={id} />
                <span>{t('seasons.' + id)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

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

        <div className="hanbokLooksSection">
          <h4>{t('looksTitle')}</h4>
          <div className="hanbokLooksGrid">
            {rankedLooks.map(({ look }, index) => (
              <article className={`hanbokLookCard ${index === 0 ? 'hanbokLookCardFeatured' : ''}`} key={look.id}>
                <div className="lookCardHeader">
                  <span className={index === 0 ? 'matchBadge' : 'matchBadgeSecondary'}>
                    #{index + 1}
                  </span>
                  <h5>{t(look.id + 'Title')}</h5>
                  <p>{t(look.id + 'Desc')}</p>
                </div>

                <div className="lookSwatches" aria-label={t('resultPalette')}>
                  <div className="swatchPair">
                    <i style={{ backgroundColor: look.jeogoriColor }} />
                    <span>{look.jeogoriColor}</span>
                  </div>
                  <div className="swatchPair">
                    <i style={{ backgroundColor: look.chimaColor }} />
                    <span>{look.chimaColor}</span>
                  </div>
                </div>

                <div className="lookMetaList">
                  <div><small>{t('fabricLabel')}</small><span>{t('seasons.' + season)}</span></div>
                  {index === 0 && <div><small>{t('accessoriesLabel')}</small><span>{t('accessoriesValue')}</span></div>}
                </div>

                <div className="lookWhyList">
                  <strong>{t('whySuitsTitle')}</strong>
                  <ul>
                    <li>{t('resultPalette')}: {t('colors.' + color)}</li>
                    <li>{t('moodLegend')}: {t('moods.' + mood)}</li>
                    <li>{t('destinationLegend')}: {t('destinations.' + destination)}</li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="boutiqueNoticeCard">
          <div className="boutiqueNoticeHead">
            <strong>{t('rentalMapCta')}</strong>
            <p>{t('walkingTimeNotice')}</p>
          </div>
          <Link href="/explore/gyeongbokgung" className="primaryButton">
            {t('rentalMapCta')}
          </Link>
        </div>

        <div className="hanbokBoundaryCard">
          <strong>{t('freeBoundaryTitle')}</strong>
          <p>{t('freeBoundaryText')}</p>
          <p className="hanbokPaidNote">{t('paidBoundaryText')}</p>
        </div>
      </div>
    </div>
  );
}
