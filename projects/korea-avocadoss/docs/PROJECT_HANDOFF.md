# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-28  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 3 — deterministic/explainable K-Culture core  
**Current production application SHA:** `a63d58a35b5953b45cb434484d2eb3b144d92598`  
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
- legacy app archived under timestamped backup instead of destructively deleted;
- clean reset passed local `/` 308, `/en` 200, stable tunnel PID and 12/12 public probes;
- two subsequent independent 12/12 no-retry stability checks passed with no 1033/530/502;
- fresh pre-patch preflight at `2026-08-27T20:51:09Z` passed **8/8 no-retry stability, sitemap 36 URLs, 36/36 P0 routes, canonical/lang checks, failures=0**;
- post-deploy preflight for `a63d58a35b5953b45cb434484d2eb3b144d92598` at `2026-08-27T20:59:51Z` again passed **8/8 no-retry stability, sitemap 36 URLs, 36/36 P0 routes, canonical/lang checks, failures=0**;
- unrelated Docker connector `n8n-server-cloudflared-1` is a different tunnel and must never be stopped as a Korea repair step.

Retain consecutive public deployment probes, no-retry preflight stability gate, and `Korea Concierge Tunnel Stability Watch`. Any sampled 1033/530/502 reopens reliability priority before product work.

## 3. Existing explainable previews
Stitch UI is production verified. Unsupported numeric certainty was removed before merge.

### Personal Color free preview
May expose actual locally calculated undertone, depth, contrast, analyzer confidence, CIELAB `L*`, and limitations. It must not claim lighting facts it did not measure.

### Hanbok free matcher
`0–100` is a transparent preference-fit rubric, not AI confidence or beauty score: palette 40, mood 25, walking/photo priority 15, backdrop 10, season 10.

Premium Personal Color/Hanbok remains future consented photo-based explainable AI after privacy/provider/cost gates. Before remote photo use: explicit consent, EXIF stripping, file/pixel limits, transient retention, no raw-photo logging, provider retention/ZDR review, server-only secrets, abuse controls, and no sensitive-trait inference.

## 4. Step 3A — input/privacy contracts shipped
Production includes `src/lib/saju/input-contracts.ts`, executable contract checks, and `npm run check:saju` inside the production build.

Shipped contracts:
- Gregorian/lunar birth date shape;
- explicit `exact` / `approximate` / `unknown` birth-time tagged union;
- unknown time is valid reduced scope and **never gets a guessed hour**;
- approximate time is an explicit same-local-date interval in v1;
- exact/approximate local clock time requires IANA timezone;
- true-solar mode additionally requires longitude;
- day-boundary policies: `midnight` / `jasi` / `splitJasi`;
- solar-time policies: `civil` / `true-solar`;
- place labels are display-only once timezone/longitude are resolved;
- narrative payload is whitelist-only derived data and strips raw DOB/time/city/timezone/longitude/name/account identifiers;
- no forced Hanja/name requirement for Four Pillars.

## 5. Deterministic fixture harness
Production contains:
- `fixtures/saju/boundary-fixtures.json`;
- `fixtures/saju/month-boundary-fixtures.json`;
- `scripts/check-saju-boundary-fixtures.mjs`;
- `scripts/check-saju-month-boundary-fixtures.mjs`;
- `npm run check:saju` runs input/privacy contracts plus Year/Month boundary evidence gates.

A dependency README/changelog cannot become its own oracle. Unverified outputs may not contain invented full pillars, generic verified claims, or fake second-level precision.

## 6. Shipped — 2024 Ipchun Year Pillar cross-check
Evidence:
- KASI official 2024 calendar: **입춘 2024-02-04 17:27 KST**, minute precision;
- pinned `6tail/lunar-javascript` tests independently demonstrate exact LiChun-based Year GanZhi switching;
- Stellium independently shows 2024 pre-LiChun **癸卯** and post-LiChun **甲辰**.

Trusted samples:
- 17:26 KST → **癸卯**;
- 17:27:00–17:27:59 KST → explicit source-resolution uncertainty window;
- 17:28 KST → **甲辰**.

## 7. Shipped — 2024 Jingzhe Month Pillar cross-check
PR #17 was exact-head verified, squash-merged and deployed as production SHA `a63d58a35b5953b45cb434484d2eb3b144d92598`.

Production includes:
- `fixtures/saju/month-boundary-fixtures.json`;
- `scripts/check-saju-month-boundary-fixtures.mjs`;
- monthly fixture checker inside `npm run check:saju`;
- `docs/SAJU_MONTH_BOUNDARY_RESEARCH_2026-08-28.md`.

Evidence-bounded result:
- KASI official **경칩 2024-03-05 11:23 KST** / `02:23Z`, minute precision;
- pinned `6tail/lunar-javascript` tests independently show exact Month GanZhi changes at Jie crossing time rather than merely calendar date;
- Stellium independently documents solar-term-based Month Pillars and the 2024 progression **丙寅 in February → 丁卯 in March**;
- trusted pre sample **11:22 KST → 丙寅**;
- **11:23:00–11:23:59 KST remains unresolved at KASI source resolution**;
- trusted post sample **11:24 KST → 丁卯**.

