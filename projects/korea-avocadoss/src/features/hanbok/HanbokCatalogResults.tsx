'use client';

import {useEffect,useMemo,useState} from 'react';
import {useLocale} from 'next-intl';
import {getHanbokCatalogPresentation} from './catalog-localization';
import {rankHanbokCatalog,type HanbokCatalogComfort,type HanbokCatalogDestination,type HanbokCatalogMood,type HanbokCatalogSeason} from './rank-catalog';
import type {HanbokMatcherColorId,PersonalColorContrast,PersonalColorDepth} from './personal-color-bridge';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Copy={title:string;intro:string;source:string;license:string;palette:string;reference:string;notice:string;save:string;saved:string;compare:string;remove:string;compareTitle:string;compareHint:string;maxCompare:string;clearCompare:string;walking:string;seasons:string;location:string;requestCard:string;requestHelp:string;copyRequest:string;copiedRequest:string;shopCheck:string};
const C:Record<Locale,Copy>={
 en:{title:'Visual references from the curated catalog',intro:'Your same choices also re-rank our source-checked catalog. The first six are shown below.',source:'Source',license:'License',palette:'Palette',reference:'Hanbok visual reference',notice:'These are styling references, not a promise that a specific rental shop stocks the exact garment. Confirm inventory with the shop.',save:'Save look',saved:'Saved',compare:'Compare',remove:'Remove',compareTitle:'Compare selected Hanbok directions',compareHint:'Select 2–3 looks to compare palette, walking comfort, season and palace setting.',maxCompare:'You can compare up to 3 looks at once.',clearCompare:'Clear comparison',walking:'Walking',seasons:'Season',location:'Palace setting',requestCard:'Korean rental request card',requestHelp:'Open this at the rental shop or copy the Korean request for staff.',copyRequest:'Copy Korean request',copiedRequest:'Korean request copied',shopCheck:'Exact stock, design and any extra fee must still be confirmed with the shop.'},
 'zh-CN':{title:'精选目录视觉参考',intro:'同一组选项也会重新排序我们已核对来源的视觉目录，下面显示前6套。',source:'来源',license:'许可',palette:'配色',reference:'韩服视觉参考',notice:'这些是造型参考，不代表某家租赁店一定有完全相同的服装。请向店家确认库存。',save:'收藏造型',saved:'已收藏',compare:'比较',remove:'移除',compareTitle:'比较已选韩服方向',compareHint:'选择2–3套，对比配色、步行舒适度、季节和宫殿场景。',maxCompare:'一次最多比较3套。',clearCompare:'清除比较',walking:'步行舒适度',seasons:'季节',location:'宫殿场景',requestCard:'韩文租赁请求卡',requestHelp:'到店时可以直接打开给工作人员看，或复制韩文请求。',copyRequest:'复制韩文请求',copiedRequest:'已复制韩文请求',shopCheck:'实际库存、设计以及是否有额外费用仍需向店铺确认。'},
 ja:{title:'選定カタログのビジュアル参考',intro:'同じ選択内容で、出典確認済みのビジュアルカタログも再ランキングします。上位6件を表示します。',source:'出典',license:'ライセンス',palette:'配色',reference:'韓服ビジュアル参考',notice:'スタイリングの参考であり、特定のレンタル店に同一衣装があることを保証するものではありません。在庫は店舗で確認してください。',save:'ルックを保存',saved:'保存済み',compare:'比較',remove:'外す',compareTitle:'選んだ韓服を比較',compareHint:'2～3件選んで配色・歩きやすさ・季節・宮殿背景を比較します。',maxCompare:'一度に比較できるのは3件までです。',clearCompare:'比較をクリア',walking:'歩きやすさ',seasons:'季節',location:'宮殿背景',requestCard:'韓国語レンタル依頼カード',requestHelp:'レンタル店でそのまま見せるか、韓国語の依頼文をコピーできます。',copyRequest:'韓国語依頼をコピー',copiedRequest:'韓国語依頼をコピーしました',shopCheck:'実際の在庫・デザイン・追加料金は店舗で確認してください。'},
 'zh-TW':{title:'精選目錄視覺參考',intro:'同一組選項也會重新排序已核對來源的視覺目錄，以下顯示前6套。',source:'來源',license:'授權',palette:'配色',reference:'韓服視覺參考',notice:'這些是造型參考，不代表特定租借店一定有完全相同的服裝。請向店家確認庫存。',save:'收藏造型',saved:'已收藏',compare:'比較',remove:'移除',compareTitle:'比較已選韓服方向',compareHint:'選擇2–3套，比較配色、步行舒適度、季節與宮殿場景。',maxCompare:'一次最多比較3套。',clearCompare:'清除比較',walking:'步行舒適度',seasons:'季節',location:'宮殿場景',requestCard:'韓文租借需求卡',requestHelp:'到店時可直接打開給工作人員看，或複製韓文需求。',copyRequest:'複製韓文需求',copiedRequest:'已複製韓文需求',shopCheck:'實際庫存、設計以及是否有額外費用仍需向店家確認。'},
 vi:{title:'Tham khảo hình ảnh từ danh mục tuyển chọn',intro:'Các lựa chọn của bạn cũng xếp lại danh mục hình ảnh đã kiểm tra nguồn. Sáu lựa chọn đầu được hiển thị bên dưới.',source:'Nguồn',license:'Giấy phép',palette:'Bảng màu',reference:'Hình tham khảo Hanbok',notice:'Đây là tham khảo phong cách, không đảm bảo một cửa hàng cho thuê cụ thể có đúng bộ trang phục. Hãy xác nhận tồn kho với cửa hàng.',save:'Lưu look',saved:'Đã lưu',compare:'So sánh',remove:'Bỏ',compareTitle:'So sánh các hướng Hanbok đã chọn',compareHint:'Chọn 2–3 look để so sánh màu, độ tiện khi đi bộ, mùa và bối cảnh cung điện.',maxCompare:'Chỉ có thể so sánh tối đa 3 look cùng lúc.',clearCompare:'Xóa so sánh',walking:'Đi bộ',seasons:'Mùa',location:'Bối cảnh cung điện',requestCard:'Thẻ yêu cầu thuê bằng tiếng Hàn',requestHelp:'Mở thẻ này cho nhân viên cửa hàng xem hoặc sao chép yêu cầu tiếng Hàn.',copyRequest:'Sao chép yêu cầu tiếng Hàn',copiedRequest:'Đã sao chép yêu cầu tiếng Hàn',shopCheck:'Vẫn cần xác nhận mẫu thực tế, tồn kho và mọi khoản phụ phí với cửa hàng.'},
 th:{title:'ภาพอ้างอิงจากแคตตาล็อกที่คัดสรร',intro:'ตัวเลือกเดียวกันจะจัดอันดับแคตตาล็อกภาพที่ตรวจสอบแหล่งข้อมูลแล้วใหม่ โดยแสดง 6 อันดับแรกด้านล่าง',source:'แหล่งที่มา',license:'สัญญาอนุญาต',palette:'พาเลตสี',reference:'ภาพอ้างอิงฮันบก',notice:'เป็นเพียงแนวทางสไตล์ ไม่ได้ยืนยันว่าร้านเช่าร้านใดมีชุดตรงแบบ กรุณาตรวจสอบสต็อกกับร้านโดยตรง',save:'บันทึกลุค',saved:'บันทึกแล้ว',compare:'เปรียบเทียบ',remove:'นำออก',compareTitle:'เปรียบเทียบทิศทางฮันบกที่เลือก',compareHint:'เลือก 2–3 ลุคเพื่อเทียบสี ความสบายในการเดิน ฤดู และฉากพระราชวัง',maxCompare:'เปรียบเทียบได้สูงสุด 3 ลุคต่อครั้ง',clearCompare:'ล้างการเปรียบเทียบ',walking:'การเดิน',seasons:'ฤดู',location:'ฉากพระราชวัง',requestCard:'การ์ดคำขอเช่าภาษาเกาหลี',requestHelp:'เปิดให้พนักงานร้านดูได้โดยตรง หรือคัดลอกข้อความภาษาเกาหลี',copyRequest:'คัดลอกคำขอภาษาเกาหลี',copiedRequest:'คัดลอกคำขอภาษาเกาหลีแล้ว',shopCheck:'ยังต้องยืนยันสต็อก แบบจริง และค่าใช้จ่ายเพิ่มเติมกับร้านโดยตรง'}
};
const FAVORITES_KEY='kc-hanbok-favorites-v1';
const RENTAL_CONFIRMATION_KO='※ 동일한 색상/디자인 재고와 추가 요금이 있는지 먼저 확인 부탁드립니다.';

