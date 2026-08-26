# Korea Concierge — Product Requirements Document

**Working title:** Korea Concierge  
**Production domain:** `https://korea.avocadoss.co.kr`  
**Product:** mobile-first responsive website / PWA-ready web app  
**Primary launch zone:** Gyeongbokgung · Gwanghwamun · Seochon · Bukchon · Anguk, Seoul  
**Primary audience:** international visitors to Korea  
**Document version:** 1.0  
**Date:** 2026-08-26

---

## 1. Product vision

Korea Concierge is a personalized Korea travel and culture website that helps an international visitor answer one continuous question:

> “What suits me, what should I wear, where should I go, what should I eat, and what Korean cultural experience should I try next?”

The product combines personal-color guidance, hanbok styling, nearby travel recommendations, restaurants/cafés, photo routes, Korean cultural content, and optional entertainment readings such as saju into a single personalized trip flow.

The first launch focuses deeply on the Gyeongbokgung palace district instead of superficially covering all of Korea. Once product-market fit is proven, the same recommendation architecture expands to Insadong, Myeongdong, Hongdae, Seongsu, Gangnam, Busan, Jeju, Gyeongju and other destinations.

The existing site at `korea.avocadoss.co.kr` is treated as replaceable. The new application should be built independently and switched onto the domain only after production QA, so there is a clean rollback path.

---

## 2. Product positioning

### 2.1 Core promise

**A personal Korea companion that turns your face, preferences, time, location and interests into an actionable Korea experience.**

### 2.2 Differentiation

Generic travel sites answer “what is popular?” Korea Concierge should answer “what is best for *this visitor right now*?”

The defensible loop is:

1. learn visitor preferences;
2. generate personalized style/travel recommendations;
3. observe saves, clicks, bookings and ratings;
4. improve recommendations;
5. connect high-intent visitors to local merchants and experiences.

### 2.3 Product principles

- Mobile first; usable while walking around Seoul.
- Visual first; color palettes, photos, maps and short reasons before long text.
- Multilingual by architecture, not by afterthought.
- Recommendations must state *why* they were selected.
- Current local facts must be distinguished from editorial/AI suggestions.
- Free browsing should remain useful; credits should unlock computation-heavy personalization rather than basic information.
- No race, ethnicity, nationality, religion, health or attractiveness inference from photos.
- User photos and birth data receive privacy-first handling and deletion controls.

---

## 3. Target users

### Persona A — First-time Seoul visitor
18–35, solo/couple/friends, uses Google/Instagram/TikTok/YouTube, limited Korean, wants attractive photos and low-friction plans.

Needs: hanbok choice, reliable shop, palace route, food nearby, navigation and clear pricing.

### Persona B — K-culture enthusiast
Already interested in hanbok, K-beauty, dramas and Korean history. Will pay for premium styling, themed photography and cultural readings.

Needs: distinctive looks, detailed matching, premium experiences, shareable results.

### Persona C — Family traveler
Needs size availability, shorter walking routes, stroller/child considerations, break spots and reliable meal options.

### Persona D — Comfort/modesty-first traveler
Prioritizes heat, sleeve length, skirt volume, walking comfort, privacy, coverage and practical fit.

### Persona E — Local merchant
Hanbok rental shop, photographer, restaurant, café, cultural experience provider.

Needs: international discovery, qualified leads/bookings, inventory/service presentation, analytics and promotions.

---

## 4. Primary user journeys

### Journey 1 — Find my personal color
1. Landing page → **Find my colors**.
2. User takes/uploads selfie.
3. Consent explains photo use and retention.
4. Browser-side or approved vision pipeline estimates visible color characteristics under current lighting.
5. Result shows:
   - warm / neutral / cool tendency;
   - visible depth: light / medium / deep;
   - contrast: soft / medium / high;
   - confidence and lighting warning;
   - recommended near-face colors;
   - accent colors;
   - colors worth testing rather than absolute “avoid” claims.
6. User can manually correct result.
7. Free preview is shown; detailed palette can consume credits.
8. Result feeds the Hanbok recommendation engine.

### Journey 2 — Find my Hanbok
1. Start from color result or skip directly to style quiz.
2. Select destination, season/weather, photo mood and comfort preferences.
3. Optional profile inputs: approximate height range, preferred silhouette, coverage, footwear comfort, party type.
4. System returns ranked hanbok looks.
5. Each look includes:
   - jeogori / chima or baji palette;
   - silhouette/design family;
   - accessory suggestions;
   - why it matches;
   - destination/photo backdrop fit;
   - matching rental shops.
