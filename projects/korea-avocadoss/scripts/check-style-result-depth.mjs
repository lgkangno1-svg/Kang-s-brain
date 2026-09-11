import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v5.tsx'),'utf8');
const ranking=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');
for(const marker of ['Why this matches your choices','Color relationship','Accessories','Alternative colorway','evidence(look)','altFor(','look.palette.top','look.palette.bottom','look.palette.accent','look.accessoryIds','look.recommendedLocation.name','look.rentalShopCard.hangulStaffNote','look.photoRoute.map','look.creator','look.license','look.sourceUrl']){
 if(!ui.includes(marker))throw new Error(`style result depth missing ${marker}`);
}
for(const marker of ['input.style','input.palette','input.comfort','input.season','input.destination']){
 if(!ui.includes(marker))throw new Error(`style evidence is not linked to ${marker}`);
}
for(const locale of ["en:","'zh-CN':","ja:","'zh-TW':","vi:","th:"]){if(!ui.includes(locale))throw new Error(`style result copy missing locale ${locale}`);}
for(const marker of ['LABELS:Record<Locale','summary:(s,g,p)','evidenceStyle:','evidencePalette:','evidencePractical:','routeNote:']){if(!ui.includes(marker))throw new Error(`locale-native result layer missing ${marker}`);}
for(const marker of ['柔和王子/公主','やわらかい王子・姫','Hoàng tử / Công chúa nhẹ nhàng','เจ้าชาย/เจ้าหญิงโทนอ่อน']){if(!ui.includes(marker))throw new Error(`localized option/result vocabulary missing ${marker}`);}
for(const marker of ['RESULT_TERMS:Record<ResultLocale','ACCESSORY_TERMS:Record<ResultLocale','localizeLookForResult(','extractHex(','input.locale,index','accessoryIds:look.accessoryIds.map']){
 if(!ranking.includes(marker))throw new Error(`locale-native catalog display missing ${marker}`);
}
for(const localeMarker of ["'zh-CN':{look:'造型'","ja:{look:'ルック'","'zh-TW':{look:'造型'","vi:{look:'Look'","th:{look:'ลุค'"]){
 if(!ranking.includes(localeMarker))throw new Error(`catalog result localization missing ${localeMarker}`);
}
if(!ranking.includes("if(locale==='en')return {...look,...visual}"))throw new Error('English catalog display should preserve curated source wording');
if(!ranking.includes('extractHex(look.palette.top)')||!ranking.includes('extractHex(look.palette.bottom)')||!ranking.includes('extractHex(look.palette.accent)'))throw new Error('localized palette display must preserve exact source hex values');
if(!ui.includes("colorSource:'manual'"))throw new Error('free style preview must remain local/manual');
if(ui.includes('fetch(')||ui.includes('/api/checkout')||ranking.includes('fetch(')||ranking.includes('/api/checkout'))throw new Error('result-depth slice must remain zero-network and checkout-free');
if(!ui.includes('navigator.clipboard?.writeText')||!ui.includes('URL.createObjectURL')||!ui.includes('localStorage.setItem'))throw new Error('copy/download/save recovery must survive locale-native slice');
if(!page.includes('StyleConsultationV5'))throw new Error('live style route is not wired to locale-native result experience');
console.log('My Korea Look result-depth + locale-native catalog contract OK');
