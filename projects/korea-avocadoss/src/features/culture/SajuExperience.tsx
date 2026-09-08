'use client';

import {FormEvent, useMemo, useState} from 'react';
import {calculateSajuExperience, type SajuExperienceResult} from '@/lib/saju/experience';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
type TimeMode='exact'|'rough'|'unknown';
type Period='night'|'morning'|'afternoon'|'evening';
type Copy={
 title:string;intro:string;notice:string;date:string;dateHelp:string;timeMode:string;exact:string;rough:string;unknown:string;time:string;period:string;night:string;morning:string;afternoon:string;evening:string;zone:string;zonePlaceholder:string;zoneHelp:string;go:string;result:string;year:string;month:string;day:string;hour:string;possible:string;elements:string;koreanZodiac:string;western:string;warnings:string;method:string;methodText:string;reset:string;error:string;zoneRequired:string;full:string;reduced:string;boundary:string;candidateHelp:string;privacy:string;
};

const C:Record<Locale,Copy>={
 en:{title:'Try your Saju',intro:'Enter your birth date, birthplace timezone, and whatever you know about your birth time.',notice:'A Korean cultural/entertainment experience — not professional advice or a guaranteed prediction.',date:'Birth date',dateHelp:'Use the date recorded at your birthplace.',timeMode:'How well do you know your birth time?',exact:'Exact time',rough:'Roughly',unknown:"I don’t know",time:'Birth time',period:'Approximate period',night:'Night (00–06)',morning:'Morning (06–12)',afternoon:'Afternoon (12–18)',evening:'Evening (18–24)',zone:'Birthplace timezone',zonePlaceholder:'Choose or type a timezone',zoneHelp:'Use the timezone where you were born, for example Asia/Seoul, Asia/Tokyo or America/New_York.',go:'Calculate chart',result:'Your cultural chart',year:'Year pillar',month:'Month pillar',day:'Day pillar',hour:'Hour pillar',possible:'Possible values',elements:'Five elements',koreanZodiac:'Korean zodiac',western:'Western zodiac',warnings:'What is uncertain',method:'How this was calculated',methodText:'Deterministic calendar math only. No AI API is used, and a missing birth time is never guessed.',reset:'Start over',error:'Check your input',zoneRequired:'Choose the timezone of your birthplace.',full:'Four pillars resolved',reduced:'Reduced scope — hour not guessed',boundary:'Boundary uncertainty preserved',candidateHelp:'When your time is not exact, multiple traditional hour candidates can remain valid.',privacy:'This tool does not need to upload your birth data to an AI model.'},
 'zh-CN':{title:'体验四柱',intro:'输入出生日期、出生地时区，以及你所知道的出生时间。',notice:'仅用于韩国文化／娱乐体验，不是专业建议或确定性预测。',date:'出生日期',dateHelp:'请使用出生地记录的当地日期。',timeMode:'你对出生时间了解多少？',exact:'知道准确时间',rough:'只知道大概',unknown:'不知道',time:'出生时间',period:'大概时段',night:'夜间 00–06',morning:'上午 06–12',afternoon:'下午 12–18',evening:'晚上 18–24',zone:'出生地时区',zonePlaceholder:'选择或输入时区',zoneHelp:'请选择出生地时区，例如 Asia/Shanghai、Asia/Seoul 或 America/New_York。',go:'计算文化命盘',result:'你的文化命盘',year:'年柱',month:'月柱',day:'日柱',hour:'时柱',possible:'可能值',elements:'五行',koreanZodiac:'韩国生肖',western:'西方星座',warnings:'不确定部分',method:'计算方式',methodText:'仅使用确定性历法计算，不调用 AI API；不知道出生时间时绝不猜测时柱。',reset:'重新开始',error:'请检查输入',zoneRequired:'请选择出生地时区。',full:'四柱已确定',reduced:'缩减范围 — 不猜时柱',boundary:'保留节气边界不确定性',candidateHelp:'出生时间不精确时，可能会保留多个传统时辰候选。',privacy:'此工具无需把你的出生资料上传给 AI 模型。'},
 ja:{title:'四柱を試す',intro:'生年月日、出生地のタイムゾーン、わかる範囲の出生時刻を入力してください。',notice:'韓国文化・娯楽向けで、専門助言や確定的な予言ではありません。',date:'生年月日',dateHelp:'出生地で記録された現地の日付を使ってください。',timeMode:'出生時刻はどの程度わかりますか？',exact:'正確にわかる',rough:'だいたいわかる',unknown:'わからない',time:'出生時刻',period:'おおよその時間帯',night:'夜 00–06',morning:'朝 06–12',afternoon:'午後 12–18',evening:'夜 18–24',zone:'出生地タイムゾーン',zonePlaceholder:'タイムゾーンを選択または入力',zoneHelp:'出生地のタイムゾーンを選んでください。例: Asia/Tokyo、Asia/Seoul、America/New_York。',go:'命式を計算',result:'文化的な命式',year:'年柱',month:'月柱',day:'日柱',hour:'時柱',possible:'候補',elements:'五行',koreanZodiac:'韓国の干支',western:'西洋星座',warnings:'不確実な点',method:'計算方法',methodText:'決定論的な暦計算のみ。AI API は使わず、不明な出生時刻を推測しません。',reset:'やり直す',error:'入力を確認してください',zoneRequired:'出生地のタイムゾーンを選んでください。',full:'四柱を算出',reduced:'三柱まで — 時柱は推測しません',boundary:'節気境界の不確実性を保持',candidateHelp:'出生時刻が正確でない場合、複数の時柱候補が残ることがあります。',privacy:'出生情報を AI モデルへ送信する必要はありません。'},
 'zh-TW':{title:'體驗四柱',intro:'輸入出生日期、出生地時區，以及你所知道的出生時間。',notice:'僅供韓國文化／娛樂體驗，不是專業建議或確定性預測。',date:'出生日期',dateHelp:'請使用出生地記錄的當地日期。',timeMode:'你對出生時間了解多少？',exact:'知道準確時間',rough:'只知道大概',unknown:'不知道',time:'出生時間',period:'大概時段',night:'夜間 00–06',morning:'上午 06–12',afternoon:'下午 12–18',evening:'晚上 18–24',zone:'出生地時區',zonePlaceholder:'選擇或輸入時區',zoneHelp:'請選擇出生地時區，例如 Asia/Taipei、Asia/Seoul 或 America/New_York。',go:'計算文化命盤',result:'你的文化命盤',year:'年柱',month:'月柱',day:'日柱',hour:'時柱',possible:'可能值',elements:'五行',koreanZodiac:'韓國生肖',western:'西方星座',warnings:'不確定部分',method:'計算方式',methodText:'僅使用確定性曆法計算，不呼叫 AI API；不知道出生時間時絕不猜測時柱。',reset:'重新開始',error:'請檢查輸入',zoneRequired:'請選擇出生地時區。',full:'四柱已確定',reduced:'縮減範圍 — 不猜時柱',boundary:'保留節氣邊界不確定性',candidateHelp:'出生時間不精確時，可能會保留多個傳統時辰候選。',privacy:'此工具不需要把出生資料上傳給 AI 模型。'},
 vi:{title:'Thử Saju của bạn',intro:'Nhập ngày sinh, múi giờ nơi sinh và bất kỳ thông tin nào bạn biết về giờ sinh.',notice:'Chỉ dành cho trải nghiệm văn hóa/giải trí, không phải tư vấn chuyên môn hay dự đoán chắc chắn.',date:'Ngày sinh',dateHelp:'Dùng ngày địa phương được ghi tại nơi sinh.',timeMode:'Bạn biết giờ sinh đến mức nào?',exact:'Biết chính xác',rough:'Chỉ biết khoảng',unknown:'Không biết',time:'Giờ sinh',period:'Khoảng thời gian',night:'Đêm 00–06',morning:'Sáng 06–12',afternoon:'Chiều 12–18',evening:'Tối 18–24',zone:'Múi giờ nơi sinh',zonePlaceholder:'Chọn hoặc nhập múi giờ',zoneHelp:'Chọn múi giờ nơi sinh, ví dụ Asia/Ho_Chi_Minh, Asia/Seoul hoặc America/New_York.',go:'Tính biểu đồ',result:'Biểu đồ văn hóa của bạn',year:'Trụ năm',month:'Trụ tháng',day:'Trụ ngày',hour:'Trụ giờ',possible:'Khả năng',elements:'Ngũ hành',koreanZodiac:'Con giáp Hàn Quốc',western:'Cung hoàng đạo',warnings:'Điểm chưa chắc chắn',method:'Cách tính',methodText:'Chỉ dùng phép tính lịch xác định, không gọi AI API và không đoán giờ sinh bị thiếu.',reset:'Làm lại',error:'Hãy kiểm tra dữ liệu',zoneRequired:'Hãy chọn múi giờ nơi bạn sinh.',full:'Đã xác định bốn trụ',reduced:'Phạm vi rút gọn — không đoán trụ giờ',boundary:'Giữ nguyên bất định ở ranh giới tiết khí',candidateHelp:'Nếu giờ sinh không chính xác, có thể còn nhiều ứng viên cho trụ giờ.',privacy:'Công cụ này không cần gửi dữ liệu ngày sinh của bạn tới mô hình AI.'},
 th:{title:'ลองดูซาจูของคุณ',intro:'กรอกวันเกิด เขตเวลาของสถานที่เกิด และข้อมูลเวลาเกิดเท่าที่คุณทราบ',notice:'เพื่อประสบการณ์ทางวัฒนธรรม/ความบันเทิงเท่านั้น ไม่ใช่คำแนะนำวิชาชีพหรือคำทำนายที่แน่นอน',date:'วันเกิด',dateHelp:'ใช้วันที่ท้องถิ่นที่บันทึกไว้ ณ สถานที่เกิด',timeMode:'คุณรู้เวลาเกิดมากแค่ไหน?',exact:'รู้เวลาชัดเจน',rough:'รู้คร่าว ๆ',unknown:'ไม่ทราบ',time:'เวลาเกิด',period:'ช่วงเวลาโดยประมาณ',night:'กลางคืน 00–06',morning:'เช้า 06–12',afternoon:'บ่าย 12–18',evening:'เย็น 18–24',zone:'เขตเวลาสถานที่เกิด',zonePlaceholder:'เลือกหรือพิมพ์เขตเวลา',zoneHelp:'เลือกเขตเวลาของสถานที่เกิด เช่น Asia/Bangkok, Asia/Seoul หรือ America/New_York',go:'คำนวณแผนผัง',result:'แผนผังวัฒนธรรมของคุณ',year:'เสาปี',month:'เสาเดือน',day:'เสาวัน',hour:'เสาเวลา',possible:'ค่าที่เป็นไปได้',elements:'ธาตุทั้งห้า',koreanZodiac:'นักษัตรเกาหลี',western:'ราศีตะวันตก',warnings:'ส่วนที่ไม่แน่นอน',method:'วิธีคำนวณ',methodText:'ใช้คณิตศาสตร์ปฏิทินแบบกำหนดแน่นอนเท่านั้น ไม่เรียก AI API และไม่เดาเวลาเกิดที่ไม่ทราบ',reset:'เริ่มใหม่',error:'โปรดตรวจสอบข้อมูล',zoneRequired:'โปรดเลือกเขตเวลาของสถานที่เกิด',full:'คำนวณสี่เสาแล้ว',reduced:'ขอบเขตลดลง — ไม่เดาเสาเวลา',boundary:'คงความไม่แน่นอนของขอบเขตฤดูกาลไว้',candidateHelp:'หากเวลาเกิดไม่แน่นอน อาจมีเสาเวลาที่เป็นไปได้หลายค่า',privacy:'เครื่องมือนี้ไม่จำเป็นต้องส่งข้อมูลวันเกิดของคุณไปยังโมเดล AI'}
};

