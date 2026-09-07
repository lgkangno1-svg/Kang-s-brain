'use client';

import {useLocale} from 'next-intl';

type P0Locale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';

type NotFoundCopy = {
  eyebrow: string;
  title: string;
  body: string;
  home: string;
  explore: string;
};

const NOT_FOUND_COPY: Record<P0Locale, NotFoundCopy> = {
  en: {
    eyebrow: 'Korea Concierge · 404',
    title: 'This guide is not here',
    body: 'The link may be outdated or the guide may have moved. Return to your Korea Concierge home, or continue with the Gyeongbokgung visitor guide.',
    home: 'Return home',
    explore: 'Open palace guide',
  },
  'zh-CN': {
    eyebrow: 'Korea Concierge · 404',
    title: '找不到此指南',
    body: '此链接可能已过期，或指南已移动。您可以返回 Korea Concierge 首页，或继续查看景福宫游客指南。',
    home: '返回首页',
    explore: '打开宫殿指南',
  },
  ja: {
    eyebrow: 'Korea Concierge · 404',
    title: 'このガイドは見つかりません',
    body: 'リンクが古いか、ガイドが移動した可能性があります。Korea Concierge のホームに戻るか、景福宮の旅行ガイドを続けてご覧ください。',
    home: 'ホームに戻る',
    explore: '宮殿ガイドを見る',
  },
  'zh-TW': {
    eyebrow: 'Korea Concierge · 404',
    title: '找不到此指南',
    body: '此連結可能已過期，或指南已移動。您可以返回 Korea Concierge 首頁，或繼續查看景福宮旅遊指南。',
    home: '返回首頁',
    explore: '開啟宮殿指南',
  },
  vi: {
    eyebrow: 'Korea Concierge · 404',
    title: 'Không tìm thấy hướng dẫn này',
    body: 'Liên kết có thể đã cũ hoặc hướng dẫn đã được chuyển. Hãy quay về trang chủ Korea Concierge hoặc tiếp tục với cẩm nang tham quan Gyeongbokgung.',
    home: 'Về trang chủ',
    explore: 'Mở cẩm nang cung điện',
  },
  th: {
    eyebrow: 'Korea Concierge · 404',
    title: 'ไม่พบคู่มือนี้',
    body: 'ลิงก์อาจเก่าหรือคู่มือถูกย้ายแล้ว กลับไปหน้าแรกของ Korea Concierge หรืออ่านคู่มือเที่ยวพระราชวังคยองบกกุงต่อได้',
    home: 'กลับหน้าหลัก',
    explore: 'เปิดคู่มือพระราชวัง',
  },
};

export default function NotFound() {
  const locale = useLocale() as P0Locale;
  const copy = NOT_FOUND_COPY[locale] ?? NOT_FOUND_COPY.en;

  return (
    <main className="routeStateShell">
      <section className="routeStateCard routeStateNotFound" aria-labelledby="not-found-title">
        <p className="routeStateEyebrow">{copy.eyebrow}</p>
        <div className="routeStateMark" aria-hidden="true">404</div>
        <h1 id="not-found-title">{copy.title}</h1>
        <p>{copy.body}</p>
        <div className="routeStateActions">
          <a className="routeStatePrimary" href={`/${locale}`}>{copy.home}</a>
          <a className="routeStateSecondary" href={`/${locale}/explore/gyeongbokgung`}>{copy.explore}</a>
        </div>
      </section>
    </main>
  );
}
