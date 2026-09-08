import {CURATED_LOOKS_CATALOG,type CuratedLook,type GarmentType,type Season,type StyleId} from './catalog';

export type LookUndertone='warm'|'cool'|'neutral';
export type LookPriority='photo'|'walking'|'balanced';
export type KoreaLookInput={
 style:StyleId;
 garment:GarmentType;
 tone:LookUndertone;
 priority:LookPriority;
 season:Season;
};

export function scoreCuratedLook(look:CuratedLook,input:KoreaLookInput){
 if(input.garment!=='either'&&look.garmentType!==input.garment)return -1000;
 let score=0;
 if(look.styleId===input.style)score+=45;
 if(look.palette.undertone===input.tone||look.palette.undertone==='universal')score+=25;
 if(look.seasons.includes(input.season)||look.seasons.includes('all-season'))score+=15;
 if(input.priority==='walking'&&look.walkingSuitability==='easy')score+=15;
 if(input.priority==='photo'&&look.walkingSuitability==='photo-focused')score+=15;
 if(input.priority==='balanced'&&look.walkingSuitability==='moderate')score+=12;
 return score;
}

export function rankCuratedLooks(input:KoreaLookInput){
 return CURATED_LOOKS_CATALOG.map((look,index)=>({look,score:scoreCuratedLook(look,input),index}))
  .filter(item=>item.score>-1000)
  .sort((a,b)=>b.score-a.score||a.index-b.index);
}
