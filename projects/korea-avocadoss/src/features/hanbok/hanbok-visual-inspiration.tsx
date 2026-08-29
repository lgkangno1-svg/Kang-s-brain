'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

import {HANBOK_STYLE_CATEGORIES, type HanbokStyleCategory} from './hanbok-visual-library';
import styles from './hanbok-visual-inspiration.module.css';

export function HanbokVisualInspiration() {
  const t = useTranslations('HanbokVisual');
  const [activeGender, setActiveGender] = useState<'feminine' | 'masculine'>('feminine');

  return (
    <section className={styles.section} aria-labelledby="hanbok-visual-reference-title">
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <span className={styles.heroPill}>{t('heroPill')}</span>
        </div>
        <h2 id="hanbok-visual-reference-title">{t('title')}</h2>
        <p>{t('intro')}</p>

        <div className={styles.genderToggleRow} role="tablist" aria-label={t('genderToggleAria')}>
          <button
            type="button"
            role="tab"
            aria-selected={activeGender === 'feminine'}
            className={`${styles.toggleButton} ${activeGender === 'feminine' ? styles.toggleButtonActive : ''}`}
            onClick={() => setActiveGender('feminine')}
          >
            {t('feminineTab')}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeGender === 'masculine'}
            className={`${styles.toggleButton} ${activeGender === 'masculine' ? styles.toggleButtonActive : ''}`}
            onClick={() => setActiveGender('masculine')}
          >
            {t('masculineTab')}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {HANBOK_STYLE_CATEGORIES.map((category) => {
          const activeRef = activeGender === 'feminine' ? category.feminineRef : category.masculineRef;

          return (
            <article className={styles.card} key={category.id} data-category={category.id}>
              <div className={styles.imageContainer}>
                <a
                  className={styles.imageLink}
                  href={activeRef.sourceUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${t(`categories.${category.id}.name`)} (${activeRef.title}) · ${t('viewSource')}`}
                >
                  <img
                    src={activeRef.imageUrl}
                    alt={t(`categories.${category.id}.${activeGender}.alt`)}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    style={{objectPosition: activeRef.objectPosition ?? 'center 20%'}}
                  />
                  <span className={styles.imageBadge}>
                    {t(`categories.${category.id}.badge`)}
                  </span>
                </a>
              </div>

              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3>{t(`categories.${category.id}.name`)}</h3>
                  <span className={styles.styleSubtitle}>{t(`categories.${category.id}.tagline`)}</span>
                </div>

                <p className={styles.description}>
                  {t(`categories.${category.id}.${activeGender}.description`)}
                </p>

                <div className={styles.actionRow}>
                  <a
                    className={styles.tryButton}
                    href={`?hanbokStyle=${category.id}#hanbok-matcher`}
                    aria-label={`${t('findMatchAction')}: ${t(`categories.${category.id}.name`)}`}
                  >
                    <span>{t('findMatchAction')}</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <polyline points="19 12 12 19 5 12" />
                    </svg>
                  </a>
                </div>

                <div className={styles.meta}>
                  <div className={styles.sourceLine}>
                    <span className={styles.sourceTag}>
                      <strong>{t('sourceLabel')}:</strong> {activeRef.sourceLabel}
                    </span>
                    <a
                      className={styles.sourceLink}
                      href={activeRef.sourceUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {t('viewSource')} ↗
                    </a>
                  </div>
                  <span className={styles.creditLine}>{activeRef.credit} · {activeRef.license}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.noticeContainer}>
        <p className={styles.notice}>{t('notice')}</p>
      </div>
    </section>
  );
}
