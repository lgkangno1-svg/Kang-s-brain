import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const component=await readFile(new URL('../src/features/culture/SajuCompleteExperience.tsx',import.meta.url),'utf8');
const reading=await readFile(new URL('../src/lib/saju/reading.ts',import.meta.url),'utf8');
const tenGods=await readFile(new URL('../src/lib/saju/ten-gods.ts',import.meta.url),'utf8');
const domains=await readFile(new URL('../src/lib/saju/domain-outlook.ts',import.meta.url),'utf8');
const page=await readFile(new URL('../src/app/[locale]/culture/saju/page.tsx',import.meta.url),'utf8');

assert.match(page,/SajuCompleteExperience/,'The live Saju route must use the complete practical reading experience.');
assert.match(component,/nameHelp/,'Optional name must remain display-only.');
assert.match(component,/mode==='unknown'/,'Unknown birth time must remain a first-class path.');
assert.match(component,/calculateSajuExperience/,'Reading must remain grounded in the deterministic chart engine.');
assert.match(component,/visibleStemRoles/,'Visible-stem Ten Gods must remain part of the result.');
assert.match(component,/buildFiveYearOutlooks/,'The result must retain five deterministic future years.');
assert.match(component,/buildDomainOutlook/,'Each annual result must feed the practical domain interpretation layer.');
for(const field of ['work','money','relationships','pace','focus','caution']) assert.match(component,new RegExp(`\\{c\\.${field}\\}`),`Annual result must expose ${field}.`);
for(const relation of ['reinforce','support','expression','opportunity','pressure']) assert.match(domains,new RegExp(`${relation}:\\{`),`Domain rules must cover ${relation}.`);
for(const locale of ["en","'zh-CN'","ja","'zh-TW'","vi","th"]) assert.ok(domains.includes(`${locale}:`),`Domain rules must cover P0 locale ${locale}.`);
assert.match(domains,/investment advice|投资建议|投資助言|lời khuyên đầu tư|คำแนะนำการลงทุน/,'Money guidance must explicitly avoid turning symbolic readings into investment advice.');
assert.match(tenGods,/export function tenGodForStem/,'Ten Gods classification must remain deterministic and auditable.');
assert.match(tenGods,/Array\.from\(\{length: 5\}/,'Future reading must cover five consecutive years.');
assert.match(reading,/relationBetween/,'Annual outlooks must remain tied to explicit Five Elements relations.');
assert.match(component,/navigator\.clipboard/,'Visitors must be able to copy a completed reading.');
assert.match(component,/new Blob/,'Visitors must have a local text-download recovery path.');
assert.match(component,/URL\.revokeObjectURL/,'Local export must release its temporary object URL.');
assert.doesNotMatch(component,/fetch\s*\(/,'Free Saju reading must remain zero-API.');
assert.doesNotMatch(domains,/fetch\s*\(/,'Domain interpretation must remain zero-API.');
for(const phrase of ['Birthplace timezone','出生地时区','出生地タイムゾーン','出生地時區','Múi giờ nơi sinh','เขตเวลาสถานที่เกิด']) assert.ok(component.includes(phrase),`Missing P0 birthplace-timezone copy: ${phrase}`);
for(const phrase of ['Five-year practical outlook','未来五年实用走势','今後5年の実用的な流れ','未來五年實用走勢','Xu hướng thực tế 5 năm','แนวโน้มใช้งานจริง 5 ปี']) assert.ok(component.includes(phrase),`Missing P0 practical future copy: ${phrase}`);
assert.match(component,/not sent to AI/,'Privacy disclosure must state that birth details are not sent to AI.');
assert.match(component,/role="status" aria-live="polite"/,'Copy/download feedback must be announced accessibly.');

console.log('Saju functional reading contract passed: deterministic chart -> Ten Gods -> five-year work/money/relationship/pace outlook -> local copy/download, with unknown-time and zero-API guards.');
