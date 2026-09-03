# Korea Concierge — Living Project Handoff

**Last updated:** 2026-09-02  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current product phase:** accepted Stitch premium visual system implementation across the live product surface  
**Current production baseline before this redesign:** `6f466c1a6262039612dafc0ada8303c7a989c668` (latest Korea Concierge release previously reported/verified; repository `main` may contain later unrelated project commits)  
**Active redesign branch:** `korea-concierge/stitch-premium-fullsite-20260830`  
**CI/deploy control:** private `lgkangno1-svg/korea-concierge-ci`, isolated MiniPC runner  
**Product north star:** `docs/PRODUCT_MASTER_SPEC.md`

> Before every material patch inspect fresh `main`, recent commits, open PRs, the full `projects/korea-avocadoss` tree, active/diverged Korea branches, this handoff, the product master spec/roadmap, private CI state, and a fresh live-site preflight. Do not infer repository state from chat history. Public source remains separate from the production runner; private CI verifies exact 40-character public source SHAs.

## 1. Product contract
Korea Concierge is a mobile-first multilingual companion for international visitors to Korea. Personalized results follow **result → evidence/data → alternative → uncertainty → action → method/privacy**. Visible numbers must come from deterministic calculation, measurement, verified facts, or a documented rubric; never decorative precision.

P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. Explicit user choice wins. Never infer sensitive identity from photo/name/locale/voice.

Stripe remains the intended global payment provider, but live Stripe activation is deliberately deferred while customer-facing product value and design are completed first. Current browser-local Personal Color and deterministic Hanbok tools remain free. Premium photo-aware styling can be added later behind explicit consent, privacy/provider/cost gates, and the authoritative credit ledger.

## 2. Accepted Stitch visual source of truth — 2026-08-30
The user approved `stitch_korea_concierge_premium_redesign.zip` as the primary visual reference for the site-wide redesign. Do not restart the visual direction unless the user explicitly asks.

Accepted visual language:
- warm Hanji-inspired paper (`#F8F5E9` family);
- deep navy (`#001F5B`), Korean green (`#12453A`), restrained gold (`#C1A355`), restrained crimson (`#9C1C2B`);
- editorial serif display typography + modern sans-serif body typography with multilingual fallbacks;
- thin editorial borders, low radii, minimal shadows;
- large image-led moments and generous whitespace;
- premium Korean editorial/lifestyle character without generic SaaS dashboard styling;
- one master design system shared across Home, Personal Color, Hanbok, Culture/Saju, palace discovery, Credits, and contextual help.

Never copy fabricated placeholder business claims from Stitch. Do not claim offline partnerships, “leading analysts,” exclusive access, dermatology booking, Michelin reservations, guaranteed Hanbok inventory, or human concierge fulfillment unless those capabilities are actually implemented and verified.

Implementation plan is recorded in `docs/STITCH_PREMIUM_IMPLEMENTATION_PLAN_2026-08-30.md`.

## 3. Stitch redesign implementation — ACTIVE BRANCH
Branch: `korea-concierge/stitch-premium-fullsite-20260830`.

Implemented on the branch so far:
- shared premium tokens, typography, paper texture, header/footer/mobile navigation, responsive shell in `src/app/stitch-premium.css`;
- additional Hanbok matcher, palace route, and feature-specific polish in `src/app/stitch-feature-polish.css`;
- canonical image-led homepage using the accepted editorial composition and only real current product entry points;
- Personal Color browser-local analysis restyled to the accepted editorial result language without replacing its deterministic analysis logic;
- explicit Personal Color → Hanbok undertone URL continuity;
- Hanbok 3-style discovery rebuilt around Princess/Prince, Queen/King, Royal with rights-reviewed palace/ceremony references and no runway/fashion-show primary imagery;
- Hanbok matcher restyled into a premium styling tool while preserving deterministic preference ordering and user override controls;
- Culture/Saju surface restyled into a deep-navy editorial reading layout while retaining existing localized product content;
- Gyeongbokgung guide redesigned as an image-led palace guide with 1H/2H/4H route cards;
- Credits page restyled into the accepted account/credits visual language while retaining the existing authoritative economics data;
- Quick Help restyled as the current contextual concierge surface and made addressable through `#quick-help` links;
- responsive/mobile rules for all currently live product routes;
- 2026-09-02 truthfulness polish: removed the user-facing Personal Color “confidence” percentage because it is an internal heuristic rather than calibrated probability; raw measured/derived observations remain available without presenting false certainty;
- 2026-09-02 Hanbok result polish: removed user-facing `/100`, backdrop `/5`, and comfort `/100` numbers that could read as calibrated quality/confidence; the deterministic rubric is retained only for ranking and the UI presents ordered recommendations plus concrete reasons.

