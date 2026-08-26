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

### Step 2B — localized app migration ✅
Native P0 Home/Culture/Gyeongbokgung, locale-preserving navigation, full Quick Help localization, localized metadata and text-expansion safeguards.

### Step 2C — locale parity, executable verification and cutover

#### Step 2C-1A — Personal Color native P0 ✅
Native scanner/content/metadata; browser-local deterministic preview; no image upload/AI/provider cost; message contracts and legacy-route compatibility.

#### Step 2C-1B — Hanbok native P0 ✅
Native localized route/metadata; free user-choice deterministic matcher; modular P0 messages; no photo/model/provider; bulk visual asset project remains deferred.

#### Step 2C-1C — Credits native P0 ✅
Native P0 Credits route/metadata; authoritative numeric pricing only in `src/lib/credits/economics.ts`; fixed credits visible before paid actions; no fake checkout, subscription or ML personalized pricing.

#### Step 2C-2 — executable verification ✅
Established a minimal GitHub Actions build gate and used it to find/fix real regressions.

Evidence and fixes:
- official `actions/checkout` v7.0.1 and `actions/setup-node` v7.0.0 are pinned to full reviewed commit SHAs;
- workflow is scoped to Korea Concierge paths, has `contents: read`, no repository secrets, no persisted checkout credentials, a 15-minute timeout, concurrency cancellation and disabled Next telemetry;
- first run `32994639016` proved checkout/install/P0 i18n, then caught a TypeScript boundary bug: broad P0/P1/P2 `SupportedLocale` was being used for P0-only production routing;
- added explicit `P0Locale` and typed `DEFAULT_LOCALE` accordingly;
- second PR run `32995135203` passed TypeScript and exposed prerender failure because migration-only unprefixed routes rendered Quick Help without a client intl provider;
- legacy Quick Help now receives only its English message namespace through `NextIntlClientProvider`, preserving locale-prefixed routes unchanged;
- successful PR run `32995294201` passed install, all P0 i18n contracts, compilation, TypeScript, page-data collection and generation of all 46 static/SSG pages;
- exact successful i18n evidence: 6 locales × 283 leaf keys, Quick Help 65 keys, Personal Color 38, Hanbok 44, Credits 3 plans + 11 paid feature labels;
- build output confirmed P0 Home, Color, Credits, Culture, Gyeongbokgung and Hanbok paths;
- next-intl `ENVIRONMENT_FALLBACK` console noise on the legacy client provider was traced to an unspecified client timezone; `Asia/Seoul` is now explicit for this Korea-local legacy fallback and is being kept under the same CI gate.

Known supply-chain follow-up:
- no npm lockfile is committed yet. CI therefore uses `npm install --ignore-scripts --no-audit --no-fund`. Before dependency resolution is called deterministic, generate/review/commit a lockfile from a trusted executable environment in a separate small slice; never fabricate one manually.

#### Step 2C-3 — next slice: SEO/locale cutover
Now that executable build proof exists, perform as a separate reviewable slice:
- add canonical/hreflang/x-default for complete P0 public routes;
- make sitemap/robots locale-aware and verify alternate URLs/indexability;
- preserve public/private noindex boundaries;
- do not combine browser-language auto-routing or legacy-shell removal into the same cutover; those remain later rollback-aware work.

**Step 2 gate:** no English-only core public/paid-flow dead end; locale URLs have correct SEO alternates after cutover; navigation does not regress; executable `check:i18n` + production build evidence remains green.

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
