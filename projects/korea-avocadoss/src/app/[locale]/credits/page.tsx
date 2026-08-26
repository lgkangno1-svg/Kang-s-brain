import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {
  CREDIT_PLANS,
  FEATURE_CREDIT_PRICES,
  TOP_UP_PACKS,
  effectiveUsdPerCredit,
} from '@/lib/credits/economics';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

function featureMessageKey(feature: string) {
  return `features.${feature.replaceAll('.', '_')}` as const;
}

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});

  return {
    title: t('creditsTitle'),
    description: t('creditsDescription'),
    alternates: localizedAlternates(locale, '/credits'),
  };
}

export default async function CreditsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Credits');
  const money = new Intl.NumberFormat(locale, {style: 'currency', currency: 'USD'});
  const paidFeatures = FEATURE_CREDIT_PRICES.filter((feature) => feature.credits > 0);

  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h1>{t('title')}</h1>
        <p>{t('intro')}</p>
        <div className="contextBox" role="note" aria-label={t('catalogStatus')}>
          <strong>{t('catalogStatus')}</strong>
          <p>{t('catalogNotice')}</p>
        </div>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>{t('passesTitle')}</h2>
          <p>{t('passesIntro')}</p>
          <div className="creditPacks">
            {CREDIT_PLANS.map((plan) => (
              <article className="creditPack" key={plan.id}>
                <small>{t(`plans.${plan.id}.badge`)}</small>
                <p><strong>{t(`plans.${plan.id}.name`)}</strong></p>
                <p><strong>{plan.credits.toLocaleString(locale)}</strong> {t('creditsUnit')}</p>
                <b>{money.format(plan.priceUsd)}</b>
                <p>{money.format(effectiveUsdPerCredit(plan))} {t('perCredit')}</p>
                <p>{t(`plans.${plan.id}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>{t('refillsTitle')}</h2>
          <p>{t('refillsIntro')}</p>
          <div className="creditPacks creditRefills">
            {TOP_UP_PACKS.map((pack) => (
              <article className="creditPack" key={pack.id}>
                <small>{t('refillLabel')}</small>
                <p><strong>{pack.credits.toLocaleString(locale)}</strong> {t('creditsUnit')}</p>
                <b>{money.format(pack.priceUsd)}</b>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>{t('actionsTitle')}</h2>
          <p>{t('actionsIntro')}</p>
          <div className="stepList creditActionList">
            {paidFeatures.map((feature) => (
              <div className="step" key={feature.feature}>
                <b>{feature.credits}</b>
                <div>
                  <strong>{t(featureMessageKey(feature.feature))}</strong>
                  <p>{feature.credits} {t('beforeConfirmation')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>{t('predictableTitle')}</h2>
          <div className="stepList">
            <div className="step"><b>01</b><div><strong>{t('serverTitle')}</strong><p>{t('serverBody')}</p></div></div>
            <div className="step"><b>02</b><div><strong>{t('reserveTitle')}</strong><p>{t('reserveBody')}</p></div></div>
            <div className="step"><b>03</b><div><strong>{t('paymentTitle')}</strong><p>{t('paymentBody')}</p></div></div>
            <div className="step"><b>04</b><div><strong>{t('pricingTitle')}</strong><p>{t('pricingBody')}</p></div></div>
            <div className="step"><b>05</b><div><strong>{t('freeTitle')}</strong><p>{t('freeBody')}</p></div></div>
          </div>
          <p className="freshnessNote">{t('technicalNote')}</p>
        </div>
      </section>
    </main>
  );
}
