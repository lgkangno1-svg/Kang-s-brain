# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-26  
**Rule:** do not attempt the entire product in one patch. Each step must be reviewable, documented and regression-checked before the next major layer.

## Step 0 — Product baselines ✅
- PRD
- architecture
- AI routing/cost policy
- credit economics
- SEO/AEO/GEO baseline
- open-source discovery gate
- international market/localization strategy
- security/token-efficiency baseline

## Step 1 — Free Quick Help + market/locale registry ✅
- zero-API button-driven Quick Help mounted globally;
- initial English FAQ tree;
- prioritized locale registry committed;
- no runtime AI/embedding dependency;
- keyboard/accessibility hardening: correct dialog controls, Escape close, focus return and explicit cost labelling;
- P0 seed dictionaries committed for English, Simplified Chinese, Japanese, Traditional Chinese, Vietnamese and Thai;
- dictionaries include global navigation, Quick Help shell/root topics, credit explanations and privacy/consent copy needed by later flows;
- mobile panel already uses viewport-bounded width/height; full CJK/Thai/Vietnamese overflow QA moves to Step 2 when the dictionaries are actually wired.

**Step 1 gate result:** PASS by static review. Quick Help remains 0-credit and 0-AI, collects no sensitive input, and existing route targets were not changed. A local production build was attempted from the automation sandbox but external DNS to GitHub was unavailable, so Step 2 must rerun `npm install`/`npm run build` after the i18n dependency is added in an environment with repository/network access.

## Step 2 — Internationalized routing and language selector ← next
- pin/review `next-intl@4.13.7` compatible release;
- introduce `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th` routes without breaking migration;
- functional language switcher;
- browser-language suggestion, never forced nationality/IP redirect;
- translated global navigation, consent, credit explanations and Quick Help;
- hreflang/x-default/canonical/sitemap updates;
- verify mobile clipping and layout for CJK/Thai/Vietnamese text.

**Gate:** no paid flow has an English-only dead end; locale URLs have valid SEO alternates.

## Step 3 — Saju input and deterministic cultural core
- exact / approximate / unknown birth-time paths;
- never fabricate missing birth hour;
- timezone/city requested only when calculation needs it;
- deterministic zodiac/calendar/pillar calculation architecture;
- 3-pillar scoped result when birth time is unknown;
- reduced/appropriate credit pricing for reduced-scope output;
- raw birth inputs never sent to LLM;
- culture/entertainment framing and deletion controls.

**Gate:** deterministic test vectors; unknown-time cases cannot accidentally produce a full hour-pillar claim.

## Step 4 — Auth + authoritative wallet
- guest/free browsing;
- account creation for purchases/saved results;
- immutable credit ledger;
- reserve/capture/release/refund transactions;
- idempotency and authorization tests;
- rate limiting and audit telemetry.

## Step 5 — International payment foundation
- Korea-compatible provider abstraction;
- foreign cards + PayPal target;
- server-authoritative pricing;
- signed/verified payment callbacks;
- receipts/history/refunds;
- finalize CSP after real payment origins are known.

**User dependency likely begins here:** merchant/payment-provider credentials and business onboarding.

## Step 6 — Personal-color v1
- browser/local analysis first;
- lighting quality check;
- manual correction;
- no sensitive-identity inference;
- premium remote vision only with explicit consent + ZDR/privacy gates;
- multilingual results.

## Step 7 — Hanbok recommendation v1
- deterministic ranker first;
- color/mood/weather/comfort/party inputs;
- structured result reasons;
- connect personal color → Hanbok;
- defer large AI-generated visual asset project until user requests it separately.

## Step 8 — Gyeongbokgung area discovery
- verified place data model;
- attraction/restaurant/café filters;
- walking-time and route-position ranking;
- time-sensitive facts separated from editorial copy;
- dietary/accessibility/language-service filters only when verified.

## Step 9 — Itinerary + premium concierge
- deterministic candidate filtering;
- compact structured prompt to DeepSeek/Qwen tier;
- partial re-plan sends only affected itinerary block;
- hard token/cost ceilings;
- source-fact validator prevents hallucinated businesses/details.

## Step 10 — Analytics, market adaptation and expansion
- locale/topic conversion metrics;
- payment/feature margin dashboards;
- zero-AI resolution rate;
- p50/p95 AI cost/tokens;
- market-level UI ordering experiments;
- expand P1/P2 languages from actual demand;
- expand Seoul areas and then other Korean destinations.

## Every-step regression checklist

Before moving on, check:
- mobile + desktop navigation;
- accessibility/keyboard/focus;
- locale overflow/text direction assumptions;
- security boundaries;
- sensitive-data handling;
- token/API-cost impact;
- credit/margin impact;
- SEO/AEO/GEO and indexability;
- structured data/crawler behavior;
- performance/bundle impact;
- error/failure/refund path;
- dependency/license risk;
- whether a GitHub/Hugging Face candidate is now better than custom code.

## Current user actions required

**None immediately.** Continue architecture and frontend/backend scaffolding first.

Later, the user will likely need to provide or complete:
1. payment provider merchant onboarding/keys (Toss Payments international/PayPal or final chosen provider);
2. production hosting/DNS access for `korea.avocadoss.co.kr` cutover if not already connected to the deploy environment;
3. OpenRouter production API key/limits, kept server-side;
4. analytics/search-console verification credentials or DNS records;
5. business/legal copy review for privacy/refund/terms before paid production launch.

Do not request these until the implementation reaches the corresponding gate.
