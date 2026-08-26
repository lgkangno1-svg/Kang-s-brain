# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-26  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current implementation phase:** Step 2 — Internationalized routing and language selector  
**Current next slice:** Step 2B-4  
**Status authority:** `docs/IMPLEMENTATION_ROADMAP.md` for ordered implementation gates; this file for human/AI handoff context.

> This is a living handoff file. Every material Korea Concierge development run must inspect the latest `main` and recent commits first, then update this file in the same run whenever implementation status, decisions, blockers, risks, tests, dependencies, costs, security posture, or the next step changes. Do not rely on remembered state from a prior conversation.

## 1. Why this product exists

Korea Concierge is a mobile-first service for international visitors to Korea. The product should reduce common trip-planning and Korea-culture friction while offering optional paid personalization where it has clear user value.

The intended experience combines:

- free, zero-AI Quick Help for common questions and routing;
- multilingual Korea travel and culture guidance;
- Gyeongbokgung-area discovery and practical local planning;
- personal-color and Hanbok recommendation experiences;
- a K-Culture Lab including deterministic Saju/zodiac experiences;
- a server-authoritative credit wallet and international-friendly payment foundation;
- bounded, cost-controlled AI only where deterministic/static/local computation is insufficient.

The product must not become an expensive generic chatbot. It should use deterministic computation, curated content, filtering/ranking and browser-local work before any AI call.

## 2. Product goal

Build a trustworthy, fast, multilingual Korea companion that international visitors can use without needing Korean-language knowledge, while maintaining strong gross margin and strict privacy/security controls.

Success means all of the following are true together:

1. Visitors can understand and navigate core public experiences in their language.
2. Free questions are resolved without AI whenever practical.
3. Paid actions show a fixed credit price before execution and have predictable supplier cost.
4. Sensitive inputs are minimized and never unnecessarily sent to an LLM.
5. Travel/place facts are source-validated instead of trusted merely because an AI returned them.
6. Public pages are crawlable, answer-first, factual and locale-aware; private/personal/payment pages are noindex where appropriate.
7. The site remains usable on mobile, accessible by keyboard/screen reader, and resilient to localization text expansion.
8. Production is not claimed or cut over until there is actual build/deployment evidence and rollback readiness.

## 3. Non-negotiable product principles

### International visitors

Current locale priority:

- P0: English (`en`), Simplified Chinese (`zh-CN`), Japanese (`ja`), Traditional Chinese (`zh-TW`), Vietnamese (`vi`), Thai (`th`)
- P1: Indonesian, Malay
- further expansion only from measured demand and current tourism evidence

Locale/market defaults are hypotheses based on aggregate evidence only. They never override an explicit user preference. Do not infer nationality, ethnicity, religion or individual preferences from names, faces or locale. Taiwan and Hong Kong analytics must remain separable even if both use Traditional Chinese. English is the global fallback, not a US-only experience.

Localization means adapting practical needs, acquisition/search channels, travel friction, dietary/food filters, payment expectations and content interests where evidence supports the adaptation; it does not mean stereotyping individuals.

### Saju

Birth time is optional and supports exact time, rough time band, and `I don't know`.

Never fabricate a missing birth hour and never ask AI to infer it from personality. Unknown time produces only deterministic components that do not require the hour pillar, is clearly labelled reduced-scope / birth time not provided, and must be priced below full scope when monetized. Approximate time must disclose boundary uncertainty.

Request birth city/timezone only when deterministic calendar/time conversion needs it and explain why. Calendar/pillars must be computed deterministically before narrative AI. Raw birth date/time/city/name/account identifiers must never be sent to an LLM; only minimum non-identifying derived structures may be sent.

### Free Quick Help

Quick Help must remain 0 credits, 0 AI API calls, no external data transfer, button/topic-tree based, fully localized in P0 languages, and a router into the appropriate free or paid feature.

Do not add RAG, embeddings or an LLM unless the knowledge base becomes large enough that measured UX data demonstrates a real need.

### Security

Security is a product requirement, not a later hardening phase. Required architecture includes strict server authorization, input validation, immutable/idempotent wallet operations, verified payment callbacks, rate limits on auth/payment/AI endpoints, dependency pinning/review, data minimization, EXIF stripping for remote images, ZDR/data-collection restrictions for sensitive media, safe logging that excludes sensitive prompt bodies, prompt-injection-resistant instruction/data separation and source validation for AI-returned place/business facts.

