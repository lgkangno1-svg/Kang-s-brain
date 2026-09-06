'use client';

import {useLocale} from 'next-intl';

type P0Locale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';

type ErrorCopy = {
  eyebrow: string;
  title: string;
  body: string;
  retry: string;
  home: string;
};

const ERROR_COPY: Record<P0Locale, ErrorCopy> = {
  en: {
    eyebrow: 'Korea Concierge',
    title: 'We couldn’t load this page',
    body: 'Your trip context is still here. Try this page again, or return to Korea Concierge and continue from another guide.',
    retry: 'Try again',
    home: 'Return home',
  },
  'zh-CN': {
    eyebrow: 'Korea Concierge',
    title: '此页面暂时无法加载',
    body: '您的旅行上下文仍会保留。请重试此页面，或返回 Korea Concierge 从其他指南继续。',
    retry: '重试',
    home: '返回首页',
  },
  ja: {
    eyebrow: 'Korea Concierge',
    title: 'このページを読み込めませんでした',
    body: '旅のコンテキストは保持されています。もう一度試すか、Korea Concierge のホームに戻って別のガイドから続けてください。',
    retry: 'もう一度試す',
    home: 'ホームに戻る',
  },
  'zh-TW': {
    eyebrow: 'Korea Concierge',
    title: '此頁面暫時無法載入',
    body: '您的旅行脈絡仍會保留。請重試此頁面，或返回 Korea Concierge 從其他指南繼續。',
    retry: '再試一次',
    home: '返回首頁',
  },
  vi: {
    eyebrow: 'Korea Concierge',
    title: 'Không thể tải trang này',
    body: 'Ngữ cảnh chuyến đi của bạn vẫn được giữ lại. Hãy thử lại hoặc quay về Korea Concierge để tiếp tục từ một hướng dẫn khác.',
    retry: 'Thử lại',
    home: 'Về trang chủ',
  },
  th: {
    eyebrow: 'Korea Concierge',
    title: 'ไม่สามารถโหลดหน้านี้ได้',
    body: 'บริบทของทริปยังคงอยู่ ลองโหลดหน้านี้อีกครั้ง หรือกลับไปที่ Korea Concierge แล้วดำเนินต่อจากคู่มืออื่น',
    retry: 'ลองอีกครั้ง',
    home: 'กลับหน้าหลัก',
  },
};

export default function Error({reset}: {error: Error & {digest?: string}; reset: () => void}) {
  const locale = useLocale() as P0Locale;
  const copy = ERROR_COPY[locale] ?? ERROR_COPY.en;

  return (
    <main className="routeStateShell">
      <section className="routeStateCard routeStateError" role="alert" aria-live="assertive" aria-atomic="true">
        <p className="routeStateEyebrow">{copy.eyebrow}</p>
        <div className="routeStateMark" aria-hidden="true">!</div>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="routeStateActions">
          <button type="button" className="routeStatePrimary" onClick={reset}>{copy.retry}</button>
          <a className="routeStateSecondary" href={`/${locale}`}>{copy.home}</a>
        </div>
      </section>
    </main>
  );
}
