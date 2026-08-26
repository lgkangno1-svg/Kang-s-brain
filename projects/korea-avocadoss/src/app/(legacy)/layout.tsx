import type {Metadata} from 'next';

import {LegacyShell} from '../LegacyShell';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {
    default: 'Korea Concierge — Your Personal Korea Guide',
    template: '%s | Korea Concierge',
  },
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};

export default function LegacyLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>
        <LegacyShell>{children}</LegacyShell>
      </body>
    </html>
  );
}
