import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const target=path.join(root,'src/features/hanbok/HanbokRentalFinder.tsx');
const source=fs.readFileSync(target,'utf8');
const required=[
  "kc-hanbok-rental-favorites-v1",
  'VALID_SHOP_IDS',
  'localStorage.getItem(FAVORITES_KEY)',
  'localStorage.removeItem(FAVORITES_KEY)',
  'localStorage.setItem(FAVORITES_KEY',
  'aria-pressed={saved}',
  'checked={showSaved}',
  "!showSaved||favorites.has(shop.id)",
  'Saved shops are stored only as source-checked shop IDs in this browser.'
];
const missing=required.filter(token=>!source.includes(token));
if(missing.length){
  console.error(`Hanbok rental recovery contract failed. Missing: ${missing.join(', ')}`);
  process.exit(1);
}
if(!source.includes("typeof id==='string'&&VALID_SHOP_IDS.has(id)")){
  console.error('Hanbok rental recovery contract failed: persisted shop IDs are not allowlisted against the curated catalog.');
  process.exit(1);
}
console.log('Hanbok rental save/recovery contract passed.');
