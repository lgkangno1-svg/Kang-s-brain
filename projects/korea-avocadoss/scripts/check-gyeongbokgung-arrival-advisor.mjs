import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const advisor=readFileSync(path.join(root,'src/features/explore/GyeongbokgungArrivalAdvisor.tsx'),'utf8');
const page=readFileSync(path.join(root,'src/app/[locale]/explore/gyeongbokgung/page.tsx'),'utf8');

assert.ok(page.includes('<GyeongbokgungArrivalAdvisor locale={locale}/>'),'Gyeongbokgung page must mount the arrival advisor');
assert.ok(advisor.includes('gyeongbokgungVisitFacts(date)'),'Advisor must derive admission facts from the selected visit date');
assert.ok(advisor.includes('gyeongbokgungGuidedTourTimes(date,language)'),'Advisor must derive tour times from selected date and language');
assert.match(advisor,/arrivalMinute>lastMinute\?'late':'ok'/,'Arrival after the official cutoff must fail closed');
assert.match(advisor,/facts\.regularTuesdayClosure\?'closed'/,'Regular Tuesday closure must override normal admission state');
assert.ok(advisor.includes("tours.find(value=>minutes(value)>=Math.max(arrivalMinute,openMinute))"),'Next-tour selection must never suggest a tour before arrival/opening');
assert.ok(advisor.includes('GYEONGBOKGUNG_OFFICIAL_VISIT_SOURCE'),'Hours source link must remain visible');
assert.ok(advisor.includes('GYEONGBOKGUNG_OFFICIAL_GUIDE_SOURCE'),'Guided-tour source link must remain visible');
assert.ok(!advisor.includes('fetch('),'Arrival advisor must remain zero-network at runtime');
assert.ok(!advisor.includes('navigator.geolocation'),'Arrival advisor must not request precise location');
for(const marker of [
  'Can I still enter or catch a guide?',
  '还能入场或赶上讲解吗？',
  'まだ入場・ガイド参加できる？',
  '還能入場或趕上導覽嗎？',
  'Còn kịp vào cung hoặc tham gia tour?',
  'ยังเข้าพระราชวังหรือทันรอบไกด์ไหม?'
]) assert.ok(advisor.includes(marker),`Missing P0 arrival-advisor copy: ${marker}`);
for(const marker of ['Regular last admission','常规停止入场','通常入場締切','一般停止入場','Hạn vào cửa thường lệ','เวลาปิดรับเข้าปกติ']) assert.ok(advisor.includes(marker),`Missing P0 cutoff label: ${marker}`);
assert.ok(advisor.includes('navigator.clipboard?.writeText'),'Arrival summary must support an explicit copy handoff');
console.log('Gyeongbokgung arrival advisor contract OK.');
