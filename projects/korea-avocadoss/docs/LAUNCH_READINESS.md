# Korea Concierge — First-product Launch Gate

**Updated:** 2026-09-07. Normative details: [BUILD_SPEC.md](BUILD_SPEC.md), sections 12–15 and 18–21.

The first release sells My Korea Look as a one-time product, not a Trip Pass. A full new credit wallet and completion of every future product are not prerequisites. Payment safety and truthful delivery remain mandatory.

Before enabling checkout, verify:

- merchant/provider eligibility, actual SKU/price/currency/tax configuration, real business/support/policies;
- a complete localized sample and working paid-result engine, private result storage and PDF;
- authenticated order ownership and server-owned amount/return URLs;
- durable signature-verified events, settlement checks, deduplicated jobs, refund/dispute handling;
- running worker/reconciliation/email/refund recovery and honest status screens;
- photo consent/validation/deletion, storage permissions and no sensitive logs;
- BUILD_SPEC's minimum render, image, regression and payment/failure scenarios;
- exact-SHA CI/release and post-deploy checks for runtime changes.

Default payment flags remain false until the above is evidenced. Browser success never grants access. The current Stripe webhook foundation and success route require real fulfillment/status integration; their existence is not a live-readiness claim.

[Previous launch gate — historical only](archive/pre-revenue-first-2026-09-07/LAUNCH_READINESS.md).
