import {CURATED_LOOKS_CATALOG,type Coverage,type CuratedLook,type GarmentType,type StyleId} from './catalog';

export type StylePalette='jadeIvory'|'roseNavy'|'moonBlue'|'suggest';
export type StyleMood='elegant'|'royal'|'romantic'|'minimal'|'kdrama';
export type StyleComfort='walking'|'balanced'|'photoFirst';
export type StyleSeason='springAutumn'|'summer'|'winter';
export type StyleDestination='gyeongbokgung'|'bukchon'|'seochon';
export type StyleColorSource='manual'|'local-preview';

export type StyleInputV1={
 version:1;
 locale:'en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
 style:StyleId;
 garment:GarmentType;
 palette:StylePalette;
 mood:StyleMood;
 comfort:StyleComfort;
 coverage:Coverage;
 season:StyleSeason;
 destination:StyleDestination;
 visitDate?:string;
 colorSource:StyleColorSource;
};

type RankedStyleLook=CuratedLook&{visualSrc:string;visualAlt:string};

const DATE_RE=/^\d{4}-\d{2}-\d{2}$/;
export function isValidVisitDate(value:string){
 if(!DATE_RE.test(value))return false;
 const [y,m,d]=value.split('-').map(Number);
 if(y<1900||y>2100||m<1||m>12||d<1||d>31)return false;
 const dt=new Date(Date.UTC(y,m-1,d));
 return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;
}

export function seasonFromVisitDate(value:string):StyleSeason|null{
 if(!isValidVisitDate(value))return null;
 const month=Number(value.slice(5,7));
 if(month===12||month<=2)return 'winter';
 if(month>=6&&month<=8)return 'summer';
 return 'springAutumn';
}

export function styleInputNeedsPaletteChoice(input:Pick<StyleInputV1,'palette'|'colorSource'>){
 return input.palette==='suggest'&&input.colorSource==='manual';
}

function paletteScore(look:CuratedLook,palette:StylePalette){
 if(palette==='suggest')return 0;
 const u=look.palette.undertone;
 if(palette==='jadeIvory')return u==='warm'||u==='universal'?25:u==='neutral'?12:0;
 if(palette==='roseNavy')return u==='cool'||u==='universal'?25:u==='neutral'?12:0;
 return u==='cool'||u==='neutral'||u==='universal'?25:0;
}
function seasonScore(look:CuratedLook,season:StyleSeason){
 if(look.seasons.includes('all-season'))return 15;
 if(season==='springAutumn')return look.seasons.includes('spring')||look.seasons.includes('autumn')?15:0;
 return look.seasons.includes(season)?15:0;
}
function comfortScore(look:CuratedLook,comfort:StyleComfort){
 if(comfort==='walking')return look.walkingSuitability==='easy'?20:look.walkingSuitability==='moderate'?8:0;
 if(comfort==='photoFirst')return look.walkingSuitability==='photo-focused'?20:look.walkingSuitability==='moderate'?10:4;
 return look.walkingSuitability==='moderate'?20:look.walkingSuitability==='easy'?14:10;
}
function moodScore(look:CuratedLook,mood:StyleMood){
 if(mood==='romantic')return look.styleId==='princess-prince'?12:0;
 if(mood==='royal')return look.styleId==='royal'?12:look.styleId==='queen-king'?6:0;
 if(mood==='elegant')return look.styleId==='queen-king'?12:look.styleId==='princess-prince'?5:0;
 if(mood==='minimal')return look.walkingSuitability==='easy'?12:4;
 return look.styleId==='queen-king'||look.styleId==='royal'?10:5;
}
function destinationScore(look:CuratedLook,destination:StyleDestination){
 // Editorial fit only; this is not an opening-hours, stock or booking claim.
 if(destination==='gyeongbokgung')return look.styleId==='royal'?10:look.styleId==='queen-king'?8:6;
 if(destination==='bukchon')return look.styleId==='princess-prince'?10:look.walkingSuitability==='easy'?8:5;
 return look.walkingSuitability==='easy'?10:look.styleId==='princess-prince'?7:5;
}

function withVisualAliases(look:CuratedLook):RankedStyleLook{
 return {...look,visualSrc:look.src,visualAlt:look.alt};
}

export function rankStyleInputV1(input:StyleInputV1){
 // BUILD_SPEC: "suggest" cannot invent a color direction. Until a valid local-preview
 // color source exists, the customer must explicitly choose one of the verified palettes.
 if(styleInputNeedsPaletteChoice(input))return [];
 const effectiveSeason=input.visitDate?seasonFromVisitDate(input.visitDate)??input.season:input.season;
 return CURATED_LOOKS_CATALOG.map((catalogLook,index)=>{
  const look=withVisualAliases(catalogLook);
  if(input.garment!=='either'&&look.garmentType!==input.garment)return{look,index,score:-1000};
  // Coverage is a minimum requirement: a more-covered look also satisfies "standard".
  // The stricter preference remains a hard filter and never returns standard-coverage looks.
  const coverageMismatch=look.coverage!==input.coverage;
  if(input.coverage==='more-coverage'&&coverageMismatch)return{look,index,score:-1000};
  const score=(look.styleId===input.style?30:0)+paletteScore(look,input.palette)+comfortScore(look,input.comfort)+seasonScore(look,effectiveSeason)+destinationScore(look,input.destination)+moodScore(look,input.mood);
  return{look,index,score};
 }).filter(x=>x.score>-1000).sort((a,b)=>b.score-a.score||a.look.id.localeCompare(b.look.id)||a.index-b.index);
}
