# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / SEO and document-language cutover  
**Last completed slice:** Step 2C-3 — P0 canonical/hreflang/x-default + localized sitemap/robots  
**Merged Step 2C-3 commit:** `eac3f59869119db047193491681e4993d4d96b96`  
**Exact next slice:** Step 2C-4 — fix document-level `<html lang>` for P0 locale pages while preserving the migration-only legacy boundary; do not combine browser-language auto-routing or legacy deletion into the same patch.

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
- Locale allowlist runs before dictionary loading; reviewed static dictionaries only; no runtime translation ML.
- Modular messages use recursive deep merge. `P0Locale` is the production compile-time boundary; broader `SupportedLocale` must not leak into production routing.
- Migration-only unprefixed legacy routes remain. Locale-aware navigation preserves locale.
- Legacy Quick Help receives only English messages through a local `NextIntlClientProvider` with `Asia/Seoul`; locale-prefixed routes use their normal locale provider.
- **Known remaining defect:** shared root layout still renders `<html lang="en">`, so non-English P0 pages have localized URL/content/metadata but incorrect document language. Step 2C-4 exists specifically to fix this safely.

## 5. Completed roadmap
- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and overflow safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic matcher.
- Step 2C-1C ✅ native P0 Credits, authoritative deterministic economics, no fake checkout.
- Step 2C-2 ✅ executable GitHub Actions i18n + production-build gate.
- Step 2C-3 ✅ P0 canonical/hreflang/x-default + localized sitemap/robots cutover.

## 6. CI / verification baseline
Workflow: `.github/workflows/korea-concierge-ci.yml`.

Security controls: SHA-pinned official checkout/setup-node, `contents: read`, no repository secrets, no persisted checkout credentials, Node 22, Next telemetry disabled, 15-minute timeout, path scoping and concurrency cancellation. Install currently uses `npm install --ignore-scripts --no-audit --no-fund` because no reviewed lockfile exists.

Step 2C-2 baseline run `32995294201` proved all P0 message contracts, TypeScript, production compilation and 46/46 static/SSG pages.

Step 2C-3 evidence:
- PR #3 `seo: complete P0 locale canonical and sitemap cutover`;
- initial code run `32999919664` — **SUCCESS**;
- final documentation-inclusive run `33000199395` — **SUCCESS** for checkout/setup/install, all P0 localization contracts and Next.js production build;
- PR #3 squash-merged to `main` as `eac3f59869119db047193491681e4993d4d96b96`.

This is executable build evidence, **not** production deployment/DNS/indexing/Search Console evidence.

No npm lockfile is committed. Dependency resolution is not fully reproducible. Generate/review/commit a lockfile only from a trusted executable environment in a separate supply-chain slice; never fabricate one manually.

## 7. Step 2C-3 implementation
Centralized SEO helper owns:
- `https://korea.avocadoss.co.kr` production origin;
- complete public route shapes: Home, Color, Hanbok, Gyeongbokgung, Culture, Credits;
- BCP47 hreflang mapping `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`;
- localized URL generation and reciprocal alternates.

Every complete localized public page now emits self canonical, reciprocal P0 hreflang and `x-default` → English.

`sitemap.ts` emits only **36 canonical P0 URLs** (6 route shapes × 6 locales), removing migration-only unprefixed URLs. Sitemap alternates reuse the same centralized URL map.

False `lastModified: new Date()` build-time freshness was removed. Add last-modified only from real content-review timestamps.

`robots.ts` permits public crawling including `OAI-SearchBot` and protects both unprefixed/P0-prefixed future account, saved, checkout and personal-result paths.

Browser-language redirect, automatic market inference and LegacyShell deletion were not included.

## 8. Discovery decision
GitHub review reconfirmed `amannn/next-intl` plus built-in Next.js `Metadata`/`MetadataRoute` APIs are sufficient; no `next-sitemap` or second SEO/i18n dependency was added.

The Hugging Face connector search failed during this slice; fallback public search surfaced examples rather than a model that can deterministically validate canonical/hreflang/sitemap correctness. ML involvement was rejected because this is deterministic configuration/build validation. Full sources/rationale are logged in `OPEN_SOURCE_DISCOVERY.md`.

## 9. Security / privacy / token / margin impact
- application AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- new customer-data transfer: **0**;
- secrets/payment/wallet behavior changed: **0**;
- ML/dynamic pricing: **0**;
- incremental supplier inference cost: **0**;
- public discovery improved while future sensitive route crawler exclusions became stricter.

## 10. Exact next action — Step 2C-4 only
1. Inspect fresh `main`, recent commits, project tree, handoff and roadmap.
2. Re-search GitHub + Hugging Face before architecture changes.
3. Research current Next.js/next-intl patterns for locale-correct document `<html lang>` while legacy routes coexist.
4. Fix P0 document language (`en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`) without weakening static generation or Quick Help provider boundaries.
5. Preserve working unprefixed legacy URLs during this slice unless a tested root-layout/route-group architecture proves safe.
6. Do **not** combine browser-language auto-redirect, legacy deletion and document-language restructuring in one patch.
7. Re-run P0 i18n + production build and canonical/sitemap regressions; update this handoff.

After document-language correctness is proven, decide in another rollback-aware slice whether unprefixed legacy duplicates should redirect/retire. Explicit user locale choice always outranks browser/market inference.

## 11. Later / deferred
Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color hardening/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung data; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 AI cost + market expansion.

Deferred: bulk Hanbok visuals unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; production claims without deployment evidence.

## 12. Mandatory future workflow
Inspect latest GitHub state → read roadmap/handoff → preserve newer work → run GitHub/Hugging Face discovery → implement one reviewable slice → regression-check navigation/mobile/accessibility/i18n/privacy/security/cost/SEO/dependencies → distinguish source/build/deploy evidence → update source docs + this handoff → commit clearly.

## 13. Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
