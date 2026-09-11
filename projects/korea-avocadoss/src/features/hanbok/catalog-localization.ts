import type {CuratedLook,Season} from '@/lib/looks/catalog';

export type HanbokCatalogLocale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';

type LocalizedLook={title:string;description:string};

type LookId='look-pastel-princess-01'|'look-pastel-prince-02'|'look-court-queen-03'|'look-scholar-king-04'|'look-royal-ceremonial-05'|'look-royal-king-06';

const LOOKS:Record<HanbokCatalogLocale,Record<LookId,LocalizedLook>>={
 en:{
  'look-pastel-princess-01':{title:'Luminous Lavender & Ivory Princess',description:'A light pastel chima-jeogori direction for an airy palace-garden look.'},
  'look-pastel-prince-02':{title:'Sky Blue & White Scholar Prince',description:'A bright scholar-prince direction designed around an easy palace stroll.'},
  'look-court-queen-03':{title:'Crimson & Navy Royal Court Queen',description:'A high-contrast court direction with a formal, dignified silhouette.'},
  'look-scholar-king-04':{title:'Forest Pine & Charcoal Noble Dopo',description:'A composed noble-scholar direction centered on a long traditional dopo robe.'},
  'look-royal-ceremonial-05':{title:'Imperial Gold & Scarlet Royal Empress',description:'A dramatic ceremonial royal direction intended primarily for dedicated photos.'},
  'look-royal-king-06':{title:'Crimson Dragon Gonryongpo King',description:'An iconic royal gonryongpo direction with a strong ceremonial presence.'}
 },
 'zh-CN':{
  'look-pastel-princess-01':{title:'薰衣草紫与象牙白公主韩服',description:'轻盈柔和的粉彩裙装方向，适合宫苑散步与自然光拍摄。'},
  'look-pastel-prince-02':{title:'天蓝与白色书生王子韩服',description:'明亮清爽的书生王子方向，兼顾宫殿步行与拍照。'},
  'look-court-queen-03':{title:'绯红与深蓝宫廷王后韩服',description:'高对比度的正式宫廷方向，强调端庄而有存在感的轮廓。'},
  'look-scholar-king-04':{title:'松绿与炭灰贵族道袍',description:'以传统长道袍为核心的沉稳士大夫方向。'},
  'look-royal-ceremonial-05':{title:'金色与朱红皇家礼服',description:'强调仪式感与视觉张力的皇家方向，更适合专门拍摄。'},
  'look-royal-king-06':{title:'绯红龙纹衮龙袍',description:'辨识度很高的王室衮龙袍方向，强调庄重的仪式感。'}
 },
 ja:{
  'look-pastel-princess-01':{title:'ラベンダー×アイボリーのプリンセス韓服',description:'軽やかなパステルのチマチョゴリで、宮苑の自然光に合う方向です。'},
  'look-pastel-prince-02':{title:'空色×白のソンビ王子韓服',description:'明るく清潔感のあるソンビ・王子風で、宮殿散策にも合わせやすい方向です。'},
  'look-court-queen-03':{title:'深紅×濃紺の宮廷王妃韓服',description:'コントラストを効かせた格式ある宮廷スタイルで、端正な存在感を重視します。'},
  'look-scholar-king-04':{title:'松緑×チャコールの士大夫トポ',description:'伝統的な長いトポを中心にした、落ち着いた士大夫スタイルです。'},
  'look-royal-ceremonial-05':{title:'金×朱赤の王室礼装',description:'儀礼性と写真映えを優先した、華やかな王室礼装の方向です。'},
  'look-royal-king-06':{title:'深紅の龍紋コンリョンポ',description:'朝鮮王室を象徴するコンリョンポを中心にした、格調高い王の装いです。'}
 },
 'zh-TW':{
  'look-pastel-princess-01':{title:'薰衣草紫與象牙白公主韓服',description:'輕盈柔和的粉彩裙裝方向，適合宮苑散步與自然光拍攝。'},
  'look-pastel-prince-02':{title:'天藍與白色書生王子韓服',description:'明亮清爽的書生王子方向，兼顧宮殿步行與拍照。'},
  'look-court-queen-03':{title:'緋紅與深藍宮廷王后韓服',description:'高對比的正式宮廷方向，強調端莊且有存在感的輪廓。'},
  'look-scholar-king-04':{title:'松綠與炭灰士大夫道袍',description:'以傳統長道袍為核心的沉穩士大夫方向。'},
  'look-royal-ceremonial-05':{title:'金色與朱紅皇家禮服',description:'強調儀式感與視覺張力的皇家方向，更適合專門拍攝。'},
  'look-royal-king-06':{title:'緋紅龍紋袞龍袍',description:'辨識度很高的王室袞龍袍方向，強調莊重的儀式感。'}
 },
 vi:{
  'look-pastel-princess-01':{title:'Hanbok công chúa tím lavender và ngà',description:'Hướng chima-jeogori pastel nhẹ, phù hợp đi dạo và chụp ảnh trong vườn cung điện.'},
  'look-pastel-prince-02':{title:'Hanbok học giả hoàng tử xanh trời và trắng',description:'Hướng học giả sáng, gọn và thuận tiện hơn cho việc đi bộ trong cung điện.'},
  'look-court-queen-03':{title:'Hanbok vương hậu đỏ thẫm và xanh navy',description:'Hướng cung đình tương phản cao, nhấn mạnh dáng trang trọng và rõ nét.'},
  'look-scholar-king-04':{title:'Áo dopo quý tộc xanh thông và than',description:'Hướng học giả quý tộc điềm tĩnh, tập trung vào áo dopo truyền thống dáng dài.'},
  'look-royal-ceremonial-05':{title:'Lễ phục hoàng gia vàng và đỏ son',description:'Hướng lễ phục hoàng gia giàu kịch tính, ưu tiên cho buổi chụp ảnh chuyên biệt.'},
  'look-royal-king-06':{title:'Long bào gonryongpo đỏ thẫm',description:'Hướng gonryongpo biểu tượng với cảm giác nghi lễ mạnh và trang trọng.'}
 },
 th:{
  'look-pastel-princess-01':{title:'ฮันบกเจ้าหญิงลาเวนเดอร์และไอวอรี',description:'แนวชิมา-ชอโกรีพาสเทลเบาสบาย เหมาะกับการเดินและถ่ายภาพในสวนพระราชวัง'},
  'look-pastel-prince-02':{title:'ฮันบกเจ้าชายนักปราชญ์สีฟ้าและขาว',description:'แนวนักปราชญ์ที่ดูสว่างสะอาดและเหมาะกับการเดินชมพระราชวัง'},
  'look-court-queen-03':{title:'ฮันบกราชินีสีแดงเข้มและกรมท่า',description:'แนวราชสำนักที่ตัดกันชัด ให้ภาพลักษณ์สง่างามและเป็นทางการ'},
  'look-scholar-king-04':{title:'โดโพขุนนางสีเขียวสนและชาร์โคล',description:'แนวนักปราชญ์ขุนนางที่สุขุม โดยมีเสื้อคลุมโดโพแบบดั้งเดิมเป็นหลัก'},
  'look-royal-ceremonial-05':{title:'ชุดพิธีราชสำนักสีทองและแดงชาด',description:'แนวชุดพิธีราชสำนักที่โดดเด่น เหมาะกับช่วงเวลาถ่ายภาพโดยเฉพาะ'},
  'look-royal-king-06':{title:'กนรยงโพมังกรสีแดงเข้ม',description:'แนวกนรยงโพของกษัตริย์ที่เป็นเอกลักษณ์ ให้บรรยากาศพิธีการที่สง่างาม'}
 }
};

