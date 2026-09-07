import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const loading = fs.readFileSync(path.join(root, 'src/app/[locale]/loading.tsx'), 'utf8');
const error = fs.readFileSync(path.join(root, 'src/app/[locale]/error.tsx'), 'utf8');
const notFound = fs.readFileSync(path.join(root, 'src/app/[locale]/not-found.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/app/stitch-state-overrides.css'), 'utf8');

const locales = ['en', 'zh-CN', 'ja', 'zh-TW', 'vi', 'th'];
const hasLocaleKey = (source, locale) => source.includes(`${locale}:`) || source.includes(`'${locale}':`) || source.includes(`"${locale}":`);

const checks = [
  ['loading uses locale context', loading.includes('useLocale()')],
  ['loading exposes busy state', loading.includes('aria-busy="true"')],
  ['loading announces status', loading.includes('role="status"') && loading.includes('aria-live="polite"')],
  ['error exposes assertive alert', error.includes('role="alert"') && error.includes('aria-live="assertive"')],
  ['error provides retry recovery', error.includes('onClick={reset}')],
  ['error provides locale-preserving home recovery', error.includes('href={`/${locale}`}')],
  ['not-found derives locale without next-intl provider dependency', notFound.includes('usePathname()') && !notFound.includes("from 'next-intl'")],
  ['not-found defaults unknown paths safely to English', notFound.includes("return firstSegment && P0_LOCALES.has(firstSegment) ? firstSegment : 'en';")],
  ['not-found exposes a labelled primary heading', notFound.includes('aria-labelledby="not-found-title"') && notFound.includes('id="not-found-title"')],
  ['not-found provides locale-preserving home recovery', notFound.includes('href={`/${locale}`}')],
  ['not-found provides a useful travel continuation', notFound.includes('href={`/${locale}/explore/gyeongbokgung`}')],
  ['controls meet minimum touch target', styles.includes('min-height: 44px')],
  ['reduced motion disables spinner animation', styles.includes('@media (prefers-reduced-motion: reduce)')],
  ...locales.flatMap((locale) => [
    [`loading copy includes ${locale}`, hasLocaleKey(loading, locale)],
    [`error copy includes ${locale}`, hasLocaleKey(error, locale)],
    [`not-found copy includes ${locale}`, hasLocaleKey(notFound, locale)],
  ]),
];

const failures = checks.filter(([, pass]) => !pass);
for (const [label, pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`);
if (failures.length) {
  console.error(`\n${failures.length} route recovery contract check(s) failed.`);
  process.exit(1);
}
console.log('\nRoute loading, error, and not-found recovery contracts passed.');
