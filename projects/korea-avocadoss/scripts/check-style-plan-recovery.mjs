import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=readFileSync(path.join(root,'src/features/looks/style-consultation-v2.tsx'),'utf8');

assert.match(source,/STORAGE_KEY='kc-my-korea-look-plan-v1'/,'My Korea Look free plan needs a versioned local persistence key.');
assert.match(source,/type SavedPlan=\{version:1;style:StyleId;garment:GarmentType;tone:LookUndertone;priority:LookPriority;season:Season\}/,'Saved free-plan state must contain only bounded non-sensitive preferences.');
assert.match(source,/function isSavedPlan\(value:unknown\)/,'Saved My Korea Look state must be validated before restoration.');
assert.match(source,/localStorage\.setItem\(STORAGE_KEY,JSON\.stringify\(payload\)\)/,'Visitors must be able to save free-plan choices locally without an account or API.');
assert.match(source,/function restorePlan\(\)/,'Visitors must have an explicit recovery path for their saved free-plan choices.');
assert.match(source,/try\{parsed=JSON\.parse\(raw\);\}catch\{localStorage\.removeItem\(STORAGE_KEY\);setMessage\(c\.noSaved\);return;\}/,'Malformed saved JSON must fail closed and be discarded rather than poisoning future restores.');
assert.match(source,/if\(!isSavedPlan\(parsed\)\)\{localStorage\.removeItem\(STORAGE_KEY\)/,'Invalid or stale saved plan data must fail closed and be discarded.');
assert.match(source,/function clearPlan\(\)/,'Visitors must be able to delete saved free-plan choices from the device.');
assert.match(source,/storageFailed:string/,'Storage access failures need an explicit localized recovery message contract.');
assert.match(source,/function savePlan\(\).*catch\{setMessage\(c\.storageFailed\);\}/s,'Blocked local storage writes must be surfaced instead of failing silently.');
assert.match(source,/function restorePlan\(\).*catch\{setMessage\(c\.storageFailed\);\}/s,'Blocked local storage reads must be surfaced instead of being misreported as no saved plan.');
assert.match(source,/function clearPlan\(\).*catch\{setMessage\(c\.storageFailed\);\}/s,'Blocked local storage deletion must be surfaced instead of failing silently.');
for(const phrase of ['device storage','设备存储','端末ストレージ','裝置儲存空間','bộ nhớ thiết bị','พื้นที่จัดเก็บของอุปกรณ์']){
 assert.ok(source.includes(phrase),`Storage recovery guidance must be present in every P0 locale: ${phrase}`);
}
assert.match(source,/const planText=useMemo\(/,'The exported artifact must be derived from the currently ranked three-look result.');
assert.match(source,/\.\.\.look\.reasons\.map\(reason=>`- \$\{reason\}`\)/,'Export must preserve the recommendation reasons instead of reducing the plan to titles only.');
assert.match(source,/if\(!navigator\.clipboard\?\.writeText\)\{setMessage\(c\.copyFailed\);return;\}/,'Clipboard absence must fail visibly instead of reporting a false success.');
assert.match(source,/catch\{setMessage\(c\.copyFailed\);\}/,'Clipboard rejection must expose a localized recovery message.');
assert.match(source,/function downloadPlan\(\)/,'Visitors need an offline export path when clipboard access is blocked.');
assert.match(source,/new Blob\(\[planText\],\{type:'text\/plain;charset=utf-8'\}\)/,'Downloaded plan must be generated locally from the current result.');
assert.match(source,/anchor\.download=`my-korea-look-\$\{l\}\.txt`/,'The local export must use an explicit downloadable text filename.');
assert.match(source,/URL\.revokeObjectURL\(objectUrl\)/,'Temporary export object URLs must be revoked after use.');
assert.match(source,/role="status"/,'Copy, download, save and recovery feedback must be announced to assistive technology.');
assert.match(source,/exports are created locally|导出文件也在本地生成|書き出しも端末内で作成されます/,'Core P0 copy must disclose that exports are created locally.');
assert.doesNotMatch(source,/fetch\s*\(/,'Free My Korea Look save/export/recovery must remain zero-API.');

console.log('My Korea Look free-plan recovery contract passed: validated local save/restore/delete, corrupt-data cleanup, explicit storage failure recovery, truthful copy and local export recovery with no API call.');
