import { CREDIT_PLANS, FEATURE_CREDIT_PRICES, effectiveUsdPerCredit } from "@/lib/credits/economics";

export const metadata = {
  title: "Credits & plans",
  description: "Top up Korea Concierge credits for personal color, Hanbok matching, trip planning and K-culture experiences.",
  robots: { index: false, follow: false },
};

const visibleFeatures = FEATURE_CREDIT_PRICES.filter((item) => item.feature !== "color.basic");

export default function CreditsPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">Credits · One-time top-up</p>
        <h1>Choose how much Korea you want to personalize.</h1>
        <p>
          Browsing places, food and travel guides stays useful for free. Credits unlock personalized reports,
          premium photo review, smarter itineraries and K-culture experiences. No subscription is required.
        </p>
      </section>

      <section className="prototype" aria-labelledby="credit-plans-heading">
        <div className="prototypePanel">
          <h2 id="credit-plans-heading">Credit packs</h2>
          <p>Buy once and use credits across premium features. Larger packs lower the cost per credit.</p>
          <div className="creditPacks">
            {CREDIT_PLANS.map((plan) => (
              <article className="creditPack" key={plan.id}>
                <small>{plan.badge ?? plan.name}</small>
                <h3>{plan.name}</h3>
                <p><strong>{plan.credits.toLocaleString("en-US")}</strong> credits</p>
                <b>${plan.priceUsd.toFixed(2)}</b>
                <p>${effectiveUsdPerCredit(plan).toFixed(3)} / credit</p>
                <p>{plan.description}</p>
                <button type="button" disabled aria-label={`${plan.name} checkout coming soon`}>
                  Checkout coming soon
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype" aria-labelledby="feature-cost-heading">
        <div className="prototypePanel">
          <h2 id="feature-cost-heading">What credits can unlock</h2>
          <p>Every paid action shows its exact credit price before you confirm it.</p>
          <div className="stepList">
            {visibleFeatures.map((item) => (
              <div className="step" key={item.feature}>
                <b>{item.credits}</b>
                <div>
                  <strong>{item.label}</strong>
                  <p>{item.credits} credits · Failed paid jobs automatically release reserved credits.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="prototype" aria-labelledby="wallet-safety-heading">
        <div className="prototypePanel">
          <h2 id="wallet-safety-heading">Simple and failure-safe</h2>
          <div className="stepList">
            <div className="step"><b>01</b><div><strong>Server-authoritative wallet</strong><p>Your browser cannot mint or directly change credits.</p></div></div>
            <div className="step"><b>02</b><div><strong>International-friendly checkout</strong><p>Planned launch support targets overseas cards and PayPal through a Korea-compatible payment provider.</p></div></div>
            <div className="step"><b>03</b><div><strong>No charge for failed work</strong><p>Credits are reserved before a paid feature and released automatically if the job fails or times out.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
