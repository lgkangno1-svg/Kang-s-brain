export const metadata = { title: 'K-Culture Lab' };

export default function CulturePage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">K-Culture Lab</p>
        <h1>Explore traditions as culture, not certainty.</h1>
        <p>Korean zodiac and Saju can become shareable cultural experiences. Birth details will require separate consent, and readings will be framed as entertainment/traditional interpretation rather than professional advice.</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>Planned experiences</h2>
          <div className="stepList">
            <div className="step"><b>띠</b><div><strong>Korean zodiac</strong><p>A lightweight free cultural entry point.</p></div></div>
            <div className="step"><b>四柱</b><div><strong>Saju / Four Pillars</strong><p>Five-element storytelling, optional birth time and a paid detailed narrative.</p></div></div>
            <div className="step"><b>✦</b><div><strong>Color connection</strong><p>Traditional lucky-color storytelling can be shown separately from scientific/personal-color guidance.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
