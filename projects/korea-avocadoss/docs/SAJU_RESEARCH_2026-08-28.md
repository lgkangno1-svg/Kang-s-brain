# Saju deterministic-core research — 2026-08-28

## Goal

Revalidate Step 3A input/privacy contracts and deterministic calculation candidates after the Stitch UI production cutover and Cloudflare incident closure. Community/product examples are treated as hypotheses, not authority.

## Sources checked

### Korea Astronomy and Space Science Institute (KASI) calendar data

- KASI's official 2024 calendar data lists **입춘 (Ipchun) at 2024-02-04 17:27 KST**, minute precision.
- Canonical source: `https://astro.kasi.re.kr/life/post/calendardata` (2024 월력요항 / 24절기 table).
- This converts to `2024-02-04T08:27:00Z` and is safe to store as an **official astronomical boundary instant**.
- This source does **not by itself define a Saju year-pillar output**. Korea Concierge therefore records the instant but deliberately leaves `expectedPillars` absent until a genuinely independent implementation/policy cross-check is completed.
- **Decision: ADOPT as astronomical evidence, not as full calculator truth.** This is the first calculation-boundary fixture promoted beyond `research-pending` without weakening the anti-self-oracle gate.

### `yhj1024/manseryeok` / npm `manseryeok` 2.0.0

- Public GitHub repository; MIT license.
- TypeScript declarations included; npm metadata reports zero runtime dependencies.
- Current README claims KASI-derived lunar/solar-term data, year pillar at the Ipchun boundary, month pillar at solar-term boundaries, true-solar-time correction, IANA historical timezone/DST handling, and multiple day-boundary conventions.
- The current 2.0.0 changelog explicitly describes breaking correctness fixes around the Ipchun boundary and gives the same 2024 `17:27 KST` boundary, including 17:26→계묘 and 17:28→갑진 examples.
- Because `manseryeok` is still the dependency candidate under evaluation, its own changelog cannot serve as the independent oracle for expected output fixtures.
- **Decision: ADAPT / verify before dependency adoption.** Do not add the package yet.

### `6tail/lunar-javascript`

- MIT JavaScript project and suitable as a secondary implementation cross-check.
- It remains useful for astronomical/calendar comparison but is not Korean-specific authority for policy choices such as day-boundary conventions.
- Fresh public search did not surface an attributable standalone 2024 Ipchun output from this implementation that could be accepted as an independent expected-pillar oracle in this run.
- **Decision: REFERENCE ONLY.** Do not promote expected Saju pillars from it yet.

### Other public implementations / calculator examples

- Fresh discovery found additional Korean-style manseryeok projects and public calculators. They reinforce that Ipchun/solar-term boundaries are common implementation concerns, but provenance and convention quality vary.
- A public calculator table independently displays 2024 Ipchun as 02-04 17:27 KST, citing astronomical almanac material. This is supportive evidence but is still secondary to the direct KASI source.
- **Decision: SUPPORTING ONLY.** Do not use anonymous calculator output as the authoritative expected pillar.

### Threads/community search

- Fresh public-web searches for indexed Threads discussions around 만세력/입춘/절기 returned no reliable attributable evidence worth adopting.
- **Decision: NO ADOPTION.**

### Hugging Face

- A fresh dataset search for Korean calendar/Saju/Four Pillars data was attempted through the installed Hugging Face connector.
- The server again returned `dataset_search is disabled by server configuration`.
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

The harness now supports an intermediate evidence state: `official-instant-verified`. It may store a primary-source astronomical instant plus provenance and resolution, but it still forbids `expectedPillars` and a generic `verified` claim. This allows evidence to accumulate without pretending the candidate calculation library has already been independently validated.

Current promoted evidence:

- `ipchun-year-pillar-boundary`: KASI official 2024 Ipchun instant `2024-02-04 17:27 KST` / `2024-02-04T08:27:00Z`, one-minute resolution.
- Expected year-pillar outputs before/after the instant remain intentionally absent pending independent implementation/policy cross-check.

Important limitation: `lunar-leap-month-shape-only` confirms only that the input contract can represent a leap month. It does **not** claim the requested leap month exists in a particular year. Semantic lunar validity belongs to the future deterministic calendar engine and trusted calendar data.

## Security / privacy / cost

- No remote model is required for Step 3A contracts or the fixture harness.
- No birth PII leaves the deterministic layer in this slice.
- No new runtime dependency is added yet, avoiding supply-chain and bundle-cost expansion until fixtures justify adoption.
- Future library adoption must pin an exact version and preserve the frozen-install policy.

## Next verification slice

1. Complete an independent implementation/policy cross-check for the 2024 Ipchun before/after year-pillar output; only then add `expectedPillars`.
2. Promote a monthly solar-term boundary from direct KASI timing plus independent cross-check.
3. Verify 23:00/00:00/01:00 under each supported day-boundary policy without treating any school as universal truth.
4. Verify true-solar longitude/equation-of-time handling around a branch-hour boundary.
5. Verify historical timezone/DST cases for foreign visitors against IANA evidence.
6. Verify semantic lunar leap-month validity against trusted calendar data.

Only after trusted calculator outputs exist should an exact pinned `manseryeok` version be evaluated against them, with `6tail/lunar-javascript` as secondary evidence rather than authority.
