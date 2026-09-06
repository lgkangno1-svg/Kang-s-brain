'use client';

import {useLocale} from 'next-intl';

type P0Locale = 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';

const LOADING_COPY: Record<P0Locale, {eyebrow: string; title: string; body: string}> = {
  en: {
    eyebrow: 'Korea Concierge',
    title: 'Preparing your Korea guide…',
    body: 'Loading the next part of your trip without losing your place.',
  },
  'zh-CN': {
    eyebrow: 'Korea Concierge',
    title: '正在准备您的韩国旅行指南…',
    body: '正在载入下一段行程，并保留您当前的位置。',
  },
  ja: {
    eyebrow: 'Korea Concierge',
    title: '韓国ガイドを準備しています…',
    body: '現在の位置を保ったまま、次の旅情報を読み込んでいます。',
  },
  'zh-TW': {
    eyebrow: 'Korea Concierge',
    title: '正在準備您的韓國旅遊指南…',
    body: '正在載入下一段行程，並保留您目前的位置。',
  },
  vi: {
    eyebrow: 'Korea Concierge',
    title: 'Đang chuẩn bị cẩm nang Hàn Quốc của bạn…',
    body: 'Đang tải phần tiếp theo của hành trình mà không làm mất vị trí hiện tại.',
  },
  th: {
    eyebrow: 'Korea Concierge',
    title: 'กำลังเตรียมคู่มือเที่ยวเกาหลีของคุณ…',
    body: 'กำลังโหลดส่วนถัดไปของทริปโดยคงตำแหน่งปัจจุบันของคุณไว้',
  },
};

export default function Loading() {
  const locale = useLocale() as P0Locale;
  const copy = LOADING_COPY[locale] ?? LOADING_COPY.en;

  return (
    <main className="routeStateShell" aria-busy="true">
      <section className="routeStateCard" role="status" aria-live="polite" aria-atomic="true">
        <p className="routeStateEyebrow">{copy.eyebrow}</p>
        <div className="routeStateSpinner" aria-hidden="true" />
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
      </section>
    </main>
  );
}
