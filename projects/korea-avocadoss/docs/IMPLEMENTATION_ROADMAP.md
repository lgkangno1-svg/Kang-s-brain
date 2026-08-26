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
- sitemap changed from migration-only unprefixed URLs to 36 canonical localized URLs (6 public route shapes × 6 P0 locales) with reciprocal language alternates;
- removed false `lastModified: new Date()` build-time freshness claims; add last-modified only from real content review timestamps later;
- robots still permits intended public/search/answer crawling and now protects both unprefixed and P0-prefixed future account/saved/checkout/personal-result paths;
- browser-language auto-routing and LegacyShell removal were intentionally excluded;
- PR #3 run `32999919664` passed install, P0 i18n contracts and Next.js production build before documentation completion.

#### Step 2C-4 — next slice: document language + legacy boundary
The localized pages still live under a root document whose `<html lang>` is currently English because migration-only legacy routes and locale routes share one root layout. This is now the highest-value remaining Step 2 accessibility/SEO defect.

Handle it as a separate rollback-aware architecture slice:
- inspect fresh main and research current Next.js/next-intl root-layout patterns before changing route structure;
- ensure each P0 localized document emits the correct HTML language (`en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`) without making static generation fragile;
- preserve working unprefixed legacy URLs until an explicit migration/removal decision is proven;
- do not combine browser-language auto-redirect, legacy route deletion and document-language restructuring in one risky patch;
- regression-test Quick Help provider boundaries, locale navigation, sitemap/canonical output and all generated routes.

After document-language correctness is proven, decide in a later small slice whether unprefixed legacy duplicates should redirect or retire. Explicit user locale choice must always outrank browser/market inference.

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
