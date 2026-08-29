# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** sellable-MVP acceleration + Step 3 deterministic/explainable K-Culture in parallel  
**Current verified production application SHA:** `cd24378ab3ed6ada84869231bb99766073d1d17a`  
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
1. scheduled dedicated Stability Watch `33130231833`: local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`;
2. separate scheduled integrated stability/preflight `33216886289`: public stability clean, sitemap 36, P0 `36/36`, `failures=0`;
3. closure confirmation `33227495587`: local `3/3`, public `12/12`, sitemap 36, P0 `36/36`, failures `0`.

Runtime understanding:
- production is `korea-concierge.service` on `127.0.0.1:3100`;
- Korea tunnel UUID is `da081e8b-8cb3-4503-a8be-c2971f8a2721`, connector `korea-tunnel.service`;
- Docker `n8n-server-cloudflared-1` is unrelated tunnel UUID `08493dd4-8e40-4d5f-bdfd-c9ffa1fbe2b5`; never stop it as a Korea repair step;
- runner remains without general sudo/Docker rights.

Keep the private 10-minute stability workflow, no-retry full preflight and consecutive deploy probes.

Latest production verification after the credit-authorization release: private preflight run `33230317038`, checked `2026-08-29T03:00:45Z`, passed local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`, sitemap 36, all P0 `36/36`, `failures=0`.

### Private CI diagnostics persistence hardening
The first post-deploy probe run `33230226936` proved the entire live surface healthy (local `3/3`, public `12/12`, sitemap/P0 clean) but its **diagnostics persistence step** failed because another private diagnostic writer advanced `main` and a generated `live-site-preflight.txt` rebase conflicted. This was a CI bookkeeping race, not a production failure.

Private workflow `.github/workflows/live-site-preflight.yml` was hardened at private commit `f25cba65d2658fa6cca783953672f9fe76705aa0`: each persistence retry now fetches/reset to the newest private `main`, reapplies the sanitized generated report, and performs a normal fast-forward push. It does not force-push and adds no privileges. Validation run `33230317038` completed **success**, including probe and persistence steps.

## 3. Existing explainable previews / UI isolation
Personal Color free preview remains browser-local/private. Hanbok free matcher remains deterministic and explainable. Premium Personal Color/Hanbok remains future consented photo-based explainable AI.

A separate `korea-concierge/stitch-ui-system` branch exists, so backend/core work must not casually overwrite its UI surface. Reconcile it deliberately before the next visual slice.

## 4. Step 3A production-verified foundations
Production includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone required for exact/approximate local clock; longitude additionally required for true-solar mode;
- whitelist-only narrative payloads that strip raw DOB/time/city/timezone/longitude/name/account identifiers;
- explicit `midnight` / `jasi` / `splitJasi` and `civil` / `true-solar` policies;
- trusted Ipchun/Jingzhe boundary fixtures outside unresolved official-source minutes;
- deterministic late-Zi semantics and NOAA/GML true-solar correction with `dayOffset`;
- historical IANA wall-clock resolver returning explicit `unique` / `ambiguous` / `nonexistent` states;
- `npm run check:saju` in the production build gate;
- no runtime Saju calculator dependency.

Historical timezone/DST release evidence: exact branch head `3689543f424988278b0fccaa3d7230dd0d5d6286` passed MiniPC CI `33227699521`; PR #23 merged to `f386a12bfa34d409aeeb3a3de636476b51102ee8`; secure deploy `33227742620` and post-deploy preflight `33227809379` passed.

## 5. Authoritative wallet / credits — PRODUCTION FOUNDATION
### Ledger domain — SHIPPED
Files:
- `src/lib/credits/ledger.ts`;
- `scripts/check-credit-ledger.mjs`;
- `docs/WALLET_LEDGER_RESEARCH_2026-08-29.md`.

Invariants include positive safe-integer credits, append-only entries, available/reserved/spent reconciliation, no negative balance, bounded reserve/capture/release/refund, same-key/same-request replay, same-key/different-request fail-closed behavior and reservation/capture usage matching.

