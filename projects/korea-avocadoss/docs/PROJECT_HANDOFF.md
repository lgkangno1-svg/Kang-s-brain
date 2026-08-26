# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / verification  
**Last completed slice:** Step 2C-1C — native P0 Credits route  
**Exact next slice:** Step 2C-2 verification prerequisite — establish executable `check:i18n` + production build evidence before SEO/locale cutover

> Cross-session/cross-AI state file. Before every material run inspect latest `main`, recent commits, current project tree, this file and `IMPLEMENTATION_ROADMAP.md`. Assume another AI/developer may have changed the repository. Never restore remembered older code over newer work without understanding it. Update this file in the same run whenever implementation status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It connects practical Korea discovery, Gyeongbokgung planning, personal-color/Hanbok styling and K-Culture without becoming an expensive generic chatbot.

Core goals: genuinely localized; useful for free before payment; deterministic/browser-local whenever practical; privacy-first for photos/birth data; source-validated for changing travel facts; server-authoritative credits/payments; aggressive token/provider-cost optimization; public pages crawlable/answer-first and private/personal/payment content noindex where appropriate.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choices outrank market defaults. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics stay separable. English is global fallback.
- **Saju:** exact / approximate / unknown birth time are valid. Never fabricate/AI-guess missing hour. Unknown time only returns deterministic non-hour components and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized, button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict authorization/validation; immutable/idempotent wallet; verified payment callbacks; rate limits; dependency pinning; data minimization; EXIF stripping before remote sensitive-media use; ZDR restrictions; safe logs; prompt instruction/data separation; source validation for AI-returned place facts; secrets server-only; no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model. Compact payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 cost telemetry without sensitive bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits shown before every paid action. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. Source-of-truth documents
Read before material changes: `PRD.md`, `ARCHITECTURE.md`, `AI_ROUTING.md`, `CREDIT_ECONOMICS.md`, `SEO_AEO_GEO.md`, `OPEN_SOURCE_DISCOVERY.md`, `INTERNATIONALIZATION_MARKETS.md`, `SECURITY_TOKEN_EFFICIENCY.md`, `IMPLEMENTATION_ROADMAP.md`, `PROJECT_HANDOFF.md`.

## 4. Current architecture
Next.js 16.3.3 + exact `next-intl@4.13.4`. P0 locale URLs are `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`. Locale is allowlisted before dictionary load. Reviewed static dictionaries only; no runtime translation ML.

Migration-only unprefixed legacy routes remain. Locale-aware navigation preserves locale. Redirect/browser-language negotiation/canonical/hreflang/x-default stay disabled until route parity + executable build evidence.

Request messages use a typed recursive deep merge. Feature copy is increasingly modular (`messages/hanbok/{locale}.json`, `messages/credits/{locale}.json`) while shared namespaces such as `Meta` are preserved. `check:i18n` runs P0 parity plus Quick Help, Personal Color, Hanbok and Credits contracts.

## 5. Completed roadmap status
- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and text-expansion safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan, no image upload/provider.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic user-choice matcher, modular messages, no photo/model/provider.

### Step 2C-1C ✅ Credits — source/data-shape review
Completed this run:
- inspected latest main/recent commits/roadmap/handoff and read `CREDIT_ECONOMICS.md` before credits changes;
- confirmed launch authority remains Basic `$7.99 / 120`, Advanced `$14.99 / 400`, Ultra `$24.99 / 1,000`, plus documented one-time refills and fixed feature-credit catalog;
- replaced `/[locale]/credits` English re-export with a native localized Server Component and localized metadata;
- added six P0 `messages/credits/{locale}.json` bundles;
- **numeric prices/credits are not stored in translation files**: the UI reads plans, refill packs and feature credits directly from `src/lib/credits/economics.ts`;
- translated plan descriptions, refill policy, paid feature labels, fixed-credit-before-confirmation behavior, free layer, server-authoritative wallet language, reserve/capture/release behavior, future international payment framing and explicit no-personalized-dynamic-pricing language;
- used locale-aware USD formatting for display without changing the authoritative catalog currency;
- intentionally added no checkout/purchase button because Step 4 auth/wallet and Step 5 payment verification do not exist yet; page is explicitly a pricing preview rather than a fake live checkout;
- request loader deep-merges Credits messages after locale validation;
- P0 parity now includes Credits;
- `check-credits-message-keys.mjs` parses `economics.ts` to derive launch plan IDs and paid feature IDs, then requires corresponding English copy keys. This prevents translation files from becoming a second numeric price authority;
- `npm run check:i18n` includes the Credits contract;
- no subscription, ML customer pricing, payment mutation, AI call, new runtime package or external user-data flow added.

