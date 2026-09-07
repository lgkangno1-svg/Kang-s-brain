# Korea Concierge — Launch Readiness & Payment Activation Gates

**Status:** active release contract  
**Target:** `https://korea.avocadoss.co.kr`  
**Updated:** 2026-09-05

## Product principle

Do not activate live payments merely because the checkout API exists. Payment is the final commercialization step after the visitor experience, credit ledger, security, localization, and operational recovery paths are demonstrably ready.

The product may keep a payment-provider integration in code while `STRIPE_CHECKOUT_ENABLED` remains false. This allows QA without accidental production charging.

## Site maturity gate

Live payment activation requires all of the following:

### 1. Core visitor experience
- Home, Personal Color, Hanbok, Gyeongbokgung/Explore, K-Culture/Saju, Credits, Quick Help and checkout/result states have coherent navigation.
- No dead primary CTA. Planned features are visibly labeled and do not masquerade as completed products.
- Free Quick Help remains 0 AI calls / 0 credits.
- Paid actions show their fixed credit cost before confirmation.

### 2. Responsive and accessibility
- `docs/RESPONSIVE_QA.md` viewport matrix passes on rendered pages, not only static CSS checks.
- P0 locales pass mobile/desktop overflow QA.
- Keyboard navigation, focus visibility, form labels, error states and reduced-motion behavior are usable.
- Core touch targets are at least 44 px where practical.

### 3. Internationalization quality
- P0: English, Simplified Chinese, Japanese, Traditional Chinese, Vietnamese and Thai.
- No untranslated critical checkout/privacy/payment strings.
- Locale-prefixed URLs, hreflang/x-default, canonical tags and locale-preserving navigation pass.
- Prices/currency/date/time formatting are locale-safe and never imply a local currency charge that the payment provider does not actually present.

### 4. Wallet and credit integrity
- Wallet balance is server-authoritative.
- Credit ledger is immutable/auditable.
- Reserve/capture/release/refund are atomic and idempotent.
- A payment webhook credits exactly once even if the provider retries the same event.
- Refund/dispute/reversal paths can reverse credits without corrupting ledger history.
- Client-supplied user/account identifiers are never accepted as authoritative payment recipients.

### 5. Payment security
- Checkout can only be activated with an explicit environment flag.
- Secret keys and webhook secrets are server-only.
- Product/price IDs are server-owned; clients cannot inject amount, currency or arbitrary provider price IDs.
- Webhook signature verification occurs before any fulfillment.
- Webhook event IDs and checkout session IDs are stored and deduplicated before ledger mutation.
- Authenticated account identity is resolved server-side before a payment is associated with a wallet.
- Checkout, webhook and wallet endpoints have appropriate rate limits and abuse controls.
- Payment metadata contains only opaque identifiers and non-sensitive product keys; no Saju birth data, selfie/skin data, names or prompt contents.

### 6. Stripe-specific activation gate

As of 2026-09-05, Stripe's official global availability page does **not** list South Korea as a supported country for opening a standard payments account. A business cannot assume that a Korean entity can simply enable Stripe production payments. Before activation:

1. Verify the merchant legal entity's country and Stripe eligibility directly with Stripe.
2. Verify the payout bank/account requirements for that entity.
3. Create the actual Stripe Products/Prices for the approved Trip Passes and top-ups.
4. Configure test keys, webhook endpoint and price IDs.
5. Run test-mode checkout, success/cancel, duplicate webhook, delayed webhook, refund and failure cases.
6. Only after test-mode ledger fulfillment passes, configure live keys.
7. Set `STRIPE_CHECKOUT_ENABLED=true` only in the production environment after the final go-live checklist passes.

If the merchant entity is not Stripe-eligible, do **not** create a workaround by misrepresenting business location. Keep the same product/ledger contract and attach another eligible provider (for example a Korea-compatible international card/PayPal solution) behind the provider boundary.

## Current Stripe foundation vs. production readiness

### Already present
- Server-owned approved product catalog.
- Server-owned Stripe Price ID mapping.
- Stripe-hosted Checkout Session creation foundation.
- Timing-safe webhook signature verification and replay-window check.
- Localized checkout success route foundation.
- Build-time payment contract checks.
- Explicit `STRIPE_CHECKOUT_ENABLED` fail-closed activation flag.
- Checkout API no longer trusts a client-provided `userId`.

### Still required before live activation
- Real authentication/session integration for checkout ownership.
- Payment intent/order persistence before redirect.
- Durable provider event table / event-id idempotency.
- Webhook -> authoritative credit-ledger grant transaction.
- Atomic fulfillment/retry semantics.
- Refund/dispute/reversal handling.
- Product catalog alignment with final Trip Pass + top-up SKUs.
- Test-mode end-to-end tests using a real Stripe test account.
- Rendered checkout/success/failure UX QA in every P0 locale.
- Final legal entity / Stripe country eligibility confirmation.

## Site quality scorecard

Treat completion as evidence, not intuition. Before live payment, target:

| Area | Minimum launch bar |
|---|---|
| Critical flows | 100% primary flows have success, loading, empty and recoverable error states |
| Responsive | Required viewport matrix passes; no normal 320 px horizontal overflow |
| P0 localization | 100% critical UX/payment/privacy strings localized |
| Accessibility | Keyboard/focus/form QA passes; no critical blocking issue |
| Performance | No known avoidable client-heavy dependency; main pages remain usable on mobile networks |
| SEO/AEO/GEO | sitemap/robots/canonical/hreflang/structured content checks pass |
| Security | No critical/high known application flaw in payment/auth/wallet path |
| Payments | Test-mode purchase -> exactly-once credit grant -> refund reversal passes |
| Observability | Payment/credit/AI failures can be diagnosed without logging sensitive contents |

## User actions required later

Do not request credentials prematurely. When the above product gate is nearly complete, the user will need to provide or configure:

- eligible merchant/provider account;
- Stripe test/live keys **if Stripe eligibility is confirmed**;
- Stripe webhook secret and created Price IDs;
- production hosting environment variables;
- final business/legal/refund/support information displayed at checkout.

Until then, development proceeds with payment disabled and testable interfaces/contracts.
