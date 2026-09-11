'use client';

import {useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Copy={title:string;intro:string;noPhoto:string;noPhotoBody:string;photo:string;photoBody:string;cta:string};

const COPY:Record<Locale,Copy>={
 en:{title:'Choose how you want to personalize',intro:'Compare the two input methods before continuing. The free style preview below is preference-based unless you explicitly run Personal Color in your browser and transfer that color direction yourself.',noPhoto:'Without a photo',noPhotoBody:'Use only your selected style, garment, palette and trip preferences. The result is preference-based and does not claim photo analysis.',photo:'Use browser-local Personal Color',photoBody:'Personal Color can analyze a photo only in your browser; the photo stays on your device. Afterward, return here and choose the matching named palette. Secure paid photo styling is not available until private account, storage, consent and fulfillment infrastructure is verified.',cta:'Open browser-local Personal Color'},
 'zh-CN':{title:'选择个性化方式',intro:'继续前请比较两种输入方式。除非你明确在浏览器本地运行个人色彩并自行把色彩方向带回这里，否则下方免费造型预览仅基于偏好。',noPhoto:'不使用照片',noPhotoBody:'仅使用你选择的风格、服装、配色和行程偏好。结果基于偏好，不会声称进行了照片分析。',photo:'使用浏览器本地个人色彩',photoBody:'个人色彩只会在浏览器本地分析照片，照片留在设备上。完成后请返回此页并选择对应的明确配色。安全的付费照片造型功能会在私有账号、存储、同意和履约基础设施验证完成后开放。',cta:'打开浏览器本地个人色彩'},
 ja:{title:'パーソナライズ方法を選ぶ前に',intro:'続行前に2つの入力方法を比較してください。ブラウザ内のパーソナルカラーを明示的に実行し、その色方向を自分で戻さない限り、下の無料スタイルプレビューは好みベースです。',noPhoto:'写真を使わない',noPhotoBody:'選択したスタイル、衣装、配色、旅行条件だけを使います。結果は好みベースで、写真分析を行ったとは表示しません。',photo:'ブラウザ内パーソナルカラーを使う',photoBody:'パーソナルカラーは写真をブラウザ内だけで分析し、写真は端末に残ります。完了後、このページに戻って対応する明示的な配色を選んでください。安全な有料写真スタイリングは、非公開アカウント・保存・同意・生成基盤の検証後に提供します。',cta:'ブラウザ内パーソナルカラーを開く'},
 'zh-TW':{title:'選擇個人化方式前',intro:'繼續前請比較兩種輸入方式。除非你明確在瀏覽器本地執行個人色彩並自行把色彩方向帶回這裡，否則下方免費造型預覽只會依據偏好。',noPhoto:'不使用照片',noPhotoBody:'只使用你選擇的風格、服裝、配色與行程偏好。結果以偏好為基礎，不會宣稱做過照片分析。',photo:'使用瀏覽器本地個人色彩',photoBody:'個人色彩只會在瀏覽器本地分析照片，照片留在裝置上。完成後請回到此頁並選擇對應的明確配色。安全的付費照片造型會在私人帳號、儲存、同意與履約基礎設施驗證後提供。',cta:'開啟瀏覽器本地個人色彩'},
 vi:{title:'Chọn cách cá nhân hóa',intro:'Hãy so sánh hai cách nhập trước khi tiếp tục. Bản xem trước miễn phí bên dưới chỉ dựa trên sở thích trừ khi bạn chủ động chạy Personal Color trong trình duyệt và tự chuyển hướng màu đó trở lại đây.',noPhoto:'Không dùng ảnh',noPhotoBody:'Chỉ dùng phong cách, trang phục, bảng màu và bối cảnh chuyến đi bạn chọn. Kết quả dựa trên sở thích và không tuyên bố đã phân tích ảnh.',photo:'Dùng Personal Color trong trình duyệt',photoBody:'Personal Color chỉ phân tích ảnh trong trình duyệt; ảnh vẫn ở trên thiết bị. Sau đó hãy quay lại đây và chọn bảng màu cụ thể tương ứng. Tạo kiểu ảnh trả phí an toàn chỉ mở sau khi hạ tầng tài khoản riêng, lưu trữ, đồng ý và hoàn tất kết quả được xác minh.',cta:'Mở Personal Color trong trình duyệt'},
 th:{title:'เลือกวิธีปรับให้เหมาะกับคุณ',intro:'เปรียบเทียบวิธีให้ข้อมูลทั้งสองแบบก่อนดำเนินการ พรีวิวฟรีด้านล่างอิงความชอบเท่านั้น เว้นแต่คุณจะทำ Personal Color ในเบราว์เซอร์อย่างชัดเจนและนำทิศทางสีกลับมาเลือกเอง',noPhoto:'ไม่ใช้รูป',noPhotoBody:'ใช้เฉพาะสไตล์ ชุด พาเลต และบริบททริปที่คุณเลือก ผลลัพธ์อิงความชอบและจะไม่อ้างว่ามีการวิเคราะห์รูป',photo:'ใช้ Personal Color ในเบราว์เซอร์',photoBody:'Personal Color วิเคราะห์รูปในเบราว์เซอร์เท่านั้นและรูปยังอยู่บนอุปกรณ์ เมื่อเสร็จแล้วให้กลับมาหน้านี้และเลือกพาเลตที่ตรงกันด้วยตนเอง ฟีเจอร์แต่งลุคจากรูปแบบชำระเงินจะเปิดเมื่อระบบบัญชีส่วนตัว พื้นที่จัดเก็บ ความยินยอม และการส่งมอบได้รับการตรวจสอบแล้ว',cta:'เปิด Personal Color ในเบราว์เซอร์'}
};

const locales:Locale[]=['en','zh-CN','ja','zh-TW','vi','th'];

export function StyleInputModeChoice(){
 const rawLocale=useLocale();
 const locale=(locales.includes(rawLocale as Locale)?rawLocale:'en') as Locale;
 const c=COPY[locale];
 return <section aria-labelledby="style-input-mode-title" style={{border:'1px solid currentColor',borderRadius:12,padding:16,margin:'18px 0 24px'}}>
  <h2 id="style-input-mode-title" style={{marginTop:0}}>{c.title}</h2>
  <p>{c.intro}</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12}}>
   <article style={{border:'1px solid currentColor',borderRadius:10,padding:14}}><strong>{c.noPhoto}</strong><span style={{display:'block',marginTop:6}}>{c.noPhotoBody}</span></article>
   <article style={{border:'1px solid currentColor',borderRadius:10,padding:14}}><strong>{c.photo}</strong><span style={{display:'block',marginTop:6}}>{c.photoBody}</span><Link className="secondaryButton" href="/color" style={{display:'inline-block',marginTop:10}}>{c.cta}</Link></article>
  </div>
 </section>;
}
