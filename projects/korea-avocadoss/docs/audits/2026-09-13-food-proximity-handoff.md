# Food Finder proximity hardening — 2026-09-13

## Active requirement

`docs/PRD.md` points to `docs/BUILD_SPEC.md` as the active product authority. This slice continues the Explore requirement to make source-checked Seoul travel results more useful without inventing live availability, inventory or prices.

## What changed

- Food Finder records now carry optional source-backed walking-distance metadata from **Gyeongbokgung Station** (`stationDistanceMeters`, `stationExit`).
- Category/all result lists are ordered by the published station distance when it exists. Records without a verified distance are retained but sort after verified-distance records instead of receiving a guessed value.
- Current Visit Seoul source facts were rechecked on 2026-09-13 for Tosokchon Samgyetang, Seochon Dagwabang, Tailor Coffee Seochon Gyeongbokgung Branch, Aino Garden Kitchen, Cafe Haven and Cafe Sinola.
- Tailor Coffee's vague area address was corrected to the current Visit Seoul address: `1F, 15 Hyoja-ro, Jongno-gu, Seoul`.
- `iftar` intentionally has no synthetic distance because the checked Visit Seoul page does not publish the same station-distance field. Its schedule remains `recheck`.
- Existing date/time availability, source freshness fail-closed behavior, saved-place recovery, address copy and walking-map handoff remain unchanged.

## Source evidence

Source pages are retained directly on each `FoodPlace`. The published station distances used by this slice are:

- Tosokchon Samgyetang — Gyeongbokgung Station Exit 2, 203 m.
- Tailor Coffee Seochon Gyeongbokgung Branch — Exit 3, 261 m.
- Seochon Dagwabang — Exit 1, 308 m.
- Aino Garden Kitchen — Exit 7, 468 m.
- Cafe Haven — Exit 2, 562 m.
- Cafe Sinola — Exit 3, 1.1 km.

These are source-published transit proximity figures, not live routing estimates. The existing Google Maps walking action remains the user's route-level handoff.

## Regression contract

`check-food-proximity.mjs` verifies:

1. proximity metadata is optional and typed;
2. known distances sort deterministically nearest-first;
3. unknown distance fails closed to the end instead of being fabricated;
4. refreshed records retain the 2026-09-13 verification date;
5. Tailor Coffee uses the corrected official address.

The contract is included in `check:functionality`, so it also runs under the normal production build gate.

## Boundaries

No AI/model calls, payment, Stripe, credits, auth, order, entitlement, webhook, fulfillment, photo processing or precise user-location access were added. Checkout remains fail-closed. Exact-SHA CI/deployment evidence is still required before this branch is called production-complete.
