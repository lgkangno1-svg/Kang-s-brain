import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const engine=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v5.tsx'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');

for(const marker of [
  "styleInputNeedsPaletteChoice",
  "input.palette==='suggest'&&input.colorSource==='manual'",
  "if(styleInputNeedsPaletteChoice(input))return []",
]){
  if(!engine.includes(marker))throw new Error(`style suggest fail-closed guard missing ${marker}`);
}
for(const marker of ["initialHandoff?.colorSource??'manual'","['manual','local-preview'].includes(String(x.colorSource))","setColorSource('manual')"]){
  if(!ui.includes(marker))throw new Error(`free style flow no longer proves allowlisted local/manual color source: ${marker}`);
}
if(!ui.includes("palettes:StylePalette[]=['jadeIvory','roseNavy','moonBlue','suggest']"))throw new Error('style palette choices changed unexpectedly');
for(const marker of [
  'SUGGEST_RECOVERY',
  'style-suggest-recovery-title',
  'browser-local Personal Color preview',
  'href="/color"',
]){
  if(!page.includes(marker))throw new Error(`style suggest recovery UX missing ${marker}`);
}
for(const locale of ["'zh-CN'","ja:","'zh-TW'","vi:","th:"]){
  if(!page.includes(locale))throw new Error(`style suggest recovery localization missing ${locale}`);
}
if(engine.includes('fetch(')||engine.includes('/api/')||ui.includes('/api/checkout'))throw new Error('palette suggestion guard must remain deterministic, zero-network and checkout-free');
console.log('My Korea Look ungrounded palette suggestion stays fail-closed while allowlisted browser-local color provenance can continue across the free flow');
