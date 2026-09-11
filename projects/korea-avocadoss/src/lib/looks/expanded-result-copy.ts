export type ExpandedResultLocale='zh-CN'|'ja'|'zh-TW'|'vi'|'th';

type ExpandedLookCopy={title:string;tagline:string;description:string;visualAlt:string};

/**
 * Locale-native authored presentation for the six source-checked catalog
 * additions. These strings describe only visible garment/color composition;
 * they do not introduce inventory, historical-rank, identity or fit claims.
 */
export const EXPANDED_LOOK_RESULT_COPY:Record<ExpandedResultLocale,Record<string,ExpandedLookCopy>>={
 'zh-CN':{
  'look-modern-gold-chima-07':{title:'浅金与黑色现代裙装韩服',tagline:'轻盈大裙摆配深色上装，以单一垂饰形成利落对比',description:'现代感裙装方向：雕塑感黑色上装搭配浅金色宽裙，并以彩色韩服垂饰作为集中点缀。',visualAlt:'黑色现代上装、浅金色宽裙与彩色韩服垂饰的参考照片'},
  'look-layered-ivory-baji-08':{title:'层叠象牙白现代裤装韩服',tagline:'柔和同色系层次与宽松裤装，适合偏轻松的步行造型',description:'以象牙白层叠上装和宽松裤装为核心的现代方向，主要依靠材质与垂坠感而非繁复装饰。',visualAlt:'象牙白层叠上装与可见宽松裤装的现代韩服参考照片'},
  'look-teal-gold-chima-09':{title:'深青绿与金色正式裙装韩服',tagline:'宝石色纹样与沉稳金色形成端庄的宫廷感配色',description:'正式裙装方向：深青绿色纹样上衣搭配低饱和金色长裙，并以梅红系带和玉色垂饰控制重点。',visualAlt:'深青绿纹样上衣、金色长裙与玉色垂饰的正式韩服参考照片'},
  'look-indigo-modern-baji-10':{title:'靛蓝结构感现代裤装韩服',tagline:'克制的冷色裤装方向，轮廓更简洁现代',description:'以靛蓝与柔和蓝色为主的现代裤装韩服方向，通过结构化上层与裤装轮廓营造端正规整的感觉。',visualAlt:'靛蓝与蓝色结构上装搭配裤装轮廓的现代韩服参考照片'},
  'look-jeonmo-gold-chima-11':{title:'黑红金高对比戏剧感裙装韩服',tagline:'金色长裙、深色外层与大轮廓头饰构成强烈画面',description:'以金色绣纹长裙、深色外层、红色系带和大型传统头饰为核心的拍照优先参考方向，不代表租赁库存承诺。',visualAlt:'深色外层、金色长裙、红色系带与大型传统头饰的韩服参考照片'},
  'look-scarlet-brocade-baji-12':{title:'绯红织锦与黑色拍照型裤装韩服',tagline:'黑色结构上装与绯红金纹下装形成强烈现代宫廷感',description:'时装感裤装参考：雕塑感黑色上装搭配绯红织锦下装，作为拍照优先的颜色与轮廓方向，而非原样租赁承诺。',visualAlt:'黑色非对称上装与绯红金纹裤装轮廓的韩服参考照片'}
 },
 ja:{
  'look-modern-gold-chima-07':{title:'淡いゴールド×ブラックのモダンチマ',tagline:'軽いフルスカートと濃色トップに、一本の装飾ラインを効かせたモダンな対比',description:'彫刻的な黒の上衣に淡いゴールドのフルチマを合わせ、カラフルなノリゲを一点のアクセントにした現代的な方向です。',visualAlt:'黒のモダン上衣、淡いゴールドのフルチマ、色鮮やかなノリゲの参考写真'},
  'look-layered-ivory-baji-08':{title:'レイヤード・アイボリーのモダンパジ',tagline:'やわらかな同系色レイヤーとパンツでまとめた歩きやすい方向',description:'アイボリーのレイヤード上衣とゆったりしたパジを組み合わせ、華美な小物より素材感と落ち感を生かすモダンな提案です。',visualAlt:'アイボリーのレイヤード上衣とゆったりしたパジが見えるモダン韓服の参考写真'},
  'look-teal-gold-chima-09':{title:'深いティール×ゴールドのフォーマルチマ',tagline:'宝石色の柄と落ち着いたゴールドで整えた宮廷風の配色',description:'深いティールの柄入りチョゴリに控えめなゴールドのチマを合わせ、プラム色の結びと翡翠色の装飾をポイントにしたフォーマルな方向です。',visualAlt:'深いティールの柄入りチョゴリ、ゴールドのチマ、翡翠色のノリゲの参考写真'},
  'look-indigo-modern-baji-10':{title:'インディゴブルーの構築的モダンパジ',tagline:'抑えた寒色でまとめた、すっきりした現代的なパンツスタイル',description:'インディゴからブルーの寒色域を軸に、構築的な上衣とパジのシルエットで端正にまとめたモダン韓服の方向です。',visualAlt:'インディゴとブルーの構築的な上衣にパジを合わせたモダン韓服の参考写真'},
  'look-jeonmo-gold-chima-11':{title:'ブラック・レッド・ゴールドのドラマチックチマ',tagline:'金のチマ、濃色の外衣、大きな頭部シルエットで強い印象を作る写真向け方向',description:'金の刺繍チマ、濃色の外衣、赤い結び、大きな伝統的頭飾りを組み合わせた写真優先の参考です。レンタル在庫を約束するものではありません。',visualAlt:'濃色の外衣、金のチマ、赤い結び、大きな伝統的頭飾りの韓服参考写真'},
  'look-scarlet-brocade-baji-12':{title:'スカーレット織柄×ブラックの写真向けパジ',tagline:'黒の構築的な上衣と赤金の織柄でつくるドラマチックなモダン宮廷方向',description:'彫刻的な黒の上衣と鮮やかなスカーレットの織柄下衣を合わせた前衛的なパジ参考で、写真向けの色と形の方向として扱います。',visualAlt:'黒の非対称上衣とスカーレット・ゴールドの織柄パジシルエットの参考写真'}
 },
 'zh-TW':{
  'look-modern-gold-chima-07':{title:'淡金與黑色現代裙裝韓服',tagline:'輕盈大裙襬搭配深色上身，以單一垂飾形成俐落對比',description:'現代感裙裝方向：雕塑感黑色上身搭配淡金色寬裙，並以彩色韓服垂飾作為集中點綴。',visualAlt:'黑色現代上身、淡金色寬裙與彩色韓服垂飾的參考照片'},
  'look-layered-ivory-baji-08':{title:'層疊象牙白現代褲裝韓服',tagline:'柔和同色層次與寬鬆褲裝，適合偏輕鬆的步行造型',description:'以象牙白層疊上身和寬鬆褲裝為核心的現代方向，主要利用材質與垂墜感，而不是繁複配件。',visualAlt:'象牙白層疊上身與可見寬鬆褲裝的現代韓服參考照片'},
  'look-teal-gold-chima-09':{title:'深青綠與金色正式裙裝韓服',tagline:'寶石色紋樣與沉穩金色形成端莊的宮廷感配色',description:'正式裙裝方向：深青綠紋樣上衣搭配低飽和金色長裙，並以梅紅繫帶與玉色垂飾控制重點。',visualAlt:'深青綠紋樣上衣、金色長裙與玉色垂飾的正式韓服參考照片'},
  'look-indigo-modern-baji-10':{title:'靛藍結構感現代褲裝韓服',tagline:'克制的冷色褲裝方向，輪廓更簡潔現代',description:'以靛藍與柔和藍色為主的現代褲裝韓服方向，透過結構化上層與褲裝輪廓營造端整感。',visualAlt:'靛藍與藍色結構上身搭配褲裝輪廓的現代韓服參考照片'},
  'look-jeonmo-gold-chima-11':{title:'黑紅金高對比戲劇感裙裝韓服',tagline:'金色長裙、深色外層與大輪廓頭飾構成強烈畫面',description:'以金色繡紋長裙、深色外層、紅色繫帶和大型傳統頭飾為核心的拍照優先參考方向，不代表租借庫存承諾。',visualAlt:'深色外層、金色長裙、紅色繫帶與大型傳統頭飾的韓服參考照片'},
  'look-scarlet-brocade-baji-12':{title:'緋紅織錦與黑色拍照型褲裝韓服',tagline:'黑色結構上身與緋紅金紋下裝形成強烈現代宮廷感',description:'時裝感褲裝參考：雕塑感黑色上身搭配緋紅織錦下裝，作為拍照優先的顏色與輪廓方向，而非原樣租借承諾。',visualAlt:'黑色不對稱上身與緋紅金紋褲裝輪廓的韓服參考照片'}
 },
 vi:{
  'look-modern-gold-chima-07':{title:'Chima hiện đại vàng nhạt & đen',tagline:'Tương phản gọn gàng giữa váy rộng sáng màu, phần trên tối và một điểm nhấn dọc',description:'Hướng chima hiện đại với phần trên đen có cấu trúc, váy rộng vàng nhạt và một norigae nhiều màu làm điểm nhấn tập trung.',visualAlt:'Ảnh tham khảo phần trên màu đen, chima vàng nhạt dáng rộng và norigae nhiều màu'},
  'look-layered-ivory-baji-08':{title:'Baji hiện đại nhiều lớp màu ngà',tagline:'Các lớp đơn sắc mềm với quần rộng cho hướng ưu tiên đi bộ nhẹ nhàng',description:'Hướng hiện đại dùng các lớp màu ngà và quần baji rộng, nhấn vào chất liệu và độ rủ thay vì phụ kiện cầu kỳ.',visualAlt:'Ảnh tham khảo Hanbok hiện đại nhiều lớp màu ngà với quần baji rộng nhìn rõ'},
  'look-teal-gold-chima-09':{title:'Chima trang trọng xanh teal đậm & vàng',tagline:'Tông đá quý có họa tiết cân bằng với vàng trầm theo hướng trang trọng',description:'Hướng chima trang trọng kết hợp jeogori xanh teal đậm có họa tiết, váy vàng trầm, dây màu mận và điểm nhấn ngọc xanh.',visualAlt:'Ảnh tham khảo jeogori xanh teal đậm có họa tiết, chima vàng và norigae tông ngọc xanh'},
  'look-indigo-modern-baji-10':{title:'Baji hiện đại xanh indigo có cấu trúc',tagline:'Hướng quần tông lạnh tiết chế với dáng hiện đại gọn hơn',description:'Hướng Hanbok hiện đại dùng dải màu indigo-xanh lam, phần trên có cấu trúc và dáng quần để tạo cảm giác trang trọng nhưng không nghi lễ.',visualAlt:'Ảnh tham khảo Hanbok hiện đại xanh indigo và xanh lam với dáng quần baji'},
  'look-jeonmo-gold-chima-11':{title:'Chima kịch tính đen, đỏ & vàng',tagline:'Váy vàng, lớp ngoài tối và phụ kiện đầu lớn tạo hướng chụp ảnh nổi bật',description:'Tham khảo chima ưu tiên chụp ảnh với váy vàng thêu, lớp ngoài tối, dây đỏ và phụ kiện đầu truyền thống lớn; không phải cam kết tồn kho cho thuê.',visualAlt:'Ảnh tham khảo lớp ngoài tối, chima vàng, dây đỏ và phụ kiện đầu truyền thống lớn'},
  'look-scarlet-brocade-baji-12':{title:'Baji chụp ảnh gấm đỏ thẫm & đen',tagline:'Phần trên đen có cấu trúc kết hợp gấm đỏ-vàng cho hướng hoàng gia hiện đại nổi bật',description:'Tham khảo baji mang tính thời trang với phần trên đen có cấu trúc và phần dưới gấm đỏ thẫm, dùng như hướng màu và hình khối ưu tiên chụp ảnh chứ không phải bản sao thuê nguyên mẫu.',visualAlt:'Ảnh tham khảo phần trên đen bất đối xứng với dáng baji gấm đỏ thẫm và vàng'}
 },
 th:{
  'look-modern-gold-chima-07':{title:'ชิมาสมัยใหม่สีทองอ่อนกับดำ',tagline:'กระโปรงฟูสีอ่อนตัดกับท่อนบนเข้ม และใช้เครื่องห้อยเพียงจุดเดียวให้ภาพดูสะอาด',description:'แนวชิมาสมัยใหม่ที่จับคู่ท่อนบนสีดำทรงชัดกับกระโปรงฟูสีทองอ่อน และใช้โนรีแกสีสดเป็นจุดเน้นหลักเพียงจุดเดียว',visualAlt:'ภาพอ้างอิงท่อนบนสีดำ ชิมาทรงฟูสีทองอ่อน และโนรีแกหลากสี'},
  'look-layered-ivory-baji-08':{title:'บาจีสมัยใหม่เลเยอร์สีไอวอรี',tagline:'เลเยอร์โทนอ่อนกับกางเกงทรงหลวม เหมาะกับแนวที่เน้นเดินสบาย',description:'แนวสมัยใหม่ที่ใช้ท่อนบนเลเยอร์สีไอวอรีกับบาจีทรงหลวม เน้นพื้นผิวและการทิ้งตัวของผ้ามากกว่าเครื่องประดับจำนวนมาก',visualAlt:'ภาพอ้างอิงฮันบกสมัยใหม่เลเยอร์สีไอวอรีพร้อมบาจีทรงหลวมที่มองเห็นชัด'},
  'look-teal-gold-chima-09':{title:'ชิมาทางการสีทีลเข้มกับทอง',tagline:'โทนอัญมณีมีลวดลายจับคู่กับทองหม่นอย่างสุขุม',description:'แนวชิมาทางการที่ใช้ชอโกรีสีทีลเข้มมีลวดลาย กระโปรงทองหม่น ริบบิ้นสีพลัม และเครื่องห้อยโทนหยกเป็นจุดเน้น',visualAlt:'ภาพอ้างอิงชอโกรีสีทีลเข้มมีลวดลาย ชิมาสีทอง และโนรีแกโทนหยก'},
  'look-indigo-modern-baji-10':{title:'บาจีสมัยใหม่สีน้ำเงินอินดิโกทรงชัด',tagline:'แนวกางเกงโทนเย็นที่สุขุมและมีเส้นสายสมัยใหม่สะอาดตา',description:'แนวฮันบกสมัยใหม่ที่ใช้ช่วงสีอินดิโกถึงน้ำเงิน ร่วมกับท่อนบนทรงชัดและบาจี เพื่อความเป็นทางการที่ไม่ถึงขั้นพิธีการ',visualAlt:'ภาพอ้างอิงฮันบกสมัยใหม่อินดิโกและน้ำเงินพร้อมทรงบาจี'},
  'look-jeonmo-gold-chima-11':{title:'ชิมาดรามาติกสีดำ แดง และทอง',tagline:'ชิมาสีทอง ชั้นนอกเข้ม และเครื่องศีรษะขนาดใหญ่สำหรับภาพที่โดดเด่น',description:'ลุคอ้างอิงที่เน้นการถ่ายภาพ ใช้ชิมาปักสีทอง ชั้นนอกสีเข้ม ริบบิ้นแดง และเครื่องศีรษะแบบดั้งเดิมขนาดใหญ่ โดยไม่ถือเป็นคำยืนยันสินค้าร้านเช่า',visualAlt:'ภาพอ้างอิงชั้นนอกสีเข้ม ชิมาสีทอง ริบบิ้นแดง และเครื่องศีรษะแบบดั้งเดิมขนาดใหญ่'},
  'look-scarlet-brocade-baji-12':{title:'บาจีถ่ายภาพผ้าทอแดงเข้มกับดำ',tagline:'ท่อนบนดำทรงชัดกับลายแดง-ทองให้ทิศทางราชสำนักสมัยใหม่ที่เด่นชัด',description:'ลุคอ้างอิงบาจีเชิงแฟชั่นที่ใช้ท่อนบนสีดำทรงชัดกับท่อนล่างผ้าทอแดงเข้ม ใช้เป็นแนวสีและรูปทรงสำหรับการถ่ายภาพ ไม่ใช่คำสัญญาว่าจะเช่าแบบเดียวกันได้',visualAlt:'ภาพอ้างอิงท่อนบนสีดำไม่สมมาตรกับทรงบาจีผ้าทอแดงเข้มและทอง'}
 }
};

export function getExpandedLookResultCopy(locale:string,lookId:string){
 if(locale==='en')return null;
 const copy=EXPANDED_LOOK_RESULT_COPY[locale as ExpandedResultLocale];
 return copy?.[lookId]??null;
}
