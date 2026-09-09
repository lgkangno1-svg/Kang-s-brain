# Hanbok rental save/recovery slice — 2026-09-09

## Scope

One bounded non-payment improvement: make the source-checked Gyeongbokgung Hanbok rental finder recoverable across visits.

## User journey

`filter date/time/language -> inspect source-checked shop -> save shop -> leave/return -> show saved only -> map/source/copy address`

Saved state contains only curated shop IDs in browser local storage. Restored IDs are allowlisted against the current curated rental catalog; malformed storage and unknown IDs are removed rather than trusted.

## Trust boundaries

- No booking API or availability claim was added.
- Existing `sourceUrl`, `checkedAt`, hours, price and language-support evidence remain the basis of displayed facts.
- Inventory and exact price remain explicitly subject to re-check.
- No account identifier, photo, raw personal information, payment state or remote persistence is introduced.
- Stripe/payment behavior is unchanged and remains fail-closed.

## Regression guard

`scripts/check-hanbok-rental-recovery.mjs` is included in `npm run check:functionality` and requires local-only persistence, curated-ID validation, save toggle, saved-only filtering and the storage disclosure.
