# SEO / AEO / GEO Operating Standard

Target: `https://korea.avocadoss.co.kr`

This document makes search visibility and AI answer visibility first-class product requirements for Korea Concierge. It applies to every public page, feature launch, locale, content template, and major redesign.

## 1. Objectives

1. Win high-intent searches from foreign visitors planning Korea trips, especially around Gyeongbokgung, Hanbok, personal color, nearby food/cafes, Korean culture, zodiac, and Saju.
2. Make public content easy for Google, Bing/Copilot, ChatGPT Search, and other answer engines to crawl, understand, quote, and cite.
3. Convert organic and AI-referred visitors into useful product actions: color analysis, Hanbok matching, itinerary creation, cultural experiences, credit purchase, and partner bookings.
4. Avoid thin programmatic SEO, fake expertise, structured-data spam, doorway pages, and content generated only to capture keywords.

## 2. Site architecture

Use stable, readable, locale-aware URLs. English is the default acquisition language until analytics justify broader prioritization.

Recommended structure:

- `/en/`
- `/en/personal-color-korea/`
- `/en/hanbok/`
- `/en/hanbok/gyeongbokgung/`
- `/en/gyeongbokgung/`
- `/en/gyeongbokgung/hanbok-rental/`
- `/en/gyeongbokgung/restaurants/`
- `/en/gyeongbokgung/cafes/`
- `/en/gyeongbokgung/photo-spots/`
- `/en/gyeongbokgung/itinerary/`
- `/en/k-culture/saju/`
- `/en/k-culture/korean-zodiac/`
- `/en/k-culture/astrology/`

Add additional locale trees only when the translation is complete and useful. Initial candidates: Japanese, Simplified Chinese, Traditional Chinese, Vietnamese, Thai, Spanish, and French. Prioritize using Search Console/Bing/analytics demand rather than assumptions.

Every translated page must be a true localized page, not a machine-translated shell around English UI. Implement reciprocal `hreflang` relationships and `x-default` consistently.

## 3. Technical SEO gate

Every release touching public routes must check:

- indexable public page returns 200 and useful rendered HTML
- correct canonical URL
- correct language metadata
- correct `hreflang` / `x-default` where localized variants exist
- unique title and description aligned with search intent
- one clear H1 and semantic heading hierarchy
- crawlable internal links; important discovery must not depend only on client-side state
- XML sitemap contains canonical public URLs only
- truthful `lastmod` where content freshness matters
- robots.txt permits intended search/answer crawlers
- private, account, checkout, wallet, generated personal results, admin, callback, and sensitive routes are `noindex` as appropriate
- no accidental staging indexing
- mobile usability
- Core Web Vitals and image optimization
- alt text that describes meaningful images instead of keyword stuffing
- no orphan pages
- no duplicate/thin location pages
- 404/410/redirect behavior is intentional

## 4. AI crawler policy

Public informational and acquisition pages should remain crawlable by legitimate search and answer-engine crawlers unless privacy, licensing, or security requires otherwise.

At minimum verify that `OAI-SearchBot` is not accidentally blocked on public indexable pages. Training crawler policy is a separate product/legal decision and must not be conflated with search visibility.

Cloudflare/WAF/bot mitigation must be tested so legitimate crawlers do not receive CAPTCHA or false 403 responses.

## 5. Structured data

Use JSON-LD and only describe content visibly represented on the page.

Supported patterns to consider:

- `Organization` for Korea Concierge identity
- `WebSite` for the site entity where appropriate
- `BreadcrumbList` for hierarchical public content
- `LocalBusiness` / `Restaurant` only when a page truly represents a specific real business and data is verified
- `SoftwareApplication` only when eligibility and visible page content match
- `Product` / merchant-related markup only for genuine purchasable offerings when applicable
- `QAPage` only for pages centered on one real question and its answer(s)

Do not mass-apply FAQ/Q&A markup. Do not mark up content that is hidden, invented, unverified, or inconsistent with the page.

Validate structured data during QA and after major template changes.

## 6. AEO / GEO content pattern

Public guides should be written so a traveler and an answer engine can understand the answer without reconstructing it from marketing copy.

Preferred page anatomy:

1. Direct answer / recommendation summary near the top.
2. Key facts with dates, prices, opening-hour caveats, location, and source freshness where relevant.
3. Practical decision criteria: who this is for, who should skip it, time required, expected cost, transport/walking implications.
4. Clear entity names in Korean and English where useful.
5. Evidence/source notes for factual or volatile claims.
6. Concise comparison table when there are meaningful alternatives.
7. Contextual internal links to the next likely traveler task.
8. Updated date only when the content was materially reviewed.

