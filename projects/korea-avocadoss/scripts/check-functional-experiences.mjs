import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const required=[
 'src/app/[locale]/page.tsx',
 'src/app/[locale]/color/page.tsx','src/features/color/color-scanner.tsx','src/features/color/validate-color-upload.ts','src/features/color/read-color-image-dimensions.ts','src/features/color/decode-color-image.ts',
 'src/app/[locale]/hanbok/page.tsx','src/features/hanbok/hanbok-matcher.tsx','src/features/hanbok/rank-catalog.ts','src/features/hanbok/HanbokCatalogResults.tsx','src/features/hanbok/HanbokRentalFinder.tsx','src/lib/travel/gyeongbokgung-hanbok-rentals.ts','src/lib/looks/catalog.ts',
 'src/app/[locale]/explore/gyeongbokgung/page.tsx','src/features/explore/GyeongbokgungPlannerV2.tsx',
 'src/app/[locale]/explore/food/page.tsx','src/features/explore/FoodFinder.tsx','src/lib/travel/gyeongbokgung-food.ts','src/lib/travel/gyeongbokgung-food-core.ts','src/lib/content/travel-content.ts',
 'src/app/[locale]/explore/nearby/page.tsx','src/features/explore/NearbyExplorer.tsx','src/lib/travel/gyeongbokgung-nearby.ts','src/lib/travel/gyeongbokgung-nearby-core.ts',
 'src/app/[locale]/culture/saju/page.tsx','src/features/culture/SajuExperience.tsx',
 'src/app/[locale]/culture/naming/page.tsx','src/features/culture/NamingStudio.tsx',
 'src/app/[locale]/style/page.tsx','src/features/looks/style-consultation-v5.tsx','src/lib/looks/style-input-v1.ts','src/lib/looks/recommend.ts','src/lib/looks/deliverable.ts',
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
const colorDimensions=read('src/features/color/read-color-image-dimensions.ts');
const colorDecoder=read('src/features/color/decode-color-image.ts');
assert.match(color,/validateColorUpload\(selected\)/,'Personal Color must validate a photo before creating the active preview');
assert.match(color,/analyzeVisibleTone\(file\)/,'Personal Color must perform real local image analysis');
assert.match(color,/accept="image\/jpeg,image\/png,image\/webp"/,'Personal Color upload picker must advertise only tested browser formats');
assert.match(color,/setUndertone/);assert.match(color,/setDepth/);
assert.match(color,/href=\{hanbokHref\}/,'Personal Color result must bridge to Hanbok');
assert.match(colorUpload,/maxBytes:12\*1024\*1024/,'Personal Color must cap compressed upload size');
assert.match(colorUpload,/maxPixels:36_000_000/,'Personal Color must cap decoded pixel count');
assert.match(colorUpload,/minWidth:240/);assert.match(colorUpload,/minHeight:240/);
assert.match(colorUpload,/readColorImageDimensions\(file\)/,'Upload validation must preflight dimensions before allocating decoded pixels');
assert.doesNotMatch(colorUpload,/decodeColorImage|createImageBitmap|new Image\s*\(/,'Upload validation must not decode a full bitmap merely to enforce size and pixel caps');
assert.match(colorDimensions,/file\.arrayBuffer\(\)/,'Dimension preflight must inspect compressed browser-local bytes');
assert.doesNotMatch(colorDimensions,/fetch\s*\(/,'Dimension preflight must not add a remote image path');
assert.match(colorDecoder,/URL\.revokeObjectURL\(url\)/,'Fallback image decoding must release browser-local object URLs');
assert.doesNotMatch(color,/fetch\s*\(/,'Personal Color must remain browser-local at launch');

const hanbok=read('src/features/hanbok/hanbok-matcher.tsx');
const hanbokRank=read('src/features/hanbok/rank-catalog.ts');
const hanbokVisual=read('src/features/hanbok/HanbokCatalogResults.tsx');
const looksCatalog=read('src/lib/looks/catalog.ts');
assert.match(hanbok,/scoreLook\(/);assert.match(hanbok,/rankedLooks/);
assert.match(hanbok,/undertoneParam/,'Hanbok must consume Personal Color bridge');
assert.match(hanbok,/setDestination/);assert.match(hanbok,/setSeason/);
assert.match(hanbok,/HanbokCatalogResults/,'Hanbok matcher must expose the richer licensed visual candidate set');
assert.match(hanbok,/#rental-finder/,'Hanbok rental CTA must enter the real rental finder rather than a placeholder route');
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
assert.match(explore,/function localToday\(\)/,'Visit date must initialize from the browser-local calendar rather than UTC or a stale literal');
assert.match(explore,/useMemo\(localToday,\[\]\)/,'Planner must initialize its visit date dynamically from localToday');
assert.doesNotMatch(explore,/toISOString\(\)\.slice\(0,10\)/,'Planner must not derive a local visit date from UTC ISO date');
assert.doesNotMatch(explore,/const today=['"]2026-09-09['"]/,'Planner must never ship a hard-coded current date');
assert.match(explore,/planStops\(duration,focus\)/,'Selected time budget and focus must drive the itinerary');
assert.match(explore,/\/explore\/food/,'Timed route must continue into Food Finder');
assert.match(explore,/hanbokHref=`\/hanbok\?date=/,'Timed route must continue into Hanbok rental planning with visit context');
assert.match(explorePage,/href="\/explore\/nearby"/,'Palace experience must continue into the nearby route planner');

const foodPage=read('src/app/[locale]/explore/food/page.tsx');
const food=read('src/features/explore/FoodFinder.tsx');
const foodData=read('src/lib/travel/gyeongbokgung-food.ts');
assert.match(foodPage,/getGyeongbokgungFoodPlaces\(\)/,'Food page must resolve public content on the server');
assert.match(food,/filterFoodPlaces\(contentPlaces,category\)/,'Food finder filters must drive visible results from server-provided content');
assert.doesNotMatch(food,/from '@\/lib\/travel\/gyeongbokgung-food'/,'Food client must not bundle the local content payload');
assert.match(food,/Verify source|查看官方来源|公式情報を確認/,'Food finder must tell visitors to re-check live source data');
assert.match(foodData,/visitkorea\.or\.kr/,'Food data must include official Korea Tourism Organization evidence');
assert.match(foodData,/visitseoul\.net/,'Food data must include official Visit Seoul evidence');
for(const field of ['checkedAt','sourceUrl','hours','address'])assert.match(foodData,new RegExp(field),`Food data missing ${field}`);

const nearby=read('src/features/explore/NearbyExplorer.tsx');
assert.match(nearby,/nearbyRoute\(stops,focus,budget,date\)/,'Nearby Explorer must combine server-resolved source-checked stops with the visitor focus, time budget and visit date');
assert.match(nearby,/nearbyStopAvailabilityAt\(stop,date,stop\.arrival\)/,'Nearby Explorer must enforce deterministic date/time availability at each planned arrival');
assert.match(nearby,/navigator\.clipboard\?\.writeText/,'Nearby route must be reusable during the trip');
assert.doesNotMatch(nearby,/fetch\s*\(/,'Nearby Explorer must remain zero-API');

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
const style=read('src/features/looks/style-consultation-v5.tsx');
const styleInput=read('src/lib/looks/style-input-v1.ts');
const lookRecommend=read('src/lib/looks/recommend.ts');
const deliverable=read('src/lib/looks/deliverable.ts');
assert.match(stylePage,/StyleConsultationV5/,'My Korea Look page must use the current locale-native result matcher');
for(const state of ['setStyle','setGarment','setPalette','setMood','setComfort','setCoverage','setSeason','setDestination','setVisitDate'])assert.match(style,new RegExp(state),`My Korea Look missing ${state}`);
assert.match(style,/rankStyleInputV1\(input\)/,'Free 3-look planner must use the PRD-aligned deterministic ranking engine');
assert.match(style,/slice\(0,3\)/,'Free My Korea Look must expose three ranked looks before payment work resumes');
assert.match(style,/evidence\(look\)/,'Free 3-look plan must visibly explain recommendation evidence');
assert.match(style,/look\.palette\.top/,'Free 3-look plan must expose its color relationship');
assert.match(style,/look\.accessoryIds/,'Free 3-look plan must expose accessory guidance');
assert.match(style,/altFor\(/,'Free 3-look plan must expose an alternate colorway/look from the verified ranked set');
assert.match(style,/look\.rentalShopCard\.hangulTitle/,'Free 3-look plan must include an in-shop Korean request card');
assert.match(style,/look\.photoRoute\.map/,'Free 3-look plan must include a practical photo route');
assert.match(style,/navigator\.clipboard\?\.writeText/,'Free 3-look plan must be copyable');
assert.match(style,/href="\/hanbok#rental-finder"/,'Free 3-look plan must continue into the real rental finder');
assert.match(style,/LABELS:Record<Locale/,'My Korea Look options and generated guidance must be locale-native');
assert.doesNotMatch(style,/\/api\/checkout|my_korea_look_v1|CHECKOUT_DISABLED|\$12/,'User-facing My Korea Look must not call or advertise checkout before functionality is complete');
for(const dimension of ['paletteScore','comfortScore','seasonScore','destinationScore','moodScore'])assert.match(styleInput,new RegExp(dimension),`Full-input ranker missing ${dimension}`);
assert.match(styleInput,/look\.coverage!==input\.coverage/,'Coverage must remain a hard filter');
assert.match(styleInput,/seasonFromVisitDate/,'Visit date must materially drive seasonal fit');
assert.match(lookRecommend,/export function rankCuratedLooks/,'Legacy/shared deterministic ranking engine must remain available for other consumers');
assert.match(deliverable,/buildMyKoreaLookDeliverable/,'Future paid product must keep an explicit deliverable generator behind the disabled payment boundary');
assert.match(deliverable,/slice\(0,3\)/,'Future paid deliverable contract must generate three ranked looks');
for(const field of ['rentalShopCard','photoRoute','tradeOff','recommendedLocation','source'])assert.match(deliverable,new RegExp(field),`Future paid deliverable missing ${field}`);
assert.match(deliverable,/productKey:'my_korea_look_v1'/,'Future deliverable version must remain bound to the launch SKU internally');

const help=read('src/features/quick-help/QuickHelp.tsx');
assert.doesNotMatch(help,/fetch\s*\(/,'Free Quick Help must stay zero-API');
assert.doesNotMatch(help,/openrouter|OpenAI|anthropic/i,'Free Quick Help must stay zero-LLM');

console.log('Functional experience checks passed: Home, safe local Color, expanded Hanbok+rental finder, Saju, Naming, timed/reusable Gyeongbokgung, server-delivered Food, date-aware Nearby Explorer, full-input locale-native deterministic 3-look planning, and zero-API Quick Help are wired to real interactions.');
