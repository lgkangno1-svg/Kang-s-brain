# My Korea Look input-method boundary — 2026-09-11

Active requirements remain `docs/BUILD_SPEC.md` as designated by `docs/PRD.md`.

## Gap closed

The `/[locale]/style` route previously rendered a photo/no-photo radio selector whose state did not flow into `StyleConsultationV5`, ranking, persistence, or result provenance. That made the selector informational rather than functional and conflicted with the PRD rule against inert controls.

## Current contract

- The route now presents the two methods as a truthful comparison rather than a fake stateful selector.
- The free style preview remains preference-based and `colorSource='manual'` unless the visitor deliberately runs the separate browser-local Personal Color flow and manually carries the resulting color direction back by choosing the corresponding named palette.
- The comparison states that the browser-local Personal Color photo remains on-device.
- Paid remote-photo styling remains unavailable until dedicated private account/auth, storage, consent, fulfillment and payment-readiness gates are verified.
- No photo upload, remote analysis, checkout, account, Stripe, credit or AI behavior is added by this slice.
- Six P0 locales retain localized method-boundary copy.

## Regression guard

`check-style-full-input.mjs` now fails if a stateful radio/mode selector is reintroduced without a real functional connection. It also continues to require the Personal Color handoff link, the preference-based claim boundary, the paid-photo infrastructure warning, and zero-network/zero-checkout behavior in the free input boundary.

This is a runtime UX correction and still requires exact-SHA MiniPC CI, merge-SHA CI, production deployment and live route verification before it is production-complete.
