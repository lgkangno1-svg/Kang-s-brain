# Korea Concierge handoff — 2026-09-12 Food access distance

**Candidate branch:** `feat/korea-food-access-distance-20260912`

- Active requirements remain `docs/BUILD_SPEC.md` as designated by `docs/PRD.md`.
- Highest-value unblocked gap selected from the current launch audit: Food & Cafe Finder geospatial/access comparison.
- The finder now supports a deterministic `nearest-access` ordering using only source-backed official Visit Seoul transportation distances. Unknown distances are left unknown and sort after verified distances.
- Six P0 locales expose the new ordering and distance provenance. The selected sort is recovered from browser-local storage; no precise location is requested.
- Fresh 2026-09-12 source review refreshed Tosokchon, iftar, Seochon Dagwabang, Tailor Coffee, Aino Garden Kitchen, Cafe Haven and Cafe Sinola records. Tailor Coffee's address was corrected to the current official listing.
- Existing availability freshness behavior and the explicit Google Maps walking handoff remain intact. No live walking time, inventory, price, or opening status is inferred beyond stored source facts.
- `scripts/check-food-access-distance.mjs` is wired into `check:functionality` and guards sorting, provenance, P0 labels, persistence and zero-geolocation behavior.
- The automation sandbox could not clone GitHub because outbound DNS was unavailable, so local npm/build evidence is not claimed. Use PR/exact-SHA CI before merge/deploy.
- Payment/auth/ownership/webhook/fulfillment behavior was not changed; checkout remains fail-closed.
