import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const core=read('src/lib/travel/gyeongbokgung-food-core.ts');
const data=read('src/lib/travel/gyeongbokgung-food.ts');

assert.match(core,/stationDistanceMeters\?:number/);
assert.match(core,/stationExit\?:string/);
assert.match(core,/Number\.POSITIVE_INFINITY/);
assert.match(core,/return left-right\|\|a\.index-b\.index/);
for(const [id,meters,exit] of [
 ['tosokchon',203,'Exit 2'],['tailor-coffee-seochon',261,'Exit 3'],['seochon-dagwabang',308,'Exit 1'],
 ['aino-garden-kitchen',468,'Exit 7'],['cafe-haven',562,'Exit 2'],['cafe-sinola',1100,'Exit 3'],
]){
 assert.match(data,new RegExp(`id:'${id}'[^\\n]+stationDistanceMeters:${meters}[^\\n]+stationExit:'[^']*${exit}'`));
}
assert.match(data,/id:'iftar'[^\n]+scheduleConfidence:'recheck'\}/);
assert.match(data,/Tailor Coffee Seochon Gyeongbokgung Branch[^\n]+address:'1F, 15 Hyoja-ro, Jongno-gu, Seoul'/);
assert.match(data,/checkedAt:'2026-09-13'/);
console.log('Food proximity contract passed.');
