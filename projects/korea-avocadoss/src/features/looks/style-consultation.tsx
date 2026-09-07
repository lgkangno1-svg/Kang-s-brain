'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { CURATED_LOOKS_CATALOG, type CuratedLook, type StyleId, type GarmentType } from '@/lib/looks/catalog';
import styles from './looks.module.css';

export function StyleConsultation() {
  const locale = useLocale();
  const [stylePreference, setStylePreference] = useState<StyleId>('princess-prince');
  const [garmentType, setGarmentType] = useState<GarmentType>('chima');
  const [undertone, setUndertone] = useState<'warm' | 'cool' | 'neutral'>('cool');
  const [priority, setPriority] = useState<'photo' | 'walking' | 'heritage'>('photo');

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  // Filter matching look for free preview
  const matchedLook: CuratedLook = CURATED_LOOKS_CATALOG.find((look) => {
    return look.styleId === stylePreference && (garmentType === 'either' || look.garmentType === garmentType);
  }) || CURATED_LOOKS_CATALOG[0];

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutMessage(null);

    try {
      const res = await fetch('/api/checkout/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productKey: 'premium_hanbok_match',
          locale,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else if (data.code === 'CHECKOUT_DISABLED') {
        setCheckoutMessage('Digital payment is currently in pre-launch mode. You can inspect complete curated sample stylebooks below!');
      } else {
        setCheckoutMessage(data.error || 'Payment gateway is initializing. Please try again or inspect our samples.');
      }
    } catch {
      setCheckoutMessage('Network connection error. Please try again shortly.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.headerSection}>
        <div className={styles.eyebrow}>Interactive Styling Studio</div>
        <h1 className={styles.mainTitle}>My Korea Look Consultation</h1>
        <p className={styles.subtitle}>
          Select your travel aesthetic and comfort preferences to receive a tailored palace Hanbok recommendation.
          Preview your primary look free below, or unlock the complete 3-Look Guidebook for $12 USD.
        </p>
      </header>

      {/* Interactive Questionnaire */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle, #E7E5E4)',
        borderRadius: 'var(--radius-lg, 16px)',
        padding: '32px 24px',
        marginBottom: '48px',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 24px', color: 'var(--ink-charcoal, #1C1917)' }}>
          Step 1: Your Styling Preferences
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {/* Vibe Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--stone-muted, #78716C)', marginBottom: '8px' }}>
              1. Palace Aesthetic
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setStylePreference('princess-prince')}
                className={`${styles.tabBtn} ${stylePreference === 'princess-prince' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Princess / Prince</strong> — Soft, luminous pastels
              </button>
              <button
                type="button"
                onClick={() => setStylePreference('queen-king')}
                className={`${styles.tabBtn} ${stylePreference === 'queen-king' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Queen / King</strong> — Dignified court jewel tones
              </button>
              <button
                type="button"
                onClick={() => setStylePreference('royal')}
                className={`${styles.tabBtn} ${stylePreference === 'royal' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Royal Ceremony</strong> — Gold embroidered grandeur
              </button>
            </div>
          </div>

          {/* Garment Type */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--stone-muted, #78716C)', marginBottom: '8px' }}>
              2. Garment Preference
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setGarmentType('chima')}
                className={`${styles.tabBtn} ${garmentType === 'chima' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Chima (Skirt)</strong> — Classic feminine silhouette
              </button>
              <button
                type="button"
                onClick={() => setGarmentType('baji')}
                className={`${styles.tabBtn} ${garmentType === 'baji' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Baji (Robe & Pants)</strong> — Aristocratic noble robe
              </button>
              <button
                type="button"
                onClick={() => setGarmentType('either')}
                className={`${styles.tabBtn} ${garmentType === 'either' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Couple / Either</strong> — Open to best harmony
              </button>
            </div>
          </div>

          {/* Color Undertone */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--stone-muted, #78716C)', marginBottom: '8px' }}>
              3. Color Undertone
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setUndertone('warm')}
                className={`${styles.tabBtn} ${undertone === 'warm' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Warm Tones</strong> (Coral, Peach, Crimson, Gold)
              </button>
              <button
                type="button"
                onClick={() => setUndertone('cool')}
                className={`${styles.tabBtn} ${undertone === 'cool' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Cool Tones</strong> (Lavender, Sky Blue, Navy, Lilac)
              </button>
              <button
                type="button"
                onClick={() => setUndertone('neutral')}
                className={`${styles.tabBtn} ${undertone === 'neutral' ? styles.tabBtnActive : ''}`}
                style={{ textAlign: 'left', width: '100%', borderRadius: '10px' }}
              >
                <strong>Neutral Harmony</strong> (Ivory, Jade, Pine Green)
              </button>
            </div>
            <div style={{ marginTop: '10px' }}>
              <Link href="/color" style={{ fontSize: '12px', color: 'var(--celadon-jade, #2D5A4C)', textDecoration: 'underline' }}>
                Unsure? Try our free Personal Color selfie scan →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Free Instant Preview Section */}
      <section style={{ marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{
              background: 'var(--celadon-jade, #2D5A4C)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}>
              ✓ Free Instant Match
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '6px 0 0', color: 'var(--ink-charcoal, #1C1917)' }}>
              Your Recommended Look Preview
            </h2>
          </div>
          <span style={{ fontSize: '13px', color: 'var(--stone-muted, #78716C)' }}>
            Updated instantly based on your selections above
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle, #E7E5E4)',
          borderRadius: 'var(--radius-lg, 16px)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-md, 0 4px 20px rgba(28, 25, 23, 0.06))',
        }}>
          <div style={{ position: 'relative', aspectRatio: '4/5', background: '#F5F5F4' }}>
            <img
              src={matchedLook.src}
              alt={matchedLook.alt}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: matchedLook.cropPosition }}
            />
          </div>

          <div style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--dancheong-crimson, #9E2A2B)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
              Look 1 of 3 (Free Preview)
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--ink-charcoal, #1C1917)', margin: '0 0 8px' }}>
              {matchedLook.title}
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--stone-muted, #78716C)', lineHeight: '1.6', margin: '0 0 20px' }}>
              {matchedLook.description}
            </p>

            <div style={{
              background: 'var(--surface-parchment, #FAF8F5)',
              padding: '16px',
              borderRadius: 'var(--radius-md, 12px)',
              marginBottom: '20px',
            }}>
              <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--ink-charcoal, #1C1917)', marginBottom: '6px' }}>
                Why This Matches You:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--ink-charcoal, #1C1917)', lineHeight: '1.5' }}>
                <li>{matchedLook.reasons[0]}</li>
                <li>{matchedLook.reasons[1]}</li>
              </ul>
            </div>

            <div style={{
              padding: '12px',
              border: '1px dashed var(--border-subtle, #E7E5E4)',
              borderRadius: 'var(--radius-sm, 8px)',
              fontSize: '12px',
              color: 'var(--stone-muted, #78716C)',
            }}>
              🔒 <strong>Locked in Free Preview:</strong> Look 2 (Complementary Style), Look 3 (Alternate Colorway), Korean In-Store Rental Card, and Customized Photo Walking Map.
            </div>
          </div>
        </div>
      </section>

      {/* The $12 Paid Guidebook Offer Card */}
      <section style={{
        background: 'linear-gradient(135deg, #1C1917 0%, #2D5A4C 100%)',
        borderRadius: 'var(--radius-lg, 16px)',
        padding: '40px 28px',
        color: '#FFFFFF',
        marginBottom: '60px',
        boxShadow: '0 8px 32px rgba(28, 25, 23, 0.15)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{
            background: 'rgba(212, 175, 55, 0.25)',
            border: '1px solid #D4AF37',
            color: '#D4AF37',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 14px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'inline-block',
            marginBottom: '16px',
          }}>
            One-Time Purchase · Instant Delivery
          </span>

          <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: '800', margin: '0 0 16px' }}>
            Unlock Your Complete My Korea Look Guidebook ($12 USD)
          </h2>

          <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6', marginBottom: '32px' }}>
            Everything you need for an unforgettable Hanbok day in Seoul: three fully tailored looks,
            the exact Korean sentences to show rental staff, and a sequenced palace photo walking route.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'left',
            background: 'rgba(255, 255, 255, 0.06)',
            padding: '24px',
            borderRadius: 'var(--radius-md, 12px)',
            marginBottom: '32px',
          }}>
            <div>
              <strong style={{ color: '#D4AF37', display: 'block', marginBottom: '4px' }}>✓ 3 Complete Curated Looks</strong>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Primary, secondary, and alternate colorway options</span>
            </div>
            <div>
              <strong style={{ color: '#D4AF37', display: 'block', marginBottom: '4px' }}>✓ Korean Rental Shop Card</strong>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Show staff on your phone to get the exact matching garments</span>
            </div>
            <div>
              <strong style={{ color: '#D4AF37', display: 'block', marginBottom: '4px' }}>✓ 2-Hour Palace Photo Route</strong>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Best angles and timing at Gyeongbokgung & gardens</span>
            </div>
            <div>
              <strong style={{ color: '#D4AF37', display: 'block', marginBottom: '4px' }}>✓ 1 Free Style Revision</strong>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>Change vibe, season, or comfort anytime within 30 days</span>
            </div>
          </div>

          {checkoutMessage && (
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-sm, 8px)',
              marginBottom: '20px',
              fontSize: '14px',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              {checkoutMessage}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className={styles.ctaBtn}
              style={{ fontSize: '18px', padding: '16px 36px', minWidth: '280px' }}
            >
              {checkoutLoading ? 'Preparing Checkout...' : 'Get My Korea Look Guide ($12 USD)'}
            </button>

            <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
              Secure payment via Stripe · 100% digital instant delivery · 15-minute refund guarantee
            </span>
          </div>
        </div>
      </section>

      {/* Curated Samples Link */}
      <section style={{
        textAlign: 'center',
        padding: '32px 20px',
        background: '#FFFFFF',
        border: '1px solid var(--border-subtle, #E7E5E4)',
        borderRadius: 'var(--radius-lg, 16px)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px', color: 'var(--ink-charcoal, #1C1917)' }}>
          Want to see a real completed result before ordering?
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--stone-muted, #78716C)', margin: '0 0 16px' }}>
          Explore our official public samples showing the full 3 looks, Korean shop cards, and walking itineraries.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/style/sample/palace-elegance" className={styles.tabBtn}>
            View Palace Elegance Sample →
          </Link>
          <Link href="/style/sample/modern-pastel" className={styles.tabBtn}>
            View Modern Pastel Sample →
          </Link>
          <Link href="/style/sample/royal-ceremony" className={styles.tabBtn}>
            View Royal Ceremony Sample →
          </Link>
        </div>
      </section>
    </div>
  );
}

