# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** sellable-MVP acceleration + Step 3 deterministic/explainable K-Culture in parallel  
**Current verified production application SHA:** `f386a12bfa34d409aeeb3a3de636476b51102ee8`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, `PRODUCT_MASTER_SPEC.md`, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts or a documented rubric; never decorative precision.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer sensitive identity from photo/name/locale/voice.

Global-first payment direction and premium Naming Studio remain intact. Current browser-local/deterministic Personal Color and Hanbok tools remain free previews; premium photo-aware versions are later consented explainable-AI features after privacy/provider/cost gates. After reliability closure, paid-MVP foundations may progress in parallel with Step 3 so research-only work does not block a sellable customer journey.

## 2. Production reliability — FORMALLY CLOSED 2026-08-29
The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is formally closed under the user-defined evidence contract. Private CI remains the source of truth and any future sampled 1033/530/502 immediately reopens reliability priority.

Closure evidence:
1. scheduled dedicated Stability Watch run `33130231833`, checked `2026-08-28T00:36:32Z`: local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`;
2. separate scheduled integrated stability/preflight run `33216886289`, checked `2026-08-28T22:27:50Z`: public stability `8/8`, sitemap 36, P0 `36/36`, `failures=0`;
3. fresh closure confirmation run `33227495587`, checked `2026-08-29T01:51:39Z`: local `3/3`, public `12/12`, `public_bad=0`, sitemap 36, P0 `36/36`, `failures=0`.

Runtime understanding:
- production is `korea-concierge.service` on `127.0.0.1:3100`;
- Korea tunnel UUID is `da081e8b-8cb3-4503-a8be-c2971f8a2721`, connector `korea-tunnel.service`;
- Docker `n8n-server-cloudflared-1` is unrelated tunnel UUID `08493dd4-8e40-4d5f-bdfd-c9ffa1fbe2b5` and must not be stopped for Korea repair;
- runner remains without general sudo/Docker rights.

Keep private stability monitoring, no-retry full preflight and consecutive deploy probes. GitHub schedule delivery inconsistency during recovery is a CI-monitoring concern, not an open production-tunnel incident.

## 3. Existing explainable previews / UI isolation
Personal Color free preview remains browser-local/private. Hanbok free matcher remains deterministic and explainable. Premium Personal Color/Hanbok remains future consented photo-based explainable AI.

A separate `korea-concierge/stitch-ui-system` branch exists, so backend/core work must not casually overwrite its UI surface. Reconcile it deliberately before the next visual slice.

## 4. Step 3A shipped production foundations
Production now includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone required for exact/approximate local clock; longitude additionally required for true-solar mode;
- whitelist-only narrative payloads that strip raw DOB/time/city/timezone/longitude/name/account identifiers;
- explicit `midnight` / `jasi` / `splitJasi` day-boundary policies;
- explicit `civil` / `true-solar` policy;
- trusted 2024 Ipchun Year Pillar boundary samples outside KASI's unresolved source minute;
- trusted 2024 Jingzhe Month Pillar boundary samples outside its unresolved source minute;
- executable late-Zi policy semantics;
- deterministic NOAA/GML Equation-of-Time + longitude/timezone true-solar correction with explicit `dayOffset`;
- deterministic historical IANA/DST wall-clock resolution with `unique` / `ambiguous` / `nonexistent` states, no silent earlier/later choice and no gap shifting;
- `npm run check:saju` as a production build gate;
- no runtime Saju calculator dependency.

The historical IANA/DST slice was merged and exact-SHA deployed as `f386a12bfa34d409aeeb3a3de636476b51102ee8`; private deploy diagnostics report `status=success` at `2026-08-29T01:59:15Z`.

Research for that slice remains in `docs/SAJU_TIMEZONE_DST_RESEARCH_2026-08-29.md`: NIST DST transition behavior and standardized `Intl.DateTimeFormat` are adopted; date-fns timezone packages were not needed for this bounded deterministic resolver; ML is not an authority for timezone conversion.

## 5. Authoritative wallet / credits — CURRENT REVIEW SLICE
Branch: `korea-concierge/wallet-ledger-foundation-v2`, based on the latest Saju/DST production main so the concurrent Step 3 work is preserved.

New candidate files:
- `src/lib/credits/ledger.ts`;
- `scripts/check-credit-ledger.mjs`;
- `docs/WALLET_LEDGER_RESEARCH_2026-08-29.md`;
- `npm run check:credits-ledger`, included in the production build gate alongside the new timezone-resolution Saju gate.

Domain invariants:
- positive safe-integer credits only;
- append-only ledger entries;
- explicit available/reserved/spent buckets with full reconciliation to total grants;
- no negative balance bucket;
- reserve cannot exceed available credits;
- capture/release cannot exceed remaining reservation;
- refund cannot exceed captured-unrefunded amount;
- same idempotency key + same request replays the original result without another mutation;
- same key + different request fails closed;
- capture usage ID must match the reservation usage ID.

The `grant` command accepts only trusted-domain source labels (`verified_payment`, `promotion`, `admin`), but this is not yet a production authorization boundary. Browser success must never call grant authority directly.

Research posture (`docs/WALLET_LEDGER_RESEARCH_2026-08-29.md`):
- Stripe idempotency semantics: **ADOPT**;
- PostgreSQL unique constraints / row-locking principles for future persistence: **ADOPT**;
- MIT `mkmbhs/ledger` hold/capture patterns: **ADAPT**;
- MIT `wuliwong/token_ledger` reserve/capture/release and immutable audit patterns: **ADAPT**;
- third-party runtime ledger package: **REJECT for this slice**;
- Hugging Face wallet/ledger models: **REJECT** for deterministic balance authority;
- public Threads/web search: no attributable implementation-grade evidence adopted.

A private CI robustness race was also diagnosed while verifying the first wallet branch: product checks/build all passed, but the diagnostics-only commit was rejected because another private workflow advanced `main`. Private MiniPC CI now safely fetches/rebases its own diagnostics-only commit before a normal push; no force-push and no additional runner privilege were introduced. The replacement wallet branch must still pass a fresh exact-head MiniPC CI before merge.

Next wallet gate after this domain slice: server-only transactional persistence adapter, unique idempotency constraint, auth/account ownership, immutable rows, concurrency tests, then payment provider server create/capture + verified signed webhook/replay protection/refunds.

## 6. Remaining Step 3A order
1. Integrate IANA/DST resolution into exact/approximate birth-time instant conversion and foreign-user ambiguity/gap UX.
2. Semantic lunar leap-month validity against trusted calendar data.
3. Evaluate an exact pinned `manseryeok` candidate only against already trusted fixtures.
4. Beginner foreign-user exact/rough/unknown-time UX with minimal location input.
5. Deterministic full/reduced-scope chart output; unknown time returns reduced scope rather than guessed hour.
6. Integrate true-solar `dayOffset` with selected day-boundary convention without collapsing policy differences.

Step 3 remains an active correctness lane but must not monopolize implementation while the sellable Hanbok/credits/payment loop is incomplete.

## 7. Later K-Culture roadmap
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot randomization is independent of LLM interpretation. Astrology may not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not medical/legal/financial/high-impact advice.

## 8. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 9. Global-first payments
International visitor is the launch payer. PayPal Checkout remains a leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet. Before money: auth/account ownership, server-owned catalog/amounts, immutable/idempotent wallet/service-entitlement ledger, server-side create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 10. Architecture / release flow
Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects, frozen dependency installs. Public repo never attaches directly to production runner.

Mandatory material release flow: fresh repo/live/private-CI preflight → isolated branch → private `target-ref.txt` exact 40-char branch head → MiniPC CI green → merge → private `deploy-ref.txt` exact merged SHA → local + consecutive public checks → full sitemap/P0 crawl → update this handoff with verified production truth.

## 11. Regression watch
Never weaken reliability gates, fabricate Saju hours/astrology placements, silently resolve ambiguous/nonexistent DST wall clocks, turn convention choices into fake confidence percentages, send raw birth/photo/name PII to narrative AI, invent Hanja, ship checkout before signed-webhook/idempotent-ledger/refund foundations, or let browser state become payment/credit authority.

Also reject product regressions where paid value is not visible before checkout, Stitch/UI changes are not perceptible, credits exist only as pricing copy, Hanbok results lack useful visuals, or research-only work leaves customer journeys unfinished.

## 12. User action currently required
**None.** Continue autonomously. Merchant/provider credentials and narrowly privileged operations remain deferred until genuinely the final blocker.
