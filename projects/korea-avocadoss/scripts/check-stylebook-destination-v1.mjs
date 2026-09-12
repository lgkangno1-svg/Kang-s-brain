import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const engine=fs.readFileSync(path.join(root,'src/lib/looks/stylebook-engine-v1.ts'),'utf8');
const destinations=fs.readFileSync(path.join(root,'src/lib/looks/stylebook-destination-v1.ts'),'utf8');
const spec=fs.readFileSync(path.join(root,'docs/BUILD_SPEC.md'),'utf8');
const fail=(message)=>{console.error(`Stylebook destination v1 check failed: ${message}`);process.exit(1);};

for(const destination of ["gyeongbokgung:{","bukchon:{","seochon:{"]){
 if(!destinations.includes(destination))fail(`missing destination plan: ${destination}`);
}
for(const marker of [
 "checkedAt:'2026-09-13'",
 "sourceUrl:'https://english.visitseoul.net/attractions/Gyeongbokgung/ENP000072'",
 "sourceUrl:'https://english.visitseoul.net/attractions/Bukchon-Hanok-Village/ENP000261'",
 "sourceUrl:'https://english.visitseoul.net/PalaceArea/Seochon-Hanok-Village/ENN000624'",
 'estimatedMinutes:150',
 'estimatedMinutes:120',
 'estimatedMinutes:180',
 'route:[',
 'stylebookDestinationMapUrl',
]){
 if(!destinations.includes(marker))fail(`missing source-backed destination marker: ${marker}`);
}
if((destinations.match(/checkedAt:'2026-09-13'/g)??[]).length!==3)fail('all three destinations must carry an explicit checked-at date');
if((destinations.match(/sourceUrl:'https:\/\/english\.visitseoul\.net/g)??[]).length!==3)fail('all destination plans must use source-checked Visit Seoul references');

for(const marker of [
 "getStylebookDestinationPlan(input.destination)",
 'destinationPlan:{',
 'destination:destination.destination',
 'mapUrl:stylebookDestinationMapUrl(destination)',
 'source:{url:destination.sourceUrl,label:destination.sourceLabel,checkedAt:destination.checkedAt}',
 'name:destination.name',
 'koreanName:destination.koreanName',
 'photoRoute:destination.route.map',
]){
 if(!engine.includes(marker))fail(`paid stylebook does not bind output to selected destination: ${marker}`);
}
if(engine.includes('recommendedLocation:{...look.recommendedLocation}'))fail('paid output must not silently recommend a different catalog location than the selected destination');

for(const phrase of ['실제 장소 1개, 출처/확인일','2~3시간을 쓰는 3~4개 정류장','실시간 영업/예약 가능이라고 주장하지 않는다']){
 if(!spec.includes(phrase))fail(`active BUILD_SPEC destination requirement missing: ${phrase}`);
}
for(const forbidden of ['fetch(','stripe','/api/checkout','localStorage','sessionStorage']){
 if(destinations.toLowerCase().includes(forbidden.toLowerCase()))fail(`destination facts must remain deterministic and infrastructure-free: ${forbidden}`);
}

console.log('My Korea Look destination plan v1: OK — selected destination drives a source-dated 2–3h route and look location without live availability claims');
