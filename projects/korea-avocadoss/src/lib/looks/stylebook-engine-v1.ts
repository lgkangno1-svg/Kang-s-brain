import {
  rankStyleInputV1,
  seasonFromVisitDate,
  styleInputNeedsPaletteChoice,
  type StyleInputV1,
  type StyleSeason,
} from './style-input-v1';
import {getStylebookDestinationPlan,stylebookDestinationMapUrl} from './stylebook-destination-v1';

export const MY_KOREA_LOOK_STYLEBOOK_VERSION='my-korea-look-stylebook-v1';
export const MY_KOREA_LOOK_MAX_SUCCESSFUL_REVISIONS=1;

export type StylebookBuildErrorCode=
  | 'PALETTE_CHOICE_REQUIRED'
  | 'NOT_ENOUGH_ELIGIBLE_LOOKS'
  | 'REVISION_LIMIT_REACHED'
  | 'EMPTY_REVISION';

export class StylebookBuildError extends Error{
  readonly code:StylebookBuildErrorCode;
  constructor(code:StylebookBuildErrorCode,message:string){super(message);this.name='StylebookBuildError';this.code=code;}
}

export type StylebookRevisionPatch=Partial<Pick<StyleInputV1,
  'style'|'garment'|'palette'|'mood'|'comfort'|'coverage'|'season'|'destination'|'visitDate'
>>;

export type MyKoreaLookStylebook={
  schemaVersion:typeof MY_KOREA_LOOK_STYLEBOOK_VERSION;
  productKey:'my_korea_look_v1';
  generatedAt:string;
  revision:{sequence:0|1;parentGeneratedAt?:string;successfulRevisionsUsed:0|1};
  inputSnapshot:StyleInputV1;
  effectiveSeason:StyleSeason;
  personalizationBasis:'explicit-preferences'|'local-color-preview-plus-preferences';
  destinationPlan:{
    destination:StyleInputV1['destination'];
    name:string;
    koreanName:string;
    description:string;
    photoAngle:string;
    visitorNote:string;
    estimatedMinutes:number;
    mapUrl:string;
    source:{url:string;label:string;checkedAt:string};
    route:Array<{order:number;spotName:string;koreanName:string;minutes:number;photoTip:string}>;
  };
  looks:Array<{
    rank:1|2|3;
    lookId:string;
    visual:{src:string;alt:string;kind:'reference-photo'|'style-illustration'};
    title:string;
    tagline:string;
    description:string;
    garmentType:string;
    coverage:string;
    palette:{top:string;bottom:string;accent:string;undertone:string;description:string};
    accessories:string[];
    reasons:[string,string,string];
    tradeOff:string;
    alternateColorway:{sourceLookId:string;top:string;bottom:string;accent:string;undertone:string};
    recommendedLocation:{name:string;koreanName:string;description:string;photoAngle:string};
    rentalShopCard:{hangulTitle:string;hangulStaffNote:string;englishExplanation:string};
    photoRoute:Array<{order:number;spotName:string;koreanName:string;bestTime:string;photoTip:string}>;
    source:{url:string;creator:string;license:string;licenseUrl:string;checkedAt:string};
  }>;
};

const REASON_COPY:Record<StyleInputV1['locale'],{
  style:(style:string,mood:string)=>string;
  palette:(palette:string,undertone:string)=>string;
  practical:(comfort:string,coverage:string,season:string,destination:string)=>string;
}>={
  en:{
    style:(style,mood)=>`Your ${style} style family and ${mood} mood both support this direction.`,
    palette:(palette,undertone)=>`Your ${palette} color choice is compatible with this look's ${undertone} undertone.`,
    practical:(comfort,coverage,season,destination)=>`${comfort} comfort, ${coverage} coverage, ${season} timing and ${destination} destination were all included in ranking.`,
  },
  'zh-CN':{
    style:(style,mood)=>`你选择的${style}风格与${mood}氛围都支持这一造型方向。`,
    palette:(palette,undertone)=>`你选择的${palette}配色与这套造型的${undertone}色温方向兼容。`,
    practical:(comfort,coverage,season,destination)=>`排序同时考虑了${comfort}舒适度、${coverage}遮盖度、${season}季节与${destination}目的地。`,
  },
  ja:{
    style:(style,mood)=>`選択した${style}の系統と${mood}のムードが、この方向性に合っています。`,
    palette:(palette,undertone)=>`${palette}の配色希望は、このルックの${undertone}アンダートーンと両立します。`,
    practical:(comfort,coverage,season,destination)=>`${comfort}の快適さ、${coverage}のカバー範囲、${season}、${destination}をまとめて順位付けに反映しました。`,
  },
  'zh-TW':{
    style:(style,mood)=>`你選擇的${style}風格與${mood}氛圍都支持這個造型方向。`,
    palette:(palette,undertone)=>`你選擇的${palette}配色與此造型的${undertone}色溫方向相容。`,
    practical:(comfort,coverage,season,destination)=>`排序同時考量${comfort}舒適度、${coverage}遮蓋度、${season}季節與${destination}目的地。`,
  },
  vi:{
    style:(style,mood)=>`Nhóm phong cách ${style} và không khí ${mood} bạn chọn đều hỗ trợ hướng phối này.`,
    palette:(palette,undertone)=>`Bảng màu ${palette} bạn chọn tương thích với undertone ${undertone} của look này.`,
    practical:(comfort,coverage,season,destination)=>`Xếp hạng đã tính đồng thời ${comfort}, độ che phủ ${coverage}, mùa ${season} và điểm đến ${destination}.`,
  },
  th:{
    style:(style,mood)=>`สไตล์ ${style} และอารมณ์ ${mood} ที่คุณเลือกสนับสนุนทิศทางลุคนี้`,
    palette:(palette,undertone)=>`พาเลต ${palette} ที่เลือกเข้ากันได้กับอันเดอร์โทน ${undertone} ของลุคนี้`,
    practical:(comfort,coverage,season,destination)=>`การจัดอันดับคำนึงถึงความสบาย ${comfort} การปกปิด ${coverage} ฤดู ${season} และจุดหมาย ${destination} พร้อมกัน`,
  },
};

