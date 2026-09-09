import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=readFileSync(path.join(root,'src/features/explore/GyeongbokgungPlannerV2.tsx'),'utf8');

assert.match(source,/const closedDay=isTuesday\(date\)/,'Planner must derive a single deterministic Tuesday closure state from the selected visit date');
assert.match(source,/function submit\(e:FormEvent\).*if\(closedDay\)\{setBuilt\(false\);setStatus\(c\.closed\);return;\}/s,'Planner must not build a normal itinerary for an unverified Tuesday');
assert.match(source,/function savePlan\(\)\{if\(closedDay\)\{setStatus\(c\.closed\);return;\}/,'Planner must not persist a Tuesday itinerary as if it were visitable');
assert.match(source,/async function copyPlan\(\)\{if\(closedDay\)\{setStatus\(c\.closed\);return;\}/,'Planner must not copy a misleading Tuesday itinerary');
assert.match(source,/setBuilt\(!restoredClosed\)/,'Restoring a saved Tuesday must recover into verification state instead of rendering stale route steps');
assert.match(source,/disabled=\{closedDay\}/,'Build control must communicate the known closure state before submission');
assert.match(source,/built&&!closedDay/,'Timed route actions must remain unavailable on the known closure state');
assert.match(source,/public holidays can move the closure/i,'English copy must explain why Tuesday is fail-closed rather than claiming an absolute closure');
for(const marker of ['节假日可能调整休宫日','祝日は休宮日が移動','國定假日可能調整休宮日','ngày lễ có thể làm đổi ngày đóng cửa','วันหยุดราชการอาจทำให้วันปิดเปลี่ยนไป'])assert.ok(source.includes(marker),`P0 closure-recovery copy missing: ${marker}`);
assert.match(source,/royal\.khs\.go\.kr/,'Closure recovery must retain an official palace verification link');

console.log('Gyeongbokgung closure recovery checks passed: unverified Tuesday plans fail closed across build, restore, save and copy while preserving official-source recovery.');
