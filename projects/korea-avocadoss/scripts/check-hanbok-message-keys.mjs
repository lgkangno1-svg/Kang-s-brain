import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const messages = JSON.parse(await readFile(resolve(root, 'messages', 'hanbok', 'en.json'), 'utf8'));

const colorIds = ['jadeIvory', 'roseNavy', 'moonBlue'];
const moodIds = ['elegant', 'royal', 'romantic', 'minimal', 'kdrama'];
const comfortIds = ['walking', 'balanced', 'photoFirst'];
const required = [
  'Hanbok.eyebrow', 'Hanbok.title', 'Hanbok.intro',
  'HanbokMatcher.freeEyebrow', 'HanbokMatcher.title', 'HanbokMatcher.intro',
  'HanbokMatcher.colorLegend', 'HanbokMatcher.colorHelp',
  'HanbokMatcher.moodLegend', 'HanbokMatcher.moodHelp',
  'HanbokMatcher.comfortLegend', 'HanbokMatcher.comfortHelp',
  'HanbokMatcher.resultEyebrow', 'HanbokMatcher.resultPalette', 'HanbokMatcher.resultTripPriority',
  'HanbokMatcher.freeBoundaryTitle', 'HanbokMatcher.freeBoundaryText', 'HanbokMatcher.paidBoundaryText',
  'Meta.hanbokTitle', 'Meta.hanbokDescription',
  ...colorIds.map((id) => `HanbokMatcher.colors.${id}`),
  ...moodIds.map((id) => `HanbokMatcher.moods.${id}`),
  ...moodIds.flatMap((id) => [`HanbokMatcher.directions.${id}.name`, `HanbokMatcher.directions.${id}.reason`]),
  ...comfortIds.map((id) => `HanbokMatcher.comfort.${id}`),
  ...comfortIds.map((id) => `HanbokMatcher.comfortNotes.${id}`),
];

function getPath(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

const missing = required.filter((key) => {
  const value = getPath(messages, key);
  return typeof value !== 'string' || value.trim().length === 0;
});

if (missing.length) {
  console.error(`Hanbok message contract failed: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Hanbok message contract OK: ${required.length} required keys.`);
