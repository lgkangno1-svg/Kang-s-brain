# Nearby walking-time calibration — 2026-09-11

## PRD gap closed by this slice

`LAUNCH_FUNCTIONAL_AUDIT.md` still identified real walking-time calibration as a Nearby/Gyeongbokgung hardening gap. The previous deterministic planner had two concrete timing defects:

1. the walk from Gyeongbokgung to the first stop consumed **zero** minutes in the displayed timeline and budget;
2. subsequent transfers used a destination-level `transferMinutes` value instead of the actual previous-stop → next-stop leg.

This slice replaces those assumptions with explicit pairwise walking legs and includes the first palace-origin leg in both budget and arrival time.

## Data policy

These values are **planning estimates, not real-time routing**. They are deliberately conservative and carry `sourceUrl`, `checkedAt` and `confidence`. The visitor still receives a provider-native Google Maps walking route for current conditions. If a route pair has no calibrated leg, deterministic route construction fails closed at that point instead of fabricating a duration.

No AI, paid routing API, geolocation tracking or client fetch is introduced.

## 2026-09-11 calibration evidence

| Leg | Planning minutes | Evidence used | Treatment |
| --- | ---: | --- | --- |
| Gyeongbokgung → Gwanghwamun Square | 5 | https://koreadaddy.com/gwanghwamun-square-guide/ | Current 2026 guide describes the palace as about a 5-minute walk from the square. |
| Gyeongbokgung → Seochon | 12 | https://seoulhanbok.com/en/blog/where-to-stay-near-gyeongbokgung/ | Map-based range is about 10–15 minutes; midpoint used for planning. |
| Gyeongbokgung → Bukchon | 15 | https://www.rome2rio.com/s/Gyeongbokgung/Bukchon-Hanok-Village | Current walking result is about 13 minutes; rounded up. |
| Gyeongbokgung → Insadong | 20 | https://www.rome2rio.com/s/Gyeongbokgung/Insadong | Current walking result is about 19 minutes; rounded up. |
| Gwanghwamun Square → tourist information center | 5 | https://english.visitseoul.net/attractions/Gwanghwamun-Tourist-Information-Center/ENP027225 | Same visitor area; a short orientation/crossing buffer is reserved rather than claiming a live route. |
| Information center → Insadong | 15 | https://www.rome2rio.com/s/Gwanghwamun-Square/Insadong | Current square → Insadong walking result is about 15 minutes; information center is treated as the same visitor-area origin. |
| Seochon → Suseongdong Valley | 18 | https://www.kikispawprints.com/2026/06/suseongdong-valley-seoul-hidden-gem-seochon.html | Current guidance gives roughly 15–20 minutes from the Gyeongbokgung/Seochon approach; midpoint used. |
| Suseongdong Valley → Gwanghwamun | 25 | same source plus current Gwanghwamun/Gyeongbokgung relationship | Conservative composite return estimate; UI explicitly tells visitors to verify the live map. |
| Bukchon → Insadong | 15 | https://www.rome2rio.com/s/Bukchon-Hanok-Village/Insadong | Current walking result is about 14 minutes; rounded up. |
| Insadong → Gwanghwamun Square | 15 | https://www.rome2rio.com/s/Insadong/Gwanghwamun-Square | Current walking result is about 15 minutes. |

## Product behavior after this slice

- route budgeting starts at `gyeongbokgung`, not at the first destination;
- every accepted stop consumes both walking minutes and stay minutes;
- a missing pairwise walking leg stops route extension rather than falling back to an unrelated destination-level guess;
- the first stop shows its walk time and its arrival clock reflects that walk;
- all six P0 locales disclose that walking values are dated conservative estimates, not live traffic/accessibility routing;
- copied routes include each walking transfer and the existing full Google Maps walking-route handoff;
- stop editorial content remains server-resolved through the existing content adapter; deterministic route timing remains in application code as required by the headless-CMS architecture.

## Remaining limitation

A zero-cost deterministic planner cannot guarantee elevator availability, temporary construction detours, crowd delays, mobility-specific routing or live crossing conditions. Those are intentionally delegated to the provider-native live walking map. If the active PRD later requires accessibility-specific route computation, that should be a separate source/API and privacy evaluation rather than silently re-labeling these estimates.
