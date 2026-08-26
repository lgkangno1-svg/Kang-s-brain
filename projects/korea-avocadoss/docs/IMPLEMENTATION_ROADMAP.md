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
Minimal SHA-pinned, least-privilege GitHub Actions build gate established. It found and fixed production P0 typing and legacy Quick Help prerender regressions. Green evidence includes all P0 i18n contracts, TypeScript, Next.js 16.3.3 production compilation and 46/46 static/SSG pages. No npm lockfile exists yet; dependency reproducibility remains a separate supply-chain follow-up and a lockfile must never be fabricated manually.

#### Step 2C-3 — P0 SEO locale cutover ✅
- centralized `SITE_ORIGIN`, complete public route shapes, BCP47 hreflang mapping and localized URL generation;
- self-canonical metadata for each complete P0 Home/Color/Hanbok/Gyeongbokgung/Culture/Credits URL;
- reciprocal `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th` alternates plus `x-default` → English;
- sitemap contains 36 canonical localized URLs (6 public route shapes × 6 P0 locales) with reciprocal language alternates;
- false build-time freshness claims removed;
- robots protects unprefixed and P0-prefixed future account/saved/checkout/personal-result paths;
- browser-language auto-routing and legacy removal intentionally excluded;
- PR #3 CI passed before merge.

#### Step 2C-4 — locale-correct document language ✅
- removed the shared top-level document root that forced `<html lang="en">` onto every locale;
- adopted official Next.js multiple-root-layout architecture: locale-prefixed routes own their document in `[locale]/layout.tsx`, while migration-only unprefixed routes live in the URL-neutral `(legacy)` route group with their own English document shell;
- public URL shapes were preserved; route groups do not appear in URLs;
- locale documents now emit `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th` from the existing P0 locale registry;
- unprefixed legacy URLs remain functional and English; browser-language inference/redirect and legacy deletion were not included;
- added `scripts/check-built-document-languages.mjs` and a least-privilege CI step that checks generated `.next` HTML after production build, rather than trusting source structure alone;
- CI caught a route-depth regression after moving legacy Color into a group: its relative English message import was one level short. The import was repaired before completion;
- PR #4 run `33005536571` passed P0 i18n contracts, Next.js 16.3.3 optimized build, TypeScript, 46/46 generated pages and generated-document language verification for all six P0 locales.

#### Step 2C-5 — next slice: legacy duplicate boundary
Now that canonical localized routes, correct document languages and executable build evidence exist, decide what to do with migration-only unprefixed public duplicates as a separate rollback-aware change.

Scope for the next slice:
- inspect fresh `main` and verify no other AI/developer changed routing;
- research current Next.js redirect/caching behavior plus SEO migration guidance before changing legacy URLs;
- prefer explicit deterministic mapping of known unprefixed public duplicates to their English canonical equivalents if evidence supports retirement;
- do **not** infer language from nationality/market or silently override a user’s explicit locale;
- keep browser-language suggestion/negotiation separate from deterministic legacy cleanup;
- preserve Quick Help, sitemap/canonical/hreflang, locale switching and 46-page build coverage;
- add redirect-specific executable checks before removing the legacy shell or pages.

**Step 2 gate:** no English-only core public/paid-flow dead end; correct locale document language; locale URLs have correct SEO alternates; navigation does not regress; executable `check:i18n` + production build remains green.

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
Latest GitHub conflict/state check; handoff read/update; navigation; mobile/desktop; accessibility; P0 parity; document language; locale overflow; privacy; security; token/API cost; credit margin; SEO/AEO/GEO; indexability; performance; failure/refund paths; analytics; dependency/license/supply-chain risk; fresh GitHub/Hugging Face alternatives; distinguish static review from executable evidence.

## Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
