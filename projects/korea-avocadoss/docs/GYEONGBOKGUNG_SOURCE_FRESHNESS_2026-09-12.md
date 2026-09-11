# Gyeongbokgung official-source freshness gate — 2026-09-12

Active requirements remain `docs/BUILD_SPEC.md` as designated by `docs/PRD.md`.

## Gap closed

The Gyeongbokgung visit-facts module already carried official Korea Heritage Service source URLs, a checked-at date, a 30-day maximum age, and a runtime freshness helper. However, the freshness metadata was not part of the release test suite. A future build could therefore ship after the official opening-hours/tour facts had become operationally stale unless a human happened to notice.

## Release contract

`check-gyeongbokgung-source-freshness.mjs` is now part of `check:functionality` and fails closed when:

- either source is no longer an absolute HTTPS URL on the official `royal.khs.go.kr` origin;
- the checked-at date is malformed, invalid, or in the future;
- the freshness window exceeds 30 days;
- the checked facts are older than the configured freshness window; or
- the runtime freshness helper is removed.

When the gate expires, the correct recovery is to re-check both official KHS pages, update only verified facts and `GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT`, then run the normal exact-SHA MiniPC CI. The gate must not be weakened or bypassed merely to release.

## Scope

No route behavior, payment, account, AI, CMS, photo processing, Stripe, credit or entitlement behavior changes in this slice. It is an operational provenance/release hardening change only, so no production cutover is required unless another runtime-affecting change is included in the same candidate.
