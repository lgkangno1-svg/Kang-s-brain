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
Minimal SHA-pinned, least-privilege GitHub Actions build gate established. It found and fixed production P0 typing and legacy Quick Help prerender regressions. Green evidence includes all P0 i18n contracts, TypeScript, Next.js 16.3.3 production compilation and generated pages. No npm lockfile exists yet; dependency reproducibility remains a separate supply-chain follow-up and a lockfile must never be fabricated manually.

#### Step 2C-3 — P0 SEO locale cutover ✅
Centralized origin/public route/hreflang helpers; self-canonicals; reciprocal `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th` + `x-default`; 36 canonical localized sitemap URLs; truthful freshness; protected future private/result paths.

#### Step 2C-4 — locale-correct document language ✅
P0 root documents now emit `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`; generated HTML is checked after production build. Multiple root layouts are used without browser-language or nationality inference.

#### Step 2C-5 — deterministic legacy duplicate retirement ✅
Six known unprefixed public duplicates permanently redirect to their English canonical equivalents via explicit static map; production-server CI verifies HTTP 308, exact destination 200 and query preservation.

#### Step 2C-6 — remove shadowed legacy implementation safely ✅
- fresh main/PR #5 state inspected before editing;
- current Next.js multiple-root-layout rules rechecked: when there is no top-level `app/layout.tsx`, `/` should remain owned by a root group;
- removed the now-unreachable legacy Color, Hanbok, Credits, Culture and Gyeongbokgung page implementations;
- removed `LegacyShell` and its legacy-only English `NextIntlClientProvider` / Quick Help instance;
- retained only a minimal `(legacy)` root layout plus `/` fallback page because it is structural support for the multiple-root architecture; the fallback uses `permanentRedirect('/en')`, while `config/legacy-redirects.json` remains the public routing authority and CI still verifies it first;
- generated-document validation remains locale-driven and does not hardcode the old 46-page total;
- PR #6 workflow run `33015960301` passed dependency install, all P0 localization contracts, Next.js production build/TypeScript, generated document-language verification and deterministic legacy redirect/query-preservation checks;
- no browser-language negotiation, IP geolocation, nationality/market inference, new dependency, AI/model call, wallet/payment change or customer-data transfer was introduced.

#### Step 2C-7 — next slice: supply-chain reproducibility + Step 2 gate closure
Before starting Saju, close the known package-resolution gap without fabricating dependency state.

Scope:
- inspect fresh main and Step 2C-6 CI/merge state;
- re-search GitHub + Hugging Face for supply-chain/tooling alternatives;
- generate a real npm lockfile only from a trusted executable environment, review resolved package graph/integrity and commit only if evidence is trustworthy;
- prefer `npm ci --ignore-scripts` after a reviewed lockfile exists;
- preserve exact runtime pins (`next`, `next-intl`, React) and review whether dev dependency ranges should be narrowed;
- keep Actions SHA-pinned, least privilege, telemetry off and secrets absent;
- rerun P0 contracts, production build, document-language and legacy redirect checks;
- close Step 2 only when all gate criteria are executable-green.

**Step 2 gate:** no English-only core public/paid-flow dead end; correct locale document language; locale URLs have correct SEO alternates; deterministic legacy redirects work; shadowed legacy UI is retired; navigation does not regress; executable `check:i18n` + production build remains green.

## Step 3 — Saju deterministic cultural core
Exact / approximate / unknown birth time; never fabricate missing hour; timezone/city only when required; deterministic calendar/pillar computation; reduced-scope three-pillar result and lower pricing when hour unknown; raw birth inputs never sent to LLM; cultural/entertainment framing and deletion controls.

**Design rule:** when Step 3 or later work creates/revises user-facing UI, use Stitch MCP first for design exploration when the connector is available, then implement the selected design in the existing Next.js architecture. Never claim Stitch was used if no Stitch MCP endpoint is actually available.

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
Latest GitHub conflict/state check; handoff read/update; navigation; mobile/desktop; accessibility; P0 parity; document language; locale overflow; privacy; security; token/API cost; credit margin; SEO/AEO/GEO; indexability; redirects/404 behavior; performance; failure/refund paths; analytics; dependency/license/supply-chain risk; fresh GitHub/Hugging Face alternatives; distinguish static review from executable evidence.

## Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their gates.