## 6. Latest discovery decision
### GitHub
Fresh ledger search found modern double-entry/reserve-settle/top-up implementations such as `azex-ai/ledger`, which reinforce the current immutable reserve/capture/release direction. They are deferred until Step 4 because adding a Go/service boundary during Step 2 localization creates more operational risk than value. Re-search at Step 4 and compare with minimal Postgres transactions.

### Hugging Face
Dynamic pricing candidates such as `iioos/dynamic-pricing-model` (MIT, ecommerce-oriented) and `PranavSharma/dynamic-pricing-model` (Apache-2.0, ride-pricing regression with real-world limitations) were rechecked.

**Decision:** reject ML pricing. Fixed public launch prices are easier to trust, audit and margin-test; nationality/profile traits never alter customer price.

Full record: `docs/OPEN_SOURCE_DISCOVERY.md`.

## 7. Verification state / blocker
On 2026-08-27 an executable path was attempted again:

`git clone --depth 1 ...` → `npm install --ignore-scripts` → `npm run check:i18n` → `npm run build`

The shell failed at clone with:

`Could not resolve host: github.com`

Therefore executable i18n/build success and production deployment are **not claimed**. Source/data-shape review and GitHub write evidence exist, but Step 2 cutover cannot advance until an executable environment validates the current project.

This is now the highest-value Step 2 blocker. Next run should first inspect whether GitHub Actions/another executable verification path already exists. If not, evaluate and add a minimal pinned CI workflow as a separate reviewable slice, then fix any real TypeScript/i18n/build failures it reveals before changing SEO redirects/canonicals.

## 8. Security / privacy / token / margin impact
- New AI/model/provider calls: **0**.
- New runtime dependencies: **0**.
- New external personal-data transfer: **0**.
- New payment/checkout mutation endpoints: **0**.
- ML/dynamic customer pricing: **0**.
- Authoritative numeric price duplication in locale files: **0**.
- Incremental inference/provider cost: **0**.
- Gross-margin effect: neutral/favorable; localized pricing clarity increased without supplier cost.
- Existing future wallet requirement remains immutable, server-authoritative and idempotent.

## 9. Exact next slice — Step 2C-2 verification prerequisite
1. inspect latest `main`, recent commits, project tree, roadmap and this handoff first;
2. inspect existing GitHub Actions/CI status before adding anything;
3. re-run GitHub + relevant tooling discovery for minimal secure Node/Next.js CI if a workflow is needed;
4. establish executable `npm install` → `npm run check:i18n` → `npm run build` evidence without exposing secrets or adding unnecessary actions/dependencies;
5. fix any real compile/i18n/build regressions found;
6. keep locale redirect, browser-language auto-routing, canonical, hreflang, x-default and legacy-shell removal disabled until green evidence exists;
7. after build proof, perform SEO locale cutover as a separate reviewable slice with rollback awareness;
8. update discovery, roadmap and this handoff.

## 10. Later roadmap / deferred
Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color validation/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung model; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 cost + market expansion.

Deferred: bulk Hanbok visuals unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; locale/canonical cutover before executable evidence; production claims without actual deployment proof.

## 11. Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
