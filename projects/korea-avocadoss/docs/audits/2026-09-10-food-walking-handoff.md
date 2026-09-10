# Food Finder walking handoff — 2026-09-10

Source of truth: `docs/PRD.md` -> active `docs/BUILD_SPEC.md`.

## Gap closed
Food Finder exposed verified place records and single-place map search, but the visitor still had to manually construct the post-palace walking transition. This slice adds a deterministic Google Maps walking-directions handoff from Gwanghwamun Gate at Gyeongbokgung to each selected food/cafe destination.

## Behavior and boundaries
- Origin is explicit and fixed: `Gwanghwamun Gate, Gyeongbokgung Palace, Seoul`.
- Destination uses the already source-checked place name + address.
- Google Maps receives `travelmode=walking`; Korea Concierge does not fabricate distance, ETA, accessibility, opening status, inventory or booking availability.
- No geolocation permission, Maps API key, client fetch, AI, CMS logic, payment, auth or remote photo handling is added.
- Six P0 locale labels are present.
- Existing source freshness fail-closed behavior remains unchanged.

## Discovery
A fresh GitHub search for a TypeScript Haversine/geospatial dependency did not return a candidate that materially improves this simple external-map handoff. A fresh Hugging Face geospatial/routing model search was attempted, but the connected endpoint returned `Tool model_search not found`. No model or dependency was adopted: a deterministic Maps URL is smaller, cheaper, privacy-minimizing and avoids invented route metrics.

## Regression contract
`scripts/check-food-walking-handoff.mjs` is included in `check:functionality`. It guards the fixed origin, destination encoding, walking mode, six-locale UI labels, and the absence of geolocation/fetch dependencies.
