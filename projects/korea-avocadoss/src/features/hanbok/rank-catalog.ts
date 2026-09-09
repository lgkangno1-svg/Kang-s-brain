import {CURATED_LOOKS_CATALOG,type CuratedLook,type Season,type StyleId} from '@/lib/looks/catalog';
import type {HanbokMatcherColorId,HanbokPersonalColorContext,PersonalColorContrast,PersonalColorDepth} from './personal-color-bridge';

export type HanbokCatalogMood='elegant'|'royal'|'romantic'|'minimal'|'kdrama';
export type HanbokCatalogComfort='walking'|'balanced'|'photoFirst';
export type HanbokCatalogDestination='stoneWall'|'hyangwonjeong'|'bukchon';
export type HanbokCatalogSeason='springAutumn'|'summer'|'winter';

const COLOR_TO_UNDERTONE:Record<HanbokMatcherColorId,'warm'|'neutral'|'cool'>={jadeIvory:'warm',roseNavy:'neutral',moonBlue:'cool'};
const MOOD_TO_STYLE:Record<HanbokCatalogMood,StyleId>={romantic:'princess-prince',elegant:'queen-king',minimal:'queen-king',royal:'royal',kdrama:'royal'};
const COMFORT_TO_WALKING:Record<HanbokCatalogComfort,CuratedLook['walkingSuitability']>={walking:'easy',balanced:'moderate',photoFirst:'photo-focused'};

function seasonMatches(look:CuratedLook,season:HanbokCatalogSeason){
 if(look.seasons.includes('all-season'))return true;
 const expected:Season[]=season==='springAutumn'?['spring','autumn']:season==='summer'?['summer']:['winter'];
 return expected.some(candidate=>look.seasons.includes(candidate));
}
function destinationMatches(look:CuratedLook,destination:HanbokCatalogDestination){
 const haystack=`${look.recommendedLocation.name} ${look.recommendedLocation.koreanName}`.toLowerCase();
 if(destination==='hyangwonjeong')return haystack.includes('hyangwon')||haystack.includes('향원');
 if(destination==='stoneWall')return haystack.includes('geunjeong')||haystack.includes('gwanghwamun')||haystack.includes('근정')||haystack.includes('광화문');
 return haystack.includes('bukchon')||haystack.includes('북촌');
}

function extractHex(value:string){return value.match(/#[0-9a-f]{6}/i)?.[0]??null;}
function linearChannel(channel:number){const c=channel/255;return c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4;}
function relativeLuminance(hex:string){
 const normalized=hex.slice(1);const r=parseInt(normalized.slice(0,2),16),g=parseInt(normalized.slice(2,4),16),b=parseInt(normalized.slice(4,6),16);
 return 0.2126*linearChannel(r)+0.7152*linearChannel(g)+0.0722*linearChannel(b);
}
function paletteLuminances(look:CuratedLook){
 return [look.palette.top,look.palette.bottom,look.palette.accent].map(extractHex).filter((value):value is string=>Boolean(value)).map(relativeLuminance);
}
function depthBonus(look:CuratedLook,depth?:PersonalColorDepth){
 if(!depth)return 0;const values=paletteLuminances(look);if(!values.length)return 0;const average=values.reduce((sum,value)=>sum+value,0)/values.length;
 // Small aesthetic tie-breaker only. It must not override explicit style/trip choices.
 if(depth==='light')return average>=0.5?8:average>=0.3?4:0;
 if(depth==='deep')return average<=0.34?8:average<=0.52?4:0;
 return average>=0.25&&average<=0.62?8:4;
}
function contrastBonus(look:CuratedLook,contrast?:PersonalColorContrast){
 if(!contrast)return 0;const values=paletteLuminances(look);if(values.length<2)return 0;const spread=Math.max(...values)-Math.min(...values);
 // Contrast is likewise a low-weight visual-balance heuristic, not a diagnosis.
 if(contrast==='soft')return spread<=0.32?6:spread<=0.48?3:0;
 if(contrast==='high')return spread>=0.5?6:spread>=0.34?3:0;
 return spread>=0.22&&spread<=0.55?6:3;
}

export function rankHanbokCatalog(input:{color:HanbokMatcherColorId;mood:HanbokCatalogMood;comfort:HanbokCatalogComfort;destination:HanbokCatalogDestination;season:HanbokCatalogSeason;personalColor?:Pick<HanbokPersonalColorContext,'depth'|'contrast'>}){
 const preferredUndertone=COLOR_TO_UNDERTONE[input.color];
 const preferredStyle=MOOD_TO_STYLE[input.mood];
 const preferredWalking=COMFORT_TO_WALKING[input.comfort];
 return CURATED_LOOKS_CATALOG.map((look,index)=>{
  let score=0;
  if(look.styleId===preferredStyle)score+=38;
  if(look.palette.undertone===preferredUndertone||look.palette.undertone==='universal')score+=24;
  if(look.walkingSuitability===preferredWalking)score+=16;
  if(seasonMatches(look,input.season))score+=14;
  if(destinationMatches(look,input.destination))score+=8;
  score+=depthBonus(look,input.personalColor?.depth);
  score+=contrastBonus(look,input.personalColor?.contrast);
  return {look,score,index};
 }).sort((a,b)=>b.score-a.score||a.index-b.index);
}
