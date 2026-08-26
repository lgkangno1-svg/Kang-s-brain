# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-26  
**Rule:** do not attempt the entire product in one patch. Each step must be reviewable, documented and regression-checked before the next major layer. Always inspect the latest GitHub main/project tree and recent commits before editing because another AI or developer may have changed the repository.

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
- exact `next-intl@4.13.4` pin after fresh upstream verification;
- plugin wired through `next.config.ts` while preserving security headers;
- P0-only routing registry for `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th` with explicit default `en`;
- request config validates locale before loading a dictionary and fails closed for unsupported values;
- runtime translation ML rejected; static dictionaries remain production localization source.

### Step 2B — localized app migration

#### Step 2B-1 — locale routes + navigation shell ✅ by static review
- official locale-preserving navigation helpers;
- accessible language selector retaining the current pathname;
- validated `[locale]` layout/homepage with `NextIntlClientProvider`;
- temporary migration-only `LegacyShell` keeps unprefixed routes working;
- Quick Help CTAs retain locale prefixes;
- temporary localized route bridges prevent `/ja/hanbok`, `/vi/color`, etc. from becoming 404s;
- redirect/proxy cutover remains disabled until destination parity and build verification.

#### Step 2B-2 — complete Quick Help localization + message QA ✅ by static/data-shape review
- removed hard-coded English Quick Help titles, answers, choices, CTAs and accessibility text from the client component;
- Quick Help decision graph now contains message keys only;
- completed the full Quick Help tree in all P0 dictionaries;
- added deterministic message-parity validation; production build runs i18n checks first;
- no translation API, model, RAG or embedding dependency added.

#### Step 2B-3 — localized landing + first native public route ✅ by source review
- inspected latest main/project tree and recent commits before editing; no concurrent project commit was detected during the slice;
- moved locale landing-page marketing copy into reviewed P0 static dictionaries under `messages/public/` and merged them through the request loader;
- removed English marketing fallback from the locale landing surface;
- converted `/[locale]/culture` from a temporary English bridge into a native localized K-Culture page;
- culture copy now explicitly states that birth time is optional and unknown birth time is never guessed;
- expanded message parity to include the public-copy dictionaries;
- added a deterministic Quick Help graph/message-key checker so referenced keys missing from the English schema fail `check:i18n` before build;
- retained zero runtime translation/model cost and did not add a new package, API, model or sensitive-data flow.

**2B-3 verification limitation:** a clean clone + `npm install` / `npm run check:i18n` / `next build` was attempted again, but the available shell still cannot resolve `github.com`. GitHub currently exposes no CI status checks for the project. Build success is therefore not claimed; source and commit state were reviewed through the GitHub connector.

#### Step 2B-4 — next slice
- migrate the next highest-value public route from temporary bridge content to native localized content (prefer Gyeongbokgung discovery shell before paid flows);
- add localized page metadata for the already-native home/culture routes without prematurely enabling canonical/hreflang cutover;
- tighten type safety for locale/message usage if it can be done without creating fragile build coupling;
- review CJK/Thai/Vietnamese mobile overflow as localized surfaces grow;
- keep browser-language suggestion/negotiation deferred until explicit locale destinations are proven.

### Step 2C
- activate safe locale negotiation/cutover only after localized destination routes build;
- move document-level language handling to locale-root architecture and remove temporary legacy shell;
- canonical + hreflang + x-default metadata;
- locale-aware sitemap;
- migrate remaining public routes and eliminate English-only paid-flow dead ends;
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
Latest GitHub state/conflict check; mobile/desktop navigation; accessibility; locale overflow; security; privacy; token/API cost; credit margin; SEO/AEO/GEO; indexability; performance; failure/refund paths; dependency/license risk; fresh GitHub/Hugging Face alternatives.

## Current user actions required
**None immediately.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal copy review are deferred until their corresponding gates.
