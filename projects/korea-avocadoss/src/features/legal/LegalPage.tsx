import {Link} from '@/i18n/navigation';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
export type LegalKind='about'|'contact'|'privacy'|'terms';
type Section={title:string;body:string[]};
type Doc={title:string;updated:string;intro:string;sections:Section[];back:string};

const EN:Record<LegalKind,Doc>={
 about:{title:'About Korea Concierge',updated:'Updated September 9, 2026',intro:'Korea Concierge is a travel-and-culture website for international visitors who want practical, personalized help before and during a Korea trip.',sections:[{title:'What we build',body:['Free tools include browser-local Personal Color guidance, rule-based Hanbok matching, Gyeongbokgung route planning, sourced food/cafe discovery, Saju cultural exploration, Korean naming, and Quick Help.','Premium features are not treated as live until ownership, delivery, recovery and payment controls pass launch QA.']},{title:'Product principles',body:['Prefer deterministic/local processing when it is good enough. Keep AI calls optional and cost-controlled. Do not infer nationality, ethnicity, religion, health, emotion or other sensitive traits from a selfie or voice.','For changing travel and business information, show the source and verification date and ask visitors to re-check before traveling.']}],back:'Back to home'},
 contact:{title:'Contact & support',updated:'Updated September 9, 2026',intro:'Korea Concierge is still in pre-launch payment mode.',sections:[{title:'Before checkout opens',body:['We will not invent a merchant identity or support address. The legal merchant name, customer-support email, response channel and refund contact will be published here before real payment is enabled.','Until then, no page should represent live paid checkout as available.']},{title:'For travel information',body:['Opening hours, closures, inventory and restaurant details can change. Use the linked official source on the relevant page for same-day confirmation.']}],back:'Back to home'},
 privacy:{title:'Privacy',updated:'Updated September 9, 2026',intro:'The current pre-launch build minimizes data collection and keeps several personalization steps on the device.',sections:[{title:'Personal Color',body:['The free Personal Color preview processes the selected JPEG, PNG or WebP in your browser. Its current analysis path does not upload the selfie to an AI model or Korea Concierge server.','The result is a visible-color tendency, not an inference of race, ethnicity, nationality, health or identity.']},{title:'Saju & Naming',body:['The current Saju and Naming experiences use deterministic local/server application logic and do not require an LLM call. Birth time is not guessed when unknown.','Results are not persisted to an account in the current pre-launch build unless a future saved-result feature is explicitly enabled.']},{title:'Payments and accounts',body:['Real checkout is currently disabled. Before it opens, a dedicated Korea Concierge account/database environment, row-level ownership controls, durable payment-event handling and private paid-result delivery must be deployed and tested.','Payment-provider and account privacy details will be updated here before live checkout is enabled.']},{title:'Third-party links',body:['Official tourism, palace, image-source and other external links are operated by third parties and follow their own privacy policies.']}],back:'Back to home'},
 terms:{title:'Terms of use',updated:'Updated September 9, 2026',intro:'These pre-launch terms describe the current free website experience. Live paid checkout is not yet enabled.',sections:[{title:'Travel information',body:['Routes, hours, closures, restaurant information and rental availability can change. Korea Concierge provides planning assistance, not a guarantee of admission, inventory, price or operating hours. Re-check the linked official source before relying on time-sensitive information.']},{title:'Cultural tools',body:['Saju, zodiac and naming content is provided for cultural and entertainment purposes. It is not medical, legal, financial or other professional advice and should not be treated as a certain prediction.']},{title:'Personalization',body:['Personal Color and Hanbok outputs are style suggestions based on the inputs you provide and deterministic rules. They are not professional color diagnosis or an assessment of protected/sensitive personal traits.']},{title:'Paid products',body:['No real-money checkout should be available while the site is in pre-launch payment mode. Before payment opens, price, deliverables, merchant/support details, refund/cancellation handling and delivery terms will be shown clearly before purchase.']},{title:'External content',body:['Some visual references and travel facts link to licensed or official third-party sources. Their names, trademarks and external services remain subject to their respective owners and terms.']}],back:'Back to home'}
};

