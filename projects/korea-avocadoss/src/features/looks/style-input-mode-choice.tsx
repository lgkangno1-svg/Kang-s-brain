'use client';

import {useState} from 'react';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Mode='no-photo'|'photo';
type Copy={title:string;intro:string;noPhoto:string;noPhotoBody:string;photo:string;photoBody:string;photoStatus:string;cta:string};

const COPY:Record<Locale,Copy>={
 en:{title:'Choose your input method',intro:'Choose before continuing so the preview never implies photo analysis you did not use.',noPhoto:'Without a photo',noPhotoBody:'Use only your selected style, garment, palette and trip preferences. The result is preference-based and does not claim photo analysis.',photo:'With a photo',photoBody:'For the free preview, photo-based Personal Color runs only in your browser and the photo stays on your device. Secure paid photo styling is not available until private account, storage, consent and fulfillment infrastructure is verified.',photoStatus:'Photo mode selected. Run browser-local Personal Color first, then return and choose a named palette or use the verified color direction.',cta:'Open browser-local Personal Color'},
 'zh-CN':{title:'选择输入方式',intro:'请先选择方式，预览不会暗示你没有使用过的照片分析。',noPhoto:'不使用照片',noPhotoBody:'仅使用你选择的风格、服装、配色和行程偏好。结果基于偏好，不会声称进行了照片分析。',photo:'使用照片',photoBody:'免费预览中的个人色彩分析只在浏览器本地运行，照片留在设备上。安全的付费照片造型功能会在私有账号、存储、同意和履约基础设施验证完成后开放。',photoStatus:'已选择照片方式。请先运行浏览器本地个人色彩，再返回并选择明确配色或使用已验证的色彩方向。',cta:'打开浏览器本地个人色彩'},
 ja:{title:'入力方法を選択',intro:'写真分析を使っていないのに使ったように見せないため、先に入力方法を選んでください。',noPhoto:'写真を使わない',noPhotoBody:'選択したスタイル、衣装、配色、旅行条件だけを使います。結果は好みベースで、写真分析を行ったとは表示しません。',photo:'写真を使う',photoBody:'無料プレビューのパーソナルカラーはブラウザ内だけで処理され、写真は端末に残ります。安全な有料写真スタイリングは、非公開アカウント・保存・同意・生成基盤の検証後に提供します。',photoStatus:'写真モードを選択しました。まずブラウザ内のパーソナルカラーを実行し、戻って明示された配色または確認済みの色方向を選んでください。',cta:'ブラウザ内パーソナルカラーを開く'},
 'zh-TW':{title:'選擇輸入方式',intro:'請先選擇方式，預覽不會暗示你沒有使用過的照片分析。',noPhoto:'不使用照片',noPhotoBody:'只使用你選擇的風格、服裝、配色與行程偏好。結果以偏好為基礎，不會宣稱做過照片分析。',photo:'使用照片',photoBody:'免費預覽的個人色彩只在瀏覽器本地處理，照片留在裝置上。安全的付費照片造型會在私人帳號、儲存、同意與履約基礎設施驗證後提供。',photoStatus:'已選擇照片方式。請先執行瀏覽器本地個人色彩，再返回並選擇明確配色或使用已驗證的色彩方向。',cta:'開啟瀏覽器本地個人色彩'},
 vi:{title:'Chọn cách nhập dữ liệu',intro:'Hãy chọn trước để bản xem trước không ngụ ý đã phân tích ảnh khi bạn không dùng ảnh.',noPhoto:'Không dùng ảnh',noPhotoBody:'Chỉ dùng phong cách, trang phục, bảng màu và bối cảnh chuyến đi bạn chọn. Kết quả dựa trên sở thích và không tuyên bố đã phân tích ảnh.',photo:'Dùng ảnh',photoBody:'Trong bản xem trước miễn phí, Personal Color chỉ xử lý trong trình duyệt và ảnh vẫn ở trên thiết bị. Tạo kiểu ảnh trả phí an toàn chỉ mở sau khi hạ tầng tài khoản riêng, lưu trữ, đồng ý và hoàn tất kết quả được xác minh.',photoStatus:'Đã chọn chế độ ảnh. Hãy chạy Personal Color trong trình duyệt trước, sau đó quay lại và chọn bảng màu cụ thể hoặc hướng màu đã xác minh.',cta:'Mở Personal Color trong trình duyệt'},
 th:{title:'เลือกวิธีให้ข้อมูล',intro:'เลือกวิธีก่อนเพื่อไม่ให้พรีวิวสื่อว่ามีการวิเคราะห์รูปทั้งที่คุณไม่ได้ใช้รูป',noPhoto:'ไม่ใช้รูป',noPhotoBody:'ใช้เฉพาะสไตล์ ชุด พาเลต และบริบททริปที่คุณเลือก ผลลัพธ์อิงความชอบและจะไม่อ้างว่ามีการวิเคราะห์รูป',photo:'ใช้รูป',photoBody:'สำหรับพรีวิวฟรี Personal Color ประมวลผลในเบราว์เซอร์เท่านั้นและรูปยังอยู่บนอุปกรณ์ ฟีเจอร์แต่งลุคจากรูปแบบชำระเงินจะเปิดเมื่อระบบบัญชีส่วนตัว พื้นที่จัดเก็บ ความยินยอม และการส่งมอบได้รับการตรวจสอบแล้ว',photoStatus:'เลือกโหมดรูปแล้ว ให้ทำ Personal Color ในเบราว์เซอร์ก่อน จากนั้นกลับมาเลือกพาเลตที่ระบุหรือทิศทางสีที่ตรวจสอบแล้ว',cta:'เปิด Personal Color ในเบราว์เซอร์'}
};

const locales:Locale[]=['en','zh-CN','ja','zh-TW','vi','th'];

export function StyleInputModeChoice(){
 const rawLocale=useLocale();
 const locale=(locales.includes(rawLocale as Locale)?rawLocale:'en') as Locale;
 const c=COPY[locale];
 const [mode,setMode]=useState<Mode>('no-photo');
 return <fieldset aria-describedby="style-input-mode-intro" style={{border:'1px solid currentColor',borderRadius:12,padding:16,margin:'18px 0 24px'}}>
  <legend><strong>{c.title}</strong></legend>
  <p id="style-input-mode-intro">{c.intro}</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:12}}>
   <label style={{display:'block',border:'1px solid currentColor',borderRadius:10,padding:14}}><input type="radio" name="style-input-mode" value="no-photo" checked={mode==='no-photo'} onChange={()=>setMode('no-photo')}/> <strong>{c.noPhoto}</strong><span style={{display:'block',marginTop:6}}>{c.noPhotoBody}</span></label>
   <label style={{display:'block',border:'1px solid currentColor',borderRadius:10,padding:14}}><input type="radio" name="style-input-mode" value="photo" checked={mode==='photo'} onChange={()=>setMode('photo')}/> <strong>{c.photo}</strong><span style={{display:'block',marginTop:6}}>{c.photoBody}</span></label>
  </div>
  {mode==='photo'?<div role="status" style={{marginTop:12}}><p>{c.photoStatus}</p><Link className="secondaryButton" href="/color">{c.cta}</Link></div>:null}
 </fieldset>;
}
