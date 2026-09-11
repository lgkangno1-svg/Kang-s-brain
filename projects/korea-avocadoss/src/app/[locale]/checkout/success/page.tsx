import { Link } from '@/i18n/navigation';

type SupportedLocale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';

type CheckoutHoldCopy = {
  eyebrow: string;
  title: string;
  message: string;
  detail: string;
  primary: string;
  secondary: string;
};

const COPY: Record<SupportedLocale, CheckoutHoldCopy> = {
  en: {
    eyebrow: 'Payment confirmation unavailable',
    title: 'This page does not confirm a purchase',
    message: 'Korea Concierge sales are not active yet. A return URL or session-shaped value is not proof that payment succeeded.',
    detail: 'We will only show a paid result after a server-side provider check is bound to an authenticated order and entitlement. Until that durable verification exists, this route fails closed.',
    primary: 'Open free Style Preview',
    secondary: 'Return home',
  },
  'zh-CN': {
    eyebrow: '暂时无法确认付款',
    title: '此页面不会确认购买成功',
    message: 'Korea Concierge 尚未开放销售。仅返回到此页面，或提供类似支付会话的值，都不能证明付款成功。',
    detail: '只有在服务器端核验支付服务商结果，并与已登录用户的订单和权益绑定后，我们才会显示付费结果。在此持久化验证完成前，本页面会保持关闭状态。',
    primary: '打开免费造型预览',
    secondary: '返回首页',
  },
  ja: {
    eyebrow: '支払い確認は利用できません',
    title: 'このページだけでは購入完了になりません',
    message: 'Korea Concierge はまだ販売を開始していません。このページへの戻り先URLや決済セッションらしい値だけでは、支払い成功を証明できません。',
    detail: '決済事業者をサーバー側で検証し、ログイン済みユーザーの注文と利用権に結び付けた場合にのみ有料結果を表示します。その永続的な検証が整うまでは、この経路は安全側に閉じます。',
    primary: '無料スタイルプレビューを開く',
    secondary: 'ホームへ戻る',
  },
  'zh-TW': {
    eyebrow: '目前無法確認付款',
    title: '此頁面不代表購買成功',
    message: 'Korea Concierge 尚未開放銷售。僅回到此頁面，或帶入看似付款工作階段的值，都不能證明付款成功。',
    detail: '只有伺服器端完成付款服務商驗證，並將結果綁定至已登入使用者的訂單與權益後，我們才會顯示付費結果。在這項持久化驗證完成前，此路徑會維持關閉。',
    primary: '開啟免費造型預覽',
    secondary: '返回首頁',
  },
  vi: {
    eyebrow: 'Chưa thể xác nhận thanh toán',
    title: 'Trang này không xác nhận việc mua hàng',
    message: 'Korea Concierge chưa mở bán. Việc quay lại URL này hoặc có một giá trị trông giống mã phiên thanh toán không chứng minh rằng thanh toán đã thành công.',
    detail: 'Kết quả trả phí chỉ được hiển thị sau khi máy chủ xác minh nhà cung cấp thanh toán và liên kết kết quả đó với đơn hàng cùng quyền truy cập của người dùng đã đăng nhập. Cho đến khi có lớp xác minh bền vững này, tuyến này sẽ đóng an toàn.',
    primary: 'Mở bản xem trước phong cách miễn phí',
    secondary: 'Về trang chủ',
  },
  th: {
    eyebrow: 'ยังไม่สามารถยืนยันการชำระเงินได้',
    title: 'หน้านี้ไม่ใช่หลักฐานว่าการซื้อสำเร็จ',
    message: 'Korea Concierge ยังไม่เปิดการขาย การกลับมายัง URL นี้หรือมีค่าที่ดูคล้ายรหัสเซสชันการชำระเงิน ไม่ได้พิสูจน์ว่าชำระเงินสำเร็จ',
    detail: 'เราจะแสดงผลแบบชำระเงินก็ต่อเมื่อเซิร์ฟเวอร์ตรวจสอบผู้ให้บริการชำระเงินแล้ว และผูกผลนั้นกับคำสั่งซื้อและสิทธิ์ของผู้ใช้ที่เข้าสู่ระบบ จนกว่าจะมีการตรวจสอบแบบถาวรนี้ เส้นทางนี้จะปิดไว้เพื่อความปลอดภัย',
    primary: 'เปิดตัวอย่างสไตล์ฟรี',
    secondary: 'กลับหน้าหลัก',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getCopy(locale: string): CheckoutHoldCopy {
  return COPY[locale as SupportedLocale] ?? COPY.en;
}

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const copy = getCopy(locale);

  return (
    <main style={{ maxWidth: '680px', margin: '4rem auto', padding: '1.5rem' }}>
      <section className="prototypePanel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <p className="eyebrow" style={{ color: '#9c1c2b' }}>{copy.eyebrow}</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 1rem 0' }}>
          {copy.title}
        </h1>
        <p style={{ color: '#57534e', lineHeight: 1.65, marginBottom: '1rem' }}>
          {copy.message}
        </p>
        <p style={{ color: '#57534e', lineHeight: 1.65, marginBottom: '1.75rem' }}>
          {copy.detail}
        </p>

        <div style={{ borderTop: '1px solid #f0eeeb', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link href="/style" className="primaryButton" style={{ width: '100%', justifyContent: 'center' }}>
            {copy.primary}
          </Link>
          <Link href="/" style={{ color: '#2d5a4c', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'underline' }}>
            {copy.secondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
