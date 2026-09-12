# Handoff — My Korea Look destination-bound plan

Date: 2026-09-13
Branch: `feat/korea-style-destination-provenance-20260913`
Active requirements: `docs/PRD.md` → `docs/BUILD_SPEC.md`

## What changed

The paid-domain `my_korea_look_v1` result now treats the customer's destination as an actionable result field rather than only a ranking weight. `src/lib/looks/stylebook-destination-v1.ts` provides source-dated Gyeongbokgung, Bukchon and Seochon plans; `stylebook-engine-v1.ts` embeds the chosen plan, map handoff data and 2–3 hour route, and aligns each look's recommended location/photo route to it.

Travel facts are static/source-checked and deliberately conservative. They do not claim live opening, admission, booking, rental inventory or current prices. The visual-license source for each look remains independent from the destination source.

## Regression gate

`npm run check:functionality` now includes `scripts/check-stylebook-destination-v1.mjs`, guarding source/checked-date presence, all three destinations, route duration, selected-destination binding and zero payment/network/storage coupling.

## Payment boundary

No checkout or paid entitlement was enabled. Dedicated Korea Auth/DB, owner-bound orders/results, durable webhook persistence, fulfillment/retry, private result/PDF storage, revision version persistence and refund recovery remain blockers for real-money activation.

## Next highest-value credential-free slice

Before external infrastructure is approved, improve paid-result presentation readiness without simulating ownership: localize the new destination-plan narrative/route labels for all six P0 locales and add a renderer contract for the complete private-result page payload. Do not expose that complete paid payload through the public free preview.
