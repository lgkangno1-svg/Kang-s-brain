import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const core=read('src/lib/travel/gyeongbokgung-food-core.ts');
const finder=read('src/features/explore/FoodFinder.tsx');

assert.match(core,/export type SourceFreshness='fresh'\|'stale'\|'invalid'/,'Food provenance needs an explicit freshness state.');
assert.match(core,/export function foodSourceFreshness\(checkedAt:string,now:Date=new Date\(\)\)/,'Food source freshness must be deterministic with an injectable clock.');
assert.match(core,/ageDays>30\?'stale':'fresh'/,'Food source checks older than 30 days must be classified stale.');
assert.match(core,/if\(ageDays<0\)return 'invalid'/,'Future source-check dates must fail closed instead of appearing fresh.');
assert.match(finder,/foodSourceFreshness\(place\.checkedAt\)/,'Food Finder must evaluate provenance age for every source-backed place.');
assert.match(finder,/freshness==='fresh'\?scheduleStatus:'verify'/,'Stale or invalid provenance must never be presented as definitely open or closed.');
assert.match(finder,/freshness==='stale'\?c\.staleSource:c\.invalidSource/,'Visitors must receive an explicit stale/invalid-source recovery message.');
assert.match(finder,/role="status"/,'Freshness warnings must be exposed to assistive technology.');
for(const phrase of ['over 30 days','超过30天','30日を超え','超過30天','hơn 30 ngày','กว่า 30 วัน'])assert.match(finder,new RegExp(phrase),`Missing P0 freshness warning phrase: ${phrase}`);

console.log('Food source freshness contract passed: >30-day or invalid provenance fails closed to verify-only with six-locale recovery copy.');
