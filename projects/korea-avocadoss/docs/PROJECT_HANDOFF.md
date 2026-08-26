# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-26  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity  
**Last completed slice:** Step 2C-1A — native P0 Personal Color  
**Exact next slice:** Step 2C-1B — native P0 Hanbok route and controls

> This is the cross-session/cross-AI state file. Before every material run inspect latest `main`, recent commits, current project tree, this file and `IMPLEMENTATION_ROADMAP.md`. Assume another AI/developer may have changed the repository. Never restore remembered older code over newer work without understanding it. Update this file in the same run whenever implementation status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or next step changes.

## 1. Product intent and end goal

Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should connect practical Korea travel discovery, Gyeongbokgung planning, personal-color/Hanbok styling and K-Culture experiences without turning into an expensive generic chatbot.

The target product should be:
- genuinely localized for international visitors, not just translated;
- useful for free before asking for payment;
- deterministic/browser-local whenever practical;
- privacy-first for photos and birth information;
- strict about source validation for changing travel/business facts;
- server-authoritative for credits/payments;
- aggressively optimized for AI token/provider cost and gross margin;
- crawlable and answer-first on public pages, noindex where private/personal/payment content requires it.

## 2. Non-negotiable requirements

### International visitors
P0 locales: English (`en`), Simplified Chinese (`zh-CN`), Japanese (`ja`), Traditional Chinese (`zh-TW`), Vietnamese (`vi`), Thai (`th`). P1: Indonesian and Malay. Expand further only from measured demand/current Korea tourism evidence.

Explicit user preference always outranks market defaults. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Keep Taiwan/Hong Kong analytics separable even when both use Traditional Chinese. English is a global fallback, not US-only.

### Saju
Birth time supports exact, approximate band and `I don't know`. Never fabricate or AI-guess a missing hour. Unknown time returns only deterministic components that do not require the hour pillar and must be clearly reduced-scope and priced lower when monetized. Ask city/timezone only when deterministic conversion needs it and explain why. Raw birth date/time/city/name/account identifiers must never be sent to an LLM; only minimal non-identifying derived structures may be sent.

### Free Quick Help
Must remain 0 credits, 0 AI calls, no external question transfer, P0 localized and button/topic-tree based. No RAG/embeddings/LLM until corpus size plus measured UX proves a need.

### Security / privacy
Strict server authorization and validation; immutable/idempotent wallet operations; verified payment callbacks; rate limits on auth/payment/AI; dependency pinning/review; data minimization; EXIF stripping before any remote sensitive-media use; ZDR/data-collection restrictions; safe logs without sensitive prompt bodies; instruction/data separation for prompt-injection resistance; source verification for AI-returned place/business facts. Secrets stay server-only and never in `NEXT_PUBLIC_*`. Do not guess CSP origins before real integrations exist.

### Token / margin efficiency
Before AI: deterministic calculation → static/curated answer → safe cache → rule ranking/filtering → browser-local compute → cheapest qualified Chinese OpenRouter model. Compact IDs/enums/derived facts only; normally <=5–8 candidates; short feature prompts; structured output; bounded history; partial replans instead of resending whole itineraries; one bounded retry by default; same-model provider fallback before escalation. Record cost/tokens/provider/latency/retry/fallback without sensitive prompt bodies and monitor p50/p95 supplier cost and cost per captured credit.

### Credit economics
`CREDIT_ECONOMICS.md` is authoritative. Launch assumption: one-time Basic / Advanced / Ultra Trip Passes + optional top-ups; no subscriptions or ML personalized pricing without evidence. Fixed credits shown before every paid action. Wallet uses immutable server-authoritative reserve/capture/release/refund semantics and idempotency.

## 3. Source-of-truth documents

Read before material changes:
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/AI_ROUTING.md`
- `docs/CREDIT_ECONOMICS.md`
- `docs/SEO_AEO_GEO.md`
- `docs/OPEN_SOURCE_DISCOVERY.md`
- `docs/INTERNATIONALIZATION_MARKETS.md`
- `docs/SECURITY_TOKEN_EFFICIENCY.md`
- `docs/IMPLEMENTATION_ROADMAP.md`
- `docs/PROJECT_HANDOFF.md`

## 4. Current architecture snapshot

Next.js 16.3.3 application with exact `next-intl@4.13.4` pin. P0 locale URLs: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`. Locale is allowlisted before dictionary loading. Localization uses reviewed static dictionaries; runtime translation ML is intentionally absent.

Migration-only unprefixed legacy routes still exist. Locale-aware navigation preserves locale. Redirect/browser-language negotiation/canonical/hreflang/x-default are intentionally disabled until route parity plus executable build evidence exist.

`check:i18n` currently runs:
1. P0 core/public dictionary parity;
2. Quick Help graph/message contract;
3. Personal Color message contract.

Locale text-expansion CSS is loaded for localized surfaces to reduce CJK/Vietnamese/Thai overflow.

## 5. Completed status

### Step 0 ✅
Product/architecture/AI routing/credit economics/SEO/internationalization/security baselines.

### Step 1 ✅
Free deterministic Quick Help, P0 seed dictionaries, 0-AI/0-credit/no sensitive-input path, focus/keyboard/ARIA hardening.

### Step 2A ✅
Pinned i18n dependency, P0 locale registry, validated request loader, no runtime translation model.

