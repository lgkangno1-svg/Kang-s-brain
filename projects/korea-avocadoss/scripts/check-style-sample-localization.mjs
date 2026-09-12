import fs from'node:fs';import path from'node:path';
const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const local=read('src/features/looks/sample-localization.ts');
const view=read('src/features/looks/sample-view.tsx');
const page=read('src/app/[locale]/style/sample/[slug]/page.tsx');
const requiredLocales=["en","zh-CN","ja","zh-TW","vi","th"];
for(const locale of requiredLocales){if(!local.includes(`${locale}:`)&&!local.includes(`'${locale}':`))throw new Error(`missing sample locale ${locale}`);}
for(const slug of ['palace-elegance','modern-pastel','royal-ceremony']){const hits=local.split(`'${slug}'`).length-1;if(hits<6)throw new Error(`sample ${slug} is not authored for all P0 locales`);}
for(const marker of ['getSampleShell','getSampleCopy','getSampleMetadata','SAMPLE_P0_LOCALES'])if(!local.includes(marker))throw new Error(`missing localization contract ${marker}`);
for(const marker of ['useLocale()','getHanbokCatalogPresentation','aria-current','role="status"','aria-live="polite"','look.checkedAt','navigator.clipboard?.writeText','catch{setStatus(c.copyFailed)'])if(!view.includes(marker))throw new Error(`sample view missing ${marker}`);
if(view.includes('role="tablist"'))throw new Error('navigation links must not masquerade as ARIA tabs');
if(!page.includes('getSampleMetadata(locale,slug,sample)'))throw new Error('sample route metadata is not localized');
if(page.includes('My Korea Look Curated Sample'))throw new Error('hard-coded English sample metadata returned');
console.log(`style sample localization contract ok: ${requiredLocales.length} locales × 3 samples`);
