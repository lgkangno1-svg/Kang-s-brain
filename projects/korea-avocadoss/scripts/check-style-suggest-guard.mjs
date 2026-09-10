import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const engine=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v5.tsx'),'utf8');

for(const marker of [
  "styleInputNeedsPaletteChoice",
  "input.palette==='suggest'&&input.colorSource==='manual'",
  "if(styleInputNeedsPaletteChoice(input))return []",
]){
  if(!engine.includes(marker))throw new Error(`style suggest fail-closed guard missing ${marker}`);
}
if(!ui.includes("colorSource:'manual'"))throw new Error('free style flow no longer proves manual/local-only color source');
if(!ui.includes("palettes:StylePalette[]=['jadeIvory','roseNavy','moonBlue','suggest']"))throw new Error('style palette choices changed unexpectedly');
if(engine.includes('fetch(')||engine.includes('/api/'))throw new Error('palette suggestion guard must remain deterministic and zero-network');
console.log('My Korea Look ungrounded palette suggestion fail-closed contract OK');
