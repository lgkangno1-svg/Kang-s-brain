# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / migration cleanup  
**Last completed slice:** Step 2C-6 — shadowed legacy implementation cleanup (branch implementation complete; CI/merge evidence pending)  
**Working branch:** `korea-concierge-step-2c6`  
**Exact next slice after merge:** Step 2C-7 — supply-chain reproducibility and Step 2 gate closure.

> This file is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, the current project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or the next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should be useful before payment, genuinely localized, deterministic/browser-local before AI, privacy-first for photos/birth data, source-validated for changing travel facts, server-authoritative for future wallet/payment operations, cost-controlled for AI and crawlable/answer-first on public pages.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. P1: Indonesian/Malay. Explicit user choice always wins. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics remain separable. English is a global fallback.
- **Saju:** exact / rough / unknown birth time are valid. Never fabricate or AI-guess a missing hour. Unknown time returns deterministic non-hour components only and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to an LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, EXIF stripping before future remote sensitive-media use, ZDR restrictions, safe logs, prompt instruction/data separation, source validation for AI-returned place facts, server-only secrets and no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model. Compact payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 telemetry without sensitive prompt bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits are shown before paid actions. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. Design workflow requirement
For future user-facing screen creation or substantial UI redesign, **Stitch MCP is the design-first tool**. Use Stitch to explore/define the mobile-first UI, then implement the chosen result in the existing Next.js architecture and run accessibility/i18n/performance regression checks.

The currently connected tool/plugin catalog in this execution environment exposes no Stitch MCP endpoint, and installable-plugin search returned no Stitch plugin. Therefore this Step 2C-6 routing cleanup intentionally made **no visual design changes** and does not claim Stitch was used. Re-check Stitch MCP availability before the next UI-design slice rather than silently substituting another design tool.

## 4. Current architecture
- Next.js **16.3.3** + exact `next-intl@4.13.4`.
- Production P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- Static reviewed dictionaries only; no runtime translation ML. Modular messages use recursive deep merge.
- `P0Locale` is the production compile-time boundary; broader research locales must not leak into routing.
- Complete localized public surfaces: Home, Personal Color, Hanbok, Gyeongbokgung, K-Culture, Credits.
- Complete P0 public URLs have self-canonical, reciprocal hreflang and `x-default` → English. Sitemap contains 36 canonical P0 URLs.
- `[locale]/layout.tsx` owns P0 root documents and emits `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`.
- `config/legacy-redirects.json` is the authoritative backwards-compatible unprefixed URL map. It maps six known former English URLs directly to English canonical equivalents via HTTP 308.
- No browser-language, IP, nationality or market inference participates in redirects.

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
- Step 2C-5 ✅ deterministic retirement of old unprefixed duplicates with executable HTTP redirect verification.
- **Step 2C-6 ✅ implementation complete on branch; CI/merge evidence pending.**

## 6. Step 2C-6 implementation
Fresh `main` was inspected at `62329cc069d1af93951c9518a555ada93124255f`; this is the Step 2C-5 documentation-sync commit and no newer concurrent Korea Concierge change was present at branch creation.

Next.js 16 Route Groups/root-layout guidance was rechecked. Because there is no shared top-level `app/layout.tsx`, current guidance says the home route `/` should still be owned by a root group. Deleting `(legacy)` wholesale would therefore be an unnecessary architecture risk.

Implemented cleanup:
- deleted shadowed legacy `/color` page implementation;
- deleted shadowed legacy `/hanbok` page implementation;
- deleted shadowed legacy `/credits` page implementation;
- deleted shadowed legacy `/culture` page implementation;
- deleted shadowed legacy `/explore/gyeongbokgung` page implementation;
- deleted `src/app/LegacyShell.tsx`, removing obsolete English navigation/footer and its legacy-only `NextIntlClientProvider` + Quick Help instance;
- reduced `(legacy)/layout.tsx` to the minimum `<html lang="en"><body>{children}</body></html>` structural root plus global CSS;
- replaced the old full English home UI in `(legacy)/page.tsx` with a defensive `permanentRedirect('/en')` fallback;
- retained `config/legacy-redirects.json` unchanged as the public routing authority; `next.config.ts` still handles the actual known old URLs before filesystem routing and the production HTTP CI test remains authoritative.

