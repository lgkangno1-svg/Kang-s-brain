import fs from 'node:fs';

const path='src/features/explore/GyeongbokgungPlannerV2.tsx';
const src=fs.readFileSync(path,'utf8');
const must=[
  "function walkingLegHref(from:Stop,to:Stop)",
  "https://www.google.com/maps/dir/?",
  "travelmode:'walking'",
  "mapPlace(from)",
  "mapPlace(to)",
  "timeline.map((stop,index)",
  "walkingLegHref(timeline[index-1],stop)",
  "target=\"_blank\"",
  "rel=\"noreferrer\"",
  "mapLeg:'Open this walking leg in Maps'",
  "mapNote:'Map links preserve each consecutive stop in your selected order.",
  "const WALKING_MINUTES:Record<string,number>",
  "'gwanghwamun>geunjeongjeon':7",
  "'geunjeongjeon>gyeonghoeru':6",
  "'gyeonghoeru>hyangwonjeong':12",
  "'hyangwonjeong>jibokjae':5",
  "function walkingMinutes(from:Stop,to:Stop)",
  "walkingTotal=legs.reduce<number>",
  "walkAfter:index===stops.length-1?0:(legs[index]??0)",
  "${c.walk}: ${stop.walkAfter} ${c.minutes}",
  "const VERIFIED_2026_HOLIDAY_OPEN_TUESDAYS=new Set(['2026-02-17','2026-05-05'])",
  "const VERIFIED_2026_SHIFTED_CLOSURES=new Set(['2026-02-19','2026-05-06'])",
  "function isClosedDay(date:string)",
  "if(VERIFIED_2026_SHIFTED_CLOSURES.has(date))return true",
  "if(VERIFIED_2026_HOLIDAY_OPEN_TUESDAYS.has(date))return false",
  "const closedDay=isClosedDay(date)",
  "const restoredClosed=isClosedDay(parsed.date)"
];
for(const token of must){if(!src.includes(token))throw new Error(`Missing palace map/walking/holiday contract: ${token}`);}
const localeSignals=['在地图中打开此段步行路线','この徒歩区間を地図で開く','在地圖中開啟此段步行路線','Mở chặng đi bộ này trong bản đồ','เปิดช่วงเดินนี้ในแผนที่'];
for(const token of localeSignals){if(!src.includes(token))throw new Error(`Missing localized palace map handoff copy: ${token}`);}
if(src.includes('const walk=8'))throw new Error('Palace planner must not use one fixed eight-minute walking buffer for every leg.');
if(src.includes('const closedDay=isTuesday(date)'))throw new Error('Palace planner must account for verified holiday-open Tuesdays and shifted closure dates.');
if(src.includes('const restoredClosed=isTuesday(parsed.date)'))throw new Error('Saved palace plans must revalidate shifted holiday closures on restore.');
if(src.includes('navigator.geolocation'))throw new Error('Palace map handoff must not require precise visitor geolocation.');
if(src.includes('maps.googleapis.com'))throw new Error('Palace map handoff must not add a Maps API request/key dependency.');
console.log('Gyeongbokgung walking map handoff + calibrated leg + holiday closure contract OK');
