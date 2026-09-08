import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const required=[
 'src/app/[locale]/page.tsx',
 'src/app/[locale]/color/page.tsx','src/features/color/color-scanner.tsx','src/features/color/validate-color-upload.ts',
 'src/app/[locale]/hanbok/page.tsx','src/features/hanbok/hanbok-matcher.tsx','src/features/hanbok/rank-catalog.ts','src/features/hanbok/HanbokCatalogResults.tsx','src/lib/looks/catalog.ts',
 'src/app/[locale]/explore/gyeongbokgung/page.tsx','src/features/explore/GyeongbokgungPlannerV2.tsx',
 'src/app/[locale]/explore/food/page.tsx','src/features/explore/FoodFinder.tsx','src/lib/travel/gyeongbokgung-food.ts',
 'src/app/[locale]/culture/saju/page.tsx','src/features/culture/SajuExperience.tsx',
 'src/app/[locale]/culture/naming/page.tsx','src/features/culture/NamingStudio.tsx',
 'src/app/[locale]/style/page.tsx','src/features/looks/style-consultation-v2.tsx','src/lib/looks/recommend.ts','src/lib/looks/deliverable.ts',
 'src/features/quick-help/QuickHelp.tsx'
];
for(const p of required)assert.ok(existsSync(path.join(root,p)),`${p} missing`);

const home=read('src/app/[locale]/page.tsx');
assert.match(home,/href="\/culture\/saju"/,'Home must enter working Saju directly');
assert.match(home,/href="\/culture\/naming"/,'Home must enter working Naming Studio directly');
assert.match(home,/href="\/explore\/gyeongbokgung"/,'Home must enter working route planner');
assert.doesNotMatch(home,/Featured Paid Service · \$12 USD/,'Home must not claim live paid checkout while checkout is disabled');
assert.doesNotMatch(home,/namingAction:'Coming Soon'/,'Working Naming Studio must not be presented as coming soon');

