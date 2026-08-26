'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

const COLOR_IDS = ['jadeIvory', 'roseNavy', 'moonBlue'] as const;
const MOOD_IDS = ['elegant', 'royal', 'romantic', 'minimal', 'kdrama'] as const;
const COMFORT_IDS = ['walking', 'balanced', 'photoFirst'] as const;

type ColorId = (typeof COLOR_IDS)[number];
type MoodId = (typeof MOOD_IDS)[number];
type ComfortId = (typeof COMFORT_IDS)[number];

export function HanbokMatcher() {
  const t = useTranslations('HanbokMatcher');
  const [color, setColor] = useState<ColorId>('jadeIvory');
  const [mood, setMood] = useState<MoodId>('elegant');
  const [comfort, setComfort] = useState<ComfortId>('balanced');

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
        <fieldset className="hanbokFieldset">
          <legend>{t('colorLegend')}</legend>
          <p className="hanbokFieldHelp">{t('colorHelp')}</p>
          <div className="hanbokChoiceGrid">
            {COLOR_IDS.map((id) => (
              <label className="hanbokChoice" key={id}>
                <input
                  checked={color === id}
                  name="hanbok-color"
                  onChange={() => setColor(id)}
                  type="radio"
                  value={id}
                />
                <span>{t(`colors.${id}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="hanbokFieldset">
          <legend>{t('moodLegend')}</legend>
          <p className="hanbokFieldHelp">{t('moodHelp')}</p>
          <div className="hanbokChoiceGrid">
            {MOOD_IDS.map((id) => (
              <label className="hanbokChoice" key={id}>
                <input
                  checked={mood === id}
                  name="hanbok-mood"
                  onChange={() => setMood(id)}
                  type="radio"
                  value={id}
                />
                <span>{t(`moods.${id}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="hanbokFieldset">
          <legend>{t('comfortLegend')}</legend>
          <p className="hanbokFieldHelp">{t('comfortHelp')}</p>
          <div className="hanbokChoiceGrid">
            {COMFORT_IDS.map((id) => (
              <label className="hanbokChoice" key={id}>
                <input
                  checked={comfort === id}
                  name="hanbok-comfort"
                  onChange={() => setComfort(id)}
                  type="radio"
                  value={id}
                />
                <span>{t(`comfort.${id}`)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <section aria-live="polite" className="hanbokResult" aria-labelledby="hanbok-result-title">
        <p className="eyebrow">{t('resultEyebrow')}</p>
        <h3 id="hanbok-result-title">{t(`directions.${mood}.name`)}</h3>
        <dl className="hanbokResultFacts">
          <div>
            <dt>{t('resultPalette')}</dt>
            <dd>{t(`colors.${color}`)}</dd>
          </div>
          <div>
            <dt>{t('resultTripPriority')}</dt>
            <dd>{t(`comfort.${comfort}`)}</dd>
          </div>
        </dl>
        <p>{t(`directions.${mood}.reason`)}</p>
        <p>{t(`comfortNotes.${comfort}`)}</p>
        <div className="contextBox">
          <strong>{t('freeBoundaryTitle')}</strong>
          <p>{t('freeBoundaryText')}</p>
          <p>{t('paidBoundaryText')}</p>
        </div>
      </section>
    </div>
  );
}
