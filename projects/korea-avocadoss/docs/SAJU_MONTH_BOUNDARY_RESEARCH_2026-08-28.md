# Saju monthly solar-term boundary research — 2026-08-28

## Goal
Promote one Month Pillar boundary only when official astronomical timing and independent implementation evidence agree. This slice does not add a runtime calculator dependency and does not claim second-level precision beyond the source.

## Fresh production preflight
Before this patch, private MiniPC live preflight at `2026-08-27T20:51:09Z` passed all eight no-retry stability samples, sitemap count 36, all 36 P0 routes, canonical/document-language checks, and `failures=0`. The prior Cloudflare incident remains closed unless a sampled 1033/530/502 reappears.

## Official timing — KASI
Korea Astronomy and Space Science Institute 2024 calendar data lists **경칩 (Jingzhe) at 2024-03-05 11:23 KST**. The displayed 24-solar-term table is minute precision, so the stored UTC representation is `2024-03-05T02:23:00Z` with `resolutionSeconds=60` rather than a fabricated exact second.

Canonical source: https://astro.kasi.re.kr/life/post/calendardata

Decision: **ADOPT as primary astronomical timing evidence.**

## Independent implementation evidence

### 6tail/lunar-javascript pinned tests
Pinned test source: https://github.com/6tail/lunar-javascript/blob/4c45a59f79b856125516f31aefa8295035c16afd/__tests__/Lunar.test.js

The test suite distinguishes ordinary date-based Month GanZhi from `getMonthInGanZhiExact()` and demonstrates on solar-term days that the exact Month Pillar remains in the previous month before the Jie crossing and changes after the crossing.

Decision: **ADOPT as independent implementation-test evidence for exact Jie-based month switching.** It remains reference-only for Korea-specific convention choices outside this narrow mechanic.

### Stellium BaZi implementation
Documentation: https://stellium.readthedocs.io/en/latest/cookbooks/bazi.html

Stellium independently states that BaZi month branches follow solar terms rather than Gregorian months and shows the 2024 progression **Feb 10: 丙寅 → Mar 10: 丁卯 → Apr 10: 戊辰**. Its source documentation also describes the Five Tigers formula and exact solar-term engine.

Decision: **ADOPT as a second unrelated implementation example** supporting the 2024 丙寅→丁卯 month progression. It does not replace KASI as the Korean-local timing authority.

## Community / Threads
Fresh indexed searches for Threads discussions around `2024 경칩 사주 월주`, `惊蛰 八字 月柱 丁卯`, and similar combinations returned no attributable Threads result worth adopting.

Decision: **NO ADOPTION.**

## Hugging Face
A fresh dataset search for `bazi four pillars solar terms sexagenary cycle` was attempted through the installed Hugging Face connector. The server returned `dataset_search is disabled by server configuration`.

Decision: **UNAVAILABLE THIS RUN.** No dataset/model is claimed or adopted.

## Evidence-bounded trusted samples
Because KASI exposes the event only to the minute, the fixture deliberately skips the unresolved source minute:

- `2024-03-05 11:22 KST` / `02:22Z` → trusted Month Pillar **丙寅**;
- `2024-03-05 11:23:00–11:23:59 KST` → **explicit unresolved source-resolution window**;
- `2024-03-05 11:24 KST` / `02:24Z` → trusted Month Pillar **丁卯**.

The fixture does not contain full Four Pillars, an `exactBoundarySecond`, or a generic `verified` claim.

## Architecture / supply-chain decision
The monthly trusted evidence lives in a separate `month-boundary-fixtures.json` and a deterministic checker wired into `npm run check:saju`. No runtime package is added. `manseryeok` remains excluded until it can be evaluated against external trusted fixtures rather than validating itself.

## Next verification slice
1. Verify 23:00 / 00:00 / 01:00 outputs under the explicit `midnight`, `jasi`, and `splitJasi` policy variants without treating one school as universal truth.
2. Then verify true-solar longitude/equation-of-time handling around a branch-hour crossing.
3. Then historical IANA timezone/DST and semantic lunar leap-month validity.
