'use client';

import {useEffect,useMemo,useState} from 'react';
import {useLocale} from 'next-intl';
import {rankHanbokCatalog,type HanbokCatalogComfort,type HanbokCatalogDestination,type HanbokCatalogMood,type HanbokCatalogSeason} from './rank-catalog';
import type {HanbokMatcherColorId,PersonalColorContrast,PersonalColorDepth} from './personal-color-bridge';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Copy={title:string;intro:string;source:string;license:string;palette:string;reference:string;notice:string;save:string;saved:string;compare:string;remove:string;compareTitle:string;compareHint:string;maxCompare:string;clearCompare:string;walking:string;seasons:string;location:string};
const C:Record<Locale,Copy>={
 en:{title:'Visual references from the curated catalog',intro:'Your same choices also re-rank our source-checked 12-look visual catalog. The first six are shown below.',source:'Source',license:'License',palette:'Palette',reference:'Hanbok visual reference',notice:'These are styling references, not a promise that a specific rental shop stocks the exact garment. Confirm inventory with the shop.',save:'Save look',saved:'Saved',compare:'Compare',remove:'Remove',compareTitle:'Compare selected Hanbok directions',compareHint:'Select 2–3 looks to compare palette, walking comfort, season and palace setting.',maxCompare:'You can compare up to 3 looks at once.',clearCompare:'Clear comparison',walking:'Walking',seasons:'Season',location:'Palace setting'},
 'zh-CN':{title:'精选目录视觉参考',intro:'同一组选项也会重新排序我们已核对来源的12套视觉目录，下面显示前6套。',source:'来源',license:'许可',palette:'配色',reference:'韩服视觉参考',notice:'这些是造型参考，不代表某家租赁店一定有完全相同的服装。请向店家确认库存。',save:'收藏造型',saved:'已收藏',compare:'比较',remove:'移除',compareTitle:'比较已选韩服方向',compareHint:'选择2–3套，对比配色、步行舒适度、季节和宫殿场景。',maxCompare:'一次最多比较3套。',clearCompare:'清除比较',walking:'步行舒适度',seasons:'季节',location:'宫殿场景'},
 ja:{title:'選定カタログのビジュアル参考',intro:'同じ選択内容で、出典確認済み12ルックのカタログも再ランキングします。上位6件を表示します。',source:'出典',license:'ライセンス',palette:'配色',reference:'韓服ビジュアル参考',notice:'スタイリングの参考であり、特定のレンタル店に同一衣装があることを保証するものではありません。在庫は店舗で確認してください。',save:'ルックを保存',saved:'保存済み',compare:'比較',remove:'外す',compareTitle:'選んだ韓服を比較',compareHint:'2～3件選んで配色・歩きやすさ・季節・宮殿背景を比較します。',maxCompare:'一度に比較できるのは3件までです。',clearCompare:'比較をクリア',walking:'歩きやすさ',seasons:'季節',location:'宮殿背景'},
 'zh-TW':{title:'精選目錄視覺參考',intro:'同一組選項也會重新排序已核對來源的12套視覺目錄，以下顯示前6套。',source:'來源',license:'授權',palette:'配色',reference:'韓服視覺參考',notice:'這些是造型參考，不代表特定租借店一定有完全相同的服裝。請向店家確認庫存。',save:'收藏造型',saved:'已收藏',compare:'比較',remove:'移除',compareTitle:'比較已選韓服方向',compareHint:'選擇2–3套，比較配色、步行舒適度、季節與宮殿場景。',maxCompare:'一次最多比較3套。',clearCompare:'清除比較',walking:'步行舒適度',seasons:'季節',location:'宮殿場景'},
 vi:{title:'Tham khảo hình ảnh từ danh mục tuyển chọn',intro:'Các lựa chọn của bạn cũng xếp lại danh mục 12 look đã kiểm tra nguồn. Sáu lựa chọn đầu được hiển thị bên dưới.',source:'Nguồn',license:'Giấy phép',palette:'Bảng màu',reference:'Hình tham khảo Hanbok',notice:'Đây là tham khảo phong cách, không đảm bảo một cửa hàng cho thuê cụ thể có đúng bộ trang phục. Hãy xác nhận tồn kho với cửa hàng.',save:'Lưu look',saved:'Đã lưu',compare:'So sánh',remove:'Bỏ',compareTitle:'So sánh các hướng Hanbok đã chọn',compareHint:'Chọn 2–3 look để so sánh màu, độ tiện khi đi bộ, mùa và bối cảnh cung điện.',maxCompare:'Chỉ có thể so sánh tối đa 3 look cùng lúc.',clearCompare:'Xóa so sánh',walking:'Đi bộ',seasons:'Mùa',location:'Bối cảnh cung điện'},
 th:{title:'ภาพอ้างอิงจากแคตตาล็อกที่คัดสรร',intro:'ตัวเลือกเดียวกันจะจัดอันดับแคตตาล็อก 12 ลุคที่ตรวจสอบแหล่งข้อมูลแล้วใหม่ โดยแสดง 6 อันดับแรกด้านล่าง',source:'แหล่งที่มา',license:'สัญญาอนุญาต',palette:'พาเลตสี',reference:'ภาพอ้างอิงฮันบก',notice:'เป็นเพียงแนวทางสไตล์ ไม่ได้ยืนยันว่าร้านเช่าร้านใดมีชุดตรงแบบ กรุณาตรวจสอบสต็อกกับร้านโดยตรง',save:'บันทึกลุค',saved:'บันทึกแล้ว',compare:'เปรียบเทียบ',remove:'นำออก',compareTitle:'เปรียบเทียบทิศทางฮันบกที่เลือก',compareHint:'เลือก 2–3 ลุคเพื่อเทียบสี ความสบายในการเดิน ฤดู และฉากพระราชวัง',maxCompare:'เปรียบเทียบได้สูงสุด 3 ลุคต่อครั้ง',clearCompare:'ล้างการเปรียบเทียบ',walking:'การเดิน',seasons:'ฤดู',location:'ฉากพระราชวัง'}
};
const FAVORITES_KEY='kc-hanbok-favorites-v1';

