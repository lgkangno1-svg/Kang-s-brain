# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / SEO and migration-boundary cleanup  
**Last completed slice:** Step 2C-5 — deterministic retirement of unprefixed public duplicates through server-side permanent redirects  
**Current PR:** #5 `routing: retire unprefixed Korea Concierge duplicates`  
**Exact next slice after merge:** Step 2C-6 — remove only the now-shadowed legacy implementation while preserving the explicit backwards-compatible redirect map and all P0 gates.

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
- `[locale]/layout.tsx` owns P0 root documents and correct BCP47 `<html lang>` values: `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`.
- The migration-only `(legacy)` root/pages still exist in source for one rollback-aware interval, but Step 2C-5 makes them unreachable to normal incoming requests because Next.js config redirects run before filesystem routing.
- `config/legacy-redirects.json` is the authoritative backwards-compatible unprefixed URL map. It maps only known public duplicates directly to the English canonical equivalent.
- There is **no browser-language, IP, nationality or market inference** in these redirects. Explicit locale URLs remain untouched.

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
- Step 2C-4 ✅ correct P0 document language with generated-build verification.
- **Step 2C-5 ✅ deterministic legacy duplicate retirement with executable HTTP redirect verification.**

## 6. Step 2C-5 decision and implementation
Current Next.js 16 and Google Search migration guidance were rechecked first. Both support server-side permanent redirects for known URL moves. Next.js `next.config.ts` `redirects()` with `permanent: true` returns HTTP 308 and is evaluated before filesystem pages.

The exact mappings are:
- `/` → `/en`
- `/color` → `/en/color`
- `/hanbok` → `/en/hanbok`
- `/credits` → `/en/credits`
- `/culture` → `/en/culture`
- `/explore/gyeongbokgung` → `/en/explore/gyeongbokgung`

The mapping is data, not duplicated routing logic: `config/legacy-redirects.json` is imported by `next.config.ts` and read by `scripts/check-legacy-redirects.mjs`.

Why English: these URLs were the old English/unprefixed surface, while Step 2C-3 already established locale-prefixed URLs as canonical. Sending an old English URL directly to the equivalent `/en/...` path preserves intent without guessing the visitor's language. A user who explicitly selected `/ja`, `/zh-CN`, etc. is not affected.

Why 308: the move is now intentional and canonical, and Google recommends permanent server-side redirects for URLs that have permanently moved. Direct mapping avoids redirect chains.

Why legacy source remains temporarily: this slice retires the external URL boundary but leaves the old files as a rollback reserve. Step 2C-6 can remove unreachable implementation after the redirect gate has green executable evidence. This keeps the change reversible and prevents a routing architecture deletion from being mixed with SEO migration behavior.

## 7. CI / executable verification
Workflow: `.github/workflows/korea-concierge-ci.yml`.

Existing controls remain: SHA-pinned official checkout/setup-node, `contents: read`, no repository secrets, no persisted checkout credentials, Node 22, Next telemetry disabled, 15-minute timeout, path scoping and concurrency cancellation. Install remains `npm install --ignore-scripts --no-audit --no-fund` until a reviewed lockfile exists.

Existing gates still cover P0 message contracts, TypeScript/Next production build and generated document languages.

Step 2C-5 adds a production-server test:
1. build Next.js;
2. start `next start` on loopback only;
3. wait for canonical `/en` to return 200;
4. request each legacy source with automatic redirect following disabled;
5. require HTTP **308**;
6. require the exact configured `Location` pathname;
7. require the canonical destination itself to return **200**;
8. probe `/color?utm_source=legacy-check&ref=old-link` and require query parameters to survive the redirect;
9. stop the test server with a shell trap.

Initial PR #5 workflow run **`33010469160`** passed:
- dependency install;
- all P0 localization contracts;
- Next.js 16.3.3 production build;
- generated document-language verification;
- deterministic legacy redirect verification.

