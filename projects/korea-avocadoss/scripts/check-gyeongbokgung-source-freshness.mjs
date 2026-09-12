import fs from 'node:fs';

const source=fs.readFileSync(new URL('../src/lib/travel/gyeongbokgung-visit-facts.ts',import.meta.url),'utf8');

const capture=(name)=>{
  const match=new RegExp(`export const ${name}='([^']+)'`).exec(source);
  if(!match) throw new Error(`Missing ${name}`);
  return match[1];
};
const captureNumber=(name)=>{
  const match=new RegExp(`export const ${name}=(\\d+)`).exec(source);
  if(!match) throw new Error(`Missing ${name}`);
  return Number(match[1]);
};
const parseDate=(value)=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error(`Invalid checked-at date: ${value}`);
  const [y,m,d]=value.split('-').map(Number);
  const date=new Date(Date.UTC(y,m-1,d));
  if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d) throw new Error(`Invalid checked-at date: ${value}`);
  return date;
};

for(const name of ['GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE','GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE']){
  const url=new URL(capture(name));
  if(url.protocol!=='https:'||url.hostname!=='royal.khs.go.kr') throw new Error(`${name} must use official royal.khs.go.kr HTTPS`);
}

const maxAgeDays=captureNumber('GYEONGBOKGUNG_VISIT_FACTS_MAX_AGE_DAYS');
if(maxAgeDays<1||maxAgeDays>30) throw new Error(`Freshness window must be 1-30 days; got ${maxAgeDays}`);

const checked=parseDate(capture('GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT'));
const now=new Date();
const today=Date.UTC(now.getUTCFullYear(),now.getUTCMonth(),now.getUTCDate());
const ageDays=Math.floor((today-checked.getTime())/86_400_000);
if(ageDays<0) throw new Error('Gyeongbokgung source check date is in the future');
if(ageDays>maxAgeDays) throw new Error(`Gyeongbokgung source facts are stale: ${ageDays}d > ${maxAgeDays}d`);
if(!source.includes('export function isGyeongbokgungVisitFactsFresh')) throw new Error('Runtime freshness helper is missing');

console.log(`Gyeongbokgung source freshness OK (${ageDays}d/${maxAgeDays}d)`);
