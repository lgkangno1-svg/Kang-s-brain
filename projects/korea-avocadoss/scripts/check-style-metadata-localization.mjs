import fs from 'node:fs';

const source=fs.readFileSync(new URL('../src/app/[locale]/style/page.tsx',import.meta.url),'utf8');
const requiredLocales=['en','zh-CN','ja','zh-TW','vi','th'];

for(const locale of requiredLocales){
  const key=locale==='en'?/^\s*en:\{/m:new RegExp(`['\"]${locale}['\"]:\\{`);
  if(!key.test(source))throw new Error(`Missing localized /style metadata entry for ${locale}`);
}

if(!source.includes("localizedAlternates(safeLocale,'/style')"))throw new Error('/style metadata must keep locale-aware canonical/hreflang alternates');
if(!source.includes("safeLocale=(locale in STYLE_META?locale:'en')"))throw new Error('/style metadata must fail safely to English for an unexpected locale');

const nonEnglishSignals=['个性化韩服','あなた向け韓服','個人化韓服','phong cách cung điện','สไตล์พระราชวัง'];
for(const signal of nonEnglishSignals){
  if(!source.includes(signal))throw new Error(`Missing native-language /style metadata signal: ${signal}`);
}

console.log('style metadata localization contracts passed');
