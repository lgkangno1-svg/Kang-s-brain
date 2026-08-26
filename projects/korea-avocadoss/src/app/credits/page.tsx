export const metadata = { title: 'Credits' };

const packs = [
  { credits: 100, price: '$4.99', label: 'Starter' },
  { credits: 250, price: '$9.99', label: 'Explorer' },
  { credits: 600, price: '$19.99', label: 'Traveler' },
];

export default function CreditsPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">Credit wallet · Pricing hypothesis</p>
        <h1>Pay once, use premium features when you need them.</h1>
        <p>Free travel discovery remains useful. Credits are intended for AI-heavy work such as detailed reports, visual Hanbok previews, premium itineraries and extended Saju readings.</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>Initial packs</h2>
          <p>Prices are configurable hypotheses until provider fees, AI cost and conversion data are measured.</p>
          <div className="creditPacks">
            {packs.map((pack) => <div className="creditPack" key={pack.credits}><small>{pack.label}</small><p><strong>{pack.credits}</strong> credits</p><b>{pack.price}</b></div>)}
          </div>
          <div className="stepList">
            <div className="step"><b>01</b><div><strong>Server-authoritative wallet</strong><p>The browser cannot mint or directly edit credits.</p></div></div>
            <div className="step"><b>02</b><div><strong>International checkout</strong><p>Target: overseas cards + PayPal through a Korea-compatible payment provider.</p></div></div>
            <div className="step"><b>03</b><div><strong>Failure-safe usage</strong><p>Paid feature failures automatically release reserved credits.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
