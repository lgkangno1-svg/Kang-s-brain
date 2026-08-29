import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Completed | Korea Concierge',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Order...</div>}>
      {children}
    </Suspense>
  );
}
