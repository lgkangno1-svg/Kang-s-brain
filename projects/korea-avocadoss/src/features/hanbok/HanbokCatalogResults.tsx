'use client';

import {useLocale} from 'next-intl';
import {rankHanbokCatalog,type HanbokCatalogComfort,type HanbokCatalogDestination,type HanbokCatalogMood,type HanbokCatalogSeason} from './rank-catalog';
import type {HanbokMatcherColorId} from './personal-color-bridge';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Copy={title:string;intro:string;source:string;license:string;palette:string;reference:string;notice:string};
const C:Record<Locale,Copy>={
 en:{title:'Visual references from the curated catalog',intro:'Your same choices also re-rank our source-checked 12-look visual catalog. The first six are shown below.',source:'Source',license:'License',palette:'Palette',reference:'Hanbok visual reference',notice:'These are styling references, not a promise that a specific rental shop stocks the exact garment. Confirm inventory with the shop.'},
 'zh-CN':{title:'精选目录视觉参考',intro:'同一组选项也会重新排序我们已核对来源的12套视觉目录，下面显示前6套。',source:'来源',license:'许可',palette:'配色',reference:'韩服视觉参考',notice:'这些是造型参考，不代表某家租赁店一定有完全相同的服装。请向店家确认库存。'},
 ja:{title:'選定カタログのビジュアル参考',intro:'同じ選択内容で、出典確認済み12ルックのカタログも再ランキングします。上位6件を表示します。',source:'出典',license:'ライセンス',palette:'配色',reference:'韓服ビジュアル参考',notice:'スタイリングの参考であり、特定のレンタル店に同一衣装があることを保証するものではありません。在庫は店舗で確認してください。'},
 'zh-TW':{title:'精選目錄視覺參考',intro:'同一組選項也會重新排序已核對來源的12套視覺目錄，以下顯示前6套。',source:'來源',license:'授權',palette:'配色',reference:'韓服視覺參考',notice:'這些是造型參考，不代表特定租借店一定有完全相同的服裝。請向店家確認庫存。'},
 vi:{title:'Tham khảo hình ảnh từ danh mục tuyển chọn',intro:'Các lựa chọn của bạn cũng xếp lại danh mục 12 look đã kiểm tra nguồn. Sáu lựa chọn đầu được hiển thị bên dưới.',source:'Nguồn',license:'Giấy phép',palette:'Bảng màu',reference:'Hình tham khảo Hanbok',notice:'Đây là tham khảo phong cách, không đảm bảo một cửa hàng cho thuê cụ thể có đúng bộ trang phục. Hãy xác nhận tồn kho với cửa hàng.'},
 th:{title:'ภาพอ้างอิงจากแคตตาล็อกที่คัดสรร',intro:'ตัวเลือกเดียวกันจะจัดอันดับแคตตาล็อก 12 ลุคที่ตรวจสอบแหล่งข้อมูลแล้วใหม่ โดยแสดง 6 อันดับแรกด้านล่าง',source:'แหล่งที่มา',license:'สัญญาอนุญาต',palette:'พาเลตสี',reference:'ภาพอ้างอิงฮันบก',notice:'เป็นเพียงแนวทางสไตล์ ไม่ได้ยืนยันว่าร้านเช่าร้านใดมีชุดตรงแบบ กรุณาตรวจสอบสต็อกกับร้านโดยตรง'}
};

export function HanbokCatalogResults({color,mood,comfort,destination,season}:{color:HanbokMatcherColorId;mood:HanbokCatalogMood;comfort:HanbokCatalogComfort;destination:HanbokCatalogDestination;season:HanbokCatalogSeason}){
 const locale=useLocale();const l=(locale in C?locale:'en') as Locale;const c=C[l];
 const ranked=rankHanbokCatalog({color,mood,comfort,destination,season}).slice(0,6);
 return <section style={{marginTop:26}} aria-live="polite">
  <h4>{c.title}</h4><p>{c.intro}</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
   {ranked.map(({look},index)=><article key={look.id} style={{border:'1px solid rgba(0,0,0,.12)',borderRadius:12,overflow:'hidden',background:'#fff'}}>
    <img src={look.src} alt={`${c.reference} ${index+1}`} referrerPolicy="no-referrer" style={{display:'block',width:'100%',aspectRatio:'4/5',objectFit:'cover',objectPosition:look.cropPosition}}/>
    <div style={{padding:14}}><strong>#{index+1} · {look.title}</strong><p><small>{c.palette}</small><br/>{look.palette.top}<br/>{look.palette.bottom}<br/>{look.palette.accent}</p><p><small>{c.source}: {look.creator}<br/>{c.license}: {look.license}</small></p><a href={look.sourceUrl} target="_blank" rel="noreferrer">{c.source} ↗</a></div>
   </article>)}
  </div>
  <p style={{marginTop:12}}><small>{c.notice}</small></p>
 </section>;
}