Release evidence:
1. exact branch head `611894b6d7fbbcb1260d620f9344c375b83ff8bd` passed private MiniPC CI including frozen install, i18n, `npm run build`/Saju gates, document-language and legacy redirect checks;
2. PR #17 squash-merged to `a63d58a35b5953b45cb434484d2eb3b144d92598`;
3. exact merged SHA deployment completed with status success through the private root-owned deployment path;
4. post-deploy full preflight passed 8/8 stability + all 36 P0 routes with `failures=0`.

Fresh indexed Threads searches returned no attributable evidence worth adopting. Hugging Face dataset search was attempted but `dataset_search` remains disabled by server configuration. No HF/Threads evidence is claimed.

No runtime Saju calculator dependency was added.

## 8. Deterministic Saju research decisions
- `yhj1024/manseryeok` 2.0.0 remains **ADAPT / verify before adoption**. MIT, TypeScript, zero runtime dependencies, but its own correctness examples cannot validate itself.
- `6tail/lunar-javascript` is a narrow independent cross-check for exact LiChun/Jie boundary mechanics, not universal Korean policy authority.
- Stellium is supporting unrelated implementation evidence, not KASI timing authority.
- KASI remains the primary official timing source.
- public UX that substitutes noon for unknown birth time is rejected.
- lunar leap-month fixture currently verifies representation/shape only.
- no new Saju runtime dependency has been added.

Next trusted-fixture order:
1. 23:00/00:00/01:00 policy outputs;
2. true-solar longitude/equation-of-time branch-hour crossing;
3. historical IANA timezone/DST;
4. semantic lunar leap-month validity;
5. only then pin/evaluate exact `manseryeok` against trusted fixtures.

## 9. Other K-Culture roadmap
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune/Horoscope.

Use deterministic mechanics first where applicable. Tarot randomization is independent of LLM interpretation. Astrology must not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not deterministic prediction or medical/legal/financial/high-impact advice.

## 10. Premium Naming Studio
Target remains a separate premium Korean/Asian naming consultation around USD `$149–150`, not a cheap random-name generator. Return curated Top 3–5 with Hangul, pronunciation/romanization, validated optional Hanja where appropriate, meanings, rationale, Korean naturalness, generation feel, international pronunciation ease, nicknames/pitfalls, and optional traditional Saju/onomastics clearly separated from modern naming quality. Scores require explicit rubric/data. Plan 1–2 refinement rounds.

## 11. Global-first payments
International visitor is the launch payer; Korean domestic checkout is not the first priority. PayPal Checkout remains the leading candidate subject to fresh Korean merchant/policy verification.

Ordinary credit hypotheses: Basic $7.99/120, Advanced $14.99/400, Ultra $24.99/1000, plus one-time Trip Passes/top-ups; no launch subscription.

No production payment exists yet. Before money: auth, server-owned catalog/amounts, immutable/idempotent wallet/service-entitlement ledger, server-side order create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits by itself.

## 12. Real-time translation
Quality-first planned provider remains direct Google `gemini-3.5-live-translate-preview` after auth/wallet/payment. Long-lived key server-only, constrained client credential, no raw audio persistence by default, explicit language selection wins. See `docs/LIVE_TRANSLATION.md`.

## 13. Architecture / CI / release flow
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

Mandatory release flow:
1. fresh repo/live/private-CI preflight;
2. isolated branch;
3. set private `target-ref.txt` to exact 40-character public head SHA;
4. require MiniPC CI green;
5. merge only after green;
6. deploy exact merged SHA via private `deploy-ref.txt`;
7. verify local + consecutive Cloudflare public route;
8. run full live P0 crawl before claiming shipped.

## 14. Security / cost posture
- deterministic/static/cache/rules/browser-local before AI;
- bounded prompts/candidates/history/retries/provider spend;
- no sensitive raw prompt/photo/birth payload in general logs;
- frozen dependency installs and pinned actions;
- prompt instructions separate from untrusted source data;
- payment/wallet server-authoritative;
- place/food facts show source freshness/verification;
- dietary filters are explicit user selection only.

## 15. Current priority order
1. Promote 23:00/00:00/01:00 outputs without treating one day-boundary school as universal truth.
2. Verify true-solar longitude/equation-of-time branch-hour crossing.
3. Verify historical IANA timezone/DST and semantic lunar leap-month validity.
4. Evaluate an exact pinned `manseryeok` only against trusted fixtures.
5. Build foreign-user exact/rough/unknown birth-time UX with minimal location input and no forced Hanja.
6. Continue Step 3B–E explainable Saju → zodiac/astrology → tarot → daily fortune.
7. Step 4 auth + authoritative wallet.
8. Step 5 global USD payment foundation.
9. Then Gemini Live and premium consented photo analysis; continue Premium Naming Studio research when it does not block core dependencies.

## 16. Regression watch
- any reappearance of 1033/530/502 reopens production reliability priority;
- do not inflate Personal Color certainty or turn Hanbok preference fit into fake AI confidence;
- do not send raw birth/photo/name PII to narrative AI;
- do not fabricate missing Saju hour or astrology placements;
- do not treat a library README/changelog/example as authoritative fixture truth;
- do not promote an astronomical minute into a fabricated exact second;
- do not treat lunar leap-month input shape as semantic calendar validity;
- do not invent Hanja for foreign names;
- do not ship checkout before signed webhook/idempotent ledger/refund foundations;
- do not claim production from merge alone.

## 17. User action currently required
**None.** Continue autonomous development. Ask only for merchant/provider credentials, DNS, or a narrowly scoped MiniPC privileged action when it is genuinely the remaining blocker.
