# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / SEO and migration-boundary cleanup  
**Last completed slice:** Step 2C-5 — deterministic retirement of unprefixed public duplicates through server-side permanent redirects  
**Merged to main:** `f8ab937859080dec852a033114e23ab4cf724575` (PR #5)  
**Merge-main CI:** run `33010888977` — SUCCESS  
**Exact next slice:** Step 2C-6 — remove only the now-shadowed legacy implementation while preserving the explicit backwards-compatible redirect map and all P0 gates.

> This is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, current project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Assume another AI/developer may have changed the repository. Never restore remembered older code over newer work without understanding it. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or the next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should be genuinely localized, useful before payment, deterministic/browser-local before AI, privacy-first for photos/birth data, source-validated for changing travel facts, server-authoritative for future wallet/payment operations, cost-controlled for AI and crawlable/answer-first on public pages.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choices outrank browser/market defaults. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics remain separable. English is a global fallback.
- **Saju:** exact / approximate / unknown birth time are all valid. Never fabricate or AI-guess a missing hour. Unknown time returns only deterministic non-hour components and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to an LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized, button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, EXIF stripping before future remote sensitive-media use, ZDR restrictions, safe logs, prompt instruction/data separation, source validation for AI-returned place facts, server-only secrets, no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model. Compact payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 telemetry without sensitive prompt bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits are shown before paid actions. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. Source-of-truth documents
Read before material changes: `PRD.md`, `ARCHITECTURE.md`, `AI_ROUTING.md`, `CREDIT_ECONOMICS.md`, `SEO_AEO_GEO.md`, `OPEN_SOURCE_DISCOVERY.md`, `INTERNATIONALIZATION_MARKETS.md`, `SECURITY_TOKEN_EFFICIENCY.md`, `IMPLEMENTATION_ROADMAP.md`, `PROJECT_HANDOFF.md`.

## 4. Current architecture
- Next.js **16.3.3** + exact `next-intl@4.13.4`.
- Production P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- P1/P2 remain research registry values and must not widen production routing until their own localization gate.
- Static reviewed dictionaries only; no runtime translation ML. Modular messages use recursive deep merge.
- `P0Locale` is the production compile-time boundary; broader `SupportedLocale` must not leak into production routing.
- Complete localized public surfaces: Home, Personal Color, Hanbok, Gyeongbokgung, K-Culture, Credits.
- Complete P0 public URLs have self-canonical, reciprocal hreflang and `x-default` → English. Sitemap contains 36 canonical P0 URLs.
- `[locale]/layout.tsx` owns P0 root documents and correct BCP47 `<html lang>` values: `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`.
- `config/legacy-redirects.json` is the authoritative backwards-compatible unprefixed URL map. It maps only known public duplicates directly to their English canonical equivalent.
- The `(legacy)` root/pages still exist in source as a short rollback reserve, but incoming public requests are intercepted by Next.js config redirects before filesystem routing.
- There is **no browser-language, IP, nationality or market inference** in these redirects. Explicit locale URLs are untouched.

## 5. Completed roadmap
- Step 0 ✅ product/architecture/cost/SEO/international/security baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and overflow safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic matcher.
- Step 2C-1C ✅ native P0 Credits, deterministic authoritative pricing display, no fake checkout.
- Step 2C-2 ✅ executable GitHub Actions i18n + production-build gate.
- Step 2C-3 ✅ P0 canonical/hreflang/x-default + localized sitemap/robots cutover.
- Step 2C-4 ✅ correct P0 document language with generated-build verification.
- **Step 2C-5 ✅ deterministic legacy duplicate retirement with executable HTTP redirect verification.**

## 6. Step 2C-5 implementation
Current Next.js 16 redirect behavior and Google Search migration guidance were rechecked before the routing change. Known old English/unprefixed URLs now map directly to established English canonical paths:

- `/` → `/en`
- `/color` → `/en/color`
- `/hanbok` → `/en/hanbok`
- `/credits` → `/en/credits`
- `/culture` → `/en/culture`
- `/explore/gyeongbokgung` → `/en/explore/gyeongbokgung`

The mapping is centralized in `config/legacy-redirects.json`. `next.config.ts` imports this map and exposes it via `redirects()`. Every rule is `permanent: true`, which Next.js emits as HTTP 308 before filesystem routing.

English is deliberate: the old unprefixed URLs were the former English surface. Redirecting them to `/en/...` preserves old-link intent without guessing the visitor's language. Explicit `/ja`, `/zh-CN`, `/vi`, etc. choices are never overridden.

The legacy source files were intentionally not deleted in Step 2C-5. This separates SEO/URL migration from structural deletion and leaves one rollback-safe interval. Step 2C-6 may remove the now-unreachable implementation only after rechecking fresh main and dependencies/imports.

## 7. Executable verification
Workflow: `.github/workflows/korea-concierge-ci.yml`.

Existing controls remain: SHA-pinned official checkout/setup-node, `contents: read`, no repository secrets, no persisted checkout credentials, Node 22, Next telemetry disabled, 15-minute timeout, path scoping and concurrency cancellation. Install remains `npm install --ignore-scripts --no-audit --no-fund` until a reviewed lockfile exists.

Step 2C-5 added `scripts/check-legacy-redirects.mjs` and a production-server CI step. It:
1. starts the built app with `next start` on loopback;
2. waits for canonical `/en` to return 200;
3. requests every legacy source without auto-following redirects;
4. requires HTTP **308**;
5. requires the exact configured `Location` destination;
6. requires every canonical destination to return **200**;
7. verifies old-link query parameters survive the redirect;
8. kills the temporary test server reliably.

Evidence:
- initial implementation PR run `33010469160` — all P0 contracts, production build, document-language checks and redirect checks succeeded;
- latest PR-head run `33010774475` on `7f6fcf234b426d5e88bb1f9ce665fbdc6a394359` — **SUCCESS**, including every redirect check;
- PR #5 squash-merged as `f8ab937859080dec852a033114e23ab4cf724575`;
- post-merge main run `33010888977` — **SUCCESS** across install, P0 localization contracts, Next.js production build, generated document languages and deterministic legacy redirects.

This is executable CI/build evidence. It is **not** proof of production deployment, DNS cutover, live-domain HTTP behavior, Google indexing or Search Console state.

No npm lockfile is committed. Dependency resolution is not fully reproducible. Generate/review/commit a lockfile only from a trusted executable environment in a separate supply-chain slice; never fabricate one manually.

## 8. Open-source / model / market review
### GitHub / Next.js
Maintained `vercel/next.js` redirect docs/source and Google Search permanent-redirect migration guidance were reviewed. Framework-native redirects are sufficient; no third-party routing/SEO dependency is justified for six static mappings.

### Hugging Face
The installed Hugging Face connector was attempted for redirect/SEO discovery but returned an unavailable-tool error. Public fallback search did not identify any model/dataset/Space that adds value to exact HTTP redirect semantics. Model use was rejected because this is a deterministic protocol/configuration problem.

### KTO / MCST market refresh
KTO's Foreign Tourist Survey remains an aggregate evidence source for information channels, activities, spend, satisfaction and travel friction. MCST's 2026 Korea Season includes Thailand and Vietnam with K-food, Hanbok and other K-culture programming. No reviewed evidence justified changing the existing P0/P1 order; `vi` and `th` remain P0.

These are aggregate product hypotheses only. They may never override explicit user language/preferences or be used to infer an individual's nationality, ethnicity or religion. Full rationale is recorded in `OPEN_SOURCE_DISCOVERY.md` and `INTERNATIONALIZATION_MARKETS.md`.

## 9. Security / privacy / token / margin impact
- application AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- new external customer-data transfer: **0**;
- browser-language/IP/nationality inference added: **0**;
- secrets/payment/wallet behavior changed: **0**;
- ML/dynamic pricing: **0**;
- incremental supplier inference cost: **0**.

The only recurring cost added is a small deterministic HTTP verification inside the existing CI job. Redirects reduce duplicate crawl/index signals and route old campaign links directly to canonical pages; query preservation is tested.

## 10. Regression review
- **Navigation:** canonical P0 navigation unchanged; old public links terminate at English canonical equivalents.
- **Mobile/accessibility:** rendered canonical P0 components unchanged.
- **i18n:** explicit P0 paths untouched; no locale inference added.
- **Quick Help:** remains the localized 0-credit/0-AI deterministic tree.
- **Privacy/security:** no new input collection or external transfer; redirect map is static and same-origin.
- **Credits/payment:** no price, ledger, checkout or provider behavior changed.
- **Performance:** exactly one direct redirect hop for old URLs; no redirect chain and no new runtime package.
- **SEO/AEO/GEO:** old duplicates now emit a permanent server-side move signal; sitemap remains canonical-localized only.
- **Analytics:** query parameters are explicitly preserved by executable test.
- **Supply chain:** no dependency added; existing missing-lockfile risk remains unchanged.

## 11. Exact next action — Step 2C-6 only
1. Inspect fresh `main`, recent commits, this handoff and roadmap; assume concurrent work may exist.
2. Re-search GitHub + Hugging Face before cleanup.
3. Confirm the six redirect mappings remain the intended permanent public behavior.
4. Find every live import/reference to `(legacy)`, `LegacyShell` and the legacy-only English Quick Help provider.
5. Remove only unreachable legacy page implementation that is no longer needed for routing.
6. Keep `config/legacy-redirects.json` and executable redirect checks as backwards-compatible URL support.
7. Update generated-page expectations; do not assume the old 46-page total after deletion.
8. If root metadata files or Next multiple-root requirements need a minimal structural shell, retain the smallest safe shell rather than force a risky architecture change.
9. Do not add browser-language negotiation, IP geolocation or market inference in this cleanup.
10. Preserve P0 sitemap/canonical/hreflang, document languages, locale switching, Quick Help, mobile/accessibility and green production build.
11. Update `OPEN_SOURCE_DISCOVERY.md`, `IMPLEMENTATION_ROADMAP.md` and this handoff before completion.

## 12. Deferred / do not accidentally start
- bulk Hanbok visual asset generation/collection;
- subscription or ML-personalized pricing;
- runtime translation model;
- RAG/embeddings/LLM for current Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- checkout before authoritative wallet/payment callback foundations;
- guessed CSP origins;
- production-deployment claims without evidence.

## 13. User action currently required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal copy review remain deferred to their corresponding gates.
