import {LegacyShell} from '../LegacyShell';

export default function LegacyLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>
        <LegacyShell>{children}</LegacyShell>
      </body>
    </html>
  );
}
