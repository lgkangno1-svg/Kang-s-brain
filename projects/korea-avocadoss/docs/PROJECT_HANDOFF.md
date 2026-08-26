# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / SEO cutover preparation  
**Last completed slice:** Step 2C-2 — executable CI verification  
**Exact next slice:** Step 2C-3 — canonical/hreflang/x-default + locale-aware sitemap/robots, without browser-language auto-routing or legacy-shell removal.

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
Next.js 16.3.3 + exact `next-intl@4.13.4`. Production P0 locale URLs are `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`. P1/P2 codes remain research/market-registry candidates and must not widen production routing until their own localization gate is completed.

Locale is allowlisted before dictionary load. Reviewed static dictionaries only; no runtime translation ML. Request messages use recursive deep merge so modular Hanbok/Credits namespaces cannot overwrite shared metadata siblings. `P0Locale` is a compile-time production-routing boundary separate from broader P0/P1/P2 market registry `SupportedLocale`.

Migration-only unprefixed legacy routes remain. Locale-aware navigation preserves locale. The unprefixed legacy shell provides only the English Quick Help namespace through a local `NextIntlClientProvider`, with `Asia/Seoul` explicitly set because it is a Korea-local fallback and client-only providers otherwise emit next-intl environment fallback warnings. Locale-prefixed routes keep their normal locale provider.

Redirect/browser-language negotiation/canonical/hreflang/x-default remain disabled until Step 2C-3. `check:i18n` validates P0 parity plus Quick Help, Personal Color, Hanbok and Credits contracts.

## 5. Completed roadmap status
- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and text-expansion safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan, no image upload/provider.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic user-choice matcher, modular messages, no photo/model/provider.
- Step 2C-1C ✅ native P0 Credits, deterministic authoritative economics, no checkout before wallet/payment gates.
- Step 2C-2 ✅ GitHub-hosted executable i18n + production-build gate established and green after fixing actual regressions.

## 6. Step 2C-2 executable verification evidence

### CI architecture
Workflow: `.github/workflows/korea-concierge-ci.yml`

Official GitHub actions are SHA-pinned:
- `actions/checkout` v7.0.1 → `3d3c42e5aac5ba805825da76410c181273ba90b1`;
- `actions/setup-node` v7.0.0 → `820762786026740c76f36085b0efc47a31fe5020`.

Controls:
- `permissions: contents: read`;
- no repository secrets;
- `persist-credentials: false`;
- Node 22;
- `CI=1`, `NEXT_TELEMETRY_DISABLED=1`;
- 15-minute timeout;
- path scope limited to Korea Concierge + workflow;
- superseded concurrent runs cancelled;
- install uses `--ignore-scripts --no-audit --no-fund` until a reviewed lockfile exists.

### Run sequence and regressions caught
1. **Run `32994639016`**
   - checkout/install/i18n green;
   - Next compiled;
   - TypeScript caught production routing accepting a broad `SupportedLocale` type that included planned P1/P2 values.
   - Fix: define `P0Locale` from `P0_LOCALES` and type `DEFAULT_LOCALE` as P0 only.

2. **Run `32995135203`**
   - i18n and TypeScript green;
   - prerender caught unprefixed legacy `/` and `/_not-found` rendering Quick Help without a client intl provider.
   - Fix: legacy shell wraps only legacy Quick Help in an English `NextIntlClientProvider`; locale routes are unaffected.

3. **Run `32995294201` — SUCCESS**
   - dependency install green: 53 packages;
   - P0 message parity: **6 locales × 283 leaf keys**;
   - Quick Help: **65** referenced keys;
   - Personal Color: **38** required keys;
   - Hanbok: **44** required keys;
   - Credits: **3 plans + 11 paid feature labels** sourced from `economics.ts`;
   - production compilation green;
   - TypeScript green;
   - page-data collection green;
   - static generation green: **46/46 pages**;
   - build route output confirms P0 Home, Color, Credits, Culture, Gyeongbokgung and Hanbok variants.

The successful run still printed next-intl `ENVIRONMENT_FALLBACK` console noise from the client-only legacy provider. Official next-intl discussion identifies an explicit `timeZone` as the remedy when a client provider cannot inherit server configuration. `Asia/Seoul` is now explicit for this Korea-local legacy fallback and remains under the CI gate.

## 7. Verification / production state
- executable dependency install: **proven**;
- executable P0 i18n contracts: **green**;
- TypeScript: **green**;
- production Next build: **green**;
- all 46 generated routes/pages: **green**;
- production deployment: **not claimed**;
- production DNS cutover: **not performed**;
- SEO alternate/canonical cutover: **not yet performed**;
- browser-language auto-routing / legacy-shell removal: **not yet performed**.

Dependency reproducibility remains incomplete because no npm lockfile is committed. Do not manually fabricate one. Generate/review/commit it from a trusted executable environment in a separate supply-chain slice.

## 8. Security / privacy / token / margin impact
- Application AI/model/provider calls added: **0**.
- CI AI/model calls: **0**.
- Application runtime dependencies added: **0**.
- New external customer-data transfer: **0**.
- Repository secrets used by CI: **0**.
- CI token permissions: **contents/metadata read only**.
- Checkout credentials retained: **no**.
- Next telemetry in CI: **disabled**.
- ML/dynamic customer pricing: **0**.
- Incremental supplier inference cost: **0**.
- CI consumption bounded by path filters, concurrency cancellation and timeout.

Hugging Face vulnerability/code-analysis models were reviewed and rejected for this gate because they cannot prove TypeScript/Next build correctness and would add model provenance/inference/false-result risk.

## 9. Exact next action — Step 2C-3 only
1. Inspect fresh `main`, recent commits and this handoff before editing.
2. Re-read `SEO_AEO_GEO.md` and re-run GitHub/Hugging Face discovery for locale SEO tooling/patterns.
3. Add canonical/hreflang/x-default only for complete P0 public routes.
4. Make sitemap/robots locale-aware and verify alternate URLs/indexability/noindex boundaries.
5. Keep browser-language auto-routing and legacy-shell removal out of this slice; they need separate rollback-aware work.
6. Re-run CI and update this handoff.

## 10. Later roadmap / deferred
Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color validation/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung model; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 cost + market expansion.

Deferred: bulk Hanbok visuals unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; browser-language auto-routing/legacy-shell removal before rollback-aware gate; production claims without deployment evidence.

## 11. Mandatory workflow for every future run
1. Inspect latest `main`, project tree and recent commits.
2. Read this file and `IMPLEMENTATION_ROADMAP.md`.
3. Do not overwrite newer work from another AI/developer.
4. Run GitHub + Hugging Face discovery before material feature changes and update `OPEN_SOURCE_DISCOVERY.md`.
5. Implement one reviewable roadmap slice only.
6. Run feasible navigation/mobile/accessibility/i18n/privacy/security/cost/SEO/dependency regression checks.
7. Distinguish source review, executable build evidence and deployment evidence.
8. Update relevant docs and **this handoff in the same run**.
9. Commit clearly; never claim deployment without evidence.

## 12. Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
