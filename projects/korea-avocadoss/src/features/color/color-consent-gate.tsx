'use client';

import {useState} from 'react';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {ColorScanner} from './color-scanner';

type P0Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type ConsentCopy={title:string;body:string;local:string;retention:string;scope:string;agree:string;privacy:string};

const COPY:Record<P0Locale,ConsentCopy>={
  en:{title:'Before you choose a photo',body:'Personal Color uses your photo only inside this browser for a visible-color estimate.',local:'The photo is not uploaded to Korea Concierge or sent to an AI service.',retention:'It is kept only in this tab while you use the tool, and you can remove it at any time.',scope:'We do not infer race, ethnicity, nationality, health or attractiveness from your photo.',agree:'I understand — continue with a browser-local photo',privacy:'Read the privacy notice'},
  'zh-CN':{title:'选择照片前',body:'个人色彩功能只在此浏览器内使用照片来估计可见色彩。',local:'照片不会上传到 Korea Concierge，也不会发送给 AI 服务。',retention:'照片只会在你使用工具期间保留在当前标签页中，并可随时移除。',scope:'我们不会从照片推断种族、族裔、国籍、健康状况或吸引力。',agree:'我已了解——继续使用仅在浏览器处理的照片',privacy:'查看隐私说明'},
  ja:{title:'写真を選ぶ前に',body:'パーソナルカラー機能は、見た目の色を推定するためにこのブラウザ内だけで写真を使用します。',local:'写真は Korea Concierge にアップロードされず、AI サービスにも送信されません。',retention:'写真はツール使用中のこのタブ内だけに保持され、いつでも削除できます。',scope:'写真から人種、民族、国籍、健康状態、魅力度を推測しません。',agree:'理解しました — ブラウザ内処理の写真で続ける',privacy:'プライバシー説明を読む'},
  'zh-TW':{title:'選擇照片前',body:'個人色彩功能只會在此瀏覽器內使用照片估計可見色彩。',local:'照片不會上傳到 Korea Concierge，也不會傳送給 AI 服務。',retention:'照片只會在你使用工具期間保留於目前分頁，並可隨時移除。',scope:'我們不會從照片推斷種族、族裔、國籍、健康狀況或吸引力。',agree:'我已了解——繼續使用僅在瀏覽器處理的照片',privacy:'查看隱私說明'},
  vi:{title:'Trước khi chọn ảnh',body:'Personal Color chỉ dùng ảnh trong trình duyệt này để ước tính màu sắc nhìn thấy.',local:'Ảnh không được tải lên Korea Concierge và không được gửi tới dịch vụ AI.',retention:'Ảnh chỉ được giữ trong tab này khi bạn dùng công cụ và bạn có thể xóa bất cứ lúc nào.',scope:'Chúng tôi không suy đoán chủng tộc, sắc tộc, quốc tịch, sức khỏe hoặc mức độ hấp dẫn từ ảnh.',agree:'Tôi hiểu — tiếp tục với ảnh chỉ xử lý trong trình duyệt',privacy:'Đọc thông báo quyền riêng tư'},
  th:{title:'ก่อนเลือกรูป',body:'Personal Color ใช้รูปของคุณเฉพาะภายในเบราว์เซอร์นี้เพื่อประเมินสีที่มองเห็นได้',local:'รูปจะไม่ถูกอัปโหลดไปยัง Korea Concierge และไม่ถูกส่งไปยังบริการ AI',retention:'รูปจะอยู่เฉพาะในแท็บนี้ระหว่างที่ใช้เครื่องมือ และคุณลบได้ทุกเมื่อ',scope:'เราไม่อนุมานเชื้อชาติ ชาติพันธุ์ สัญชาติ สุขภาพ หรือความน่าดึงดูดจากรูปของคุณ',agree:'ฉันเข้าใจ — ดำเนินการต่อด้วยรูปที่ประมวลผลในเบราว์เซอร์เท่านั้น',privacy:'อ่านประกาศความเป็นส่วนตัว'},
};

export function ColorConsentGate(){
  const locale=useLocale();
  const p0=(locale in COPY?locale:'en') as P0Locale;
  const copy=COPY[p0];
  const [consented,setConsented]=useState(false);

  if(consented) return <ColorScanner/>;

  return (
    <section aria-labelledby="color-photo-consent-title" className="stitchColorConsentGate">
      <h2 id="color-photo-consent-title">{copy.title}</h2>
      <p>{copy.body}</p>
      <ul>
        <li>{copy.local}</li>
        <li>{copy.retention}</li>
        <li>{copy.scope}</li>
      </ul>
      <button type="button" className="button" onClick={()=>setConsented(true)}>{copy.agree}</button>
      <p><Link href="/privacy">{copy.privacy}</Link></p>
    </section>
  );
}
