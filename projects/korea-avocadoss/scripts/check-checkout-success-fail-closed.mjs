import { readFile } from 'node:fs/promises';

const path = new URL('../src/app/[locale]/checkout/success/page.tsx', import.meta.url);
const source = await readFile(path, 'utf8');

const required = [
  "export const dynamic = 'force-dynamic'",
  'export const revalidate = 0',
  "'Payment confirmation unavailable'",
  "'This page does not confirm a purchase'",
  "href=\"/style\"",
  "'zh-CN'",
  "'zh-TW'",
  'vi:',
  'th:',
  'ja:',
];

for (const token of required) {
  if (!source.includes(token)) {
    throw new Error(`Checkout success fail-closed contract missing: ${token}`);
  }
}

const forbidden = [
  'useSearchParams',
  'session_id',
  "startsWith('cs_')",
  'PRODUCT_CATALOG',
  'isApprovedProductKey',
  "useTranslations('CheckoutSuccess')",
];

for (const token of forbidden) {
  if (source.includes(token)) {
    throw new Error(`Checkout success route must not trust client return data: ${token}`);
  }
}

const localeKeys = ['en:', "'zh-CN':", 'ja:', "'zh-TW':", 'vi:', 'th:'];
for (const localeKey of localeKeys) {
  if (!source.includes(localeKey)) {
    throw new Error(`Missing fail-closed P0 locale copy: ${localeKey}`);
  }
}

console.log('checkout-success fail-closed contract: ok');
