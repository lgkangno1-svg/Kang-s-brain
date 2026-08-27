# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-28  
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

### Step 2C — locale parity, executable verification and cutover ✅

#### Step 2C-1A — Personal Color native P0 ✅
Native scanner/content/metadata; browser-local deterministic preview; no image upload/AI/provider cost; message contracts and legacy-route compatibility. This is the **free/private preview layer**, not the final product ceiling; premium intent is photo-based explainable AI/vision analysis at Step 6.

#### Step 2C-1B — Hanbok native P0 ✅
Native localized route/metadata; free user-choice deterministic matcher; modular P0 messages; no photo/model/provider. This remains the free fallback; Step 7 becomes photo-aware, explainable complete-look recommendation.

#### Step 2C-1C — Credits native P0 ✅
Native P0 Credits route/metadata; authoritative numeric pricing only in `src/lib/credits/economics.ts`; fixed credits visible before paid actions; no fake checkout, subscription or ML personalized pricing.

#### Step 2C-2 — executable verification ✅
Minimal SHA-pinned, least-privilege GitHub Actions build gate established. Green evidence includes P0 i18n contracts, TypeScript, Next.js 16.3.3 production compilation and generated pages.

#### Step 2C-3 — P0 SEO locale cutover ✅
Centralized origin/public route/hreflang helpers; self-canonicals; reciprocal `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th` + `x-default`; 36 canonical localized sitemap URLs; truthful freshness; protected future private/result paths.

#### Step 2C-4 — locale-correct document language ✅
P0 root documents emit `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`; generated HTML is checked after production build.

#### Step 2C-5 — deterministic legacy duplicate retirement ✅
Six known unprefixed public duplicates permanently redirect to their English canonical equivalents via explicit static map; CI verifies HTTP 308, exact destination 200 and query preservation.

#### Step 2C-6 — remove shadowed legacy implementation safely ✅
Shadowed legacy feature pages/UI were removed while retaining minimal structural fallback; full i18n/build/document-language/redirect verification stayed green.

#### Step 2C-7 — supply-chain reproducibility + Step 2 gate closure ✅
Real npm v3 lockfile committed; deterministic package/lock parity, HTTPS npm registry origins and sha512 integrity enforced; frozen `npm ci --ignore-scripts --no-audit --no-fund`; final CI returned to least-privilege read-only permissions.

**Step 2 gate:** no English-only core public/paid-flow dead end; correct locale document language; locale URLs have correct SEO alternates; deterministic legacy redirects work; shadowed legacy UI is retired; navigation does not regress; executable `check:i18n` + production build remains green.

## Cross-feature contract — Explainable Personalization
Authoritative design: `docs/EXPLAINABLE_PERSONALIZATION.md`.

Every personalized result must expose a user-inspectable structure rather than an unexplained label:
1. concise result;
2. 3–6 concrete evidence/reason cards;
3. strongest alternative/counterfactual;
4. uncertainty and what could change the answer;
5. practical next actions;
6. method/privacy disclosure.

Do **not** reveal or fabricate model chain-of-thought. Request and expose observable evidence, deterministic calculation factors, source-backed facts and bounded confidence instead. False precision is prohibited; percentages require a defined/calibrated score.

This applies to Personal Color, Hanbok, Saju/Four Pillars, Korean Zodiac, Western Astrology, Daily Fortune, Tarot, food/place discovery and itinerary recommendations.

## Step 3 — K-Culture deterministic core — IN PROGRESS
Step 3 expands from Saju alone into the deterministic foundation for a coherent K-Culture Lab, without skipping Saju correctness gates.

### Step 3A — Saju calculation/input contracts — IN PROGRESS

