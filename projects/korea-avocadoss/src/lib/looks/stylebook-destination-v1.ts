import type {StyleDestination} from './style-input-v1';

export type StylebookDestinationStop={
 order:number;
 spotName:string;
 koreanName:string;
 minutes:number;
 photoTip:string;
};

export type StylebookDestinationPlan={
 destination:StyleDestination;
 name:string;
 koreanName:string;
 description:string;
 photoAngle:string;
 visitorNote:string;
 estimatedMinutes:number;
 mapQuery:string;
 sourceUrl:string;
 sourceLabel:string;
 checkedAt:string;
 route:readonly StylebookDestinationStop[];
};

const PLANS:Record<StyleDestination,StylebookDestinationPlan>={
 gyeongbokgung:{
  destination:'gyeongbokgung',
  name:'Gyeongbokgung Palace',
  koreanName:'경복궁',
  description:'A palace-focused route using broad courtyards, gates and pavilion sight lines. Palace access and closure rules must be checked for the selected visit date.',
  photoAngle:'Use open courtyard or pavilion sight lines and keep the full Hanbok silhouette clear of railings and crowd bottlenecks.',
  visitorNote:'Gyeongbokgung is normally closed on Tuesdays, with public-holiday closure shifts possible. Treat the route as planning guidance, not a live opening or admission guarantee.',
  estimatedMinutes:150,
  mapQuery:'Gyeongbokgung Palace Seoul',
  sourceUrl:'https://english.visitseoul.net/attractions/Gyeongbokgung/ENP000072',
  sourceLabel:'Visit Seoul · Gyeongbokgung Palace',
  checkedAt:'2026-09-13',
  route:[
   {order:1,spotName:'Gwanghwamun Gate approach',koreanName:'광화문',minutes:25,photoTip:'Start with a wide establishing frame before entering the busier inner courts.'},
   {order:2,spotName:'Geunjeongjeon courtyard',koreanName:'근정전 조정',minutes:45,photoTip:'Use the repeated stone and column lines for a centered full-length portrait.'},
   {order:3,spotName:'Gyeonghoeru or open palace garden sight line',koreanName:'경회루 일대',minutes:45,photoTip:'Use water, garden or pavilion depth when the area is accessible; do not imply special access.'},
   {order:4,spotName:'Exit and return buffer',koreanName:'퇴장·반납 여유',minutes:35,photoTip:'Keep the final block as walking and rental-return margin instead of scheduling another photo stop.'},
  ],
 },
 bukchon:{
  destination:'bukchon',
  name:'Bukchon Hanok Village',
  koreanName:'북촌한옥마을',
  description:'A residential hanok area where public-lane access, quiet behavior and resident privacy take priority over a staged photo route.',
  photoAngle:'Use wider public lanes and exterior hanok lines, keep doorways clear, and never photograph inside homes through open doors.',
  visitorNote:'Visit Seoul lists restricted-area visiting hours of 10:00–17:00 and asks visitors to practice silent tourism. This plan does not override on-site restrictions or resident-only signs.',
  estimatedMinutes:120,
  mapQuery:'Bukchon Hanok Village Seoul',
  sourceUrl:'https://english.visitseoul.net/attractions/Bukchon-Hanok-Village/ENP000261',
  sourceLabel:'Visit Seoul · Bukchon Hanok Village',
  checkedAt:'2026-09-13',
  route:[
   {order:1,spotName:'Bukchon Traditional Culture Center area',koreanName:'북촌문화센터 일대',minutes:30,photoTip:'Use the area as an orientation stop and keep pedestrian circulation clear.'},
   {order:2,spotName:'Public Gahoe-dong lanes',koreanName:'가회동 공공 골목',minutes:45,photoTip:'Choose a wider public lane, keep voices low and avoid resident entrances.'},
   {order:3,spotName:'Jeongdok Library area / lower public lanes',koreanName:'정독도서관 일대',minutes:30,photoTip:'Use a calmer public edge rather than concentrating around the most crowded residential viewpoints.'},
   {order:4,spotName:'Return buffer toward Anguk',koreanName:'안국 방향 이동 여유',minutes:15,photoTip:'Reserve time for walking out of the residential zone instead of adding an unverified stop.'},
  ],
 },
 seochon:{
  destination:'seochon',
  name:'Seochon Hanok Village',
  koreanName:'서촌',
  description:'A west-of-palace neighborhood route built around public alleys and the official Seoul walking-tour corridor rather than a single commercial venue.',
  photoAngle:'Use public alley walls, hanok exteriors or open valley approaches while preserving resident and pedestrian access.',
  visitorNote:'The official Seoul walking-tour reference is about three hours. Individual venues on the route can have separate opening days and hours, so verify any indoor stop before relying on it.',
  estimatedMinutes:180,
  mapQuery:'Seochon Hanok Village Seoul',
  sourceUrl:'https://english.visitseoul.net/PalaceArea/Seochon-Hanok-Village/ENN000624',
  sourceLabel:'Visit Seoul · Walk Along Seochon’s Old Alleys',
  checkedAt:'2026-09-13',
  route:[
   {order:1,spotName:'Gyeongbokgung Station Exit 3 / Seochon entry',koreanName:'경복궁역 3번 출구·서촌 입구',minutes:25,photoTip:'Use this as the orientation point before moving into narrower neighborhood streets.'},
   {order:2,spotName:'Sangchonjae area',koreanName:'상촌재 일대',minutes:40,photoTip:'Use public exterior viewpoints unless current venue access is independently confirmed.'},
   {order:3,spotName:'Suseongdong Valley direction',koreanName:'수성동계곡 방향',minutes:55,photoTip:'Favor open walking space and landscape depth; account for the uphill approach.'},
   {order:4,spotName:'Return through Seochon public alleys',koreanName:'서촌 공공 골목 복귀',minutes:60,photoTip:'Keep enough return margin and treat shops or indoor venues as optional, not guaranteed stops.'},
  ],
 },
};

export function getStylebookDestinationPlan(destination:StyleDestination):StylebookDestinationPlan{
 const plan=PLANS[destination];
 return {...plan,route:plan.route.map(stop=>({...stop}))};
}

export function stylebookDestinationMapUrl(plan:Pick<StylebookDestinationPlan,'mapQuery'>){
 return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.mapQuery)}`;
}
