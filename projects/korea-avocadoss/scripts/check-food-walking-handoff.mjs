import fs from 'node:fs';

const source=fs.readFileSync(new URL('../src/features/explore/FoodFinder.tsx',import.meta.url),'utf8');
const required=[
 "const GYEONGBOKGUNG_ORIGIN='Gwanghwamun Gate, Gyeongbokgung Palace, Seoul'",
 'https://www.google.com/maps/dir/?api=1&origin=',
 '&destination=',
 '&travelmode=walking',
 'href={walkingHref(place.name,place.address)}',
 "walking:'Walk from Gyeongbokgung'",
 "walking:'从景福宫步行前往'",
 "walking:'景福宮から徒歩ルート'",
 "walking:'從景福宮步行前往'",
 "walking:'Đi bộ từ Gyeongbokgung'",
 "walking:'เดินจากพระราชวังคยองบกกุง'"
];
for(const marker of required){if(!source.includes(marker))throw new Error(`food walking handoff missing: ${marker}`);}
for(const forbidden of ['navigator.geolocation','getCurrentPosition(','watchPosition(','fetch(']){
 if(source.includes(forbidden))throw new Error(`food walking handoff must stay zero-location/zero-fetch: ${forbidden}`);
}
console.log('Food walking handoff contract passed');
