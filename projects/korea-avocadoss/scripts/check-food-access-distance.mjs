import fs from 'node:fs';

const core=fs.readFileSync(new URL('../src/lib/travel/gyeongbokgung-food-core.ts',import.meta.url),'utf8');
const data=fs.readFileSync(new URL('../src/lib/travel/gyeongbokgung-food.ts',import.meta.url),'utf8');
const ui=fs.readFileSync(new URL('../src/features/explore/FoodFinder.tsx',import.meta.url),'utf8');

const coreMarkers=["export type FoodSort='source-order'|'nearest-access'",'accessDistanceMeters?:number','accessDistanceBasis?:string','export function sortFoodPlaces','Number.POSITIVE_INFINITY'];
for(const marker of coreMarkers){if(!core.includes(marker))throw new Error(`food access core missing: ${marker}`);}

for(const marker of [
 "accessDistanceMeters:203",
 "accessDistanceMeters:261",
 "accessDistanceMeters:308",
 "accessDistanceMeters:468",
 "accessDistanceMeters:562",
 "accessDistanceMeters:1100",
 "Official Visit Seoul transportation field",
 "checkedAt:'2026-09-12'",
 "address:'1F, 15 Hyoja-ro, Jongno-gu, Seoul'"
]){if(!data.includes(marker))throw new Error(`food access provenance missing: ${marker}`);}

for(const marker of [
 "const SORT_KEY='kc-food-sort-v1'",
 "nearest:'Nearest official access distance'",
 "nearest:'官方交通距离最近'",
 "nearest:'公式アクセス距離が近い順'",
 "nearest:'官方交通距離最近'",
 "nearest:'Khoảng cách tiếp cận chính thức gần nhất'",
 "nearest:'ระยะทางเข้าถึงทางการที่ใกล้ที่สุด'",
 "value=\"nearest-access\"",
 'sortFoodPlaces(filterFoodPlaces(contentPlaces,category),sort)',
 'localStorage.setItem(SORT_KEY,next)',
 'place.accessDistanceBasis'
]){if(!ui.includes(marker))throw new Error(`food access UI/recovery missing: ${marker}`);}

for(const forbidden of ['navigator.geolocation','getCurrentPosition(','watchPosition(']){
 if(ui.includes(forbidden))throw new Error(`food access sorting must not request precise location: ${forbidden}`);
}

console.log('Food source-backed access-distance contract passed');