const LOCALIZED:Partial<Record<Locale,Partial<Record<LegalKind,{title:string;intro:string;back:string;sectionTitles:string[]}>>>>={
 'zh-CN':{
  about:{title:'关于 Korea Concierge',intro:'Korea Concierge 面向国际游客，提供韩国旅行与文化的实用个性化工具。',back:'返回首页',sectionTitles:['我们提供什么','产品原则']},
  contact:{title:'联系与支持',intro:'Korea Concierge 目前仍处于付款上线前阶段。',back:'返回首页',sectionTitles:['开放结账之前','旅行信息']},
  privacy:{title:'隐私',intro:'当前上线前版本尽量减少数据收集，并把多项个性化处理保留在设备本地。',back:'返回首页',sectionTitles:['个人色彩','四柱与韩国命名','付款与账户','第三方链接']},
  terms:{title:'使用条款',intro:'这些上线前条款适用于当前免费网站体验。真实付款尚未开放。',back:'返回首页',sectionTitles:['旅行信息','文化工具','个性化','付费产品','外部内容']}
 },
 ja:{
  about:{title:'Korea Concierge について',intro:'Korea Concierge は、海外からの旅行者向けに韓国旅行と文化の実用的なパーソナライズ支援を提供するウェブサイトです。',back:'ホームへ戻る',sectionTitles:['提供するもの','プロダクト原則']},
  contact:{title:'お問い合わせ・サポート',intro:'Korea Concierge は現在、決済プレローンチ段階です。',back:'ホームへ戻る',sectionTitles:['決済開始前','旅行情報について']},
  privacy:{title:'プライバシー',intro:'現在のプレローンチ版ではデータ収集を最小限にし、複数のパーソナライズ処理を端末内に保ちます。',back:'ホームへ戻る',sectionTitles:['パーソナルカラー','四柱・韓国名','決済・アカウント','外部リンク']},
  terms:{title:'利用規約',intro:'このプレローンチ規約は現在の無料サイト体験に適用されます。実決済はまだ有効ではありません。',back:'ホームへ戻る',sectionTitles:['旅行情報','文化ツール','パーソナライズ','有料商品','外部コンテンツ']}
 },
 'zh-TW':{
  about:{title:'關於 Korea Concierge',intro:'Korea Concierge 為國際旅客提供韓國旅行與文化的實用個人化工具。',back:'返回首頁',sectionTitles:['我們提供什麼','產品原則']},
  contact:{title:'聯絡與支援',intro:'Korea Concierge 目前仍處於付款上線前階段。',back:'返回首頁',sectionTitles:['開放結帳之前','旅遊資訊']},
  privacy:{title:'隱私',intro:'目前上線前版本盡量減少資料收集，並把多項個人化處理保留在裝置本機。',back:'返回首頁',sectionTitles:['個人色彩','四柱與韓國命名','付款與帳戶','第三方連結']},
  terms:{title:'使用條款',intro:'這些上線前條款適用於目前的免費網站體驗。真實付款尚未開放。',back:'返回首頁',sectionTitles:['旅遊資訊','文化工具','個人化','付費產品','外部內容']}
 },
 vi:{
  about:{title:'Về Korea Concierge',intro:'Korea Concierge là website du lịch và văn hóa dành cho khách quốc tế muốn có trợ giúp thực tế, cá nhân hóa khi đến Hàn Quốc.',back:'Về trang chủ',sectionTitles:['Chúng tôi xây dựng gì','Nguyên tắc sản phẩm']},
  contact:{title:'Liên hệ & hỗ trợ',intro:'Korea Concierge hiện vẫn ở giai đoạn trước khi mở thanh toán.',back:'Về trang chủ',sectionTitles:['Trước khi mở checkout','Thông tin du lịch']},
  privacy:{title:'Quyền riêng tư',intro:'Bản pre-launch hiện tại giảm tối đa việc thu thập dữ liệu và giữ nhiều bước cá nhân hóa trên thiết bị.',back:'Về trang chủ',sectionTitles:['Personal Color','Saju & đặt tên Hàn','Thanh toán & tài khoản','Liên kết bên thứ ba']},
  terms:{title:'Điều khoản sử dụng',intro:'Các điều khoản pre-launch này áp dụng cho trải nghiệm miễn phí hiện tại. Thanh toán thật chưa được bật.',back:'Về trang chủ',sectionTitles:['Thông tin du lịch','Công cụ văn hóa','Cá nhân hóa','Sản phẩm trả phí','Nội dung bên ngoài']}
 },
 th:{
  about:{title:'เกี่ยวกับ Korea Concierge',intro:'Korea Concierge เป็นเว็บไซต์ท่องเที่ยวและวัฒนธรรมสำหรับนักท่องเที่ยวต่างชาติที่ต้องการความช่วยเหลือแบบใช้งานจริงและปรับตามความต้องการในเกาหลี',back:'กลับหน้าแรก',sectionTitles:['สิ่งที่เราสร้าง','หลักการผลิตภัณฑ์']},
  contact:{title:'ติดต่อและช่วยเหลือ',intro:'Korea Concierge ยังอยู่ในช่วงก่อนเปิดระบบชำระเงินจริง',back:'กลับหน้าแรก',sectionTitles:['ก่อนเปิด checkout','ข้อมูลท่องเที่ยว']},
  privacy:{title:'ความเป็นส่วนตัว',intro:'รุ่น pre-launch ปัจจุบันลดการเก็บข้อมูลและเก็บขั้นตอนการปรับแต่งหลายส่วนไว้บนอุปกรณ์',back:'กลับหน้าแรก',sectionTitles:['Personal Color','ซาจูและการตั้งชื่อเกาหลี','การชำระเงินและบัญชี','ลิงก์ภายนอก']},
  terms:{title:'ข้อกำหนดการใช้งาน',intro:'ข้อกำหนด pre-launch นี้ใช้กับประสบการณ์ฟรีในปัจจุบัน ระบบชำระเงินจริงยังไม่เปิด',back:'กลับหน้าแรก',sectionTitles:['ข้อมูลท่องเที่ยว','เครื่องมือวัฒนธรรม','การปรับแต่ง','ผลิตภัณฑ์แบบชำระเงิน','เนื้อหาภายนอก']}
 }
};

export function LegalPage({locale,kind}:{locale:string;kind:LegalKind}){
 const l=(locale in LOCALIZED?locale:'en') as Locale;const base=EN[kind];const local=LOCALIZED[l]?.[kind];
 return <main style={{maxWidth:900,margin:'0 auto',padding:'44px 20px 80px'}}><header><h1>{local?.title??base.title}</h1><p>{local?.intro??base.intro}</p><small>{base.updated}</small></header><div style={{display:'grid',gap:24,marginTop:32}}>{base.sections.map((section,index)=><section key={section.title}><h2>{local?.sectionTitles[index]??section.title}</h2>{section.body.map(p=><p key={p}>{p}</p>)}</section>)}</div><Link className="secondaryButton" href="/">{local?.back??base.back}</Link></main>;
}
