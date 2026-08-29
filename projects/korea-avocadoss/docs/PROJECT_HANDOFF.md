# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** sellable-MVP acceleration + Step 3 deterministic K-Culture in parallel  
**Current verified production application SHA before this wallet slice:** `361ddfc8728dcbf8615890d37d477608db91f249`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, `PRODUCT_MASTER_SPEC.md`, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. The authoritative product/development/improvement criteria live in `docs/PRODUCT_MASTER_SPEC.md`.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts or a documented rubric; never decorative precision.

Commercial priority after reliability closure is the sellable vertical loop: visibly stronger Stitch UI, useful Hanbok free/premium experience, authoritative wallet/credits, payment-ready checkout/webhook flow and consented Personal Color premium bridge, while deterministic Step 3 correctness continues in parallel.

## 2. Production reliability — FORMALLY CLOSED, CONTINUE MONITORING
The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is formally closed under the strict evidence contract. Private CI remains the source of truth and any newly sampled 1033/530/502 immediately reopens reliability priority.

Closure evidence revalidated before this material product slice:
- scheduled sample 1: `2026-08-28T00:36:32Z`, local 3/3, public 12/12, `public_bad=0`, no bad codes;
- scheduled sample 2: `2026-08-28T22:27:50Z`, public 8/8, sitemap/P0 36/36, `failures=0`, no bad codes;
- closure confirmation / fresh preflight: `2026-08-29T01:51:39Z`, local 3/3, public 12/12, sitemap 36, P0 36/36, `failures=0`, no bad codes.

The Docker connector previously observed on the MiniPC was established as unrelated to the Korea tunnel and must not be stopped as a Korea repair step. Production origin remains `korea-concierge.service` on `127.0.0.1:3100`.

Preserve the private stability watch, consecutive deploy probes and no-retry full live-site preflight. Never grant the repository-scoped runner general sudo/Docker access or expose tokens/credentials/full token-bearing commands.

## 3. UI / Hanbok / Personal Color lanes
A separate `korea-concierge/stitch-ui-system` branch exists, so core/backend work must not casually overwrite its UI surface. Reconcile that branch deliberately before the next visual slice.

Personal Color free preview remains browser-local/private. Hanbok free matcher remains deterministic and explainable. Premium Personal Color/Hanbok direction is explicit-consent photo-based explainable AI after privacy/provider/cost gates. Paid value must be visible before checkout; prototype-only Premium labels are not Done.

## 4. Authoritative wallet / credits — IN PROGRESS
This run starts the non-UI wallet foundation because the Stitch branch is isolated and the paid MVP needs a correct server-authoritative credit lifecycle before checkout.

New candidate files on `korea-concierge/wallet-ledger-foundation`:
- `src/lib/credits/ledger.ts`;
- `scripts/check-credit-ledger.mjs`;
- `docs/WALLET_LEDGER_RESEARCH_2026-08-29.md`;
- `npm run check:credits-ledger`, included in the production build gate.

Domain invariants implemented:
- positive integer credits only;
- append-only ledger entries;
- explicit `available` / `reserved` / `spent` buckets;
- no negative bucket;
- full reconciliation to total grants;
- reserve cannot exceed available credits;
- capture/release cannot exceed remaining reservation;
- refund cannot exceed captured-unrefunded amount;
- exact idempotent replay returns the original entry without another mutation;
- reused idempotency key with a different request fails closed;
- capture is bound to the reservation usage ID.

The `grant` command deliberately exposes only trusted-server source labels (`verified_payment`, `promotion`, `admin`). This is a **domain boundary, not yet a production authorization/webhook boundary**. Browser success must never be allowed to call it directly.

Research disposition:
- official Stripe idempotency semantics: **ADOPT**;
- PostgreSQL unique constraints / row locking for the future persistence adapter: **ADOPT**;
- MIT `mkmbhs/ledger` authorization-hold patterns: **ADAPT**;
- MIT `wuliwong/token_ledger` reserve/capture/release + immutable audit patterns: **ADAPT**;
- runtime third-party ledger dependency: **REJECT for now**;
- Hugging Face wallet/ledger models: **REJECT** as irrelevant to deterministic ledger correctness;
- public Threads search: no attributable implementation-grade evidence adopted.

