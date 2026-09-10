import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const component=await readFile(new URL('../src/features/culture/SajuDeepExperience.tsx',import.meta.url),'utf8');
const reading=await readFile(new URL('../src/lib/saju/reading.ts',import.meta.url),'utf8');
const tenGods=await readFile(new URL('../src/lib/saju/ten-gods.ts',import.meta.url),'utf8');
const page=await readFile(new URL('../src/app/[locale]/culture/saju/page.tsx',import.meta.url),'utf8');

assert.match(page,/SajuDeepExperience/,'The live Saju route must use the deep deterministic reading experience.');
assert.match(component,/nameHelp/,'Optional name input must explicitly disclose that it does not alter Four Pillars math.');
assert.match(component,/mode==='unknown'/,'Unknown birth time must remain a first-class path.');
assert.match(component,/calculateSajuExperience/,'The reading must be grounded in the deterministic chart engine.');
assert.match(component,/buildSajuFunctionalReading/,'The chart must preserve the deterministic Day Master/Five Elements layer.');
assert.match(component,/visibleStemRoles/,'The result must expose visible-stem Ten Gods rather than generic prose only.');
assert.match(component,/buildFiveYearOutlooks/,'The visitor must receive a deterministic five-year outlook.');
assert.match(tenGods,/export function tenGodForStem/,'Ten Gods classification must be implemented as an auditable deterministic rule.');
assert.match(tenGods,/Array\.from\(\{length: 5\}/,'Future reading must cover five consecutive years.');
assert.match(tenGods,/samePolarity \? 'peer' : 'robWealth'/,'Same-element polarity must distinguish Peer and Rob Wealth.');
assert.match(tenGods,/samePolarity \? 'eatingGod' : 'hurtingOfficer'/,'Output polarity must distinguish Eating God and Hurting Officer.');
assert.match(tenGods,/samePolarity \? 'indirectWealth' : 'directWealth'/,'Wealth polarity must distinguish indirect and direct wealth.');
assert.match(tenGods,/samePolarity \? 'sevenKillings' : 'directOfficer'/,'Officer polarity must distinguish Seven Killings and Direct Officer.');
assert.match(tenGods,/samePolarity \? 'indirectResource' : 'directResource'/,'Resource polarity must distinguish indirect and direct resource.');
assert.match(reading,/relationBetween/,'Annual outlooks must remain tied to explicit Five Elements relations.');
assert.match(component,/navigator\.clipboard/,'Visitors must be able to copy a completed reading.');
assert.match(component,/new Blob/,'Visitors must have a local text-download recovery path.');
assert.match(component,/URL\.revokeObjectURL/,'Local export must release its temporary object URL.');
assert.doesNotMatch(component,/fetch\s*\(/,'Free Saju reading must remain zero-API.');
assert.doesNotMatch(tenGods,/fetch\s*\(/,'Ten Gods and future rules must remain zero-API.');
for(const phrase of ['Birthplace timezone','出生地时区','出生地タイムゾーン','出生地時區','Múi giờ nơi sinh','เขตเวลาสถานที่เกิด']) assert.ok(component.includes(phrase),`Missing P0 birthplace-timezone copy: ${phrase}`);
for(const phrase of ['Five-year outlook','未来五年走势','今後5年の流れ','未來五年走勢','Xu hướng 5 năm','แนวโน้ม 5 ปี']) assert.ok(component.includes(phrase),`Missing P0 five-year copy: ${phrase}`);
for(const phrase of ['Ten Gods · visible stems','十神 · 明透天干','十神 · 表の天干','Thập thần · thiên can lộ','สิบเทพ · ก้านฟ้าที่ปรากฏ']) assert.ok(component.includes(phrase),`Missing Ten Gods explanation: ${phrase}`);
assert.match(component,/not sent to an AI model/,'Privacy disclosure must state that birth details are not sent to AI.');
assert.match(component,/role="status" aria-live="polite"/,'Copy/download feedback must be announced accessibly.');

console.log('Saju functional reading contract passed: deterministic chart -> Ten Gods -> five-year outlook -> copy/download, with unknown-time and zero-API privacy guards.');
