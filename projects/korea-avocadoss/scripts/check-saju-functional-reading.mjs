import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const component=await readFile(new URL('../src/features/culture/SajuFunctionalExperience.tsx',import.meta.url),'utf8');
const reading=await readFile(new URL('../src/lib/saju/reading.ts',import.meta.url),'utf8');
const page=await readFile(new URL('../src/app/[locale]/culture/saju/page.tsx',import.meta.url),'utf8');

assert.match(page,/SajuFunctionalExperience/,'The live Saju route must use the functional reading experience.');
assert.match(component,/nameHelp/,'Optional name input must explicitly disclose that it does not alter Four Pillars math.');
assert.match(component,/mode==='unknown'/,'Unknown birth time must remain a first-class path.');
assert.match(component,/calculateSajuExperience/,'The reading must be grounded in the deterministic chart engine.');
assert.match(component,/buildSajuFunctionalReading/,'The chart must feed a deterministic interpretation layer.');
assert.match(component,/reading\.outlooks\.map/,'The result must expose yearly outlooks rather than stopping at raw pillars.');
assert.match(reading,/\[startYear,startYear\+1\]/,'The rule layer must create current-year and next-year outlooks.');
assert.match(reading,/relationBetween/,'Annual outlooks must be derived from explicit Five Elements relations.');
assert.match(component,/navigator\.clipboard/,'Visitors must be able to copy a completed reading.');
assert.match(component,/new Blob/,'Visitors must have a local text-download recovery path.');
assert.match(component,/URL\.revokeObjectURL/,'Local export must release its temporary object URL.');
assert.doesNotMatch(component,/fetch\s*\(/,'Free Saju reading must remain zero-API.');
assert.doesNotMatch(reading,/fetch\s*\(/,'Deterministic Saju interpretation must remain zero-API.');
for(const phrase of ['Birthplace timezone','出生地时区','出生地タイムゾーン','出生地時區','Múi giờ nơi sinh','เขตเวลาสถานที่เกิด']) assert.ok(component.includes(phrase),`Missing P0 birthplace-timezone copy: ${phrase}`);
for(const phrase of ['Yearly outlook','年度走势','年運の見通し','年度走勢','Triển vọng theo năm','แนวโน้มรายปี']) assert.ok(component.includes(phrase),`Missing P0 future-reading copy: ${phrase}`);
assert.match(component,/not sent to an AI model/,'Privacy disclosure must state that birth details are not sent to AI.');
assert.match(component,/role="status" aria-live="polite"/,'Copy/download feedback must be announced accessibly.');

console.log('Saju functional reading contract passed: deterministic chart -> cultural interpretation -> two-year outlook -> copy/download, with unknown-time and zero-API privacy guards.');
