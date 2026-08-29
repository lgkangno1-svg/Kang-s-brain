# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** Step 3 — deterministic/explainable K-Culture core  
**Current verified production application SHA:** `f386a12bfa34d409aeeb3a3de636476b51102ee8`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, `PRODUCT_MASTER_SPEC.md`, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts or a documented rubric; never decorative precision.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer sensitive identity from photo/name/locale/voice.

Global-first payment direction and premium Naming Studio remain intact. Current browser-local/deterministic Personal Color and Hanbok tools remain free previews; premium photo-aware versions are later consented explainable-AI features after privacy/provider/cost gates.

## 2. Production reliability — FORMALLY CLOSED 2026-08-29
The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is **formally closed** under the user-defined evidence contract. Private CI remains the source of truth and any future sampled 1033/530/502 immediately reopens reliability priority.

Closure evidence:
1. genuine scheduled dedicated Stability Watch run `33130231833`, checked `2026-08-28T00:36:32Z`: local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`;
2. separate genuine scheduled integrated stability/preflight run `33216886289`, checked `2026-08-28T22:27:50Z`: public stability `8/8`, sitemap 36, P0 `36/36`, `failures=0`;
3. closure confirmation run `33227495587`, checked `2026-08-29T01:51:39Z`: local `3/3`, public `12/12`, `public_bad=0`, sitemap 36, P0 `36/36`, `failures=0`.

The second schedule event had not previously been copied into the dedicated closure-evidence file because the stability gate was embedded in the scheduled preflight workflow at that revision. It is a genuine self-hosted `schedule` event with no-retry stability sampling and a full crawl, so it satisfies the contract requiring two separate scheduled stability runs. This was evidence reconciliation, not a weakened gate.

Runtime understanding:
- production is `korea-concierge.service` on `127.0.0.1:3100`;
- Korea tunnel UUID is `da081e8b-8cb3-4503-a8be-c2971f8a2721`, connector `korea-tunnel.service`;
- Docker `n8n-server-cloudflared-1` is unrelated tunnel UUID `08493dd4-8e40-4d5f-bdfd-c9ffa1fbe2b5` and must not be stopped for Korea repair;
- legacy `korea-server.service` dependency was removed during clean reset and the old app archived;
- runner remains without general sudo/Docker rights.

Keep the private 10-minute stability workflow, no-retry full preflight and consecutive deploy probes. GitHub schedule delivery was independently inconsistent during recovery; that remains a CI-monitoring concern, not an open production-tunnel incident.

## 3. Existing explainable previews
Personal Color free preview may expose locally calculated undertone/depth/contrast/analyzer confidence/CIELAB values with limitations. Hanbok free matcher uses a transparent preference-fit rubric, not AI confidence or beauty scoring. Premium Personal Color/Hanbok remains future consented photo-based explainable AI.

## 4. Step 3A production-verified foundations
Production includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone required for exact/approximate local clock; longitude additionally required for true-solar mode;
- whitelist-only narrative payloads that strip raw DOB/time/city/timezone/longitude/name/account identifiers;
- explicit `midnight` / `jasi` / `splitJasi` day-boundary policies;
- explicit `civil` / `true-solar` policy;
- trusted 2024 Ipchun Year Pillar boundary samples outside KASI's unresolved source minute: 17:26 KST → 癸卯, 17:28 → 甲辰;
- trusted 2024 Jingzhe Month Pillar boundary samples: 11:22 KST → 丙寅, 11:24 → 丁卯;
- executable 23:00 / 00:00 / 01:00 late-Zi policy semantics;
- deterministic NOAA/GML Equation-of-Time + longitude/timezone true-solar correction with explicit `dayOffset`;
- historical IANA local wall-clock resolution with explicit `unique` / `ambiguous` / `nonexistent` states;
- `npm run check:saju` as a production build gate;
- no runtime Saju calculator dependency.

### Historical IANA timezone / DST slice — SHIPPED
Files:
- `src/lib/saju/timezone-resolution.ts`;
- `fixtures/saju/timezone-resolution-fixtures.json`;
- `scripts/check-saju-timezone-resolution.mjs`;
- `docs/SAJU_TIMEZONE_DST_RESEARCH_2026-08-29.md`.

Contract:
- one Gregorian local wall-clock minute + IANA timezone resolves to `unique`, `ambiguous` or `nonexistent`;
- ambiguous repeated hours return every candidate instant/UTC offset and never silently choose earlier/later;
- nonexistent DST-gap minutes are not shifted to a nearby valid time;
- zero network, zero AI, zero new runtime dependency; platform `Intl.DateTimeFormat` IANA data only;
- NIST 2024 New York spring-gap/fall-repeat fixtures plus Seoul no-DST control;
- raw birth data remains inside deterministic calculation.

Research posture:
- NIST DST transition behavior: **ADOPT** as trusted U.S. transition fixture source;
- standardized `Intl.DateTimeFormat` + `formatToParts`: **ADOPT**;
- `date-fns-tz` / `@date-fns/tz`: **REJECT** for this bounded slice — acceptable open-source candidates but unnecessary dependency/bundle surface without a correctness advantage for explicit ambiguity detection;
- Hugging Face connected model search returned `Tool model_search not found`; no HF evidence claimed, and model inference is inappropriate authority for deterministic timezone conversion;
- public Threads/web search produced no attributable adoption evidence.

Release evidence:
1. exact branch head `3689543f424988278b0fccaa3d7230dd0d5d6286` passed private MiniPC CI run `33227699521`, including deterministic Saju gates, production build, document-language and redirect checks;
2. PR #23 squash-merged to exact public SHA `f386a12bfa34d409aeeb3a3de636476b51102ee8`;
3. private deploy run `33227742620` successfully deployed that exact merged SHA and passed its local/public cutover checks;
4. post-deploy full preflight run `33227809379`, checked `2026-08-29T02:00:20Z`, passed local `3/3`, public `12/12`, bad codes `none`, sitemap 36, P0 `36/36`, `failures=0`.

## 5. Remaining Step 3A order
1. Integrate the IANA/DST resolver into exact/approximate birth-time instant conversion and foreign-user ambiguity/gap UX.
2. Semantic lunar leap-month validity against trusted calendar data.
3. Evaluate an exact pinned `manseryeok` candidate only against already trusted fixtures.
4. Beginner foreign-user exact/rough/unknown-time UX with minimal location input.
5. Deterministic full/reduced-scope chart output; unknown time returns reduced scope rather than guessed hour.
6. Integrate true-solar `dayOffset` with selected day-boundary convention without collapsing policy differences.

## 6. Later K-Culture roadmap
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot randomization is independent of LLM interpretation. Astrology may not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not deterministic prediction or medical/legal/financial/high-impact advice.

## 7. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 8. Global-first payments
International visitor is the launch payer. PayPal Checkout remains leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet. Before money: auth, server-owned catalog/amounts, immutable/idempotent wallet/service-entitlement ledger, server-side create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 9. Architecture / release flow
Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects, frozen dependency installs. Public repo never attaches directly to production runner.

Mandatory release flow: fresh repo/live/private-CI preflight → isolated branch → private `target-ref.txt` exact 40-char branch head → MiniPC CI green → merge → private `deploy-ref.txt` exact merged SHA → local + consecutive public checks → full sitemap/P0 crawl.

## 10. Regression watch
Never weaken reliability gates, fabricate Saju hours/astrology placements, turn a convention choice into a confidence percentage, overstate source precision, send raw birth/photo/name PII to narrative AI, let a candidate library validate itself, infer lunar leap-month validity from shape alone, invent Hanja for foreign names, or ship checkout before signed-webhook/idempotent-ledger/refund foundations.

For timezone handling specifically, never auto-pick an ambiguous DST offset or auto-shift a nonexistent local time.

## 11. User action currently required
**None.** Continue autonomously. Ask only for merchant/provider credentials, DNS, or a narrowly scoped privileged MiniPC action when it is genuinely the final blocker.
