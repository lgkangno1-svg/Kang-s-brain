# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity / executable verification  
**Last completed slice:** Step 2C-1C — native P0 Credits route  
**Current slice:** Step 2C-2 — executable CI verification and build-regression repair  
**Exact next gate:** obtain green `check:i18n` + `next build` evidence on the P0 locale-type fix; only then start a separate SEO/locale cutover slice.

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

Locale is allowlisted before dictionary load. Reviewed static dictionaries only; no runtime translation ML. Request messages use recursive deep merge so modular Hanbok/Credits namespaces cannot overwrite shared `Meta` siblings.

Migration-only unprefixed legacy routes remain. Locale-aware navigation preserves locale. Redirect/browser-language negotiation/canonical/hreflang/x-default stay disabled until route parity + executable build evidence.

`check:i18n` runs P0 parity plus Quick Help, Personal Color, Hanbok and Credits message contracts.

## 5. Completed roadmap status
- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input.
- Step 2A ✅ pinned/validated i18n foundation.
- Step 2B ✅ native P0 Home/Culture/Gyeongbokgung, locale navigation, metadata and text-expansion safeguards.
- Step 2C-1A ✅ native P0 Personal Color, browser-local deterministic scan, no image upload/provider.
- Step 2C-1B ✅ native P0 Hanbok, free deterministic user-choice matcher, modular messages, no photo/model/provider.
- Step 2C-1C ✅ native P0 Credits, deterministic authoritative economics, no checkout before wallet/payment gates.

## 6. Step 2C-2 executable verification — current run

### Repository state inspection
Before editing, latest `main`, recent commits, project tree, roadmap, this handoff, package scripts and `.github/workflows` were inspected. No existing workflow was present, so no other AI's CI work was overwritten.

### Discovery decision
GitHub official actions were rechecked. CI now uses:
- `actions/checkout` v7.0.1 pinned to `3d3c42e5aac5ba805825da76410c181273ba90b1`;
- `actions/setup-node` v7.0.0 pinned to `820762786026740c76f36085b0efc47a31fe5020`.

The workflow has only `contents: read`, `persist-credentials: false`, no repository secrets, Node 22, a 15-minute timeout, path scoping and concurrency cancellation. `CI=1` and `NEXT_TELEMETRY_DISABLED=1` are set.

Hugging Face vulnerability/code-analysis models were searched and rejected for this gate. Model inference cannot prove TypeScript compilation or Next production build correctness and would add provenance/cost/false-result risk.

Full discovery record: `docs/OPEN_SOURCE_DISCOVERY.md`.

### First real CI evidence
Workflow: `.github/workflows/korea-concierge-ci.yml`  
First run: GitHub Actions run `32994639016`  
Head commit: `e6d41d0f1bacb7cb2749ff8a36f42d3ac101df96`

Successful steps:
- repository checkout;
- Node `v22.23.2` / npm `10.9.8` setup;
- dependency installation: 53 packages;
- `npm run check:i18n`.

Exact i18n evidence:
- P0 parity: **6 locales, 283 leaf keys each**;
- Quick Help: **65 referenced keys**;
- Personal Color: **38 required keys**;
- Hanbok: **44 required keys**;
- Credits: **3 plans + 11 paid feature labels** sourced from `economics.ts`.

`next build` then:
- compiled successfully in the runner;
- entered TypeScript checking;
- failed at `src/i18n/routing.ts` because `DEFAULT_LOCALE` was typed as broad `SupportedLocale`, which includes planned P1/P2 values such as `id`, while production `defineRouting` intentionally accepts only the six P0 locales.

### Regression fix
`src/lib/i18n/locales.ts` now defines:
- `P0Locale = (typeof P0_LOCALES)[number]`;
- `DEFAULT_LOCALE: P0Locale = "en"`.

`SupportedLocale` remains the broader P0/P1/P2 market registry union. This preserves future market research while making the production routing boundary compile-time explicit rather than relying only on runtime convention.

### Workflow-trigger nuance
The initial workflow-file commit produced a push run. Subsequent connector-origin main content commits did not immediately create another push run, so a dedicated verification PR branch `ci/korea-concierge-step-2c2` is used to obtain pull-request CI evidence on the latest source without weakening the workflow.

## 7. Current verification / blocker state

Previous local-shell DNS blocker is no longer the main limitation because GitHub-hosted CI is now executable.

Current state:
- executable install path: **proven**;
- executable P0 i18n contracts: **green**;
- Next compilation phase: **proven**;
- TypeScript locale regression: **identified and fixed in source**;
- green production build on the fix: **still required before Step 2C-2 closes**;
- production deployment: **not claimed**;
- canonical/hreflang/x-default/redirect cutover: **still prohibited**.

Dependency reproducibility remains imperfect because no npm lockfile is committed. CI intentionally uses `npm install --ignore-scripts --no-audit --no-fund`. A future small supply-chain slice should generate/review/commit a lockfile from a trusted environment; do not fabricate one manually.

## 8. Security / privacy / token / margin impact
- Application AI/model/provider calls added: **0**.
- CI AI/model calls: **0**.
- Application runtime dependencies added: **0**.
- New external customer-data transfer: **0**.
- Repository secrets used by CI: **0**.
- CI token permissions: **contents/metadata read only**.
- Checkout credentials retained after checkout: **no**.
- Next anonymous telemetry in CI: **disabled**.
- ML/dynamic customer pricing: **0**.
- Incremental supplier inference cost: **0**.
- CI minutes bounded by path filters, concurrency cancellation and 15-minute timeout.

## 9. Exact next action
1. open/maintain the verification PR from `ci/korea-concierge-step-2c2` to `main` so pull-request CI runs against the locale-type fix;
2. inspect the actual job result/logs;
3. if another compile/build regression appears, fix only that regression on the branch and rerun;
4. when `check:i18n` + `next build` are green, merge the documentation/verification PR and update this file with run ID + green evidence;
5. only then begin **Step 2C-3** as a separate SEO/locale-cutover slice: canonical/hreflang/x-default + locale-aware sitemap/robots;
6. browser-language auto-routing and legacy-shell removal remain later rollback-aware work.

## 10. Later roadmap / deferred
Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color validation/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung model; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 cost + market expansion.

Deferred: bulk Hanbok visuals unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; locale/canonical cutover before executable evidence; production claims without actual deployment proof.

## 11. Mandatory workflow for every future run
1. Inspect latest `main`, project tree and recent commits.
2. Read this file and `IMPLEMENTATION_ROADMAP.md`.
3. Do not overwrite newer work from another AI/developer.
4. Run GitHub + Hugging Face discovery before material feature changes and update `OPEN_SOURCE_DISCOVERY.md`.
5. Implement one reviewable roadmap slice only.
6. Run feasible navigation/mobile/accessibility/i18n/privacy/security/cost/SEO/dependency regression checks.
7. Distinguish source review from executable/production evidence.
8. Update relevant docs and **this handoff in the same run**.
9. Commit clearly; never claim deployment without evidence.

## 12. Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
