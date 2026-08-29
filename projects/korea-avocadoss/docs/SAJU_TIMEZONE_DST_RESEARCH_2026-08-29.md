# Saju IANA Timezone / DST Resolution Research — 2026-08-29

## Decision

**ADOPT a zero-dependency `Intl.DateTimeFormat` wall-clock resolver with explicit `unique` / `ambiguous` / `nonexistent` outcomes.** Never silently choose an offset during a repeated hour and never shift a local time through a DST gap.

This slice resolves one Gregorian local wall-clock minute against the runtime IANA timezone database. It is an infrastructure primitive for exact/approximate Saju birth-time handling; it does not yet perform lunar conversion or full Four Pillars calculation.

## Evidence

### NIST DST rules — ADOPT as trusted transition fixture source

NIST documents the modern U.S. rule: daylight saving time starts at 02:00 local on the second Sunday in March, when local time skips to 03:00, and ends at 02:00 local on the first Sunday in November, when local time moves back to 01:00 and that hour repeats.

Source: https://www.nist.gov/pml/time-and-frequency-division/popular-links/daylight-saving-time-dst

Fixture consequences for `America/New_York` in 2024:
- `2024-03-10 02:30` local is **nonexistent**;
- `2024-11-03 01:30` local is **ambiguous** and maps to two real instants;
- a normal winter minute maps to exactly one instant.

NIST notes that U.S. time-zone regulation is formally under the U.S. Department of Transportation; here NIST is used only for the published transition behavior, not as a global IANA database source.

### JavaScript Intl / MDN — ADOPT

MDN documents that `Intl.DateTimeFormat` accepts IANA timezone names such as `America/New_York`, supports an `h23` hour cycle, and that `formatToParts()` exposes year/month/day/hour/minute tokens separately. These APIs are already available in the project's Node/browser baseline and avoid host-local timezone assumptions.

Sources:
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/formatToParts

Implementation consequence: enumerate candidate UTC minutes around the numeric local wall clock, format each candidate into the requested IANA zone, and keep only exact local-component matches.

### `date-fns-tz` — REJECT runtime adoption for this slice

GitHub project: https://github.com/marnusw/date-fns-tz  
License: MIT.

It is maintained, widely used, and itself relies on `Intl` for IANA support. However the current Korea Concierge runtime has no `date-fns` dependency, and adding both peer/runtime surface and bundle/install work does not improve the key product invariant: explicit detection of repeated and missing local wall-clock minutes without an automatic disambiguation choice.

Assessment:
- license: acceptable (MIT);
- maintenance: acceptable;
- provenance: public source, but still an extra dependency;
- privacy/security: no material advantage over direct `Intl`;
- multilingual fit: neutral;
- latency/bundle: worse than zero dependency;
- inference/API cost: none either way;
- product quality: direct resolver is smaller and more auditable for the exact contract.

### `@date-fns/tz` — REJECT runtime adoption for this slice

GitHub project: https://github.com/date-fns/tz (moved into the date-fns monorepo). It is compact and timezone-aware, but still adds an unnecessary dependency for a bounded resolver that can be expressed directly with standardized `Intl` APIs. Re-evaluate only if later calendar arithmetic needs justify the dependency independently.

### Hugging Face — REJECT / unavailable evidence

A fresh Hugging Face model search for timezone/DST ambiguity was attempted through the connected tool, but the runtime returned `Tool model_search not found`. No Hugging Face model or dataset is claimed as evidence. Even if one were available, model inference would be the wrong authority for deterministic timezone conversion because it adds nondeterminism, latency, privacy surface and inference cost without improving IANA-rule correctness.

### Public Threads/web discussions — no adoption evidence

A fresh publicly searchable Threads/web query produced no attributable technical evidence suitable for adoption. Community tips would be hypotheses only and are unnecessary here because official/platform documentation and executable transition fixtures cover the decision.

## Algorithm and product contract

`resolveIanaWallClockMinute(wallClock, timeZone)`:

1. validates Gregorian Y-M-D H:M and the IANA timezone;
2. constructs the same numeric wall clock as a UTC reference without the JavaScript year-0..99 `Date.UTC` legacy remapping;
3. enumerates every UTC minute within ±18 hours;
4. formats each instant into the requested zone using Gregorian/Latin numeric `Intl.DateTimeFormat` with `hourCycle: 'h23'`;
5. keeps only exact Y-M-D H:M matches;
6. returns:
   - zero matches → `nonexistent`;
   - one match → `unique`;
   - two or more → `ambiguous`, with every candidate instant and effective UTC offset.

The ±18-hour enumeration is intentionally conservative and auditable. It performs at most 2,161 formatter evaluations for one wall-clock minute, uses zero network calls, zero AI calls, and sends no birth data off-device/server process. Birth-time resolution is not a high-frequency operation, so correctness and transparent ambiguity handling are preferred over speculative micro-optimization.

## Privacy / security / multilingual / cost

- raw birth date/time remains inside the deterministic calculation layer;
- no AI or external timezone API receives the input;
- IANA identifiers are language-independent and UI localization can be layered separately;
- no package, API, token or paid inference is added;
- malformed dates/zones fail closed;
- ambiguous/nonexistent times are data states, not errors to hide or values to guess.

## Fixture gate

`fixtures/saju/timezone-resolution-fixtures.json` covers:
- New York unique winter minute;
- New York 2024 spring-forward nonexistent minute;
- New York 2024 fall-back ambiguous minute with both offsets;
- Seoul no-DST unique minute.

`scripts/check-saju-timezone-resolution.mjs` transpiles the TypeScript implementation with the existing TypeScript dev dependency and is included in `npm run check:saju`.

## Follow-up

The next integration layer should consume this resolver when an exact/approximate local birth time is converted to a real instant. For `ambiguous`, the product must ask for/derive an explicit disambiguation only from user-known evidence; for `nonexistent`, it should explain that the entered local clock time did not occur under the selected historical timezone rule and request correction. Unknown birth time remains reduced scope and never receives a guessed hour.
