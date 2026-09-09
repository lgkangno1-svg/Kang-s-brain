import {Suspense} from 'react';
import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {HanbokMatcher} from '@/features/hanbok/hanbok-matcher';
import {HanbokRentalFinder} from '@/features/hanbok/HanbokRentalFinder';
import {HanbokVisualInspiration} from '@/features/hanbok/hanbok-visual-inspiration';
import {Link} from '@/i18n/navigation';
import {getGyeongbokgungHanbokRentalShops} from '@/lib/content/travel-content';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type Locale='en'|'zh-CN'|'ja'|'zh-TW'|'vi'|'th';
const PREVIEW_COPY:Record<Locale,{title:string;text:string;action:string}>={
 en:{title:'Want a complete 3-look planning preview?',text:'Use the free My Korea Look preview for ranked looks, rental-shop Korean request cards and palace photo-route ideas. Checkout is not enabled.',action:'Open free 3-look preview'},
 'zh-CN':{title:'想看完整的3套造型规划预览？',text:'免费 My Korea Look 会提供排序造型、给租赁店看的韩文请求卡和宫殿拍照路线灵感。目前不开放付款。',action:'打开免费3套造型预览'},
 ja:{title:'3ルックの完全プランを無料で試しますか？',text:'無料の My Korea Look で、ランキング済みルック、店舗で見せる韓国語カード、宮殿フォトルート案を確認できます。決済はまだ有効ではありません。',action:'無料3ルックプレビュー'},
 'zh-TW':{title:'想看完整的3套造型規劃預覽？',text:'免費 My Korea Look 提供排序造型、給租借店看的韓文需求卡與宮殿拍照路線靈感。目前不開放付款。',action:'開啟免費3套造型預覽'},
 vi:{title:'Muốn xem trước kế hoạch 3 look đầy đủ?',text:'Dùng My Korea Look miễn phí để xem look đã xếp hạng, thẻ yêu cầu bằng tiếng Hàn cho cửa hàng thuê và gợi ý tuyến chụp ảnh trong cung. Chưa mở thanh toán.',action:'Mở bản xem trước 3 look miễn phí'},
 th:{title:'อยากดูพรีวิวแผน 3 ลุคแบบครบไหม?',text:'ใช้ My Korea Look ฟรีเพื่อดูอันดับลุค การ์ดภาษาเกาหลีสำหรับร้านเช่า และแนวทางเส้นทางถ่ายรูปในพระราชวัง ขณะนี้ยังไม่เปิดชำระเงินจริง',action:'เปิดพรีวิว 3 ลุคฟรี'}
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {title: t('hanbokTitle'),description: t('hanbokDescription'),alternates: localizedAlternates(locale, '/hanbok')};
}

export default async function HanbokPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;setRequestLocale(locale);const copy=PREVIEW_COPY[(locale in PREVIEW_COPY?locale:'en') as Locale];
  const rentalShops=await getGyeongbokgungHanbokRentalShops();
  return (
    <main className="stitchHanbokPage">
      <Suspense fallback={<div style={{minHeight: '540px'}} aria-hidden="true" />}><HanbokVisualInspiration /></Suspense>
      <div style={{maxWidth:'1200px',margin:'16px auto 24px',padding:'0 20px',width:'100%'}}>
        <div style={{background:'#FFFFFF',border:'1px solid var(--border-subtle, #E7E5E4)',borderLeft:'4px solid var(--dancheong-crimson, #9E2A2B)',borderRadius:'12px',padding:'16px 20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.04)'}}>
          <div><strong style={{fontSize:'15px',color:'var(--ink-charcoal, #1C1917)',display:'block'}}>{copy.title}</strong><span style={{fontSize:'13px',color:'var(--stone-muted, #78716C)'}}>{copy.text}</span></div>
          <Link href="/style" className="secondaryButton">{copy.action} →</Link>
        </div>
      </div>
      <section className="prototype stitchHanbokMatcherWrap"><Suspense fallback={<div className="prototypePanel" style={{minHeight:'300px',display:'flex',alignItems:'center',justifyContent:'center'}}>Loading Hanbok Studio...</div>}><HanbokMatcher /></Suspense></section>
      <Suspense fallback={<div style={{minHeight:320}} aria-hidden="true" />}><HanbokRentalFinder shops={rentalShops} /></Suspense>
    </main>
  );
}
