# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** sellable-MVP acceleration + Step 3 deterministic/explainable K-Culture in parallel  
**Current verified production application SHA:** `77709081961d3aae570cd7b94c6838c7072c4841`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, `PRODUCT_MASTER_SPEC.md`, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts or a documented rubric; never decorative precision.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer sensitive identity from photo/name/locale/voice.

Global-first payment direction and premium Naming Studio remain intact. Current browser-local/deterministic Personal Color and Hanbok tools remain free previews; premium photo-aware versions are later consented explainable-AI features after privacy/provider/cost gates. Paid-MVP foundations progress in parallel with Step 3 so research-only work does not block a sellable customer journey.

## 2. Production reliability — FORMALLY CLOSED 2026-08-29
The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is **formally closed** under the user-defined evidence contract. Private CI remains the source of truth and any future sampled 1033/530/502 immediately reopens reliability priority.

Closure evidence:
1. genuine scheduled dedicated Stability Watch run `33130231833`, checked `2026-08-28T00:36:32Z`: local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`;
2. separate genuine scheduled integrated stability/preflight run `33216886289`, checked `2026-08-28T22:27:50Z`: public stability `8/8`, sitemap 36, P0 `36/36`, `failures=0`;
3. closure confirmation run `33227495587`, checked `2026-08-29T01:51:39Z`: local `3/3`, public `12/12`, `public_bad=0`, sitemap 36, P0 `36/36`, `failures=0`.

Runtime understanding:
- production is `korea-concierge.service` on `127.0.0.1:3100`;
- Korea tunnel UUID is `da081e8b-8cb3-4503-a8be-c2971f8a2721`, connector `korea-tunnel.service`;
- Docker `n8n-server-cloudflared-1` is unrelated tunnel UUID `08493dd4-8e40-4d5f-bdfd-c9ffa1fbe2b5` and must not be stopped for Korea repair;
- runner remains without general sudo/Docker rights.

Keep the private 10-minute stability workflow, no-retry full preflight and consecutive deploy probes. GitHub schedule delivery inconsistency during recovery remains a CI-monitoring concern, not an open production-tunnel incident.

Fresh pre-patch autonomous preflight run `33229989850`, checked `2026-08-29T02:52:03Z`, passed local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`, sitemap 36, P0 `36/36`, `failures=0` before the credit-authorization slice began.

## 3. Existing explainable previews / UI isolation
Personal Color free preview remains browser-local/private. Hanbok free matcher remains deterministic and explainable. Premium Personal Color/Hanbok remains future consented photo-based explainable AI.

A separate `korea-concierge/stitch-ui-system` branch exists, so backend/core work must not casually overwrite its UI surface. Reconcile it deliberately before the next visual slice.

## 4. Step 3A production-verified foundations
Production includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone required for exact/approximate local clock; longitude additionally required for true-solar mode;
- whitelist-only narrative payloads that strip raw DOB/time/city/timezone/longitude/name/account identifiers;
- explicit `midnight` / `jasi` / `splitJasi` day-boundary policies;
- explicit `civil` / `true-solar` policy;
- trusted 2024 Ipchun and Jingzhe boundary fixtures outside unresolved official source minutes;
- executable late-Zi policy semantics;
- deterministic NOAA/GML Equation-of-Time + longitude/timezone true-solar correction with explicit `dayOffset`;
- historical IANA local wall-clock resolution with explicit `unique` / `ambiguous` / `nonexistent` states;
- `npm run check:saju` as a production build gate;
- no runtime Saju calculator dependency.

Historical IANA/DST release:
- files: `src/lib/saju/timezone-resolution.ts`, `fixtures/saju/timezone-resolution-fixtures.json`, `scripts/check-saju-timezone-resolution.mjs`, `docs/SAJU_TIMEZONE_DST_RESEARCH_2026-08-29.md`;
- exact branch head `3689543f424988278b0fccaa3d7230dd0d5d6286` passed private MiniPC CI run `33227699521`;
- PR #23 merged to `f386a12bfa34d409aeeb3a3de636476b51102ee8`;
- deploy run `33227742620` and post-deploy preflight `33227809379` passed local/public/P0 gates.

## 5. Authoritative wallet / credits — DOMAIN FOUNDATION SHIPPED
Production includes:
- `src/lib/credits/ledger.ts`;
- `scripts/check-credit-ledger.mjs`;
- `docs/WALLET_LEDGER_RESEARCH_2026-08-29.md`;
- `npm run check:credits-ledger` in the production build gate.

Shipped domain invariants:
- positive safe-integer credits only;
- append-only entries with available/reserved/spent reconciliation;
- no negative balance;
- reserve/capture/release/refund amount bounds;
- same idempotency key + same request replays without another mutation;
- same key + different request fails closed;
- capture usage ID must match reservation usage ID.

