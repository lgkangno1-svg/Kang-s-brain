'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
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

  return (
    <div className={styles.shell}>
      <div className={styles.photoColumn}>
        <div className={styles.photoStage}>
          {photoUrl ? <img src={photoUrl} alt={t('photoAlt')} /> : (
            <div className={styles.empty}>
              <strong>{t('emptyTitle')}</strong>
              {t('emptyText')}
            </div>
          )}
          <div className={styles.guide} aria-hidden="true" />
        </div>
        <label className={styles.fileButton}>
          {photoUrl ? t('chooseAnother') : t('uploadSelfie')}
          <input type="file" accept="image/*" capture="user" onChange={handleFile} />
        </label>
        <button className={styles.scanButton} type="button" onClick={runScan} disabled={!file || status === 'running'}>
          {status === 'running' ? t('running') : t('analyzeFree')}
        </button>
        {errorCode && <div className={styles.error}>{t(`errors.${errorCode}`)}</div>}
      </div>

      <div className={styles.resultColumn}>
        <h2>{completed ? t('resultTitle') : t('resultPlaceholder')}</h2>
        <p>{t('resultDisclaimer')}</p>

        <div className={styles.metrics}>
          <div className={styles.metric}>
            <small>{t('undertoneLabel')}</small>
            <strong>{completed ? t(`undertone.${result.undertone}`) : '—'}</strong>
          </div>
          <div className={styles.metric}>
            <small>{t('depthLabel')}</small>
            <strong>{completed ? t(`depth.${result.depth}`) : '—'}</strong>
          </div>
          <div className={styles.metric}>
            <small>{t('contrastLabel')}</small>
            <strong>{completed ? t(`contrast.${result.contrast}`) : '—'}</strong>
          </div>
        </div>

        <div className={styles.confidence}>
          {completed
            ? t('confidence', { confidence: Math.round(result.confidence * 100), lightness: result.lightness })
            : t('browserPrivacy')}
        </div>

        {completed && result.warnings.map((warning) => (
          <div className={styles.warning} key={warning}>{t(`warnings.${warning}`)}</div>
        ))}

        <div className={styles.manual}>
          <label>{t('correctUndertone')}
            <select value={undertone} onChange={(event) => setUndertone(event.target.value as Undertone)}>
              <option value="warm">{t('undertone.warm')}</option>
              <option value="neutral">{t('undertone.neutral')}</option>
              <option value="cool">{t('undertone.cool')}</option>
            </select>
          </label>
          <label>{t('correctDepth')}
            <select value={depth} onChange={(event) => setDepth(event.target.value as Depth)}>
              <option value="light">{t('depth.light')}</option>
              <option value="medium">{t('depth.medium')}</option>
              <option value="deep">{t('depth.deep')}</option>
            </select>
          </label>
        </div>

        <h3>{t('hanbokColors')}</h3>
        <div className={styles.paletteList}>
          {palettes.map((palette, index) => (
            <div className={styles.palette} key={palette.id}>
              <div className={styles.paletteHeader}>
                <strong>{index + 1}. {t(`palettes.${palette.id}.name`)}</strong>
                <span>{t(`palettes.${palette.id}.note`)}</span>
              </div>
              <div className={styles.swatches} aria-label={t('paletteAria', { name: t(`palettes.${palette.id}.name`) })}>
                {palette.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.note}>{t('sensitiveTraitNote')}</div>
      </div>
    </div>
  );
}
