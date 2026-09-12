import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = path.join(root, 'src/app/[locale]/style/page.tsx');
const page = fs.readFileSync(pagePath, 'utf8');

const fail = (message) => {
  console.error(`Style revenue funnel check failed: ${message}`);
  process.exit(1);
};

for (const slug of ['palace-elegance', 'modern-pastel', 'royal-ceremony']) {
  if (!page.includes(slug)) fail(`missing public full-value sample link: ${slug}`);
}

for (const required of [
  'Planned launch price: $12 USD · one-time',
  'Paid checkout is still closed until account ownership',
  'SEE THE FULL VALUE FIRST',
]) {
  if (!page.includes(required)) fail(`missing truthful prelaunch conversion copy: ${required}`);
}

for (const forbidden of [
  'Buy now',
  'Start checkout',
  'Guaranteed results',
  'Limited-time price',
]) {
  if (page.includes(forbidden)) fail(`style funnel contains unavailable or pressure-selling copy: ${forbidden}`);
}

console.log('Style revenue funnel: OK');
