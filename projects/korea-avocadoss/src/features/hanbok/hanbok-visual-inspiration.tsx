import {useTranslations} from 'next-intl';

import {HANBOK_VISUAL_REFERENCES} from './hanbok-visual-library';
import styles from './hanbok-visual-inspiration.module.css';

export function HanbokVisualInspiration() {
  const t = useTranslations('HanbokVisual');

  return (
    <section className={styles.section} aria-labelledby="hanbok-visual-reference-title">
      <div className={styles.header}>
        <div className={styles.badgeRow}>
          <span className={styles.eyebrow}>{t('eyebrow')}</span>
          <span className={styles.heroPill}>{t('heroPill')}</span>
        </div>
        <h4 id="hanbok-visual-reference-title">{t('title')}</h4>
        <p>{t('intro')}</p>
      </div>

      <div className={styles.grid}>
        {HANBOK_VISUAL_REFERENCES.map((reference) => (
          <article className={styles.card} key={reference.id}>
            <div className={styles.imageContainer}>
              <a
                className={styles.imageLink}
                href={reference.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${t(reference.id + '.title')} · ${t('viewSource')}`}
              >
                <img
                  src={reference.imageUrl}
                  alt={t(reference.id + '.alt')}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <span className={styles.imageBadge}>{t(reference.id + '.tag')}</span>
              </a>
            </div>

            <div className={styles.body}>
              <div className={styles.titleRow}>
                <h5>{t(reference.id + '.title')}</h5>
              </div>
              <p className={styles.description}>{t(reference.id + '.description')}</p>

              <div className={styles.actionRow}>
                <a
                  className={styles.tryButton}
                  href="#hanbok-matcher"
                  aria-label={`${t('tryStyleAction')}: ${t(reference.id + '.title')}`}
                >
                  <span>{t('tryStyleAction')}</span>
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
                    <strong>{t('sourceLabel')}:</strong> {reference.sourceLabel}
                  </span>
                  <a
                    className={styles.sourceLink}
                    href={reference.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {t('viewSource')} ↗
                  </a>
                </div>
                <span className={styles.creditLine}>{reference.credit} · {reference.license}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.noticeContainer}>
        <p className={styles.notice}>{t('notice')}</p>
      </div>
    </section>
  );
}
