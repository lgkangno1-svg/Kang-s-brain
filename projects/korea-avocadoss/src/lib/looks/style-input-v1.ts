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
type ResultLocale=StyleInputV1['locale'];

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

const RESULT_TERMS:Record<ResultLocale,{look:string;visual:string;top:string;bottom:string;accent:string;accessory:string;style:Record<StyleId,string>;garment:Record<GarmentType,string>}>= {
 en:{look:'Look',visual:'Reference photo',top:'Top',bottom:'Bottom',accent:'Accent',accessory:'Accessory',style:{'princess-prince':'Princess / Prince','queen-king':'Queen / King',royal:'Royal'},garment:{chima:'Chima',baji:'Baji',either:'Hanbok'}},
 'zh-CN':{look:'造型',visual:'参考照片',top:'上装',bottom:'下装',accent:'点缀',accessory:'配饰',style:{'princess-prince':'王子 / 公主风','queen-king':'王后 / 国王风',royal:'宫廷王室风'},garment:{chima:'裙装韩服',baji:'裤装韩服',either:'韩服'}},
 ja:{look:'ルック',visual:'参考写真',top:'上衣',bottom:'ボトム',accent:'差し色',accessory:'小物',style:{'princess-prince':'王子 / 姫スタイル','queen-king':'王妃 / 王スタイル',royal:'王室スタイル'},garment:{chima:'チマ韓服',baji:'パジ韓服',either:'韓服'}},
 'zh-TW':{look:'造型',visual:'參考照片',top:'上身',bottom:'下身',accent:'點綴',accessory:'配件',style:{'princess-prince':'王子 / 公主風','queen-king':'王后 / 國王風',royal:'宮廷王室風'},garment:{chima:'裙裝韓服',baji:'褲裝韓服',either:'韓服'}},
 vi:{look:'Look',visual:'Ảnh tham khảo',top:'Áo',bottom:'Phần dưới',accent:'Điểm nhấn',accessory:'Phụ kiện',style:{'princess-prince':'Hoàng tử / Công chúa','queen-king':'Hoàng hậu / Quốc vương',royal:'Hoàng gia'},garment:{chima:'Hanbok chima',baji:'Hanbok baji',either:'Hanbok'}},
 th:{look:'ลุค',visual:'ภาพอ้างอิง',top:'ท่อนบน',bottom:'ท่อนล่าง',accent:'สีเน้น',accessory:'เครื่องประดับ',style:{'princess-prince':'เจ้าชาย / เจ้าหญิง','queen-king':'ราชินี / กษัตริย์',royal:'ราชสำนัก'},garment:{chima:'ฮันบกชิมา',baji:'ฮันบกบาจี',either:'ฮันบก'}},
};

const ACCESSORY_TERMS:Record<ResultLocale,Record<string,string>>={
 en:{daenggi:'Daenggi ribbon',norigae:'Norigae',binyeo:'Binyeo hairpin',gat:'Gat hat',jokduri:'Jokduri',belt:'Belt',pouch:'Pouch',hairpin:'Hairpin',fan:'Fan',crown:'Crown',shoes:'Shoes'},
 'zh-CN':{daenggi:'缎带发饰（Daenggi）',norigae:'韩服垂饰（Norigae）',binyeo:'发簪（Binyeo）',gat:'传统笠帽（Gat）',jokduri:'传统礼冠（Jokduri）',belt:'腰带',pouch:'香囊 / 小袋',hairpin:'发簪',fan:'扇子',crown:'礼冠',shoes:'鞋履'},
 ja:{daenggi:'テンギ（髪飾り）',norigae:'ノリゲ',binyeo:'ピニョ（かんざし）',gat:'カッ（伝統帽）',jokduri:'チョクトゥリ',belt:'帯',pouch:'巾着',hairpin:'髪飾り',fan:'扇子',crown:'冠',shoes:'履物'},
 'zh-TW':{daenggi:'緞帶髮飾（Daenggi）',norigae:'韓服垂飾（Norigae）',binyeo:'髮簪（Binyeo）',gat:'傳統笠帽（Gat）',jokduri:'傳統禮冠（Jokduri）',belt:'腰帶',pouch:'香囊 / 小袋',hairpin:'髮簪',fan:'扇子',crown:'禮冠',shoes:'鞋履'},
 vi:{daenggi:'Dải tóc Daenggi',norigae:'Norigae',binyeo:'Trâm Binyeo',gat:'Mũ Gat',jokduri:'Mũ Jokduri',belt:'Thắt lưng',pouch:'Túi nhỏ',hairpin:'Trâm tóc',fan:'Quạt',crown:'Mũ lễ',shoes:'Giày'},
 th:{daenggi:'ริบบิ้นผม Daenggi',norigae:'เครื่องห้อย Norigae',binyeo:'ปิ่น Binyeo',gat:'หมวก Gat',jokduri:'หมวกพิธี Jokduri',belt:'เข็มขัด',pouch:'ถุงผ้า',hairpin:'ปิ่นผม',fan:'พัด',crown:'มงกุฎพิธี',shoes:'รองเท้า'},
};