6. Premium options: AI composite/virtual styling preview and additional variations.

### Journey 3 — Find a Hanbok rental shop
1. User selects desired look.
2. Shops are ranked by style match, distance, opening state, language support, price, reviews, photo service and verified inventory signals.
3. Merchant card shows only verified claims where possible.
4. User opens directions, website, call/message or booking/referral.
5. Click/referral is tracked with merchant attribution.

### Journey 4 — I am wearing Hanbok now
1. Choose current location or palace gate.
2. Choose remaining rental time: 1h / 2h / 4h / half day.
3. Choose interests: photography, history, quiet streets, café, meal, shopping.
4. Route engine produces an itinerary that returns the visitor before rental deadline.
5. Individual stops can be regenerated without destroying the rest of the plan.

### Journey 5 — What should I eat nearby?
1. Choose cuisine mood, budget, walking tolerance and dietary preferences.
2. Show ranked restaurants near the current route.
3. Explain why each place fits: distance, route position, cuisine, price, opening hours, language/menu accessibility and verified dietary notes.
4. Add a restaurant to itinerary.

### Journey 6 — Build my palace district day
1. Enter available time, start location, party type, budget and interests.
2. Optional Hanbok rental block.
3. Generate 2–6 hour itinerary.
4. Save/share via URL.
5. Re-plan one block at a time.

### Journey 7 — K-Culture Lab: Saju / Zodiac
1. User chooses a cultural reading.
2. Explain clearly that this is cultural/entertainment content, not professional advice or deterministic prediction.
3. User explicitly consents before entering birth data.
4. Inputs can include birth date, optional birth time and birth city/timezone.
5. Output may include:
   - Four Pillars / Saju introduction;
   - five-element balance explanation;
   - Korean zodiac animal;
   - Western zodiac as an optional comparison;
   - traditional lucky-color storytelling that can connect to Hanbok palettes.
6. Never use readings for medical, legal, financial, employment or other high-impact decisions.
7. User can delete stored birth profile at any time.

---

## 5. Functional scope

### P0 — Launch MVP

#### 5.1 Web foundation
- Responsive web app at `korea.avocadoss.co.kr`.
- SEO-indexable landing and destination pages.
- PWA-ready manifest and installability later.
- English first.
- Localization framework with Korean and future Japanese, Simplified/Traditional Chinese, Vietnamese, Thai, Indonesian, Spanish and French.
- Anonymous browsing allowed.

#### 5.2 Authentication
- Email magic link / social login architecture.
- Guest session can run free browsing.
- Account required for purchased credits, saved results and itinerary sync.
- Account data export/deletion path.

#### 5.3 Credit wallet
Every user account has a server-authoritative credit balance.

Required concepts:
- `credit_wallets`: current derived balance/cache;
- `credit_ledger`: immutable credit transactions;
- `credit_products`: purchasable packs;
- `feature_prices`: versioned per-feature credit price;
- `payment_orders`: external payment lifecycle;
- `usage_events`: feature execution lifecycle.

Rules:
- Never trust a balance sent from the client.
- Credits are granted only after verified payment webhook/confirmation.
- Feature deduction and usage creation must be atomic/idempotent.
- Failed AI jobs automatically release/refund reserved credits.
- Promotional credits are tracked separately from purchased credits.
- User sees credit cost *before* confirming a paid action.
- Basic travel browsing, shop pages and restaurant discovery remain free.

#### 5.4 Suggested initial credit economy
Values are product hypotheses and must be configurable without deploy.

Credit packs:
- Starter: 100 credits — target price USD 4.99 equivalent
- Explorer: 250 credits — target price USD 9.99 equivalent
- Traveler: 600 credits — target price USD 19.99 equivalent

Feature pricing hypothesis:
- Basic color scan: 0 credits for first activation scan, then 5
- Detailed personal-color report: 12
- Hanbok recommendation: 8
- Premium Hanbok variations: 6
- Visual/AI Hanbok preview: 25–40 depending on generation cost
- AI itinerary: 8
- Partial itinerary re-plan: 2
- Saju cultural reading: 15
- Extended Saju narrative: +10
- Zodiac / Korean zodiac quick result: free or 1–2

Final prices must be based on measured model/API cost, conversion and refund rate.

#### 5.5 Payments
Primary launch approach for a Korean merchant:
- Toss Payments international card payment.
- PayPal through supported international/foreign-payment setup.
- Multilingual hosted/payment-widget flow where practical.
- KRW default plus contracted foreign currency MID(s) when business economics justify it.

