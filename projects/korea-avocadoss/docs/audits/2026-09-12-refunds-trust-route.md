# Refunds trust-route functional slice — 2026-09-12

## Requirement closed

The active `BUILD_SPEC.md` route contract requires working locale-aware `/privacy`, `/terms`, `/refunds`, and `/contact` destinations from the footer. Before this slice, `/refunds` did not exist even though the other trust routes did.

## Implementation

- Added `/{locale}/refunds` with canonical/hreflang metadata.
- Added the route to the public locale inventory and sitemap configuration.
- Added a localized footer link in all six P0 locales.
- Extended the legal-page model with an explicit refunds/cancellations document.
- Refund copy is deliberately fail-closed: it states that real checkout is disabled and does not invent a merchant identity, refund contact, paid entitlement, or active sale terms.
- Preserved the active PRD recovery boundary as a future paid-product contract: one successful revision in 30 days, 90-day result access, and automatic full-refund request when a confirmed payment fails to produce the first result within 15 minutes. The page explicitly says these promises activate only when real checkout is enabled.
- Added native refunds copy for `zh-CN`, `ja`, `zh-TW`, `vi`, and `th` rather than falling back to English for the new policy surface.
- Extended `check-trust-routes.mjs` to require the refunds route, footer link, canonical/hreflang, sitemap coverage, fail-closed payment truth, recovery boundary, statutory-rights precedence, and P0 localized refunds copy.
- Wired `check-trust-routes.mjs` into `check:functionality`, so the trust-route contract is now part of the production build gate instead of an orphaned script.

## External boundary

Seller-controlled legal merchant identity, support/refund contact, digital-content consent/cancellation wording, tax treatment, and provider-specific refund terms remain launch blockers for real-money checkout. This slice does not activate Stripe or weaken the compile-time/runtime payment gates.

## Verification required before promotion

1. Pin this branch's exact 40-character candidate SHA in the private MiniPC CI `target-ref.txt`.
2. Require the full exact-SHA production build and functional/security/i18n gates to pass.
3. Merge only from green candidate evidence; if main moves, rebase/reconcile safely and test the exact merge SHA.
4. Pin the exact green main SHA in `deploy-ref.txt` and require root-owned production cutover plus stable public Cloudflare probes.
5. Live-smoke at least `/en/refunds` and one non-English P0 refunds route, confirming the footer link and fail-closed copy are publicly visible.