Do not guess CSP origins before real hosting/payment/analytics integrations are selected. At that point enforce the smallest practical allowlist. Secrets stay server-only and must not be exposed through `NEXT_PUBLIC_*` variables.

### Token and supplier-cost efficiency

Before every AI call attempt, in order: deterministic calculation; curated/static answer; safe cache; rule-based ranking/filtering; browser-local computation; only then the cheapest qualified Chinese OpenRouter model.

Use compact IDs/enums/derived facts rather than full records or histories. Pre-filter candidates, normally to no more than 5–8. Use feature-specific short system prompts and structured outputs. Do not resend an entire itinerary for a small replan. Bound history and summarize only when continuity genuinely requires it.

Every paid AI path must have hard input/output token ceilings, maximum provider price, maximum AI supplier cost, one bounded retry by default, same-model provider fallback before model escalation, and telemetry for `usage.cost`, tokens, provider, latency, retry and fallback without sensitive prompt bodies. Monitor p50/p95 tokens and supplier cost, retry/escalation rates and supplier cost per captured credit.

### Credit economics

`docs/CREDIT_ECONOMICS.md` is the monetization source of truth and supersedes older PRD pack hypotheses.

Launch assumption: one-time Basic / Advanced / Ultra Trip Passes, optional top-ups, no subscription unless conversion data later justifies one, and no ML-personalized pricing at launch.

Every paid action shows fixed credits before execution. Wallet mutations must use an immutable server-authoritative ledger with atomic reserve/capture/release/refund semantics. Supplier-cost analysis must include payment funding fees, retries/fallbacks and conservative payment/FX reserves.

### Open-source discovery gate

Before implementing or materially revising every feature/subfeature, search both GitHub and Hugging Face for relevant maintained repositories, libraries, models, datasets, Spaces, benchmarks, prompts or reference implementations.

Evaluate commercial license, maintenance/recency, provenance, privacy, runtime/inference cost, latency, bundle/compute requirements, browser/mobile fit, multilingual quality, benchmark evidence, security/supply-chain risk and expected user/margin benefit. Prefer maintained permissive components. Record adopt/adapt/reject decisions in `docs/OPEN_SOURCE_DISCOVERY.md`. Re-search when revisiting a feature.

### SEO / AEO / GEO

Treat crawlability, canonicalization, sitemap/robots, locale-prefixed URLs, hreflang/x-default, metadata, internal linking, Core Web Vitals, semantic HTML, media optimization, rendering/indexability, structured data validity, local-intent content and AI-crawler access as core product requirements.

Public content should be answer-first, factual, source-backed and easy to quote/cite. Private account, payment and personal-result pages should be noindex where appropriate.

## 4. Source-of-truth documents

Read these before material implementation changes:

- `docs/PRD.md` — product requirements and scope baseline
- `docs/ARCHITECTURE.md` — technical architecture baseline
- `docs/AI_ROUTING.md` — AI provider/routing/privacy/cost controls
- `docs/CREDIT_ECONOMICS.md` — current credit packaging and margin authority
- `docs/SEO_AEO_GEO.md` — search/answer/generative-engine requirements
- `docs/OPEN_SOURCE_DISCOVERY.md` — open-source/model discovery log
- `docs/INTERNATIONALIZATION_MARKETS.md` — market/locale research and adaptation principles
- `docs/SECURITY_TOKEN_EFFICIENCY.md` — security/privacy/token-efficiency rules
- `docs/IMPLEMENTATION_ROADMAP.md` — ordered build plan and completion gates
- `docs/PROJECT_HANDOFF.md` — current cross-session/cross-AI implementation context

When documents conflict, prefer the more specific/current authority stated inside the documents. In particular, `CREDIT_ECONOMICS.md` supersedes older PRD credit-pack hypotheses.

## 5. Current architecture snapshot

The current application is a Next.js project under `projects/korea-avocadoss`.

Internationalization foundation uses an exact `next-intl@4.13.4` pin. P0 locale routing is designed around `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`. Locale values are allowlisted/validated before loading dictionaries. Static reviewed dictionaries are the production localization source; runtime translation ML is intentionally not used.

During migration, unprefixed legacy routes are temporarily preserved rather than forcing a redirect into incomplete localized destinations. Locale-aware navigation helpers preserve the active locale, and temporary localized route bridges prevent localized URLs from becoming 404s before each route is natively migrated.