const ZONES=['Asia/Seoul','Asia/Tokyo','Asia/Shanghai','Asia/Hong_Kong','Asia/Taipei','Asia/Ho_Chi_Minh','Asia/Bangkok','Asia/Singapore','Asia/Manila','Asia/Jakarta','Asia/Kuala_Lumpur','Asia/Kolkata','America/Los_Angeles','America/Chicago','America/New_York','America/Toronto','Europe/London','Europe/Paris','Europe/Berlin','Australia/Sydney'];
const ELEMENT_LABELS:Record<Locale,Record<string,string>>={en:{wood:'Wood',fire:'Fire',earth:'Earth',metal:'Metal',water:'Water'},'zh-CN':{wood:'木',fire:'火',earth:'土',metal:'金',water:'水'},ja:{wood:'木',fire:'火',earth:'土',metal:'金',water:'水'},'zh-TW':{wood:'木',fire:'火',earth:'土',metal:'金',water:'水'},vi:{wood:'Mộc',fire:'Hỏa',earth:'Thổ',metal:'Kim',water:'Thủy'},th:{wood:'ไม้',fire:'ไฟ',earth:'ดิน',metal:'โลหะ',water:'น้ำ'}};
const ZODIAC:Record<Locale,Record<string,string>>={
 en:{rat:'Rat',ox:'Ox',tiger:'Tiger',rabbit:'Rabbit',dragon:'Dragon',snake:'Snake',horse:'Horse',goat:'Goat',monkey:'Monkey',rooster:'Rooster',dog:'Dog',pig:'Pig'},
 'zh-CN':{rat:'鼠',ox:'牛',tiger:'虎',rabbit:'兔',dragon:'龙',snake:'蛇',horse:'马',goat:'羊',monkey:'猴',rooster:'鸡',dog:'狗',pig:'猪'},
 ja:{rat:'子（ねずみ）',ox:'丑（うし）',tiger:'寅（とら）',rabbit:'卯（うさぎ）',dragon:'辰（たつ）',snake:'巳（へび）',horse:'午（うま）',goat:'未（ひつじ）',monkey:'申（さる）',rooster:'酉（とり）',dog:'戌（いぬ）',pig:'亥（いのしし）'},
 'zh-TW':{rat:'鼠',ox:'牛',tiger:'虎',rabbit:'兔',dragon:'龍',snake:'蛇',horse:'馬',goat:'羊',monkey:'猴',rooster:'雞',dog:'狗',pig:'豬'},
 vi:{rat:'Tý',ox:'Sửu',tiger:'Dần',rabbit:'Mão',dragon:'Thìn',snake:'Tỵ',horse:'Ngọ',goat:'Mùi',monkey:'Thân',rooster:'Dậu',dog:'Tuất',pig:'Hợi'},
 th:{rat:'ชวด',ox:'ฉลู',tiger:'ขาล',rabbit:'เถาะ',dragon:'มะโรง',snake:'มะเส็ง',horse:'มะเมีย',goat:'มะแม',monkey:'วอก',rooster:'ระกา',dog:'จอ',pig:'กุน'}
};
const WESTERN:Record<Locale,Record<string,string>>={
 en:{capricorn:'Capricorn',aquarius:'Aquarius',pisces:'Pisces',aries:'Aries',taurus:'Taurus',gemini:'Gemini',cancer:'Cancer',leo:'Leo',virgo:'Virgo',libra:'Libra',scorpio:'Scorpio',sagittarius:'Sagittarius'},
 'zh-CN':{capricorn:'摩羯座',aquarius:'水瓶座',pisces:'双鱼座',aries:'白羊座',taurus:'金牛座',gemini:'双子座',cancer:'巨蟹座',leo:'狮子座',virgo:'处女座',libra:'天秤座',scorpio:'天蝎座',sagittarius:'射手座'},
 ja:{capricorn:'山羊座',aquarius:'水瓶座',pisces:'魚座',aries:'牡羊座',taurus:'牡牛座',gemini:'双子座',cancer:'蟹座',leo:'獅子座',virgo:'乙女座',libra:'天秤座',scorpio:'蠍座',sagittarius:'射手座'},
 'zh-TW':{capricorn:'摩羯座',aquarius:'水瓶座',pisces:'雙魚座',aries:'牡羊座',taurus:'金牛座',gemini:'雙子座',cancer:'巨蟹座',leo:'獅子座',virgo:'處女座',libra:'天秤座',scorpio:'天蠍座',sagittarius:'射手座'},
 vi:{capricorn:'Ma Kết',aquarius:'Bảo Bình',pisces:'Song Ngư',aries:'Bạch Dương',taurus:'Kim Ngưu',gemini:'Song Tử',cancer:'Cự Giải',leo:'Sư Tử',virgo:'Xử Nữ',libra:'Thiên Bình',scorpio:'Bọ Cạp',sagittarius:'Nhân Mã'},
 th:{capricorn:'มังกร',aquarius:'กุมภ์',pisces:'มีน',aries:'เมษ',taurus:'พฤษภ',gemini:'เมถุน',cancer:'กรกฎ',leo:'สิงห์',virgo:'กันย์',libra:'ตุล',scorpio:'พิจิก',sagittarius:'ธนู'}
};