Payment system requirements:
- Payment provider abstraction; no credit logic embedded directly in one provider SDK.
- Server creates order with authoritative product/price.
- Browser cannot choose arbitrary credit amount or price.
- Webhook/confirm endpoint verifies amount, currency, order and provider status.
- Idempotency key on all payment-mutating calls.
- Only successful verified payments mint purchased credits.
- Refund handler debits/refunds corresponding purchased credits using auditable ledger entries.
- Chargeback/dispute path freezes equivalent unsettled promotional benefit where legally appropriate; never silently create negative balance without explicit policy.
- Receipts and transaction history page.

#### 5.6 Personal-color engine v1
- Photo upload/camera.
- In-browser preview.
- Lighting quality warnings.
- Visible tone estimate only; no ethnicity/race recognition.
- Manual correction.
- Result explanation.
- Palette mapping into Hanbok recommendations.

#### 5.7 Hanbok recommendation v1
Inputs:
- color result;
- desired mood;
- destination;
- season/weather band;
- comfort/coverage preferences;
- party type.

Outputs:
- top 3 ranked palettes;
- design/silhouette family;
- accessories;
- reason codes;
- save/share action.

#### 5.8 Gyeongbokgung local guide v1
- Gyeongbokgung core page.
- Nearby district pages: Seochon, Bukchon, Anguk, Gwanghwamun.
- Structured places model.
- Restaurants/cafés/photo spots/cultural sites.
- Walking-distance-aware recommendations.
- “Open now” only when fresh hours data is available.
- Map deep links initially; embedded map later.

#### 5.9 Itinerary builder v1
- 1h / 2h / 4h / 6h route templates.
- Time budget and walking tolerance.
- Hanbok return-time constraint.
- Reorder and replace stops.
- Save/share itinerary.

#### 5.10 K-Culture Lab v1
- Korean zodiac.
- Western zodiac comparison.
- Introductory Saju experience with explicit entertainment/cultural framing.
- Birth data minimization and deletion controls.

---

## 6. P1 — Post-MVP

- AI Hanbok visual try-on/composite.
- Merchant inventory feed and “has this color/style” signal.
- Booking/reservation handoff.
- Photographer matching.
- Live weather-aware styling.
- Crowd/closure-aware itinerary changes where reliable data exists.
- Google/Apple social login.
- Saved traveler profile across Korea.
- In-product translation phrases for shops/restaurants.
- Accessibility and mobility filters.
- Family/child sizing filters.
- Dietary preference filters with verified-data warnings.
- Merchant portal.
- Referral commission reporting.
- Review collection tied to verified referral/booking events.

---

## 7. P2 — Expansion

- Nationwide destination graph.
- Seoul neighborhoods beyond palace district.
- Busan / Jeju / Gyeongju.
- K-beauty shade/style recommendations.
- Cultural class matching: tea, craft, cooking, temple/calligraphy experiences.
- Multi-day itinerary engine.
- Personalized “Korea profile” combining style, food, pace and interests.
- Native-app wrapper only if web retention and device-feature needs justify it.

---

## 8. Information architecture

Top navigation:
- Home
- My Color
- Hanbok
- Explore
- Food
- Trip Planner
- K-Culture Lab
- Credits
- Saved

Mobile primary nav should expose no more than five high-frequency actions. Secondary features move into More/Profile.

Primary URLs:
- `/`
- `/color`
- `/hanbok`
- `/hanbok/results/[id]`
- `/explore/gyeongbokgung`
- `/explore/seochon`
- `/explore/bukchon`
- `/food`
- `/planner`
- `/culture`
- `/culture/saju`
- `/culture/zodiac`
- `/credits`
- `/account`
- `/saved`

SEO editorial/guide URLs may use `/guide/...` and must remain separated from transactional personalized flows.

---

## 9. Recommendation architecture

Recommendations should start deterministic and explainable before adding more expensive LLM/vision layers.

### 9.1 Personal-color score
Candidate palette score can include:
- undertone compatibility;
- visible depth/contrast;
- color proximity to face;
- destination backdrop contrast;
- user mood preference;
- season/weather suitability.

### 9.2 Hanbok score
- palette fit 30%
- requested mood 20%
- comfort/coverage 15%
- destination/photo fit 15%
- shop availability 10%
- distance/time 5%
- price preference 5%

Weights are configuration, not hard-coded product truth.

### 9.3 Local place score
- route fit/time cost;
- travel distance;
- current availability/hours confidence;
- user interests;
- price preference;
- language accessibility;
- quality/review confidence;
- merchant sponsorship only as a separately labeled boost, never hidden organic ranking manipulation.

