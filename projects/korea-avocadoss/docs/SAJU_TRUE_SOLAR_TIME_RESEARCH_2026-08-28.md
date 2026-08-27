# Saju true-solar-time research — 2026-08-28

## Decision

**ADOPT** a small deterministic implementation of the NOAA/GML published Equation of Time approximation plus the longitude/timezone correction. Keep `civil` and `true-solar` as explicit user-visible calculation conventions. Do **not** add a new runtime astronomy or Saju dependency for this slice.

The deterministic conversion is:

`true solar offset minutes = Equation of Time + 4 × longitude(deg east) − effective UTC offset minutes`

The effective UTC offset must be resolved for the actual birth instant. Historical IANA/DST resolution is deliberately the next fixture slice; this module accepts that resolved offset and never guesses it.

## Official / primary technical evidence

### NOAA Global Monitoring Laboratory — ADOPT
Source: https://gml.noaa.gov/grad/solcalc/solareqns.PDF

NOAA/GML publishes both the fractional-year Equation of Time approximation and:

`time_offset = eqtime + 4*longitude - 60*timezone`

with longitude positive east and timezone expressed as hours from UTC. This is the direct algorithm implemented in `src/lib/saju/true-solar-time.ts`.

Caveat: NOAA now labels its web solar calculator as no longer actively maintained. The formula PDF remains a transparent, reproducible algorithm rather than a network dependency. We therefore vendor the tiny formula with provenance instead of calling the calculator at runtime.

### U.S. Naval Observatory — ADOPT as independent definition/sign check
Source: https://aa.usno.navy.mil/faq/eqtime

USNO defines Equation of Time as **apparent solar time minus mean solar time**, explains that its magnitude can reach about 16 minutes, and notes the additional constant longitude offset when civil time is not kept on the local time-zone meridian. This independently supports the sign and conceptual decomposition used by the NOAA formula.

## Product/community implementation discovery

### Fortune Cloud BaZi true-solar explainer — ADAPT as independent magnitude/boundary cross-check
Source: https://fortunecloud.co/en/learn/true-solar-time

Its worked Singapore example uses 09:10 on June 15 and reports true solar time at about 08:05, changing the hour branch from Si to Chen. Our deterministic NOAA fixture for Singapore 1998-06-15 09:10 produces about 08:05:17 and the same branch crossing. We use this only as an independent product-level cross-check, not as astronomical authority.

### Gwiraedang Saju true-solar calculator — ADAPT as convention evidence
Source: https://gwirae.com/en/true-solar-time

This implementation explicitly applies longitude correction but deliberately omits Equation of Time to match its chosen manseryeok convention. That disagreement is useful evidence that Saju practice is not uniform. Korea Concierge therefore must disclose the method and preserve `civil` versus `true-solar` choices rather than label a school preference as objective confidence.

### BaZiFlow / BaZi Lab / InsightBaZi / OpenFate — ADAPT as hypothesis support only
Sources:
- https://baziflow.com/bazi/true-solar-time-calculator
- https://www.bazi-lab.com/true-solar-time
- https://www.insightbazi.com/en/knowledge/true-solar-time-bazi
- https://wiki.openfate.ai/en/bazi/calendar/equation-of-time

These independently describe the same longitude + Equation-of-Time decomposition, but are commercial/editorial sources. They are useful corroboration and UX inspiration, not calibration truth.

## GitHub discovery

A fresh GitHub code search for the NOAA coefficient sequence and BaZi/true-solar implementations returned scattered astrology/I-Ching repositories and framework documents, but no candidate with better provenance, maintenance, licensing clarity, bundle economics or test evidence than implementing the official formula directly.

**REJECT runtime dependency adoption for this slice.** Reasons:
- provenance: official formula is directly available;
- license: no third-party runtime license needed;
- maintenance: ~40 lines of deterministic math is easier to audit than a dependency tree;
- privacy/security: entirely local computation, no birth data leaves the process;
- multilingual fit: language-neutral numeric layer;
- latency/bundle: negligible CPU and zero added bundle dependency;
- inference cost/margin: zero AI/network cost;
- quality: behavior is fixture-locked and source-disclosed.

## Hugging Face discovery

A fresh Hugging Face model search was attempted for `BaZi Four Pillars solar time`. The installed Hugging Face connector returned `Tool model_search not found` at execution time, so **no HF model evidence is claimed**. This does not block the deterministic astronomy slice because no ML model is appropriate or needed for the conversion.

## Threads / public-discussion discovery

Fresh publicly searchable Threads queries for BaZi true-solar time / longitude / Equation of Time produced no attributable Threads result suitable for adoption. Broader web discussion did surface multiple BaZi calculators, recorded above. **No Threads claim is adopted.**

## Fixture strategy

`fixtures/saju/true-solar-time-fixtures.json` covers:
1. Singapore 1998-06-15 09:10, a community-corroborated Si → Chen boundary crossing;
2. Seoul 2024-03-03 11:30, where longitude + negative EoT moves Wu → Si;
3. Greenwich 2024-11-03 12:00, isolating a positive Equation-of-Time contribution with zero longitude-zone correction;
4. Seoul 2024-03-03 00:20, proving that the corrected solar clock can move to the previous civil date and that `dayOffset` must not be silently discarded.

The checker validates the production TypeScript directly through TypeScript transpilation. Numeric fixtures are deterministic; cultural claims are kept separate from the astronomical calculation.

## Security / privacy / cost

No network call, AI model, geocoder, city name, raw birth identity or credential is needed in the formula layer. Only date, wall-clock time, longitude and an already-resolved UTC offset enter the function. Narrative AI must continue receiving derived whitelist-only Saju data, never these raw inputs.

## Remaining gate

This slice does **not** yet resolve an IANA zone to the historically correct UTC offset for ambiguous/nonexistent wall times. The next Step 3A slice must fixture a real historical DST/timezone case before the true-solar path is connected to full chart calculation.
