import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');

const provider=read('src/lib/content/travel-content.ts');
const page=read('src/app/[locale]/explore/food/page.tsx');
const client=read('src/features/explore/FoodFinder.tsx');
const revalidate=read('src/app/api/content/revalidate/route.ts');
const env=read('.env.example');

assert.match(provider,/KOREA_CONTENT_SOURCE/,'Headless content must remain explicitly opt-in.');
assert.match(provider,/SANITY_PROJECT_ID/,'The first headless adapter must support Sanity without coupling client components to it.');
assert.match(provider,/next:\{revalidate:21600,tags:/,'Published CMS content must use Next.js server cache revalidation rather than refetching per visitor.');
assert.match(provider,/remote\?\?GYEONGBOKGUNG_FOOD_PLACES/,'CMS failure must fall back to source-checked local content.');
assert.match(provider,/valid\.length===body\.result\.length&&valid\.length>0/,'Remote content must fail closed on malformed or partial records.');

assert.match(page,/getGyeongbokgungFoodPlaces\(\)/,'Food content must be resolved in the Server Component.');
assert.match(page,/places=\{places\}/,'The interactive client must receive only resolved content as serializable props.');
assert.doesNotMatch(client,/from '@\/lib\/travel\/gyeongbokgung-food'/,'Client bundle must not import the local content payload.');
assert.match(client,/places:readonly FoodPlace\[\]/,'FoodFinder must accept server-resolved content.');
assert.match(client,/filterFoodPlaces\(contentPlaces,category\)/,'Client filtering must operate on the server-provided payload.');

assert.match(revalidate,/timingSafeEqual/,'CMS cache invalidation secret must use constant-time comparison.');
assert.match(revalidate,/ALLOWED_TAGS/,'CMS webhooks must only invalidate an allowlisted content tag.');
assert.match(revalidate,/revalidateTag\(tag,'max'\)/,'CMS publish invalidation must use stale-while-revalidate semantics.');
assert.match(env,/KOREA_CONTENT_SOURCE=local/,'Local verified content must remain the default until CMS credentials are explicitly configured.');
assert.match(env,/CONTENT_REVALIDATE_SECRET=/,'CMS webhook secret must be server-only configuration.');
assert.doesNotMatch(env,/NEXT_PUBLIC_SANITY_READ_TOKEN|NEXT_PUBLIC_CONTENT_REVALIDATE_SECRET/,'CMS secrets must never be exposed to the browser.');

console.log('Content architecture contracts passed: server-first payloads, cached headless adapter, validated fallback, and secured revalidation.');