---

## 10. Data model — high level

Core entities:
- users
- traveler_profiles
- photo_analysis_sessions
- color_profiles
- hanbok_looks
- hanbok_recommendations
- merchants
- merchant_locations
- merchant_services
- places
- place_categories
- place_hours_snapshots
- itineraries
- itinerary_stops
- saved_items
- credit_wallets
- credit_ledger
- credit_products
- feature_prices
- usage_events
- payment_orders
- payment_events
- culture_profiles
- saju_readings
- consent_events
- referral_events

Sensitive/birth/photo-related tables should have shorter retention, explicit purpose fields and stricter access policies.

---

## 11. Credit transaction model

Ledger transaction types:
- `purchase_grant`
- `promo_grant`
- `usage_reserve`
- `usage_capture`
- `usage_release`
- `refund_debit`
- `admin_adjustment`

Paid AI flow:
1. Client requests feature quote.
2. Server returns current feature price and quote expiry.
3. User confirms.
4. Server atomically reserves credits and creates usage event.
5. Feature executes.
6. Success → reserve becomes capture.
7. Failure/timeout → reserve is released.
8. Client refreshes wallet from server.

All writes use an idempotency key. A retry must never double-charge credits.

---

## 12. Payments — implementation policy

### Preferred initial provider
Toss Payments international payments because the production merchant is expected to operate from Korea and the product is designed for overseas-issued cards and PayPal users.

### Payment methods target
- Visa
- Mastercard
- JCB
- American Express where contracted/supported
- other supported international cards where available
- PayPal

### Currency strategy
Phase 1: show a simple visitor-facing display currency, but charge through a contracted provider/MID currency. Do not fake local currency billing.

Candidate setup:
- KRW MID for international cards in KRW;
- optional USD foreign-payment MID for international cards + PayPal after contract review.

### Provider abstraction
Internal interface:
- `createCheckout(order)`
- `confirmPayment(providerPayload)`
- `handleWebhook(event)`
- `refundPayment(paymentId, amount)`
- `getPayment(paymentId)`

This allows future PayPal-direct, Stripe (if merchant eligibility changes), Paddle or another MoR/PSP without rewriting the wallet.

---

## 13. Saju / astrology policy

Saju is presented as Korean traditional culture and entertainment.

Required UI copy concepts:
- “For cultural and entertainment purposes.”
- “Traditional interpretations vary.”
- “Do not use this reading as medical, legal, financial or other professional advice.”

Data rules:
- birth time is optional;
- approximate/unknown-time mode supported;
- birth city is used only when needed for time/timezone calculations;
- no public profile exposure by default;
- delete reading/profile action;
- do not sell birth data;
- do not use sensitive inferences to target ads.

The system may connect cultural lucky-color storytelling to a Hanbok recommendation, but must label that connection as traditional/entertainment context rather than scientific personal-color analysis.

---

## 14. Privacy and safety requirements

### Photos
- MVP should prefer browser-side analysis.
- No face identification.
- No face database.
- No race/ethnicity/nationality inference.
- If an image is sent server-side for an optional premium visual feature, obtain explicit consent and define retention/deletion.

### Location
- Ask only when needed.
- User can enter a location manually.
- Precise location should not be retained longer than necessary for the active trip unless user intentionally saves the itinerary.

### Birth data
- Separate consent.
- Purpose-limited storage.
- Deletion/export capability.

### Payments
- Never store raw card numbers.
- Use provider-hosted/widget tokenized payment flows.
- Verify payment server-side.

---

## 15. Technology architecture

Recommended stack:
- Next.js App Router + TypeScript
- React
- server-rendered/SEO destination content
- PostgreSQL via Supabase or equivalent managed Postgres
- Supabase Auth or equivalent auth provider
- object storage only for explicitly consented uploaded/generated media
- Toss Payments server integration behind provider abstraction
- map/place provider abstraction
- analytics with privacy-conscious event taxonomy
- deployment target compatible with `korea.avocadoss.co.kr`

Do not couple product logic to deployment vendor.

### Backend boundaries
Server-only operations:
- credit balance mutation;
- payment order creation/verification;
- webhook handling;
- premium AI calls;
- merchant admin writes;
- protected user history.

Client-safe operations:
- basic deterministic palette scoring;
- image preview;
- lightweight browser-only color prototype;
- public place filtering.

---

## 16. Analytics and KPI framework

