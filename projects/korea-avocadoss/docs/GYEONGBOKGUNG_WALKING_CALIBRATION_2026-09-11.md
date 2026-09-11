# Gyeongbokgung walking calibration — 2026-09-11

## Scope

This bounded slice replaces the palace planner's single 8-minute inter-stop assumption with route-leg-specific conservative planning minutes. It does not claim live navigation, accessibility routing, queue time, or official walking-duration measurements.

## Product boundary

- Deterministic and browser-local; no AI, geolocation, Maps API key, or runtime routing request is added.
- Existing Google Maps direction links remain the user verification handoff for each consecutive leg.
- A route whose adjacent stop pair is not present in the calibration table fails closed instead of silently falling back to a fabricated duration.
- Ticket/security queues remain outside the calibrated walking minutes and are explicitly called out.
- P0 locale copy states that the minutes are planning estimates checked on 2026-09-11 and that current conditions should be re-checked in Maps.

## Evidence and method

The official Royal Palaces and Tombs Center Gyeongbokgung pages were re-checked on 2026-09-11 for the palace layout, named destinations, visitor-course context and current notices:

- https://royal.khs.go.kr/ENG/contents/menuInfo-gbg.do
- https://royal.khs.go.kr/ENG/contents/E101010000.do
- https://royal.khs.go.kr/ROYAL/contents/R707000000.do

The official source does not publish walking minutes for every internal pair. Therefore the product does **not** label the minute values as official. The values are conservative route-planning estimates for the fixed curated stop graph and are paired with Google Maps walking handoff links for current verification.

Calibration covers every adjacency currently emitted by the 1H, 2H and 4H photo/history/relaxed route fixtures. A regression contract rejects the former `const walk=8` behavior and checks representative short, medium and long palace legs plus timetable wiring.

## Discovery decision

GitHub discovery for a maintained TypeScript pedestrian-routing dependency did not surface a suitable library for this small fixed palace graph. Hugging Face model discovery was unavailable in this run. An ML model would add cost, privacy/runtime complexity and no material benefit over a small deterministic table, so no model or package was adopted.

## Remaining boundary

These estimates should be revisited when the official palace route/layout changes or when reliable route-provider evidence can be incorporated without making the planner dependent on per-request external routing. Temporary construction, crowding and accessibility constraints remain a live verification concern and must not be inferred from the static table.
