# Saju Deterministic Core & Explainable Personalization Architecture — 2026-08-29

## Decision

**ADOPT a fully deterministic, zero-external-dependency Saju calculation core with explicit exact / approximate / unknown birth-time contracts, IANA timezone/DST integration, invariant vs. candidate branch derivation, element range computation, machine-readable provenance, and a strict PII-stripping narrative payload boundary.**

This layer serves as the authoritative calculation boundary between input data and downstream generative narrative/explanation. The generative AI layer is restricted to explaining deterministic results and cannot mutate, override, or fabricate unverified astrological or astronomical facts.

---

## Evaluation & Discovery Matrix

| Candidate / Technique | Assessment | Rationale & Evidence |
| :--- | :--- | :--- |
| **Discriminated Union Birth Time** (`exact` / `approximate` / `unknown`) | **ADOPT** | Strict compile-time and runtime validation prevents downstream code from silently coercing an unknown or approximate time into an exact clock minute. |
| **IANA / DST Wall-Clock Resolver** (`Intl.DateTimeFormat`) | **ADOPT** | Zero runtime dependencies; leverages ECMAScript standard `Intl`; accurately classifies `unique`, `ambiguous` (fall-back), `nonexistent` (spring-forward gap), and `insufficient-input`. |
| **Five Rats Hour-Stem Formula** (오자둔일법 / 日上起时法) | **ADOPT** | Mathematically exact modular arithmetic (`((dayStemIndex % 5) * 2 + hourBranchIndex) % 10`) verified against centuries of Korean/East Asian cyclical calendar traditions. |
| **Invariant vs. Candidate Branch Derivation** | **ADOPT** | When local clock interval spans multiple double-hours (시진), outputs chronological candidate branches without guessing; when interval falls entirely within one branch, resolves the invariant branch while preserving the `approximate` certainty tag. |
| **Five Elements Range Bounds** (오행 범위) | **ADOPT** | Computes definite baseline elements (3 pillars = 6 characters) plus min..max range bounds for candidate hour additions; strictly bans fabricated percentage scores or decorative precision. |
| **NOAA/GML True Solar Correction** | **ADOPT** | Deterministic Equation of Time + longitude correction with explicit `dayOffset` tracking; requires longitude and does not infer second-level precision from text. |
| **Late-Zi (23:00) Day Boundary Policies** | **ADOPT** | Explicit `midnight`, `jasi`, and `splitJasi` conventions with uncertainty flagging when an approximate interval crosses 23:00 under `jasi`. |
| **Whitelist-Only Narrative Payload Serializer** | **ADOPT** | Drops all raw PII (raw birth date, raw birth time, place label, time zone, longitude, name, account ID) before transfer to generative narrative models. |
| **Third-Party NPM Calculators** (`manseryeok`, `lunar-javascript`) | **REFERENCE / ADAPT** | Used for independent boundary cross-checks (e.g. KASI Ipchun / Jingzhe); not bundled as opaque runtime black boxes to ensure full determinism, privacy, and zero supply-chain risk. |
| **LLM-Based Saju Calculation** | **REJECT** | LLMs are non-deterministic, prone to hallucinating sexagenary cycles, and leak private birth details; calculation belongs exclusively in deterministic code. |
| **Hugging Face Astrological Models** | **REJECT / UNAVAILABLE** | No valid open models exist that outperform deterministic modular arithmetic and official astronomical tables. |

---

## Product Contract & Semantics

### 1. Birth Time Precision & Uncertainty
- `exact`: Exact known minute. Resolves to single hour branch and hour pillar when timezone is unambiguous.
- `approximate`: Local interval `[startHour:startMinute, endHour:endMinute)` on the birth date.
  - If interval falls entirely within one double-hour: resolves the single invariant branch, marked `approximate`.
  - If interval covers multiple double-hours: hour pillar is `undefined` (strictly omitted), candidate branches and candidate hour pillars are listed chronologically, uncertainty code `APPROXIMATE_TIME_MULTI_BRANCH` is set.
  - If interval crosses 23:00 under `jasi` day boundary: day pillar ambiguity is flagged with `DAY_PILLAR_AMBIGUOUS_LATE_ZI`.
- `unknown`: Clock time is unknown (`[00:00, 24:00)`).
  - Hour pillar is strictly `undefined`.
  - All 12 Earthly Branches are candidate branches.
  - Scope is `three-pillars`.
  - Uncertainty code `UNKNOWN_BIRTH_TIME` is set.

### 2. Timezone & DST Semantics
- `unique`: Single UTC instant corresponds to local wall-clock minute.
- `ambiguous`: Multiple UTC instants correspond to local wall-clock minute (DST autumn transition). All candidate instants and UTC offsets are preserved; hour pillar candidates are derived; uncertainty code `DST_AMBIGUOUS_WALL_CLOCK` is set.
- `nonexistent`: Zero UTC instants correspond to local wall-clock minute (DST spring forward gap). Hour pillar is `undefined`, uncertainty code `DST_NONEXISTENT_WALL_CLOCK` is set. Never silently shifted.
- `insufficient-input`: Missing required timezone when clock time is exact or approximate. Fails closed with uncertainty code `TIMEZONE_REQUIRED_FOR_CLOCK`.

### 3. Machine-Readable Provenance & Explainability
Every calculation produces a structured `SajuProvenance` object containing:
- `contractVersion` and `calculationVersion`;
- `inputPrecision`;
- `timezoneResolutionState`;
- `appliedRules` (rule IDs with descriptions and impact);
- `appliedPolicy` (day boundary and solar time mode);
- `resolvedFacts` (human- and machine-readable facts verified by calculation);
- `uncertainFacts` (aspects with multiple candidates or missing data);
- `unavailableReasons` (justifications for omitted fields);
- `candidateDerivations` (derivation trace for all candidate pillars).

### 4. Privacy & Narrative Boundary
`buildSajuNarrativePayload(summary)` enforces:
- Whitelist-only serialization.
- Stripping of `birthDate`, `birthTime`, `placeLabel`, `timeZone`, `longitude`, `name`, `accountId`, and any custom fields.
- Immutability: Generative narrative layers only receive structured tokens (`pillars`, `candidateHourPillars`, `fiveElements`, `uncertaintyCodes`, `provenance`).
