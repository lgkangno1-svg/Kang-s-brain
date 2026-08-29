# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-29  
**Rule:** implement one reviewable slice at a time. Before every material change inspect latest `main`, recent commits/open PRs, the full project tree, this roadmap, `PROJECT_HANDOFF.md`, private CI state and a fresh live-site preflight. Update `PROJECT_HANDOFF.md` in the same material run.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
0-credit, 0-AI, no external question transfer, P0 localized, keyboard/focus/ARIA hardened.

## Step 2 — Internationalized routing and language selector ✅
Completed P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. Native localized Home/Culture/Gyeongbokgung/Personal Color/Hanbok/Credits, locale-preserving navigation, localized metadata, reciprocal hreflang + x-default, 36 canonical sitemap URLs, locale-correct document language, deterministic legacy 308 redirects, frozen lockfile/build verification, and retired shadowed legacy UI.

## Cross-feature contract — Explainable Personalization
Authoritative design: `docs/EXPLAINABLE_PERSONALIZATION.md`.

Every personalized result must expose:
1. concise result;
2. 3–6 concrete evidence/reason cards;
3. strongest alternative/counterfactual;
4. uncertainty and what could change the answer;
5. practical next actions;
6. method/privacy disclosure.

Do not expose or fabricate chain-of-thought. Percentages require a defined/calibrated score. This applies across Personal Color, Hanbok, Saju, zodiac/astrology, tarot, daily fortune, food/place discovery and itinerary recommendations.

## Step 3 — K-Culture deterministic core — IN PROGRESS

### Step 3A — Saju calculation/input contracts — IN PROGRESS
Production-verified foundations:
- exact / approximate / unknown birth time are first-class states;
- never fabricate or AI-guess a missing hour;
- exact/approximate local clock requires IANA timezone; true-solar additionally requires longitude;
- raw birth inputs are stripped from narrative payloads in favor of whitelist-only derived data;
- explicit `midnight` / `jasi` / `splitJasi` and `civil` / `true-solar` policies;
- deterministic boundary fixture harness is part of `npm run check:saju` and the production build gate;
- trusted 2024 Ipchun Year Pillar boundary samples: 17:26 KST → 癸卯, unresolved 17:27 minute, 17:28 → 甲辰;
- trusted 2024 Jingzhe Month Pillar boundary samples: 11:22 → 丙寅, unresolved 11:23 minute, 11:24 → 丁卯;
- executable 23:00 / 00:00 / 01:00 semantics for `midnight`, `jasi` and `splitJasi` with explicit convention labeling;
- deterministic NOAA/GML Equation-of-Time + longitude/timezone correction with explicit `dayOffset`, fixture-covered Singapore/Seoul hour-branch crossings, Greenwich EoT isolation and previous-day rollover;
- historical IANA/DST resolver classifies local wall-clock minutes as `unique`, `ambiguous` or `nonexistent`, never silently choosing a repeated-hour offset or shifting a skipped minute;
- DST resolver production release SHA `f386a12bfa34d409aeeb3a3de636476b51102ee8` passed exact-head MiniPC CI, exact-SHA deploy, post-deploy local 3/3 + public 12/12 + 36/36 P0 crawl;
- no Saju runtime calculator dependency.

Remaining Step 3A gates:
1. consume IANA/DST resolution in exact/approximate birth-time instant conversion and expose explicit disambiguation UX where required;
2. semantic lunar leap-month validity against trusted calendar data;
3. exact pinned calculator candidate evaluation against trusted fixtures;
4. foreign-user beginner UX for exact/rough/unknown time and minimal location input;
5. deterministic full/reduced-scope chart output with unknown time returning reduced scope instead of a guessed hour;
6. integrate true-solar `dayOffset` with the selected day-boundary policy without collapsing convention differences.

