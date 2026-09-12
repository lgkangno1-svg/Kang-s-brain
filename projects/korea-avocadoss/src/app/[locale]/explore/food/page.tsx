import type {Metadata} from 'next';
import {setRequestLocale} from 'next-intl/server';
import {FoodFinder} from '@/features/explore/FoodFinder';
import {getGyeongbokgungFoodPlaces} from '@/lib/content/travel-content';
import {localizeFoodHours,localizeFoodPlace,type FoodLocale} from '@/lib/travel/gyeongbokgung-food-i18n';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Props={params:Promise<{locale:string}>};
type FoodMeta={title:string;description:string};
const META:Record<FoodLocale,FoodMeta>={
 en:{title:'Food near Gyeongbokgung',description:'Source-checked Korean food, halal dining, traditional tea and coffee near Gyeongbokgung.'},
 'zh-CN':{title:'景福宫附近美食',description:'查看景福宫周边已核对来源的韩餐、清真餐饮、传统茶与咖啡馆。'},
 ja:{title:'景福宮周辺の食事',description:'景福宮周辺の出典確認済み韓国料理、ハラール情報、伝統茶、コーヒーを探せます。'},
 'zh-TW':{title:'景福宮附近美食',description:'查看景福宮周邊已核對來源的韓式料理、清真餐飲、傳統茶與咖啡館。'},
 vi:{title:'Ăn uống gần Gyeongbokgung',description:'Tìm món Hàn, địa điểm có thông tin halal, trà truyền thống và cà phê gần Gyeongbokgung với nguồn đã kiểm tra.'},
 th:{title:'อาหารใกล้คยองบกกุง',description:'ค้นหาอาหารเกาหลี ร้านที่มีข้อมูลฮาลาล ชาดั้งเดิม และกาแฟใกล้คยองบกกุงจากแหล่งข้อมูลที่ตรวจสอบแล้ว'}
};
function safeLocale(locale:string):FoodLocale{return locale in META?locale as FoodLocale:'en';}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {locale}=await params;const l=safeLocale(locale),meta=META[l];return{title:meta.title,description:meta.description,alternates:localizedAlternates(l,'/explore/food')}}
export default async function FoodPage({params}:Props){const {locale}=await params;setRequestLocale(locale);const l=safeLocale(locale);const places=(await getGyeongbokgungFoodPlaces()).map(place=>{const localized=localizeFoodPlace(place,l);return{...place,summary:localized.summary,closed:localized.closed,dietaryNote:localized.dietaryNote,hours:localizeFoodHours(place.hours,l)};});return <main><FoodFinder locale={l} places={places}/></main>}
