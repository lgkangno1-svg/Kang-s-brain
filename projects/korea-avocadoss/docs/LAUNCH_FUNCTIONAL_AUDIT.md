# Korea Concierge — Payment-grade functional audit

Last reviewed: 2026-09-12

This checklist treats **working end-to-end behavior** as the minimum bar. A page, card or mock interaction is not considered complete if the user's input does not materially change a result, failure cannot be recovered, or a paid result cannot be owned and re-opened safely.

## Status vocabulary

- **WORKING** — usable end-to-end in the current branch with automated contract coverage.
- **HARDENING** — works, but additional edge-case/data/UX coverage is required before broad launch.
- **INFRA BLOCKED** — repository-side contracts exist, but a dedicated external service/configuration must be created and tested.
- **PAYMENT BLOCKED** — real money must stay disabled.

## Customer-facing features

| Feature | Status | Current functional evidence | Remaining before payment-grade launch |
|---|---|---|---|
| Home / navigation | WORKING | Live Saju, Naming, Explore, Color and Hanbok routes are linked; paid banner is explicitly pre-launch. Footer destinations for about/contact/privacy/terms/refunds are real routes with canonical/hreflang and sitemap coverage. Contact, privacy, terms and refunds now provide authored P0 bodies and locale-native updated labels instead of silently falling back to English. | Final responsive/browser QA and native/legal review before payment activation. |
| Personal Color | HARDENING | Browser-local JPEG/PNG/WebP validation, size/dimension/pixel caps, local Lab/skin-pixel analysis, lighting warnings, manual correction, Hanbok bridge, orientation-aware `createImageBitmap` decoding with a browser-local `<img>` fallback and explicit decoder resource cleanup. Validation reads compressed JPEG/PNG/WebP dimensions before pixel decode, so over-36-MP photos are rejected before a full bitmap allocation. The functional gate executes synthetic camera-JPEG fixtures containing valid EXIF Orientation values 1/3/6/8 before the SOF frame header. Visitors can explicitly revoke the selected object URL, release the in-memory File reference, clear the derived result and recover to idle without persistence or network transfer. The scanner stays unmounted until the visitor explicitly accepts a six-locale browser-local disclosure. | Real-device rotated-camera decode/render evidence and constrained-memory device QA, plus final native/legal review of privacy/consent wording. |
| Hanbok matcher | HARDENING | Color/mood/comfort/destination/season ranking plus Personal Color bridge. Its authored six-look comparison subset has locale-native P0 presentation, source/license attribution and deterministic ranking. Rental-finder date/time handoff is sanitized in the Server Component so source-checked shop content remains present in server HTML instead of hiding behind a client `useSearchParams` bailout. | Expand the separate Hanbok comparison subset only after native presentation is authored for added references; verified rental inventory entity layer and broader visual regression tests also remain. |
| Saju | HARDENING | Real DOB + IANA birthplace timezone, exact/rough/unknown birth time, deterministic pillars/elements/zodiac, no AI call, no silent Seoul default, localized uncertainty. | Expand KASI/manseryeok cross-validation and historical timezone/boundary fixtures; final cultural wording review. |
| Korean Naming Studio | WORKING | Deterministic catalog/ranking, multiple candidate results, optional surname, Hangul/romanization/Hanja examples, six-locale shell, zero API. | Editorial/native-speaker review of candidate meanings/romanization before high-traffic launch. |
| Gyeongbokgung planner | HARDENING | Dynamic visit date, start time, 1/2/4h budget, photo/history/relaxed focus, timed stop allocation, source-backed holiday Tuesday/open-substitute-closure handling, calibrated conservative inter-stop walking times with fail-closed unknown legs, map handoff, and six-locale localized hero image alternative text. A six-locale arrival-time advisor now uses the selected date/time and guide language to expose the regular last-admission cutoff and next eligible official foreign-language tour, fails closed for regular Tuesday closure or post-cutoff arrival, keeps official source links visible, and supports a copy handoff without runtime network or precise-location access. The dedicated functionality contract covers mounting, selected-date facts, cutoff/closure handling, next-tour selection, P0 labels, source links, copy handoff, and zero-network/location invariants; production browser smoke verified the visible advisor and its default admission/tour result after exact-SHA deployment. | Live official-hours refresh strategy and broader device/accessibility regression coverage. |
| Nearby Explorer | HARDENING | 1–3h deterministic routes consume the selected visit date, omit source-verified fixed weekly/known holiday closures, retain time-window warnings, account for origin-to-first-stop and calibrated inter-stop walking time, and provide per-stop maps plus one zero-API full walking-route handoff preserving selected stop order. | Expand verified closure coverage, source-refresh operations and broader walking calibration. |
| Food & cafe finder | HARDENING | Source-checked official tourism records, category filters, hours/address/dietary notes, checked-at/source link. Records older than 30 days (or carrying an invalid/future check date) fail closed to verify-only instead of being presented as definitely open/closed, with six-locale visitor recovery copy and an automated regression contract. | Expand verified inventory, geospatial distance, localization of business descriptions and source-refresh operations. |
| Quick Help | WORKING | Deterministic decision tree, keyboard recovery, 0 credits, no fetch/LLM. | Keep answers synchronized with live feature routes and policy changes. |
| My Korea Look free preview | HARDENING | The source-checked catalog has 12 distinct references, with at least two `chima` and two `baji` directions in each of the three experience families. The active free-preview ranker consumes all 12 and responds to style/garment/palette/mood/comfort/coverage/season-or-date/destination. The six expansion references now have authored titles, taglines, descriptions and visual alternative text for every non-English P0 locale (`zh-CN`, `ja`, `zh-TW`, `vi`, `th`) instead of exposing generated generic result names; source/license facts remain unchanged. Coverage materially changes deterministic scoring, choices persist/restore locally with recovery, and copy/download export works. The free boundary remains one curated look, basic color direction and short deterministic reasons; photo analysis is not falsely claimed. | Broader native-speaker editorial/device QA remains; private paid-result persistence still depends on an approved dedicated Korea auth/database project. |
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
2. Complete remaining Personal Color real-device rotated-camera and constrained-memory QA; synthetic EXIF Orientation fixtures cover the compressed-header preflight path, while browser decode/render behavior still requires representative device evidence and final consent wording review.
3. Finish release verification for the 12-look My Korea Look catalog and authored P0 expansion presentation, then continue edge-case/device/native-editorial QA without weakening the six-look `/hanbok` localization boundary.
4. Continue Explore source-refresh/geospatial hardening; Gyeongbokgung holiday substitution, calibrated walking legs, map handoff, arrival-time/next-tour advisor and P0 hero-alt localization are covered by code-level contracts.
5. Continue My Korea Look result/catalog hardening; all active free-preview input dimensions are wired through deterministic ranking and persistence/export.
6. Create the dedicated Korea Supabase project only when account/database integration becomes the blocking step and the project cost/organization is explicitly approved.
7. Implement auth/order/webhook/fulfillment against that dedicated project.
8. Run Stripe **test-mode** E2E including retries/duplicate events/refunds.
9. Only then consider live payment enablement.