function textPillar(p?:{stem:string;branch:string}){return p?`${p.stem}${p.branch}`:'—';}
function warningText(locale:Locale, warning:string){
 const boundary=warning.includes('solar-term boundary');
 const missing=warning.includes('Birth time was not provided');
 const rough=warning.includes('rough time period');
 const dst=warning.includes('DST');
 const messages:Record<Locale,{boundary:string;missing:string;rough:string;dst:string;generic:string}>={
  en:{boundary:'Your selected time is close to or crosses a solar-term boundary, so more than one year/month pillar may remain valid.',missing:'Birth time was not provided, so the hour pillar is intentionally omitted instead of guessed.',rough:'Your approximate period spans more than one traditional double-hour, so several hour candidates remain.',dst:'Historical daylight-saving changes make this local clock time ambiguous.',generic:'Some chart details remain uncertain with the information provided.'},
  'zh-CN':{boundary:'所选时间接近或跨越节气边界，因此年柱或月柱可能保留多个有效候选。',missing:'未提供出生时间，因此不会猜测时柱，而是主动省略。',rough:'大概时段跨越多个传统时辰，因此会保留多个候选。',dst:'历史夏令时变化使这个当地时间存在歧义。',generic:'根据目前提供的信息，部分命盘细节仍存在不确定性。'},
  ja:{boundary:'選択した時刻が節気境界に近い、または跨ぐため、年柱・月柱に複数の候補が残る場合があります。',missing:'出生時刻が不明のため、時柱は推測せず意図的に省略しています。',rough:'おおよその時間帯が複数の時辰にまたがるため、候補を複数残しています。',dst:'過去の夏時間変更により、この現地時刻には曖昧さがあります。',generic:'入力情報の範囲では一部の命式情報に不確実性があります。'},
  'zh-TW':{boundary:'所選時間接近或跨越節氣邊界，因此年柱或月柱可能保留多個有效候選。',missing:'未提供出生時間，因此不會猜測時柱，而是主動省略。',rough:'大概時段跨越多個傳統時辰，因此會保留多個候選。',dst:'歷史日光節約時間變更使這個當地時間存在歧義。',generic:'依目前提供的資訊，部分命盤細節仍有不確定性。'},
  vi:{boundary:'Thời gian đã chọn gần hoặc đi qua ranh giới tiết khí nên có thể còn nhiều ứng viên cho trụ năm/tháng.',missing:'Không có giờ sinh nên trụ giờ được chủ động bỏ trống thay vì đoán.',rough:'Khoảng giờ ước chừng đi qua nhiều khung giờ truyền thống nên còn nhiều ứng viên.',dst:'Thay đổi giờ mùa hè trong lịch sử khiến giờ địa phương này có thể mơ hồ.',generic:'Một số chi tiết vẫn chưa chắc chắn với dữ liệu hiện có.'},
  th:{boundary:'เวลาที่เลือกอยู่ใกล้หรือข้ามขอบเขตฤดูกาล จึงอาจมีเสาปีหรือเสาเดือนที่เป็นไปได้มากกว่าหนึ่งค่า',missing:'ไม่ได้ระบุเวลาเกิด จึงเว้นเสาเวลาไว้แทนการเดา',rough:'ช่วงเวลาโดยประมาณครอบคลุมหลายยามแบบดั้งเดิม จึงยังมีหลายค่าที่เป็นไปได้',dst:'การเปลี่ยนเวลาออมแสงในอดีตทำให้เวลาท้องถิ่นนี้มีความกำกวม',generic:'ข้อมูลบางส่วนของแผนผังยังไม่แน่นอนจากข้อมูลที่มี'}
 };
 const m=messages[locale];
 return boundary?m.boundary:missing?m.missing:rough?m.rough:dst?m.dst:m.generic;
}