Quick Help is a deterministic message-key-driven decision graph. P0 dictionaries are parity-checked and Quick Help graph keys are checked before the production build command proceeds.

## 6. Completed implementation

### Step 0 — Product baselines ✅

Completed baseline documents for product, architecture, AI routing/cost, credit economics, SEO/AEO/GEO, open-source discovery, international markets and security/token efficiency.

### Step 1 — Free Quick Help + market/locale registry ✅

Completed by static review: globally mounted deterministic Quick Help; 0 credits / 0 AI / no sensitive-input collection; P0 seed dictionaries; keyboard/focus/ARIA fixes; free/consent/credit copy including unknown birth-time guidance.

### Step 2A — dependency + request/routing foundation ✅

Completed: `next-intl@4.13.4` exactly pinned; Next.js plugin wired while retaining security headers; P0 locale registry/default `en`; validated locale/message loading with fail-closed behavior; runtime translation model rejected.

### Step 2B-1 — locale routes + navigation shell ✅ by static review

Completed: locale-preserving navigation; accessible language selector retaining pathname; validated `[locale]` layout/home shell; temporary `LegacyShell`; locale-preserving Quick Help CTAs; temporary localized route bridges; redirect/proxy cutover intentionally disabled pending parity/build evidence.

### Step 2B-2 — complete Quick Help localization + QA ✅

Completed: hard-coded English removed from the Quick Help tree; graph contains message keys; full P0 tree localized; deterministic dictionary validation; build gates on i18n checks; no translation API/model/RAG/embedding added.

### Step 2B-3 — localized landing + first native public route ✅ by source review

Completed: P0 localized landing copy; locale landing English fallback removed; `/[locale]/culture` natively localized; Saju copy states birth time is optional/never guessed; public dictionaries added to parity validation; Quick Help graph/message-key checker added; no new runtime AI cost/package/sensitive-data flow.

## 7. Current verification state

Source state and commits have been reviewed through GitHub. The previous execution environment could not resolve `github.com` from its shell when attempting a clean clone, so clean `npm install`, `npm run check:i18n` and `next build` have not yet been proven there. GitHub also did not expose a CI status check for the project at that point.

Therefore static/source review evidence exists, but production build success and production deployment are **not** claimed, and locale redirect/canonical cutover remains deferred.

A future agent with a working checkout/network should run the real install/check/build path before upgrading any build-dependent gate.

## 8. Current work position

**Roadmap position:** Step 2B-4 is next.

Highest-value next slice, in order:

1. Migrate Gyeongbokgung discovery public route from temporary bridge content to a native P0 localized shell.
2. Add localized metadata for already-native home and culture routes without prematurely enabling canonical/hreflang cutover.
3. Improve locale/message type safety only if it does not introduce fragile build coupling.
4. Review/fix CJK, Thai and Vietnamese mobile overflow on growing localized surfaces.
5. Keep browser-language suggestion/negotiation deferred until explicit locale destinations are proven.

Do not skip ahead to Saju core, wallet/payment or later features unless Step 2 is gated complete or a regression/security issue requires an explicit exception.

## 9. Planned roadmap after the current slice

### Step 2C — locale cutover and SEO completion
Activate locale negotiation only after localized destinations build; move language handling to locale-root architecture; remove temporary legacy shell; add canonical/hreflang/x-default and locale sitemap; migrate remaining public routes; eliminate English-only paid-flow dead ends.

**Step 2 gate:** no paid flow has an English-only dead end; locale URLs have valid SEO alternates; existing links do not regress.

### Step 3 — Saju deterministic core
Exact/approximate/unknown birth-time UX; deterministic calendar/pillars; 3-pillar reduced scope; reduced pricing; privacy-preserving derived LLM payloads; culture/entertainment framing and deletion controls.

### Step 4 — Auth + authoritative wallet
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, idempotency, authorization, rate limits and audit telemetry.

### Step 5 — international payment foundation
Provider abstraction, foreign cards + PayPal target, server-authoritative pricing, verified callbacks, receipts/refunds; CSP origins only after providers are real.

### Step 6 — Personal-color v1
Browser/local-first analysis, lighting checks, manual correction, no sensitive identity inference, consent/ZDR gates for remote vision, multilingual results.

### Step 7 — Hanbok recommendation v1
Deterministic ranking first with color/mood/weather/comfort and structured reasons. **Do not start deferred bulk Hanbok visual asset generation/collection unless the user separately requests it.**

