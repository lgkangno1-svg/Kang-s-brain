# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-26  
**Rule:** implement one reviewable slice at a time. Before every material change inspect latest `main`, recent commits, project tree, this roadmap and `PROJECT_HANDOFF.md` because another AI/developer may have changed the repository. Update `PROJECT_HANDOFF.md` in the same run.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost policy, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
0-credit, 0-AI, no external question transfer, P0 localized, keyboard/focus/ARIA hardened.

## Step 2 — Internationalized routing and language selector ← in progress

### Step 2A — i18n foundation ✅
- exact `next-intl@4.13.4` pin;
- P0 `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th` registry;
- fail-closed locale validation;
- reviewed static dictionaries; no runtime translation ML.

### Step 2B — localized app migration ✅ by source/data-shape review

#### 2B-1 ✅
Locale-aware shell/navigation/language selector, temporary legacy shell, locale-preserving Quick Help CTAs, bridge routes; redirects intentionally disabled.

#### 2B-2 ✅
Quick Help fully P0 localized. Deterministic dictionary parity + Quick Help graph-key build gates.

#### 2B-3 ✅
Native localized Home and Culture, localized metadata, Saju copy accepts unknown birth time and never guesses it.

#### 2B-4 ✅
Native localized Gyeongbokgung surface, P0 copy, freshness warning for live facts, locale text-expansion CSS, localized metadata. Canonical/hreflang/x-default remain disabled until parity + executable build evidence.

### Step 2C — locale parity, cutover and SEO completion

#### Step 2C-1A — Personal Color native P0 surface ✅ by source/data-shape review
Completed this run:
- re-inspected latest `main`, recent commits and living handoff before editing;
- replaced `/[locale]/color` English bridge with native localized Server Component and locale title/description metadata;
- localized the entire interactive browser-side ColorScanner for all P0 locales: upload instructions, controls, result labels, warnings, errors, privacy copy and nine Hanbok palettes;
- refactored analysis warnings/errors from English strings into typed stable codes so engine logic is locale-neutral;
- refactored palette recommendations from English names/notes into stable IDs + color values, with copy owned by dictionaries;
- retained the scan as browser-local deterministic pixel analysis: no image upload, AI provider, model, API call, RAG or embedding dependency;
- kept explicit disclaimer that the result is styling guidance under current lighting, not professional diagnosis;
- preserved explicit sensitive-trait boundary: no identity, race, ethnicity, nationality, religion, health or attractiveness inference;
- added dependency-free `check-color-message-keys.mjs` and added it to `check:i18n`, complementing cross-locale parity checks;
- no canonical/hreflang/redirect cutover yet.

**Discovery decision:** personal-color GitHub projects and general Hugging Face skin/image classifiers were re-reviewed. No external model/library had sufficient validated fit to justify image-transfer, runtime cost, fairness/provenance risk or supply-chain complexity for this preview. Keep browser-local deterministic v1 and revisit premium remote vision only at Step 6 with consent/ZDR and representative validation.

**Verification limitation:** source writes and message-schema review are available. The execution shell still cannot resolve `github.com`, so clean clone → install → `npm run check:i18n` → `npm run build` cannot yet be executed here. Production build/deployment is not claimed.

#### Step 2C-1B — next slice
- re-inspect latest repository state first;
- convert `/[locale]/hanbok` from English bridge to native P0 content;
- localize all interactive Hanbok controls/results, not only the page heading;
- preserve deterministic ranking first and explicit free-vs-paid boundaries;
- add locale metadata and message-contract checks where useful;
- re-run GitHub + Hugging Face discovery before modifying recommendation logic;
- continue CJK/Thai/Vietnamese mobile overflow/accessibility review.

#### Step 2C-1C
- convert `/[locale]/credits` to native P0 content;
- use `CREDIT_ECONOMICS.md` as the sole pricing/pack authority;
- show fixed credits before every paid action;
- do not introduce ML personalized pricing.

#### Step 2C-2 — cutover only after parity/build evidence
- activate safe locale negotiation only after all required destinations build;
- remove migration legacy shell;
- add canonical, hreflang and x-default;
- locale-aware sitemap/robots/indexability audit;
- eliminate English-only public/paid-flow dead ends;
- mobile/desktop/accessibility/indexability regression QA.

**Step 2 gate:** no paid flow has an English-only dead end; locale URLs have valid SEO alternates; existing navigation does not regress; executable `check:i18n` + production build evidence exists before redirect/canonical cutover.

## Step 3 — Saju deterministic cultural core
Exact / approximate / unknown birth-time paths; never fabricate missing hour; timezone/city only when required; deterministic calendar/pillar computation; three-pillar reduced scope for unknown time; reduced pricing; raw birth inputs never sent to LLM; cultural/entertainment framing and deletion controls.

## Step 4 — Auth + authoritative wallet
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, idempotency, authorization, rate limits, audit telemetry.

## Step 5 — International payment foundation
Provider abstraction, foreign cards + PayPal target, server-authoritative pricing, verified callbacks, receipts/refunds; CSP allowlist finalized only after real provider origins exist.

## Step 6 — Personal-color v1 hardening/premium boundary
Browser/local first, lighting checks, manual correction, fairness/representative validation, no sensitive identity inference. Premium remote vision only if it creates measured incremental value and only with consent/ZDR, strict cost ceilings and no raw-media retention beyond the defined policy.

## Step 7 — Hanbok recommendation v1
Deterministic ranker first; color/mood/weather/comfort inputs; structured reasons; no bulk visual asset project until separately requested.

## Step 8 — Gyeongbokgung area discovery
Verified place model, filters, walking/route ranking, time-sensitive facts separated from editorial copy, dietary/accessibility/language claims only when verified.

## Step 9 — Itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings, source-fact validation.

## Step 10 — Analytics, market adaptation and expansion
Locale/topic conversion, margin dashboards, zero-AI resolution, p50/p95 AI cost/tokens, retry/escalation rates, market experiments, P1/P2 expansion from measured demand.

## Every-step regression checklist
Latest GitHub conflict/state check; handoff read/update; navigation; mobile/desktop; accessibility; P0 parity; locale overflow; privacy; security; token/API cost; credit margin; SEO/AEO/GEO; indexability; performance; failure/refund paths; analytics; dependency/license/supply-chain risk; fresh GitHub/Hugging Face alternatives; distinguish static review from executable evidence.

## Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
