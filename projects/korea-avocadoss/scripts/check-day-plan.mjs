import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const core=fs.readFileSync(path.join(root,'src/lib/travel/korea-day-plan.ts'),'utf8');
const ui=fs.readFileSync(path.join(root,'src/features/explore/KoreaDayPlanner.tsx'),'utf8');
const route=fs.readFileSync(path.join(root,'src/app/[locale]/explore/day-plan/page.tsx'),'utf8');
const palace=fs.readFileSync(path.join(root,'src/app/[locale]/explore/gyeongbokgung/page.tsx'),'utf8');
const seo=fs.readFileSync(path.join(root,'src/lib/seo/localized-metadata.ts'),'utf8');

const coreRequired=[
 'gyeongbokgungVisitFacts(input.date)',
 "warnings.push('palace-closed')",
 "warnings.push('after-last-admission')",
 "warnings.push('past-closing')",
 'hanbokRentalAvailabilityAt',
 "warnings.push('rental-closed')",
 'foodAvailabilityAt',
 'foodSourceFreshness',
 "warnings.push('food-unavailable')",
 '45 min fitting + conservative 15 min walk/entry buffer',
 'walking + garment return buffer',
 'export function dayPlanFoodMapHref'
];
const uiRequired=[
 'Build my Korea day',
 'GYEONGBOKGUNG_HANBOK_RENTALS.map',
 'buildKoreaDayPlan',
 'plan.warnings.map',
 'hanbokRentalToPalaceDirectionsHref',
 'dayPlanFoodMapHref',
 "href={`/explore/gyeongbokgung?date=${encodeURIComponent(date)}&time=${encodeURIComponent(entry)}`}",
 'No AI API, booking API or location tracking is used.'
];
const routeRequired=['KoreaDayPlanner','localizedAlternates',"'/explore/day-plan'"];
const missing=[...coreRequired.filter(x=>!core.includes(x)).map(x=>`core:${x}`),...uiRequired.filter(x=>!ui.includes(x)).map(x=>`ui:${x}`),...routeRequired.filter(x=>!route.includes(x)).map(x=>`route:${x}`)];
if(missing.length){console.error(`Day-plan contract failed. Missing ${missing.join(', ')}`);process.exit(1);}
if(!palace.includes('href="/explore/day-plan"')){console.error('Day-plan contract failed: Gyeongbokgung page does not expose the integrated planner.');process.exit(1);}
if(!seo.includes("'/explore/day-plan'")){console.error('Day-plan contract failed: localized public SEO path is missing.');process.exit(1);}
if(/fetch\(|XMLHttpRequest|navigator\.geolocation/.test(core)){console.error('Day-plan core must remain deterministic and network/geolocation free.');process.exit(1);}
console.log('Integrated Hanbok → palace → food day-plan contracts passed.');
