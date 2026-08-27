# Saju deterministic-core research — 2026-08-28

## Goal

Revalidate Step 3A input/privacy contracts and deterministic calculation candidates after the Stitch UI production cutover and Cloudflare incident closure. Community/product examples are treated as hypotheses, not authority.

## Sources checked

### `yhj1024/manseryeok` / npm `manseryeok` 2.0.0

- Public GitHub repository; MIT license.
- TypeScript declarations included; npm metadata reports zero runtime dependencies.
- Current README claims KASI-derived lunar/solar-term data, year pillar at the Ipchun boundary, month pillar at solar-term boundaries, true-solar-time correction, IANA historical timezone/DST handling, and multiple day-boundary conventions.
- The current 2.0.0 changelog explicitly describes breaking correctness fixes around the Ipchun boundary and more precise solar-term handling; that is useful evidence that boundary behavior is exactly where regression fixtures are needed.
- Useful fit for Korea Concierge because the project is already TypeScript and requires Korean convention support.
- **Decision: ADAPT / verify before dependency adoption.** Do not add the package yet. First build trusted fixtures around solar-term boundaries, lunar leap months, 23:00–01:00 day-boundary variants, historical timezone transitions, and true-solar correction. Verify outputs against primary/independent references. A README/changelog claim is not enough to define our expected values.

### `6tail/lunar-javascript`

- MIT JavaScript project, currently independently maintained and still suitable as a secondary implementation cross-check.
- Current package metadata shows version 1.7.7 and no runtime dependency requirement in the published package metadata inspected this run.
- **Decision: REFERENCE ONLY.** It is useful as an independent implementation comparison but should not define Korean-specific conventions by itself.

### Public Saju calculator UX examples

- A currently indexed English-language Saju calculator exposes birthplace/longitude and selectable day-boundary conventions, which supports the need to explain convention choices.
- The same example substitutes noon when birth time is unknown.
- **Decision: REJECT the unknown-time behavior.** Korea Concierge must never fabricate an hour pillar. Unknown time remains an explicit valid state with reduced/ambiguous scope.

### Threads/community search

- A fresh public-web search for Threads discussions around 만세력/자시/진태양시 produced no sufficiently attributable evidence worth adopting in this slice.
- **Decision: NO ADOPTION.** Absence of useful indexed evidence is recorded rather than pretending a community search succeeded.

### Hugging Face

- A fresh Hugging Face dataset search for Korean lunar calendar / Saju / Four Pillars material was attempted through the installed connector.
- The server returned `dataset_search is disabled by server configuration`.
- **Decision: UNAVAILABLE THIS RUN.** No model or dataset is adopted or cited from Hugging Face, and the failure is not treated as evidence that no suitable dataset exists.

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

The repository now separates two fixture classes:

- **Executable contract fixtures**: date validation, exact/approximate/unknown time shape, timezone/longitude requirements, 23:00/00:00/01:00 policy input shape, historical IANA-zone acceptance, and lunar leap-month input shape.
- **Calculation-boundary fixtures**: Ipchun, monthly solar-term transition, day-boundary policy output, true-solar branch-hour crossing, and historical timezone/DST output.

Calculation-boundary fixtures remain `research-pending`. The checker intentionally rejects invented `expectedPillars`, `expectedInstant`, or `verified` fields until the harness is deliberately upgraded with exact expected outputs and at least two evidence classes. This prevents a future dependency from becoming its own oracle.

Important limitation: `lunar-leap-month-shape-only` confirms only that the input contract can represent a leap month. It does **not** claim the requested leap month exists in a particular year. Semantic lunar validity belongs to the future deterministic calendar engine and trusted calendar data.

## Security / privacy / cost

- No remote model is required for Step 3A contracts or the fixture harness.
- No birth PII leaves the deterministic layer in this slice.
- No new runtime dependency is added yet, avoiding supply-chain and bundle-cost expansion until fixtures justify adoption.
- Future library adoption must pin an exact version and preserve the frozen-install policy.

## Next verification slice

Promote calculation-boundary fixtures one class at a time only after trusted expected values exist:

1. Ipchun year-pillar boundary;
2. monthly solar-term boundary;
3. 23:00/00:00/01:00 under each supported day-boundary policy;
4. true-solar longitude correction around a branch-hour boundary;
5. historical timezone/DST cases for foreign visitors;
6. semantic lunar leap-month validity.

Only then evaluate exact-version `manseryeok` against those fixtures and `6tail/lunar-javascript` as a secondary cross-check.
