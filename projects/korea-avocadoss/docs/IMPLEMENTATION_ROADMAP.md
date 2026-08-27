# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-27  
**Rule:** implement one reviewable slice at a time. Before every material change inspect latest `main`, recent commits, project tree, this roadmap and `PROJECT_HANDOFF.md`; assume another AI/developer may have changed the repository. Update `PROJECT_HANDOFF.md` in the same run.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
0-credit, 0-AI, no external question transfer, P0 localized, keyboard/focus/ARIA hardened.

## Step 2 — Internationalized routing and language selector ✅

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

#### Step 2C-7 — supply-chain reproducibility + Step 2 gate closure ✅
- generated a real npm v3 lockfile in trusted GitHub Actions with lifecycle scripts disabled;
- deterministic policy requires package.json/root-lock parity, HTTPS npm registry origins and sha512 integrity;
- reviewed lock graph contains 106 package entries with no missing license metadata; runtime pins remain exact and dev ranges remain intentionally range-based because the committed lockfile freezes the resolved versions;
- temporary branch-only write permission used only to materialize the generated lockfile was removed before merge; final CI is back to read-only contents permission with persisted checkout credentials disabled;
- CI now uses frozen `npm ci --ignore-scripts --no-audit --no-fund`;
- PR #9 workflow run `33069835102` passed lockfile policy, frozen install, all P0 i18n contracts, Next.js production build, generated document-language checks and deterministic legacy redirect/query-preservation checks;
- no runtime dependency, application AI call, customer-data transfer, wallet/payment behavior or UI behavior was added.

**Step 2 gate:** no English-only core public/paid-flow dead end; correct locale document language; locale URLs have correct SEO alternates; deterministic legacy redirects work; shadowed legacy UI is retired; navigation does not regress; executable `check:i18n` + production build remains green.

## Step 3 — Saju deterministic cultural core
Exact / approximate / unknown birth time; never fabricate missing hour; timezone/city only when required; deterministic calendar/pillar computation; reduced-scope three-pillar result and lower pricing when hour unknown; raw birth inputs never sent to LLM; cultural/entertainment framing and deletion controls.

**Design rule:** when Step 3 or later work creates/revises user-facing UI, use Stitch MCP first for design exploration when the connector is available, then implement the selected design in the existing Next.js architecture. Never claim Stitch was used if no Stitch MCP endpoint is actually available.

**Beginner-explanation rule:** assume an international visitor may not know what Saju, Korean zodiac, personal color, Hanbok conventions or other Korea-specific services mean. Every major service must provide a short localized “What is this?” explanation, what the user provides, what they receive, limitations/privacy and an example before asking for sensitive or paid input.

## Step 4 — Auth + authoritative wallet
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, idempotency, authorization, rate limits, audit telemetry. Add server-owned entitlement support for Ultra/family benefits and metered allowances; exact family member/device limits are decided here with abuse-control evidence rather than guessed earlier.

## Step 5 — International payment foundation
Provider abstraction, foreign cards + PayPal target, server-authoritative pricing, verified callbacks, receipts/refunds; CSP allowlist finalized only after real provider origins exist.

### Step 5B — Ultra / Family real-time voice translation
Implement the approved quality-first translation benefit only after Step 4/5 entitlement and payment foundations exist.

Approved direction:
- default model/provider: direct Google Gemini API `gemini-3.5-live-translate-preview`;
- OpenRouter remains default for ordinary text/vision but the dedicated Live Translate model was not confirmed there at decision time;
- initial Ultra fair-use hypothesis: **30 included minutes per Ultra Trip Pass**, then **8 credits/min** at a clearly displayed fixed unit rate;
- backend verifies entitlement/rate limit/remaining allowance before issuing a constrained short-lived Gemini ephemeral token;
- browser/mobile client connects directly to Gemini Live API over WebSocket to minimize latency; long-lived Google API keys remain server-only;
- no raw microphone audio/transcript in general logs; no default audio persistence; transcript saving requires separate explicit action;
- hard session/day ceilings and server-authoritative metering prevent runaway supplier cost;
- explicit source/target language choice overrides any future optional detection;
- benchmark Korean↔P0 languages in realistic noisy mobile conditions before launch;
- use Stitch MCP first for the user-facing translator screen when available;
- full policy: `docs/LIVE_TRANSLATION.md`.

Do not advertise uncapped “unlimited” usage until measured economics support it. Do not reduce translation quality merely to preserve margin; adjust allowance/unit economics transparently instead.

## Step 6 — Personal-color v1 hardening/premium boundary
Browser/local first, representative validation, manual correction, no sensitive identity inference; remote vision only if measured value justifies consent/ZDR/EXIF/privacy and hard supplier-cost ceilings.

## Step 7 — Hanbok recommendation v1
Deterministic ranker first; color/mood/weather/comfort; structured reasons; no bulk visual asset project until separately requested.

## Step 8 — Gyeongbokgung area discovery
Verified place model, filters, walking/route ranking, time-sensitive facts separated from editorial copy, dietary/accessibility/language claims only when verified.

Food/restaurant discovery must include explicit user-selected dietary filters such as Vegan, Vegetarian, Halal-certified, Muslim-friendly, pork-free, alcohol-free, gluten-free, seafood-free and relevant allergy needs. Never infer religion/diet from locale/name. Keep `Halal-certified`, `Muslim-friendly`, `pork-free` and `alcohol-free` distinct; do not label an unverified restaurant as halal. Store evidence/source and verification date for sensitive dietary claims and disclose cross-contamination/stock/sauce/cooking-alcohol uncertainty where relevant.

## Step 9 — Itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings, source-fact validation.

## Step 10 — Analytics, market adaptation and expansion
Locale/topic conversion, margin dashboards, zero-AI resolution, p50/p95 AI cost/tokens, retry/escalation, market experiments, P1/P2 expansion from measured demand. Include real-time translation p50/p95 minutes per Ultra buyer/family, supplier cost/minute, reconnect rate, latency, allowance-exhaustion rate and satisfaction without storing conversation bodies.

## Every-step regression checklist
Latest GitHub conflict/state check; handoff read/update; navigation; mobile/desktop; accessibility; P0 parity; document language; locale overflow; privacy; security; token/API cost; credit margin; SEO/AEO/GEO; indexability; redirects/404 behavior; performance; failure/refund paths; analytics; dependency/license/supply-chain risk; fresh GitHub/Hugging Face alternatives; distinguish static review from executable evidence.

## Current user action required
**None.** Merchant credentials, production DNS/hosting, OpenRouter/Google production API credentials, analytics/search verification and legal review remain deferred to their gates.