export function SajuExperience({locale}:{locale:string}){
 const l=(locale in C?locale:'en') as Locale,c=C[l];
 const [date,setDate]=useState('');
 const [mode,setMode]=useState<TimeMode>('unknown');
 const [time,setTime]=useState('12:00');
 const [period,setPeriod]=useState<Period>('morning');
 const [zone,setZone]=useState('');
 const [result,setResult]=useState<SajuExperienceResult|null>(null);
 const [error,setError]=useState('');
 const maxDate=useMemo(()=>new Date().toISOString().slice(0,10),[]);
 const elementValues=useMemo(()=>result?.fiveElements.exact??result?.fiveElements.base,[result]);

 function submit(e:FormEvent){
  e.preventDefault();setError('');
  if(!zone.trim()){setResult(null);setError(c.zoneRequired);return;}
  try{
   const [y,m,d]=date.split('-').map(Number);
   const [h,min]=time.split(':').map(Number);
   const timeInput=mode==='exact'?{mode:'exact' as const,hour:h,minute:min}:mode==='rough'?{mode:'rough' as const,period}:{mode:'unknown' as const};
   setResult(calculateSajuExperience({year:y,month:m,day:d,timeZone:zone.trim(),time:timeInput}));
  }catch(err){setResult(null);setError(err instanceof Error?err.message:c.error);}
 }
 function reset(){setDate('');setMode('unknown');setTime('12:00');setPeriod('morning');setZone('');setResult(null);setError('');}
 const scope=result?.scope==='four-pillars'?c.full:result?.scope==='boundary-uncertain'?c.boundary:c.reduced;

 return <section style={{maxWidth:940,margin:'0 auto',padding:'28px 20px 72px'}}>
  <header style={{maxWidth:760,marginBottom:28}}><h1>{c.title}</h1><p>{c.intro}</p><p role="note"><strong>{c.notice}</strong></p></header>
  <form onSubmit={submit} style={{display:'grid',gap:18,padding:20,border:'1px solid rgba(0,0,0,.12)',borderRadius:14,background:'#fff'}}>
   <label style={{display:'grid',gap:6}}><strong>{c.date}</strong><input type="date" min="1900-01-01" max={maxDate} required value={date} onChange={e=>setDate(e.target.value)}/><small>{c.dateHelp}</small></label>
   <fieldset style={{display:'grid',gap:8}}><legend><strong>{c.timeMode}</strong></legend><div style={{display:'flex',gap:14,flexWrap:'wrap'}}><label><input type="radio" name="time-mode" checked={mode==='exact'} onChange={()=>setMode('exact')}/> {c.exact}</label><label><input type="radio" name="time-mode" checked={mode==='rough'} onChange={()=>setMode('rough')}/> {c.rough}</label><label><input type="radio" name="time-mode" checked={mode==='unknown'} onChange={()=>setMode('unknown')}/> {c.unknown}</label></div></fieldset>
   {mode==='exact'?<label style={{display:'grid',gap:6}}><strong>{c.time}</strong><input type="time" required value={time} onChange={e=>setTime(e.target.value)}/></label>:null}
   {mode==='rough'?<label style={{display:'grid',gap:6}}><strong>{c.period}</strong><select value={period} onChange={e=>setPeriod(e.target.value as Period)}><option value="night">{c.night}</option><option value="morning">{c.morning}</option><option value="afternoon">{c.afternoon}</option><option value="evening">{c.evening}</option></select></label>:null}
   <label style={{display:'grid',gap:6}}><strong>{c.zone}</strong><input list="kc-timezones" required placeholder={c.zonePlaceholder} value={zone} maxLength={80} autoComplete="off" onChange={e=>setZone(e.target.value)}/><small>{c.zoneHelp}</small></label>
   <datalist id="kc-timezones">{ZONES.map(z=><option key={z} value={z}/>)}</datalist>
   {error?<p role="alert" style={{color:'#8b1e1e',margin:0}}><strong>{c.error}:</strong> {error}</p>:null}
   <button type="submit" className="primaryButton">{c.go}</button>
   <small>{c.privacy}</small>
  </form>

  {result?<article style={{marginTop:28,display:'grid',gap:20}} aria-live="polite">
   <header><p className="eyebrow">{scope}</p><h2>{c.result}</h2></header>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12}}>
    {[[c.year,result.pillars.year],[c.month,result.pillars.month],[c.day,result.pillars.day],[c.hour,result.pillars.hour]].map(([label,pillar])=><div key={String(label)} style={{padding:16,border:'1px solid rgba(0,0,0,.1)',borderRadius:12,background:'#fff'}}><small>{String(label)}</small><strong style={{display:'block',fontSize:28,marginTop:6}}>{textPillar(pillar as {stem:string;branch:string}|undefined)}</strong></div>)}
   </div>
   {(result.candidates.year.length>1||result.candidates.month.length>1||result.candidates.hour.length>1)?<section><h3>{c.possible}</h3><p>{c.candidateHelp}</p><div style={{display:'grid',gap:8}}>{result.candidates.year.length>1?<p><strong>{c.year}:</strong> {result.candidates.year.map(textPillar).join(' · ')}</p>:null}{result.candidates.month.length>1?<p><strong>{c.month}:</strong> {result.candidates.month.map(textPillar).join(' · ')}</p>:null}{result.candidates.hour.length>1?<p><strong>{c.hour}:</strong> {result.candidates.hour.map(textPillar).join(' · ')}</p>:null}</div></section>:null}
   <section><h3>{c.elements}</h3><div style={{display:'flex',gap:10,flexWrap:'wrap'}}>{elementValues?Object.entries(elementValues).map(([key,value])=><span key={key} style={{padding:'8px 12px',border:'1px solid rgba(0,0,0,.1)',borderRadius:999}}><strong>{ELEMENT_LABELS[l][key]??key}</strong> {String(value)}</span>):null}</div></section>
   <section style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}><div><h3>{c.koreanZodiac}</h3><p>{ZODIAC[l][result.koreanZodiac]??result.koreanZodiac}</p></div><div><h3>{c.western}</h3><p>{WESTERN[l][result.westernZodiac]??result.westernZodiac}</p></div></section>
   {result.warnings.length?<section><h3>{c.warnings}</h3><ul>{Array.from(new Set(result.warnings.map(w=>warningText(l,w)))).map(w=><li key={w}>{w}</li>)}</ul></section>:null}
   <section><h3>{c.method}</h3><p>{c.methodText}</p></section>
   <button type="button" className="secondaryButton" onClick={reset}>{c.reset}</button>
  </article>:null}
 </section>;
}
