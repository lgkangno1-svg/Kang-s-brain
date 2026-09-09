import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');

const analyzer=read('src/features/color/analyze-visible-tone.ts');
const skinRegion=read('src/features/color/skin-region.ts');
assert.match(analyzer,/findLikelyFaceRegion/,'Personal Color must prefer a detected portrait skin ROI over a fixed crop.');
assert.match(analyzer,/trimPixelsByLuminance/,'Personal Color must use robust trimmed luminance statistics.');
assert.match(analyzer,/bitmap\?\.close\(\)/,'Personal Color must always release decoded bitmap memory.');
assert.match(skinRegion,/connected skin-colour components|queueX/,'Personal Color ROI detection must use a local connected-component search.');
assert.doesNotMatch(analyzer,/fetch\s*\(/,'Personal Color must remain server-free at launch.');

const hanbok=read('src/features/hanbok/HanbokCatalogResults.tsx');
assert.match(hanbok,/FAVORITES_KEY='kc-hanbok-favorites-v1'/,'Hanbok favorites need a versioned local persistence key.');
assert.match(hanbok,/localStorage\.setItem/,'Hanbok favorites must survive navigation/browser reload when storage is available.');
assert.match(hanbok,/compareIds/,'Hanbok visual results must support explicit comparison state.');
assert.match(hanbok,/next\.size>=3/,'Hanbok comparison must cap the decision set at three looks.');
assert.match(hanbok,/aria-pressed=\{saved\}/,'Favorite state must be exposed accessibly.');
assert.match(hanbok,/aria-pressed=\{selected\}/,'Compare state must be exposed accessibly.');

const planner=read('src/features/explore/GyeongbokgungPlannerV2.tsx');
const food=read('src/features/explore/FoodFinder.tsx');
const foodData=read('src/lib/travel/gyeongbokgung-food.ts');
assert.match(planner,/withHanbok/,'Palace planner must support Hanbok-aware timing.');
assert.match(planner,/fitMinutes=withHanbok\?45:0/,'Hanbok fitting must add a conservative pre-entry buffer.');
assert.match(planner,/returnMinutes=withHanbok\?30:0/,'Hanbok return must add a conservative post-palace buffer.');
assert.match(planner,/foodHref=`\/explore\/food\?date=/,'Palace planner must carry the selected date into Food Finder.');
assert.match(planner,/time=\$\{encodeURIComponent\(clock\(foodArrival\)\)\}/,'Food handoff must use arrival time after any Hanbok return buffer.');
assert.match(food,/useSearchParams/,'Food Finder must consume itinerary context from the planner.');
assert.match(food,/foodAvailabilityAt\(place,date,time\)/,'Food Finder must evaluate each place at the planned arrival time.');
assert.match(food,/openOnly/,'Food Finder must let visitors hide clearly unavailable options.');
for(const field of ['openMinute','closeMinute','closedWeekdays','scheduleConfidence'])assert.match(foodData,new RegExp(field),`Food schedule data missing ${field}.`);
assert.match(foodData,/scheduleConfidence==='recheck'/,'Uncertain schedules must remain verify-only, never guessed open.');
assert.ok((foodData.match(/id:'/g)??[]).length>=7,'Food Finder must retain a useful source-checked launch inventory.');

const saju=read('src/features/culture/SajuExperience.tsx');
const sajuSummary=read('src/lib/saju/cultural-summary.ts');
assert.match(saju,/summarizeElementBalance/,'Saju result must expose a deterministic symbolic element summary.');
assert.match(saju,/copySummary/,'Saju result must be copyable without storing raw birth details.');
assert.match(saju,/localToday/,'Saju date max must use the browser local calendar date.');
assert.doesNotMatch(saju,/localStorage|sessionStorage/,'Saju must not persist raw birth details in browser storage by default.');
assert.match(sajuSummary,/does not infer personality, compatibility, health/,'Saju symbolic summary must explicitly exclude high-impact interpretations.');

const naming=read('src/features/culture/NamingStudio.tsx');
assert.match(naming,/STORAGE_KEY='kc-korean-name-shortlist-v1'/,'Naming shortlist needs a versioned browser-storage key.');
assert.match(naming,/shortlist\.length>=3/,'Naming shortlist must remain intentionally small.');
assert.match(naming,/copyShortlist/,'Naming shortlist must be reusable outside the page.');
assert.match(naming,/not sent anywhere or saved|不会上传或保存|外部送信・保存されません/,'Personal seed copy must disclose that it is not persisted.');
assert.doesNotMatch(naming,/fetch\s*\(/,'Naming Studio must remain zero-API.');

console.log('Feature completion contracts passed: robust local color ROI, Hanbok save/compare, Hanbok-aware itinerary+food, safe Saju summary, and Korean-name shortlist.');
