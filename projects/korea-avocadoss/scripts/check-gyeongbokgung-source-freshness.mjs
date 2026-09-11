import fs from 'node:fs';

const source=fs.readFileSync(new URL('../src/lib/travel/gyeongbokgung-visit-facts.ts',import.meta.url),'utf8');

function capture(name){
 const match=new RegExp(`export const ${name}='([^']+)'`).exec(source);
 if(!match) throw new Error(`Missing ${name} in gyeongbokgung-visit-facts.ts`);
 return match[1];
}
function captureNumber(name){
 const match=new RegExp(`export const ${name}=(\\d+)`).exec(source);
 if(!match) throw new Error(`Missing numeric ${name} in gyeongbokgung-visit-facts.ts`);
 return Number(match[1]);
}
function parseIsoDate(value,label){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`${label} must be YYYY-MM-DD; received ${value}`);
 const [year,month,day]=value.split('-').map(Number);
 const date=new Date(Date.UTC(year,month-1,day));
 if(date.getUTCFullYear()!==year||date.getUTCMonth()!==month-1||date.getUTCDate()!==day) throw new Error(`${label} is not a valid calendar date: ${value}`);
 return date;
}

const checkedAt=capture('GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT');
const visitSource=capture('GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE');
const guideSource=capture('GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE');
const maxAgeDays=captureNumber('GYEONGBOKGUNG_VISIT_FACTS_MAX_AGE_DAYS');

for(const [label,url] of [['visit source',visitSource],['guide source',guideSource]]){
 let parsed;
 try{parsed=new URL(url);}catch{throw new Error(`${label} must be an absolute URL: ${url}`);}
 if(parsed.protocol!=='https:'||parsed.hostname!=='royal.khs.go.kr') throw new Error(`${label} must remain on the official royal.khs.go.kr HTTPS origin: ${url}`);
}
if(maxAgeDays<1||maxAgeDays>30) throw new Error(`Gyeongbokgung freshness window must be between 1 and 30 days; received ${maxAgeDays}`);

const checked=parseIsoDate(checkedAt,'GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT');
const now=new Date();
const today=new Date(Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate()));
const ageDays=Math.floor((today-checked)/86_400_000);
if(ageDays<0) throw new Error(`Gyeongbokgung source check date is in the future (${checkedAt}); verify provenance before release.`);
if(ageDays>maxAgeDays) throw new Error(`Gyeongbokgung official hours/tour facts are stale: checked ${checkedAt}, age ${ageDays} days, maximum ${maxAgeDays}. Re-check both official KHS pages and update the source-checked facts before release.`);

if(!source.includes('export function isGyeongbokgungVisitFactsFresh')) throw new Error('Runtime freshness helper must remain present for fail-closed visitor behavior.');
console.log(`Gyeongbokgung source freshness OK: checked ${checkedAt}, age ${ageDays}d/${maxAgeDays}d, official KHS origins verified.`);
