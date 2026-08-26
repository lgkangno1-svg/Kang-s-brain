import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const messages = JSON.parse(await readFile(resolve(root, 'messages', 'public', 'en.json'), 'utf8'));

const required = [
  'Color.eyebrow',
  'Color.title',
  'Color.intro',
  'Meta.colorTitle',
  'Meta.colorDescription',
  'ColorScanner.errors.canvasUnavailable',
  'ColorScanner.errors.insufficientPixels',
  'ColorScanner.errors.unknown',
  'ColorScanner.warnings.darkPhoto',
  'ColorScanner.warnings.overexposedPhoto',
  'ColorScanner.warnings.limitedPixels',
  'ColorScanner.undertone.warm',
  'ColorScanner.undertone.neutral',
  'ColorScanner.undertone.cool',
  'ColorScanner.depth.light',
  'ColorScanner.depth.medium',
  'ColorScanner.depth.deep',
  'ColorScanner.contrast.soft',
  'ColorScanner.contrast.medium',
  'ColorScanner.contrast.high',
  'ColorScanner.palettes.jadeWarmIvory.name',
  'ColorScanner.palettes.jadeWarmIvory.note',
  'ColorScanner.palettes.peachSage.name',
  'ColorScanner.palettes.peachSage.note',
  'ColorScanner.palettes.creamCrimson.name',
  'ColorScanner.palettes.creamCrimson.note',
  'ColorScanner.palettes.softWhiteJade.name',
  'ColorScanner.palettes.softWhiteJade.note',
  'ColorScanner.palettes.dustyRoseNavy.name',
  'ColorScanner.palettes.dustyRoseNavy.note',
  'ColorScanner.palettes.mutedPlumIvory.name',
  'ColorScanner.palettes.mutedPlumIvory.note',
  'ColorScanner.palettes.moonBlueSoftWhite.name',
  'ColorScanner.palettes.moonBlueSoftWhite.note',
  'ColorScanner.palettes.lilacPlum.name',
  'ColorScanner.palettes.lilacPlum.note',
  'ColorScanner.palettes.roseDeepNavy.name',
  'ColorScanner.palettes.roseDeepNavy.note',
];

function get(path) {
  return path.split('.').reduce((value, key) => value?.[key], messages);
}

const missing = required.filter((path) => typeof get(path) !== 'string' || get(path).trim().length === 0);
if (missing.length) {
  console.error(`Personal-color message contract failed: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Personal-color message contract OK: ${required.length} required English schema keys.`);
