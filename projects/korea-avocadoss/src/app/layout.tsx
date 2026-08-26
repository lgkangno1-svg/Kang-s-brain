import type {Metadata} from 'next';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {
    default: 'Korea Concierge — Your Personal Korea Guide',
    template: '%s | Korea Concierge',
  },
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};

// Document shells live in the locale and legacy route groups so each tree can
// own the correct <html lang>. Keep this top-level layout as a shared metadata
// and global-style boundary only.
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return children;
}