### Step 2B ✅ by source/data-shape review
- locale shell, language selector and locale-preserving navigation;
- full P0 Quick Help localization and deterministic parity checks;
- native localized Home and Culture;
- native localized Gyeongbokgung with localized metadata and freshness warning for live facts;
- locale overflow safeguards;
- canonical/hreflang/redirect cutover deferred.

### Step 2C-1A ✅ by source/data-shape review — Personal Color
Completed in the latest run:
- inspected latest main/recent commits/handoff before editing; no concurrent external product change was observed before the slice;
- replaced `/[locale]/color` English legacy re-export with native localized Server Component;
- added locale-specific title/description metadata;
- localized **all interactive ColorScanner UI**, not only the page heading, in all six P0 locales;
- translated upload instructions, result labels, manual corrections, warnings, errors, privacy notice and nine Hanbok palette names/notes;
- changed analysis warnings/errors from English strings into stable typed codes, keeping the calculation engine locale-neutral;
- changed palette data to stable IDs + hex colors, moving human-facing names/notes to dictionaries;
- added `scripts/check-color-message-keys.mjs` and included it in `check:i18n`;
- retained browser-local pixel analysis: selfie is represented by local object URL and sampled on local Canvas; no AI/model/API/image upload was introduced;
- kept explicit statement that this is a lighting-dependent styling estimate rather than a professional diagnosis;
- kept explicit prohibition on identity, race, ethnicity, nationality, religion, health or attractiveness inference.

## 6. Latest open-source/model decision

GitHub personal-color projects reviewed included older React Native/Teachable Machine approaches and Python/Lab/HSV research-style implementations. They demonstrate possible season-classification approaches but do not justify replacing the current local preview due to maintenance/validation/dependency/privacy concerns.

Hugging Face search found general skin/image classification models, including skin-type classifiers, but they are not validated specifically for personal-color styling and would add image-transfer/model/fairness/provenance cost. **Decision: do not add a remote or bundled ML model during locale migration.** Revisit at Step 6 only if a premium vision path shows measurable incremental value, with consent/ZDR and representative validation.

## 7. Verification state / blockers

Available evidence:
- GitHub writes for native Color page, localized scanner refactor, locale-neutral analyzer codes, palette IDs, six P0 dictionaries and message-contract build gate;
- source review confirms the scanner still uses local `createImageBitmap`, Canvas sampling and local object URLs, with no provider/API integration added;
- P0 dictionary schemas were updated with matching Color/ColorScanner/Meta structures by source review.

Executable limitation:
- the available shell still cannot resolve `github.com` (`Could not resolve host: github.com`);
- therefore clean clone → `npm install` → `npm run check:i18n` → `npm run build` cannot be proven in this environment;
- production build success and production deployment are **not claimed**.

A future run with a working checkout/network must execute those commands before any build-dependent Step 2 cutover gate is upgraded.

## 8. Security / privacy / token / margin impact of latest slice

- New AI calls: **0**.
- New translation/model calls: **0**.
- New runtime dependency: **0**.
- New external image/user-data transfer: **0**.
- Credit/payment behavior: unchanged.
- Incremental inference/provider cost: **0**.
- Margin impact: favorable/neutral; localized free local computation resolves more user need without supplier cost.
- Privacy impact: improved clarity; engine now emits non-human codes rather than English text and the UI explicitly says the selfie remains in-browser for the preview.
- Fairness/safety: no demographic/sensitive inference was added; manual correction remains available because lighting and simple pixel heuristics can be wrong.

## 9. Exact next slice

**Step 2C-1B — native P0 Hanbok.** Do not jump to Saju/wallet/payment unless a regression/security problem forces it.

Next run should:
1. inspect latest main, recent commits, project tree and this handoff;
2. inspect current `/[locale]/hanbok`, legacy Hanbok components/data and all user-facing strings;
3. rerun GitHub + Hugging Face discovery for Hanbok/recommendation logic;
4. convert the locale route and every interactive Hanbok control/result to P0 native copy;
5. keep recommendation deterministic before AI and do not start bulk visual asset generation;
6. add localized metadata and a message-contract checker if useful;
7. review CJK/Thai/Vietnamese overflow, keyboard use and form labels;
8. keep paid/free boundaries explicit and do not enable locale/canonical cutover;
9. update `OPEN_SOURCE_DISCOVERY.md`, roadmap and this handoff.

After Hanbok, Step 2C-1C localizes Credits using `CREDIT_ECONOMICS.md`. Only after all required locale routes plus executable build evidence should Step 2C-2 enable canonical/hreflang/x-default, locale sitemap and safe locale negotiation/remove legacy shell.

## 10. Later roadmap

- Step 3 deterministic Saju core;
- Step 4 auth + immutable authoritative wallet;
- Step 5 international payment foundation;
- Step 6 Personal Color validation/premium boundary;
- Step 7 deterministic Hanbok recommendation v1;
- Step 8 verified Gyeongbokgung place model/routing;
- Step 9 compact-cost itinerary/premium concierge;
- Step 10 analytics, p50/p95 cost/margin monitoring and P1/P2 expansion.

## 11. Deferred / do not start yet

- bulk Hanbok visual asset generation/collection unless user separately requests it;
- subscriptions without conversion evidence;
- ML personalized pricing;
- runtime translation models;
- RAG/embeddings/LLM for current Quick Help;
- guessed CSP origins;
- automatic locale redirect/canonical cutover before parity + build evidence;
- production claims without executable evidence.

## 12. Current user action required

**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their corresponding gates.
