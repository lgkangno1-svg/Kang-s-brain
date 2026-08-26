import { NextIntlClientProvider } from 'next-intl';
import { ColorScanner } from '@/features/color/color-scanner';
import publicMessages from '../../../messages/public/en.json';

export const metadata = { title: 'My Personal Color' };

export default function ColorPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">Personal Color · Working prototype</p>
        <h1>Find colors worth trying in Korea.</h1>
        <p>Start with a private browser-side selfie scan, review the estimate, then carry the palette into your Hanbok recommendation.</p>
      </section>
      <section className="prototype">
        <NextIntlClientProvider locale="en" messages={{ ColorScanner: publicMessages.ColorScanner }}>
          <ColorScanner />
        </NextIntlClientProvider>
      </section>
    </main>
  );
}
