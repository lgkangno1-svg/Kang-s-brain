'use client';

import {useState} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {useSearchParams} from 'next/navigation';

import {HANBOK_STYLE_CATEGORIES} from './hanbok-visual-library';
import {isPersonalColorUndertone} from './personal-color-bridge';

export function HanbokVisualInspiration() {
  const t = useTranslations('HanbokVisual');
  const locale = useLocale();
  const searchParams = useSearchParams();
  const undertoneParam = searchParams.get('undertone');
  const [activeGender, setActiveGender] = useState<'feminine' | 'masculine'>('feminine');

  function toggleGender() {
    setActiveGender((current) => current === 'feminine' ? 'masculine' : 'feminine');
  }

  const screenTitle = locale === 'en' ? 'Hanbok Style Selection' : t('title');
  const stepLabel = locale === 'en' ? 'Step 2 of 4: Hanbok Selection' : t('eyebrow');

  return (
    <section className="stitchHanbokSelection" aria-labelledby="hanbok-visual-reference-title">
      <div className="stitchHanbokStep">
        <span>{stepLabel}</span>
        <div className="stitchHanbokProgress" aria-hidden="true" />
      </div>

      <h1 id="hanbok-visual-reference-title">{screenTitle}</h1>

      <div className="stitchHanbokToggleRow">
        <span>{t('feminineTab')}</span>
        <button
          type="button"
          className="stitchHanbokSwitch"
          role="switch"
          aria-checked={activeGender === 'masculine'}
          aria-label={t('genderToggleAria')}
          data-gender={activeGender}
          onClick={toggleGender}
        />
        <span>{t('masculineTab')}</span>
      </div>

      <div className="stitchHanbokCards">
        {HANBOK_STYLE_CATEGORIES.map((category) => {
          const activeRef = activeGender === 'feminine' ? category.feminineRef : category.masculineRef;
          const matcherQuery = new URLSearchParams({hanbokStyle: category.id});
          if (isPersonalColorUndertone(undertoneParam)) matcherQuery.set('undertone', undertoneParam);

          return (
            <article className="stitchHanbokCard" key={category.id} data-category={category.id}>
              <h3>{category.name}</h3>
              <a
                href={activeRef.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${category.name} · ${t('viewSource')}`}
              >
                <img
                  src={activeRef.imageUrl}
                  alt={t(`categories.${category.id}.${activeGender}.alt`)}
                  width={activeRef.sourceWidth}
                  height={activeRef.sourceHeight}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  style={{objectPosition: activeRef.objectPosition ?? 'center 20%'}}
                />
              </a>
              <div className="stitchHanbokCardDivider" aria-hidden="true" />
              <p>{t(`categories.${category.id}.${activeGender}.description`)}</p>
              <div className="stitchHanbokCardAction">
                <a href={`?${matcherQuery.toString()}#hanbok-matcher`}>
                  {t('findMatchAction')}
                </a>
              </div>
              <small className="stitchHanbokSource">
                {t('sourceLabel')}: {activeRef.sourceLabel} · {activeRef.credit} · {activeRef.license}
              </small>
            </article>
          );
        })}
      </div>
    </section>
  );
}
