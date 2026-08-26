export type Undertone = 'warm' | 'neutral' | 'cool';
export type Depth = 'light' | 'medium' | 'deep';
export type Contrast = 'soft' | 'medium' | 'high';

export type VisibleToneResult = {
  undertone: Undertone;
  depth: Depth;
  contrast: Contrast;
  confidence: number;
  lightness: number;
  warnings: string[];
};

type RGB = { r: number; g: number; b: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function srgbToLinear(channel: number) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function rgbToLab({ r, g, b }: RGB) {
  const rl = srgbToLinear(r);
  const gl = srgbToLinear(g);
  const bl = srgbToLinear(b);

  const x = (rl * 0.4124 + gl * 0.3576 + bl * 0.1805) / 0.95047;
  const y = rl * 0.2126 + gl * 0.7152 + bl * 0.0722;
  const z = (rl * 0.0193 + gl * 0.1192 + bl * 0.9505) / 1.08883;

  const f = (v: number) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  const fx = f(x);
  const fy = f(y);
  const fz = f(z);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

function isLikelySkinPixel(r: number, g: number, b: number) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

  return y > 35 && y < 242 && cb >= 72 && cb <= 138 && cr >= 128 && cr <= 184;
}

function getStats(pixels: RGB[]) {
  const totals = pixels.reduce(
    (acc, pixel) => ({ r: acc.r + pixel.r, g: acc.g + pixel.g, b: acc.b + pixel.b }),
    { r: 0, g: 0, b: 0 },
  );

  const average = {
    r: totals.r / pixels.length,
    g: totals.g / pixels.length,
    b: totals.b / pixels.length,
  };

  const luminances = pixels.map(({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b);
  const meanLuminance = luminances.reduce((sum, value) => sum + value, 0) / luminances.length;
  const variance = luminances.reduce((sum, value) => sum + (value - meanLuminance) ** 2, 0) / luminances.length;

  return { average, luminanceStdDev: Math.sqrt(variance) };
}

export async function analyzeVisibleTone(file: File): Promise<VisibleToneResult> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const width = 180;
  const height = 180;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) throw new Error('Canvas is unavailable in this browser.');

  // Central upper crop approximates the face area without running face recognition.
  const sourceWidth = bitmap.width * 0.5;
  const sourceHeight = bitmap.height * 0.48;
  const sourceX = bitmap.width * 0.25;
  const sourceY = bitmap.height * 0.12;
  context.drawImage(bitmap, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
  bitmap.close();

  const data = context.getImageData(0, 0, width, height).data;
  const candidates: RGB[] = [];
  const fallback: RGB[] = [];

  // Sample every fourth pixel to keep phone execution cheap.
  for (let index = 0; index < data.length; index += 16) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = (r + g + b) / 3;

    if (brightness > 38 && brightness < 242 && max - min < 120) {
      fallback.push({ r, g, b });
    }
    if (isLikelySkinPixel(r, g, b)) {
      candidates.push({ r, g, b });
    }
  }

  const pixels = candidates.length >= 120 ? candidates : fallback;
  if (pixels.length < 80) {
    throw new Error('We could not read enough usable pixels. Try a brighter, front-facing photo.');
  }

  const { average, luminanceStdDev } = getStats(pixels);
  const lab = rgbToLab(average);

  // This is intentionally described as a visible tendency rather than a professional diagnosis.
  const warmthIndex = lab.b - lab.a * 0.22;
  let undertone: Undertone = 'neutral';
  if (warmthIndex >= 10.5) undertone = 'warm';
  if (warmthIndex <= 6.2) undertone = 'cool';

  let depth: Depth = 'medium';
  if (lab.l >= 70) depth = 'light';
  if (lab.l <= 47) depth = 'deep';

  let contrast: Contrast = 'medium';
  if (luminanceStdDev <= 24) contrast = 'soft';
  if (luminanceStdDev >= 42) contrast = 'high';

  const skinRatio = candidates.length / Math.max(1, data.length / 16);
  const warnings: string[] = [];
  if (lab.l < 35) warnings.push('The photo looks dark. Daylight may give a more reliable result.');
  if (lab.l > 86) warnings.push('The face area looks overexposed. Try softer natural light.');
  if (skinRatio < 0.08) warnings.push('We found limited face-like color pixels, so please review the estimate manually.');

  const confidence = clamp(0.42 + skinRatio * 1.6 - warnings.length * 0.06, 0.38, 0.82);

  return {
    undertone,
    depth,
    contrast,
    confidence,
    lightness: Math.round(lab.l),
    warnings,
  };
}
