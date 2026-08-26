import Link from 'next/link';

const modules = [
  { n: '01', title: 'My Personal Color', text: 'Use a selfie and simple corrections to find colors worth trying near your face.', href: '/color', action: 'Start color scan' },
  { n: '02', title: 'Find My Hanbok', text: 'Match color, mood, palace backdrop, season and comfort to Hanbok looks.', href: '/hanbok', action: 'Find my Hanbok' },
  { n: '03', title: 'Gyeongbokgung Guide', text: 'Turn rental time into a realistic palace, photo, café and food route.', href: '/explore/gyeongbokgung', action: 'Explore the area' },
  { n: '04', title: 'Food Near Me', text: 'Route-aware Korean food and café recommendations built for visitors.', href: '/explore/gyeongbokgung', action: 'Find food' },
  { n: '05', title: 'K-Culture Lab', text: 'Discover Korean zodiac and Saju as traditional culture and entertainment.', href: '/culture', action: 'Open Culture Lab' },
  { n: '06', title: 'Credits', text: 'Top up once and use credits for premium AI reports, visuals and planning.', href: '/credits', action: 'View credit packs' },
] as const;

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="heroGrid">
          <div>
            <p className="eyebrow">Your personal Korea companion</p>
            <h1>Experience Korea in a way that <em>fits you.</em></h1>
          </div>
          <div>
            <p className="heroText">Personal colors, Hanbok styling, palace routes, local food and Korean culture — connected into one trip instead of six separate searches.</p>
            <div className="heroActions">
              <Link className="primaryButton" href="/color">Find my colors</Link>
              <Link className="secondaryButton" href="/explore/gyeongbokgung">Explore Gyeongbokgung</Link>
            </div>
            <div className="contextBox">Launching around Gyeongbokgung first. Free local discovery stays useful; credits unlock computation-heavy personalized features.</div>
          </div>
        </div>
      </section>

      <section className="section sectionDark">
        <div className="sectionHead">
          <h2>One profile, one Korea journey.</h2>
          <p>Each module feeds the next: your color result can shape your Hanbok, your Hanbok can shape your photo route, and your available time can shape food and nearby stops.</p>
        </div>
        <div className="moduleGrid">
          {modules.map((module) => (
            <Link className="moduleCard" href={module.href} key={module.n}>
              <small>{module.n}</small>
              <h3>{module.title}</h3>
              <p>{module.text}</p>
              <span>{module.action} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHead">
          <h2>Built for travelers, not profiles.</h2>
          <p>Photo analysis is limited to visible color guidance. Cultural readings use separately consented birth inputs. Sensitive identity traits are not inferred from a selfie.</p>
        </div>
        <div className="infoBand">
          <div><strong>Free discovery</strong><span>Destinations, basic place browsing and cultural explainers remain accessible without buying credits.</span></div>
          <div><strong>Credits for premium work</strong><span>AI-heavy reports, visual generation and premium planning show their cost before you confirm.</span></div>
          <div><strong>International payments</strong><span>Architecture targets overseas cards and PayPal through a Korea-compatible payment provider.</span></div>
        </div>
      </section>
    </main>
  );
}