Completed and production-verified:
- exact / approximate / unknown birth time are first-class input states;
- never fabricate or AI-guess a missing hour;
- exact/approximate local clock requires IANA timezone; true-solar additionally requires longitude;
- raw birth inputs are stripped from the narrative payload in favor of a whitelist-only derived schema;
- explicit `midnight` / `jasi` / `splitJasi` and `civil` / `true-solar` policy contracts;
- deterministic boundary fixture harness is part of `npm run check:saju` and therefore the production build gate;
- KASI official 2024 Ipchun boundary is stored at **2024-02-04 17:27 KST with minute precision**;
- independent evidence-bounded Year Pillar samples are production-shipped: **17:26 KST → 癸卯**, **17:28 KST → 甲辰**;
- **17:27:00–17:27:59 KST remains an explicit source-resolution uncertainty window** rather than a fabricated exact second;
- candidate `manseryeok` remains uninstalled until it can be tested against trusted external fixtures.

Remaining Step 3A gates, in order:
1. direct-KASI monthly solar-term boundary + independent implementation cross-check;
2. 23:00/00:00/01:00 outputs under each supported day-boundary policy, clearly labeled as convention choices;
3. true-solar longitude/equation-of-time handling around a branch-hour crossing;
4. historical IANA timezone/DST fixture for foreign visitors;
5. semantic lunar leap-month validity against trusted calendar data;
6. exact pinned calculator candidate evaluation against the trusted fixture suite;
7. foreign-user beginner UX for exact/rough/unknown time and minimal location input;
8. deterministic full/reduced-scope chart output with unknown time returning reduced scope instead of a guessed hour.

### Step 3B — Explainable Saju interpretation contract
- show calculated pillars/elements first;
- plain-language explanation of structural themes;
- label tradition/interpretation separately from calculation;
- alternate interpretations where conventions/schools can differ;
- explicitly explain what rough/unknown birth time changes;
- optional color/Hanbok connections are cultural storytelling, not objective prescriptions;
- bounded generative narrative only after deterministic chart correctness is executable-tested.

### Step 3C — Korean Zodiac + Western Astrology foundations
- Korean zodiac sign/animal from deterministic rules plus cultural context;
- Western sun sign deterministic first;
- moon/ascendant/full chart only after correct astronomical/timezone implementation exists;
- no fake ascendant or chart from missing birth time;
- show calculated vs conventional interpretation vs uncertainty distinctly.

### Step 3D — Tarot foundation
- explicit entertainment/reflective framing;
- 1-card and 3-card defined spreads first;
- card selection uses a documented random mechanism independent of the LLM;
- AI must not secretly choose cards to fit a preferred answer;
- show card identity, traditional keywords/symbolism, primary interpretation and a second plausible reading;
- finish with a reflection/action prompt rather than deterministic prophecy;
- no high-stakes medical/legal/financial predictions.

### Step 3E — Daily Fortune foundation
- no generic random prose masquerading as calculation;
- optional deterministic profile seed, date and timezone;
- rule-based daily theme fixed before generative wording;
- visible “Today’s lens” explains which inputs/themes were used;
- sections may include overall mood, relationships/social, travel/activity, reflection prompt and color/theme of the day;
- no high-stakes certainty claims.

**Design rule:** use Stitch MCP first for substantial user-facing redesign when actually available, then implement in the existing Next.js architecture. Never claim Stitch use when unavailable.

**Beginner-explanation rule:** assume an international visitor may not know Saju, zodiac, astrology, tarot, personal color or Hanbok conventions. Every major service must provide localized “What is this?”, required input, expected output, limitations/privacy and a simple example before sensitive or paid input.

## Step 4 — Auth + authoritative wallet
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, idempotency, authorization, rate limits and audit telemetry. Add server-owned entitlement support for Ultra/family benefits and metered allowances. Exact family member/device limits are decided here from abuse-control evidence.

## Step 5 — International payment foundation
Provider abstraction, foreign cards + PayPal target, server-authoritative pricing, verified callbacks, receipts/refunds; CSP allowlist finalized only after real provider origins exist.

### Step 5B — Ultra / Family real-time voice translation
Implement only after Step 4/5 entitlement/payment foundations.

Approved direction:
- direct Google Gemini API `gemini-3.5-live-translate-preview`;
- OpenRouter remains ordinary text/vision default;
- initial Ultra fair-use hypothesis: 30 included minutes per Ultra Trip Pass, then 8 credits/min;
- backend verifies entitlement/rate limit/allowance before issuing constrained short-lived Gemini credential;
- client connects directly for low latency while long-lived keys remain server-only;
- no raw audio/transcript in general logs and no default audio persistence;
- benchmark Korean↔P0 languages before launch;
- do not silently degrade translation quality to protect margin.

