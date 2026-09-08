import {CURATED_LOOKS_CATALOG,type CuratedLook,type Season,type StyleId} from '@/lib/looks/catalog';
import type {HanbokMatcherColorId} from './personal-color-bridge';

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

export function rankHanbokCatalog(input:{color:HanbokMatcherColorId;mood:HanbokCatalogMood;comfort:HanbokCatalogComfort;destination:HanbokCatalogDestination;season:HanbokCatalogSeason}){
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
  return {look,score,index};
 }).sort((a,b)=>b.score-a.score||a.index-b.index);
}
