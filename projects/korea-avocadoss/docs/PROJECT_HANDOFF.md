# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-30  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** customer-facing premium Hanbok experience + Stitch synchronization; Step 3 deterministic K-Culture continues in parallel  
**Most recent merged main SHA:** `6f466c1a6262039612dafc0ada8303c7a989c668`  
**Most recent user-reported verified production SHA:** `6f466c1a6262039612dafc0ada8303c7a989c668`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh main/recent commits/open PRs/full project tree, relevant active/diverged branches, `PRODUCT_MASTER_SPEC.md`, `IMPLEMENTATION_ROADMAP.md`, this handoff, private CI state and a fresh live-site preflight. Never infer state from chat history alone. Root `AGENTS.md` makes this fresh-state inspection mandatory because Codex, ChatGPT, another AI, or a human may have changed the repository between runs.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts or a documented rubric; never decorative precision.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choice wins. Never infer sensitive identity from photo/name/locale/voice.

Global-first payment direction and premium Naming Studio remain intact, but **Stripe live activation is deferred while customer-facing premium value is built first**. The current browser-local/deterministic Personal Color and Hanbok tools remain free previews. Premium photo-aware Hanbok/Personal Color is a later consented explainable-AI layer after privacy/provider/cost gates.

## 2. Production reliability — FORMALLY CLOSED 2026-08-29
The 2026-08-27 intermittent Cloudflare 1033/530/502 incident is formally closed under the user-defined evidence contract. Private CI remains the source of truth and any future sampled 1033/530/502 immediately reopens reliability priority.

Closure evidence already recorded:
1. scheduled dedicated Stability Watch `33130231833`: local `3/3`, public `12/12`, `public_bad=0`, bad codes `none`;
2. separate scheduled integrated stability/preflight `33216886289`: public stability clean, sitemap 36, P0 `36/36`, `failures=0`;
3. closure confirmation `33227495587`: local `3/3`, public `12/12`, sitemap 36, P0 `36/36`, failures `0`.

Latest Hanbok/Stripe merge `6f466c1a6262039612dafc0ada8303c7a989c668` was user-reported as deployed with MiniPC CI run `33258985277`, deploy run `33259043279`, and live preflight `33259127317`: local `3/3`, public `12/12`, sitemap/P0 failures `0`, 530/1033/502 = 0. Revalidate from private CI before the next merge rather than relying on this historical report.

Runtime understanding:
- production is `korea-concierge.service` on `127.0.0.1:3100`;
- Korea tunnel UUID is `da081e8b-8cb3-4503-a8be-c2971f8a2721`, connector `korea-tunnel.service`;
- Docker `n8n-server-cloudflared-1` is unrelated tunnel UUID `08493dd4-8e40-4d5f-bdfd-c9ffa1fbe2b5`; never stop it as a Korea repair step;
- runner remains without general sudo/Docker rights.

Keep the private 10-minute stability workflow, no-retry full preflight and consecutive deploy probes.

## 3. Hanbok Core — current shipped state
The customer-facing style system is intentionally simple:
1. **Princess / Prince** — soft, graceful, youthful pastel layers, classic palace photo-friendly look;
2. **Queen / King** — elegant, traditional, dignified formal court-inspired look with richer colors;
3. **Royal** — luxurious, ornate, ceremonial, highly decorated premium experience label.

Shipped files:
- `src/features/hanbok/hanbok-visual-library.ts`;
- `src/features/hanbok/hanbok-visual-inspiration.tsx` + CSS module;
- `src/features/hanbok/hanbok-matcher.tsx`;
- `messages/hanbok-visual/**`, `messages/hanbok/**`;
- `scripts/check-hanbok-visual-contracts.mjs`.

Important quality issue still open: several primary references still come from `Korea_Hanbok_Fashion_Show_*` sources. The user explicitly rejected runway/fashion-show imagery as the defining visual for the three categories. Replace those with rights-reviewed, high-resolution real palace/ceremonial references before declaring the visual library final.

## 4. Personal Color → Hanbok continuity — IMPLEMENTED ON WORKING BRANCH, NOT YET MERGED
Working branch: `korea-concierge/hanbok-ai-ux-stitch-sync-20260830`.

Current branch changes:
- new `src/features/hanbok/personal-color-bridge.ts` with an explicit deterministic mapping: warm → `jadeIvory`, neutral → `roseNavy`, cool → `moonBlue`;
- browser-local Personal Color result deep-links to `/hanbok?undertone=...#hanbok-matcher`;
- Hanbok visual style selection preserves the explicit undertone parameter;
- matcher pre-fills the broad Hanbok palette from that explicit Personal Color result while style still controls mood/comfort;
- the user can override all matcher selections;
- `scripts/check-hanbok-visual-contracts.mjs` now covers this bridge.

This mapping is a documented product rule, not an AI confidence score or a claim that one color is objectively best.

## 5. Stitch design synchronization — ROOT CAUSE IDENTIFIED
Original Stitch UI was successfully merged through PR #11 (`95a86da4554a9a027b39a5480c971aaa48939672`) on 2026-08-27. The design system itself therefore was not missing.

