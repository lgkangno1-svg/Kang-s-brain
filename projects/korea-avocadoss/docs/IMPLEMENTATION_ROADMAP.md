# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-09-05  
**Rule:** implement one reviewable slice at a time. Update `PROJECT_HANDOFF.md` in the same material run.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
0-credit, 0-AI, no external question transfer, P0 localized, keyboard/focus/ARIA hardened.

## Step 2 — Internationalized routing and language selector ✅
Completed P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. Native localized Home/Culture/Gyeongbokgung/Personal Color/Hanbok/Credits, locale-preserving navigation, localized metadata, reciprocal hreflang + x-default, canonical sitemap coverage, locale-correct document language, deterministic legacy redirects, frozen lockfile/build verification, and retired shadowed legacy UI.

## Step 3 — K-Culture deterministic core — IN PROGRESS
- Saju calculation/input contracts: exact / approximate / unknown, IANA timezone/DST, Five Rats formula, element range bounds, provenance, PII stripping ✅
- Hanbok recommendation/matcher foundation ✅
- Continue polishing foreign-visitor explanations, uncertainty handling and result UX before monetization.

## Step 4 — Authoritative wallet & ledger — FOUNDATION SHIPPED
- Guest browsing and ledger contracts ✅
- Immutable ledger model ✅
- Reserve/capture/release/refund contracts ✅
- Authorization boundaries ✅
- Production payment fulfillment, durable provider-event idempotency and reversal flows remain launch-gate work.

## Step 5 — Stripe payment foundation — CODE READY, LIVE ACTIVATION GATED
- Stripe Checkout Session foundation ✅
- Server-authoritative product catalog & price ID resolution (zero client amount injection) ✅
- Timing-safe HMAC-SHA256 webhook signature verification with replay tolerance ✅
- Zero sensitive Saju/selfie data in Stripe metadata ✅
- Localized `/checkout/success` foundation ✅
- Security & contract tests ✅
- Explicit `STRIPE_CHECKOUT_ENABLED` fail-closed gate ✅
- Client-provided `userId` removed from checkout ownership ✅
- **Not live-ready yet:** authenticated checkout ownership, durable order/event persistence, exactly-once webhook -> credit grant, refunds/disputes/reversals, final SKU alignment and real test-mode E2E.
- Stripe production activation also requires legal-entity eligibility verification; South Korea is not currently listed on Stripe's standard supported-country page.

See `docs/LAUNCH_READINESS.md` for the activation gate.

## Step 6 — Product maturity / launch-quality pass — CURRENT PRIORITY
Do not rush live payment. Raise the overall site quality until the product is credible enough that payment is the missing final switch.

### 6.1 Responsive/device quality
- Rendered QA across `docs/RESPONSIVE_QA.md` viewport matrix.
- P0 locale overflow/zoom/mobile landscape checks.
- Remove remaining screenshot-only tiny typography or fixed-width assumptions.

### 6.2 Core UX completeness
- Every primary CTA leads to a working or honestly labeled state.
- Add loading, empty, error, retry and recovery states to every interactive feature.
- Clarify free vs. credit-paid actions before interaction.
- Improve cross-feature journeys: Color -> Hanbok -> Palace -> Food/Route -> Culture.

### 6.3 Trust & international visitor confidence
- Clear privacy explanation for selfie/Saju data.
- Freshness/source indicators for travel/restaurant facts.
- Refund/support/credit rules ready before checkout.
- Localized trust copy for all P0 markets.

### 6.4 Performance and reliability
- Reduce third-party payload and unnecessary client JS.
- Prefer server/static rendering where interaction is not needed.
- Validate image sizing/loading and Core Web Vitals risks.
- Add telemetry for feature failures without sensitive contents.

### 6.5 SEO/AEO/GEO
- Crawl/index/canonical/hreflang/sitemap/robots checks.
- Strong topic/entity pages for high-intent foreign visitor questions.
- Structured data only when accurate and visible.
- Internal linking that moves informational visitors into useful product flows.

### 6.6 Payment readiness
Only after the above areas pass the minimum launch bar:
1. confirm merchant/provider eligibility;
2. connect test-mode provider credentials;
3. implement authenticated order ownership + durable exactly-once credit fulfillment;
4. run payment/refund/failure E2E;
5. configure production secrets;
6. activate checkout flag only after final QA.

## Release gate for every material slice
1. inspect fresh `main`, recent commits, handoff and roadmap;
2. make one coherent change set;
3. run all available static/contract/build checks;
4. perform rendered desktop/mobile QA when Browser/Playwright runtime is available;
5. do not claim production success without public/runtime evidence;
6. preserve payment fail-closed state until `docs/LAUNCH_READINESS.md` is satisfied;
7. full sitemap/P0 crawl before production launch.
