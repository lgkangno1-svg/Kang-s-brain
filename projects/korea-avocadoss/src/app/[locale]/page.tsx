import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';

import {Link} from '@/i18n/navigation';
import {localizedAlternates} from '@/lib/seo/localized-metadata';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  setRequestLocale(locale);
  const meta = await getTranslations('Meta');

  return {
    title: meta('homeTitle'),
    description: meta('homeDescription'),
    alternates: localizedAlternates(locale, ''),
  };
}

const features = [
  ['🗺️', 'Travel Planning', 'Custom itineraries for your perfect trip', '/explore/gyeongbokgung'],
  ['🍴', 'Food & Dining', 'Find the best food for your diet', '/culture'],
  ['🏯', 'Culture & Experience', 'Traditional to modern Korean culture', '/hanbok'],
  ['☯️', 'Saju & Fortune', 'Discover your unique life path', '/culture'],
  ['💬', 'Quick Help', 'Get answers to travel questions', '/'],
] as const;

const restaurants = [
  ['one', 'Vegan · Gluten Free', 'Plant Seoul', 'Vegan · Modern Korean', '★ 4.8 · 1.2k', 'Seoul · 1.2 km'],
  ['two', 'Halal Certified', 'Istanbul Grill', 'Halal · Korean BBQ', '★ 4.6 · 656', 'Seoul · 2.8 km'],
  ['three', 'Pork Free · Alcohol Free', 'Green Table', 'Korean · Healthy Food', '★ 4.7 · 932', 'Busan · 1.5 km'],
  ['four', 'Vegetarian · Gluten Free', 'Mango House', 'Dessert · Cafe', '★ 4.5 · 642', 'Jeju · 0.9 km'],
] as const;

export default async function LocalizedHome({params}: PageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main className="kcDashboard">
      <section className="kcHero">
        <div className="kcHeroCopy">
          <p className="kcHeroEyebrow">KOREA CONCIERGE</p>
          <h1>Your Smart Guide<br />to Korea</h1>
          <p className="kcHeroLead">Personalized travel, cultural experiences,<br />food recommendations and more — all in one place.</p>

          <form className="kcSearch" action={`/${locale}/explore/gyeongbokgung`}>
            <span className="kcSearchIcon" aria-hidden="true">⌕</span>
            <input aria-label="Explore Korea" name="q" placeholder="What would you like to explore in Korea?" />
            <button type="submit" aria-label="Search">→</button>
          </form>

          <div className="kcChips">
            <span className="kcPopular">Popular</span>
            <Link className="kcChip" href="/explore/gyeongbokgung">Best places to visit</Link>
            <Link className="kcChip" href="/culture">Local food</Link>
            <Link className="kcChip" href="/culture">Saju reading</Link>
            <Link className="kcChip" href="/hanbok">Hanbok experience</Link>
          </div>
        </div>

        <div className="kcHeroSlogan">More<br />than a trip,<br />It&apos;s a story ♡</div>

        <Link className="kcAssistant" href="/">
          <span className="kcMascot" aria-hidden="true">🥑</span>
          <span>
            <b>Hello!</b>
            <p>I&apos;m your Korea Concierge.<br />How can I help you today?</p>
          </span>
          <span className="kcAssistantArrow">→</span>
        </Link>
      </section>

      <section className="kcFeatureGrid" aria-label="Korea Concierge features">
        {features.map(([icon, title, description, href]) => (
          <Link className="kcFeatureCard" href={href} key={title}>
            <span className="kcFeatureIcon" aria-hidden="true">{icon}</span>
            <h3>{title}</h3>
            <p>{description}</p>
          </Link>
        ))}
      </section>

      <section className="kcInfoRow">
        <article className="kcSajuCard">
          <div className="kcSajuPhoto" aria-hidden="true" />
          <div className="kcSajuBody">
            <h2>What is Saju?</h2>
            <p className="kcSubtitle">Korean Four Pillars of Destiny</p>
            <p>Saju (사주) is a traditional Korean fortune-telling system based on your birth date and time. It&apos;s used to understand your personality, life path, and future possibilities.</p>
            <Link className="kcTextLink" href="/culture">Learn more&nbsp;&nbsp;→</Link>
          </div>
          <aside className="kcQuickGuide">
            <h3>Quick Guide</h3>
            <ul>
              <li>ⓘ What information do I need?</li>
              <li>ⓘ What can I learn from Saju?</li>
              <li>ⓘ What if I don&apos;t know my birth time?</li>
              <li>ⓘ Differences from Western Astrology</li>
            </ul>
            <Link className="kcGuideButton" href="/culture">View detailed guide&nbsp;&nbsp;→</Link>
          </aside>
        </article>

        <article className="kcZodiacCard">
          <div className="kcZodiacArt" aria-hidden="true">☯︎</div>
          <h3>Zodiac &amp; Korean Zodiac</h3>
          <p>Korea has its own zodiac system (12 animal signs) and uses a different calendar than Western astrology.</p>
          <Link className="kcTextLink" href="/culture">Learn more&nbsp;&nbsp;→</Link>
        </article>
      </section>

      <section className="kcFoodSection">
        <div className="kcSectionTitleRow">
          <div className="kcSectionTitle">
            <span className="kcFeatureIcon" aria-hidden="true">🍴</span>
            <div>
              <h2>Food &amp; Dining</h2>
              <p>Explore Korea&apos;s amazing food scene — with filters for your lifestyle and dietary needs.</p>
            </div>
          </div>
          <Link className="kcTextLink" href="/culture">View all restaurants&nbsp;&nbsp;→</Link>
        </div>

        <div className="kcFoodLayout">
          <form className="kcFilterPanel">
            <h3>Dietary Preferences</h3>
            <div className="kcFilterGrid">
              {['Vegan','Pork Free','Vegetarian','Alcohol Free','Halal','Seafood Free','Halal Certified','Gluten Free','Muslim Friendly','Allergy Friendly'].map((label) => (
                <label className="kcFilter" key={label}><input type="checkbox" /> {label}</label>
              ))}
            </div>
            <div className="kcFilterActions">
              <button className="kcApply" type="button">Apply Filters</button>
              <button className="kcReset" type="reset">Reset</button>
            </div>
          </form>

          <div className="kcRestaurantGrid">
            {restaurants.map(([photoClass, badge, name, category, rating, distance]) => (
              <article className="kcRestaurantCard" key={name}>
                <div className={`kcFoodPhoto ${photoClass}`}><span className="kcFoodBadge">{badge}</span></div>
                <div className="kcRestaurantBody">
                  <b>{name}</b>
                  <span>{category}</span>
                  <span className="kcRating">{rating}</span>
                  <span>{distance}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kcPlanBanner">
        <div>
          <h2>Plan Your Perfect Trip</h2>
          <p>Let our AI create a personalized itinerary just for you.</p>
        </div>
        <Link className="kcPlanButton" href="/explore/gyeongbokgung">Start Planning&nbsp;&nbsp;→</Link>
      </section>
    </main>
  );
}
