import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const localization=fs.readFileSync(path.join(root,'src/features/hanbok/catalog-localization.ts'),'utf8');
const component=fs.readFileSync(path.join(root,'src/features/hanbok/HanbokCatalogResults.tsx'),'utf8');
const catalog=fs.readFileSync(path.join(root,'src/lib/looks/catalog.ts'),'utf8');

const locales=['en','zh-CN','ja','zh-TW','vi','th'];
const lookIds=[...catalog.matchAll(/id:\s*'(look-[^']+)'/g)].map(match=>match[1]);
const uniqueLookIds=[...new Set(lookIds)];

if(uniqueLookIds.length!==6)throw new Error(`Expected the currently source-checked catalog to contain 6 looks, found ${uniqueLookIds.length}. Expand this guard when the PRD 12-look catalog is completed.`);
for(const locale of locales){
 if(!localization.includes(locale==='en'?' en:{':` ${locale.includes('-')?`'${locale}'`:locale}:{`))throw new Error(`Missing Hanbok catalog locale block: ${locale}`);
 for(const id of uniqueLookIds){
  const occurrences=localization.split(`'${id}'`).length-1;
  if(occurrences<locales.length)throw new Error(`Look ${id} is not represented across all P0 locale blocks.`);
 }
}
for(const forbidden of ['<h5>{look.title}</h5>','alt={look.alt}','{look.walkingSuitability}','{look.seasons.join', '{look.recommendedLocation.name}']){
 if(component.includes(forbidden))throw new Error(`Raw English catalog presentation leaked into Hanbok results: ${forbidden}`);
}
for(const required of ['getHanbokCatalogPresentation(l,look)','p.description','p.walking','p.seasons.join','p.location']){
 if(!component.includes(required))throw new Error(`Localized Hanbok catalog presentation contract missing: ${required}`);
}
if(!component.includes("locale==='en'"))throw new Error('Palette localization must preserve descriptive English only for the English locale.');
console.log(`Hanbok catalog localization contracts OK: ${locales.length} locales × ${uniqueLookIds.length} source-checked looks.`);
