# Food & Cafe Finder — source-backed access distance slice

Date: 2026-09-12
Branch: `feat/korea-food-access-distance-20260912`

## Why this slice

`LAUNCH_FUNCTIONAL_AUDIT.md` identified geospatial distance as a remaining Food & Cafe Finder gap. The existing UI could open a walking route from Gyeongbokgung but could not compare nearby entries without making the visitor inspect every map separately.

## Implemented

- Added optional `accessDistanceMeters` and `accessDistanceBasis` fields to the deterministic food record contract.
- Added a `nearest-access` sort that places records with source-backed access distance first and leaves records without a comparable official distance at the end rather than inventing a value.
- Added a six-locale sort control and per-card distance provenance copy.
- Persists only the visitor's sort choice in browser local storage; existing favorites remain ID-only local storage.
- Keeps current zero-precise-location behavior. The feature does not call geolocation or a runtime distance API.
- Existing Google Maps walking handoff from Gwanghwamun Gate remains an action link, not a claimed live walking duration.

## Source refresh performed

Fresh checks on 2026-09-12 used current official Visit Seoul pages where available. Recorded transportation-field distances are from the named Gyeongbokgung Station exit, not from the palace gate:

- Tosokchon Samgyetang — 203 m from Exit 2.
- Tailor Coffee Seochon Gyeongbokgung Branch — 261 m from Exit 3; address corrected to `1F, 15 Hyoja-ro, Jongno-gu, Seoul`.
- Seochon Dagwabang — 308 m from Exit 1.
- Aino Garden Kitchen — 468 m from Exit 7.
- Cafe Haven — 562 m from Exit 2.
- Cafe Sinola — 1.1 km from Exit 3.
- iftar — current official listing was refreshed for hours/address/dietary facts, but no comparable transportation distance was captured, so no distance is stored or inferred.

## Regression contract

`check-food-access-distance.mjs` checks the deterministic sort model, six P0 locale labels, local sort recovery, provenance fields, refreshed Tailor Coffee address, and the absence of precise-location APIs. It is wired into `check:functionality`.

## Verification boundary

The sandbox runtime could not reach GitHub (`Could not resolve host: github.com`), so a local cloned-branch `npm run check:functionality` could not be executed in this automation run. The branch/PR CI result must be used as build evidence. No production/deployment claim is made here.

## Payment / privacy impact

No checkout, Stripe, account, auth, ownership, webhook, fulfillment, credit, photo-processing, AI model, or external runtime API behavior changed. Payment remains fail-closed.
