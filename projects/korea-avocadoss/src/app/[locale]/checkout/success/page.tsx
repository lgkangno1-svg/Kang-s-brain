'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { isApprovedProductKey, PRODUCT_CATALOG } from '@/lib/payments/catalog';

export default function CheckoutSuccessPage() {
  const t = useTranslations('CheckoutSuccess');
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const productKey = searchParams.get('product');

  const isValidSession = Boolean(sessionId && sessionId.startsWith('cs_'));
  const productDef = isApprovedProductKey(productKey) ? PRODUCT_CATALOG[productKey] : null;

  return (
    <main style={{ maxWidth: '640px', margin: '4rem auto', padding: '1.5rem' }}>
      <section className="prototypePanel" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <p className="eyebrow" style={{ color: '#2d5a4c' }}>{t('eyebrow')}</p>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0.4rem 0 1rem 0' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#57534e', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {t('message')}
        </p>

        {productDef && (
          <div style={{ background: '#f5f4f0', padding: '1rem', borderRadius: '16px', marginBottom: '1.5rem', textAlign: 'left' }}>
            <small style={{ color: '#78716c', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>
              {t('orderItemLabel')}
            </small>
            <h4 style={{ margin: '0.2rem 0', color: '#1c1917' }}>{productDef.name}</h4>
            <p style={{ margin: 0, color: '#57534e', fontSize: '0.86rem' }}>{productDef.description}</p>
          </div>
        )}

        <div style={{ borderTop: '1px solid #f0eeeb', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link href="/hanbok" className="primaryButton" style={{ width: '100%', justifyContent: 'center' }}>
            {t('returnToHanbok')}
          </Link>
          <Link href="/credits" style={{ color: '#2d5a4c', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'underline' }}>
            {t('viewWallet')}
          </Link>
        </div>

        <p style={{ fontSize: '0.74rem', color: '#a8a29e', marginTop: '1.5rem', lineHeight: 1.4 }}>
          {t('securityNotice')}
        </p>
      </section>
    </main>
  );
}
