# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-27  
**Rule:** implement one reviewable slice at a time. Before every material change inspect latest `main`, recent commits, project tree, this roadmap and `PROJECT_HANDOFF.md`; assume another AI/developer may have changed the repository. Update `PROJECT_HANDOFF.md` in the same run.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
0-credit, 0-AI, no external question transfer, P0 localized, keyboard/focus/ARIA hardened.

## Step 2 — Internationalized routing and language selector ← in progress

### Step 2A — i18n foundation ✅
Exact `next-intl@4.13.4`; P0 `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`; fail-closed locale validation; static reviewed dictionaries; no runtime translation ML.

### Step 2B — localized app migration ✅ by source/data-shape review
- 2B-1 ✅ locale shell/navigation/language selector, migration-safe legacy shell, locale-preserving Quick Help CTAs.
- 2B-2 ✅ full P0 Quick Help + deterministic dictionary/graph build gates.
- 2B-3 ✅ native P0 Home/Culture; Saju copy accepts unknown birth time and never guesses it.
- 2B-4 ✅ native P0 Gyeongbokgung, freshness warning, locale text-expansion safeguards and localized metadata.

### Step 2C — locale parity, verification and cutover

#### Step 2C-1A — Personal Color native P0 ✅ by source/data-shape review
Native scanner/content/metadata; browser-local deterministic preview; stable locale-neutral analyzer codes/palette IDs; no image upload/AI/provider cost; message contract and legacy-route regression fix.

#### Step 2C-1B — Hanbok native P0 ✅ by source/data-shape review
Native localized route/metadata; free user-choice-driven deterministic matcher; modular P0 Hanbok bundles; recursive message merge; P0 parity/contract checks; no photo upload/model/provider; bulk visual asset project remains deferred.

#### Step 2C-1C — Credits native P0 ✅ by source/data-shape review
Completed this run:
- inspected latest `main`, recent commits, roadmap/handoff, `CREDIT_ECONOMICS.md`, legacy/localized Credits code and `economics.ts` before editing;
- confirmed authoritative launch catalog remains Basic `$7.99 / 120`, Advanced `$14.99 / 400`, Ultra `$24.99 / 1,000`, plus the documented refill and feature-credit catalog;
- replaced `/[locale]/credits` English re-export with native P0 content and locale metadata;
- added six modular `messages/credits/{locale}.json` dictionaries containing copy only — authoritative numeric pack/refill/feature prices remain in `src/lib/credits/economics.ts`;
- localized Trip Pass descriptions, refill explanation, all paid feature labels, fixed-credit-before-confirmation language, free layer, server-authoritative wallet semantics, reserve/capture/release behavior, payment roadmap and no-dynamic-pricing promise;
- intentionally did **not** add a checkout button or payment mutation surface before Step 4/5; the page explicitly states that live checkout is not yet enabled;
- `Intl.NumberFormat(locale, {currency: 'USD'})` provides locale-appropriate display while USD remains the current launch catalog currency;
- request loader deep-merges the credits bundle after locale allowlist validation;
- P0 message parity includes credits; `check-credits-message-keys.mjs` derives launch plan IDs and paid feature IDs from `economics.ts` and fails if matching copy keys are absent;
- production `check:i18n` now includes the credits contract;
- no subscription, ML personalized pricing, runtime model, API or new runtime dependency added.

**Discovery decision:** modern ledger projects reinforce immutable reserve/settle/top-up patterns but are deferred until Step 4 rather than adding a backend/service during localization. Hugging Face dynamic-pricing models remain rejected because their domains do not match tourism credits and they reduce trust/auditability versus public fixed prices.

**Verification limitation:** executable clean install/check/build is still not proven in the available shell because prior attempts cannot resolve `github.com`. Production build/deployment is not claimed.

#### Step 2C-2 — next gate: executable verification before locale cutover
Do **not** turn on redirects/canonical/hreflang yet. Next highest-value slice:
1. re-inspect latest repository state and concurrent changes;
2. establish or use an executable verification path for `npm install` → `npm run check:i18n` → `npm run build` (prefer a minimal pinned GitHub Actions CI if no existing CI is present and discovery/security review supports it);
3. fix any TypeScript/i18n/build regressions revealed by real execution;
4. verify P0 routes Home/Color/Hanbok/Gyeongbokgung/Culture/Credits on mobile/desktop and keyboard navigation as far as tooling permits;
5. only after green executable evidence, add canonical/hreflang/x-default and locale-aware sitemap/robots in a separate reviewable cutover slice;
6. browser-language negotiation/legacy-shell removal remain after destination parity and rollback readiness.

**Step 2 gate:** no English-only core public/paid-flow dead end; locale URLs have correct SEO alternates after cutover; existing navigation does not regress; executable `check:i18n` + production build evidence exists before redirect/canonical activation.

## Step 3 — Saju deterministic cultural core
Exact / approximate / unknown birth time; never fabricate missing hour; timezone/city only when required; deterministic calendar/pillar computation; reduced-scope three-pillar result and lower pricing when hour unknown; raw birth inputs never sent to LLM; cultural/entertainment framing and deletion controls.

## Step 4 — Auth + authoritative wallet
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, idempotency, authorization, rate limits, audit telemetry.

## Step 5 — International payment foundation
Provider abstraction, foreign cards + PayPal target, server-authoritative pricing, verified callbacks, receipts/refunds; CSP allowlist finalized only after real provider origins exist.

## Step 6 — Personal-color v1 hardening/premium boundary
Browser/local first, representative validation, manual correction, no sensitive identity inference; remote vision only if measured value justifies consent/ZDR/EXIF/privacy and hard supplier-cost ceilings.

## Step 7 — Hanbok recommendation v1
Deterministic ranker first; color/mood/weather/comfort; structured reasons; no bulk visual asset project until separately requested.

## Step 8 — Gyeongbokgung area discovery
Verified place model, filters, walking/route ranking, time-sensitive facts separated from editorial copy, dietary/accessibility/language claims only when verified.

## Step 9 — Itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings, source-fact validation.

## Step 10 — Analytics, market adaptation and expansion
Locale/topic conversion, margin dashboards, zero-AI resolution, p50/p95 AI cost/tokens, retry/escalation, market experiments, P1/P2 expansion from measured demand.

## Every-step regression checklist
Latest GitHub conflict/state check; handoff read/update; navigation; mobile/desktop; accessibility; P0 parity; locale overflow; privacy; security; token/API cost; credit margin; SEO/AEO/GEO; indexability; performance; failure/refund paths; analytics; dependency/license/supply-chain risk; fresh GitHub/Hugging Face alternatives; distinguish static review from executable evidence.

## Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
