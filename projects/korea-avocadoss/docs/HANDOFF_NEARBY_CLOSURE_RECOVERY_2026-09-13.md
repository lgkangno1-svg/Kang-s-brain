# Korea Concierge handoff — Nearby closed-stop route recovery

Date: 2026-09-13
Candidate branch: `feat/korea-nearby-freshness-20260913`
Base main SHA: `a30fc702951dae97b0b167dfe7f983654bc4ae0f`

## Active requirement

`docs/PRD.md` continues to designate `docs/BUILD_SPEC.md` as the active product requirements source. This slice keeps the Explore experience useful without credentials, AI, paid infrastructure or fabricated live travel claims.

## Implemented

The Nearby deterministic route core now recovers when a source-verified closed optional stop sits between two otherwise valid stops. In the `easy` route, a closed Gwanghwamun Tourist Information Center no longer strands the itinerary at Gwanghwamun Square: a separately calibrated, source-traceable 15-minute Gwanghwamun → Insadong walking leg allows the remaining itinerary to continue when the visitor's time budget permits it.

The duplicate Gwanghwamun → information-center walking-leg record was removed. Unknown walking pairs still fail closed rather than borrowing an unrelated estimate.

A dedicated regression contract is included in `check:functionality`, covering the direct fallback, normal open-day leg, duplicate rejection, routing order invariant, and zero-API/zero-AI behavior.

## Safety and product boundaries

No real-time shop/venue opening claim is introduced. Existing source/check-date provenance and provider-native map verification remain authoritative for visitor re-checks. No payment, checkout, Stripe, credits, account, auth, ownership, webhook, fulfillment or AI behavior changed.

## Next work

Continue Explore source-refresh operations and broader walking/closure calibration, or switch to the next highest-value credential-free My Korea Look/Personal Color hardening slice after this branch is verified. Exact-SHA CI/deploy/live evidence is still required before this change is described as production-complete.