type Props={color:HanbokMatcherColorId;mood:HanbokCatalogMood;comfort:HanbokCatalogComfort;destination:HanbokCatalogDestination;season:HanbokCatalogSeason;depth?:PersonalColorDepth;contrast?:PersonalColorContrast};

function paletteValue(locale:Locale,value:string){if(locale==='en')return value;return value.match(/#[0-9A-F]{6}/i)?.[0]??value;}

export function HanbokCatalogResults({color,mood,comfort,destination,season,depth,contrast}:Props){
 const locale=useLocale();const l=(locale in C?locale:'en') as Locale;const c=C[l];
 const fullRanked=useMemo(()=>rankHanbokCatalog({color,mood,comfort,destination,season,personalColor:{depth,contrast}}),[color,mood,comfort,destination,season,depth,contrast]);
 const ranked=fullRanked.slice(0,6);
 const [favorites,setFavorites]=useState<Set<string>>(new Set());
 const [compareIds,setCompareIds]=useState<Set<string>>(new Set());
 const [message,setMessage]=useState('');
 const [copiedRequestId,setCopiedRequestId]=useState('');
 useEffect(()=>{try{const raw=localStorage.getItem(FAVORITES_KEY);if(raw){const ids=JSON.parse(raw);if(Array.isArray(ids))setFavorites(new Set(ids.filter((id):id is string=>typeof id==='string')));}}catch{}},[]);
 useEffect(()=>{const visible=new Set(ranked.map(item=>item.look.id));setCompareIds(previous=>new Set([...previous].filter(id=>visible.has(id))));setCopiedRequestId('');},[color,mood,comfort,destination,season,depth,contrast]);
 function toggleFavorite(id:string){setFavorites(previous=>{const next=new Set(previous);if(next.has(id))next.delete(id);else next.add(id);try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...next]));}catch{}return next;});}
 function toggleCompare(id:string){setMessage('');setCompareIds(previous=>{const next=new Set(previous);if(next.has(id)){next.delete(id);return next;}if(next.size>=3){setMessage(c.maxCompare);return previous;}next.add(id);return next;});}
 async function copyRentalRequest(id:string,title:string,note:string){const text=`${title}\n\n${note}\n\n${RENTAL_CONFIRMATION_KO}`;try{await navigator.clipboard?.writeText(text);setCopiedRequestId(id);setMessage(c.copiedRequest);}catch{setCopiedRequestId('');}}
 const compared=fullRanked.filter(item=>compareIds.has(item.look.id));
 return <section style={{marginTop:26}} aria-live="polite">
  <h4>{c.title}</h4><p>{c.intro}</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
   {ranked.map(({look},index)=>{const p=getHanbokCatalogPresentation(l,look),saved=favorites.has(look.id),selected=compareIds.has(look.id),requestCopied=copiedRequestId===look.id;return <article key={look.id} style={{border:selected?'2px solid currentColor':'1px solid rgba(0,0,0,.12)',borderRadius:12,overflow:'hidden',background:'#fff'}}>
    <img src={look.src} alt={p.alt} referrerPolicy="no-referrer" style={{display:'block',width:'100%',aspectRatio:'4/5',objectFit:'cover',objectPosition:look.cropPosition}}/>
    <div style={{padding:14}}><strong>#{index+1} · {p.title}</strong><p>{p.description}</p><p><small>{c.palette}</small><br/>{paletteValue(l,look.palette.top)}<br/>{paletteValue(l,look.palette.bottom)}<br/>{paletteValue(l,look.palette.accent)}</p>
     <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}><button type="button" className="secondaryButton" aria-pressed={saved} onClick={()=>toggleFavorite(look.id)}>{saved?c.saved:c.save}</button><button type="button" className="secondaryButton" aria-pressed={selected} onClick={()=>toggleCompare(look.id)}>{selected?c.remove:c.compare}</button></div>
     <details style={{margin:'14px 0',padding:'10px 0',borderTop:'1px solid rgba(0,0,0,.08)',borderBottom:'1px solid rgba(0,0,0,.08)'}}><summary><strong>{c.requestCard}</strong></summary><p><small>{c.requestHelp}</small></p><div lang="ko" style={{whiteSpace:'pre-line',padding:10,background:'rgba(0,0,0,.035)',borderRadius:8}}><strong>{look.rentalShopCard.hangulTitle}</strong><br/><br/>{look.rentalShopCard.hangulStaffNote}<br/><br/>{RENTAL_CONFIRMATION_KO}</div><p><small>{c.shopCheck}</small></p><button type="button" className="secondaryButton" onClick={()=>copyRentalRequest(look.id,look.rentalShopCard.hangulTitle,look.rentalShopCard.hangulStaffNote)}>{requestCopied?c.copiedRequest:c.copyRequest}</button></details>
     <p><small>{c.source}: {look.creator}<br/>{c.license}: {look.license}</small></p><a href={look.sourceUrl} target="_blank" rel="noreferrer">{c.source} ↗</a></div>
   </article>})}
  </div>
  {message?<p role="status"><strong>{message}</strong></p>:null}
  <div style={{marginTop:20,border:'1px solid rgba(0,0,0,.14)',borderRadius:12,padding:16}}>
   <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'start',flexWrap:'wrap'}}><div><h4 style={{marginTop:0}}>{c.compareTitle}</h4><p>{c.compareHint}</p></div>{compareIds.size?<button type="button" className="secondaryButton" onClick={()=>{setCompareIds(new Set());setMessage('');}}>{c.clearCompare}</button>:null}</div>
   {compared.length>=2?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12}}>{compared.map(({look})=>{const p=getHanbokCatalogPresentation(l,look);return <article key={look.id} style={{padding:12,border:'1px solid rgba(0,0,0,.1)',borderRadius:10}}><img src={look.src} alt={p.alt} referrerPolicy="no-referrer" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover',objectPosition:look.cropPosition,borderRadius:8}}/><h5>{p.title}</h5><p><strong>{c.palette}</strong><br/>{paletteValue(l,look.palette.top)}<br/>{paletteValue(l,look.palette.bottom)}<br/>{paletteValue(l,look.palette.accent)}</p><p><strong>{c.walking}</strong>: {p.walking}<br/><strong>{c.seasons}</strong>: {p.seasons.join(', ')}<br/><strong>{c.location}</strong>: {p.location}</p></article>})}</div>:<p><small>{c.compareHint}</small></p>}
  </div>
  <p style={{marginTop:12}}><small>{c.notice}</small></p>
 </section>;
}
