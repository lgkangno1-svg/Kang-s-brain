import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');

const provider=read('src/lib/content/travel-content.ts');
const foodPage=read('src/app/[locale]/explore/food/page.tsx');
const foodClient=read('src/features/explore/FoodFinder.tsx');
const hanbokPage=read('src/app/[locale]/hanbok/page.tsx');
const rentalClient=read('src/features/hanbok/HanbokRentalFinder.tsx');
const revalidate=read('src/app/api/content/revalidate/route.ts');
const env=read('.env.example');

assert.match(provider,/KOREA_CONTENT_SOURCE/,'Headless content must remain explicitly opt-in.');
assert.match(provider,/SANITY_PROJECT_ID/,'The headless adapter must support Sanity without coupling client components to it.');
assert.match(provider,/next:\{revalidate:21600,tags:/,'Published CMS content must use Next.js server cache revalidation rather than refetching per visitor.');
assert.match(provider,/remote\?\?GYEONGBOKGUNG_FOOD_PLACES/,'Food CMS failure must fall back to source-checked local content.');
assert.match(provider,/remote\?\?GYEONGBOKGUNG_HANBOK_RENTALS/,'Rental CMS failure must fall back to source-checked local content.');
assert.match(provider,/valid\.length===body\.result\.length&&valid\.length>0/,'Remote content must fail closed on malformed or partial records.');
assert.match(provider,/gyeongbokgungHanbokRentals:'content:travel:gyeongbokgung-hanbok-rentals'/,'Rental content must have an isolated revalidation tag.');
assert.match(provider,/_type == "hanbokRentalShop"/,'Rental CMS reads must use a dedicated record type.');
assert.match(provider,/isHanbokRentalShop/,'Rental CMS records must be schema validated before use.');
assert.match(provider,/sourceUrl/,'Remote travel content must preserve provenance fields.');
assert.match(provider,/checkedAt/,'Remote travel content must preserve freshness metadata.');

assert.match(foodPage,/getGyeongbokgungFoodPlaces\(\)/,'Food content must be resolved in the Server Component.');
assert.match(foodPage,/places=\{places\}/,'The food client must receive only resolved content as serializable props.');
assert.doesNotMatch(foodClient,/from '@\/lib\/travel\/gyeongbokgung-food'/,'Food client bundle must not import the local content payload.');
assert.match(foodClient,/places:readonly FoodPlace\[\]/,'FoodFinder must accept server-resolved content.');
assert.match(foodClient,/filterFoodPlaces\(contentPlaces,category\)/,'Food filtering must operate on the server-provided payload.');

assert.match(hanbokPage,/getGyeongbokgungHanbokRentalShops\(\)/,'Rental content must be resolved in the Hanbok Server Component.');
assert.match(hanbokPage,/shops=\{rentalShops\}/,'The rental client must receive only resolved shop records as serializable props.');
assert.doesNotMatch(rentalClient,/GYEONGBOKGUNG_HANBOK_RENTALS/,'Rental client bundle must not import the local rental payload.');
assert.match(rentalClient,/shops:readonly HanbokRentalShop\[\]/,'HanbokRentalFinder must accept server-resolved content.');
assert.match(rentalClient,/shops\.map\(shop=>/,'Rental filtering must operate on the server-provided payload.');
assert.match(rentalClient,/validShopIds=useMemo\(\(\)=>new Set\(shops\.map/,'Saved rental IDs must be revalidated against the current server-provided catalog.');

assert.match(revalidate,/timingSafeEqual/,'CMS cache invalidation secret must use constant-time comparison.');
assert.match(revalidate,/ALLOWED_TAGS/,'CMS webhooks must only invalidate an allowlisted content tag.');
assert.match(revalidate,/revalidateTag\(tag,'max'\)/,'CMS publish invalidation must use stale-while-revalidate semantics.');
assert.match(env,/KOREA_CONTENT_SOURCE=local/,'Local verified content must remain the default until CMS credentials are explicitly configured.');
assert.match(env,/CONTENT_REVALIDATE_SECRET=/,'CMS webhook secret must be server-only configuration.');
assert.doesNotMatch(env,/NEXT_PUBLIC_SANITY_READ_TOKEN|NEXT_PUBLIC_CONTENT_REVALIDATE_SECRET/,'CMS secrets must never be exposed to the browser.');

console.log('Content architecture contracts passed: food and rental server payloads, cached validated fallbacks, saved-ID recovery, and secured revalidation.');
