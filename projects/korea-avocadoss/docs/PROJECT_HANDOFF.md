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
- AI-generated fallback images require explicit visual review and strict style coherence;
- each image must retain machine-readable provenance (`sourceUrl`, `sourceTitle`, `license`, `author`);
- do not fabricate museum accession numbers or invent public-domain status for unverified commercial photos;
- UI cards must include a visible styling prompt/tip rather than a plain image thumbnail.

### Hanbok visual reference gallery — SHIPPED
Files:
- `src/features/hanbok/hanbok-visual-library.ts` (6 rights-reviewed real-world reference models with full provenance/attribution);
- `src/features/hanbok/hanbok-visual-inspiration.tsx` + `hanbok-visual-inspiration.module.css`;
- `messages/hanbok-visual/{en,zh-CN,ja,zh-TW,vi,th}.json`;
- `docs/HANBOK_VISUAL_RESEARCH_2026-08-29.md`.

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

## 4. Step 3A Saju Deterministic Core & Explainable Foundations — SHIPPED
### Saju deterministic core — SHIPPED
Files:
- `src/lib/saju/input-contracts.ts`;
- `src/lib/saju/deterministic-core.ts`;
- `src/lib/saju/timezone-resolution.ts`;
- `src/lib/saju/day-boundary-policy.ts`;
- `src/lib/saju/true-solar-time.ts`;
- `scripts/check-saju-deterministic-core.mjs`;
- `docs/SAJU_DETERMINISTIC_CORE_RESEARCH_2026-08-29.md`.

Core invariants & capabilities:
- **Birth-time input contract**: `exact`, `approximate`, `unknown` discriminated unions with runtime validation and compile-time guards preventing silent coercion;
- **IANA timezone & DST resolution**: resolves wall clocks against runtime IANA database; returns explicit `unique`, `ambiguous` (fall-back transition with all candidate offsets preserved), `nonexistent` (spring-forward gap; not silently shifted), or `insufficient-input` (when timezone is missing for exact/approximate clock);
- **Invariant vs. Candidate branch derivation**:
  - Exact: resolves single hour branch and pillar;
  - Approximate single-branch: resolves invariant branch, flags precision as `approximate`;
  - Approximate multi-branch: strictly omits hour pillar (`undefined`), enumerates chronological candidate branches and candidate hour pillars, sets uncertainty code `APPROXIMATE_TIME_MULTI_BRANCH`;
  - Unknown: strictly omits hour pillar (`undefined`), enumerates all 12 candidate branches, sets scope `three-pillars` and uncertainty code `UNKNOWN_BIRTH_TIME`;
- **Five Rats Hour-Stem Formula** (오자둔일법): exact modular arithmetic `((dayStemIndex % 5) * 2 + hourBranchIndex) % 10`;
- **Invariant Five Elements range bounds**: computes exact element count for verified base pillars (3 pillars = 6 characters) plus min..max range bounds for candidate hour additions; strictly bans decorative precision or fabricated percentage scores;
- **Day Boundary & Solar Time Integration**: applies `midnight`, `jasi`, and `splitJasi` policies; flags late-Zi day-pillar ambiguity for intervals spanning 23:00 under `jasi`; applies NOAA/GML Equation of Time and longitude correction with `dayOffset` when `true-solar` mode is active;
- **Machine-readable provenance & explainability**: produces full `SajuProvenance` including applied rule IDs, resolved facts, uncertain facts, unavailable reasons, and candidate derivations;
- **Privacy & Narrative boundary**: `buildSajuNarrativePayload` enforces whitelist-only serialization, dropping all raw PII (birth date, clock time, place label, timezone, longitude, user name, account ID); `validateNarrativePayloadImmutability` verifies that downstream narrative adapters cannot alter deterministic calculation outputs;
- **Automated tests**: `scripts/check-saju-deterministic-core.mjs` verifies all 20+ required criteria and property invariants; integrated into `npm run check:saju` and production `npm run build`.

Remaining Step 3A/3B:
1. consumer UI components for Saju chart visualization and explainable result cards;
2. semantic lunar leap-month validity against trusted astronomical calendar data;
3. beginner UX for foreign visitors (What is Saju? What does my time uncertainty change?);
4. bounded generative interpretation layer consuming whitelist-only narrative payloads.

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
