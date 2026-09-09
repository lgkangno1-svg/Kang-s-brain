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
import {ColorUploadError,validateColorUpload,type ColorUploadErrorCode} from './validate-color-upload';
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
type UploadCopy={checking:string;errors:Record<ColorUploadErrorCode,string>};

const FABRIC_COPY: Record<P0Locale, FabricCopy> = {
  en: {title: 'Recommended Fabrics', items: [['Silk Satin', 'Rich, lustrous fall'], ['Raw Silk', 'Organic, textured drape'], ['Velvet', 'Opulent, soft structure'], ['Linen', 'Natural, breathable flow']]},
  'zh-CN': {title: '推荐面料', items: [['真丝缎', '光泽饱满，垂坠顺滑'], ['生丝', '自然纹理，柔和垂坠'], ['天鹅绒', '华丽柔软，富有结构'], ['亚麻', '自然透气，轻盈垂坠']]},
  ja: {title: 'おすすめ素材', items: [['シルクサテン', '豊かな光沢となめらかな落ち感'], ['ローシルク', '自然な質感とやわらかな落ち感'], ['ベルベット', '上品で柔らかな立体感'], ['リネン', '自然で通気性のよい軽やかさ']]},
  'zh-TW': {title: '推薦面料', items: [['真絲緞', '光澤飽滿，垂墜順滑'], ['生絲', '自然紋理，柔和垂墜'], ['天鵝絨', '華麗柔軟，富有結構'], ['亞麻', '自然透氣，輕盈垂墜']]},
  vi: {title: 'Chất liệu gợi ý', items: [['Lụa satin', 'Bóng mượt, rủ sang trọng'], ['Lụa thô', 'Vân tự nhiên, độ rủ mềm'], ['Nhung', 'Mềm, sang trọng và có phom'], ['Linen', 'Tự nhiên, thoáng và nhẹ']]},
  th: {title: 'เนื้อผ้าแนะนำ', items: [['ผ้าไหมซาติน', 'เงางามและทิ้งตัวสวย'], ['ไหมดิบ', 'พื้นผิวธรรมชาติและนุ่มพลิ้ว'], ['กำมะหยี่', 'นุ่มหรูและมีโครง'], ['ลินิน', 'เป็นธรรมชาติ ระบายอากาศดี']]},
};

const UPLOAD_COPY:Record<P0Locale,UploadCopy>={
 en:{checking:'Checking photo…',errors:{unsupportedType:'Use a JPEG, PNG or WebP photo. HEIC/other formats may not decode reliably in every browser.',tooLarge:'This photo is too large. Choose an image under 12 MB.',tooSmall:'This photo is too small for a useful color estimate. Use at least 240 × 240 px.',tooManyPixels:'This photo has too many pixels for safe mobile processing. Choose a smaller photo (up to 36 MP).',decodeFailed:'This image could not be decoded. Try a different JPEG, PNG or WebP photo.'}},
 'zh-CN':{checking:'正在检查照片…',errors:{unsupportedType:'请使用 JPEG、PNG 或 WebP。HEIC 等格式并非所有浏览器都能稳定解析。',tooLarge:'照片过大，请选择 12 MB 以下的图片。',tooSmall:'照片尺寸太小，无法进行有效色彩估计。请至少使用 240 × 240 px。',tooManyPixels:'图片像素过高，不适合在手机上安全处理。请选择 3600 万像素以内的图片。',decodeFailed:'无法读取这张图片，请换一张 JPEG、PNG 或 WebP。'}},
 ja:{checking:'写真を確認中…',errors:{unsupportedType:'JPEG、PNG、WebP を使用してください。HEIC などはブラウザによって安定して読み込めない場合があります。',tooLarge:'写真が大きすぎます。12 MB 未満の画像を選んでください。',tooSmall:'色の推定には画像が小さすぎます。240 × 240 px 以上を使用してください。',tooManyPixels:'モバイルで安全に処理するには画素数が多すぎます。3600万画素以下の写真を選んでください。',decodeFailed:'画像を読み込めませんでした。別の JPEG、PNG、WebP を試してください。'}},
 'zh-TW':{checking:'正在檢查照片…',errors:{unsupportedType:'請使用 JPEG、PNG 或 WebP。HEIC 等格式並非所有瀏覽器都能穩定解析。',tooLarge:'照片過大，請選擇 12 MB 以下的圖片。',tooSmall:'照片尺寸太小，無法進行有效色彩估計。請至少使用 240 × 240 px。',tooManyPixels:'圖片像素過高，不適合在手機上安全處理。請選擇 3600 萬像素以內的圖片。',decodeFailed:'無法讀取這張圖片，請換一張 JPEG、PNG 或 WebP。'}},
 vi:{checking:'Đang kiểm tra ảnh…',errors:{unsupportedType:'Hãy dùng ảnh JPEG, PNG hoặc WebP. HEIC và các định dạng khác có thể không được mọi trình duyệt giải mã ổn định.',tooLarge:'Ảnh quá lớn. Hãy chọn ảnh dưới 12 MB.',tooSmall:'Ảnh quá nhỏ để ước tính màu hữu ích. Hãy dùng ảnh ít nhất 240 × 240 px.',tooManyPixels:'Ảnh có quá nhiều pixel để xử lý an toàn trên điện thoại. Hãy chọn ảnh tối đa 36 MP.',decodeFailed:'Không thể đọc ảnh này. Hãy thử một ảnh JPEG, PNG hoặc WebP khác.'}},
 th:{checking:'กำลังตรวจรูป…',errors:{unsupportedType:'โปรดใช้รูป JPEG, PNG หรือ WebP เพราะ HEIC และรูปแบบอื่นอาจถอดรหัสไม่เสถียรในบางเบราว์เซอร์',tooLarge:'รูปมีขนาดไฟล์ใหญ่เกินไป โปรดเลือกรูปต่ำกว่า 12 MB',tooSmall:'รูปเล็กเกินไปสำหรับการประเมินสี โปรดใช้รูปอย่างน้อย 240 × 240 px',tooManyPixels:'รูปมีจำนวนพิกเซลมากเกินไปสำหรับการประมวลผลบนมือถืออย่างปลอดภัย โปรดใช้ไม่เกิน 36 MP',decodeFailed:'ไม่สามารถอ่านรูปนี้ได้ โปรดลอง JPEG, PNG หรือ WebP รูปอื่น'}}
};

