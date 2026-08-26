export const metadata = { title: 'Find My Hanbok' };

export default function HanbokPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">Hanbok Match · Phase 1</p>
        <h1>Your palace look should match more than a trend.</h1>
        <p>The recommendation engine will combine personal-color signals with mood, palace backdrop, season, coverage and walking comfort.</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>Recommendation inputs</h2>
          <div className="stepList">
            <div className="step"><b>A</b><div><strong>Color</strong><p>Personal-color result or manual palette preference.</p></div></div>
            <div className="step"><b>B</b><div><strong>Mood</strong><p>Traditional elegant, royal/dramatic, soft romantic, modern minimal, K-drama or most photogenic.</p></div></div>
            <div className="step"><b>C</b><div><strong>Trip reality</strong><p>Weather, rental duration, destination, coverage and comfort.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
