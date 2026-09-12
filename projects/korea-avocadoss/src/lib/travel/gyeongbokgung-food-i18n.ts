import type {FoodPlace} from './gyeongbokgung-food-core';

export type FoodLocale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';

type VenueCopy={summary:string;closed:string;dietaryNote?:string};
type LocalizedVenueCopy=Record<Exclude<FoodLocale,'en'>,VenueCopy>;

const VENUE_COPY:Record<string,LocalizedVenueCopy>={
 tosokchon:{
  'zh-CN':{summary:'景福宫附近韩屋环境中的传统参鸡汤（人参鸡汤）餐厅。',closed:'当前韩国旅游官方页面标注全年营业。'},
  ja:{summary:'景福宮近くの韓屋で伝統的な参鶏湯（高麗人参入り鶏スープ）を味わえる店です。',closed:'現在の韓国観光公式掲載では年中無休です。'},
  'zh-TW':{summary:'景福宮附近韓屋空間中的傳統蔘雞湯（人蔘雞湯）餐廳。',closed:'目前韓國觀光官方頁面標示全年營業。'},
  vi:{summary:'Quán samgyetang truyền thống (gà hầm sâm) trong không gian hanok gần Gyeongbokgung.',closed:'Danh sách du lịch chính thức hiện tại ghi mở cửa quanh năm.'},
  th:{summary:'ร้านซัมกเยทังแบบดั้งเดิม (ไก่ตุ๋นโสม) ในบรรยากาศฮันอกใกล้พระราชวังคยองบกกุง',closed:'ข้อมูลท่องเที่ยวทางการปัจจุบันระบุว่าเปิดตลอดปี'}
 },
 iftar:{
  'zh-CN':{summary:'首尔官方旅游页面介绍的韩式餐厅，所用食材被说明为符合严格清真标准。',closed:'到访前请再次查看当前官方页面。',dietaryNote:'首尔官方页面标注店内不售酒，并有穆斯林厨师。个人饮食要求请务必直接向店家确认。'},
  ja:{summary:'Visit Seoulが、厳格なハラール基準に沿う食材を使うと紹介している韓国料理店です。',closed:'訪問前に最新の公式掲載を再確認してください。',dietaryNote:'Visit Seoulではアルコール販売なし、ムスリムの調理スタッフありと掲載されています。個別の食事条件は必ず店舗へ直接確認してください。'},
  'zh-TW':{summary:'首爾官方旅遊頁面介紹的韓式餐廳，所用食材被說明為符合嚴格清真標準。',closed:'到訪前請再次查看目前官方頁面。',dietaryNote:'首爾官方頁面標示店內不販售酒類，並有穆斯林廚師。個人飲食需求請務必直接向店家確認。'},
  vi:{summary:'Nhà hàng món Hàn được Visit Seoul mô tả là sử dụng nguyên liệu theo tiêu chuẩn halal nghiêm ngặt.',closed:'Hãy kiểm tra lại trang thông tin hiện tại trước khi đến.',dietaryNote:'Visit Seoul hiện ghi không bán đồ uống có cồn và có đầu bếp Hồi giáo. Luôn xác nhận trực tiếp các yêu cầu ăn uống riêng.'},
  th:{summary:'ร้านอาหารเกาหลีที่ Visit Seoul ระบุว่าใช้วัตถุดิบตามมาตรฐานฮาลาลที่เข้มงวด',closed:'โปรดตรวจข้อมูลล่าสุดอีกครั้งก่อนเดินทาง',dietaryNote:'Visit Seoul ระบุว่าไม่มีการจำหน่ายแอลกอฮอล์และมีพ่อครัวมุสลิม โปรดยืนยันข้อกำหนดด้านอาหารเฉพาะบุคคลกับร้านโดยตรงเสมอ'}
 },
 'seochon-dagwabang':{
  'zh-CN':{summary:'景福宫站附近的韩屋咖啡馆，提供传统茶与手工韩式甜点。',closed:'周二休息。'},
  ja:{summary:'景福宮駅近くの韓屋カフェ。伝統茶と手作りの韓国菓子を楽しめます。',closed:'火曜日休業。'},
  'zh-TW':{summary:'景福宮站附近的韓屋咖啡館，提供傳統茶與手工韓式甜點。',closed:'週二休息。'},
  vi:{summary:'Quán cà phê hanok gần ga Gyeongbokgung, phục vụ trà truyền thống và món ngọt Hàn Quốc làm thủ công.',closed:'Đóng cửa thứ Ba.'},
  th:{summary:'คาเฟ่ฮันอกใกล้สถานีคยองบกกุง เสิร์ฟชาดั้งเดิมและขนมเกาหลีทำมือ',closed:'ปิดวันอังคาร'}
 },
 'tailor-coffee-seochon':{
  'zh-CN':{summary:'位于景福宫西侧石墙路一带的咖啡与烘焙店。',closed:'当前 Visit Seoul 页面标注每日营业。'},
  ja:{summary:'景福宮西側の石垣沿いにあるコーヒーとベーカリーの立ち寄りスポットです。',closed:'現在のVisit Seoul掲載では毎日営業です。'},
  'zh-TW':{summary:'位於景福宮西側石牆路一帶的咖啡與烘焙店。',closed:'目前 Visit Seoul 頁面標示每日營業。'},
  vi:{summary:'Điểm cà phê và bánh nướng dọc con đường tường đá phía tây Gyeongbokgung.',closed:'Danh sách Visit Seoul hiện tại ghi mở cửa hằng ngày.'},
  th:{summary:'ร้านกาแฟและเบเกอรี่ตามแนวกำแพงหินฝั่งตะวันตกของคยองบกกุง',closed:'ข้อมูล Visit Seoul ปัจจุบันระบุว่าเปิดทุกวัน'}
 },
 'aino-garden-kitchen':{
  'zh-CN':{summary:'西村的韩屋改造空间，一楼为咖啡馆，二楼为韩餐厅。',closed:'当前 Visit Seoul 页面标注全年营业。'},
  ja:{summary:'西村の韓屋を改装した施設で、1階がカフェ、2階が韓国料理店です。',closed:'現在のVisit Seoul掲載では年中無休です。'},
  'zh-TW':{summary:'西村的韓屋改造空間，一樓為咖啡館，二樓為韓式餐廳。',closed:'目前 Visit Seoul 頁面標示全年營業。'},
  vi:{summary:'Không gian hanok cải tạo ở Seochon, tầng 1 là quán cà phê và tầng 2 là nhà hàng món Hàn.',closed:'Danh sách Visit Seoul hiện tại ghi mở cửa quanh năm.'},
  th:{summary:'พื้นที่ฮันอกรีโนเวตในซอชน ชั้นหนึ่งเป็นคาเฟ่และชั้นสองเป็นร้านอาหารเกาหลี',closed:'ข้อมูล Visit Seoul ปัจจุบันระบุว่าเปิดตลอดปี'}
 },
 'cafe-haven':{
  'zh-CN':{summary:'西村咖啡馆，现代外观内仍可看到传统木构韩屋结构。',closed:'周一休息。'},
  ja:{summary:'モダンな外観の内部に伝統的な木造韓屋の構造が見える西村のカフェです。',closed:'月曜日休業。'},
  'zh-TW':{summary:'西村咖啡館，現代外觀內仍可看到傳統木構韓屋結構。',closed:'週一休息。'},
  vi:{summary:'Quán cà phê ở Seochon, bên trong mặt tiền hiện đại vẫn thấy kết cấu hanok gỗ truyền thống.',closed:'Đóng cửa thứ Hai.'},
  th:{summary:'คาเฟ่ในซอชนที่ภายในอาคารสมัยใหม่ยังมองเห็นโครงสร้างไม้ฮันอกแบบดั้งเดิม',closed:'ปิดวันจันทร์'}
 },
 'cafe-sinola':{
  'zh-CN':{summary:'西村的 LP 主题咖啡馆，位于景福宫石墙路线一带，以手冲咖啡和早午餐闻名。',closed:'当前 Visit Seoul 页面标注每日营业。',dietaryNote:'Visit Seoul 当前标注该店为 no-kids。若带儿童前往，请先确认最新政策。'},
  ja:{summary:'景福宮の石垣ルート沿いにある、西村のLPテーマカフェ。ドリップコーヒーとブランチで知られています。',closed:'現在のVisit Seoul掲載では毎日営業です。',dietaryNote:'Visit Seoulでは現在「no-kids」と掲載されています。子ども連れの場合は最新ポリシーを確認してください。'},
  'zh-TW':{summary:'西村的 LP 主題咖啡館，位於景福宮石牆路線一帶，以手沖咖啡和早午餐聞名。',closed:'目前 Visit Seoul 頁面標示每日營業。',dietaryNote:'Visit Seoul 目前標示該店為 no-kids。若帶兒童前往，請先確認最新政策。'},
  vi:{summary:'Quán cà phê chủ đề LP ở Seochon, nổi tiếng với cà phê pha tay và brunch trên tuyến tường đá Gyeongbokgung.',closed:'Danh sách Visit Seoul hiện tại ghi mở cửa hằng ngày.',dietaryNote:'Visit Seoul hiện ghi địa điểm này là no-kids; hãy xác nhận chính sách mới nhất nếu đi cùng trẻ em.'},
  th:{summary:'คาเฟ่ธีมแผ่นเสียง LP ในซอชน ขึ้นชื่อเรื่องกาแฟดริปและบรันช์บนเส้นทางกำแพงหินคยองบกกุง',closed:'ข้อมูล Visit Seoul ปัจจุบันระบุว่าเปิดทุกวัน',dietaryNote:'Visit Seoul ระบุปัจจุบันว่าเป็นร้าน no-kids หากเดินทางพร้อมเด็กโปรดยืนยันนโยบายล่าสุดก่อน'}
 }
};

const LAST_ORDER:Record<FoodLocale,string>={
 en:'last order',
 'zh-CN':'最后点单',
 ja:'ラストオーダー',
 'zh-TW':'最後點餐',
 vi:'gọi món cuối',
 th:'รับออเดอร์สุดท้าย'
};

export function localizeFoodHours(hours:string,locale:FoodLocale){
 return hours.replace(/last order/gi,LAST_ORDER[locale]);
}

export function localizeFoodPlace(place:FoodPlace,locale:FoodLocale):VenueCopy{
 if(locale==='en')return{summary:place.summary,closed:place.closed,dietaryNote:place.dietaryNote};
 const copy=VENUE_COPY[place.id]?.[locale];
 return copy??{summary:place.summary,closed:place.closed,dietaryNote:place.dietaryNote};
}

export function localizedFoodPlaceIds(){return Object.keys(VENUE_COPY);}
