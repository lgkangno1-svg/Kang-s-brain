# Functional audit — My Korea Look free-plan recovery

Date: 2026-09-09
Baseline main: `abe1988357ef48110048e533ffc7e7bee363ae24`
Scope: non-payment visitor recovery only.

## Gap selected
The free My Korea Look 3-look planner already produced deterministic ranked results, copyable Korean rental requests, photo-route guidance and a rental-finder handoff, but its five non-sensitive preference choices were lost on reload/navigation. That broke the intended input → result → save/copy/handoff → recovery journey.

## Change
- Add explicit device-local save, restore and clear actions for style, garment, color direction, trip priority and season.
- Persist only a versioned bounded preference object under `kc-my-korea-look-plan-v1`; no photo, birth detail, account identifier or free text is stored.
- Validate every restored enum value before applying it. Invalid/stale payloads are deleted and treated as no saved plan.
- Keep the feature zero-API and disclose that saved choices stay on the current device in all six P0 locales.
- Add `scripts/check-style-plan-recovery.mjs` to the normal `check:functionality` gate.

## Deliberate non-changes
- No Stripe/payment/credit purchase or merchant flow activation.
- No new dependency, model, remote inference or analytics call.
- No bulk Hanbok visual asset work.
- No automatic restoration: visitors explicitly choose when to restore saved preferences.

## Verification contract
The new regression check requires a versioned key, bounded non-sensitive schema, validation before restore, fail-closed removal of invalid data, explicit delete, local-persistence disclosure, and absence of `fetch()` in the free planner.

Promotion remains subject to the private exact-SHA MiniPC CI and deployment gates described in the project handoff.
