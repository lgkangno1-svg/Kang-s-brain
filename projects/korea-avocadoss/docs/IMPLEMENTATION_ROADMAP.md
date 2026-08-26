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
- no proxy/redirect was activated yet because `[locale]` pages did not exist at this gate;
- no AI/API/token cost added; static dictionaries remain the production localization source;
- NLLB-200 remains rejected for commercial production because current Hugging Face metadata/model card identify CC-BY-NC and non-production intended use.

### Step 2B — localized app migration

#### Step 2B-1 — locale routes + navigation shell ✅ by static review
- added official `createNavigation(routing)` helpers so internal links preserve locale;
- added accessible P0 language selector using the current pathname rather than sending users back to a generic homepage;
- added validated `[locale]` layout and homepage with `NextIntlClientProvider`, P0 dictionaries and localized global navigation/footer copy;
- added static params for the six P0 locales;
- preserved the existing unprefixed site through a temporary migration-only `LegacyShell`; locale-prefixed routes use the new shell and legacy routes keep their current UI;
- Quick Help CTAs now retain the current locale prefix instead of dropping users back onto unprefixed English routes;
- no redirect/proxy cutover yet;
- root document `<html lang>` remains `en` during this coexistence phase. Locale content has a scoped `lang` attribute, but document-level language and SEO alternates remain a 2C migration requirement.

**2B-1 verification:** source-level/type-shape review completed. A clean repository runtime build could not be executed because the available shell environment cannot currently resolve `github.com`; production readiness is therefore not claimed.

#### Step 2B-2 — next slice
- localize the complete Quick Help decision tree, not only its seed/root labels;
- migrate the next highest-value public route family behind `[locale]` so localized nav destinations do not become 404s;
- translate landing-page marketing copy rather than using English brand copy as temporary fallback;
- browser-language suggestion/negotiation only after explicit locale routes are proven; never infer nationality from IP/name/face and never override explicit selection;
- add automated message-key parity checks before widening translated surface area.

### Step 2C
- activate safe locale negotiation/cutover only after localized destination routes build;
- move document-level language handling to the locale root architecture and remove the temporary legacy-shell client boundary;
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
