import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v4.tsx'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');
for(const marker of ['Why this matches your choices','Color relationship','Accessories','Alternative colorway','evidence(look)','altFor(','look.palette.top','look.palette.bottom','look.palette.accent','look.accessoryIds','look.recommendedLocation.name','look.tradeOff','look.rentalShopCard.hangulStaffNote','look.photoRoute.map','look.creator','look.license','look.sourceUrl']){
 if(!ui.includes(marker))throw new Error(`style result depth missing ${marker}`);
}
for(const marker of ['input.style','input.palette','input.comfort','input.season','input.destination']){
 if(!ui.includes(marker))throw new Error(`style evidence is not linked to ${marker}`);
}
for(const locale of ["en:","'zh-CN':","ja:","'zh-TW':","vi:","th:"]){
 if(!ui.includes(locale))throw new Error(`style result copy missing locale ${locale}`);
}
if(!ui.includes("colorSource:'manual'"))throw new Error('free style preview must remain local/manual');
if(ui.includes('fetch(')||ui.includes('/api/checkout'))throw new Error('result-depth slice must remain zero-network and checkout-free');
if(!ui.includes('navigator.clipboard?.writeText')||!ui.includes('URL.createObjectURL')||!ui.includes('localStorage.setItem'))throw new Error('copy/download/save recovery must survive result-depth slice');
if(!page.includes('StyleConsultationV4'))throw new Error('live style route is not wired to result-depth experience');
console.log('My Korea Look result-depth contract OK');
