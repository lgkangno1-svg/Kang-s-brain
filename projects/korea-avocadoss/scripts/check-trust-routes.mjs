import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(p)=>readFileSync(path.join(root,p),'utf8');
const routes=['about','contact','privacy','terms','refunds'];
for(const route of routes){
 const file=`src/app/[locale]/${route}/page.tsx`;
 assert.ok(existsSync(path.join(root,file)),`${file} missing`);
 const source=read(file);
 assert.match(source,new RegExp(`localizedAlternates\\(locale,'/${route}'\\)`),`${route} must publish locale-aware canonical/hreflang`);
}
const layout=read('src/app/[locale]/layout.tsx');
for(const route of routes)assert.match(layout,new RegExp(`href="/${route}"`),`Footer must link /${route}`);
assert.doesNotMatch(layout,/<span>\{shell\.(about|contact|privacy|terms|refunds)\}<\/span>/,'Footer trust labels must be actionable links');

const legal=read('src/features/legal/LegalPage.tsx');
assert.match(legal,/Real checkout is currently disabled|Live paid checkout is not yet enabled/,'Privacy/terms copy must state pre-launch payment truth');
assert.match(legal,/will be published here before real payment is enabled/,'Contact page must not invent merchant/support identity before it is configured');
assert.match(legal,/cultural and entertainment purposes/,'Terms must preserve Saju/cultural entertainment boundary');
assert.match(legal,/does not upload the selfie to an AI model/,'Privacy page must explain current local Personal Color handling');
assert.match(legal,/there is no live paid order to cancel or refund/,'Refunds page must state the current no-payment truth');
assert.match(legal,/does not produce the first result within 15 minutes/,'Refunds page must preserve the planned delivery-failure recovery boundary');
assert.match(legal,/statutory consumer rights take priority/,'Refunds page must preserve statutory-rights precedence');
for(const locale of ['zh-CN','ja','zh-TW','vi','th'])assert.match(legal,new RegExp(`['"]${locale}['"]?\\s*:\\s*\\{[\\s\\S]*?refunds:`),`${locale} must provide native refunds copy`);

const metadata=read('src/lib/seo/localized-metadata.ts');
const sitemap=read('src/app/sitemap.ts');
for(const route of routes){
 assert.match(metadata,new RegExp(`'/${route}'`),`${route} must be in localized public route inventory`);
 assert.match(sitemap,new RegExp(`'/${route}'`),`${route} must be in sitemap settings`);
}
console.log('Trust-route contract passed: real footer destinations, honest pre-launch legal/refund copy, canonical/hreflang and sitemap coverage are present.');
