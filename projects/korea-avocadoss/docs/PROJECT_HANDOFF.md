# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** sellable-MVP acceleration + Step 3 deterministic/explainable K-Culture in parallel  
**Current verified production application SHA:** `17ced5f7dc1fbc7c5ff7492db42634790345f0df`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, relevant active/diverged branches, `PRODUCT_MASTER_SPEC.md`, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone. Root `AGENTS.md` makes this fresh-state inspection mandatory because Codex, ChatGPT, another AI, or a human may have changed the repository between runs.

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

Latest production verification after the Hanbok visual release: private full preflight run `33231057854`, checked `2026-08-29T03:18:31Z`, passed local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`, sitemap 36, all P0 `36/36`, `failures=0`.

### Private CI diagnostics persistence hardening
The earlier post-deploy probe run `33230226936` proved the live surface healthy but its diagnostics persistence step hit a private-main rebase race. This was a CI bookkeeping race, not a production failure. Private `.github/workflows/live-site-preflight.yml` was hardened at `f25cba65d2658fa6cca783953672f9fe76705aa0`: each persistence retry resets to newest private `main`, reapplies the sanitized generated report, and performs a normal fast-forward push. No force-push or privilege escalation is used.

## 3. Explainable previews / UI isolation / Hanbok visuals
Personal Color free preview remains browser-local/private. Hanbok free matcher remains deterministic and explainable. Premium Personal Color/Hanbok remains future consented photo-based explainable AI.

A separate `korea-concierge/stitch-ui-system` branch exists. Fresh comparison before the Hanbok visual slice showed it diverged from main. Direct blob checks then confirmed the current `hanbok-matcher.tsx` and `messages/hanbok/en.json` tips were identical between main and that Stitch branch. The visual work was therefore deliberately isolated into new files plus small Hanbok page/i18n loader seams, with no rewrite of global Stitch CSS and no change to the deterministic matcher.

### Hanbok visual source policy — SHIPPED
`docs/HANBOK_VISUAL_SOURCE_POLICY.md` defines the long-term rules:
- use visually strong real-world examples resembling K-drama / celebrity / palace-fashion styling rather than swatches alone;
- production assets prioritize owned/licensed/CC0/public-domain or individually verified reusable Creative Commons imagery;
- celebrity Instagram, drama stills and editorial/social imagery are inspiration or official-link/embed candidates unless explicit reuse rights are verified; do not scrape/self-host/crop/background-remove them by default;
- cutout/transparent-background presentation is encouraged only when the source permits reuse and modification;
- celebrity-linked garment-only references are preferred over copying a celebrity portrait where useful;
- provenance/license/attribution/modification requirements stay attached to the asset;
- popularity signals must be measured or attributable, never invented.

### Hanbok real-reference gallery — PRODUCTION VERIFIED 2026-08-29
Files:
- `src/features/hanbok/hanbok-visual-library.ts`;
- `src/features/hanbok/hanbok-visual-inspiration.tsx`;
- `src/features/hanbok/hanbok-visual-inspiration.module.css`;
- `messages/hanbok-visual/{en,ja,zh-CN,zh-TW,vi,th}.json`;
- `docs/HANBOK_VISUAL_RESEARCH_2026-08-29.md`.

Production behavior:
- three large real-world reference cards appear before the rule-based matcher;
- references cover a K-pop stage Hanbok museum garment, a CC0 full-body traditional Hanbok example and a real Seoul boutique palette wall;
- source, credit and license are visible on every card;
- UI explicitly says the images are styling references, not rental inventory or endorsements;
- P0 localized copy is complete;
- no AI call or inference cost is added;
- global Stitch CSS and deterministic matcher logic remain untouched.

Research posture:
- Creative Commons reuse guidance: **ADOPT**;
- rights-reviewed CC0/CC BY assets: **ADOPT/ADAPT**;
- scraped celebrity Instagram/drama screenshots or unlicensed background-removal: **REJECT**;
- GitHub Hanbok dataset search: no candidate worth runtime adoption;
- Hugging Face dataset search: **UNAVAILABLE** because the installed connector reported that function disabled;
- public Threads search: no attributable implementation-grade evidence adopted.

Current trade-off: this first slice loads rights-reviewed Wikimedia images remotely. That keeps provenance visible, bundle size low and inference cost at `$0`, but adds a third-party image request and external latency dependency. Future first-party optimized copies require explicit binary provenance/derivative-license handling first.

Release evidence:
1. fresh pre-patch full preflight `33230699848`: local `3/3`, public `12/12`, sitemap 36, P0 `36/36`, failures `0`;
2. exact feature head `f92e99dcde790c1fcb499409b98ec446979fe954` passed private MiniPC CI `33230915042`, including P0 localization, Saju gates and production build;
3. PR #31 squash-merged to exact production SHA `17ced5f7dc1fbc7c5ff7492db42634790345f0df`;
4. private secure deploy `33230988270` deployed that exact SHA and passed exact-ref validation, production build, isolated redirect checks, root-owned cutover and stable public Cloudflare checks;
5. post-deploy full preflight `33231057854` passed local `3/3`, public `12/12`, bad codes `none`, sitemap 36, P0 `36/36`, failures `0`.

Next Hanbok visual quality steps:
1. move approved visuals into a first-party optimized asset pipeline with retained provenance;
2. prefer owned/model-released photography for prominent result cards;
3. use legal transparent-background/cutout assets where source licenses allow derivatives;
4. map approved visuals to deterministic look archetypes without claiming the photographed garment is the actual rental item;
5. continue premium photo-aware Hanbok only after consent/privacy/provider/cost gates.

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

Remaining Step 3A:
1. consume IANA/DST resolution in exact/approximate birth-time instant conversion and expose disambiguation UX;
2. semantic lunar leap-month validity against trusted calendar data;
3. exact pinned calculator candidate evaluation against trusted fixtures;
4. foreign-user beginner UX for exact/rough/unknown time and minimal location input;
5. deterministic full/reduced-scope chart output;
6. integrate true-solar `dayOffset` with the selected day-boundary policy without collapsing convention differences.

## 5. Authoritative wallet / credits — PRODUCTION FOUNDATION
### Ledger domain — SHIPPED
Files:
- `src/lib/credits/ledger.ts`;
- `scripts/check-credit-ledger.mjs`;
- `docs/WALLET_LEDGER_RESEARCH_2026-08-29.md`.

Invariants include positive safe-integer credits, append-only entries, available/reserved/spent reconciliation, no negative balance, bounded reserve/capture/release/refund, same-key/same-request replay, same-key/different-request fail-closed behavior and reservation/capture usage matching.

Ledger release: exact head `6f5f4bb68646996cccc1260c1f1ff9d653e66909` → MiniPC CI `33228057275` → PR #26 → production SHA `77709081961d3aae570cd7b94c6838c7072c4841` → deploy `33228113628` → clean post-deploy preflight `33228193627`.

### Credit authorization boundary — SHIPPED
Files:
- `src/lib/credits/authorization.ts`;
- `scripts/check-credit-authorization.mjs`;
- `docs/CREDIT_AUTHORIZATION_RESEARCH_2026-08-29.md`.

Authorization contract:
- account actors may reserve only their own wallet;
- verified-payment grants require `payment_webhook`;
- promotional grants require `promotion_service`;
- admin grants require `support_admin`;
- capture/release/refund require `feature_executor` or `support_admin`;
- system actors require non-empty audit identifiers;
- browser/account actors cannot grant, capture, release or refund credits.

Scope boundary: database persistence, authenticated session verification, provider webhook verification and real-money readiness are not yet claimed.

Next wallet gates:
1. immutable transactional persistence rows and account/wallet ownership storage;
2. unique database idempotency constraint;
3. atomic reserve/capture/release/refund with deterministic lock ordering and concurrency tests;
4. authenticated server session → account principal binding + audit telemetry;
5. provider server create/capture + verified signed webhook + replay protection + monetary refund/reversal.

No browser-reported success may grant credits.

## 6. K-Culture roadmap after current Saju foundations
After Step 3A deterministic Saju foundations: explainable Saju interpretation → Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot randomization is independent of LLM interpretation. Astrology never fabricates missing placements. Daily fortune remains reflective/cultural entertainment, not high-impact advice.

Step 3 remains an active correctness lane but must not monopolize implementation while the sellable Hanbok/credits/payment loop is incomplete.

## 7. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 8. Global-first payments
International visitor is the launch payer. PayPal Checkout remains a leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet. Before money: authenticated ownership, server-owned catalog/amounts, durable idempotent wallet/entitlement persistence, server create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 9. Architecture / release flow
Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects, frozen installs. Public repo never attaches directly to production runner.

Mandatory material-release flow: fresh repo/private-CI/live preflight → isolated branch → private `target-ref.txt` exact 40-char head → MiniPC CI green → merge → private `deploy-ref.txt` exact merged SHA → secure cutover + consecutive public probes → full sitemap/P0 crawl → update this handoff with verified production truth.

## 10. Regression watch
Never weaken reliability gates, fabricate Saju/astrology data, expose raw sensitive PII to narrative AI, silently resolve ambiguous/nonexistent DST clocks, invent Hanja, ship checkout before durable webhook/idempotency/refund foundations, or let browser state become payment/credit authority.

Also reject product regressions where paid value is not visible before checkout, Stitch changes are not perceptible, credits exist only as pricing copy, Hanbok results lack useful visuals, or research-only work leaves customer journeys unfinished. Never overwrite concurrent Codex/AI branches without a fresh branch comparison, and never ship unlicensed celebrity/drama/social imagery just because it is visually effective.

## 11. User action currently required
**None.** Continue autonomously. Ask only for merchant/provider credentials, DNS, or a narrowly scoped privileged MiniPC action when it is genuinely the final blocker.
