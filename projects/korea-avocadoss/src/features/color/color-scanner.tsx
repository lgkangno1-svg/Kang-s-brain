'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { analyzeVisibleTone, type Depth, type Undertone, type VisibleToneResult } from './analyze-visible-tone';
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
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [result, setResult] = useState<VisibleToneResult>(DEFAULT_RESULT);
  const [undertone, setUndertone] = useState<Undertone>('neutral');
  const [depth, setDepth] = useState<Depth>('medium');
  const [status, setStatus] = useState<'idle' | 'ready' | 'running' | 'done'>('idle');
  const [error, setError] = useState('');

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
    setError('');
  }

  async function runScan() {
    if (!file) return;
    setStatus('running');
    setError('');
    try {
      const nextResult = await analyzeVisibleTone(file);
      setResult(nextResult);
      setUndertone(nextResult.undertone);
      setDepth(nextResult.depth);
      setStatus('done');
    } catch (scanError) {
      setStatus('ready');
      setError(scanError instanceof Error ? scanError.message : 'We could not analyze this photo.');
    }
  }

  const completed = status === 'done';

  return (
    <div className={styles.shell}>
      <div className={styles.photoColumn}>
        <div className={styles.photoStage}>
          {photoUrl ? <img src={photoUrl} alt="Uploaded selfie preview" /> : (
            <div className={styles.empty}>
              <strong>Add a clear selfie</strong>
              Face forward in natural light. Avoid strong filters, colored lighting and deep shadows.
            </div>
          )}
          <div className={styles.guide} aria-hidden="true" />
        </div>
        <label className={styles.fileButton}>
          {photoUrl ? 'Choose another photo' : 'Upload or take a selfie'}
          <input type="file" accept="image/*" capture="user" onChange={handleFile} />
        </label>
        <button className={styles.scanButton} type="button" onClick={runScan} disabled={!file || status === 'running'}>
          {status === 'running' ? 'Reading visible colors…' : 'Analyze my colors — free preview'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.resultColumn}>
        <h2>{completed ? 'Your visible color tendency' : 'Your result will appear here'}</h2>
        <p>This is a photo-based estimate under the current lighting, not a professional personal-color diagnosis. You can correct the result before using it for Hanbok matching.</p>

        <div className={styles.metrics}>
          <div className={styles.metric}><small>Undertone tendency</small><strong>{completed ? result.undertone : '—'}</strong></div>
          <div className={styles.metric}><small>Visible depth</small><strong>{completed ? result.depth : '—'}</strong></div>
          <div className={styles.metric}><small>Contrast</small><strong>{completed ? result.contrast : '—'}</strong></div>
        </div>

        <div className={styles.confidence}>
          {completed ? `Estimate confidence ${Math.round(result.confidence * 100)}% · lightness index ${result.lightness}/100` : 'Your selfie stays in this browser for this MVP scan.'}
        </div>

        {completed && result.warnings.map((warning) => <div className={styles.warning} key={warning}>{warning}</div>)}

        <div className={styles.manual}>
          <label>Correct undertone
            <select value={undertone} onChange={(event) => setUndertone(event.target.value as Undertone)}>
              <option value="warm">Warm</option>
              <option value="neutral">Neutral</option>
              <option value="cool">Cool</option>
            </select>
          </label>
          <label>Correct visible depth
            <select value={depth} onChange={(event) => setDepth(event.target.value as Depth)}>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="deep">Deep</option>
            </select>
          </label>
        </div>

        <h3>Hanbok colors to try</h3>
        <div className={styles.paletteList}>
          {palettes.map((palette, index) => (
            <div className={styles.palette} key={palette.name}>
              <div className={styles.paletteHeader}><strong>{index + 1}. {palette.name}</strong><span>{palette.note}</span></div>
              <div className={styles.swatches} aria-label={`${palette.name} colors`}>
                {palette.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.note}>The scan uses only visible color pixels for styling guidance. It does not identify you or infer race, ethnicity, nationality, religion, health or attractiveness.</div>
      </div>
    </div>
  );
}
