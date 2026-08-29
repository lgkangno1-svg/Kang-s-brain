# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-29  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Phase:** sellable-MVP acceleration + Step 3 deterministic/explainable K-Culture in parallel  
**Current verified production application SHA:** `9dc8166c937699451ece935b3375030941b01e4a`  
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

## 3. Hanbok Core 3-Style Redesign & Matcher Preset Architecture — SHIPPED
Replaced the runway-heavy 6-style layout with the 3 quintessential Korean palace experience styles that international visitors intuitively seek:
1. **Princess / Prince**: Soft, graceful, youthful pastel layers, classic palace photo-friendly look;
2. **Queen / King**: Elegant, traditional, dignified formal court-inspired look with richer silk colors;
3. **Royal**: Luxurious, ornate, ceremonial, highly decorated premium look with gold-leaf accents and dramatic photographic presence.

Files:
- `src/features/hanbok/hanbok-visual-library.ts` (structured 3 categories with curated feminine & masculine references, 4:5 aspect ratio, and matcher presets);
- `src/features/hanbok/hanbok-visual-inspiration.tsx` + `hanbok-visual-inspiration.module.css` (consistent 4:5 image cards, feminine/masculine toggle, source links, direct URL preset linking);
- `src/features/hanbok/hanbok-matcher.tsx` (URL preset consumption via `?hanbokStyle={style}#hanbok-matcher`, applied preset badge);
- `messages/hanbok-visual/{en,zh-CN,ja,zh-TW,vi,th}.json` + `messages/hanbok/{en,zh-CN,ja,zh-TW,vi,th}.json` (complete 6-locale parity with 402 leaf keys);
- `scripts/check-hanbok-visual-contracts.mjs` (executable contract test ensuring 3 categories, valid metadata, and preset IDs).

## 4. Stripe Global Payment Primary Foundation — SHIPPED
Stripe is confirmed as the primary global payment provider for Korea Concierge. Implemented server-authoritative Stripe Checkout Sessions and HMAC-SHA256 signature verification.

Files:
- `src/lib/payments/catalog.ts` (product catalog: `premium_hanbok_match`, `premium_naming_studio`, `trip_pass_basic`, `trip_pass_advanced`, `trip_pass_ultra`; server-mapped Price ID resolution);
- `src/lib/payments/stripe.ts` (server checkout session creation, timing-safe HMAC-SHA256 webhook signature verification with 300s replay tolerance, zero-PII metadata);
- `src/app/api/checkout/stripe/route.ts` (secure checkout endpoint rejecting client price/amount injection);
- `src/app/api/stripe/webhook/route.ts` (verified webhook endpoint for `checkout.session.completed`);
- `src/app/[locale]/checkout/success/page.tsx` + `layout.tsx` (clean localized order confirmation page);
- `messages/public/{en,zh-CN,ja,zh-TW,vi,th}.json` (complete CheckoutSuccess copy in all 6 locales);
- `scripts/check-stripe-payment-contracts.mjs` (security tests: client price injection prevention, webhook signature verification, replay protection, missing config handling);
- `.env.example` (clean environment variable template for Stripe keys and Price IDs).

## 5. Step 3A Saju Deterministic Core & Explainable Foundations — SHIPPED & PRODUCTION VERIFIED
Production includes:
- exact / approximate / unknown birth-time contracts;
- unknown time as valid reduced scope, never a guessed hour;
- IANA timezone required for exact/approximate local clock; longitude additionally required for true-solar mode;
- whitelist-only narrative payloads that strip raw DOB/time/city/timezone/longitude/name/account identifiers;
- explicit `midnight` / `jasi` / `splitJasi` and `civil` / `true-solar` policies;
- trusted Ipchun/Jingzhe boundary fixtures outside unresolved official-source minutes;
- deterministic late-Zi semantics and NOAA/GML true-solar correction with `dayOffset`;
- historical IANA wall-clock resolver returning explicit `unique` / `ambiguous` / `nonexistent` states;
- 20+ automated tests in `scripts/check-saju-deterministic-core.mjs` and build gates;
- no runtime Saju calculator dependency.

## 6. Authoritative wallet / credits — PRODUCTION FOUNDATION
- `src/lib/credits/ledger.ts`, `src/lib/credits/authorization.ts`, `src/lib/credits/economics.ts`.
- Invariants: positive safe-integer credits, append-only entries, no negative balance, server-only capture/release/refund.

## 7. Next priority
- Complete Stripe account onboarding and configure actual Stripe Price IDs in server environment.
- Connect server-side webhook fulfillment to the authoritative credit ledger when database persistence is attached.
- Add photo upload & consented vision analysis pipeline for Premium Hanbok Match.

## 8. User action currently required
**None for core code/build.** When ready for live transactions, provide live/test Stripe API keys and Product/Price IDs in deployment environment.
