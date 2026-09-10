# Hanbok rental — return-window + palace route handoff (2026-09-10)

Source of truth: `docs/PRD.md` -> active `docs/BUILD_SPEC.md`.

## Gap closed
The free Hanbok rental finder already filtered source-checked shops by visit date, arrival time and verified in-person language support, but the selected arrival time did not help visitors judge the remaining day or continue from a shop to Gyeongbokgung. This slice connects that input to a deterministic published-closing window and a direct walking-directions handoff.

## Behavior
- For a selected arrival that falls inside the catalog's published opening window, the finder shows the exact number of hours/minutes until the published closing time.
- The UI explicitly states that this is **not** a promised rental duration or return deadline. Inventory, rental duration and shop-specific return rules remain source-recheck items.
- Each source-checked shop now has a walking-directions handoff from its recorded address to Gyeongbokgung Palace using a Google Maps directions URL. Korea Concierge does not fabricate route duration or distance and does not require browser geolocation.
- Closed-day and outside-hours behavior remains fail-closed through the existing availability calculation. Shops with schedule confidence `recheck` remain labeled for re-verification.
- Existing source links, checked-at dates, save/recovery allowlisting, address copy and language filters are preserved.
- Six P0 locale shells explain the new closing-window and route-handoff semantics.

## Discovery and evidence
Fresh GitHub discovery for maintained TypeScript geospatial/Haversine helpers returned no useful repository-code result. A Hugging Face model search was attempted and the connected endpoint returned `Tool model_search not found`. No dependency or ML model was adopted: neither is necessary for deterministic clock arithmetic and an external map handoff.

Fresh source checks on 2026-09-10 reconfirmed Hanbok That Day's official Seoul tourism record (09:30–19:00, daily, address and language support) and 3355 Hanbok's own Gyeongbokgung branch page (09:00–18:00, Tuesday closure, address). Hanboknam's existing record remains `scheduleConfidence='recheck'` because its own seasonal closing guidance can vary.

## Verification contract
`scripts/check-hanbok-rental-recovery.mjs` now guards both the existing browser-only saved-shop recovery contract and the new route-window behavior: bounded published-close arithmetic, walking-mode map handoff, six-locale English identity strings, and no runtime `fetch`, XHR or geolocation dependency in the deterministic core.

## Boundaries
No booking/availability API, CMS deterministic logic, AI, account, Stripe, credits, payment, inventory claim or live-secret behavior changed. Checkout remains fail-closed. Exact-SHA MiniPC CI, merge-SHA CI, deployment and live Hanbok smoke are required before this slice is production-complete.
