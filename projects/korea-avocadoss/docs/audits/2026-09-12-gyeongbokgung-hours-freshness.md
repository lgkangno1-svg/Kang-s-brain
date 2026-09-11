# Gyeongbokgung hours provenance freshness — 2026-09-12

## Scope

Bounded Explore hardening only. No runtime network fetch, AI, CMS, payment, account, geolocation, or route-generation behavior was added.

## Official-source verification

Checked 2026-09-12 against the Royal Palaces and Tombs Center primary pages already linked by the product:

- Hours: https://royal.khs.go.kr/ROYAL/contents/R702000000.do
- Guided tours: https://royal.khs.go.kr/ROYAL/contents/R706010000.do

The official hours page currently confirms Gyeongbokgung regular daytime hours as 09:00–17:00 with 16:00 last admission in Jan–Feb and Nov–Dec, 09:00–18:00 with 17:00 last admission in Mar–May and Sep–Oct, and 09:00–18:30 with 17:30 last admission in Jun–Aug. It also states that operating hours can be shortened or adjusted for institutional circumstances.

The official guided-tour page currently confirms English 11:00/13:30/15:30, Japanese 10:00/14:30, and Chinese 10:30/15:00, subject to operational change.

## Freshness strategy

`GYEONGBOKGUNG_VISIT_FACTS_CHECKED_AT` is refreshed to 2026-09-12 and the source contract now defines a 30-day maximum provenance age. `check-gyeongbokgung-visit-helper.mjs` derives the source age from the actual CI date and fails when the check date is in the future or older than 30 days. This makes a source re-check mandatory before any future green release can continue carrying stale palace hours/tour facts.

This is a release-time freshness gate, not a claim of real-time opening status. The visitor-facing official-source links remain the authoritative handoff for day-of changes.

## Discovery decision

A GitHub discovery search did not identify a maintained dependency that improves this deterministic date-freshness contract over a few local lines. The Hugging Face dataset search endpoint was unavailable in this run (server configuration disabled it). No model/dataset dependency was adopted because model inference would add cost, privacy/supply-chain surface, and no accuracy benefit for a primary-source freshness check.

## Regression contract

The visit-helper check now requires:

- the official seasonal hour and tour values,
- an explicit 30-day maximum source age,
- fail-closed freshness math for future/stale provenance,
- a non-future `checkedAt`,
- `checkedAt` age <= 30 days at CI runtime,
- official source links to remain visible,
- zero runtime `fetch()` and zero precise-location access.
