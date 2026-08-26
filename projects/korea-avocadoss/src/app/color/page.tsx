export const metadata = { title: 'My Personal Color' };

export default function ColorPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">Personal Color · Phase 1</p>
        <h1>Find colors worth trying in Korea.</h1>
        <p>This flow will estimate visible warm/neutral/cool tendency, depth and contrast under the current photo lighting, then connect those signals to Hanbok palettes.</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>Browser-first color scan</h2>
          <p>Your MVP selfie should stay in the browser for the basic scan. Lighting can change the result, so every estimate will be correctable.</p>
          <div className="stepList">
            <div className="step"><b>01</b><div><strong>Add a selfie</strong><p>Front-facing, natural light, minimal filter.</p></div></div>
            <div className="step"><b>02</b><div><strong>Check the estimate</strong><p>Warm / neutral / cool, visible depth and contrast with confidence.</p></div></div>
            <div className="step"><b>03</b><div><strong>Turn it into a Hanbok palette</strong><p>Near-face, skirt/baji and accent colors are ranked with reasons.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
