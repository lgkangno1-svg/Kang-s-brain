import {readdir, readFile} from 'node:fs/promises';
import path from 'node:path';

const appDir = path.resolve('.next/server/app');
const expected = new Map([
  ['en', 'en'],
  ['zh-CN', 'zh-Hans'],
  ['ja', 'ja'],
  ['zh-TW', 'zh-Hant'],
  ['vi', 'vi'],
  ['th', 'th'],
]);

async function walk(dir) {
  const entries = await readdir(dir, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute);
  }

  return files;
}

function htmlLang(html) {
  const match = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i);
  return match?.[1] ?? null;
}

const htmlFiles = await walk(appDir);
const relativeFiles = htmlFiles.map((file) => path.relative(appDir, file).split(path.sep).join('/'));
const failures = [];

for (const [locale, expectedLang] of expected) {
  const candidates = relativeFiles.filter((file) =>
    file === `${locale}.html` || file === `${locale}/index.html` || file.startsWith(`${locale}/`)
  );

  if (candidates.length === 0) {
    failures.push(`${locale}: no generated HTML found under .next/server/app`);
    continue;
  }

  for (const relative of candidates) {
    const absolute = path.join(appDir, ...relative.split('/'));
    const actual = htmlLang(await readFile(absolute, 'utf8'));
    if (actual !== expectedLang) {
      failures.push(`${relative}: expected lang=${expectedLang}, found ${actual ?? 'missing'}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Document-language verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(`Generated HTML files: ${relativeFiles.join(', ') || '(none)'}`);
  process.exit(1);
}

console.log(`Document-language verification passed for ${expected.size} P0 locales.`);