function extractHex(value:string){return /#[0-9A-Fa-f]{6}/.exec(value)?.[0]??value;}
function localizeAccessory(locale:ResultLocale,id:string,index:number){
 if(locale==='en')return id.split('-').join(' ');
 const terms=ACCESSORY_TERMS[locale];
 for(const [needle,label] of Object.entries(terms)){if(id.includes(needle)||id.includes(needle==='norigae'?'norige':'__none__'))return label;}
 return `${RESULT_TERMS[locale].accessory} ${index+1}`;
}
function localizeVisualAlt(look:CuratedLook,locale:ResultLocale){
 if(locale==='en')return look.alt;
 const terms=RESULT_TERMS[locale];
 return `${terms.visual}: ${terms.style[look.styleId]} · ${terms.garment[look.garmentType]}`;
}
function localizeLookForResult(look:CuratedLook,locale:ResultLocale,index:number):RankedStyleLook{
 const visual={visualSrc:look.src,visualAlt:localizeVisualAlt(look,locale)};
 if(locale==='en')return {...look,...visual};
 const terms=RESULT_TERMS[locale];
 return {
  ...look,
  ...visual,
  title:`${terms.style[look.styleId]} · ${terms.garment[look.garmentType]} · ${terms.look} ${index+1}`,
  palette:{...look.palette,top:`${terms.top} ${extractHex(look.palette.top)}`,bottom:`${terms.bottom} ${extractHex(look.palette.bottom)}`,accent:`${terms.accent} ${extractHex(look.palette.accent)}`},
  accessoryIds:look.accessoryIds.map((id,i)=>localizeAccessory(locale,id,i)),
 };
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

export function rankStyleInputV1(input:StyleInputV1){
 // BUILD_SPEC: "suggest" cannot invent a color direction. Until a valid local-preview
 // color source exists, the customer must explicitly choose one of the verified palettes.
 if(styleInputNeedsPaletteChoice(input))return [];
 const effectiveSeason=input.visitDate?seasonFromVisitDate(input.visitDate)??input.season:input.season;
 return CURATED_LOOKS_CATALOG.map((catalogLook,index)=>{
  const look=localizeLookForResult(catalogLook,input.locale,index);
  if(input.garment!=='either'&&look.garmentType!==input.garment)return{look,index,score:-1000};
  // Coverage is a minimum requirement: a more-covered look also satisfies "standard".
  // The stricter preference remains a hard filter and never returns standard-coverage looks.
  const coverageMismatch=look.coverage!==input.coverage;
  if(input.coverage==='more-coverage'&&coverageMismatch)return{look,index,score:-1000};
  const score=(look.styleId===input.style?30:0)+paletteScore(look,input.palette)+comfortScore(look,input.comfort)+seasonScore(look,effectiveSeason)+destinationScore(look,input.destination)+moodScore(look,input.mood);
  return{look,index,score};
 }).filter(x=>x.score>-1000).sort((a,b)=>b.score-a.score||a.look.id.localeCompare(b.look.id)||a.index-b.index);
}