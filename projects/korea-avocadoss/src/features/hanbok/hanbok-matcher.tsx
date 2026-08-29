'use client';

import { useMemo, useState } from 'react';
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
    moods: ['minimal', 'romantic'],
    comforts: ['walking', 'balanced'],
    destinations: ['stoneWall', 'bukchon'],
    seasons: ['springAutumn', 'winter'],
    jeogoriColor: '#C8B6DB',
    chimaColor: '#1E293B',
  },
  {
    id: 'look3',
    color: 'moonBlue',
    moods: ['royal', 'kdrama'],
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
  // Transparent rule score: 40 palette + 25 mood + 15 comfort + 10 backdrop + 10 season.
  // This is a deterministic preference-fit score, not an AI confidence or objective beauty score.
  return (
    (look.color === choices.color ? 40 : 0) +
    (look.moods.includes(choices.mood) ? 25 : 0) +
    (look.comforts.includes(choices.comfort) ? 15 : 0) +
    (look.destinations.includes(choices.destination) ? 10 : 0) +
    (look.seasons.includes(choices.season) ? 10 : 0)
  );
}

function backdropFit(look: HanbokLook, destination: DestinationId) {
  if (look.destinations[0] === destination) return 5;
  if (look.destinations.includes(destination)) return 4.5;
  return 3.5;
}

function comfortFit(look: HanbokLook, comfort: ComfortId) {
  return look.comforts.includes(comfort) ? 100 : 60;
}

export function HanbokMatcher() {
  const t = useTranslations('HanbokMatcher');
  const [color, setColor] = useState<ColorId>('jadeIvory');
  const [mood, setMood] = useState<MoodId>('elegant');
  const [comfort, setComfort] = useState<ComfortId>('balanced');
  const [destination, setDestination] = useState<DestinationId>('stoneWall');
  const [season, setSeason] = useState<SeasonId>('springAutumn');

  const rankedLooks = useMemo(() => HANBOK_LOOKS
    .map((look) => ({
      look,
      score: scoreLook(look, { color, mood, comfort, destination, season }),
      backdrop: backdropFit(look, destination),
      comfortScore: comfortFit(look, comfort),
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
            {rankedLooks.map(({ look, score, backdrop, comfortScore }, index) => (
              <article className={`hanbokLookCard ${index === 0 ? 'hanbokLookCardFeatured' : ''}`} key={look.id}>
                <div className="lookCardHeader">
                  <span className={index === 0 ? 'matchBadge' : 'matchBadgeSecondary'}>
                    #{index + 1} · {score}/100
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
                  <div><small>{t('backdropRating')}</small><span>{backdrop.toFixed(1)} / 5.0</span></div>
                  <div><small>{t('comfortScore')}</small><span>{comfortScore} / 100</span></div>
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
            <strong>📍 {t('rentalMapCta')}</strong>
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

