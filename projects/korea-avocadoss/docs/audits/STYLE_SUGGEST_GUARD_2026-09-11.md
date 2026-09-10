# My Korea Look — ungrounded palette suggestion guard

Date: 2026-09-11

Active source: `docs/PRD.md` -> `docs/BUILD_SPEC.md`.

## Gap closed

`StyleInputV1.palette='suggest'` previously received a neutral ranking score even when `colorSource='manual'` supplied no grounded color observation. BUILD_SPEC explicitly requires the customer to choose a palette when no valid observation/manual color basis exists; the engine must not manufacture a recommendation.

## Change

- Added `styleInputNeedsPaletteChoice` to the deterministic style input layer.
- `rankStyleInputV1` now fails closed with no ranked looks for `suggest + manual`.
- No API, AI, geolocation, photo upload, payment or persistence behavior was added.
- Added `check-style-suggest-guard.mjs` to the mandatory functionality gate.

## Release state

This slice is based on palace-helper candidate `b5b19727c93ad916e5f1912a22090e9cf41d2309`, so it preserves that unmerged work. It must pass the private MiniPC exact-SHA CI before merge. Payment remains fail-closed.
