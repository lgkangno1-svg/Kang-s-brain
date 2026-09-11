import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const facts=readFileSync(path.join(root,'src/lib/travel/gyeongbokgung-visit-facts.ts'),'utf8');
const helper=readFileSync(path.join(root,'src/features/explore/GyeongbokgungVisitHelper.tsx'),'utf8');
const page=readFileSync(path.join(root,'src/app/[locale]/explore/gyeongbokgung/page.tsx'),'utf8');

for(const token of ["en:['11:00','13:30','15:30']","ja:['10:00','14:30']","'zh-CN':['10:30','15:00']"]){assert.ok(facts.includes(token),`Missing guided-tour schedule: ${token}`);}
for(const token of ["close:'17:00',lastAdmission:'16:00'","close:'18:00',lastAdmission:'17:00'","close:'18:30',lastAdmission:'17:30'"]){assert.ok(facts.includes(token),`Missing seasonal admission cutoff: ${token}`);}
assert.match(facts,/regularTuesdayClosure=weekday===2/,'Tuesday closure must derive from the selected date');
assert.match(facts,/verificationRequired\?\[\]:GYEONGBOKGUNG_GUIDED_TOURS\[language\]/,'Unverified Tuesday tours must fail closed');
assert.match(facts,/GYEONGBOKGUNG_VISIT_FACTS_MAX_AGE_DAYS=30/,'Official palace facts need an explicit freshness ceiling');
assert.match(facts,/ageDays>=0&&ageDays<=GYEONGBOKGUNG_VISIT_FACTS_MAX_AGE_DAYS/,'Future or stale source checks must fail closed');
const checkedMatch=facts.match(/GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT='(\d{4}-\d{2}-\d{2})'/);
assert.ok(checkedMatch,'Missing official palace source checkedAt');
const checkedMs=Date.parse(`${checkedMatch[1]}T00:00:00Z`);
const today=new Date();
const todayUtc=Date.UTC(today.getUTCFullYear(),today.getUTCMonth(),today.getUTCDate());
const ageDays=Math.floor((todayUtc-checkedMs)/86_400_000);
assert.ok(ageDays>=0,`Palace source checkedAt cannot be in the future: ${checkedMatch[1]}`);
assert.ok(ageDays<=30,`Palace hours/tour provenance is ${ageDays} days old. Re-check the official pages before shipping.`);
assert.ok(helper.includes('GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE'),'Hours source link must remain available');
assert.ok(helper.includes('GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE'),'Guide source link must remain available');
assert.ok(helper.includes('60–90'),'Official guide-duration disclosure must remain visible');
for(const marker of ['停止入场','入場締切','停止入場','Giờ vào cửa cuối','เวลาปิดรับเข้า'])assert.ok(helper.includes(marker),`Missing P0 last-admission copy: ${marker}`);
assert.ok(!helper.includes('fetch('),'Helper must remain zero-network at runtime');
assert.ok(!helper.includes('navigator.geolocation'),'Helper must not request precise location');
assert.ok(page.includes('<GyeongbokgungVisitHelper locale={locale}/>'),'Page must mount the visit helper');
console.log('Gyeongbokgung visit helper contract OK.');
