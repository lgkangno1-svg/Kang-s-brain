import type {StyleInputV1,StyleComfort,StyleDestination,StyleMood,StylePalette,StyleSeason} from './style-input-v1';

export type StyleHandoff={
 palette:Exclude<StylePalette,'suggest'>;
 mood?:StyleMood;
 comfort?:StyleComfort;
 season?:StyleSeason;
 destination?:StyleDestination;
 colorSource:StyleInputV1['colorSource'];
};

type SearchParams=Record<string,string|string[]|undefined>;

const PALETTES:readonly StyleHandoff['palette'][]=['jadeIvory','roseNavy','moonBlue'];
const MOODS:readonly StyleMood[]=['elegant','royal','romantic','minimal','kdrama'];
const COMFORTS:readonly StyleComfort[]=['walking','balanced','photoFirst'];
const SEASONS:readonly StyleSeason[]=['springAutumn','summer','winter'];
const DESTINATIONS:readonly StyleDestination[]=['gyeongbokgung','bukchon','seochon'];
const COLOR_SOURCES:readonly StyleInputV1['colorSource'][]=['manual','local-preview'];

function single(value:string|string[]|undefined){return typeof value==='string'?value:undefined;}
function allowed<T extends string>(value:string|undefined,values:readonly T[]):T|undefined{return value&&values.includes(value as T)?value as T:undefined;}

export function parseStyleHandoff(params:SearchParams):StyleHandoff|null{
 if(single(params.from)!=='hanbok')return null;
 const palette=allowed(single(params.palette),PALETTES);
 const colorSource=allowed(single(params.colorSource),COLOR_SOURCES);
 if(!palette||!colorSource)return null;
 return{
  palette,
  colorSource,
  mood:allowed(single(params.mood),MOODS),
  comfort:allowed(single(params.comfort),COMFORTS),
  season:allowed(single(params.season),SEASONS),
  destination:allowed(single(params.destination),DESTINATIONS),
 };
}

export function styleDestinationFromHanbok(value:'stoneWall'|'hyangwonjeong'|'bukchon'):StyleDestination{
 return value==='bukchon'?'bukchon':'gyeongbokgung';
}

export function buildStyleHandoffQuery(input:{
 palette:StyleHandoff['palette'];
 mood:StyleMood;
 comfort:StyleComfort;
 season:StyleSeason;
 destination:'stoneWall'|'hyangwonjeong'|'bukchon';
 colorSource:StyleInputV1['colorSource'];
}){
 const params=new URLSearchParams({
  from:'hanbok',palette:input.palette,mood:input.mood,comfort:input.comfort,season:input.season,
  destination:styleDestinationFromHanbok(input.destination),colorSource:input.colorSource,
 });
 return`/style?${params.toString()}`;
}