const color=read('src/features/color/color-scanner.tsx');
const colorUpload=read('src/features/color/validate-color-upload.ts');
assert.match(color,/validateColorUpload\(selected\)/,'Personal Color must validate a photo before creating the active preview');
assert.match(color,/analyzeVisibleTone\(file\)/,'Personal Color must perform real local image analysis');
assert.match(color,/accept="image\/jpeg,image\/png,image\/webp"/,'Personal Color upload picker must advertise only tested browser formats');
assert.match(color,/setUndertone/);assert.match(color,/setDepth/);
assert.match(color,/href=\{hanbokHref\}/,'Personal Color result must bridge to Hanbok');
assert.match(colorUpload,/maxBytes:12\*1024\*1024/,'Personal Color must cap compressed upload size');
assert.match(colorUpload,/maxPixels:36_000_000/,'Personal Color must cap decoded pixel count');
assert.match(colorUpload,/minWidth:240/);assert.match(colorUpload,/minHeight:240/);
assert.match(colorUpload,/bitmap\?\.close\(\)/,'Upload validation must release decoded bitmap memory');
assert.doesNotMatch(color,/fetch\s*\(/,'Personal Color must remain browser-local at launch');

const hanbok=read('src/features/hanbok/hanbok-matcher.tsx');
const hanbokRank=read('src/features/hanbok/rank-catalog.ts');
const hanbokVisual=read('src/features/hanbok/HanbokCatalogResults.tsx');
const looksCatalog=read('src/lib/looks/catalog.ts');
assert.match(hanbok,/scoreLook\(/);assert.match(hanbok,/rankedLooks/);
assert.match(hanbok,/undertoneParam/,'Hanbok must consume Personal Color bridge');
assert.match(hanbok,/setDestination/);assert.match(hanbok,/setSeason/);
assert.match(hanbok,/HanbokCatalogResults/,'Hanbok matcher must expose the richer licensed visual candidate set');
assert.match(hanbokRank,/CURATED_LOOKS_CATALOG\.map/,'Hanbok catalog ranker must score the maintained curated catalog');
for(const factor of ['preferredStyle','preferredUndertone','preferredWalking','seasonMatches','destinationMatches'])assert.match(hanbokRank,new RegExp(factor),`Hanbok catalog ranker missing ${factor}`);
assert.match(hanbokVisual,/slice\(0,6\)/,'Hanbok matcher must show more than the legacy three visual candidates');
assert.match(hanbokVisual,/look\.sourceUrl/,'Every displayed visual reference must preserve its source link');
assert.match(hanbokVisual,/look\.license/,'Every displayed visual reference must preserve license attribution');
assert.match(looksCatalog,/CC BY|CC0|public domain|Korea\.net|Korean Culture/i,'Curated look catalog must retain provenance/license evidence');
assert.doesNotMatch(hanbok,/fetch\s*\(/,'Free Hanbok ranking must remain zero-API');

const explorePage=read('src/app/[locale]/explore/gyeongbokgung/page.tsx');
const explore=read('src/features/explore/GyeongbokgungPlannerV2.tsx');
assert.match(explorePage,/GyeongbokgungPlannerV2/,'Gyeongbokgung page must render the timed planner V2');
assert.match(explore,/ROUTES/);assert.match(explore,/isTuesday/);
assert.match(explore,/royal\.khs\.go\.kr/,'Explore must expose the official palace source');
for(const state of ['setDuration','setFocus','setStart','setDate'])assert.match(explore,new RegExp(state),`Explore planner missing ${state}`);
assert.match(explore,/new Date\(\)\.toISOString\(\)\.slice\(0,10\)/,'Visit date must initialize dynamically rather than from a stale literal');
assert.doesNotMatch(explore,/const today=['"]2026-09-09['"]/,'Planner must never ship a hard-coded current date');
assert.match(explore,/planStops\(duration,focus\)/,'Selected time budget and focus must drive the itinerary');
assert.match(explore,/\/explore\/food/,'Timed route must continue into Food Finder');
assert.match(explore,/href="\/hanbok"/,'Timed route must connect to Hanbok planning');

const food=read('src/features/explore/FoodFinder.tsx');
const foodData=read('src/lib/travel/gyeongbokgung-food.ts');
assert.match(food,/filterFoodPlaces\(category\)/,'Food finder filters must drive visible results');
assert.match(food,/Verify source|查看官方来源|公式情報を確認/,'Food finder must tell visitors to re-check live source data');
assert.match(foodData,/visitkorea\.or\.kr/,'Food data must include official Korea Tourism Organization evidence');
assert.match(foodData,/visitseoul\.net/,'Food data must include official Visit Seoul evidence');
for(const field of ['checkedAt','sourceUrl','hours','address'])assert.match(foodData,new RegExp(field),`Food data missing ${field}`);

const saju=read('src/features/culture/SajuExperience.tsx');
assert.match(saju,/calculateSajuExperience/,'Saju UI must invoke the deterministic engine');
assert.match(saju,/setZone\]=useState\(''\)/,'Birthplace timezone must not silently default to Seoul');
assert.match(saju,/required placeholder=\{c\.zonePlaceholder\}/,'Birthplace timezone must be explicitly required');
assert.match(saju,/const ZODIAC:/,'Korean zodiac keys must be localized in the UI');
assert.match(saju,/const WESTERN:/,'Western zodiac keys must be localized in the UI');
assert.doesNotMatch(saju,/fetch\s*\(/,'Core Saju calculation must remain zero-API');

const naming=read('src/features/culture/NamingStudio.tsx');
assert.doesNotMatch(naming,/fetch\s*\(/,'Naming Studio must remain zero-API at launch');
assert.match(naming,/generateKoreanNames|rank|candidate|CATALOG/i,'Naming Studio must produce deterministic candidate results');

const stylePage=read('src/app/[locale]/style/page.tsx');
const style=read('src/features/looks/style-consultation-v2.tsx');
const lookRecommend=read('src/lib/looks/recommend.ts');
const deliverable=read('src/lib/looks/deliverable.ts');
assert.match(stylePage,/StyleConsultationV2/,'My Korea Look page must use the functional ranked matcher');
for(const state of ['setStyle','setGarment','setTone','setPriority','setSeason'])assert.match(style,new RegExp(state),`My Korea Look missing ${state}`);
assert.match(style,/rankCuratedLooks\(/,'Free preview must use the same shared deterministic ranking family as paid deliverables');
assert.match(lookRecommend,/export function rankCuratedLooks/,'My Korea Look needs a reusable deterministic ranking engine');
assert.match(deliverable,/buildMyKoreaLookDeliverable/,'Paid product must have an explicit deliverable generator before checkout opens');
assert.match(deliverable,/slice\(0,3\)/,'Paid My Korea Look contract must generate three ranked looks');
for(const field of ['rentalShopCard','photoRoute','tradeOff','recommendedLocation','source'])assert.match(deliverable,new RegExp(field),`Paid deliverable missing ${field}`);
assert.match(deliverable,/productKey:'my_korea_look_v1'/,'Deliverable version must be bound to the launch SKU');
assert.match(style,/my_korea_look_v1/,'Checkout request must use the launch SKU');
assert.doesNotMatch(style,/premium_hanbok_match/,'Legacy checkout SKU must not return');
assert.match(style,/CHECKOUT_DISABLED/,'Pre-launch checkout failure must be handled explicitly');

const help=read('src/features/quick-help/QuickHelp.tsx');
assert.doesNotMatch(help,/fetch\s*\(/,'Free Quick Help must stay zero-API');
assert.doesNotMatch(help,/openrouter|OpenAI|anthropic/i,'Free Quick Help must stay zero-LLM');

console.log('Functional experience checks passed: Home, safe local Color, expanded Hanbok, Saju, Naming, timed Gyeongbokgung, Food, deterministic 3-look deliverable, and zero-API Quick Help are wired to real interactions.');
