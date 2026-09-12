import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const data=read('src/lib/travel/gyeongbokgung-food.ts');
const i18n=read('src/lib/travel/gyeongbokgung-food-i18n.ts');
const page=read('src/app/[locale]/explore/food/page.tsx');

const ids=[...data.matchAll(/\{id:'([^']+)'/g)].map(match=>match[1]);
assert.ok(ids.length>=7,'Food Finder should retain the source-checked venue catalog.');
for(const id of ids)assert.match(i18n,new RegExp(`['"]?${id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}['"]?\\s*:`),`Missing localized venue copy for ${id}.`);
for(const locale of ["'zh-CN'",'ja',"'zh-TW'",'vi','th'])assert.match(i18n,new RegExp(`${locale.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\s*:`),`Missing Food Finder venue locale ${locale}.`);
for(const token of ['localizeFoodPlace(place,l)','localizeFoodHours(place.hours,l)','summary:localized.summary','closed:localized.closed','dietaryNote:localized.dietaryNote'])assert.ok(page.includes(token),`Food page must apply localized server-side presentation: ${token}`);
for(const phrase of ['已核对来源','出典確認済み','已核對來源','nguồn đã kiểm tra','แหล่งข้อมูลที่ตรวจสอบแล้ว'])assert.ok(page.includes(phrase),`Missing locale-native Food metadata signal: ${phrase}`);
assert.match(i18n,/copy\?\?\{summary:place\.summary,closed:place\.closed,dietaryNote:place\.dietaryNote\}/,'Unknown CMS place IDs must fail safely to source-provided copy instead of disappearing.');
assert.doesNotMatch(page,/navigator|localStorage|fetch\(/,'Server localization must not add browser storage, location, or runtime network dependencies.');
console.log(`Food localization contract passed: ${ids.length} source-backed venues have authored P0 presentation with safe CMS fallback and localized search metadata.`);
