# Korea Concierge — Technical Architecture v0.1

## Goals

1. SEO-friendly destination content and fast mobile interactions.
2. Server-authoritative credits and payment state.
3. Provider abstraction for international payments.
4. Privacy-first handling of selfies, location and birth data.
5. Cheap deterministic recommendation logic first; paid AI only where it materially improves the experience.

## Stack

- Next.js 16.3.3+ App Router
- TypeScript
- React
- Managed PostgreSQL (planned: Supabase)
- Authentication (planned: Supabase Auth or equivalent)
- Toss Payments international card + foreign payment/PayPal as primary Korean-merchant payment path
- Server route handlers for payment/credit/AI mutations

## Domain architecture

Production: `korea.avocadoss.co.kr`

Deployment must support a staging URL first. Production DNS is switched only after mobile, payment, privacy and rollback QA.

## Application layers

### Public content
SEO-rendered guides, place pages, basic restaurant/attraction browsing and free cultural explainers.

### Personalization
Color profile, Hanbok quiz, route preferences, saves and itinerary state.

### Paid execution
Detailed AI reports, premium Hanbok visual generation, AI itinerary generation and paid Saju narratives.

### Commerce
Credit products, orders, payment events, refunds, usage reservations and merchant referrals.

## Credit architecture

Never mutate a balance directly from browser requests.

Authoritative ledger flow:

1. Client requests a feature quote.
2. Server returns a versioned quote with credit price and expiry.
3. Client confirms quote.
4. Server transaction creates `usage_event` and `usage_reserve` ledger row atomically.
5. Worker/server executes feature.
6. Success creates `usage_capture`.
7. Failure/timeout creates `usage_release`.
8. Wallet balance is derived/refreshed from ledger.

Every mutation has an idempotency key.

### Planned tables

- `profiles`
- `traveler_profiles`
- `credit_products`
- `feature_prices`
- `credit_wallets`
- `credit_ledger`
- `payment_orders`
- `payment_events`
- `usage_events`
- `color_profiles`
- `hanbok_recommendations`
- `places`
- `itineraries`
- `itinerary_stops`
- `culture_profiles`
- `saju_readings`
- `consent_events`

RLS is required on user-owned exposed tables. Service credentials never ship to the browser.

## Payment provider boundary

```ts
interface PaymentProvider {
  createCheckout(order: CheckoutOrder): Promise<CheckoutSession>;
  confirmPayment(input: ConfirmPaymentInput): Promise<ConfirmedPayment>;
  handleWebhook(input: unknown): Promise<PaymentEvent>;
  refundPayment(input: RefundInput): Promise<RefundResult>;
}
```

Initial adapter: `TossInternationalPaymentProvider`.

The credit system must never know Toss-specific response shapes. That keeps PayPal-direct, another Korean PG, Stripe (if merchant eligibility changes), or a Merchant-of-Record adapter replaceable later.

## Payment invariants

- Product price and credit quantity come from the server database.
- Successful provider verification is required before minting credits.
- Amount, currency, order ID and user ID are cross-checked.
- Payment and webhook retries cannot mint twice.
- Refunds create ledger entries; historical rows are never rewritten.
- Raw card data never touches application servers.

## Photo privacy

Phase 1 color scan stays in-browser when possible. The system may estimate only visible color characteristics needed for recommendations. It must not infer race, ethnicity, nationality, religion, health or attractiveness.

Premium image-generation features that require upload must have explicit consent, purpose and retention policy.

## Saju privacy

Birth date/time/city are separate-purpose data. Store the minimum required fields, encrypt/protect access, record consent, support unknown birth-time mode and deletion. Results are cultural/entertainment content, not professional or deterministic advice.

## Recommendation engines

### Color v1
Deterministic score based on visible undertone tendency, depth, contrast and user corrections.

### Hanbok v1
Weighted rules from color profile + mood + destination + season + comfort.

### Local guide v1
Curated structured place data with route distance, category, price band, time fit and source freshness.

### AI layer
LLMs/vision are introduced for natural-language explanation, itinerary composition and premium generation after deterministic inputs are established. AI output never directly writes payment/credit balances.

## Route structure

- `/color`
- `/hanbok`
- `/explore/[area]`
- `/food`
- `/planner`
- `/culture`
- `/culture/saju`
- `/culture/zodiac`
- `/credits`
- `/account`
- `/saved`

## Next engineering milestones

1. Production design system and responsive shell.
2. Browser-only color prototype.
3. Deterministic Hanbok recommender.
4. Structured Gyeongbokgung seed dataset.
5. Supabase schema + RLS.
6. Credit ledger service + tests.
7. Toss Payments sandbox adapter.
8. Payment webhook + idempotent credit grant.
9. Paid feature reservation/capture/release.
10. Staging deployment and domain cutover checklist.
