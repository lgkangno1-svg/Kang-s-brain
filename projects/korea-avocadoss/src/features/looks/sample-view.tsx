'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { SampleStylebook } from '@/lib/looks/samples';
import styles from './looks.module.css';

interface SampleViewProps {
  stylebook: SampleStylebook;
  currentSlug: string;
}

export function SampleView({ stylebook, currentSlug }: SampleViewProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(stylebook.koreanShopCardSummary.instructionKorean);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className={styles.container}>
      {/* Sample Banner Guard */}
      <div className={styles.sampleBanner}>
        <div className={styles.sampleBadge}>
          <span>★ {stylebook.badge}</span>
        </div>
        <p className={styles.sampleDisclaimer}>
          This is a fictitious one-adult public demonstration of the planned <strong>My Korea Look</strong> stylebook.
          It shows the intended result depth, but paid checkout and private delivery are not available until account,
          fulfillment, refund, and merchant requirements are production-verified.
        </p>
      </div>

      {/* Header */}
      <header className={styles.headerSection}>
        <div className={styles.eyebrow}>My Korea Look · Curated Sample</div>
        <h1 className={styles.mainTitle}>{stylebook.title}</h1>
        <p className={styles.subtitle}>{stylebook.tagline}</p>
        <div className={styles.priceTagWrapper}>
          <span className={styles.priceTag}>Planned launch price: $12.00 USD</span>
          <span className={styles.priceDesc}>One adult · 3 curated looks · Korean shop card · photo-route plan</span>
        </div>
      </header>

      {/* Sample Switcher Tabs */}
      <div className={styles.sampleTabs} role="tablist" aria-label="Explore other curated samples">
        <Link
          href="/style/sample/palace-elegance"
          className={`${styles.tabBtn} ${currentSlug === 'palace-elegance' ? styles.tabBtnActive : ''}`}
        >
          1. Palace Elegance (Queen/King)
        </Link>
        <Link
          href="/style/sample/modern-pastel"
          className={`${styles.tabBtn} ${currentSlug === 'modern-pastel' ? styles.tabBtnActive : ''}`}
        >
          2. Modern Pastel (Princess/Prince)
        </Link>
        <Link
          href="/style/sample/royal-ceremony"
          className={`${styles.tabBtn} ${currentSlug === 'royal-ceremony' ? styles.tabBtnActive : ''}`}
        >
          3. Royal Ceremony
        </Link>
      </div>

      {/* Persona Context Card */}
      <section className={styles.personaCard}>
        <div>
          <div className={styles.personaTitle}>Traveler Profile & Aesthetic Goal</div>
          <div className={styles.personaName}>{stylebook.persona.name}</div>
          <p className={styles.personaText}>{stylebook.persona.summary}</p>
          <p className={styles.personaText}>
            <strong>Selected Vibe:</strong> {stylebook.persona.selectedStyle}
            <br />
            <strong>Color Harmony:</strong> {stylebook.persona.selectedUndertone}
          </p>
        </div>

        <div className={styles.palettePreview}>
          <div className={styles.swatchGroup}>
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: stylebook.colorAnalysisSummary.primaryHex }}
              title="Primary Tone"
            />
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: stylebook.colorAnalysisSummary.secondaryHex }}
              title="Secondary Tone"
            />
            <div
              className={styles.colorSwatch}
              style={{ backgroundColor: stylebook.colorAnalysisSummary.accentHex }}
              title="Accent Tone"
            />
          </div>
          <div>
            <strong style={{ fontSize: '13px', display: 'block' }}>
              {stylebook.colorAnalysisSummary.paletteTitle}
            </strong>
            <span style={{ fontSize: '12px', color: 'var(--stone-muted, #78716C)' }}>
              {stylebook.colorAnalysisSummary.paletteNotes}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Looks Grid */}
      <section className={styles.looksSection}>
        <h2 className={styles.sectionHeading}>
          <span>3 Curated Looks Tailored to This Profile</span>
        </h2>

        <div className={styles.looksGrid}>
          {stylebook.looks.map((look, idx) => (
            <article key={look.id} className={styles.lookCard}>
              <div className={styles.imageFrame}>
                <span className={styles.lookIndexBadge}>Look {idx + 1} of 3</span>
                <img
                  src={look.src}
                  alt={look.alt}
                  className={styles.lookImg}
                  loading="lazy"
                  style={{ objectPosition: look.cropPosition }}
                />
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.lookTitle}>{look.title}</h3>
                <div className={styles.lookTagline}>{look.tagline}</div>
                <p className={styles.lookDesc}>{look.description}</p>

                <ul className={styles.reasonsList}>
                  {look.reasons.map((reason, rIdx) => (
                    <li key={rIdx} className={styles.reasonItem}>
                      <span className={styles.reasonDot}>✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.tradeOffBox}>
                  <strong>Practical Note:</strong> {look.tradeOff}
                </div>

                <div className={styles.locationTip}>
                  <strong>Suggested Palace Spot:</strong> {look.recommendedLocation.name} ({look.recommendedLocation.koreanName})
                  <br />
                  <span style={{ fontSize: '11px', color: 'var(--stone-muted, #78716C)' }}>
                    Photo idea: {look.recommendedLocation.photoAngle}
                  </span>
                </div>
              </div>

              <div className={styles.sourceCredit}>
                <span>Source: {look.creator.split('/')[0]}</span>
                <a
                  href={look.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={styles.sourceLink}
                >
                  View Source ({look.license})
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Korean Rental Shop Card */}
      <section className={styles.shopCardSection}>
        <div className={styles.shopCardHeader}>
          <span className={styles.shopCardBadge}>Bilingual In-Store Request Card</span>
          <button
            type="button"
            onClick={handleCopy}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid var(--dancheong-crimson, #9E2A2B)',
              background: '#FFFFFF',
              color: 'var(--dancheong-crimson, #9E2A2B)',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy Korean Text'}
          </button>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px' }}>
          Ask Rental Staff to Check What Is Actually Available
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--stone-muted, #78716C)', margin: '0 0 16px' }}>
          {stylebook.koreanShopCardSummary.instructionEnglish}
        </p>

        <div className={styles.hangulBox}>
          <span className={styles.hangulLabel}>Korean Staff Request Note (한국어 대여 요청 문구)</span>
          {stylebook.koreanShopCardSummary.instructionKorean}
        </div>
      </section>

      {/* Palace Photo Walking Route */}
      <section className={styles.routeSection}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px' }}>
          Example 2-Hour Palace Photo Itinerary
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--stone-muted, #78716C)', margin: 0 }}>
          This is a planning example, not live routing or crowd information. Check current palace hours, closures, weather,
          and walking conditions before visiting.
        </p>

        <div className={styles.routeTimeline}>
          {stylebook.looks[0].photoRoute.map((stop) => (
            <div key={stop.order} className={styles.routeStop}>
              <div className={styles.stopHeader}>
                <span className={styles.stopOrder}>STOP {stop.order}</span>
                <span className={styles.stopTime}>{stop.bestTime}</span>
              </div>
              <div className={styles.stopName}>{stop.spotName}</div>
              <div className={styles.stopKorean}>{stop.koreanName}</div>
              <p className={styles.stopTip}>{stop.photoTip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Box */}
      <section className={styles.ctaBox}>
        <h2 className={styles.ctaTitle}>Try the Free My Korea Look Preview</h2>
        <p className={styles.ctaDesc}>
          Use the free preference-based consultation now. Paid photo-aware styling, private delivery, revision, and checkout
          remain unavailable until the required account, privacy, fulfillment, refund, and merchant gates are verified.
        </p>
        <Link href="/style" className={styles.ctaBtn}>
          <span>Start the Free Style Preview</span>
          <span>→</span>
        </Link>
      </section>
    </div>
  );
}
