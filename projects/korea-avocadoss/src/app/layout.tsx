import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://korea.avocadoss.co.kr'),
  title: {
    default: 'Korea Concierge — Your Personal Korea Guide',
    template: '%s | Korea Concierge',
  },
  description: 'Personal color, Hanbok matching, palace routes, food and Korean culture for international visitors.',
};

const nav = [
  ['My Color', '/color'],
  ['Hanbok', '/hanbok'],
  ['Gyeongbokgung', '/explore/gyeongbokgung'],
  ['K-Culture', '/culture'],
  ['Credits', '/credits'],
] as const;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <Link className="brand" href="/">KOREA CONCIERGE</Link>
          <nav aria-label="Primary navigation">
            {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
          <button className="langButton" type="button" aria-label="Change language">EN</button>
        </header>
        {children}
        <footer className="siteFooter">
          <strong>Korea Concierge</strong>
          <p>Personalized Korea travel and culture, designed for international visitors.</p>
          <span>Production target: korea.avocadoss.co.kr</span>
        </footer>
      </body>
    </html>
  );
}
