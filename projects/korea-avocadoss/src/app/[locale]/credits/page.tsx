import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {CREDIT_PLANS, FEATURE_CREDIT_PRICES, TOP_UP_PACKS, effectiveUsdPerCredit} from '@/lib/credits/economics';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

function featureMessageKey(feature: string) { return `features.${feature.replaceAll('.', '_')}` as const; }

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Meta'});
  return {title: t('creditsTitle'), description: t('creditsDescription'), alternates: localizedAlternates(locale, '/credits')};
}

export default async function CreditsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Credits');
  const money = new Intl.NumberFormat(locale, {style: 'currency', currency: 'USD'});
  const paidFeatures = FEATURE_CREDIT_PRICES.filter((feature) => feature.credits > 0);

  return (
    <main className="stitchCreditsWrap">
      <section className="stitchCreditsCard">
        <header className="stitchCreditsHead">
          <div><p className="eyebrow">{t('eyebrow')}</p><h1>{t('title')}</h1></div>
          <div className="contextBox" role="note"><strong>{t('catalogStatus')}</strong><p>{t('catalogNotice')}</p></div>
        </header>
        <div className="stitchCreditsGrid">
          <aside className="stitchCreditsBalance">
            <small>{t('passesTitle')}</small>
            <b>{CREDIT_PLANS[0]?.credits.toLocaleString(locale) ?? '—'}</b>
            <span>{t('creditsUnit')}</span>
            <p>{t('passesIntro')}</p>
          </aside>
          <div className="stitchCreditsDetails">
            <h2>{t('passesTitle')}</h2>
            <div className="creditPacks">
              {CREDIT_PLANS.map((plan) => (
                <article className="creditPack" key={plan.id}>
                  <small>{t(`plans.${plan.id}.badge`)}</small>
                  <p><strong>{t(`plans.${plan.id}.name`)}</strong></p>
                  <p><strong>{plan.credits.toLocaleString(locale)}</strong> {t('creditsUnit')}</p>
                  <b>{money.format(plan.priceUsd)}</b>
                  <p>{money.format(effectiveUsdPerCredit(plan))} {t('perCredit')}</p>
                </article>
              ))}
            </div>
            <div className="stitchEditorialSection">
              <h2>{t('refillsTitle')}</h2>
              <div className="creditPacks creditRefills">
                {TOP_UP_PACKS.map((pack) => <article className="creditPack" key={pack.id}><small>{t('refillLabel')}</small><p><strong>{pack.credits.toLocaleString(locale)}</strong> {t('creditsUnit')}</p><b>{money.format(pack.priceUsd)}</b></article>)}
              </div>
            </div>
            <div className="stitchEditorialSection">
              <h2>{t('actionsTitle')}</h2>
              <div className="stepList creditActionList">
                {paidFeatures.map((feature) => <div className="step" key={feature.feature}><b>{feature.credits}</b><div><strong>{t(featureMessageKey(feature.feature))}</strong><p>{feature.credits} {t('beforeConfirmation')}</p></div></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
