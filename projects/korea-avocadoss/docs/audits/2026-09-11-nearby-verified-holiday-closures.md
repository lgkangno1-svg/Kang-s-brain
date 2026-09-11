# Nearby Explorer — verified holiday closure slice (2026-09-11)

Source of truth: `docs/PRD.md` → active `docs/BUILD_SPEC.md`.

## Gap closed
`LAUNCH_FUNCTIONAL_AUDIT.md` identifies holiday exception data as an outstanding Explore/Nearby hardening gap. The Nearby planner already omitted source-verified weekly closures, but its Gwanghwamun Tourist Information Center record only warned that Lunar New Year and Chuseok require a re-check. Selecting a verified festival closure date could therefore still place that center in a deterministic route.

## Source verification
- Official Visit Seoul listing for Gwanghwamun Tourist Information Center was re-checked on 2026-09-11. It states hours 10:00–19:00 and closures on Saturdays, Lunar New Year and Chuseok.
- Korea Astronomy and Space Science Institute 2026 calendar data maps lunar New Year's Day (lunar 1/1) to 2026-02-17 and identifies 2026-09-25 as Chuseok/Harvest Moon day.
- Korea's current Public Holidays Act independently defines Seollal and Chuseok as public-holiday periods around lunar 1/1 and lunar 8/15. Because the Visit Seoul business listing names the festivals rather than every adjacent public-holiday date, this slice models only the exact verified festival days and keeps adjacent days, temporary closures and other years behind a visible source re-check warning.

## Behavior
- `NearbyStop` now supports optional exact `closedDates` in addition to fixed `closedWeekdays` and restricted time windows.
- `nearbyStopAvailabilityAt()` evaluates an exact verified closure date before weekly and time-window rules.
- `nearbyRoute()` therefore omits a stop on either a verified weekly closure or exact verified closure date without inventing substitute availability.
- The Gwanghwamun Tourist Information Center records 2026-02-17 and 2026-09-25 as exact closures and carries a 2026-09-11 source-check date.
- The optional Sanity content adapter validates and requests `closedDates`; malformed remote closure dates fail closed to the verified local catalog under the existing all-or-nothing adapter policy.
- Existing local-only deterministic routing, map handoff and privacy boundaries are unchanged. No AI/API inference, payment, auth, credits or client-side CMS behavior is added.

## Discovery decision
Fresh GitHub repository discovery for a Korea holiday-calendar dependency returned no useful candidate through the connected search endpoint. A Hugging Face dataset search for South Korea public-holiday/tourism closures was attempted, but the connected dataset-search action is disabled by server configuration. No inference model is needed for two source-verified exact dates. A small provenance-bound local rule is lower risk than adding a calendar/runtime dependency and avoids claiming broader business closure coverage than the official listing supports.

## Regression contract
`scripts/check-nearby-explorer.mjs` now guards:
- exact closure-date support in the deterministic contract;
- evaluation of `closedDates` before open-window logic;
- the two verified 2026 festival dates and refreshed provenance;
- continued source re-check language for adjacent holidays, temporary closures and future years;
- schema validation and Sanity query parity for `closedDates`;
- continued zero-AI, server-content/client-logic separation, route map handoff and date-aware route omission.

Exact candidate SHA MiniPC CI, merge-SHA CI, production deployment and public Cloudflare/live smoke remain required before this slice is production-complete.
