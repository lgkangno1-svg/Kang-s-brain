# Paid Stylebook Engine v1 audit — 2026-09-13

## Scope

Active requirements remain `docs/BUILD_SPEC.md` via `docs/PRD.md`. This slice advances S4 without enabling payment or requiring Korea DB/Auth credentials.

The previous `src/lib/looks/deliverable.ts` only consumed the older ranking contract and did not model the active My Korea Look inputs (`mood`, palette source, comfort, coverage, visit date/season, destination) or the included one-successful-revision rule. The public free preview already uses `StyleInputV1`; this created a material risk that a future paid result would ignore choices that the customer made before purchase.

## Implemented

- Added `src/lib/looks/stylebook-engine-v1.ts` as an infrastructure-free domain engine for `my_korea_look_v1`.
- The engine consumes the active `StyleInputV1` and deterministic `rankStyleInputV1` path.
- It produces exactly three eligible curated looks or fails closed with a typed error.
- Each result snapshots the full input, records whether personalization came from explicit preferences or a browser-local color preview, resolves visit-date season deterministically, and includes visual/source/license facts, localized catalog presentation, accessories, three input-linked reasons, trade-off, alternate colorway, Korean rental card, and photo route.
- Manual `suggest` palette input fails closed instead of inventing a color direction.
- Added one-successful-revision domain behavior: only the BUILD_SPEC-supported mutable fields can be patched; an empty revision is rejected; a second successful revision is rejected; a failed rebuild throws before producing a new result and therefore does not consume the included revision.
- The original result object is not mutated; successful revisions return a new version with `parentGeneratedAt` and revision sequence metadata.
- No network, checkout, Stripe, local/session storage, account, database, worker, or email behavior was added. Payment remains fail-closed.

## Regression contract

`check-stylebook-engine-v1.mjs` is now part of `npm run check:functionality`. It guards active full-input coupling, three-look output, localized reasons, source/visual fields, alternate colorway, one-revision recovery semantics, and zero payment/network coupling.

## Remaining gates

This is a domain-engine slice, not a claim that the paid product is sellable. S3 owner-bound auth/order/private persistence is still blocked on an approved dedicated Korea database/auth project. Worker execution, durable job state, private result/PDF delivery, refund recovery, test-mode payment E2E, device QA, and exact-SHA deployment evidence remain required before live checkout can open.
