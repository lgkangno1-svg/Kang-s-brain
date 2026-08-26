# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-26  
**Rule:** do not attempt the entire product in one patch. Each step must be reviewable, documented and regression-checked before the next major layer.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost policy, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token-efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
- zero-API button-driven Quick Help mounted globally;
- P0 seed dictionaries: English, Simplified Chinese, Japanese, Traditional Chinese, Vietnamese, Thai;
- no runtime AI/embedding dependency;
- keyboard/focus/accessibility hardening;
- free/consent/credit copy seeded.

**Gate:** PASS by static review. Quick Help remains 0-credit/0-AI and collects no sensitive input.

## Step 2 — Internationalized routing and language selector ← in progress

### Step 2A — dependency + request/routing foundation ✅
- fresh upstream verification corrected the planned dependency from nonexistent/unverified `4.13.7` to **exact `next-intl@4.13.4`**;
- plugin wired through `next.config.ts` while preserving existing security headers;
- P0-only `defineRouting` registry created with `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th` target locales and explicit default `en`;
- request config validates locale before loading a dictionary and returns 404 for unsupported locale values;
- no proxy/redirect was activated yet because `[locale]` pages do not exist; this intentionally prevents migration-time 404 regressions;
- no AI/API/token cost added; static dictionaries remain the production localization source;
- NLLB-200 remains rejected for commercial production because current Hugging Face metadata/model card identify CC-BY-NC and non-production intended use.

**2A verification:** static code/dependency review only. This environment did not provide a checked-out runtime with installed npm dependencies, so `npm install`/`npm run build` remains a required 2B gate before locale cutover. Do not claim production readiness yet.

### Step 2B — next slice
- create `[locale]` root layout/page migration without removing old routes prematurely;
- wire translated global navigation and Quick Help to `next-intl`;
- add locale-preserving navigation helper + functional language selector;
- browser-language suggestion/negotiation, never nationality/IP inference and never overriding explicit selection;
- run install/build/type validation before enabling proxy redirects.

### Step 2C
- activate safe locale negotiation/cutover only after 2B routes build;
- canonical + hreflang + x-default metadata;
- locale-aware sitemap;
- migrate remaining public route families and eliminate English-only paid-flow dead ends;
- mobile overflow QA for CJK/Thai/Vietnamese.

**Step 2 gate:** no paid flow has an English-only dead end; locale URLs have valid SEO alternates and existing links do not regress.

## Step 3 — Saju input and deterministic cultural core
- exact / approximate / unknown birth-time paths;
- never fabricate missing birth hour;
- timezone/city only when calculation needs it;
- deterministic zodiac/calendar/pillar architecture;
- 3-pillar scoped result when birth time unknown;
- reduced credit pricing for reduced scope;
- raw birth inputs never sent to LLM;
- entertainment/culture framing and deletion controls.

## Step 4 — Auth + authoritative wallet
Guest browsing; immutable ledger; reserve/capture/release/refund; idempotency, authorization, rate limits and audit telemetry.

## Step 5 — International payment foundation
Provider abstraction; foreign cards + PayPal target; server-authoritative pricing; verified callbacks; receipts/refunds; CSP finalized only after real provider origins are known.

## Step 6 — Personal-color v1
Browser/local first, lighting checks, manual correction, no sensitive identity inference, premium remote vision only with consent/ZDR, multilingual results.

## Step 7 — Hanbok recommendation v1
Deterministic ranker first; color/mood/weather/comfort inputs; structured reasons; no bulk visual asset project until separately requested.

## Step 8 — Gyeongbokgung area discovery
Verified place model, filters, walking/route ranking, time-sensitive facts separated from editorial copy, dietary/accessibility/language-service claims only when verified.

## Step 9 — Itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings, source-fact validation.

## Step 10 — Analytics, market adaptation and expansion
Locale/topic conversion, margin dashboards, zero-AI resolution, p50/p95 AI cost/tokens, market experiments, P1/P2 expansion from demand.

## Every-step regression checklist
Mobile/desktop navigation; accessibility; locale overflow; security; privacy; token/API cost; credit margin; SEO/AEO/GEO; indexability; performance; failure/refund paths; dependency/license risk; fresh GitHub/Hugging Face alternatives.

## Current user actions required
**None immediately.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal copy review are deferred until their corresponding gates.
