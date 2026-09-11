'use client';

import {useState} from 'react';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type Copy={title:string;intro:string;create:string;copy:string;copied:string;missing:string;invalid:string;privacy:string};
const C:Record<Locale,Copy>={
 en:{title:'Share this saved look plan',intro:'Create a link from the non-sensitive trip and style choices saved in this browser. Photos and personal keywords are never included.',create:'Create share link',copy:'Copy link',copied:'Share link copied',missing:'Save your choices above first, then create a share link.',invalid:'The saved plan could not be read. Save the choices again.',privacy:'The link contains only style, garment, palette, mood, comfort, coverage, season or visit date, destination, and whether the palette came from the local preview.'},
 'zh-CN':{title:'分享已保存的造型计划',intro:'根据本浏览器保存的非敏感行程和造型选择生成链接，不会包含照片或个人关键词。',create:'生成分享链接',copy:'复制链接',copied:'已复制分享链接',missing:'请先在上方保存选择，再生成分享链接。',invalid:'无法读取已保存计划，请重新保存。',privacy:'链接仅包含风格、服装、配色、氛围、舒适度、遮盖度、季节或到访日期、目的地，以及配色是否来自本地个人色彩预览。'},
 ja:{title:'保存したルックプランを共有',intro:'このブラウザに保存した非機密の旅行・スタイル選択から共有リンクを作ります。写真や個人キーワードは含みません。',create:'共有リンクを作成',copy:'リンクをコピー',copied:'共有リンクをコピーしました',missing:'まず上で選択内容を保存してから共有リンクを作成してください。',invalid:'保存プランを読み取れません。もう一度保存してください。',privacy:'リンクに含まれるのはスタイル、衣装、配色、ムード、快適さ、カバー範囲、季節または訪問日、目的地、配色が端末内プレビュー由来かどうかだけです。'},
 'zh-TW':{title:'分享已儲存的造型計畫',intro:'依此瀏覽器儲存的非敏感旅遊與造型選擇產生連結，不會包含照片或個人關鍵字。',create:'產生分享連結',copy:'複製連結',copied:'已複製分享連結',missing:'請先在上方儲存選擇，再產生分享連結。',invalid:'無法讀取已儲存計畫，請重新儲存。',privacy:'連結只包含風格、服裝、配色、氛圍、舒適度、遮蓋度、季節或到訪日期、目的地，以及配色是否來自本機個人色彩預覽。'},
 vi:{title:'Chia sẻ kế hoạch look đã lưu',intro:'Tạo liên kết từ các lựa chọn chuyến đi và phong cách không nhạy cảm đã lưu trong trình duyệt. Ảnh và từ khóa cá nhân không được đưa vào.',create:'Tạo liên kết chia sẻ',copy:'Sao chép liên kết',copied:'Đã sao chép liên kết',missing:'Hãy lưu lựa chọn ở phía trên trước rồi tạo liên kết.',invalid:'Không đọc được kế hoạch đã lưu. Hãy lưu lại lựa chọn.',privacy:'Liên kết chỉ chứa phong cách, trang phục, bảng màu, mood, độ thoải mái, độ che phủ, mùa hoặc ngày đi, điểm đến và việc bảng màu có đến từ preview cục bộ hay không.'},
 th:{title:'แชร์แผนลุคที่บันทึกไว้',intro:'สร้างลิงก์จากตัวเลือกทริปและสไตล์ที่ไม่ละเอียดอ่อนซึ่งบันทึกในเบราว์เซอร์ รูปภาพและคีย์เวิร์ดส่วนตัวจะไม่ถูกรวม',create:'สร้างลิงก์แชร์',copy:'คัดลอกลิงก์',copied:'คัดลอกลิงก์แล้ว',missing:'บันทึกตัวเลือกด้านบนก่อน แล้วจึงสร้างลิงก์แชร์',invalid:'อ่านแผนที่บันทึกไว้ไม่ได้ โปรดบันทึกตัวเลือกอีกครั้ง',privacy:'ลิงก์มีเฉพาะสไตล์ ชุด พาเลต อารมณ์ ความสบาย การปกปิด ฤดูหรือวันที่ไป จุดหมาย และข้อมูลว่าพาเลตมาจากพรีวิวในเครื่องหรือไม่'}
};
const STORAGE_KEY='kc-my-korea-look-plan-v2';
const STYLES=new Set(['princess-prince','queen-king','royal']);
const GARMENTS=new Set(['chima','baji','either']);
const PALETTES=new Set(['jadeIvory','roseNavy','moonBlue','suggest']);
const MOODS=new Set(['elegant','royal','romantic','minimal','kdrama']);
const COMFORTS=new Set(['walking','balanced','photoFirst']);
const COVERAGE=new Set(['standard','more-coverage']);
const SEASONS=new Set(['springAutumn','summer','winter']);
const DESTINATIONS=new Set(['gyeongbokgung','bukchon','seochon']);
const COLOR_SOURCES=new Set(['manual','local-preview']);

type SavedPlan={version:number;style:string;garment:string;palette:string;mood:string;comfort:string;coverage:string;season:string;destination:string;visitDate?:string;colorSource:string};
function validDate(value:string|undefined){if(!value)return true;if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const [y,m,d]=value.split('-').map(Number);const dt=new Date(Date.UTC(y,m-1,d));return dt.getUTCFullYear()===y&&dt.getUTCMonth()===m-1&&dt.getUTCDate()===d;}
function valid(x:unknown):x is SavedPlan{if(!x||typeof x!=='object')return false;const v=x as Partial<SavedPlan>;return v.version===1&&STYLES.has(String(v.style))&&GARMENTS.has(String(v.garment))&&PALETTES.has(String(v.palette))&&MOODS.has(String(v.mood))&&COMFORTS.has(String(v.comfort))&&COVERAGE.has(String(v.coverage))&&SEASONS.has(String(v.season))&&DESTINATIONS.has(String(v.destination))&&COLOR_SOURCES.has(String(v.colorSource))&&validDate(v.visitDate);}

export function StylePlanShareLink({locale}:{locale:string}){
 const l=(locale in C?locale:'en') as Locale,c=C[l];const [url,setUrl]=useState('');const [status,setStatus]=useState('');
 function create(){setStatus('');try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw){setUrl('');setStatus(c.missing);return;}const plan=JSON.parse(raw);if(!valid(plan)){setUrl('');setStatus(c.invalid);return;}const params=new URLSearchParams({style:plan.style,garment:plan.garment,palette:plan.palette,mood:plan.mood,comfort:plan.comfort,coverage:plan.coverage,season:plan.season,destination:plan.destination,colorSource:plan.colorSource});if(plan.visitDate)params.set('date',plan.visitDate);setUrl(`${window.location.origin}/${l}/style/shared?${params.toString()}`);}catch{setUrl('');setStatus(c.invalid);}}
 async function copy(){if(!url)return;try{await navigator.clipboard?.writeText(url);setStatus(c.copied);}catch{setStatus('');}}
 return <section style={{maxWidth:1080,margin:'0 auto',padding:'0 20px 70px'}}><div style={{border:'1px solid rgba(0,0,0,.12)',borderRadius:14,padding:18}}><h2>{c.title}</h2><p>{c.intro}</p><p><small>{c.privacy}</small></p><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button type="button" className="secondaryButton" onClick={create}>{c.create}</button>{url?<button type="button" className="secondaryButton" onClick={copy}>{c.copy}</button>:null}</div>{url?<p style={{overflowWrap:'anywhere'}}><a href={url}>{url}</a></p>:null}{status?<p role="status"><strong>{status}</strong></p>:null}</div></section>;
}
