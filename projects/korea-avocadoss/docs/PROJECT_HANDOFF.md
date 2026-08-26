# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / SEO and document-language cutover  
**Last completed slice:** Step 2C-3 — P0 canonical/hreflang/x-default + localized sitemap/robots  
**Exact next slice:** Step 2C-4 — fix document-level `<html lang>` for P0 locale pages while preserving the migration-only legacy boundary; do not combine browser-language auto-routing or legacy deletion into the same patch.

> This is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, current project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Assume another AI/developer may have changed the repository. Never restore remembered older code over newer work without understanding it. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It combines useful free Korea guidance, Gyeongbokgung planning, personal-color/Hanbok styling and K-Culture without becoming an expensive generic chatbot.

Primary goals:
- genuinely localized rather than English UI with translated labels;
- useful before payment;
- deterministic/browser-local before AI;
- privacy-first for photos and birth data;
- source-validated changing travel facts;
- fixed transparent credits and later server-authoritative wallet/payment flows;
- aggressive token/provider-cost control;
- crawlable answer-first public pages and non-indexable private/personal/payment surfaces.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choices outrank browser/market defaults. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics remain separable. English is global fallback.
- **Saju:** exact / approximate / unknown birth time are all valid. Never fabricate or AI-guess missing hour. Unknown time returns only deterministic non-hour components and must be reduced-scope/lower-priced when monetized. Raw birth date/time/city/name/account identifiers never go to an LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized, button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, EXIF stripping before future remote sensitive-media use, ZDR restrictions, safe logs, prompt instruction/data separation, source validation for AI-returned place facts, server-only secrets, no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model. Compact payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 cost telemetry without sensitive bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits shown before paid actions. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. Source-of-truth documents
Read before material changes: `PRD.md`, `ARCHITECTURE.md`, `AI_ROUTING.md`, `CREDIT_ECONOMICS.md`, `SEO_AEO_GEO.md`, `OPEN_SOURCE_DISCOVERY.md`, `INTERNATIONALIZATION_MARKETS.md`, `SECURITY_TOKEN_EFFICIENCY.md`, `IMPLEMENTATION_ROADMAP.md`, `PROJECT_HANDOFF.md`.

## 4. Current architecture
- Next.js **16.3.3** + exact `next-intl@4.13.4`.
- Production P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- P1/P2 codes remain research registry values and must not widen production routing until their own localization gate.
- Locale allowlist runs before dictionary loading; reviewed static dictionaries only; no runtime translation ML.
- Modular messages use recursive deep merge so Hanbok/Credits namespaces do not overwrite shared metadata siblings.
- `P0Locale` is the compile-time production boundary; broader `SupportedLocale` includes research P1/P2 and must not be passed to production routing APIs.
- Migration-only unprefixed legacy routes remain. Locale-aware navigation preserves current locale.
- Legacy shell provides only English Quick Help messages through a local `NextIntlClientProvider` with `Asia/Seoul` specified. Locale-prefixed routes use their normal locale provider.
- **Known remaining architecture defect:** the shared root layout currently renders `<html lang="en">`, so non-English P0 pages do not yet have correct document language even though their URLs/content/metadata are localized. Step 2C-4 exists specifically to fix this safely.

## 5. Completed roadmap status
- Step 0 ✅ product/architecture/security/cost/SEO/international baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and text-expansion safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan, no image upload/provider.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic matcher, no photo/model/provider.
- Step 2C-1C ✅ native P0 Credits, authoritative deterministic economics, no fake checkout.
- Step 2C-2 ✅ executable GitHub Actions i18n + production-build gate.
- Step 2C-3 ✅ P0 canonical/hreflang/x-default + localized sitemap/robots cutover.

## 6. Executable verification baseline
Workflow: `.github/workflows/korea-concierge-ci.yml`.

Controls:
- SHA-pinned official `actions/checkout` and `actions/setup-node`;
- `permissions: contents: read`;
- no repository secrets;
- `persist-credentials: false`;
- Node 22;
- `CI=1`, `NEXT_TELEMETRY_DISABLED=1`;
- 15-minute timeout;
- Korea Concierge path scoping;
- concurrency cancellation;
- dependency install uses `npm install --ignore-scripts --no-audit --no-fund` until a reviewed lockfile exists.

Step 2C-2 green baseline run `32995294201` proved:
- 6 P0 locales × 283 message leaf keys;
- Quick Help 65 keys;
- Personal Color 38 keys;
- Hanbok 44 keys;
- Credits 3 plans + 11 paid labels sourced from economics;
- TypeScript and Next.js production compilation;
- 46/46 static/SSG pages.