Documentation and market-evidence commits were added after that initial run. Merge must occur only after the latest PR head repeats the green gate. This is executable staging/CI evidence, **not** production deployment, DNS cutover, live-domain redirect verification or search-engine indexing evidence.

No npm lockfile is committed. Dependency resolution is not fully reproducible. Generate/review/commit a lockfile only from a trusted executable environment in a separate supply-chain slice; never fabricate one manually.

## 8. Open-source / model / market review
### GitHub / Next.js
Maintained `vercel/next.js` redirect docs/source were reviewed. Built-in redirects are sufficient; no third-party routing/SEO dependency is justified for six static mappings.

### Hugging Face
The installed Hugging Face connector was attempted and returned an unavailable-tool error for redirect/SEO discovery. Public fallback search did not identify any model/dataset/Space that adds value to exact HTTP redirect semantics. Model use was rejected because this is a deterministic protocol/configuration problem.

### KTO / MCST market refresh
KTO's Foreign Tourist Survey remains an annual aggregate evidence source for acquisition channels, activities, spend, satisfaction and travel friction. MCST's 2026 Korea Season specifically includes Thailand and Vietnam with K-food, Hanbok and other K-culture programming. This is directionally consistent with retaining `vi` and `th` as P0. No reviewed evidence justified changing the existing P0/P1 order.

These are aggregate product hypotheses only. They may never override explicit user language/preferences or be used to infer an individual's nationality, ethnicity or religion.

Full sources/rationale are recorded in `OPEN_SOURCE_DISCOVERY.md` and `INTERNATIONALIZATION_MARKETS.md`.

## 9. Security / privacy / token / margin impact
- application AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- new external customer-data transfer: **0**;
- browser-language/IP/nationality inference added: **0**;
- secrets/payment/wallet behavior changed: **0**;
- ML/dynamic pricing: **0**;
- incremental supplier inference cost: **0**.

The only incremental recurring cost is a small deterministic HTTP check inside the already-running CI job. Redirects reduce duplicate crawl/index signals and route old links directly to the established canonical surface.

## 10. Regression review for Step 2C-5
- **Navigation:** canonical P0 navigation unchanged; old direct links terminate at English canonical equivalents.
- **Mobile/accessibility:** rendered P0 components unchanged.
- **i18n:** explicit P0 paths unchanged; no locale inference added.
- **Quick Help:** canonical locale Quick Help remains the existing 0-credit/0-AI tree.
- **Privacy/security:** no new input collection or external transfer; redirect map is static and same-origin.
- **Credits/payment:** no pricing, ledger, checkout or provider behavior changed.
- **Performance:** one direct redirect hop for old URLs; no chain and no new runtime package.
- **SEO/AEO/GEO:** old duplicates now send a permanent server-side canonicalization signal; sitemap still contains canonical localized URLs only.
- **Analytics:** query-string preservation is explicitly tested so existing campaign parameters on old links survive the migration.
- **Supply chain:** no dependency added; existing missing-lockfile risk remains unchanged.

## 11. Exact next action — Step 2C-6 only
1. Inspect fresh `main`, recent commits, this handoff and roadmap; confirm PR #5 is merged and no concurrent routing change appeared.
2. Re-search GitHub + Hugging Face before cleanup.
3. Confirm the six redirect mappings remain the intended permanent public behavior.
4. Find every live import/reference to `(legacy)`, `LegacyShell` and the legacy-only English Quick Help provider.
5. Remove only unreachable legacy page implementation that is no longer needed for routing.
6. Keep `config/legacy-redirects.json` and executable redirect checks as backwards-compatible URL support.
7. Update generated-page expectations: do not hardcode the old 46-page count after deletion.
8. If root metadata files or multiple-root requirements need a minimal structural layout, retain the smallest safe shell rather than forcing removal.
9. Do not add browser-language negotiation, IP geolocation or market inference in this cleanup.
10. Preserve P0 sitemap/canonical/hreflang, document languages, locale switching, Quick Help, mobile/accessibility and green production build.
11. Update discovery, roadmap and this handoff before merge.

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
