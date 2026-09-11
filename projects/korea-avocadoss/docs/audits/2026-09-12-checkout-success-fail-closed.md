# Checkout success false-positive recovery — 2026-09-12

## Active requirement

`docs/PRD.md` designates `docs/BUILD_SPEC.md` as the active requirements source. The paid release contract forbids treating a success URL, query string, or provider-shaped session value as proof of payment. Paid state must come from server-side provider verification bound to an authenticated Korea Concierge order and entitlement.

## Fresh gap

The existing localized `/[locale]/checkout/success` Client Component read `session_id` from the browser and considered any value beginning with `cs_` a valid-looking session. The page then rendered translated copy claiming that payment had succeeded and entitlements were active, despite having no durable order lookup or server-side provider verification. The computed `isValidSession` flag was not even used to gate the success presentation.

Because checkout intentionally remains fail-closed while the dedicated Korea database/auth/payment prerequisites are absent, a directly visited return route must not imply a successful transaction.

## Change

- Replaced the client/query-string success presentation with a server-rendered fail-closed holding state.
- The route no longer consumes `session_id`, `product`, provider-looking IDs, or the public product catalog.
- It explicitly states that the route does not confirm payment or entitlement and that sales are not active yet.
- Added authored copy for all P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`.
- Kept the route `noindex` via its existing layout and made the page dynamic/non-revalidated so a future verified server implementation cannot accidentally inherit a static success artifact.
- Recovery actions go to the free `/style` preview or home; they do not lead to credits or another paid surface.
- Added `scripts/check-checkout-success-fail-closed.mjs` to `check:functionality` so query-string trust and client-side success inference cannot silently return.

## Boundary

This patch does **not** claim payment verification is implemented. It deliberately fails closed until S3–S5 have owner-bound persistence, provider verification, durable webhook state, fulfillment and refund recovery. It does not enable Stripe, credits, checkout flags, merchant configuration, or live secrets.

## Release requirement

Treat this as runtime-affecting. Pin the exact candidate SHA in private MiniPC CI; merge only after the full existing gate succeeds. Then verify the exact merged SHA, pin it for production deploy, require root-owned cutover plus stable public Cloudflare probes, and smoke the localized checkout return route to confirm that no success/entitlement claim is exposed.