const WALKING:Record<HanbokCatalogLocale,Record<CuratedLook['walkingSuitability'],string>>={
 en:{easy:'easy',moderate:'moderate','photo-focused':'photo-focused'},'zh-CN':{easy:'轻松',moderate:'适中','photo-focused':'拍照优先'},ja:{easy:'歩きやすい',moderate:'普通','photo-focused':'撮影優先'},'zh-TW':{easy:'輕鬆',moderate:'適中','photo-focused':'拍照優先'},vi:{easy:'dễ đi bộ',moderate:'vừa phải','photo-focused':'ưu tiên chụp ảnh'},th:{easy:'เดินสบาย',moderate:'ปานกลาง','photo-focused':'เน้นถ่ายภาพ'}
};
const SEASONS:Record<HanbokCatalogLocale,Record<Season,string>>={
 en:{spring:'spring',summer:'summer',autumn:'autumn',winter:'winter','all-season':'all season'},'zh-CN':{spring:'春季',summer:'夏季',autumn:'秋季',winter:'冬季','all-season':'四季'},ja:{spring:'春',summer:'夏',autumn:'秋',winter:'冬','all-season':'通年'},'zh-TW':{spring:'春季',summer:'夏季',autumn:'秋季',winter:'冬季','all-season':'四季'},vi:{spring:'xuân',summer:'hè',autumn:'thu',winter:'đông','all-season':'quanh năm'},th:{spring:'ฤดูใบไม้ผลิ',summer:'ฤดูร้อน',autumn:'ฤดูใบไม้ร่วง',winter:'ฤดูหนาว','all-season':'ทุกฤดู'}
};

export function getHanbokCatalogPresentation(locale:string,look:CuratedLook){
 const l=(locale in LOOKS?locale:'en') as HanbokCatalogLocale;
 const localized=LOOKS[l][look.id as LookId]??{title:look.title,description:look.description};
 return {title:localized.title,description:localized.description,alt:localized.title,walking:WALKING[l][look.walkingSuitability],seasons:look.seasons.map(season=>SEASONS[l][season]),location:l==='en'?look.recommendedLocation.name:look.recommendedLocation.koreanName};
}

export const HANBOK_CATALOG_LOCALIZED_LOOK_IDS=Object.freeze(Object.keys(LOOKS.en));
export const HANBOK_CATALOG_P0_LOCALES=Object.freeze(Object.keys(LOOKS));