Current live route scope remains:
- `/[locale]`;
- `/[locale]/color`;
- `/[locale]/hanbok`;
- `/[locale]/culture`;
- `/[locale]/explore/gyeongbokgung`;
- `/[locale]/credits`;
- localized Stripe checkout-success route and server APIs.

The Stitch pack includes future Naming Studio and richer AI Concierge concepts. There is no production Naming Studio route/backend in the current repository tree, so this redesign does not fabricate a live Naming Studio implementation. Implement that as a dedicated product slice once its actual input/result contract exists.

## 4. Hanbok 3-style + Personal Color continuity
Primary Hanbok categories are fixed experience labels:
1. **Princess / Prince** — soft, graceful, youthful, photo-friendly palace style;
2. **Queen / King** — elegant, traditional, dignified formal court-inspired style;
3. **Royal** — the most ornate, ceremonial, dramatic experience style.

The visual library records source URL, license/credit, intrinsic dimensions, and rejects `fashion show` / `runway` fingerprints in `scripts/check-hanbok-visual-contracts.mjs`.

Personal Color continuity is an explicit deterministic product mapping, not an AI confidence score:
- warm → `jadeIvory`;
- neutral → `roseNavy`;
- cool → `moonBlue`.

The user can always override the matcher selection.

## 5. Stripe global payment foundation — CODE SHIPPED, LIVE ACTIVATION DEFERRED
Foundation already exists:
- `src/lib/payments/catalog.ts`;
- `src/lib/payments/stripe.ts`;
- `/api/checkout/stripe`;
- `/api/stripe/webhook`;
- localized checkout-success route;
- payment contract tests and `.env.example`.

Do not ask the user to configure live Stripe while product/design work is the current priority. The verified webhook does not yet represent full durable credit/entitlement fulfillment; persistence/idempotent fulfillment must be attached before treating live payment return as entitlement grant.

## 6. Saju deterministic/explainable foundation
Preserve the existing deterministic contracts:
- exact / approximate / unknown birth time;
- explicit IANA timezone/DST states;
- no silent nonexistent-time shifts or ambiguous-time selection;
- explicit day-boundary/true-solar policies;
- deterministic core separate from optional narrative explanation;
- uncertainty represented as invariant/candidates/unavailable rather than invented probability;
- whitelist-only narrative payloads that strip raw personal inputs.

The current Stitch pass changes presentation only; it must not weaken these contracts.

## 7. Authoritative credits foundation
Existing credit ledger/economics/authorization modules remain authoritative. Preserve append-only entries, idempotent operations, no-negative-balance invariants, and server-only capture/release/refund boundaries.

Do not invent new credit prices or feature costs for visual completeness. Existing configured values are displayed only where they already come from repository economics data.

## 8. Production reliability
The prior Cloudflare 1033/530/502 incident was formally closed after independent healthy scheduled samples. Private CI remains the reliability source of truth. Any sampled 1033/530/502 reopens reliability priority.

Runtime understanding to preserve:
- production app: `korea-concierge.service` on `127.0.0.1:3100`;
- Korea tunnel and unrelated Docker/n8n tunnel are separate; never stop the Docker connector as a generic Korea repair step;
- runner remains without general sudo/Docker privileges;
- public repository must not be attached directly to the production runner.

Before merge/deploy of the current redesign: verify the exact feature SHA on the private MiniPC runner, require build/contracts PASS, merge through PR, deploy the exact merged SHA, then run local/public/sitemap P0 preflight and verify no 530/1033/502 samples.

## 9. Immediate next priority
1. Exact-SHA MiniPC CI is pinned to the latest redesign head. As of 2026-09-02 the self-hosted jobs are queued rather than executing, so merge/deploy remains gated on runner reconnection; do not bypass this by attaching the public repository to production or weakening the private exact-SHA gate.
2. When the runner executes, fix any build/contract failures without weakening gates.
3. PR/merge only after exact feature SHA verification passes.
4. Deploy exact merged SHA through private deploy controls.
5. Run post-deploy local/public/P0 preflight.
6. After the visual foundation is stable, continue Premium Hanbok generation provider seam/photo consent pipeline and build Naming Studio from an actual product contract rather than a decorative mock.
7. Stripe live onboarding later.

## 10. User action currently required
**None for application code.** Keep the runner issue isolated from product changes. Ask only when a real provider credential, live Stripe setup, or narrowly scoped privileged MiniPC operation is the final blocker.
