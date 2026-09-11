import fs from 'node:fs';

const sitemap=fs.readFileSync(new URL('../src/app/sitemap.ts',import.meta.url),'utf8');
const samples=fs.readFileSync(new URL('../src/lib/looks/samples.ts',import.meta.url),'utf8');
const samplePage=fs.readFileSync(new URL('../src/app/[locale]/style/sample/[slug]/page.tsx',import.meta.url),'utf8');

const slugs=[...samples.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map(([,slug])=>slug);
const uniqueSlugs=[...new Set(slugs)];
if(uniqueSlugs.length!==3){
 throw new Error(`Expected exactly 3 curated public sample slugs from active BUILD_SPEC; found ${uniqueSlugs.length}: ${uniqueSlugs.join(', ')}`);
}
for(const expected of ['palace-elegance','modern-pastel','royal-ceremony']){
 if(!uniqueSlugs.includes(expected)) throw new Error(`Missing required curated sample slug: ${expected}`);
}
if(!sitemap.includes("import {getAllSampleSlugs} from '@/lib/looks/samples';")){
 throw new Error('Sitemap must derive curated sample routes from getAllSampleSlugs().');
}
if(!sitemap.includes('getAllSampleSlugs().flatMap')){
 throw new Error('Sitemap must expand every curated sample across P0 locales.');
}
if(!sitemap.includes('`/style/sample/${slug}`')){
 throw new Error('Sitemap must emit /style/sample/{slug} paths.');
}
if(!sitemap.includes('localizedLanguageAlternates(path)')){
 throw new Error('Curated sample sitemap entries must expose hreflang alternates.');
}
if(!samplePage.includes("localizedAlternates(locale, `/style/sample/${slug}`)")){
 throw new Error('Curated sample pages must expose localized canonical/hreflang metadata.');
}
if(/robots\s*:\s*\{[^}]*index\s*:\s*false/s.test(samplePage)){
 throw new Error('Curated public sample pages must remain indexable.');
}
for(const privateFragment of ['/checkout','/my-results','/api/']){
 if(sitemap.includes(`'${privateFragment}`)||sitemap.includes(`\`${privateFragment}`)){
  throw new Error(`Private/non-public path leaked into sitemap source: ${privateFragment}`);
 }
}

console.log(`Style sample sitemap contract OK: ${uniqueSlugs.length} samples x P0 locales, canonical/hreflang enabled.`);
