# Saju deterministic-core research — 2026-08-28

## Goal

Revalidate Step 3A input/privacy contracts and deterministic calculation candidates after the Stitch UI production cutover and Cloudflare incident closure. Community/product examples are treated as hypotheses, not authority. Evidence is promoted in layers: official astronomical time first, then independent implementation/policy cross-checks, then only the narrow calculator outputs actually supported by those sources.

## Sources checked

### Korea Astronomy and Space Science Institute (KASI) calendar data

- KASI's official 2024 calendar data lists **입춘 (Ipchun) at 2024-02-04 17:27 KST**, minute precision.
- Canonical source: `https://astro.kasi.re.kr/life/post/calendardata` (2024 월력요항 / 24절기 table).
- This converts to `2024-02-04T08:27:00Z` and is safe to store as an **official astronomical boundary minute**.
- KASI also labels the adjacent calendar cycles as **2023 계묘년** and **2024 갑진년**.
- Critical precision rule: KASI's displayed table resolves the event to a minute, not a second. Korea Concierge therefore does **not** invent an exact second inside 17:27 KST.
- **Decision: ADOPT as primary astronomical/cycle-label evidence.**

### `yhj1024/manseryeok` / npm `manseryeok` 2.0.0

- Public GitHub repository; MIT license.
- TypeScript declarations included; npm metadata reports zero runtime dependencies.
- Current README/changelog claims KASI-derived solar-term data and an Ipchun year-pillar boundary, including 2024 examples around the same minute.
- Because `manseryeok` is still the dependency candidate under evaluation, its own output cannot serve as the independent oracle used to approve that dependency.
- **Decision: ADAPT / verify before dependency adoption. Do not add the package yet.**

### `6tail/lunar-javascript` independent implementation tests

- MIT JavaScript project; independent from the candidate `manseryeok` package.
- Pinned public test evidence: `https://github.com/6tail/lunar-javascript/blob/4c45a59f79b856125516f31aefa8295035c16afd/__tests__/Lunar.test.js`.
- Its tests explicitly distinguish ordinary lunar-year GanZhi, a LiChun-based year, and an exact LiChun-based year. Around the 2020 boundary they verify that the exact year pillar remains the previous cycle before the solar-term instant and switches after it, even though Lunar New Year has already occurred.
- This does not make the library a Korean-specific authority for all Saju conventions, but it is useful independent implementation evidence for the narrow year-boundary mechanic.
- **Decision: ADOPT as independent implementation cross-check for Year Pillar boundary mechanics only. REFERENCE ONLY for broader policy.**

### Stellium BaZi implementation documentation

- Public implementation documentation: `https://stellium.readthedocs.io/en/latest/cookbooks/bazi.html`.
- Its BaZi cookbook independently documents a 2024 pre-LiChun sample as **癸卯** and a post-LiChun sample as **甲辰**, explicitly separating the solar-year boundary from January 1.
- It does not independently establish KASI's Korean-local exact minute, so it is combined with KASI rather than used as a timing oracle.
- **Decision: ADOPT as a second, unrelated implementation example for the 2024 cycle labels across LiChun.**

### Other public BaZi/Saju pages

- Fresh public search continues to show broad agreement that the Year Pillar uses LiChun rather than Lunar New Year.
- One practitioner page publishes a second/minute value differing slightly from KASI, which reinforces why Korea Concierge must prefer KASI for the astronomical boundary and must not infer second-level precision from secondary pages.
- **Decision: SUPPORTING ONLY. KASI wins on timing.**

### Threads/community search

- Fresh indexed searches for Threads discussions around 입춘/연주/사주 returned no attributable evidence worth adopting.
- **Decision: NO ADOPTION.**

### Hugging Face

- A fresh dataset search for `bazi four pillars sexagenary solar terms` was attempted through the installed Hugging Face connector.
- The server returned `dataset_search is disabled by server configuration`.
- **Decision: UNAVAILABLE THIS RUN.** No HF dataset/model is claimed or adopted.

## Contract decisions retained

1. Birth time is a tagged union: `exact`, `approximate`, or `unknown`.
2. Unknown time spans the full local day for deterministic ambiguity handling; it is never replaced with noon or another guessed hour.
3. Exact/approximate local clock input requires an IANA timezone for globally correct instant mapping.
4. True-solar mode additionally requires longitude; a city label itself is not sent to the narrative layer.
5. Approximate intervals must stay within one stated local birth date in v1; cross-midnight ambiguity is rejected rather than silently shifting the date.
6. Day-boundary and solar-time conventions are explicit calculation policy, not hidden model behavior.
7. Narrative AI receives only a whitelist of derived pillars/elements/uncertainty/policy and never raw DOB, clock time, city, timezone, longitude, name, or account ID.
8. Static/deterministic calculation precedes any narrative interpretation.

## Fixture-harness decision

The repository separates two fixture classes:

- **Executable contract fixtures**: date validation, exact/approximate/unknown time shape, timezone/longitude requirements, 23:00/00:00/01:00 policy input shape, historical IANA-zone acceptance, and lunar leap-month input shape.
- **Calculation-boundary fixtures**: Ipchun, monthly solar-term transition, day-boundary policy output, true-solar branch-hour crossing, and historical timezone/DST output.

### 2024 Ipchun promotion

`ipchun-year-pillar-boundary` is promoted to `year-pillar-cross-checked`, but only with evidence-bounded samples:

- KASI official boundary minute: `2024-02-04 17:27 KST` / `2024-02-04T08:27:00Z`, 60-second published resolution.
- Trusted pre-boundary sample: **17:26 KST → 癸卯**.
- Trusted post-boundary sample: **17:28 KST → 甲辰**.
- **17:27:00–17:27:59 KST remains an explicit source-resolution uncertainty window**. The fixture does not claim an exact cutover second.
- Full `expectedPillars`, generic `verified`, and any exact second remain forbidden.

Why this is now acceptable: KASI provides the official minute and adjacent cycle labels; `6tail/lunar-javascript` independently verifies exact LiChun-based year switching as a distinct mechanic; Stellium independently reports 2024 pre/post-LiChun as 癸卯/甲辰. None of these sources is the candidate `manseryeok` package being evaluated.

Important limitation: `lunar-leap-month-shape-only` still confirms only that the input contract can represent a leap month. It does **not** claim the requested leap month exists in a particular year.

## Security / privacy / cost

- No remote model is required for Step 3A contracts or the fixture harness.
- No birth PII leaves the deterministic layer in this slice.
- No new runtime dependency is added yet, avoiding supply-chain and bundle-cost expansion until fixtures justify adoption.
- Future library adoption must pin an exact version and preserve the frozen-install policy.

## Next verification slice

1. Promote a monthly solar-term boundary from direct KASI timing plus an independent implementation cross-check, using the same source-resolution discipline.
2. Verify 23:00/00:00/01:00 under each supported day-boundary policy without treating any school as universal truth.
3. Verify true-solar longitude/equation-of-time handling around a branch-hour boundary.
4. Verify historical timezone/DST cases for foreign visitors against IANA evidence.
5. Verify semantic lunar leap-month validity against trusted calendar data.
6. Only after these trusted outputs exist, pin an exact `manseryeok` candidate and evaluate it against the fixture suite rather than letting the dependency define its own tests.
