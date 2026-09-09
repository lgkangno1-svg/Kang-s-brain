'use client';

import {useEffect,useMemo,useState} from 'react';
import {useLocale} from 'next-intl';
import {useSearchParams} from 'next/navigation';
import {hanbokRentalAvailabilityAt,hanbokRentalMapHref,type HanbokRentalLanguage,type HanbokRentalShop} from '@/lib/travel/gyeongbokgung-hanbok-rentals';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Copy={title:string;intro:string;date:string;time:string;language:string;any:string;english:string;japanese:string;chinese:string;available:string;price:string;from:string;hours:string;support:string;map:string;source:string;checked:string;copy:string;copied:string;open:string;closed:string;recheck:string;none:string;notice:string;save:string;saved:string;showSaved:string;storageNote:string};
const C:Record<Locale,Copy>={
 en:{title:'Hanbok rental finder',intro:'Compare source-checked rental shops around Gyeongbokgung before you go. No booking API is used.',date:'Visit date',time:'Expected shop arrival',language:'Verified in-person language help',any:'Any',english:'English',japanese:'Japanese',chinese:'Chinese',available:'Hide clearly closed shops',price:'Rental price',from:'from',hours:'Hours',support:'Visitor support',map:'Open map',source:'Verify source',checked:'Checked',copy:'Copy address',copied:'Copied',open:'Open at this time',closed:'Closed at this time',recheck:'Recheck before visiting',none:'No shops match these filters.',notice:'Hours, inventory and rental prices can change. Recheck the shop source before travel, especially for evening return deadlines.',save:'Save shop',saved:'Saved',showSaved:'Show saved only',storageNote:'Saved shops are stored only as source-checked shop IDs in this browser.'},
 'zh-CN':{title:'韩服租赁查找器',intro:'出发前比较景福宫周边已核对来源的韩服租赁店。不使用预约 API。',date:'到访日期',time:'预计到店时间',language:'已确认的现场语言协助',any:'不限',english:'英语',japanese:'日语',chinese:'中文',available:'隐藏明确已关闭的店铺',price:'租赁价格',from:'起',hours:'营业时间',support:'游客支持',map:'打开地图',source:'核对来源',checked:'核对日期',copy:'复制地址',copied:'已复制',open:'该时段营业',closed:'该时段关闭',recheck:'到访前再次确认',none:'没有符合筛选条件的店铺。',notice:'营业时间、库存和租赁价格可能变化，尤其是晚间归还时间，请出发前再次查看店铺来源。',save:'收藏店铺',saved:'已收藏',showSaved:'只看收藏',storageNote:'收藏仅以已核对来源的店铺 ID 保存在此浏览器中。'},
 ja:{title:'韓服レンタル検索',intro:'景福宮周辺の出典確認済みレンタル店を事前に比較できます。予約APIは使いません。',date:'訪問日',time:'店舗到着予定',language:'確認済みの対面言語サポート',any:'指定なし',english:'英語',japanese:'日本語',chinese:'中国語',available:'明らかに閉店中の店舗を非表示',price:'レンタル料金',from:'～',hours:'営業時間',support:'旅行者サポート',map:'地図を開く',source:'情報源を確認',checked:'確認日',copy:'住所をコピー',copied:'コピー済み',open:'この時間は営業',closed:'この時間は閉店',recheck:'訪問前に再確認',none:'条件に合う店舗がありません。',notice:'営業時間・在庫・料金は変わることがあります。特に夜の返却締切は出発前に店舗情報を再確認してください。',save:'店舗を保存',saved:'保存済み',showSaved:'保存済みのみ',storageNote:'保存されるのは、このブラウザ内の出典確認済み店舗IDだけです。'},
 'zh-TW':{title:'韓服租借查找器',intro:'出發前比較景福宮周邊已核對來源的韓服租借店。不使用預約 API。',date:'到訪日期',time:'預計到店時間',language:'已確認的現場語言協助',any:'不限',english:'英語',japanese:'日語',chinese:'中文',available:'隱藏明確已關閉的店家',price:'租借價格',from:'起',hours:'營業時間',support:'旅客支援',map:'開啟地圖',source:'核對來源',checked:'核對日期',copy:'複製地址',copied:'已複製',open:'此時段營業',closed:'此時段關閉',recheck:'到訪前再次確認',none:'沒有符合篩選條件的店家。',notice:'營業時間、庫存與租借價格可能變動，尤其晚間歸還時間請出發前再次查看店家來源。',save:'收藏店家',saved:'已收藏',showSaved:'只看收藏',storageNote:'收藏只會以已核對來源的店家 ID 儲存在此瀏覽器中。'},
 vi:{title:'Tìm nơi thuê Hanbok',intro:'So sánh các cửa hàng quanh Gyeongbokgung đã kiểm tra nguồn trước khi đi. Không dùng API đặt chỗ.',date:'Ngày tham quan',time:'Giờ dự kiến đến cửa hàng',language:'Hỗ trợ ngôn ngữ trực tiếp đã xác minh',any:'Bất kỳ',english:'Tiếng Anh',japanese:'Tiếng Nhật',chinese:'Tiếng Trung',available:'Ẩn cửa hàng chắc chắn đã đóng',price:'Giá thuê',from:'từ',hours:'Giờ mở cửa',support:'Hỗ trợ du khách',map:'Mở bản đồ',source:'Kiểm tra nguồn',checked:'Đã kiểm tra',copy:'Sao chép địa chỉ',copied:'Đã sao chép',open:'Mở vào giờ này',closed:'Đóng vào giờ này',recheck:'Kiểm tra lại trước khi đi',none:'Không có cửa hàng phù hợp bộ lọc.',notice:'Giờ mở cửa, tồn kho và giá thuê có thể thay đổi. Hãy kiểm tra lại nguồn của cửa hàng, đặc biệt với hạn trả đồ buổi tối.',save:'Lưu cửa hàng',saved:'Đã lưu',showSaved:'Chỉ hiện đã lưu',storageNote:'Chỉ ID cửa hàng đã kiểm tra nguồn được lưu trong trình duyệt này.'},
 th:{title:'ค้นหาร้านเช่าฮันบก',intro:'เปรียบเทียบร้านรอบคยองบกกุงที่ตรวจสอบแหล่งข้อมูลแล้วก่อนเดินทาง โดยไม่ใช้ API จอง',date:'วันที่เที่ยว',time:'เวลาที่คาดว่าจะถึงร้าน',language:'ความช่วยเหลือด้านภาษาแบบพบหน้าที่ตรวจสอบแล้ว',any:'ทั้งหมด',english:'อังกฤษ',japanese:'ญี่ปุ่น',chinese:'จีน',available:'ซ่อนร้านที่ปิดแน่นอน',price:'ราคาเช่า',from:'เริ่มที่',hours:'เวลาเปิด',support:'การช่วยเหลือนักท่องเที่ยว',map:'เปิดแผนที่',source:'ตรวจสอบแหล่งข้อมูล',checked:'ตรวจสอบเมื่อ',copy:'คัดลอกที่อยู่',copied:'คัดลอกแล้ว',open:'เปิดในเวลานี้',closed:'ปิดในเวลานี้',recheck:'ตรวจอีกครั้งก่อนเดินทาง',none:'ไม่มีร้านที่ตรงกับตัวกรอง',notice:'เวลาเปิด สต็อก และราคาเช่าอาจเปลี่ยนได้ ควรตรวจสอบแหล่งข้อมูลของร้านอีกครั้ง โดยเฉพาะกำหนดคืนชุดช่วงเย็น',save:'บันทึกร้าน',saved:'บันทึกแล้ว',showSaved:'แสดงเฉพาะที่บันทึก',storageNote:'ระบบบันทึกเฉพาะ ID ร้านที่ตรวจสอบแหล่งข้อมูลแล้วไว้ในเบราว์เซอร์นี้'}
};