### Step 8 — Gyeongbokgung area discovery
Verified place model, filters, walking/route ranking, time-sensitive facts separated from editorial copy and verified dietary/accessibility/language-service claims.

### Step 9 — itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings and source-fact validation.

### Step 10 — analytics, market adaptation and expansion
Locale/topic conversion, margin dashboards, zero-AI resolution, p50/p95 AI cost/tokens, market experiments and P1/P2 expansion from measured demand.

## 10. Deferred / explicitly out of scope for now

- bulk Hanbok visual asset generation/collection until separately requested;
- premature subscriptions;
- ML-personalized pricing at launch;
- runtime translation models for normal localization;
- RAG/embeddings/LLM for current-size Quick Help;
- locale redirect/browser-language auto-routing before destination/build parity;
- guessed CSP origins;
- production deployment claims without evidence.

## 11. Mandatory workflow for every future development run

1. Inspect latest `main`, project tree and recent commits before editing.
2. Compare source against `IMPLEMENTATION_ROADMAP.md` and this handoff; assume another AI/developer may have changed it.
3. Re-evaluate the next slice if evidence changed, while preserving completed gates unless a regression requires reopening them.
4. Before materially revising the selected feature/subfeature, search GitHub and Hugging Face and update `OPEN_SOURCE_DISCOVERY.md` with adopt/adapt/reject reasoning.
5. Implement only the next highest-value reviewable slice.
6. Run feasible regression checks across navigation, mobile, accessibility, i18n, privacy, security, credits/payment, performance, SEO/AEO/GEO, AI cost routing, analytics and dependency/license risk.
7. Run real tests/build where possible and distinguish static review from executable evidence.
8. Update the relevant source documents.
9. **Update this `PROJECT_HANDOFF.md` in the same run** with date, current step, completed work, evidence/tests, decisions, blockers/risks, user action and exact next slice.
10. Commit clearly. Never overwrite concurrent improvements merely to restore an older remembered state.

## 12. Required handoff fields for each material run

Record:

- date and commit SHA(s);
- roadmap slice completed/revisited;
- files/features materially changed;
- tests/build/static evidence;
- GitHub/Hugging Face sources reviewed and adopt/adapt/reject result;
- security/privacy impact;
- AI token/API/supplier-cost impact;
- credit/margin impact;
- SEO/AEO/GEO/i18n/accessibility impact;
- known regressions/blockers;
- smallest user action required, or `None`;
- next exact roadmap slice.

## 13. Change log

### 2026-08-26 — Living handoff established and workflow enforced

- Latest observed `main` before this documentation run: `d0a99b6cb708fa2d2fe149e6134b2696db905cb9` (`docs: record Step 2B-3 discovery and decisions`).
- Confirmed no prior handoff file existed.
- Created `PROJECT_HANDOFF.md` in commit `c0725369d31e25d900423c659eff3bed91291c3a`.
- Updated `IMPLEMENTATION_ROADMAP.md` to make handoff maintenance mandatory in commit `0f4fcfbeaf27be796a57eac1eca91ec9e9df24be`.
- Updated project `README.md` so future agents/developers are directed to inspect latest main, read the handoff first, follow the roadmap, and update the handoff in every material run in commit `87082f3f5aab895201fe31662e0942ad67d434fc`.
- Current next implementation slice remains Step 2B-4.
- Verification for this documentation-only slice: GitHub source/commit inspection and successful repository writes. No runtime code changed, so no new executable behavior was introduced by this slice.
- Open-source discovery: not rerun because no product feature/subfeature or dependency was implemented/revised; this slice only establishes documentation/process control.
- Security/privacy impact: no data path or secret handling changed; the handoff makes security/privacy review mandatory on future runs.
- AI/token/supplier-cost impact: 0 new AI calls, 0 runtime token cost, 0 new provider/model/dependency.
- Credit/margin impact: none.
- SEO/AEO/GEO/i18n/accessibility impact: no runtime behavior changed; future-run regression review is now explicitly required.
- Known blockers: prior clean build/network limitation remains unchanged.
- User action required: None.
- Next exact roadmap slice: Step 2B-4 — native localized Gyeongbokgung discovery shell, localized metadata for native routes, safe type-safety improvements, and CJK/Thai/Vietnamese mobile overflow review.