type Props={color:HanbokMatcherColorId;mood:HanbokCatalogMood;comfort:HanbokCatalogComfort;destination:HanbokCatalogDestination;season:HanbokCatalogSeason;depth?:PersonalColorDepth;contrast?:PersonalColorContrast};

export function HanbokCatalogResults({color,mood,comfort,destination,season,depth,contrast}:Props){
 const locale=useLocale();const l=(locale in C?locale:'en') as Locale;const c=C[l];
 const fullRanked=useMemo(()=>rankHanbokCatalog({color,mood,comfort,destination,season,personalColor:{depth,contrast}}),[color,mood,comfort,destination,season,depth,contrast]);
 const ranked=fullRanked.slice(0,6);
 const [favorites,setFavorites]=useState<Set<string>>(new Set());
 const [compareIds,setCompareIds]=useState<Set<string>>(new Set());
 const [message,setMessage]=useState('');
 useEffect(()=>{try{const raw=localStorage.getItem(FAVORITES_KEY);if(raw){const ids=JSON.parse(raw);if(Array.isArray(ids))setFavorites(new Set(ids.filter((id):id is string=>typeof id==='string')));}}catch{}},[]);
 useEffect(()=>{const visible=new Set(ranked.map(item=>item.look.id));setCompareIds(previous=>new Set([...previous].filter(id=>visible.has(id))));},[color,mood,comfort,destination,season,depth,contrast]);
 function toggleFavorite(id:string){setFavorites(previous=>{const next=new Set(previous);if(next.has(id))next.delete(id);else next.add(id);try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...next]));}catch{}return next;});}
 function toggleCompare(id:string){setMessage('');setCompareIds(previous=>{const next=new Set(previous);if(next.has(id)){next.delete(id);return next;}if(next.size>=3){setMessage(c.maxCompare);return previous;}next.add(id);return next;});}
 const compared=fullRanked.filter(item=>compareIds.has(item.look.id));
 return <section style={{marginTop:26}} aria-live="polite">
  <h4>{c.title}</h4><p>{c.intro}</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:14}}>
   {ranked.map(({look},index)=>{const saved=favorites.has(look.id),selected=compareIds.has(look.id);return <article key={look.id} style={{border:selected?'2px solid currentColor':'1px solid rgba(0,0,0,.12)',borderRadius:12,overflow:'hidden',background:'#fff'}}>
    <img src={look.src} alt={`${c.reference} ${index+1}`} referrerPolicy="no-referrer" style={{display:'block',width:'100%',aspectRatio:'4/5',objectFit:'cover',objectPosition:look.cropPosition}}/>
    <div style={{padding:14}}><strong>#{index+1} · {look.title}</strong><p><small>{c.palette}</small><br/>{look.palette.top}<br/>{look.palette.bottom}<br/>{look.palette.accent}</p>
     <div style={{display:'flex',gap:8,flexWrap:'wrap',margin:'12px 0'}}><button type="button" className="secondaryButton" aria-pressed={saved} onClick={()=>toggleFavorite(look.id)}>{saved?c.saved:c.save}</button><button type="button" className="secondaryButton" aria-pressed={selected} onClick={()=>toggleCompare(look.id)}>{selected?c.remove:c.compare}</button></div>
     <p><small>{c.source}: {look.creator}<br/>{c.license}: {look.license}</small></p><a href={look.sourceUrl} target="_blank" rel="noreferrer">{c.source} ↗</a></div>
   </article>})}
  </div>
  {message?<p role="status"><strong>{message}</strong></p>:null}
  <div style={{marginTop:20,border:'1px solid rgba(0,0,0,.14)',borderRadius:12,padding:16}}>
   <div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'start',flexWrap:'wrap'}}><div><h4 style={{marginTop:0}}>{c.compareTitle}</h4><p>{c.compareHint}</p></div>{compareIds.size?<button type="button" className="secondaryButton" onClick={()=>{setCompareIds(new Set());setMessage('');}}>{c.clearCompare}</button>:null}</div>
   {compared.length>=2?<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:12}}>{compared.map(({look})=><article key={look.id} style={{padding:12,border:'1px solid rgba(0,0,0,.1)',borderRadius:10}}><img src={look.src} alt={look.alt} referrerPolicy="no-referrer" style={{width:'100%',aspectRatio:'4/5',objectFit:'cover',objectPosition:look.cropPosition,borderRadius:8}}/><h5>{look.title}</h5><p><strong>{c.palette}</strong><br/>{look.palette.top}<br/>{look.palette.bottom}<br/>{look.palette.accent}</p><p><strong>{c.walking}</strong>: {look.walkingSuitability}<br/><strong>{c.seasons}</strong>: {look.seasons.join(', ')}<br/><strong>{c.location}</strong>: {look.recommendedLocation.name}</p></article>)}</div>:<p><small>{c.compareHint}</small></p>}
  </div>
  <p style={{marginTop:12}}><small>{c.notice}</small></p>
 </section>;
}