function localToday(){const now=new Date();return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;}
const LANGS:Array<['any'|HanbokRentalLanguage,string]>=[['any','any'],['en','english'],['ja','japanese'],['zh','chinese']];
const FAVORITES_KEY='kc-hanbok-rental-favorites-v1';

export function HanbokRentalFinder({shops}: {shops:readonly HanbokRentalShop[]}){
 const locale=useLocale();const l=(locale in C?locale:'en') as Locale,c=C[l];const params=useSearchParams();
 const queryDate=params.get('date');const queryTime=params.get('time');
 const [date,setDate]=useState(/^\d{4}-\d{2}-\d{2}$/.test(queryDate??'')?queryDate!:localToday());
 const [time,setTime]=useState(/^\d{2}:\d{2}$/.test(queryTime??'')?queryTime!:'09:00');
 const [language,setLanguage]=useState<'any'|HanbokRentalLanguage>('any');const [hideClosed,setHideClosed]=useState(true);const [copied,setCopied]=useState('');
 const [favorites,setFavorites]=useState<Set<string>>(new Set());const [showSaved,setShowSaved]=useState(false);
 const validShopIds=useMemo(()=>new Set(shops.map(shop=>shop.id)),[shops]);
 useEffect(()=>{try{const raw=localStorage.getItem(FAVORITES_KEY);if(!raw)return;const parsed=JSON.parse(raw);if(!Array.isArray(parsed)){localStorage.removeItem(FAVORITES_KEY);return;}const ids=parsed.filter((id):id is string=>typeof id==='string'&&validShopIds.has(id));setFavorites(new Set(ids));if(ids.length!==parsed.length)localStorage.setItem(FAVORITES_KEY,JSON.stringify(ids));}catch{try{localStorage.removeItem(FAVORITES_KEY);}catch{}}},[validShopIds]);
 function toggleFavorite(id:string){if(!validShopIds.has(id))return;setFavorites(previous=>{const next=new Set(previous);if(next.has(id))next.delete(id);else next.add(id);try{localStorage.setItem(FAVORITES_KEY,JSON.stringify([...next]));}catch{}return next;});}
 const rows=useMemo(()=>shops.map(shop=>({shop,availability:hanbokRentalAvailabilityAt(shop,date,time)})).filter(({shop,availability})=>(!hideClosed||availability!=='closed')&&(language==='any'||shop.interpretationLanguages.includes(language))&&(!showSaved||favorites.has(shop.id))).sort((a,b)=>({open:0,recheck:1,closed:2}[a.availability]-{open:0,recheck:1,closed:2}[b.availability])),[shops,date,time,language,hideClosed,showSaved,favorites]);
 async function copyAddress(id:string,address:string){try{await navigator.clipboard?.writeText(address);setCopied(id);}catch{setCopied('');}}
 const statusLabel=(value:'open'|'closed'|'recheck')=>value==='open'?c.open:value==='closed'?c.closed:c.recheck;
 return <section id="rental-finder" style={{maxWidth:1120,margin:'28px auto 72px',padding:'0 20px'}}>
  <header style={{maxWidth:760}}><h2>{c.title}</h2><p>{c.intro}</p></header>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,alignItems:'end',margin:'20px 0'}}>
   <label style={{display:'grid',gap:6}}>{c.date}<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
   <label style={{display:'grid',gap:6}}>{c.time}<input type="time" value={time} onChange={e=>setTime(e.target.value)}/></label>
   <label style={{display:'grid',gap:6}}>{c.language}<select value={language} onChange={e=>setLanguage(e.target.value as 'any'|HanbokRentalLanguage)}>{LANGS.map(([value,key])=><option value={value} key={value}>{c[key as keyof Copy]}</option>)}</select></label>
   <label style={{display:'flex',gap:8,alignItems:'center',minHeight:44}}><input type="checkbox" checked={hideClosed} onChange={e=>setHideClosed(e.target.checked)}/>{c.available}</label>
   <label style={{display:'flex',gap:8,alignItems:'center',minHeight:44}}><input type="checkbox" checked={showSaved} onChange={e=>setShowSaved(e.target.checked)}/>{c.showSaved}</label>
  </div>
  <div aria-live="polite" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:14}}>{rows.map(({shop,availability})=>{const saved=favorites.has(shop.id);return <article key={shop.id} style={{border:'1px solid rgba(0,0,0,.12)',borderRadius:12,padding:16,background:'#fff'}}>
   <p style={{margin:'0 0 6px'}}><strong>{statusLabel(availability)}</strong></p><h3 style={{margin:'0 0 4px'}}>{shop.name}</h3><p style={{marginTop:0}}>{shop.koreanName}</p>
   <p>{shop.address}<br/>{shop.phone}</p><p><strong>{c.hours}:</strong> {shop.hoursLabel}</p>{shop.priceFromKrw?<p><strong>{c.price}:</strong> {c.from} ₩{shop.priceFromKrw.toLocaleString()}</p>:null}<p><strong>{c.support}:</strong> {shop.supportNote}</p>
   <div style={{display:'flex',gap:8,flexWrap:'wrap'}}><button className="secondaryButton" type="button" aria-pressed={saved} onClick={()=>toggleFavorite(shop.id)}>{saved?c.saved:c.save}</button><a className="secondaryButton" href={hanbokRentalMapHref(shop)} target="_blank" rel="noreferrer">{c.map}</a><a className="secondaryButton" href={shop.sourceUrl} target="_blank" rel="noreferrer">{c.source}</a><button className="secondaryButton" type="button" onClick={()=>copyAddress(shop.id,shop.address)}>{copied===shop.id?c.copied:c.copy}</button></div>
   <p><small>{shop.sourceLabel} · {c.checked}: {shop.checkedAt}</small></p>
  </article>})}</div>
  {!rows.length?<p role="status">{c.none}</p>:null}<p style={{marginTop:16}}><small>{c.notice}</small></p><p><small>{c.storageNote}</small></p>
 </section>;
}