There is no hard-coded expectation that the production build must still generate the historical 46 pages. `check-built-document-languages.mjs` discovers generated locale HTML and validates the six P0 document languages dynamically.

## 7. Discovery decision for Step 2C-6
### GitHub / Next.js
Maintained `vercel/next.js` and current Route Groups/root-layout documentation were reviewed. Framework-native structural cleanup is sufficient; no router/migration dependency is justified.

### Hugging Face
The installed Hugging Face search action returned a tool-unavailable error. Fresh public fallback review included `dimsavva/nextjs16` and `iamdyeus/ui-instruct-4k`. These are generic documentation/training data and cannot prove file-system route ownership or redirect behavior.

**Decision:** no model/dataset/Space adoption. This is deterministic source-graph + framework-contract work.

## 8. Executable verification status
Existing workflow: `.github/workflows/korea-concierge-ci.yml`.

Existing controls remain: SHA-pinned official checkout/setup-node, `contents: read`, no repository secrets, no persisted checkout credentials, Node 22, Next telemetry disabled, 15-minute timeout, path scoping and concurrency cancellation.

Expected Step 2C-6 gate after PR creation:
1. dependency install succeeds;
2. all P0 message contracts succeed;
3. Next.js production compilation and TypeScript succeed;
4. generated P0 document languages succeed;
5. built production server still returns 308 for all six configured old URLs;
6. exact destinations still return 200 and query parameters remain preserved.

Until this branch receives green CI and is merged, do **not** claim Step 2C-6 as main-branch complete or production deployed.

## 9. Security / privacy / token / margin impact
- application AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- new external customer-data transfer: **0**;
- browser-language/IP/nationality/market inference added: **0**;
- secrets/payment/wallet behavior changed: **0**;
- ML/dynamic pricing: **0**;
- incremental supplier inference cost: **0**.

Removing the duplicate legacy Quick Help/provider actually reduces unreachable client-side code and maintenance surface. Public URL behavior remains the deterministic redirect map.

## 10. Known remaining technical risk
No npm lockfile is committed. Runtime package versions are explicitly pinned, but full transitive dependency resolution is not reproducible. Do not fabricate a lockfile manually. Step 2C-7 should generate/review one only from a trusted executable environment, then move CI to `npm ci --ignore-scripts` if the evidence is sound.

## 11. Exact next action — Step 2C-7 only
1. Inspect fresh main and Step 2C-6 merge/CI state.
2. Re-search GitHub + Hugging Face for npm/supply-chain alternatives.
3. Generate a real npm lockfile only from a trusted executable environment and review integrity/resolved graph.
4. Review whether dev dependency ranges should be narrowed while preserving known-good Next/React/next-intl versions.
5. Switch CI to deterministic `npm ci --ignore-scripts` only after a reviewed lockfile exists.
6. Rerun P0 contracts, production build, generated document languages and deterministic legacy redirects.
7. If green, close Step 2 and only then begin Step 3 Saju deterministic core.
8. Before Step 3 user-facing UI design, re-check Stitch MCP availability and use it first when available.

## 12. Deferred / do not accidentally start
- bulk Hanbok visual asset generation/collection;
- subscription or ML-personalized pricing;
- runtime translation model;
- RAG/embeddings/LLM for current Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- checkout before authoritative wallet/payment callback foundations;
- browser-language/IP/nationality inference;
- guessed CSP origins;
- production-deployment claims without evidence.

## 13. User action currently required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal copy review remain deferred to their corresponding gates.
