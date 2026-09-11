import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v5.tsx'),'utf8');
const ranking=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');
const sample=fs.readFileSync(path.join(root,'src/features/looks/sample-view.tsx'),'utf8');
const deliverable=fs.readFileSync(path.join(root,'src/lib/looks/deliverable.ts'),'utf8');

for(const marker of ['Why this matches your choice','Basic color direction','evidence(look)[0]','look.palette.top','look.palette.bottom','look.palette.accent','look.creator','look.license','look.sourceUrl']){
 if(!ui.includes(marker))throw new Error(`free style preview missing ${marker}`);
}
for(const marker of ['input.style','input.palette','input.comfort','input.season','input.destination']){
 if(!ui.includes(marker))throw new Error(`style evidence/ranking is not linked to ${marker}`);
}
for(const locale of ["en:","'zh-CN':","ja:","'zh-TW':","vi:","th:"]){if(!ui.includes(locale))throw new Error(`style result copy missing locale ${locale}`);}
for(const marker of ['LABELS:Record<Locale','summary:(s,g,p)','evidenceStyle:','evidencePalette:','evidencePractical:']){if(!ui.includes(marker))throw new Error(`locale-native free result layer missing ${marker}`);}
for(const marker of ['柔和王子/公主','やわらかい王子・姫','Hoàng tử / Công chúa nhẹ nhàng','เจ้าชาย/เจ้าหญิงโทนอ่อน']){if(!ui.includes(marker))throw new Error(`localized option/result vocabulary missing ${marker}`);}
for(const marker of ['RESULT_TERMS:Record<ResultLocale','ACCESSORY_TERMS:Record<ResultLocale','localizeLookForResult(','localizeVisualAlt(','visualAlt:localizeVisualAlt(look,locale)','extractHex(','input.locale,index','accessoryIds:look.accessoryIds.map']){
 if(!ranking.includes(marker))throw new Error(`locale-native catalog display missing ${marker}`);
}
for(const localeMarker of ["'zh-CN':{look:'造型',visual:'参考照片'","ja:{look:'ルック',visual:'参考写真'","'zh-TW':{look:'造型',visual:'參考照片'","vi:{look:'Look',visual:'Ảnh tham khảo'","th:{look:'ลุค',visual:'ภาพอ้างอิง'"]){
 if(!ranking.includes(localeMarker))throw new Error(`catalog result/accessibility localization missing ${localeMarker}`);
}
if(!ranking.includes("if(locale==='en')return look.alt"))throw new Error('English visual alt should preserve curated source wording');
if(!ranking.includes("if(locale==='en')return {...look,...visual}"))throw new Error('English catalog display should preserve curated source wording');
if(!ranking.includes('extractHex(look.palette.top)')||!ranking.includes('extractHex(look.palette.bottom)')||!ranking.includes('extractHex(look.palette.accent)'))throw new Error('localized palette display must preserve exact source hex values');

if(!ui.includes('slice(0,1)')||!ui.includes('looks.length===1'))throw new Error('active free style route must expose exactly one verified look');
for(const paidOnly of ['look.accessoryIds','altFor(','look.rentalShopCard.hangulTitle','look.photoRoute.map']){
 if(ui.includes(paidOnly))throw new Error(`free preview leaked paid-only detail: ${paidOnly}`);
}
for(const marker of ['3 Curated Looks Tailored to This Profile','koreanShopCardSummary','photoRoute.map','exact depth provided to paid clients']){
 if(!sample.includes(marker))throw new Error(`public paid-quality sample missing ${marker}`);
}
for(const marker of ['buildMyKoreaLookDeliverable','slice(0,3)','rentalShopCard','photoRoute','tradeOff','recommendedLocation']){
 if(!deliverable.includes(marker))throw new Error(`paid deliverable contract missing ${marker}`);
}

if(!ui.includes("colorSource:'manual'"))throw new Error('free style preview must remain local/manual');
if(ui.includes('fetch(')||ui.includes('/api/checkout')||ranking.includes('fetch(')||ranking.includes('/api/checkout'))throw new Error('free style preview must remain zero-network and checkout-free');
if(!ui.includes('navigator.clipboard?.writeText')||!ui.includes('URL.createObjectURL')||!ui.includes('localStorage.setItem'))throw new Error('copy/download/save recovery must survive free-preview boundary');
if(!page.includes('StyleConsultationV5'))throw new Error('live style route is not wired to the locale-native free preview');
console.log('My Korea Look free/paid boundary contract OK: free route exposes one concise look with locale-native result accessibility; public sample and paid deliverable preserve three-look depth');
