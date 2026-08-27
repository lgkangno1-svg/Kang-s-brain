# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-28  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 3 — deterministic/explainable K-Culture core  
**Current production code SHA:** `52a3aced261979117154286d2a7b9f41aa986c72`  
**Primary CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci` on isolated MiniPC runner

> Source of truth for future AIs/developers. Before every material patch inspect fresh main, recent commits/open PRs, the full project tree, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state, and a fresh live-site preflight. Never infer current state from chat history alone.

## 1. Product contract

Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Explainable personalized services follow:

**result → evidence/data → alternative → uncertainty → action → method/privacy**

Visible numbers must come from measurement, deterministic calculation, verified external facts, or a documented rubric. Do not fabricate decorative precision or expose hidden chain-of-thought.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer nationality, ethnicity, religion, health, attractiveness or another sensitive identity from photo/name/locale/voice.

## 2. Production / Cloudflare status

The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is **closed and monitored**.

Verified remediation/evidence in private CI:

- production app: `korea-concierge.service`, `127.0.0.1:3100`;
- legacy `korea-server.service` removed from active user-systemd configuration by clean reset at `2026-08-27T15:52:42Z`;
- legacy app archived under a timestamped backup instead of destructively deleted;
- clean reset passed local `/` 308, `/en` 200, stable tunnel PID and 12/12 public probes;
- two subsequent independent 12/12 no-retry stability checks passed with no 1033/530/502;
- closure preflight passed 8/8 no-retry probes and all 36 P0 routes with `failures=0`;
- post-Step3A and post-fixture-harness production preflights also completed successfully;
- fresh preflight requested at 2026-08-28 03:53 KST again passed 8/8 stability, sitemap 36 URLs, all 36 P0 routes and `failures=0`;
- unrelated Docker connector `n8n-server-cloudflared-1` is a different tunnel and must never be stopped as a Korea repair step.

Retain hardened gates: consecutive public deployment probes, no-retry preflight stability gate, and scheduled `Korea Concierge Tunnel Stability Watch`. Any sampled 1033/530/502 reopens reliability priority before product work.

## 3. Stitch UI / existing explainable previews

Stitch UI is production verified. PR #11 was corrected before merge so unsupported numeric certainty was removed.

### Personal Color free preview

May expose actual locally calculated undertone, depth, contrast, analyzer confidence, CIELAB `L*`, and limitations. It must not claim lighting facts it did not measure.

### Hanbok free matcher

`0–100` is a transparent preference-fit rubric, not AI confidence or beauty score:

- palette 40;
- mood 25;
- walking/photo priority 15;
- backdrop 10;
- season 10.

Premium Personal Color/Hanbok remains future consented photo-based explainable AI after privacy/provider/cost gates. Before remote photo use: explicit consent, EXIF stripping, file/pixel limits, transient retention, no raw-photo logging, provider retention/ZDR review, server-only secrets, abuse controls, and no sensitive-trait inference.

## 4. Step 3A — input/privacy contracts shipped

PR #12 restored the Saju input/privacy contract layer on top of current Stitch UI main.

Shipped behavior:

- `src/lib/saju/input-contracts.ts`;
- `scripts/check-saju-input-contracts.mjs`;
- `npm run check:saju` is part of `npm run build`;
- Gregorian/lunar birth date shape;
- explicit `exact` / `approximate` / `unknown` birth-time tagged union;
- unknown time is a valid reduced-scope state and **never gets a guessed hour**;
- approximate time is an explicit local interval; v1 rejects silent cross-midnight date shifting;
- exact/approximate local clock time requires IANA timezone;
- true-solar mode additionally requires longitude;
- day-boundary policies: `midnight` / `jasi` / `splitJasi`;
- solar-time policies: `civil` / `true-solar`;
- place labels are display-only once timezone/longitude are resolved;
- narrative payload is whitelist-only derived data and strips raw DOB/time/city/timezone/longitude/name/account identifiers;
- no forced Hanja or name requirement for Four Pillars.

## 5. Step 3A — deterministic boundary fixture harness shipped

PR #13 / production SHA `52a3aced261979117154286d2a7b9f41aa986c72` added:

- `fixtures/saju/boundary-fixtures.json`;
- `scripts/check-saju-boundary-fixtures.mjs`;
- `npm run check:saju` runs input/privacy contract checks plus the boundary fixture harness;
- `docs/SAJU_RESEARCH_2026-08-28.md` records research/evidence decisions.

The harness separates:

1. **Executable contract fixtures** — leap-day validation, exact/approximate/unknown input states, timezone/longitude gates, 23:00/00:00/01:00 policy input shape, historical IANA-zone acceptance, lunar leap-month input shape.
2. **Calculation-boundary fixtures** — Ipchun, monthly solar-term transition, day-boundary output, true-solar hour crossing, historical timezone/DST output.

Unverified calculation outputs may not contain invented `expectedPillars` or generic `verified` claims. A dependency README/changelog cannot become its own oracle.

## 6. Current branch — official 2024 Ipchun astronomical evidence

Branch: `korea-concierge/saju-ipchun-official-evidence`.

Fresh preflight before this branch passed 8/8 no-retry stability probes, sitemap 36 URLs, all 36 P0 routes, `failures=0`.

Fresh research/discovery:

- KASI official 2024 calendar data directly lists **입춘 2024-02-04 17:27 KST**, equivalent to `2024-02-04T08:27:00Z`, minute precision.
- `manseryeok` 2.0.0 independently documents the same instant and before/after pillar examples, but because it remains the candidate dependency under evaluation, its own output is **not** accepted as independent expected-pillar truth.
- `6tail/lunar-javascript` remains secondary/reference-only; fresh search did not produce a sufficiently attributable independent expected-pillar result for this exact boundary in this run.
- indexed Threads search produced no adoptable evidence.
- Hugging Face dataset search was attempted and again disabled by server configuration.

Branch change:

- `ipchun-year-pillar-boundary` advances from `research-pending` to `official-instant-verified`;
- stores direct KASI source, UTC instant, KST local instant and 60-second source resolution;
- checker verifies the UTC/KST records identify the same instant and source is KASI;
- checker still **forbids `expectedPillars` and generic `verified`** until an independent implementation/policy cross-check is completed;
- no runtime dependency or raw birth-data processing is added.

This is intentionally a partial evidence promotion, not a calculator adoption.

Next acceptance gate for this branch:

1. exact branch-head MiniPC CI must pass `npm run build`, including both Saju checks;
2. merge only after exact-head success;
3. deploy exact merged SHA through private deploy controls;
4. require consecutive public health checks and full 36-route P0 preflight.

## 7. Deterministic Saju research decisions

- `yhj1024/manseryeok` 2.0.0 remains **ADAPT / verify before adoption**. MIT, TypeScript, zero runtime dependencies, but prior correctness fixes around Ipchun/solar-term boundaries make external fixtures mandatory.
- `6tail/lunar-javascript` remains **REFERENCE ONLY**, not Korean-specific authority.
- public UX that substitutes noon for unknown birth time is rejected.
- lunar leap-month fixture currently verifies representation/shape only; semantic validity belongs to trusted calendar data/engine.
- no new Saju runtime dependency has been added.

Next trusted-fixture order:

1. independently cross-check the KASI 2024 Ipchun before/after year-pillar result;
2. direct-KASI monthly solar-term boundary + independent cross-check;
3. 23:00/00:00/01:00 policy outputs;
4. true-solar longitude/equation-of-time branch-hour crossing;
5. historical IANA timezone/DST;
6. semantic lunar leap-month validity.

Only then pin/evaluate `manseryeok` against trusted fixtures.

## 8. Other K-Culture roadmap

After deterministic Saju foundations:

- Korean Zodiac;
- Western Zodiac/Astrology;
- Tarot;
- Daily Fortune/Horoscope.

Use deterministic mechanics first where applicable. Tarot randomization is independent of LLM interpretation. Astrology must not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not deterministic prediction or medical/legal/financial/high-impact advice.

## 9. Premium Naming Studio

Target remains a separate premium Korean/Asian naming consultation around USD `$149–150`, not a cheap random-name generator. Use a localized preference questionnaire and return curated Top 3–5 with Hangul, pronunciation/romanization, validated optional Hanja where appropriate, meanings, rationale, Korean naturalness, generation feel, international pronunciation ease, nicknames/pitfalls, and optional traditional Saju/onomastics clearly separated from modern naming quality. Scores require explicit rubric/data. Plan 1–2 refinement rounds.

## 10. Global-first payments

International visitor is the launch payer; Korean domestic checkout is not the first priority. PayPal Checkout remains the leading candidate subject to fresh Korean merchant/policy verification.

Ordinary credit hypotheses:

- Basic: $7.99 / 120 credits
- Advanced: $14.99 / 400 credits
- Ultra: $24.99 / 1000 credits
- one-time Trip Passes/top-ups; no launch subscription

No production payment exists yet. Before money: auth, server-owned catalog/amounts, immutable/idempotent wallet/service-entitlement ledger, server-side order create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits by itself.

## 11. Real-time translation

Quality-first planned provider remains direct Google `gemini-3.5-live-translate-preview` after auth/wallet/payment. Long-lived key server-only, constrained client credential, no raw audio persistence by default, explicit language selection wins. See `docs/LIVE_TRANSLATION.md`.

## 12. Architecture / CI / release flow

- Next.js `16.3.3`, exact `next-intl@4.13.4`;
- 36 canonical P0 public URLs;
- reciprocal hreflang + x-default;
- deterministic 308 legacy redirects;
- static reviewed locale dictionaries;
- private CI repo `lgkangno1-svg/korea-concierge-ci`;
- runner labels `self-hosted, linux, x64, minipc`;
- runner intentionally has no general sudo/Docker privilege;
- public repo must never attach directly to production MiniPC runner;
- production deploy is exact-SHA through limited root-owned helper with local health/rollback and consecutive public checks.

Private CI verification/deployment executes `npm run build`, so project-specific contract gates such as `check:saju` cannot be bypassed by directly calling `next build`.

Mandatory merge/release flow:

1. fresh repo/live/private-CI preflight;
2. isolated branch;
3. set private `target-ref.txt` to exact 40-character public head SHA;
4. require MiniPC CI green;
5. merge only after green;
6. deploy exact desired public SHA via private `deploy-ref.txt`;
7. verify local + consecutive Cloudflare public route;
8. run full live P0 crawl before claiming shipped.

## 13. Security / cost posture

- deterministic/static/cache/rules/browser-local before AI;
- bounded prompts/candidates/history/retries/provider spend;
- no sensitive raw prompt/photo/birth payload in general logs;
- frozen dependency installs and pinned actions;
- prompt instructions separate from untrusted source data;
- payment/wallet server-authoritative;
- place/food facts show source freshness/verification;
- dietary filters are explicit user selection only; Halal-certified != Muslim-friendly.

## 14. Current priority order

1. Validate and ship the official KASI Ipchun evidence-state branch without claiming expected pillars.
2. Complete independent cross-check and only then promote 2024 Ipchun before/after expected year pillars.
3. Promote trusted calculator-boundary fixtures one class at a time.
4. Evaluate an exact pinned `manseryeok` version only against trusted fixtures.
5. Build foreign-user exact/rough/unknown birth-time UX with minimal location input and no forced Hanja.
6. Continue Step 3B–E explainable Saju → zodiac/astrology → tarot → daily fortune.
7. Step 4 auth + authoritative wallet.
8. Step 5 global USD payment foundation.
9. Then Gemini Live and premium consented photo analysis.
10. Continue Premium Naming Studio research when it does not block core dependencies.

## 15. Regression watch

- any reappearance of 1033/530/502 reopens production reliability priority;
- do not convert Hanbok preference fit into fake AI confidence;
- do not inflate Personal Color certainty;
- do not send raw birth/photo/name PII to narrative AI;
- do not fabricate missing Saju hour or astrology placements;
- do not treat a library README/changelog/example as authoritative fixture truth;
- do not promote an official astronomical instant into Saju pillar truth without independent policy/implementation evidence;
- do not treat lunar leap-month input shape as semantic calendar validity;
- do not invent Hanja for foreign names;
- do not ship checkout before signed webhook/idempotent ledger/refund foundations;
- do not claim production from merge alone.

## 16. User action currently required

**None.** Continue autonomous development. Ask only for merchant/provider credentials, DNS, or a narrowly scoped MiniPC privileged action when it is genuinely the remaining blocker.
