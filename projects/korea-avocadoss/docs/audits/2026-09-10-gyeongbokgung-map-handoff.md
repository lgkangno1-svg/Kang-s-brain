# Gyeongbokgung planner walking-map handoff — 2026-09-10

## Gap closed

`docs/PRD.md` designates `BUILD_SPEC.md` as the active requirements source. The active route contract calls for a practical map link and ordered movement. The current Gyeongbokgung planner generated a deterministic timed stop order but stopped at on-page text, leaving visitors to re-enter each place manually in a map.

## Implementation

- Each consecutive pair in the generated palace itinerary now gets an explicit walking-directions handoff.
- The link is derived from the same `timeline` array that renders the itinerary, so it cannot silently reorder the selected 1H/2H/4H + photo/history/relaxed route.
- Each endpoint includes the English and Korean stop name plus `Gyeongbokgung Palace, Seoul` context to reduce ambiguous map search resolution.
- Uses the documented Google Maps URL contract (`/maps/dir/?api=1`, `origin`, `destination`, `travelmode=walking`) rather than a client Maps SDK or paid API.
- Per-leg links deliberately avoid multi-waypoint limits on mobile browsers; every generated stop remains reachable in exact order even on the longest itinerary.
- The UI states that Google Maps calculates the actual path after handoff and that the planner's existing ~8-minute inter-stop allowance is only a planning assumption, not measured realtime walking data.
- No precise device geolocation permission, location persistence, API key, AI/model call or client-side remote map request was added.
- Handoff copy is present for all P0 locales: en, zh-CN, ja, zh-TW, vi, th.

## Regression contract

`scripts/check-gyeongbokgung-map-handoff.mjs` verifies:
- directions URL contract and walking mode;
- endpoints come from consecutive generated timeline stops;
- external-link safety attributes;
- all P0 locale handoff labels;
- absence of `navigator.geolocation` and `maps.googleapis.com` API dependencies.

The contract is included in `check:functionality`, so exact-SHA MiniPC CI and the production build fail if the handoff is removed or replaced with a key/geolocation-dependent path.

## Release boundary

This is runtime-affecting and requires candidate exact-SHA MiniPC CI, merge-SHA CI, deploy-ref pinning, MiniPC production cutover and live `/en/explore/gyeongbokgung` verification before it can be called production-complete. Payment/Stripe/credits remain unchanged and fail-closed.