The synchronization drift happened because:
1. dedicated branch `korea-concierge/stitch-ui-system` stopped at `1e2dcb8daaf6daac610e7b57785da81e64d61446` on 2026-08-27;
2. later Hanbok gallery work explicitly isolated styling in a CSS module rather than rewriting global Stitch CSS;
3. later PRs, including the 3-style Hanbok redesign, landed directly on newer `main`;
4. `docs/UI_STITCH_SPEC.md` remained version 1.0 and still described the old generic Hanbok mock with static 96/91/88 example match percentages.

Do **not** merge the stale Stitch branch back onto main. It can regress newer work. Instead, sync the latest product requirements forward into the Stitch design/project.

`docs/UI_STITCH_SPEC.md` is updated to v1.1 on the current working branch with:
- current 3-style Hanbok contract;
- Personal Color continuity;
- no decorative confidence percentages;
- rights-reviewed image standards;
- future Premium AI Hanbok concept UX;
- a formal rule that material UI changes must update the Stitch spec and refresh Stitch screens when tooling is available.

External Stitch project regeneration is still pending because this ChatGPT run has repository access but no direct Stitch editing connector.

## 6. Premium Hanbok — revised product direction
Do not build a giant uncontrolled scraped-image dataset. The preferred architecture is hybrid:

### A. Rights-reviewed real reference library
Grow a smaller high-quality library first, eventually roughly hundreds rather than immediately thousands of images, with useful metadata:
- Princess/Prince, Queen/King, Royal;
- feminine/masculine/unisex presentation;
- dominant/secondary colors;
- Personal Color fit;
- ornament level;
- silhouette;
- season/fabric;
- palace/location context;
- source/license/provenance;
- real bookable inventory flag.

The purpose is grounding, examples and later real-shop matching. No uncontrolled Instagram/blog/drama scraping into production assets.

### B. AI styling concept generation
The premium user-visible value should be a visual answer to **“What Hanbok would suit me?”**

Inputs:
- explicit Personal Color result;
- selected Princess/Prince, Queen/King or Royal direction;
- mood;
- destination;
- season;
- walking/photo priority;
- optional consented photo later;
- solo/couple/family context later.

Target output:
- 1–3 large AI Hanbok concept previews;
- main + alternate colorway;
- silhouette/accessory/fabric brief;
- explainable reasons based on explicit inputs;
- a simple reference card to show a rental shop;
- visible disclosure that AI concepts are not guaranteed rental inventory.

Implementation order:
1. typed deterministic styling brief;
2. provider abstraction;
3. cost/latency measurement;
4. optional consented/transient photo pipeline;
5. generated concept preview;
6. only then assign credit cost using measured provider cost + target margin.

Do not use generated images as evidence for Personal Color classification. Do not send raw photos to narrative LLMs.

## 7. Stripe Global Payment Primary Foundation — CODE SHIPPED, ACTIVATION DEFERRED
Stripe remains the chosen global payment provider. Foundation already exists:
- `src/lib/payments/catalog.ts`;
- `src/lib/payments/stripe.ts`;
- `/api/checkout/stripe`;
- `/api/stripe/webhook`;
- localized checkout success page;
- `.env.example`;
- payment contract tests.

Current webhook verifies `checkout.session.completed` but does not yet persist durable entitlement/credit fulfillment. Live Stripe account onboarding, real Product/Price IDs, server secrets and live checkout are intentionally deferred until the premium feature produces a compelling result.

Long-term commercial loop remains credit-based: buy credits → reserve before expensive AI action → capture on success → release/refund on failure. Credit consumption must be derived from measured provider cost and margin, not guessed numbers.

## 8. Step 3A Saju deterministic core — SHIPPED & PRODUCTION VERIFIED
Production includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone/DST explicit resolution;
- deterministic boundary policies and true-solar correction;
- deterministic Five Rats hour-stem formula and bounded uncertainty;
- whitelist-only narrative payloads stripping raw PII;
- automated deterministic/property tests;
- no runtime Saju calculator dependency.

Continue later with zodiac/astrology/tarot/daily-fortune foundations after the current customer-facing premium Hanbok slice reaches a useful milestone.

## 9. Authoritative wallet / credits — PRODUCTION FOUNDATION
- `src/lib/credits/ledger.ts`, `src/lib/credits/authorization.ts`, `src/lib/credits/economics.ts`.
- Invariants: positive safe-integer credits, append-only entries, no negative balance, server-only capture/release/refund.

No live Stripe-to-ledger fulfillment until persistence and webhook idempotency are attached.

## 10. Immediate next priority
1. Private MiniPC verification of the current Personal Color → Hanbok bridge branch.
2. Replace runway-heavy Hanbok references with better rights-reviewed palace/royal-ceremony imagery.
3. Build typed `PremiumHanbokStyleBrief` and image-generation provider seam without payment activation.
4. Add explicit optional-photo consent, validation, EXIF stripping/transient-processing boundary before any remote vision use.
5. Add generated Hanbok concept preview and measure real inference cost/latency.
6. Refresh external Stitch Hanbok screen from `UI_STITCH_SPEC.md` v1.1 when Stitch tooling is available.
7. Stripe live onboarding later.

## 11. User action currently required
**None.** Continue autonomous product work. Ask only when a provider credential, actual Stripe live setup, or a narrowly scoped privileged MiniPC action is genuinely the final blocker.
