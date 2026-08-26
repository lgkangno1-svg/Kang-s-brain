# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / SEO and migration-boundary cleanup  
**Last completed slice:** Step 2C-4 — locale-correct document `<html lang>` with executable generated-HTML verification  
**Exact next slice:** Step 2C-5 — decide and implement the migration-only unprefixed duplicate boundary as a separate rollback-aware change; do not mix browser-language inference into deterministic legacy cleanup.

> Cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, current project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Assume another AI/developer may have changed the repository. Never restore remembered older code over newer work without understanding it. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should be genuinely localized, useful before payment, deterministic/browser-local before AI, privacy-first for photos/birth data, source-validated for changing travel facts, server-authoritative for future wallet/payment operations, cost-controlled for AI and crawlable/answer-first on public pages.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choices outrank browser/market defaults. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics remain separable. English is global fallback.
- **Saju:** exact / approximate / unknown birth time are all valid. Never fabricate or AI-guess missing hour. Unknown time returns only deterministic non-hour components and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to an LLM.
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
- **Document roots now intentionally split:** there is no shared `src/app/layout.tsx`. `[locale]/layout.tsx` is the P0 root document and owns the correct `<html lang>`. `(legacy)/layout.tsx` is the temporary English root for unprefixed duplicate URLs. Route groups do not change public URLs.
- P0 document mapping is `en→en`, `zh-CN→zh-Hans`, `ja→ja`, `zh-TW→zh-Hant`, `vi→vi`, `th→th` from `src/lib/i18n/locales.ts`.
- Unprefixed legacy URLs still exist for rollback/migration safety. They are not canonical sitemap targets. Browser-language auto-routing has **not** been introduced.
- Moving between the two root layouts may cause a full document navigation per Next.js multiple-root behavior; this is acceptable only while the legacy boundary exists and should be considered in Step 2C-5.

## 5. Completed roadmap
- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and overflow safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic matcher.
- Step 2C-1C ✅ native P0 Credits, deterministic authoritative pricing display, no fake checkout.
- Step 2C-2 ✅ executable GitHub Actions i18n + production-build gate.
- Step 2C-3 ✅ P0 canonical/hreflang/x-default + localized sitemap/robots cutover.
- **Step 2C-4 ✅ correct P0 document language with generated-build verification.**

## 6. CI / executable verification baseline
Workflow: `.github/workflows/korea-concierge-ci.yml`.

Security controls: SHA-pinned official checkout/setup-node, `contents: read`, no repository secrets, no persisted checkout credentials, Node 22, Next telemetry disabled, 15-minute timeout, path scoping and concurrency cancellation. Install currently uses `npm install --ignore-scripts --no-audit --no-fund` because no reviewed lockfile exists.

Existing i18n gate checks:
- 6 P0 locales × 283 message leaf keys;
- Quick Help 65 keys;
- Personal Color 38 keys;
- Hanbok 44 keys;
- Credits 3 plans + 11 paid labels sourced from economics.

Step 2C-4 adds post-build `npm run check:document-lang`, which scans generated `.next/server/app/**/*.html` and verifies all generated P0 HTML uses the route’s configured BCP47 language value.

### Step 2C-4 regression evidence
PR #4: `i18n: fix P0 document language shells`.

The first implementation run failed at production build after the legacy pages moved into `(legacy)`. CI found the legacy Personal Color page still imported `messages/public/en.json` with its old relative depth. This was a real migration regression, not a false alarm. The import was corrected and all other moved legacy pages were inspected for the same class of issue.

Run **`33005536571` — SUCCESS** after the fix:
- dependency install: success, 53 packages;
- all existing P0 localization contracts: success;
- Next.js 16.3.3 optimized compilation: success;
- TypeScript: success;
- page data: success;
- static/SSG generation: **46/46**;
- existing unprefixed URLs and all P0 Home/Color/Credits/Culture/Gyeongbokgung/Hanbok routes present in output;
- generated-document verification: **passed for all 6 P0 locales**.

This proves build artifacts have the correct document language. It is **not** production deployment, DNS cutover, live HTTP inspection or search-engine indexing evidence.

No npm lockfile is committed. Dependency resolution is not fully reproducible. Generate/review/commit a lockfile only from a trusted executable environment in a separate supply-chain slice; never fabricate one manually.

## 7. Step 2C-4 discovery decision
Current Next.js Route Groups / multiple-root-layout guidance and current next-intl locale-root examples were rechecked. The chosen architecture uses framework-native route groups and root layouts instead of request pathname/header hacks or another dependency.

The installed Hugging Face connector failed during language-ID discovery, so a fresh public fallback search reviewed `HPLT/OpenLID-v3` and Meta fastText LID. No model was adopted. Document language is known deterministically from a validated locale route; inference adds no correctness and introduces model/license/runtime complexity. Meta’s LID model is also CC-BY-NC-4.0.

Full sources and rationale are logged in `OPEN_SOURCE_DISCOVERY.md`.

## 8. Security / privacy / token / margin impact
- application AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- new external customer-data transfer: **0**;
- browser-language/nationality inference added: **0**;
- secrets/payment/wallet behavior changed: **0**;
- ML/dynamic pricing: **0**;
- incremental supplier inference cost: **0**.

The new document-language check adds only deterministic local CI work after an already-required production build.

## 9. Exact next action — Step 2C-5 only
1. Inspect fresh `main`, recent commits, project tree, this handoff and roadmap.
2. Re-search GitHub + Hugging Face before changing the routing boundary.
3. Research current Next.js redirects and SEO duplicate-retirement guidance.
4. Decide whether known unprefixed public duplicates should remain temporarily or deterministically redirect to the equivalent **English canonical** path.
5. If retiring duplicates, use an explicit route map; do not use nationality/market inference and do not silently override a user’s explicit locale.
6. Keep browser-language suggestion/negotiation separate. Do not combine it with deterministic legacy cleanup.
7. Add executable redirect/route checks before deleting `LegacyShell`, `(legacy)` pages or the English fallback provider.
8. Preserve sitemap/canonical/hreflang behavior, Quick Help, language switching, accessibility/mobile overflow and green production build.
9. Update `OPEN_SOURCE_DISCOVERY.md`, `IMPLEMENTATION_ROADMAP.md` and this handoff in the same run.

## 10. Deferred / do not accidentally start
- bulk Hanbok visual asset generation/collection;
- subscription or ML-personalized pricing;
- runtime translation model;
- RAG/embeddings/LLM for current Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- checkout before authoritative wallet/payment callback foundations;
- guessed CSP origins;
- production-deployment claims without evidence.

## 11. User action currently required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal copy review remain deferred to their corresponding gates.
