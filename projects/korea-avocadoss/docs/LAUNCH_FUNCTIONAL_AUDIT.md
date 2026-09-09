# Korea Concierge — Payment-grade functional audit

Last reviewed: 2026-09-10

This checklist treats **working end-to-end behavior** as the minimum bar. A page, card or mock interaction is not considered complete if the user's input does not materially change a result, failure cannot be recovered, or a paid result cannot be owned and re-opened safely.

## Status vocabulary

- **WORKING** — usable end-to-end in the current branch with automated contract coverage.
- **HARDENING** — works, but additional edge-case/data/UX coverage is required before broad launch.
- **INFRA BLOCKED** — repository-side contracts exist, but a dedicated external service/configuration must be created and tested.
- **PAYMENT BLOCKED** — real money must stay disabled.

## Customer-facing features

| Feature | Status | Current functional evidence | Remaining before payment-grade launch |
|---|---|---|---|
| Home / navigation | WORKING | Live Saju, Naming, Explore, Color and Hanbok routes are linked; paid banner is explicitly pre-launch. | Final responsive/browser QA and legal/footer destinations. |
| Personal Color | HARDENING | Browser-local JPEG/PNG/WebP validation, size/dimension/pixel caps, local Lab/skin-pixel analysis, lighting warnings, manual correction, Hanbok bridge, orientation-aware `createImageBitmap` decoding with a browser-local `<img>` fallback and explicit decoder resource cleanup. | Real-device/fixture coverage for rotated camera JPEGs and constrained-memory devices, plus explicit consent copy review. |
| Hanbok matcher | HARDENING | Color/mood/comfort/destination/season ranking plus Personal Color bridge. Curated 12-look licensed catalog is re-ranked and top six visual references shown with source/license. Rental-finder date/time handoff is sanitized in the Server Component so source-checked shop content remains present in server HTML instead of hiding behind a client `useSearchParams` bailout. | More locale-native catalog descriptions, verified rental inventory entity layer, broader visual regression tests. |
| Saju | HARDENING | Real DOB + IANA birthplace timezone, exact/rough/unknown birth time, deterministic pillars/elements/zodiac, no AI call, no silent Seoul default, localized uncertainty. | Expand KASI/manseryeok cross-validation and historical timezone/boundary fixtures; final cultural wording review. |
| Korean Naming Studio | WORKING | Deterministic catalog/ranking, multiple candidate results, optional surname, Hangul/romanization/Hanja examples, six-locale shell, zero API. | Editorial/native-speaker review of candidate meanings/romanization before high-traffic launch. |
| Gyeongbokgung planner | HARDENING | Dynamic visit date, start time, 1/2/4h budget, photo/history/relaxed focus, timed stop allocation, opening/closing warnings, food/Hanbok continuation. | Live official-hours refresh strategy, holiday closure exceptions, real walking-time calibration and map integration. |
| Nearby Explorer | HARDENING | 1–3h deterministic routes consume the selected visit date, omit source-verified fixed weekly closures, retain time-window warnings, and provide per-stop maps plus one zero-API full walking-route handoff preserving the selected stop order. | Expand fixed-closure coverage, holiday exception data and walking-time calibration. |
| Food & cafe finder | HARDENING | Source-checked official tourism records, category filters, hours/address/dietary notes, checked-at/source link. | Expand verified inventory, geospatial distance, localization of business descriptions, automated stale-data review. |
| Quick Help | WORKING | Deterministic decision tree, keyboard recovery, 0 credits, no fetch/LLM. | Keep answers synchronized with live feature routes and policy changes. |
| My Korea Look free preview | HARDENING | Full curated catalog ranking responds to style/garment/tone/priority/season; sample route remains accessible; `/style` search metadata has locale-native title/description for all six P0 locales while retaining localized canonical/hreflang alternates. | More locale-native catalog/result prose, saved-result/export QA, and the private paid-result persistence path. |
| Credits catalog | HARDENING | Economics/catalog and authorization contracts exist. | Do not sell credits until durable account ledger/refund/idempotency flow is deployed and E2E tested. |

## Payment and ownership

| Layer | Status | Current gate |
|---|---|---|
| Dedicated Korea database | INFRA BLOCKED | Existing connected Supabase project belongs to another service and must not be reused. `supabase/core-schema.sql` is ready for a dedicated project. |
| Authenticated ownership | INFRA BLOCKED | Schema/RLS contract exists; no production Korea auth project is deployed yet. |
| Orders | INFRA BLOCKED | Browser cannot mutate orders by contract; server-owned creation is not connected yet. |
| Paid deliverables | INFRA BLOCKED | Ownership table contract exists; private object storage/delivery is not connected yet. |
| Webhook idempotency | PAYMENT BLOCKED | Private provider-event ledger is designed, but runtime persistence is intentionally not implemented yet. |
| Fulfillment worker | PAYMENT BLOCKED | Job table contract exists; generation/retry/recovery path not deployed. |
| Checkout | PAYMENT BLOCKED | Requires checkout + ownership + fulfillment + webhook persistence env gates, plus a compile-time durable-persistence gate currently fixed to `false`. |
| Refund/recovery | PAYMENT BLOCKED | Must be tested against order/deliverable state transitions before money is accepted. |

## Non-negotiable launch gates

Real checkout may not open until all are true:

1. A **dedicated Korea Concierge** database/auth project exists.
2. RLS/advisors and cross-user isolation tests pass.
3. Checkout creates a server-owned order for an authenticated user before redirecting to the provider.
4. Verified payment events are stored idempotently before a 2xx acknowledgement.
5. A paid event enqueues fulfillment exactly once.
6. Fulfillment is retryable, observable, and produces a private user-owned result.
7. The result can be re-opened after browser/device restart.
8. Failure/refund/cancellation paths are tested.
9. Six-locale core flows pass functional and responsive QA.
10. Production checkout flags remain false until a reviewed code patch removes the compile-time durable-persistence block.

## Current engineering priority

1. Keep MiniPC exact-SHA build green for the current functional branch.
2. Complete remaining Personal Color real-device fixtures/consent review and Hanbok edge-case/device QA.
3. Continue Explore freshness/geospatial hardening after full-route map handoff, focusing on walking-time calibration and closure exceptions.
4. Continue My Korea Look locale-native result/export hardening, then build the private persistence interface required by the paid flow.
5. Create the dedicated Korea Supabase project only when account/database integration becomes the blocking step and the project cost/organization is explicitly approved.
6. Implement auth/order/webhook/fulfillment against that dedicated project.
7. Run Stripe **test-mode** E2E including retries/duplicate events/refunds.
8. Only then consider live payment enablement.
