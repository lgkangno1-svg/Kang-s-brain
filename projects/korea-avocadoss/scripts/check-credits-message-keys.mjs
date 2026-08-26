import {readFile} from 'node:fs/promises';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const creditsMessages = JSON.parse(await readFile(resolve(root, 'messages', 'credits', 'en.json'), 'utf8'));
const economicsSource = await readFile(resolve(root, 'src', 'lib', 'credits', 'economics.ts'), 'utf8');

function hasString(rootValue, path) {
  let value = rootValue;
  for (const segment of path.split('.')) value = value?.[segment];
  return typeof value === 'string' && value.trim().length > 0;
}

function blockBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start < 0 || end < 0) throw new Error(`Unable to locate economics block: ${startMarker}`);
  return source.slice(start, end);
}

const planBlock = blockBetween(economicsSource, 'export const CREDIT_PLANS', 'export const TOP_UP_PACKS');
const featureBlock = blockBetween(economicsSource, 'export const FEATURE_CREDIT_PRICES', 'export const ECONOMICS_ASSUMPTIONS');
const planIds = [...planBlock.matchAll(/\bid:\s*"([^"]+)"/g)].map((match) => match[1]);
const paidFeatures = [...featureBlock.matchAll(/feature:\s*"([^"]+)"\s*,\s*label:\s*"[^"]+"\s*,\s*credits:\s*(\d+)/g)]
  .filter(([, , credits]) => Number(credits) > 0)
  .map(([, feature]) => feature);

const required = [
  'Meta.creditsTitle',
  'Meta.creditsDescription',
  'Credits.catalogStatus',
  'Credits.catalogNotice',
  'Credits.creditsUnit',
  'Credits.perCredit',
  'Credits.beforeConfirmation',
  ...planIds.flatMap((id) => [
    `Credits.plans.${id}.name`,
    `Credits.plans.${id}.badge`,
    `Credits.plans.${id}.description`,
  ]),
  ...paidFeatures.map((feature) => `Credits.features.${feature.replaceAll('.', '_')}`),
];

const missing = required.filter((key) => !hasString(creditsMessages, key));
if (missing.length) {
  console.error(`Credits message contract failed. Missing keys: ${missing.join(', ')}`);
  process.exit(1);
}

if (planIds.length !== 3) {
  console.error(`Credits catalog contract expected 3 launch Trip Passes, found ${planIds.length}. Review CREDIT_ECONOMICS.md before changing this gate.`);
  process.exit(1);
}

console.log(`Credits message contract OK: ${planIds.length} plans and ${paidFeatures.length} paid feature labels sourced from economics.ts.`);