No npm lockfile is committed yet. Dependency resolution is therefore not fully reproducible. Generate/review/commit a lockfile only from a trusted executable environment in a separate supply-chain slice; never fabricate one manually.

## 7. Step 2C-3 implementation details
A centralized helper now owns:
- production origin `https://korea.avocadoss.co.kr`;
- complete public locale route shapes: Home, Color, Hanbok, Gyeongbokgung, Culture, Credits;
- BCP47 hreflang mapping: `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`;
- localized public URL generation;
- reciprocal language alternates and `x-default` → English.

Every complete localized public page now emits:
- self canonical;
- reciprocal P0 language alternates;
- `x-default` pointing to the English equivalent.

`sitemap.ts` now emits only **36 canonical P0 URLs** = 6 public route shapes × 6 P0 locales. Migration-only unprefixed routes are removed from sitemap discovery. Sitemap alternates use the same centralized URL generator as page metadata.

The old sitemap assigned `lastModified: new Date()` on every build. That falsely signaled freshness, so it was removed. Add last-modified values only when real content review timestamps exist.

`robots.ts` continues to allow public crawling including `OAI-SearchBot`, but sensitive exclusions now cover unprefixed and P0-prefixed future account/saved/checkout/personal-result paths. No account/payment/result route is currently being newly implemented by this slice.

Browser-language redirect, automatic market inference and LegacyShell deletion were **not** included.

## 8. Step 2C-3 evidence
PR #3: `seo: complete P0 locale canonical and sitemap cutover`.

Workflow run `32999919664` — **SUCCESS** before documentation finalization:
- checkout/setup/install green;
- all P0 localization contracts green;
- Next.js 16.3.3 production build green;
- new Metadata alternates, sitemap alternate types and robots generation compile successfully.

After documentation commits, CI must be green again before merge/main completion is claimed.

This is executable build evidence only. It is **not** evidence of production deployment, DNS cutover, Google/Bing indexing or Search Console recognition.

## 9. Discovery decision for Step 2C-3
GitHub review reconfirmed `amannn/next-intl` plus built-in Next.js Metadata/MetadataRoute APIs are sufficient. No `next-sitemap` or second SEO/i18n dependency was added.

The Hugging Face connector model search failed in this run; fallback public search only surfaced SEO/AEO site examples, not a model that can deterministically verify canonical/hreflang/sitemap correctness. ML involvement was rejected because this problem is deterministic configuration/build validation, not inference.

See `OPEN_SOURCE_DISCOVERY.md` for the logged sources and rationale.

## 10. Security / privacy / token / margin impact
- Application AI/model/provider calls added: **0**.
- CI AI/model calls added: **0**.
- Runtime dependencies added: **0**.
- New external customer-data transfer: **0**.
- Secrets/payment/wallet behavior changed: **0**.
- ML/dynamic pricing: **0**.
- Incremental supplier inference cost: **0**.
- Public discovery improves without adding runtime/provider cost.
- Sensitive future route crawler exclusions are stricter than before.

## 11. Exact next action — Step 2C-4 only
1. Inspect fresh `main`, recent commits, project tree, this handoff and roadmap.
2. Re-search GitHub + Hugging Face before material architecture changes.
3. Research current Next.js + next-intl patterns for locale-correct document `<html lang>` when migration legacy routes coexist.
4. Fix P0 document language (`en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`) without weakening static generation or Quick Help provider boundaries.
5. Preserve working unprefixed legacy URLs during this slice unless a tested route-group/root-layout design proves a safe migration path.
6. Do **not** combine browser-language auto-redirect, legacy deletion and document-language restructuring in one patch.
7. Re-run P0 i18n + production build, canonical/sitemap regression checks and update this handoff.

After document-language correctness is proven, decide in another small rollback-aware slice whether unprefixed legacy duplicates should redirect/retire. Explicit user locale choice always outranks browser/market inference.

## 12. Later roadmap / deferred
Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color validation/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung data; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 AI cost + market expansion.

Deferred: bulk Hanbok visuals unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; production claims without deployment evidence.

## 13. Mandatory workflow for every future run
1. Inspect latest main, project tree and recent commits.
2. Read this file and `IMPLEMENTATION_ROADMAP.md`.
3. Do not overwrite newer work from another AI/developer.
4. Run GitHub + Hugging Face discovery before material changes and update `OPEN_SOURCE_DISCOVERY.md`.
5. Implement one reviewable roadmap slice only.
6. Run navigation/mobile/accessibility/i18n/privacy/security/cost/SEO/dependency regression checks.
7. Distinguish source review, executable build evidence and deployment evidence.
8. Update relevant docs and **this handoff in the same run**.
9. Commit clearly; never claim deployment without evidence.

## 14. Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
