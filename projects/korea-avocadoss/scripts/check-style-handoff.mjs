import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const bridge=fs.readFileSync(path.join(root,'src/lib/looks/style-handoff.ts'),'utf8');
const hanbok=fs.readFileSync(path.join(root,'src/features/hanbok/hanbok-matcher.tsx'),'utf8');
const style=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v5.tsx'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');

for(const marker of [
 "from:'hanbok'","palette:input.palette","destination:styleDestinationFromHanbok(input.destination)",
 "value==='bukchon'?'bukchon':'gyeongbokgung'","COLOR_SOURCES","if(!palette||!colorSource)return null"
])if(!bridge.includes(marker))throw new Error(`style handoff core missing ${marker}`);

for(const marker of [
 "buildStyleHandoffQuery","const [colorSource,setColorSource]","setColorSource('local-preview')",
 "setColorSource('manual')","const styleHref=useMemo","<Link href={styleHref}"
])if(!hanbok.includes(marker))throw new Error(`hanbok style handoff missing ${marker}`);

for(const marker of [
 "initialHandoff?:StyleHandoff|null","initialHandoff?.palette","initialHandoff?.mood","initialHandoff?.comfort",
 "initialHandoff?.season","initialHandoff?.destination","initialHandoff?.colorSource","setColorSource(parsed.colorSource)",
 "['manual','local-preview'].includes(String(x.colorSource))","colorSource==='local-preview'","setColorSource('manual')"
])if(!style.includes(marker))throw new Error(`style handoff recovery missing ${marker}`);

for(const phrase of [
 'No photo was transferred.','没有传输照片','写真は転送されていません','沒有傳送照片','Không có ảnh nào được chuyển','ไม่มีการส่งรูปภาพ'
])if(!style.includes(phrase))throw new Error(`localized local-color privacy copy missing ${phrase}`);

for(const marker of ['parseStyleHandoff','searchParams:Promise','initialHandoff=parseStyleHandoff(query)','initialHandoff={initialHandoff}']){
 if(!page.includes(marker))throw new Error(`style server handoff boundary missing ${marker}`);
}

if(bridge.includes('fetch(')||hanbok.includes('/api/checkout')||style.includes('/api/checkout'))throw new Error('style handoff must stay zero-network and checkout-free');
for(const forbidden of ['photo:','photoUrl','image:','imageUrl','file:','fileName','fileUrl','dataUrl','base64','blob:']){
 if(bridge.includes(forbidden))throw new Error(`style handoff core must not carry binary/media field ${forbidden}`);
}
console.log('Hanbok → My Korea Look handoff contract OK');
