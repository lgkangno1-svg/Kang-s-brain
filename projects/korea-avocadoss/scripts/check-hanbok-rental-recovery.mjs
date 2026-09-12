import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const target=path.join(root,'src/features/hanbok/HanbokRentalFinder.tsx');
const source=fs.readFileSync(target,'utf8');
const core=fs.readFileSync(path.join(root,'src/lib/travel/gyeongbokgung-hanbok-rentals.ts'),'utf8');
const required=[
  "kc-hanbok-rental-favorites-v1",
  'validShopIds',
  'localStorage.getItem(FAVORITES_KEY)',
  'localStorage.removeItem(FAVORITES_KEY)',
  'localStorage.setItem(FAVORITES_KEY',
  'aria-pressed={saved}',
  'checked={showSaved}',
  "!showSaved||favorites.has(shop.id)",
  'Saved shops are stored only as source-checked shop IDs in this browser.',
  'hanbokRentalMinutesUntilPublishedClose(shop,date,time)',
  'hanbokRentalToPalaceDirectionsHref(shop)',
  'not a promised rental duration or return deadline',
  'Walking directions to Gyeongbokgung'
];
const missing=required.filter(token=>!source.includes(token));
if(missing.length){
  console.error(`Hanbok rental recovery contract failed. Missing: ${missing.join(', ')}`);
  process.exit(1);
}
if(!source.includes("typeof id==='string'&&validShopIds.has(id)")){
  console.error('Hanbok rental recovery contract failed: persisted shop IDs are not allowlisted against the current server-resolved catalog.');
  process.exit(1);
}
if(!source.includes('if(!validShopIds.has(id))return')){
  console.error('Hanbok rental recovery contract failed: new favorites are not constrained to the current server-resolved catalog.');
  process.exit(1);
}
const coreRequired=[
  "export type HanbokRentalSourceFreshness='fresh'|'stale'|'invalid'",
  'export function hanbokRentalSourceFreshness',
  "return ageDays>30?'stale':'fresh'",
  "if(ageDays<0)return'invalid'",
  "if(hanbokRentalSourceFreshness(shop.checkedAt,visitDate)!=='fresh')return 'recheck'",
  'export function hanbokRentalMinutesUntilPublishedClose(shop:HanbokRentalShop,date:string,time:string)',
  "if(!visitDate||hanbokRentalSourceFreshness(shop.checkedAt,visitDate)!=='fresh')return null",
  'minute<shop.openMinute||minute>=shop.closeMinute)return null',
  'return shop.closeMinute-minute',
  'export function hanbokRentalToPalaceDirectionsHref',
  'https://www.google.com/maps/dir/?api=1',
  '&travelmode=walking',
  'keep the catalog under 10 shops',
  'very high current review',
  'large inventory/operation',
  'international booking presence',
  "id:'hanboknam-gyeongbokgung'",
  "id:'seohwa-hanbok'",
  "id:'daehan-hanbok'",
  "id:'oneday-hanbok'",
  "id:'yes-hanbok'",
  "id:'naye-hanbok'",
  "id:'hanbok-day'"
];
const missingCore=coreRequired.filter(token=>!core.includes(token));
if(missingCore.length){
  console.error(`Hanbok rental route-window/freshness/curation contract failed. Missing: ${missingCore.join(', ')}`);
  process.exit(1);
}
const ids=[...core.matchAll(/\bid:'([^']+)'/g)].map(match=>match[1]);
const uniqueIds=new Set(ids);
if(ids.length!==uniqueIds.size){
  console.error('Hanbok rental curation contract failed: duplicate shop IDs detected.');
  process.exit(1);
}
if(ids.length<5||ids.length>10){
  console.error(`Hanbok rental curation contract failed: expected a focused shortlist of 5–10 shops, found ${ids.length}.`);
  process.exit(1);
}
if(core.includes("id:'hanbok-that-day'")){
  console.error('Hanbok rental curation contract failed: proximity/official listing alone must not override the popularity/scale/international-recognition gate.');
  process.exit(1);
}
if(/fetch\(|XMLHttpRequest|navigator\.geolocation/.test(core)){
  console.error('Hanbok rental route-window contract failed: deterministic core must not require a runtime network/geolocation call.');
  process.exit(1);
}
console.log(`Hanbok rental contracts passed with ${ids.length} high-confidence shops, server-catalog allowlisting, visit-date freshness fail-closed behavior and route-window safeguards.`);
