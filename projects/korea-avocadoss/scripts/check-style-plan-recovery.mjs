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
assert.match(source,/if\(!isSavedPlan\(parsed\)\)\{localStorage\.removeItem\(STORAGE_KEY\)/,'Invalid or stale saved plan data must fail closed and be discarded.');
assert.match(source,/function clearPlan\(\)/,'Visitors must be able to delete saved free-plan choices from the device.');
assert.match(source,/Saved choices stay on this device|保存的选择只保留在此设备|保存内容はこの端末だけに残ります/,'At least the core P0 copy must disclose browser-local persistence.');
assert.doesNotMatch(source,/fetch\s*\(/,'Free My Korea Look save/recovery must remain zero-API.');

console.log('My Korea Look free-plan recovery contract passed: validated, device-local save/restore/delete with no API call.');
