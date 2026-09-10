import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v4.tsx'),'utf8');
const engine=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');
const required=[
 "type StylePalette='jadeIvory'|'roseNavy'|'moonBlue'|'suggest'",
 "type StyleMood='elegant'|'royal'|'romantic'|'minimal'|'kdrama'",
 "type StyleComfort='walking'|'balanced'|'photoFirst'",
 "type StyleSeason='springAutumn'|'summer'|'winter'",
 "type StyleDestination='gyeongbokgung'|'bukchon'|'seochon'",
 "look.coverage!==input.coverage",
 "seasonFromVisitDate",
 "destinationScore",
 "paletteScore",
 "comfortScore",
 "moodScore"
];
for(const marker of required){if(!engine.includes(marker))throw new Error(`style engine missing ${marker}`);}
for(const marker of ['StyleConsultationV4','visitDate','setDestination','setPalette','setMood','setComfort','setCoverage','kc-my-korea-look-plan-v2','localStorage.setItem','navigator.clipboard','URL.createObjectURL','role="alert"','role="status"']){
 if(!ui.includes(marker))throw new Error(`style UI missing ${marker}`);
}
for(const locale of ["en:","'zh-CN':","ja:","'zh-TW':","vi:","th:"]){if(!ui.includes(locale))throw new Error(`style locale missing ${locale}`);}
if(!ui.includes("colorSource:'manual'"))throw new Error('free preview must stay manual/local and avoid remote photo processing');
if(ui.includes('fetch(')||ui.includes('/api/checkout'))throw new Error('free style input must remain zero-network and fail-closed for checkout');
if(!page.includes('StyleConsultationV4'))throw new Error('live style route is not wired to the full input experience');
if(!engine.includes("if(month===12||month<=2)return 'winter'")||!engine.includes("if(month>=6&&month<=8)return 'summer'"))throw new Error('visit-date seasonal mapping is incomplete');
console.log('My Korea Look full input contract OK');