Release evidence:
1. exact branch head `6f5f4bb68646996cccc1260c1f1ff9d653e66909` passed private MiniPC CI run `33228057275`;
2. PR #26 merged to production code SHA `77709081961d3aae570cd7b94c6838c7072c4841`;
3. deploy run `33228113628` passed secure cutover + consecutive public probes;
4. post-deploy full preflight `33228193627` passed local `3/3`, public `12/12`, sitemap 36, P0 `36/36`, failures `0`.

### Credit authorization boundary — CURRENT REVIEWABLE SLICE
Branch: `korea/credit-authorization-boundary-20260829`.

Files added/changed:
- `src/lib/credits/authorization.ts`;
- `scripts/check-credit-authorization.mjs`;
- `docs/CREDIT_AUTHORIZATION_RESEARCH_2026-08-29.md`;
- `package.json` extends `check:credits-ledger` to execute the authorization gate.

Contract under verification:
- account actors may reserve credits only for their own wallet;
- `verified_payment` grants require a `payment_webhook` system actor;
- `promotion` grants require `promotion_service`;
- `admin` grants require `support_admin`;
- capture/release/refund require `feature_executor` or `support_admin` system authority;
- system actors require a non-empty audit identifier;
- browser/account actors cannot grant, capture, release or refund credits.

Research posture (`docs/CREDIT_AUTHORIZATION_RESEARCH_2026-08-29.md`):
- PostgreSQL transaction/row-lock principles: **ADOPT for upcoming persistence slice**;
- provider idempotency semantics: **ADAPT**, never a replacement for wallet-domain idempotency;
- new third-party runtime wallet dependency: **REJECT**;
- Hugging Face model use for financial/credit authority: **REJECT**;
- public Threads/web community material: no attributable implementation-grade evidence adopted.

This slice intentionally does **not** claim database persistence, session verification, provider webhook verification or real-money readiness. Those remain subsequent gates.

### Next wallet gates after this slice
1. immutable transactional persistence rows and account/wallet ownership storage;
2. unique database idempotency constraint;
3. atomic reserve/capture/release/refund transactions with deterministic lock ordering/concurrency tests;
4. authenticated server session → account principal binding and audit telemetry;
5. provider server create/capture + verified signed webhook + replay protection + monetary refund/reversal.

No browser-reported success may grant credits.

## 6. Remaining Step 3A order
1. Integrate the IANA/DST resolver into exact/approximate birth-time instant conversion and foreign-user ambiguity/gap UX.
2. Semantic lunar leap-month validity against trusted calendar data.
3. Evaluate an exact pinned `manseryeok` candidate only against already trusted fixtures.
4. Beginner foreign-user exact/rough/unknown-time UX with minimal location input.
5. Deterministic full/reduced-scope chart output; unknown time returns reduced scope rather than guessed hour.
6. Integrate true-solar `dayOffset` with selected day-boundary convention without collapsing policy differences.

Step 3 remains an active correctness lane but must not monopolize implementation while the sellable Hanbok/credits/payment loop is incomplete.

## 7. Later K-Culture roadmap
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot randomization is independent of LLM interpretation. Astrology may not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not deterministic prediction or medical/legal/financial/high-impact advice.

## 8. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 9. Global-first payments
International visitor is the launch payer. PayPal Checkout remains a leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet. Before money: auth/account ownership, server-owned catalog/amounts, immutable/idempotent wallet/service-entitlement ledger, server-side create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 10. Architecture / release flow
Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects, frozen dependency installs. Public repo never attaches directly to production runner.

Mandatory release flow: fresh repo/live/private-CI preflight → isolated branch → private `target-ref.txt` exact 40-char branch head → MiniPC CI green → merge → private `deploy-ref.txt` exact merged SHA → local + consecutive public checks → full sitemap/P0 crawl → update this handoff with verified production truth.

## 11. Regression watch
Never weaken reliability gates, fabricate Saju hours/astrology placements, turn a convention choice into a confidence percentage, overstate source precision, send raw birth/photo/name PII to narrative AI, silently resolve ambiguous/nonexistent DST wall clocks, invent Hanja, ship checkout before signed-webhook/idempotent-ledger/refund foundations, or let browser state become payment/credit authority.

Also reject product regressions where paid value is not visible before checkout, Stitch/UI changes are not perceptible, credits exist only as pricing copy, Hanbok results lack useful visuals, or research-only work leaves customer journeys unfinished.

## 12. User action currently required
**None.** Continue autonomously. Ask only for merchant/provider credentials, DNS, or a narrowly scoped privileged MiniPC action when it is genuinely the final blocker.
