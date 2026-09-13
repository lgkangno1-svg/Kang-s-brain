import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const ui=fs.readFileSync(path.join(root,'src/features/looks/style-consultation-v5.tsx'),'utf8');
const inputMode=fs.readFileSync(path.join(root,'src/features/looks/style-input-mode-choice.tsx'),'utf8');
const engine=fs.readFileSync(path.join(root,'src/lib/looks/style-input-v1.ts'),'utf8');
const catalog=fs.readFileSync(path.join(root,'src/lib/looks/catalog.ts'),'utf8');
const page=fs.readFileSync(path.join(root,'src/app/[locale]/style/page.tsx'),'utf8');
const required=[
 "type StylePalette='jadeIvory'|'roseNavy'|'moonBlue'|'suggest'",
 "type StyleMood='elegant'|'royal'|'romantic'|'minimal'|'kdrama'",
 "type StyleComfort='walking'|'balanced'|'photoFirst'",
 "type StyleSeason='springAutumn'|'summer'|'winter'",
 "type StyleDestination='gyeongbokgung'|'bukchon'|'seochon'",
 "const coverageMismatch=look.coverage!==input.coverage",
 "input.coverage==='more-coverage'&&coverageMismatch",
 "seasonFromVisitDate",
 "destinationScore",
 "paletteScore",
 "comfortScore",
 "moodScore"
];
for(const marker of required){if(!engine.includes(marker))throw new Error(`style engine missing ${marker}`);}
for(const marker of ['StyleConsultationV5','visitDate','setDestination','setPalette','setMood','setComfort','setCoverage','kc-my-korea-look-plan-v2','localStorage.setItem','navigator.clipboard','URL.createObjectURL','role="alert"','role="status"']){
 if(!ui.includes(marker))throw new Error(`style UI missing ${marker}`);
}
for(const locale of ["en:","'zh-CN':","ja:","'zh-TW':","vi:","th:"]){if(!ui.includes(locale))throw new Error(`style locale missing ${locale}`);}
if(!ui.includes("useState<Coverage>('standard')"))throw new Error('default style preview must retain the standard minimum-coverage preference');
const catalogLooks=(catalog.match(/\n\s+coverage: '(?:standard|more-coverage)'/g)??[]).length;
const moreCoverageLooks=(catalog.match(/\n\s+coverage: 'more-coverage'/g)??[]).length;
if(catalogLooks<3)throw new Error('verified catalog cannot produce a default three-look plan');
if(moreCoverageLooks<3)throw new Error('strict more-coverage preference cannot produce three verified looks');
for(const marker of ["initialHandoff?.colorSource??'manual'","['manual','local-preview'].includes(String(x.colorSource))","setColorSource('manual')"]){
 if(!ui.includes(marker))throw new Error(`free preview color provenance contract missing ${marker}`);
}
if(ui.includes('fetch(')||ui.includes('/api/checkout'))throw new Error('free style input must remain zero-network and fail-closed for checkout');
if(!page.includes('StyleConsultationV5'))throw new Error('live style route is not wired to the full input experience');
if(!page.includes('StyleInputModeChoice'))throw new Error('live style route must explain photo/no-photo boundaries before paid entry');
for(const marker of ["noPhoto:'Without a photo'","photo:'Use browser-local Personal Color'","href=\"/color\"","preference-based and does not claim photo analysis","Secure paid photo styling is not available until private account, storage, consent and fulfillment infrastructure is verified."]){
 if(!inputMode.includes(marker))throw new Error(`style input-method boundary missing ${marker}`);
}
for(const locale of ["en:","'zh-CN':","ja:","'zh-TW':","vi:","th:"]){if(!inputMode.includes(locale))throw new Error(`style input-method locale missing ${locale}`);}
if(inputMode.includes('type="radio"')||inputMode.includes('name="style-input-mode"')||inputMode.includes("useState<Mode>"))throw new Error('style input-method comparison must not expose an inert mode selector');
if(inputMode.includes('fetch(')||inputMode.includes('/api/checkout')||inputMode.includes('type="file"'))throw new Error('style input-method boundary must not upload photos or open checkout');
if(!engine.includes("if(month===12||month<=2)return 'winter'")||!engine.includes("if(month>=6&&month<=8)return 'summer'"))throw new Error('visit-date seasonal mapping is incomplete');
console.log('My Korea Look full input contract OK');