### Step 3B — Explainable Saju interpretation contract
Show calculated pillars/elements first; plain-language structural explanation; separate calculation from tradition/interpretation; expose alternative convention where relevant; explain rough/unknown-time consequences; use bounded generative narrative only after deterministic correctness is executable-tested.

### Step 3C — Korean Zodiac + Western Astrology foundations
Korean zodiac and Western sun sign deterministic first. Moon/ascendant/full chart only after correct astronomical/timezone implementation. Never fabricate missing placements.

### Step 3D — Tarot foundation
Entertainment/reflective framing; documented independent random card selection; 1-card and 3-card spreads first; show card identity, traditional symbolism, primary and alternative interpretation; no medical/legal/financial/high-impact prophecy.

### Step 3E — Daily Fortune foundation
No random generic prose masquerading as calculation. Optional deterministic profile seed + date/timezone; rule-based daily theme before wording; visible inputs/themes; reflective actions rather than deterministic predictions.

**Beginner rule:** every major service must provide localized “What is this?”, required input, expected output, limitations/privacy and a simple example before sensitive or paid input.

## Step 4 — Auth + authoritative wallet
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, idempotency, authorization, rate limits, audit telemetry, server-owned entitlements.

## Step 5 — International payment foundation
Global-first checkout; server-authoritative pricing; provider abstraction; PayPal/foreign-card target subject to fresh policy verification; signed callbacks/webhooks; receipts/refunds; browser success never grants credits.

### Step 5B — Ultra / Family real-time translation
After auth/wallet/payment only. Quality-first target remains direct Google `gemini-3.5-live-translate-preview`, server-verified entitlement and constrained short-lived client credential, no default raw-audio persistence.

## Step 6 — Premium photo-based Personal Color
Existing browser-local scanner remains free/private preview. Premium intent: explicit consent → EXIF stripping/file limits/transient processing → bounded observable vision fields → deterministic typed post-processing → explainable palette report. No sensitive-trait inference or fake calibrated percentages.

## Step 7 — Photo-aware explainable Hanbok recommendation
Combine color result, optional consented visible styling observations, explicit mood/destination/season/comfort/party/silhouette choices. Return ranked complete looks with rationale, trade-offs, alternatives and mirror/try-on checks. Do not infer body measurements from photos.

## Step 8 — Gyeongbokgung area discovery
Verified place model, source/date freshness, explicit dietary/accessibility/language evidence, clear separation of verified facts from editorial personalization.

## Step 9 — Itinerary + premium concierge
Deterministic filtering, compact prompts, partial replans, hard token/cost ceilings, source-fact validation and reason-specific replacement controls.

## Step 10 — Analytics, market adaptation and expansion
Track conversion, satisfaction and margin by locale/topic without sensitive content. Include zero-AI resolution, AI cost/tokens, retries, corrections/disagreement, K-Culture completion, source freshness and translation latency/cost where applicable.

## Release gate for every material slice
1. fresh main/open PR/tree/handoff/roadmap inspection;
2. fresh production no-retry preflight;
3. isolated branch;
4. private `target-ref.txt` = exact 40-char branch head;
5. self-hosted MiniPC CI success;
6. merge only after green;
7. private `deploy-ref.txt` = exact merged SHA;
8. local origin + consecutive public Cloudflare checks;
9. full sitemap/P0 crawl before claiming production.

## Reliability invariant
The 2026-08-27 Cloudflare incident is formally closed as of 2026-08-29 after two separate genuine scheduled stability-sensitive runs plus fresh local/public/full-crawl confirmation. It stays closed only while local origin is healthy, private 10-minute stability monitoring remains clean, deploy probes are consecutive, and live-site preflight never hides intermittent 1033/530/502 with retries. Any sampled 1033/530/502 immediately reopens reliability priority. Never grant the repository-scoped runner general sudo/Docker access.

## Current user action required
**None.** Merchant credentials, payment onboarding, production AI credentials and narrowly privileged MiniPC actions remain deferred until genuinely required.
