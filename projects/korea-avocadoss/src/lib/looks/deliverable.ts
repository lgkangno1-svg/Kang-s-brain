import {rankCuratedLooks,type KoreaLookInput} from './recommend';

export const MY_KOREA_LOOK_DELIVERABLE_VERSION='my-korea-look-v1.0';

export type MyKoreaLookDeliverable={
 version:string;
 productKey:'my_korea_look_v1';
 generatedAt:string;
 input:KoreaLookInput;
 looks:Array<{
  rank:number;
  lookId:string;
  title:string;
  tagline:string;
  description:string;
  palette:{top:string;bottom:string;accent:string;undertone:string;description:string};
  reasons:string[];
  tradeOff:string;
  recommendedLocation:{name:string;koreanName:string;description:string;photoAngle:string};
  rentalShopCard:{hangulTitle:string;hangulStaffNote:string;englishExplanation:string};
  photoRoute:Array<{order:number;spotName:string;koreanName:string;bestTime:string;photoTip:string}>;
  source:{url:string;creator:string;license:string;licenseUrl:string;checkedAt:string};
 }>;
};

export function buildMyKoreaLookDeliverable(input:KoreaLookInput,generatedAt=new Date().toISOString()):MyKoreaLookDeliverable{
 const ranked=rankCuratedLooks(input).slice(0,3);
 if(ranked.length<3)throw new Error('My Korea Look requires at least three eligible curated looks for the selected garment type.');
 return{
  version:MY_KOREA_LOOK_DELIVERABLE_VERSION,
  productKey:'my_korea_look_v1',
  generatedAt,
  input:{...input},
  looks:ranked.map(({look},index)=>({
   rank:index+1,
   lookId:look.id,
   title:look.title,
   tagline:look.tagline,
   description:look.description,
   palette:{...look.palette},
   reasons:[...look.reasons],
   tradeOff:look.tradeOff,
   recommendedLocation:{...look.recommendedLocation},
   rentalShopCard:{...look.rentalShopCard},
   photoRoute:look.photoRoute.map(stop=>({...stop})),
   source:{url:look.sourceUrl,creator:look.creator,license:look.license,licenseUrl:look.licenseUrl,checkedAt:look.checkedAt},
  }))
 };
}