Ledger release: exact head `6f5f4bb68646996cccc1260c1f1ff9d653e66909` → MiniPC CI `33228057275` → PR #26 → production SHA `77709081961d3aae570cd7b94c6838c7072c4841` → deploy `33228113628` → clean post-deploy preflight `33228193627`.

### Credit authorization boundary — SHIPPED 2026-08-29
Production now also includes:
- `src/lib/credits/authorization.ts`;
- `scripts/check-credit-authorization.mjs`;
- `docs/CREDIT_AUTHORIZATION_RESEARCH_2026-08-29.md`;
- `package.json` executes authorization checks as part of `check:credits-ledger` and therefore the production build gate.

Shipped authorization contract:
- account actors may reserve only their own wallet;
- `verified_payment` grants require the `payment_webhook` system role;
- promotional grants require `promotion_service`;
- admin grants require `support_admin`;
- capture/release/refund require `feature_executor` or `support_admin`;
- every system actor requires a non-empty audit identifier;
- browser/account actors cannot grant, capture, release or refund credits.

Research posture:
- PostgreSQL transaction/row-lock/unique-constraint principles: **ADOPT for the next persistence slice**;
- provider idempotency: **ADAPT**, never a substitute for domain/database idempotency;
- new third-party runtime wallet dependency: **REJECT**;
- Hugging Face model authority for wallet mutation: **REJECT**;
- public Threads/web community material: no attributable implementation-grade evidence adopted.

Release evidence:
1. fresh pre-patch private full preflight `33229989850`: local `3/3`, public `12/12`, sitemap 36, P0 `36/36`, failures `0`;
2. exact branch head `47743dddd5819d83fbef9808f0502e15ba84f4d2` passed private MiniPC CI `33230089790` including frozen install, P0 i18n, Saju gates, wallet ledger + authorization checks through production build, document language and redirect checks;
3. PR #28 squash-merged to exact production code SHA `cd24378ab3ed6ada84869231bb99766073d1d17a`;
4. private secure deploy `33230139412` deployed that exact SHA and passed the root-owned cutover plus consecutive public Cloudflare checks;
5. post-deploy validation run `33230317038` passed local `3/3`, public `12/12`, bad codes `none`, sitemap 36, P0 `36/36`, failures `0` and successfully persisted diagnostics after the persistence-race hardening.

Scope boundary: this release does **not** claim database persistence, authenticated session verification, provider webhook verification or real-money readiness.

### Next wallet gates
1. immutable transactional persistence rows and account/wallet ownership storage;
2. unique database idempotency constraint;
3. atomic reserve/capture/release/refund transactions with deterministic lock ordering and concurrency tests;
4. authenticated server session → account principal binding plus audit telemetry;
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
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot randomization is independent of LLM interpretation. Astrology never fabricates missing placements. Daily fortune remains reflective/cultural entertainment, not high-impact advice.

## 8. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 9. Global-first payments
International visitor is the launch payer. PayPal Checkout remains a leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet. Before money: authenticated ownership, server-owned catalog/amounts, durable idempotent wallet/entitlement persistence, server create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 10. Architecture / release flow
Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects, frozen installs. Public repo never attaches directly to the production runner.

Mandatory material-release flow: fresh repo/private-CI/live preflight → isolated branch → private `target-ref.txt` exact 40-char head → MiniPC CI green → merge → private `deploy-ref.txt` exact merged SHA → secure cutover + consecutive public probes → full sitemap/P0 crawl → update this handoff with verified production truth.

## 11. Regression watch
Never weaken reliability gates, fabricate Saju/astrology data, expose raw sensitive PII to narrative AI, silently resolve ambiguous/nonexistent DST clocks, invent Hanja, ship checkout before durable webhook/idempotency/refund foundations, or let browser state become payment/credit authority.

Also reject product regressions where paid value is not visible before checkout, Stitch changes are not perceptible, credits exist only as pricing copy, Hanbok results lack useful visuals, or research-only work leaves customer journeys unfinished.

## 12. User action currently required
**None.** Continue autonomously. Ask only for merchant/provider credentials, DNS, or a narrowly scoped privileged MiniPC action when it is genuinely the final blocker.