## Step 6 — Premium photo-based Personal Color
The final product intent is **user photo → AI/vision-assisted analysis → explainable styling report**.

Required architecture:
- existing browser-local scanner remains free/private preview and fallback;
- explicit consent before any remote vision call;
- strip EXIF, enforce type/size/pixel limits and transient-by-default processing;
- remote vision returns bounded observable fields, not unconstrained personality/identity inference;
- deterministic typed post-processing produces undertone/depth/contrast/clarity/lighting evidence and palette candidates;
- no race, ethnicity, nationality, religion, health, emotion, attractiveness or identity inference;
- result shows multiple color observations, competing interpretation, comparison swatches/pairs, lighting limitations and concrete “try this” guidance;
- users can correct/disagree and optionally provide a second photo;
- hard maximum model/provider cost per analysis and measurable quality benchmark across representative lighting/skin appearances;
- percentages only if calibrated; otherwise use qualitative confidence bands.

Remote vision/provider choice remains gated by fresh discovery, privacy/ZDR/retention review and measured value. Do not ship a paid photo transfer before auth/wallet/payment/consent controls exist.

## Step 7 — Photo-aware explainable Hanbok recommendation
Inputs combine color result, optional consented photo styling observations, desired mood, destination/background, weather/season, comfort/coverage, party context and explicit silhouette preferences.

Outputs are ranked complete looks:
- jeogori + chima/baji color relationship;
- saturation/depth balance;
- silhouette/design family;
- relevant collar/sleeve/skirt/baji treatment;
- accessories/hair ornament direction;
- destination/photo-backdrop fit;
- verified rental-shop match when inventory evidence exists.

Each look must state why it suits the visitor, destination rationale, trade-off, alternative version and mirror/try-on checks. Do not infer authoritative body measurements from a photo. AI composite/virtual try-on is a later visualization layer, not the recommendation brain.

## Step 8 — Gyeongbokgung area discovery
Verified place model, filters, walking/route ranking, time-sensitive facts separated from personalization/editorial copy, dietary/accessibility/language claims only when verified.

Every recommendation card should distinguish “Why for you”, verified facts/source/date, uncertainty and an alternative trade-off.

Food/restaurant discovery must include explicit user-selected Vegan, Vegetarian, Halal-certified, Muslim-friendly, pork-free, alcohol-free, gluten-free, seafood-free and allergy filters. Never infer religion/diet. Keep Halal-certified, Muslim-friendly, pork-free and alcohol-free distinct. Store evidence/source and verification date and disclose cross-contamination/stock/sauce/cooking-alcohol uncertainty.

## Step 9 — Itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings and source-fact validation.

Every stop exposes at least one constraint/reason. “Replace this stop” should support reason-specific controls such as closer, quieter, cheaper, more photogenic and better for kids instead of regenerating the entire plan.

## Step 10 — Analytics, market adaptation and expansion
Track conversion, satisfaction and margin by locale/topic without sensitive content. Include zero-AI resolution, p50/p95 AI cost/tokens, retry/escalation, Personal Color rescan/manual-correction/disagreement rate, Hanbok recommendation saves, K-Culture completion/satisfaction, food evidence freshness, itinerary replacement reasons, and live-translation minutes/cost/latency/reconnects.

## Every-step regression checklist
Latest GitHub conflict/state check; handoff read/update; navigation; mobile/desktop; accessibility; P0 parity; document language; locale overflow; privacy; security; token/API cost; credit margin; SEO/AEO/GEO; indexability; redirects/404 behavior; performance; failure/refund paths; analytics; dependency/license/supply-chain risk; fresh GitHub/Hugging Face alternatives; evidence/explanation quality; distinguish static review from executable evidence.

## Current user action required
**None.** Merchant credentials, payment onboarding, production AI credentials, analytics/search verification and legal review remain deferred to their proper gates.
