import {useTranslations} from 'next-intl';

import {HANBOK_VISUAL_REFERENCES} from './hanbok-visual-library';
import styles from './hanbok-visual-inspiration.module.css';

export function HanbokVisualInspiration() {
  const t = useTranslations('HanbokVisual');

  return (
    <section className={styles.section} aria-labelledby="hanbok-visual-reference-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h4 id="hanbok-visual-reference-title">{t('title')}</h4>
        <p>{t('intro')}</p>
      </div>

      <div className={styles.grid}>
        {HANBOK_VISUAL_REFERENCES.map((reference) => (
          <article className={styles.card} key={reference.id}>
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
              <span className={styles.imageBadge}>{t('referenceBadge')}</span>
            </a>

            <div className={styles.body}>
              <h5>{t(reference.id + '.title')}</h5>
              <p>{t(reference.id + '.description')}</p>
              <div className={styles.meta}>
                <span><strong>{t('sourceLabel')}:</strong> {reference.credit}</span>
                <span><strong>{t('licenseLabel')}:</strong> {reference.license}</span>
              </div>
              <a
                className={styles.sourceLink}
                href={reference.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                {t('viewSource')}
              </a>
            </div>
          </article>
        ))}
      </div>

      <p className={styles.notice}>{t('notice')}</p>
    </section>
  );
}
