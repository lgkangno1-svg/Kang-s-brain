# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-27  
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
- native localized `/[locale]/color` plus localized metadata;
- full P0 interactive scanner localization;
- locale-neutral typed analyzer warning/error codes and stable palette IDs;
- browser-local deterministic preview only, no upload/AI/provider cost;
- message contract build gate and legacy `/color` provider regression fix.

#### Step 2C-1B — Hanbok native P0 surface ✅ by source/data-shape review
Completed this run:
- re-inspected latest `main`, recent commits, roadmap, handoff and Hanbok source before editing;
- replaced the 87-byte `/[locale]/hanbok` English bridge with a native localized Server Component and locale title/description metadata;
- added a free deterministic `HanbokMatcher` for all P0 locales covering user-selected color direction, mood and trip/walking priority;
- user choices explicitly outrank market defaults; no nationality/ethnicity/religion/profile inference is used;
- recommendation output is rule-based and local: 0 credits, 0 AI/model calls, no photo upload, no external user-data transfer;
- free-vs-paid boundary is explicit: any future premium virtual try-on/AI styling must show fixed credits and media/privacy terms before confirmation;
- added separate `messages/hanbok/{locale}.json` bundles for all six P0 locales to keep the growing public dictionary modular;
- request loader merges the Hanbok bundle only after locale allowlist validation;
- P0 dictionary parity now includes Hanbok messages and `check-hanbok-message-keys.mjs` is part of `check:i18n`;
- locale CSS now protects Hanbok fieldsets, radio labels and result facts against CJK/Thai/Vietnamese text expansion;
- no bulk Hanbok visual asset generation/collection was started.

**Discovery decision:** Hanbok-specific GitHub results were either unrelated language-learning software or image-upload/AI virtual try-on stacks. Hugging Face search showed generic fashion classifiers, fashion embeddings, virtual-try-on Spaces and small Hanbok datasets, but none justify privacy, provenance, latency, dependency and supplier-cost expansion at this migration stage. Keep deterministic preview; revisit premium visual try-on only at its later product gate with explicit consent, license/provenance review and fixed credit economics.

**Verification limitation:** clean clone → install → `npm run check:i18n` → build was attempted again on 2026-08-27, but the execution shell still cannot resolve `github.com`. Production build/deployment is not claimed.

#### Step 2C-1C — next slice
- re-inspect latest repository state first;
- convert `/[locale]/credits` to native P0 content;
- use `CREDIT_ECONOMICS.md` as the sole pricing/pack authority;
- show fixed credits before every paid action and keep server-authoritative pricing language clear;
- do not introduce ML personalized pricing or premature subscriptions;
- add localized metadata/message-contract checks where useful;
- continue CJK/Thai/Vietnamese mobile/accessibility review;
- re-run GitHub + Hugging Face discovery for wallet/credit UX before material implementation changes.

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
Deterministic ranker first; color/mood/weather/comfort inputs; structured reasons; no bulk visual asset project until separately requested. Step 2C's matcher is only the localized zero-cost preview, not the final Step 7 engine.

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
