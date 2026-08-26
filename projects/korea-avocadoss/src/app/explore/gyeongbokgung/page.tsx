export const metadata = { title: 'Gyeongbokgung Personal Guide' };

export default function GyeongbokgungPage() {
  return (
    <main>
      <section className="pageIntro">
        <p className="eyebrow">Gyeongbokgung · Launch area</p>
        <h1>Rent, photograph, explore and eat — without losing your return time.</h1>
        <p>This hub will combine palace planning, Hanbok rental shops, photo locations, Seochon/Bukchon walks and food into one time-aware route.</p>
      </section>
      <section className="prototype">
        <div className="prototypePanel">
          <h2>Route modes</h2>
          <div className="stepList">
            <div className="step"><b>1H</b><div><strong>Photo sprint</strong><p>Short palace route with a safe rental-return buffer.</p></div></div>
            <div className="step"><b>2H</b><div><strong>Palace + signature photos</strong><p>Balanced route for first-time visitors.</p></div></div>
            <div className="step"><b>4H</b><div><strong>Palace + neighborhood + food</strong><p>Add Seochon/Bukchon, café or a meal based on walking tolerance.</p></div></div>
          </div>
        </div>
      </section>
    </main>
  );
}
