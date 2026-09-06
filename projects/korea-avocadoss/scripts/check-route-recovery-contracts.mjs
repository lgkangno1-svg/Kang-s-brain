import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const loading = fs.readFileSync(path.join(root, 'src/app/[locale]/loading.tsx'), 'utf8');
const error = fs.readFileSync(path.join(root, 'src/app/[locale]/error.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/app/stitch-state-overrides.css'), 'utf8');

const locales = ['en', 'zh-CN', 'ja', 'zh-TW', 'vi', 'th'];
const checks = [
  ['loading uses locale context', loading.includes('useLocale()')],
  ['loading exposes busy state', loading.includes('aria-busy="true"')],
  ['loading announces status', loading.includes('role="status"') && loading.includes('aria-live="polite"')],
  ['error exposes assertive alert', error.includes('role="alert"') && error.includes('aria-live="assertive"')],
  ['error provides retry recovery', error.includes('onClick={reset}')],
  ['error provides locale-preserving home recovery', error.includes('href={`/${locale}`}')],
  ['controls meet minimum touch target', styles.includes('min-height: 44px')],
  ['reduced motion disables spinner animation', styles.includes('@media (prefers-reduced-motion: reduce)')],
  ...locales.flatMap((locale) => [
    [`loading copy includes ${locale}`, loading.includes(locale === 'en' ? 'en:' : `'${locale}':`)],
    [`error copy includes ${locale}`, error.includes(locale === 'en' ? 'en:' : `'${locale}':`)],
  ]),
];

const failures = checks.filter(([, pass]) => !pass);
for (const [label, pass] of checks) console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}`);
if (failures.length) {
  console.error(`\n${failures.length} route recovery contract check(s) failed.`);
  process.exit(1);
}
console.log('\nRoute loading and recovery contracts passed.');