export function ColorScanner() {
  const t = useTranslations('ColorScanner');
  const locale = useLocale();
  const p0Locale=(locale in UPLOAD_COPY?locale:'en') as P0Locale;
  const fabricCopy = FABRIC_COPY[p0Locale] ?? FABRIC_COPY.en;
  const uploadCopy=UPLOAD_COPY[p0Locale];
  const [file, setFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [result, setResult] = useState<VisibleToneResult>(DEFAULT_RESULT);
  const [undertone, setUndertone] = useState<Undertone>('neutral');
  const [depth, setDepth] = useState<Depth>('medium');
  const [showGuide, setShowGuide] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'ready' | 'running' | 'done'>('idle');
  const [errorCode, setErrorCode] = useState<'canvasUnavailable' | 'insufficientPixels' | 'unknown' | ''>('');
  const [uploadError,setUploadError]=useState('');

  useEffect(() => () => {
    if (photoUrl) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  const palettes = useMemo(() => getPalettes(undertone, depth), [undertone, depth]);
  const swatchColors = useMemo(() => palettes.flatMap((palette) => palette.colors).slice(0, 12), [palettes]);
  const currentPrimaryPalette = palettes[0];

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    setStatus('checking');setUploadError('');setErrorCode('');
    try{
      await validateColorUpload(selected);
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      setFile(selected);
      setPhotoUrl(URL.createObjectURL(selected));
      setStatus('ready');
    }catch(error){
      const code=error instanceof ColorUploadError?error.code:'decodeFailed';
      setUploadError(uploadCopy.errors[code]);
      setStatus(file?'ready':'idle');
      event.currentTarget.value='';
    }
  }

  async function runScan() {
    if (!file) return;
    setStatus('running');
    setErrorCode('');setUploadError('');
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
  const hanbokHref = `/hanbok?undertone=${encodeURIComponent(undertone)}&depth=${encodeURIComponent(depth)}&contrast=${encodeURIComponent(result.contrast)}#hanbok-matcher`;
  const resultLabel = locale === 'en' ? 'Personal Color Result' : t('resultTitle');
  const directionLabel = locale === 'en' ? 'YOUR COLOR DIRECTION' : t('resultTitle');

  return (
    <div className={`${styles.shell} ${completed ? 'stitchColorCompleted' : ''}`}>
      <div className={`${styles.photoColumn} stitchColorPhotoColumn`}>
        <div className={styles.shootingGuideToggle}>
          <button type="button" className={styles.guideButton} onClick={() => setShowGuide(!showGuide)} aria-expanded={showGuide}>
            <span>{t('shootingGuideTitle')}</span><span className={styles.chevron}>{showGuide ? '▲' : '▼'}</span>
          </button>
          {showGuide && <ul className={styles.guideList}><li>{t('shootingGuide1')}</li><li>{t('shootingGuide2')}</li><li>{t('shootingGuide3')}</li></ul>}
        </div>

        <div className={styles.photoStage}>
          {photoUrl ? <img src={photoUrl} alt={t('photoAlt')} /> : <div className={styles.empty}><div className={styles.emptyIcon} aria-hidden="true">✦</div><strong>{t('emptyTitle')}</strong><p>{t('emptyText')}</p></div>}
          <div className={styles.guide} aria-hidden="true" />
          <div className={styles.stageBadges}><span className={styles.privacyBadge}>{t('browserPrivacy')}</span>{completed && <span className={styles.lightingBadge}>✓ {t('lightingCheck')}</span>}</div>
        </div>

        <label className={styles.fileButton}>
          {status==='checking'?uploadCopy.checking:(photoUrl ? t('chooseAnother') : t('uploadSelfie'))}
          <input type="file" accept="image/jpeg,image/png,image/webp" capture="user" onChange={handleFile} disabled={status==='checking'||status==='running'} />
        </label>

        <button className={styles.scanButton} type="button" onClick={runScan} disabled={!file || status === 'running'||status==='checking'}>
          {status === 'running' ? t('running') : t('analyzeFree')}
        </button>

        {status === 'running' && <div className={styles.progressSteps}><div className={styles.progressStep}><span className={styles.stepPulse} /><span>{t('analyzingStep1')}</span></div><div className={styles.progressStep}><span className={styles.stepPulse} /><span>{t('analyzingStep2')}</span></div><div className={styles.progressStep}><span className={styles.stepPulse} /><span>{t('analyzingStep3')}</span></div></div>}

        {uploadError && <div className={styles.error} role="alert">{uploadError}</div>}
        {errorCode && <div className={styles.error} role="alert">{t('errors.' + errorCode)}</div>}
      </div>

      <div className={`${styles.resultColumn} stitchColorResultColumn`}>
        {!completed ? <><div className={styles.resultHeader}><h2>{t('resultPlaceholder')}</h2><p className={styles.disclaimer}>{t('resultDisclaimer')}</p></div><div className={styles.pendingPlaceholder}><div className={styles.placeholderCard}><span className={styles.placeholderIcon}>✦</span><p>{t('emptyText')}</p></div></div><div className={styles.note}>{t('sensitiveTraitNote')}</div></> : (
          <article className="stitchColorResultCard" aria-labelledby="personal-color-result-title">
            <div className="stitchColorResultBrand">Korea Concierge <span>|</span> {resultLabel}</div>
            <header className="stitchColorDirection"><h2 id="personal-color-result-title">{directionLabel}: {t('undertone.' + result.undertone).toUpperCase()}</h2><p>{t('resultDisclaimer')}</p></header>
            {result.warnings.map((warning) => <div className={styles.warning} key={warning}>{t('warnings.' + warning)}</div>)}
            <section className="stitchColorSwatches" aria-label={t('hanbokColors')}>{swatchColors.map((color, index) => <div className="stitchColorSwatch" key={`${color}-${index}`}><i style={{backgroundColor: color}} /><span>{color}</span></div>)}</section>
            <div className="stitchColorOrnament" aria-hidden="true"><span>❧</span></div>
            <section className="stitchColorDetails">
              <div className="stitchColorWhy"><h3>{t('whyColorsTitle')}</h3><ul><li>{t('evidence1Body')} ({t('undertone.' + result.undertone)})</li><li>{t('palettes.' + currentPrimaryPalette.id + '.note')}</li></ul><h4>{t('variationTitle')}</h4><p>{t('variationText')}</p></div>
              <div className="stitchColorFabrics"><h3>{fabricCopy.title}</h3><div className="stitchFabricGrid">{fabricCopy.items.map(([name, note], index) => <div className="stitchFabric" key={name}><i data-fabric={index} aria-hidden="true" /><div><strong>{name}</strong><span>{note}</span></div></div>)}</div></div>
            </section>
            <div className="stitchColorOrnament" aria-hidden="true"><span>❧</span></div>
            <section className="stitchColorHanbokBridge"><div className="stitchHanbokIllustration" aria-hidden="true"><span>◇</span><span>◇</span></div><div><h3>{t('hanbokColors')}</h3><p>{t('variationText')}</p></div></section>
            <Link href={hanbokHref} className="stitchColorContinue">{t('matchHanbokCta')}</Link>
            <details className="stitchColorAdjust"><summary>{t('correctUndertone')} / {t('correctDepth')}</summary><div className={styles.manual}><label><span>{t('correctUndertone')}</span><select value={undertone} onChange={(event) => setUndertone(event.target.value as Undertone)}><option value="warm">{t('undertone.warm')}</option><option value="neutral">{t('undertone.neutral')}</option><option value="cool">{t('undertone.cool')}</option></select></label><label><span>{t('correctDepth')}</span><select value={depth} onChange={(event) => setDepth(event.target.value as Depth)}><option value="light">{t('depth.light')}</option><option value="medium">{t('depth.medium')}</option><option value="deep">{t('depth.deep')}</option></select></label></div></details>
            <p className="stitchColorPrivacyNote">{t('sensitiveTraitNote')}</p>
          </article>
        )}
      </div>
    </div>
  );
}
