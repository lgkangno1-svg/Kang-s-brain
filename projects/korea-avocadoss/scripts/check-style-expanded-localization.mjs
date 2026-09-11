import fs from 'node:fs';

const copy=fs.readFileSync(new URL('../src/lib/looks/expanded-result-copy.ts',import.meta.url),'utf8');
const ranker=fs.readFileSync(new URL('../src/lib/looks/style-input-v1.ts',import.meta.url),'utf8');

const locales=['zh-CN','ja','zh-TW','vi','th'];
const lookIds=[
 'look-modern-gold-chima-07',
 'look-layered-ivory-baji-08',
 'look-teal-gold-chima-09',
 'look-indigo-modern-baji-10',
 'look-jeonmo-gold-chima-11',
 'look-scarlet-brocade-baji-12',
];

for(const locale of locales){
 const quoted=` '${locale}':{`;
 const bare=` ${locale}:{`;
 if(!copy.includes(quoted)&&!copy.includes(bare))throw new Error(`missing authored locale block: ${locale}`);
}
for(const id of lookIds){
 const count=copy.split(`'${id}'`).length-1;
 if(count!==locales.length)throw new Error(`${id} must have authored copy in all five non-English P0 locales; found ${count}`);
}
for(const field of ['title:','tagline:','description:','visualAlt:']){
 const count=copy.split(field).length-1;
 if(count<lookIds.length*locales.length)throw new Error(`expanded look authored field coverage is incomplete: ${field}`);
}
if(!ranker.includes("import {getExpandedLookResultCopy} from './expanded-result-copy';"))throw new Error('style ranker does not consume authored expanded copy');
if(!ranker.includes('title:authored?.title??'))throw new Error('authored title does not override generic generated title');
if(!ranker.includes('tagline:authored?.tagline??look.tagline'))throw new Error('authored tagline is not preserved in localized result data');
if(!ranker.includes('description:authored?.description??look.description'))throw new Error('authored description is not preserved in localized result data');
if(!ranker.includes('if(authored)return authored.visualAlt;'))throw new Error('authored visual alt does not override generic image alt');

console.log('Expanded My Korea Look P0 authored-localization contract passed.');
