import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');

const data=read('src/lib/travel/gyeongbokgung-nearby.ts');
const core=read('src/lib/travel/gyeongbokgung-nearby-core.ts');
const explorer=read('src/features/explore/NearbyExplorer.tsx');
const page=read('src/app/[locale]/explore/nearby/page.tsx');
const palace=read('src/app/[locale]/explore/gyeongbokgung/page.tsx');
const quickHelp=read('src/features/quick-help/data.ts');
const seo=read('src/lib/seo/localized-metadata.ts');
const sitemap=read('src/app/sitemap.ts');

assert.match(core,/NearbyFocus='seochon'\|'bukchon'\|'insadong'\|'easy'/,'Nearby routes must expose distinct visitor intents.');
assert.match(core,/NearbyBudget=60\|120\|180/,'Nearby routes must support 1, 2 and 3 hour budgets.');
assert.ok((data.match(/checkedAt:'2026-09-09'/g)??[]).length>=5,'Nearby inventory must keep source-check dates.');
assert.match(data,/restrictedWindow/,'Nearby data must model time-sensitive visitor restrictions.');
assert.match(data,/Bukchon-ro 11-gil/,'Bukchon restricted-area timing must be explicit rather than generalized to all of Bukchon.');
assert.match(data,/sourceUrl:OFFICIAL/,'Nearby stops must retain official source URLs.');
assert.match(core,/google\.com\/maps\/search/,'Nearby stops must use a zero-API map handoff.');
assert.match(core,/nearbyRouteMapUrl/,'Nearby core must expose a route-level map handoff.');
assert.match(core,/google\.com\/maps\/dir/,'The full-route handoff must use provider-native directions rather than a new routing API.');
assert.match(core,/travelmode:'walking'/,'Nearby route handoff must explicitly request walking directions.');
assert.match(core,/params\.set\('waypoints',waypoints\)/,'Multi-stop Nearby routes must preserve intermediate stops as waypoints.');
assert.match(data,/closedWeekdays:\[6\]/,'Known fixed weekly closures must be modeled explicitly from official source data.');
assert.match(core,/nearbyStopAvailabilityAt/,'Nearby deterministic core must expose date/time availability evaluation.');
assert.match(core,/weekdayFromIso/,'Weekly closure evaluation must derive weekday from the visitor-selected ISO date.');
assert.match(core,/if\(date&&nearbyStopAvailabilityAt\(base,date,720\)==='closed'\)continue/,'Routes must omit stops with a known fixed closure on the selected date.');
assert.match(data,/Lunar New Year and Chuseok closures also require a source re-check/,'Unmodeled holiday closures must remain explicit rather than guessed.');

assert.match(explorer,/useSearchParams/,'Nearby Explorer must accept itinerary handoff context.');
assert.match(explorer,/stops:readonly NearbyStop\[\]/,'Nearby Explorer must consume server-resolved content rather than owning the catalog.');
assert.match(explorer,/nearbyRoute\(stops,focus,budget,date\)/,'Nearby Explorer must recalculate routes from server content and explicit visitor choices including date.');
assert.match(explorer,/nearbyRouteMapUrl\(routeStops\)/,'Nearby Explorer must build a single full-route map handoff from the chosen deterministic stops.');
assert.match(explorer,/href=\{routeMap\}/,'The generated full walking route must be directly actionable from the result.');
assert.ok((explorer.match(/fullRoute:/g)??[]).length===6,'The full-route action must have native copy for all six P0 locales.');
assert.match(explorer,/nearbyStopAvailabilityAt\(stop,date,stop\.arrival\)/,'Nearby Explorer must evaluate time restrictions against each planned arrival.');
assert.match(explorer,/navigator\.clipboard\?\.writeText/,'Nearby route must be copyable for use during the trip.');
assert.match(explorer,/routeMap\]\.filter\(Boolean\)/,'Copied itinerary text must include the full-route map handoff when available.');
assert.match(explorer,/closurePolicy/,'Nearby Explorer must disclose fixed-closure filtering and holiday re-check limits in every P0 locale.');
assert.doesNotMatch(explorer,/gyeongbokgung-nearby';/,'Nearby client must not import the verified local content module.');
assert.doesNotMatch(explorer,/fetch\s*\(/,'Nearby Explorer must remain zero-API.');
assert.doesNotMatch(explorer,/openai|openrouter|anthropic/i,'Nearby Explorer must not depend on an AI provider.');

assert.match(page,/getGyeongbokgungNearbyStops\(\)/,'The localized Nearby Server Component must resolve source-checked content.');
assert.match(page,/stops=\{stops\}/,'The localized Nearby page must pass resolved content into the actual planner.');
assert.match(palace,/href="\/explore\/nearby"/,'Gyeongbokgung must continue into Nearby Explorer.');
assert.match(quickHelp,/href:'\/explore\/nearby'/,'Quick Help nearby guidance must open the real Nearby Explorer.');
assert.match(seo,/'\/explore\/nearby'/,'Nearby Explorer must participate in localized canonical/hreflang URLs.');
assert.match(sitemap,/'\/explore\/nearby'/,'Nearby Explorer must be included in the public sitemap.');

console.log('Nearby Explorer contracts passed: server-resolved source-checked content, deterministic 1–3h local routes, date-aware closures, time restrictions, full walking-route/copy/map handoff, real navigation, and zero AI API.');
