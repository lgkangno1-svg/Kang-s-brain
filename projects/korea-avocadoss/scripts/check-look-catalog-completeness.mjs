import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.join(here,'..');
const read=(relative)=>readFileSync(path.join(root,relative),'utf8');
const base=read('src/lib/looks/catalog.ts');
const expansion=read('src/lib/looks/catalog-expansion.ts');
const styleRanker=read('src/lib/looks/style-input-v1.ts');
const legacyRanker=read('src/lib/looks/recommend.ts');

const baseIds=[...base.matchAll(/\bid:\s*'((?:look-)[^']+)'/g)].map(m=>m[1]);
const additionalIds=[...expansion.matchAll(/\bid:\s*'((?:look-)[^']+)'/g)].map(m=>m[1]);
const allIds=[...baseIds,...additionalIds];

assert.equal(baseIds.length,6,'The original audited catalog subset must remain six looks');
assert.equal(additionalIds.length,6,'The source-checked expansion must contribute exactly six looks');
assert.equal(new Set(allIds).size,12,'BUILD_SPEC requires at least 12 distinct completed look IDs');

const rows=[...expansion.matchAll(/id:\s*'(look-[^']+)'[\s\S]*?styleId:\s*'(princess-prince|queen-king|royal)'[\s\S]*?garmentType:\s*'(chima|baji)'/g)]
 .map(([,id,style,garment])=>({id,style,garment}));
assert.equal(rows.length,6,'Every expansion look must expose style and garment metadata');

for(const style of ['princess-prince','queen-king','royal']){
 const styleRows=rows.filter(row=>row.style===style);
 assert.equal(styleRows.length,2,`${style} must gain one chima and one baji look`);
 assert.deepEqual(new Set(styleRows.map(row=>row.garment)),new Set(['chima','baji']),`${style} expansion must cover both garment families`);
}

const sourceCount=(expansion.match(/sourceUrl:\s*'https:\/\/commons\.wikimedia\.org\/wiki\/File:/g)??[]).length;
const licenseCount=(expansion.match(/license:\s*'CC BY-SA 2\.0'/g)??[]).length;
const checkedCount=(expansion.match(/checkedAt:\s*'2026-09-11'/g)??[]).length;
assert.equal(sourceCount,6,'Each added look must point to its Wikimedia Commons source page');
assert.equal(licenseCount,6,'Each added look must carry the reviewed CC BY-SA 2.0 license');
assert.equal(checkedCount,6,'Each added look must record the source review date');
assert.doesNotMatch(expansion,/inventory available|guaranteed|real-time|book now/i,'Catalog metadata must not fabricate rental availability');

assert.match(styleRanker,/EXPANDED_CURATED_LOOKS_CATALOG\.map/,'Active My Korea Look ranker must consume the 12-look catalog');
assert.match(legacyRanker,/EXPANDED_CURATED_LOOKS_CATALOG\.map/,'Legacy deterministic ranker must consume the 12-look catalog');
assert.match(styleRanker,/localizeLookForResult\(catalogLook,input\.locale,index\)/,'P0 result localization must remain in the active rank path');

console.log('✓ 12-look completeness, style/garment coverage, provenance, and active rank-path contracts passed');
