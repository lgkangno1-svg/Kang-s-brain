'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  analyzeVisibleTone,
  VisibleToneError,
  type Depth,
  type Undertone,
  type VisibleToneResult,
} from './analyze-visible-tone';
import { getPalettes } from './palettes';
import styles from './color-scanner.module.css';

const DEFAULT_RESULT: VisibleToneResult = {
  undertone: 'neutral',
  depth: 'medium',
  contrast: 'medium',
  confidence: 0,
  lightness: 0,
  warnings: [],
};

export function ColorScanner() {
  const t = useTranslations('ColorScanner');
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [result, setResult] = useState<VisibleToneResult>(DEFAULT_RESULT);
  const [undertone, setUndertone] = useState<Undertone>('neutral');
  const [depth, setDepth] = useState<Depth>('medium');
  const [activeCompare, setActiveCompare] = useState<'current' | 'alternate'>('current');
  const [showGuide, setShowGuide] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ready' | 'running' | 'done'>('idle');
  const [errorCode, setErrorCode] = useState<'canvasUnavailable' | 'insufficientPixels' | 'unknown' | ''>('');

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const palettes = useMemo(() => getPalettes(undertone, depth), [undertone, depth]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setFile(selected);
    setPhotoUrl(URL.createObjectURL(selected));
    setStatus('ready');
    setErrorCode('');
  }

  async function runScan() {
    if (!file) return;
    setStatus('running');
    setErrorCode('');
    try {
      const nextResult = await analyzeVisibleTone(file);
      setResult(nextResult);
      setUndertone(nextResult.undertone);
      setDepth(nextResult.depth);
      setStatus('done');
    } catch (scanError) {
      setStatus('ready');
      setErrorCode(scanError instanceof VisibleToneError ? scanError.code : 'unknown');
    }
  }

  const completed = status === 'done';
  const alternateUndertone: Undertone = undertone === 'warm' ? 'cool' : undertone === 'cool' ? 'warm' : 'warm';
  const alternatePalettes = useMemo(() => getPalettes(alternateUndertone, depth), [alternateUndertone, depth]);
  const currentPrimaryPalette = palettes[0];
  const alternatePrimaryPalette = alternatePalettes[0];
  const hanbokHref = `/hanbok?undertone=${encodeURIComponent(undertone)}#hanbok-matcher`;

  return (
    <div className={styles.shell}>
      <div className={styles.photoColumn}>
        <div className={styles.shootingGuideToggle}>
          <button
            type="button"
            className={styles.guideButton}
            onClick={() => setShowGuide(!showGuide)}
            aria-expanded={showGuide}
          >
            <span>{t('shootingGuideTitle')}</span>
            <span className={styles.chevron}>{showGuide ? '▲' : '▼'}</span>
          </button>
          {showGuide && (
            <ul className={styles.guideList}>
              <li>{t('shootingGuide1')}</li>
              <li>{t('shootingGuide2')}</li>
              <li>{t('shootingGuide3')}</li>
            </ul>
          )}
        </div>

        <div className={styles.photoStage}>
          {photoUrl ? <img src={photoUrl} alt={t('photoAlt')} /> : (
            <div className={styles.empty}>
              <div className={styles.emptyIcon} aria-hidden="true">✦</div>
              <strong>{t('emptyTitle')}</strong>
              <p>{t('emptyText')}</p>
            </div>
          )}
          <div className={styles.guide} aria-hidden="true" />
          <div className={styles.stageBadges}>
            <span className={styles.privacyBadge}>{t('browserPrivacy')}</span>
            {completed && <span className={styles.lightingBadge}>✓ {t('lightingCheck')}</span>}
          </div>
        </div>

        <label className={styles.fileButton}>
          {photoUrl ? t('chooseAnother') : t('uploadSelfie')}
          <input type="file" accept="image/*" capture="user" onChange={handleFile} />
        </label>

        <button className={styles.scanButton} type="button" onClick={runScan} disabled={!file || status === 'running'}>
          {status === 'running' ? t('running') : t('analyzeFree')}
        </button>

        {status === 'running' && (
          <div className={styles.progressSteps}>
            <div className={styles.progressStep}>
              <span className={styles.stepPulse} />
              <span>{t('analyzingStep1')}</span>
            </div>
            <div className={styles.progressStep}>
              <span className={styles.stepPulse} />
              <span>{t('analyzingStep2')}</span>
            </div>
            <div className={styles.progressStep}>
              <span className={styles.stepPulse} />
              <span>{t('analyzingStep3')}</span>
            </div>
          </div>
        )}

        {errorCode && <div className={styles.error}>{t('errors.' + errorCode)}</div>}
      </div>

      <div className={styles.resultColumn}>
        <div className={styles.resultHeader}>
          <h2>{completed ? t('resultTitle') : t('resultPlaceholder')}</h2>
          <p className={styles.disclaimer}>{t('resultDisclaimer')}</p>
        </div>

        {completed ? (
          <div className={styles.analysisResults}>
            <div className={styles.metrics}>
              <div className={styles.metric}>
                <small>{t('undertoneLabel')}</small>
                <strong className={styles.metricHighlight}>{t('undertone.' + result.undertone)}</strong>
              </div>
              <div className={styles.metric}>
                <small>{t('depthLabel')}</small>
                <strong>{t('depth.' + result.depth)}</strong>
              </div>
              <div className={styles.metric}>
                <small>{t('contrastLabel')}</small>
                <strong>{t('contrast.' + result.contrast)}</strong>
              </div>
            </div>

            {result.warnings.map((warning) => (
              <div className={styles.warning} key={warning}>{t('warnings.' + warning)}</div>
            ))}

            <div className={styles.evidenceSection}>
              <h3>{t('evidenceTitle')}</h3>
              <div className={styles.evidenceGrid}>
                <div className={styles.evidenceCard}>
                  <strong>{t('evidence1Title')}</strong>
                  <p>{t('evidence1Body')} ({t('undertone.' + result.undertone)})</p>
                </div>
                <div className={styles.evidenceCard}>
                  <strong>{t('evidence2Title')}</strong>
                  <p>{t('contrastLabel')}: {t('contrast.' + result.contrast)}</p>
                </div>
                <div className={styles.evidenceCard}>
                  <strong>{t('evidence3Title')}</strong>
                  <p>{t('evidence3Body')} ({t('depth.' + result.depth)} · L* {result.lightness}/100)</p>
                </div>
              </div>
            </div>

            <div className={styles.whyColorsBox}>
              <h3>{t('whyColorsTitle')}</h3>
              <div className={styles.whyColorsGrid}>
                <div className={styles.whyFlatter}>
                  <span className={styles.flatterTag}>✓ {t('palettes.' + currentPrimaryPalette.id + '.name')}</span>
                  <p>{t('palettes.' + currentPrimaryPalette.id + '.note')}</p>
                </div>
                <div className={styles.whyHeavy}>
                  <span className={styles.heavyTag}>↔ {t('palettes.' + alternatePrimaryPalette.id + '.name')}</span>
                  <p>{t('palettes.' + alternatePrimaryPalette.id + '.note')}</p>
                </div>
              </div>
            </div>

            <div className={styles.compareBox}>
              <div className={styles.compareHeader}>
                <h3>{t('compareTitle')}</h3>
                <div className={styles.compareTabs}>
                  <button
                    type="button"
                    className={activeCompare === 'current' ? styles.activeTab : styles.inactiveTab}
                    onClick={() => setActiveCompare('current')}
                  >
                    {t('undertone.' + undertone)}
                  </button>
                  <button
                    type="button"
                    className={activeCompare === 'alternate' ? styles.activeTab : styles.inactiveTab}
                    onClick={() => setActiveCompare('alternate')}
                  >
                    {t('undertone.' + alternateUndertone)}
                  </button>
                </div>
              </div>
            </div>

            <div className={styles.manual}>
              <label>
                <span>{t('correctUndertone')}</span>
                <select value={undertone} onChange={(event) => setUndertone(event.target.value as Undertone)}>
                  <option value="warm">{t('undertone.warm')}</option>
                  <option value="neutral">{t('undertone.neutral')}</option>
                  <option value="cool">{t('undertone.cool')}</option>
                </select>
              </label>
              <label>
                <span>{t('correctDepth')}</span>
                <select value={depth} onChange={(event) => setDepth(event.target.value as Depth)}>
                  <option value="light">{t('depth.light')}</option>
                  <option value="medium">{t('depth.medium')}</option>
                  <option value="deep">{t('depth.deep')}</option>
                </select>
              </label>
            </div>

            <div className={styles.paletteSection}>
              <h3>{t('hanbokColors')}</h3>
              <div className={styles.paletteList}>
                {(activeCompare === 'current' ? palettes : alternatePalettes).map((palette, index) => (
                  <div className={styles.palette} key={palette.id}>
                    <div className={styles.paletteHeader}>
                      <strong>{index + 1}. {t('palettes.' + palette.id + '.name')}</strong>
                      <span>{t('palettes.' + palette.id + '.note')}</span>
                    </div>
                    <div className={styles.swatches} aria-label={t('paletteAria', { name: t('palettes.' + palette.id + '.name') })}>
                      {palette.colors.map((color) => (
                        <div key={color} className={styles.swatchItem}>
                          <i style={{ backgroundColor: color }} />
                          <span className={styles.hexCode}>{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.variationCard}>
              <strong>{t('variationTitle')}</strong>
              <p>{t('variationText')}</p>
            </div>

            <div className={styles.hanbokActionCard}>
              <Link href={hanbokHref} className={styles.hanbokCtaButton}>
                {t('matchHanbokCta')}
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.pendingPlaceholder}>
            <div className={styles.placeholderCard}>
              <span className={styles.placeholderIcon}>✦</span>
              <p>{t('emptyText')}</p>
            </div>
          </div>
        )}

        <div className={styles.note}>{t('sensitiveTraitNote')}</div>
      </div>
    </div>
  );
}
