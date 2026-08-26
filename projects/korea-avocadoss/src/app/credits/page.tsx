import {
  CREDIT_PLANS,
  FEATURE_CREDIT_PRICES,
  effectiveUsdPerCredit,
} from '@/lib/credits/economics';

export const metadata = { title: 'Credits' };

const featuredActions = FEATURE_CREDIT_PRICES.filter((feature) => feature.credits > 0).slice(0, 8);

export default function CreditsPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">One-time Trip Passes · No monthly subscription at launch</p>
        <h1>Buy credits once. Spend them only when personalization is worth it.</h1>
        <p>
          Travel guides, places and basic discovery stay useful for free. Credits are for personalized reports,
          AI planning and deeper K-culture experiences. Every paid action shows its exact credit cost before you run it.
        </p>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>Choose a Trip Pass</h2>
          <p>Advanced is designed as the default fit for a multi-day Seoul visit. Prices are launch hypotheses and remain server-configurable.</p>
          <div className="creditPacks">
            {CREDIT_PLANS.map((plan) => (
              <div className="creditPack" key={plan.id}>
                <small>{plan.badge ?? 'Trip Pass'}</small>
                <p><strong>{plan.name}</strong></p>
                <p><strong>{plan.credits}</strong> credits</p>
                <b>${plan.priceUsd.toFixed(2)}</b>
                <p>${effectiveUsdPerCredit(plan).toFixed(3)} / credit</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>What credits can unlock</h2>
          <p>Feature prices are fixed per action, not variable token billing. Failed paid jobs release their reserved credits automatically.</p>
          <div className="stepList">
            {featuredActions.map((feature) => (
              <div className="step" key={feature.feature}>
                <b>{feature.credits}</b>
                <div>
                  <strong>{feature.label}</strong>
                  <p>{feature.credits} credits before confirmation</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype">
        <div className="prototypePanel">
          <h2>Built to be predictable</h2>
          <div className="stepList">
            <div className="step"><b>01</b><div><strong>Server-authoritative wallet</strong><p>The browser cannot mint credits, change prices or edit balances.</p></div></div>
            <div className="step"><b>02</b><div><strong>International checkout</strong><p>Target: overseas cards and PayPal through a Korea-compatible payment provider.</p></div></div>
            <div className="step"><b>03</b><div><strong>Cost shown first</strong><p>You see the exact credit charge and remaining balance before a premium action.</p></div></div>
            <div className="step"><b>04</b><div><strong>Failure-safe usage</strong><p>If a paid generation fails, reserved credits are released instead of disappearing.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
