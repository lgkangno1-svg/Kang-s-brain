import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const facts=readFileSync(path.join(root,'src/lib/travel/gyeongbokgung-visit-facts.ts'),'utf8');
const helper=readFileSync(path.join(root,'src/features/explore/GyeongbokgungVisitHelper.tsx'),'utf8');
const page=readFileSync(path.join(root,'src/app/[locale]/explore/gyeongbokgung/page.tsx'),'utf8');

for(const token of ["en:['11:00','13:30','15:30']","ja:['10:00','14:30']","'zh-CN':['10:30','15:00']"])assert.ok(facts.includes(token),`Missing official foreign-language tour schedule: ${token}`);
for(const token of ["close:'17:00',lastAdmission:'16:00'","close:'18:00',lastAdmission:'17:00'","close:'18:30',lastAdmission:'17:30'"])assert.ok(facts.includes(token),`Missing seasonal last-admission contract: ${token}`);
assert.match(facts,/regularTuesdayClosure=weekday===2/,'Regular Tuesday closure must be derived from the selected ISO date');
assert.match(facts,/return facts\.verificationRequired\?\[\]:GYEONGBOKGUNG_GUIDED_TOURS\[language\]/,'Unverified Tuesday must fail closed instead of presenting a normal guided-tour slot');
assert.ok(helper.includes('GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE'),'Visitor must retain the official hours verification route');
assert.ok(helper.includes('GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE'),'Visitor must retain the official guided-tour verification route');
assert.ok(helper.includes('60–90'),'Guided-tour duration disclosure must remain visible');
assert.ok(helper.includes('uses no AI API')||helper.includes('AI API'),'Helper must disclose zero-AI behavior');
for(const marker of ['停止入场','入場締切','停止入場','Giờ vào cửa cuối','เวลาปิดรับเข้า'])assert.ok(helper.includes(marker),`Missing P0 last-admission copy: ${marker}`);
assert.ok(page.includes("import {GyeongbokgungVisitHelper}"),'Gyeongbokgung page must import the visit helper');
assert.ok(page.includes('<GyeongbokgungVisitHelper locale={locale}/>'),'Gyeongbokgung page must mount the visit helper');
assert.ok(!helper.includes('fetch('),'Visit helper must not add a runtime network dependency');
assert.ok(!helper.includes('navigator.geolocation'),'Visit helper must not request precise location');
console.log('Gyeongbokgung visit helper contract OK: seasonal admission cutoffs, foreign-language tours, Tuesday recovery, P0 copy and zero-AI behavior are guarded.');