Next wallet gate after this pure domain slice: server-only persistence adapter with transactional database writes, unique idempotency constraint, authorization/account ownership, immutable rows, concurrency tests, then payment provider create/capture + verified signed webhook/replay protection/refunds.

## 5. Step 3A deterministic Saju foundations
Production already includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone requirement for exact/approximate clock input;
- longitude requirement for true-solar mode;
- raw birth/name/account fields stripped from narrative payloads;
- explicit `midnight` / `jasi` / `splitJasi` day-boundary policies;
- explicit `civil` / `true-solar` solar-time policies;
- trusted 2024 Ipchun and Jingzhe boundary fixtures;
- executable 23:00 / 00:00 / 01:00 policy semantics;
- deterministic NOAA/GML Equation-of-Time + longitude/timezone true-solar correction with `dayOffset`;
- `npm run check:saju` as the executable regression gate;
- no runtime Saju calculator dependency.

Remaining Step 3A gates:
1. historical IANA timezone/DST fixtures, including ambiguous/nonexistent wall times without guessing;
2. semantic lunar leap-month validity against trusted calendar data;
3. exact pinned calculator candidate evaluation only against trusted fixtures;
4. beginner foreign-user exact/rough/unknown-time UX with minimal location input;
5. deterministic full/reduced-scope chart output;
6. integrate true-solar `dayOffset` with selected day-boundary policy without collapsing convention differences.

Step 3 remains an active correctness lane but must not monopolize implementation while the sellable Hanbok/credits/payment loop is incomplete.

## 6. Later K-Culture
After deterministic Saju foundations: Korean Zodiac → Western Zodiac/Astrology → Tarot → Daily Fortune. Deterministic mechanics first. Tarot card selection is independent of LLM interpretation. Astrology may not fabricate placements/ascendant from missing data. Daily fortune is reflective/cultural entertainment, not medical/legal/financial/high-impact advice.

## 7. Premium Naming Studio
Separate premium Korean/Asian naming consultation target remains about USD `$149–150`, with curated Top 3–5, Hangul/pronunciation/romanization, validated optional Hanja, meanings, rationale, Korean naturalness, generation feel, international pronunciation, pitfalls and clearly separated traditional Saju/onomastics. Scores require explicit rubrics/data.

## 8. Global-first payments
International visitors are the launch payer. PayPal Checkout remains a leading candidate subject to fresh Korean merchant/policy verification. No production payment exists yet.

Before money: auth/account ownership, server-owned catalog/amounts, immutable/idempotent wallet + entitlement ledger, server-side create/capture, verified signed webhook, replay protection, refunds/reversals, rate limits and audit telemetry. Browser success never grants credits.

## 9. Architecture / release flow
Current app baseline: Next.js `16.3.3`, `next-intl@4.13.4`, 36 canonical P0 URLs, reciprocal hreflang/x-default, deterministic 308 legacy redirects and frozen dependency installs. Public repo never attaches directly to production runner.

Mandatory material release flow:
1. fresh repo/private-CI/live preflight;
2. isolated public branch;
3. exact 40-char branch head in private `target-ref.txt`;
4. self-hosted MiniPC CI success;
5. merge only after green;
6. exact merged SHA in private `deploy-ref.txt` for runtime changes;
7. secure deploy;
8. local + consecutive public checks;
9. full sitemap/P0 crawl;
10. update this handoff with verified production truth.

## 10. Regression watch
Never weaken reliability gates, fabricate Saju hours/astrology placements, turn convention choices into fake confidence percentages, send raw birth/photo/name PII to narrative AI, invent Hanja, ship checkout before signed-webhook/idempotent-ledger/refund foundations, or let browser state become payment/credit authority.

Also reject product regressions where paid value is not visible before checkout, Stitch/UI changes are not perceptible, credits exist only as pricing copy, Hanbok results lack useful visuals, or research-only work leaves customer journeys unfinished.

## 11. User action currently required
**None.** Continue autonomously. Merchant/provider credentials and narrowly privileged operations remain deferred until they are genuinely the final blocker.
