import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const core=read('src/lib/travel/gyeongbokgung-food-core.ts');
const data=read('src/lib/travel/gyeongbokgung-food.ts');

assert.match(core,/stationDistanceMeters\?:number/,'Food records must support source-backed station distance metadata.');
assert.match(core,/stationExit\?:string/,'Food records must retain the station exit associated with the published distance.');
assert.match(core,/Number\.POSITIVE_INFINITY/,'Places without verified proximity must sort after places with source-backed distance instead of receiving a guessed distance.');
assert.match(core,/return left-right\|\|a\.index-b\.index/,'Proximity ordering must be deterministic and stable for ties.');

for(const [id,meters,exit] of [
 ['tosokchon',203,'Exit 2'],
 ['tailor-coffee-seochon',261,'Exit 3'],
 ['seochon-dagwabang',308,'Exit 1'],
 ['aino-garden-kitchen',468,'Exit 7'],
 ['cafe-haven',562,'Exit 2'],
 ['cafe-sinola',1100,'Exit 3'],
]){
 const record=new RegExp(`id:'${id}'[^\\n]+stationDistanceMeters:${meters}[^\\n]+stationExit:'[^']*${exit}'`);
 assert.match(data,record,`Missing verified proximity metadata for ${id}.`);
}

assert.match(data,/id:'iftar'[^\n]+scheduleConfidence:'recheck'\}/,'iftar must remain without a fabricated distance when the checked source does not publish one.');
assert.match(data,/Tailor Coffee Seochon Gyeongbokgung Branch[^\n]+address:'1F, 15 Hyoja-ro, Jongno-gu, Seoul'/,'Tailor Coffee must use the current official address rather than a vague area description.');
assert.match(data,/checkedAt:'2026-09-13'/,'Refreshed food source facts must carry the current verification date.');

console.log('Food proximity contract passed: verified station distances sort deterministically, unknown distance fails closed, and refreshed source facts retain provenance.');
