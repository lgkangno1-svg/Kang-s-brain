import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=readFileSync(path.join(root,'src/features/explore/GyeongbokgungPlannerV2.tsx'),'utf8');

assert.match(source,/const closedDay=isClosedDay\(date\)/,'Planner must derive one deterministic closure state that includes verified holiday shifts');
assert.match(source,/const VERIFIED_2026_HOLIDAY_OPEN_TUESDAYS=new Set\(\['2026-02-17','2026-05-05'\]\)/,'Verified 2026 public-holiday Tuesdays must remain explicitly open');
assert.match(source,/const VERIFIED_2026_SHIFTED_CLOSURES=new Set\(\['2026-02-19','2026-05-06'\]\)/,'Verified first-non-holiday substitute closures must remain explicit');
assert.match(source,/function isClosedDay\(date:string\).*VERIFIED_2026_SHIFTED_CLOSURES\.has\(date\).*VERIFIED_2026_HOLIDAY_OPEN_TUESDAYS\.has\(date\).*isTuesday\(date\)/s,'Closure resolver must prefer verified shifted closures and holiday openings before the normal Tuesday rule');
assert.match(source,/function submit\(e:FormEvent\).*if\(closedDay\)\{setBuilt\(false\);setStatus\(c\.closed\);return;\}/s,'Planner must not build a normal itinerary for a verified closure date');
assert.match(source,/function savePlan\(\)\{if\(closedDay\)\{setStatus\(c\.closed\);return;\}/,'Planner must not persist a closed-date itinerary as if it were visitable');
assert.match(source,/async function copyPlan\(\)\{if\(closedDay\)\{setStatus\(c\.closed\);return;\}/,'Planner must not copy a misleading closed-date itinerary');
assert.match(source,/const restoredClosed=isClosedDay\(parsed\.date\)/,'Saved plans must be re-evaluated through the same holiday-aware closure resolver');
assert.match(source,/setBuilt\(!restoredClosed\)/,'Restoring a saved closed date must recover into verification state instead of rendering stale route steps');
assert.match(source,/disabled=\{closedDay\}/,'Build control must communicate the known closure state before submission');
assert.match(source,/built&&!closedDay/,'Timed route actions must remain unavailable on a known closure state');
assert.match(source,/Public holidays can move the closure/i,'English copy must explain why closure dates require official verification');
for(const marker of ['节假日可能调整休宫日','祝日は休宮日が移動','國定假日可能調整休宮日','ngày lễ có thể làm đổi ngày đóng cửa','วันหยุดราชการอาจทำให้วันปิดเปลี่ยนไป'])assert.ok(source.includes(marker),`P0 closure-recovery copy missing: ${marker}`);
assert.match(source,/royal\.khs\.go\.kr/,'Closure recovery must retain an official palace verification link');
assert.doesNotMatch(source,/const closedDay=isTuesday\(date\)/,'Closure recovery must not regress to an absolute Tuesday-only rule');

console.log('Gyeongbokgung closure recovery checks passed: verified holiday openings and shifted closures share one fail-closed build/restore/save/copy path with official-source recovery.');