Activation funnel:
1. landing visitor
2. starts first personalized flow
3. completes free result
4. saves/shares result
5. views paid feature
6. purchases credits
7. consumes first paid feature
8. clicks merchant / builds itinerary

North-star candidate:
**Personalized Trip Actions per Activated Visitor**

Supporting KPIs:
- color flow completion rate
- Hanbok result save rate
- credit purchase conversion
- first-paid-feature conversion
- repeat paid usage
- cost per paid feature execution
- gross margin per credit pack
- payment failure rate
- refund/chargeback rate
- itinerary completion/save/share
- merchant outbound click/referral rate
- D1/D7 return rate for travelers still in Korea

Guardrails:
- recommendation complaint rate
- incorrect-hours/place report rate
- AI failure/refund rate
- privacy deletion completion
- support tickets per 100 purchases

---

## 17. SEO strategy

Free destination and guide pages drive acquisition; paid tools convert high-intent visitors.

Initial SEO clusters:
- Gyeongbokgung Hanbok rental guide
- best Hanbok colors for palace photos
- Gyeongbokgung photo spots
- Gyeongbokgung restaurants
- Bukchon + Hanbok route
- Seochon cafés after Gyeongbokgung
- how Hanbok rental works
- palace entry and Hanbok visitor guide
- Korean personal color experience
- Korean Saju cultural guide

Programmatic SEO must not generate thin or unverified location pages.

---

## 18. Merchant monetization

Phase 1:
- outbound referral tracking only.

Phase 2:
- booking commission or CPA.
- merchant claim/profile management.
- verified services and inventory tags.

Sponsored listings:
- always visibly labeled;
- never override critical fit, safety, closure or distance constraints;
- organic recommendation score remains available separately.

---

## 19. Non-goals for MVP

- Native iOS/Android apps.
- Perfect professional-grade personal-color diagnosis.
- Photorealistic live AR Hanbok try-on.
- Full Korea destination coverage.
- Real-time reservation availability for every merchant.
- Predictive “fate” claims from Saju.
- Social network/feed.
- User-to-user messaging.

---

## 20. Release phases

### Phase 0 — Foundation
- PRD / architecture
- new codebase
- design system
- localization architecture
- analytics event taxonomy
- domain/deployment plan

### Phase 1 — Free acquisition MVP
- homepage
- Gyeongbokgung explore hub
- personal-color prototype
- Hanbok recommendation v1
- curated nearby places
- responsive/mobile QA

### Phase 2 — Accounts + credits
- auth
- wallet/ledger
- credit product page
- feature quote/charge flow
- transaction history

### Phase 3 — Payment production
- Toss test payment
- international card configuration
- PayPal/foreign payment configuration
- webhook verification
- refund flow
- payment QA

### Phase 4 — Premium AI
- detailed color report
- premium Hanbok generation/preview
- itinerary AI
- paid Saju reading
- automatic credit release on failures

### Phase 5 — Local commerce
- merchant dataset
- inventory/services
- referrals
- bookings where partnerships permit

### Phase 6 — Expansion
- additional Seoul areas
- additional languages
- Busan/Jeju/Gyeongju

---

## 21. Definition of done for launch

Launch is blocked until:
- all core mobile flows work at 360px width and common modern phones;
- desktop layout has no stretched/mobile-only artifacts;
- checkout cannot mint credits without verified provider success;
- retrying a payment/usage request cannot double-credit or double-charge;
- failed paid AI usage restores reserved credits;
- user can see credit price before usage;
- user can see transaction history;
- photo and birth-data consent screens are present;
- account deletion/data deletion paths exist;
- Gyeongbokgung place facts are source-traceable and current enough for launch;
- accessibility basics pass keyboard/focus/contrast checks;
- English copy is natural for international travelers;
- no feature infers race/ethnicity/nationality from a photo;
- production domain has HTTPS, monitoring and rollback procedure;
- payment sandbox + production checklist is completed.

---

## 22. Immediate implementation order

1. Create clean Next.js project under this repository folder.
2. Build mobile-first homepage and navigation around the seven product pillars.
3. Implement `/color` browser-only prototype.
4. Implement deterministic `/hanbok` recommendation engine.
5. Build `/explore/gyeongbokgung` with structured seed data.
6. Add `/culture` and safe Saju/Zodiac onboarding shell.
7. Design database schema for users, credits, payments and usage.
8. Implement authentication.
9. Implement credit ledger before integrating payment provider.
10. Add Toss Payments test-mode checkout and server verification.
11. Add paid feature execution/reservation/refund semantics.
12. Replace the current production site only after staging QA.
