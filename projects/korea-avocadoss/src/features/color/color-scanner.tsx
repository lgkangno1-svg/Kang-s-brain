'use client';

import {ChangeEvent, useEffect, useMemo, useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {
  analyzeVisibleTone,
  VisibleToneError,
  type Depth,
  type Undertone,
  type VisibleToneResult,
} from './analyze-visible-tone';
import {getPalettes} from './palettes';
import styles from './color-scanner.module.css';

const DEFAULT_RESULT: VisibleToneResult = {
  undertone: 'neutral',
  depth: 'medium',
  contrast: 'medium',
  confidence: 0,
  lightness: 0,
  warnings: [],
};

type P0Locale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';
type FabricCopy = {title: string; items: readonly (readonly [string, string])[]};

const FABRIC_COPY: Record<P0Locale, FabricCopy> = {
  en: {title: 'Recommended Fabrics', items: [['Silk Satin', 'Rich, lustrous fall'], ['Raw Silk', 'Organic, textured drape'], ['Velvet', 'Opulent, soft structure'], ['Linen', 'Natural, breathable flow']]},
  'zh-CN': {title: '推荐面料', items: [['真丝缎', '光泽饱满，垂坠顺滑'], ['生丝', '自然纹理，柔和垂坠'], ['天鹅绒', '华丽柔软，富有结构'], ['亚麻', '自然透气，轻盈垂坠']]},
  ja: {title: 'おすすめ素材', items: [['シルクサテン', '豊かな光沢となめらかな落ち感'], ['ローシルク', '自然な質感とやわらかな落ち感'], ['ベルベット', '上品で柔らかな立体感'], ['リネン', '自然で通気性のよい軽やかさ']]},
  'zh-TW': {title: '推薦面料', items: [['真絲緞', '光澤飽滿，垂墜順滑'], ['生絲', '自然紋理，柔和垂墜'], ['天鵝絨', '華麗柔軟，富有結構'], ['亞麻', '自然透氣，輕盈垂墜']]},
  vi: {title: 'Chất liệu gợi ý', items: [['Lụa satin', 'Bóng mượt, rủ sang trọng'], ['Lụa thô', 'Vân tự nhiên, độ rủ mềm'], ['Nhung', 'Mềm, sang trọng và có phom'], ['Linen', 'Tự nhiên, thoáng và nhẹ']]},
  th: {title: 'เนื้อผ้าแนะนำ', items: [['ผ้าไหมซาติน', 'เงางามและทิ้งตัวสวย'], ['ไหมดิบ', 'พื้นผิวธรรมชาติและนุ่มพลิ้ว'], ['กำมะหยี่', 'นุ่มหรูและมีโครง'], ['ลินิน', 'เป็นธรรมชาติ ระบายอากาศดี']]},
};

export function ColorScanner() {
  const t = useTranslations('ColorScanner');
  const locale = useLocale();
  const fabricCopy = FABRIC_COPY[locale as P0Locale] ?? FABRIC_COPY.en;
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [result, setResult] = useState<VisibleToneResult>(DEFAULT_RESULT);
  const [undertone, setUndertone] = useState<Undertone>('neutral');
  const [depth, setDepth] = useState<Depth>('medium');
  const [showGuide, setShowGuide] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ready' | 'running' | 'done'>('idle');
  const [errorCode, setErrorCode] = useState<'canvasUnavailable' | 'insufficientPixels' | 'unknown' | ''>('');

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const palettes = useMemo(() => getPalettes(undertone, depth), [undertone, depth]);
  const swatchColors = useMemo(() => palettes.flatMap((palette) => palette.colors).slice(0, 12), [palettes]);
  const currentPrimaryPalette = palettes[0];

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
  const hanbokHref = `/hanbok?undertone=${encodeURIComponent(undertone)}#hanbok-matcher`;
  const resultLabel = locale === 'en' ? 'Personal Color Result' : t('resultTitle');
  const directionLabel = locale === 'en' ? 'YOUR COLOR DIRECTION' : t('resultTitle');

  return (
    <div className={`${styles.shell} ${completed ? 'stitchColorCompleted' : ''}`}>
      <div className={`${styles.photoColumn} stitchColorPhotoColumn`}>
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
            <div className={styles.progressStep}><span className={styles.stepPulse} /><span>{t('analyzingStep1')}</span></div>
            <div className={styles.progressStep}><span className={styles.stepPulse} /><span>{t('analyzingStep2')}</span></div>
            <div className={styles.progressStep}><span className={styles.stepPulse} /><span>{t('analyzingStep3')}</span></div>
          </div>
        )}

        {errorCode && <div className={styles.error}>{t('errors.' + errorCode)}</div>}
      </div>

      <div className={`${styles.resultColumn} stitchColorResultColumn`}>
        {!completed ? (
          <>
            <div className={styles.resultHeader}>
              <h2>{t('resultPlaceholder')}</h2>
              <p className={styles.disclaimer}>{t('resultDisclaimer')}</p>
            </div>
            <div className={styles.pendingPlaceholder}>
              <div className={styles.placeholderCard}><span className={styles.placeholderIcon}>✦</span><p>{t('emptyText')}</p></div>
            </div>
            <div className={styles.note}>{t('sensitiveTraitNote')}</div>
          </>
        ) : (
          <article className="stitchColorResultCard" aria-labelledby="personal-color-result-title">
            <div className="stitchColorResultBrand">Korea Concierge <span>|</span> {resultLabel}</div>

            <header className="stitchColorDirection">
              <h2 id="personal-color-result-title">{directionLabel}: {t('undertone.' + result.undertone).toUpperCase()}</h2>
              <p>{t('resultDisclaimer')}</p>
            </header>

            {result.warnings.map((warning) => (
              <div className={styles.warning} key={warning}>{t('warnings.' + warning)}</div>
            ))}

            <section className="stitchColorSwatches" aria-label={t('hanbokColors')}>
              {swatchColors.map((color, index) => (
                <div className="stitchColorSwatch" key={`${color}-${index}`}>
                  <i style={{backgroundColor: color}} />
                  <span>{color}</span>
                </div>
              ))}
            </section>

            <div className="stitchColorOrnament" aria-hidden="true"><span>❧</span></div>

            <section className="stitchColorDetails">
              <div className="stitchColorWhy">
                <h3>{t('whyColorsTitle')}</h3>
                <ul>
                  <li>{t('evidence1Body')} ({t('undertone.' + result.undertone)})</li>
                  <li>{t('palettes.' + currentPrimaryPalette.id + '.note')}</li>
                </ul>
                <h4>{t('variationTitle')}</h4>
                <p>{t('variationText')}</p>
              </div>

              <div className="stitchColorFabrics">
                <h3>{fabricCopy.title}</h3>
                <div className="stitchFabricGrid">
                  {fabricCopy.items.map(([name, note], index) => (
                    <div className="stitchFabric" key={name}>
                      <i data-fabric={index} aria-hidden="true" />
                      <div><strong>{name}</strong><span>{note}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="stitchColorOrnament" aria-hidden="true"><span>❧</span></div>

            <section className="stitchColorHanbokBridge">
              <div className="stitchHanbokIllustration" aria-hidden="true"><span>◇</span><span>◇</span></div>
              <div>
                <h3>{t('hanbokColors')}</h3>
                <p>{t('variationText')}</p>
              </div>
            </section>

            <Link href={hanbokHref} className="stitchColorContinue">{t('matchHanbokCta')}</Link>

            <details className="stitchColorAdjust">
              <summary>{t('correctUndertone')} / {t('correctDepth')}</summary>
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
            </details>

            <p className="stitchColorPrivacyNote">{t('sensitiveTraitNote')}</p>
          </article>
        )}
      </div>
    </div>
  );
}