function effectiveSeason(input:StyleInputV1):StyleSeason{
  return input.visitDate?seasonFromVisitDate(input.visitDate)??input.season:input.season;
}

function pickAlternate<T extends {look:{id:string;palette:{top:string;bottom:string;accent:string;undertone:string}}}>(
  ranked:readonly T[],
  currentId:string,
){
  return ranked.find(({look})=>look.id!==currentId)?.look;
}

function buildStylebook(input:StyleInputV1,generatedAt:string,revision:MyKoreaLookStylebook['revision']):MyKoreaLookStylebook{
  if(styleInputNeedsPaletteChoice(input)){
    throw new StylebookBuildError('PALETTE_CHOICE_REQUIRED','A manual stylebook cannot use the suggest palette without a browser-local color preview.');
  }
  const ranked=rankStyleInputV1(input);
  if(ranked.length<3){
    throw new StylebookBuildError('NOT_ENOUGH_ELIGIBLE_LOOKS','At least three verified curated looks are required for this stylebook input.');
  }
  const season=effectiveSeason(input);
  const reasonCopy=REASON_COPY[input.locale];
  const destination=getStylebookDestinationPlan(input.destination);
  const topThree=ranked.slice(0,3);
  return{
    schemaVersion:MY_KOREA_LOOK_STYLEBOOK_VERSION,
    productKey:'my_korea_look_v1',
    generatedAt,
    revision,
    inputSnapshot:{...input},
    effectiveSeason:season,
    personalizationBasis:input.colorSource==='local-preview'?'local-color-preview-plus-preferences':'explicit-preferences',
    destinationPlan:{
      destination:destination.destination,
      name:destination.name,
      koreanName:destination.koreanName,
      description:destination.description,
      photoAngle:destination.photoAngle,
      visitorNote:destination.visitorNote,
      estimatedMinutes:destination.estimatedMinutes,
      mapUrl:stylebookDestinationMapUrl(destination),
      source:{url:destination.sourceUrl,label:destination.sourceLabel,checkedAt:destination.checkedAt},
      route:destination.route.map(stop=>({...stop})),
    },
    looks:topThree.map(({look},index)=>{
      const alternate=ranked.slice(3).find(({look:candidate})=>candidate.id!==look.id)?.look??pickAlternate(ranked,look.id);
      if(!alternate)throw new StylebookBuildError('NOT_ENOUGH_ELIGIBLE_LOOKS','A distinct alternate colorway could not be created from the verified catalog.');
      return{
        rank:(index+1) as 1|2|3,
        lookId:look.id,
        visual:{src:look.visualSrc,alt:look.visualAlt,kind:look.kind},
        title:look.title,
        tagline:look.tagline,
        description:look.description,
        garmentType:look.garmentType,
        coverage:look.coverage,
        palette:{...look.palette},
        accessories:[...look.accessoryIds],
        reasons:[
          reasonCopy.style(input.style,input.mood),
          reasonCopy.palette(input.palette,look.palette.undertone),
          reasonCopy.practical(input.comfort,input.coverage,season,input.destination),
        ],
        tradeOff:look.tradeOff,
        alternateColorway:{
          sourceLookId:alternate.id,
          top:alternate.palette.top,
          bottom:alternate.palette.bottom,
          accent:alternate.palette.accent,
          undertone:alternate.palette.undertone,
        },
        recommendedLocation:{...look.recommendedLocation},
        rentalShopCard:{...look.rentalShopCard},
        photoRoute:look.photoRoute.map(stop=>({...stop})),
        source:{url:look.sourceUrl,creator:look.creator,license:look.license,licenseUrl:look.licenseUrl,checkedAt:look.checkedAt},
      };
    }),
  };
}

export function buildMyKoreaLookStylebook(input:StyleInputV1,generatedAt=new Date().toISOString()):MyKoreaLookStylebook{
  return buildStylebook(input,generatedAt,{sequence:0,successfulRevisionsUsed:0});
}

function patchHasChanges(original:StyleInputV1,patch:StylebookRevisionPatch){
  return Object.entries(patch).some(([key,value])=>value!==undefined&&original[key as keyof StyleInputV1]!==value);
}

export function reviseMyKoreaLookStylebook(
  original:MyKoreaLookStylebook,
  patch:StylebookRevisionPatch,
  generatedAt=new Date().toISOString(),
):MyKoreaLookStylebook{
  if(original.revision.successfulRevisionsUsed>=MY_KOREA_LOOK_MAX_SUCCESSFUL_REVISIONS){
    throw new StylebookBuildError('REVISION_LIMIT_REACHED','This stylebook already used its included successful revision.');
  }
  if(!patchHasChanges(original.inputSnapshot,patch)){
    throw new StylebookBuildError('EMPTY_REVISION','A revision must change at least one supported stylebook input.');
  }
  const nextInput:StyleInputV1={...original.inputSnapshot,...patch};
  // A failed build throws before any new result exists, so the included revision is not consumed.
  return buildStylebook(nextInput,generatedAt,{
    sequence:1,
    parentGeneratedAt:original.generatedAt,
    successfulRevisionsUsed:1,
  });
}