Content should answer natural-language queries such as:

- What Hanbok color suits my skin tone?
- Where should I rent Hanbok near Gyeongbokgung?
- Is Hanbok rental worth it at Gyeongbokgung?
- What should I eat near Gyeongbokgung after wearing Hanbok?
- What is the best 3-hour Gyeongbokgung itinerary?
- What is Korean personal color analysis?
- What is Saju and how is it different from Western astrology?

Create a dedicated page only when the question deserves a useful standalone answer. Do not generate pages merely because a keyword permutation exists.

## 7. Local discovery / travel GEO

For destination and restaurant content:

- maintain canonical place entities with Korean name, English name, category, verified address/location, neighborhood, nearest useful transit, and source timestamp
- separate factual data from editorial recommendation score
- preserve source provenance and last-verified time for volatile information
- avoid claiming real-time opening or availability without real-time evidence
- explain walking sequence and itinerary logic, not merely list places
- build topic clusters around coherent visitor journeys

Core first cluster:

`Personal Color -> Hanbok Match -> Rental Choice -> Gyeongbokgung Route -> Photo Spots -> Meal/Cafe -> Next Nearby Attraction`

This journey should be visible both to humans and through crawlable internal links.

## 8. International search UX

Search intent differs by language and traveler origin. Localization must cover:

- wording and terminology travelers actually use
- currency presentation
- 12/24-hour conventions where relevant
- local transit explanation
- Korean address plus copy-friendly form
- Korean place name for showing taxi/staff when useful
- cultural context without assuming prior Korean knowledge
- dietary filters and food-allergy clarity
- reservation/payment expectations

Do not translate keywords literally when the destination language uses a different search concept.

## 9. Performance and rendering

SEO pages must remain useful without waiting for expensive AI calls.

- server-render or statically render stable public content when practical
- keep core facts and headings in indexable HTML
- load interactive AI tools progressively
- optimize hero/LCP imagery
- use responsive image sizing
- avoid shipping model/result payloads in initial page JS
- prevent cumulative layout shifts around images, maps, ads, and recommendation blocks

## 10. Analytics and attribution

Measure separately:

- Google organic referrals
- Bing organic referrals
- ChatGPT referrals (including `utm_source=chatgpt.com` when present)
- Copilot/Bing AI citations/referrals where observable
- other AI referral traffic
- landing page -> feature start
- feature start -> completion
- completion -> credit top-up
- top-up -> paid feature use
- partner outbound click / booking where applicable

Create dashboards later, but event names and source attribution should be designed before launch.

## 11. Bing / AI visibility

Use XML sitemaps and consider IndexNow for public pages whose freshness matters, such as place guides or newly published destination content. Once production is live, connect Bing Webmaster Tools and review AI Performance / citation data where available.

Use these signals to decide which pages to deepen, refresh, merge, or remove.

## 12. Editorial quality gate

Before publishing a public acquisition page, verify:

- does it solve a real traveler problem?
- is the main answer obvious in under 20 seconds?
- are factual claims current and sourceable?
- is there original product value, decision logic, comparison, or itinerary reasoning?
- would the page still deserve to exist if search engines sent no traffic?
- is it materially different from another page on the site?
- is there a natural next action inside Korea Concierge?

If not, merge, improve, or do not publish it.

## 13. Proactive improvement rule

The development loop is authorized to introduce unrequested improvements when evidence indicates they materially improve at least one of:

- foreign visitor usefulness
- conversion/revenue
- organic discovery
- AI citation/discovery
- accessibility
- trust/privacy/security
- performance/reliability
- AI inference cost
- maintainability

Before implementation, rank the change by user value, expected visibility/conversion impact, implementation complexity, recurring cost, privacy/security risk, and reversibility. Prefer high-value low-risk improvements. Avoid feature accumulation that weakens the core journey.

## 14. Launch readiness

Production switch to `korea.avocadoss.co.kr` is blocked until at least:

- production robots and sitemap reviewed
- staging pages excluded from indexing
- canonical/hreflang test passes
- structured data validates on representative pages
- no private result/account/payment URLs are indexable
- mobile performance and CWV risks reviewed
- titles/descriptions/H1/internal links audited
- OAI-SearchBot/public crawler access checked
- analytics attribution checked
- Search Console and Bing Webmaster setup plan ready
- primary English topic cluster contains genuinely useful content, not placeholders

## 15. Operating principle

SEO, AEO, and GEO are not separate content hacks. They are consequences of a site that is technically crawlable, semantically clear, factually reliable, entity-consistent, useful to travelers, and easy to navigate. Product utility remains the primary ranking and citation strategy.
