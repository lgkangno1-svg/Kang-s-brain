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

### Step 2C — locale parity, executable verification and cutover

#### Step 2C-1A — Personal Color native P0 ✅ by source/data-shape review
Native scanner/content/metadata; browser-local deterministic preview; stable locale-neutral analyzer codes/palette IDs; no image upload/AI/provider cost; message contract and legacy-route regression fix.

#### Step 2C-1B — Hanbok native P0 ✅ by source/data-shape review
Native localized route/metadata; free user-choice-driven deterministic matcher; modular P0 Hanbok bundles; recursive message merge; P0 parity/contract checks; no photo upload/model/provider; bulk visual asset project remains deferred.

#### Step 2C-1C — Credits native P0 ✅ by source/data-shape review
Native P0 Credits route/metadata; authoritative numeric pricing remains only in `src/lib/credits/economics.ts`; modular copy-only locale bundles; fixed credits shown before paid actions; no fake checkout before wallet/payment gates; no subscription/ML personalized pricing.

#### Step 2C-2 — executable verification ← in progress

Completed in this slice:
- re-inspected latest main, recent commits, tree, roadmap, handoff and confirmed no pre-existing GitHub Actions workflow;
- re-ran GitHub + Hugging Face discovery for the verification feature;
- added minimal `.github/workflows/korea-concierge-ci.yml` scoped to Korea Concierge paths;
- pinned official `actions/checkout` v7.0.1 and `actions/setup-node` v7.0.0 to full verified commit SHAs;
- workflow permissions are `contents: read`, checkout credentials are not persisted, no repository secrets are used, CI/Next telemetry is disabled, timeout is 15 minutes and concurrent superseded runs are cancelled;
- first GitHub-hosted run successfully checked out, installed 53 packages under Node 22, and passed all P0 i18n contracts: 6 locales × 283 leaf keys; Quick Help 65; Personal Color 38; Hanbok 44; Credits 3 plans + 11 paid-feature labels;
- production build compiled successfully but TypeScript caught a real locale-boundary bug: `DEFAULT_LOCALE` was typed as broad `SupportedLocale` including P1/P2 candidates while `defineRouting` intentionally accepts P0 only;
- fixed the source model by adding `P0Locale = typeof P0_LOCALES[number]` and typing `DEFAULT_LOCALE` as `P0Locale`. P1/P2 remain in the market registry but cannot widen production routing accidentally.

Known verification/reproducibility note:
- no committed npm lockfile exists yet, so CI currently uses `npm install --ignore-scripts --no-audit --no-fund`; this avoids lifecycle scripts but dependency resolution is not fully reproducible. A trusted generated/reviewed lockfile should be added in a later small supply-chain slice before calling dependency resolution deterministic.

Current gate:
1. obtain a green CI run on the locale-type fix (PR verification path if connector-origin main commits do not emit new push runs);
2. if the compiler reveals another regression, fix only that regression and rerun;
3. after green `check:i18n` + production build evidence, update handoff/discovery and mark executable build proof established;
4. do **not** enable redirects/canonical/hreflang/x-default in this same verification slice.

#### Step 2C-3 — SEO/locale cutover after green build
Only after Step 2C-2 is green:
- add canonical/hreflang/x-default for complete P0 public routes;
- add locale-aware sitemap/robots;
- verify alternate URLs/indexability and public/private noindex boundaries;
- keep browser-language auto-routing and legacy-shell removal as a later rollback-aware slice.

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
