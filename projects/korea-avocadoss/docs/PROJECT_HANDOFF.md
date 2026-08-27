# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 3 — explainable K-Culture deterministic core, with the Stitch UI system now merged  
**Latest completed UI slice:** PR #11 — Stitch-designed explainable UI/UX system, squash merge `95a86da4554a9a027b39a5480c971aaa48939672`  
**PR #11 exact-head MiniPC CI:** source `1e2dcb8daaf6daac610e7b57785da81e64d61446`, private run `33085085859` — SUCCESS  
**Primary CI:** private `lgkangno1-svg/korea-concierge-ci` repository-scoped MiniPC runner  
**Production runtime:** Next.js 16.3.3 via `korea-concierge.service` on MiniPC port `3100`, behind the existing Cloudflare Tunnel  
**Production caution:** the Stitch merge is not considered live until exact-main deployment and public checks finish. Cloudflare has shown intermittent HTTP `530` / browser Error `1033` while the local app remained healthy; tunnel-level diagnosis is active.  
**Exact next implementation slice after production stabilization:** Step 3A deterministic Saju input/calculation contracts.

> This file is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, open PRs, the project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics, production deployment or the next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. The product should not merely emit answers; it should make personalized recommendations understandable and actionable: **what was measured/calculated, why the recommendation follows, what the competing interpretation is, what uncertainty remains and what to try next**.

Authoritative shared contract: `docs/EXPLAINABLE_PERSONALIZATION.md`.

The shared result pattern is:

1. concise result;
2. concrete evidence/reason cards;
3. measured or deterministically calculated data where available;
4. strongest alternative/counterfactual;
5. uncertainty/material conditions;
6. practical next actions;
7. method/privacy disclosure.

Do not expose or fabricate hidden chain-of-thought. Do not invent precision. **Numbers are encouraged when they come from a defined measurement or scoring rule.** A visible number must be traceable to a measurement, deterministic calculation, verified source, or explicitly documented rubric.

International visitors may not understand Korea-specific concepts. Saju, zodiac, astrology, fortune, tarot, personal color, Hanbok and premium naming must provide a friendly localized “What is this?”, required inputs, what the user receives, limitations/privacy and a simple example before sensitive or paid input.

### Photo-based personalization
The premium Personal Color and Hanbok product direction is **user photo → consented AI/vision-assisted analysis → explainable personalized recommendation**. The existing browser-local Personal Color scanner and deterministic Hanbok matcher are free/private previews and fallbacks, not the final premium ceiling.

Premium photo analysis must only describe styling-relevant visible observations. Never infer race, ethnicity, nationality, religion, health, emotion, attractiveness or identity. Remote photo processing requires explicit consent, EXIF stripping, size/type limits, transient-by-default handling, provider retention/ZDR review, server-only credentials, rate limits and a fixed supplier-cost ceiling.

The merged Stitch Personal Color UI was corrected before merge so that it shows actual deterministic measurements instead of decorative numbers. Current local-analysis evidence can expose the actual calculated undertone/depth/contrast, the analyzer confidence and CIELAB `L*` lightness. It no longer floors confidence to an invented minimum or claims daylight merely because a photo was uploaded.

The merged free Hanbok UI now uses a transparent deterministic preference-fit score rather than fixed fake match percentages. Current score weights are:
- palette fit: 40 points;
- mood fit: 25;
- walking/photo priority: 15;
- backdrop fit: 10;
- season fit: 10.

This `0–100` value is a **preference-fit rubric**, not AI confidence or an objective beauty score. Backdrop and comfort displays are also derived from explicit selections. Future premium photo-aware Hanbok recommendations may add real photo evidence only after the privacy/AI gates exist.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. P1: Indonesian/Malay. Explicit user choice wins. Never infer nationality, ethnicity, religion or sensitive identity from name, face, voice or locale.
- **Saju:** exact / approximate / unknown birth time are all valid. Never fabricate or AI-guess a missing hour. Unknown time gets deterministic reduced scope and explicit uncertainty/candidate possibilities where applicable.
- **Saju privacy:** raw birth date/time/city/name/account identifiers do not go to ordinary narrative AI or general logs. Deterministic derived structures come first.
- **Names and Saju are separate:** a personal name is not required to calculate Four Pillars. Never invent Hanja for a foreign name to make Saju work. Hanja/stroke/name-element analysis belongs to the optional Naming/Onomastics service.
- **K-Culture:** calculated/randomized mechanics are fixed before generative wording. Tarot selection is independent of the LLM; daily-fortune theme is fixed before prose. Outputs are cultural/entertainment/reflection, not high-stakes prediction.
- **Explainability:** result + evidence/data + alternative + uncertainty + action + method/privacy. No fabricated chain-of-thought or decorative precision.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, deterministic localized tree.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, prompt instruction/data separation, source validation and server-only long-lived secrets.
- **AI cost:** deterministic/static/cache/rules/browser-local first. Remote vision/LLM only when it materially improves value; bounded candidates/history/retries/tokens/provider cost and privacy-safe telemetry.
- **Credits:** `CREDIT_ECONOMICS.md` remains authoritative for ordinary paid actions. Basic/Advanced/Ultra are one-time Trip Passes plus optional top-ups; no subscription at launch.

## 3. Premium Naming Studio direction
A separate premium Korean/Asian naming product is planned at roughly **USD $149–150**, positioned as a high-touch naming consultation rather than a cheap random name generator.

Before generation, a short localized questionnaire should collect only what is useful: desired Korean/Asian style, gender expression or neutral preference if relevant, modern/elegant/intellectual/strong/soft/artistic/etc. mood, desired meanings, sounds/meanings to avoid, preferred length/pronunciation, whether to echo the customer’s original name, and modern-vs-traditional preference.

Return a curated Top 3–5 with, where valid:
- Hangul;
- romanization/pronunciation guide;
- optional validated Hanja candidates;
- component and whole-name meaning;
- why it fits the questionnaire;
- Korean naturalness;
- modernness / generational feel;
- international pronunciation ease;
- nicknames/short forms;
- possible cultural or pronunciation pitfalls;
- optional traditional Saju/onomastics perspective clearly separated from modern naming quality.

Scores such as modernness, naturalness, pronunciation ease and questionnaire fit may be shown only when backed by an explicit rubric/data source. The system should actively avoid obviously dated names and should use current public naming-frequency/trend evidence where legally and technically usable. Include 1–2 refinement rounds in the premium proposition. A report-style deliverable is desirable.

## 4. K-Culture Lab scope
### Saju / Four Pillars
Exact/approximate/unknown birth time; deterministic chart first; calculation separated from interpretation; alternate interpretations where conventions differ; missing-time impact shown explicitly; no fabricated hour pillar.

The Step 3A feature branch `korea-concierge/step-3a-input-contracts` already contains typed contracts for Gregorian/lunar input, exact/approximate/unknown time, timezone/longitude requirements, day-boundary/solar-time policy and a whitelist narrative payload that drops raw DOB/time/location/name/account identifiers. Continue from the latest branch state only after re-inspection.

### Korean Zodiac
Deterministic sign + cultural history/context. Personality/compatibility associations are labeled as traditional/entertainment interpretations.

### Western Astrology
Sun sign deterministic first. Moon/ascendant/full natal chart only after exact astronomy/timezone handling exists. Never fake an ascendant from incomplete birth-time data.

### Tarot
Defined 1-card and 3-card spreads. Transparent selection/randomization independent of the LLM. Show card identity, traditional symbolism, primary reading, another plausible reading, uncertainty and reflection/action prompt.

### Daily Fortune
Fix a daily lens/theme from allowed profile inputs + current date/timezone/rules before prose generation. Show what drove the theme. Avoid deterministic promises or high-stakes advice.

## 5. International payments — global-first
The target payer is the foreign visitor, not a Korean domestic shopper. Payment architecture should therefore be global-first and USD-first.

Current direction:
- PayPal Checkout is the leading initial candidate for foreign customers and the premium naming/service product because it has no monthly integration fee and is compatible with cross-border service payments for a Korea-based seller, subject to final merchant/account verification;
- do not choose a Merchant-of-Record provider blindly if its acceptable-use rules conflict with human-in-the-loop consulting/naming services;
- ordinary Trip Pass/top-up amounts remain server-owned;
- premium Naming Studio should likely be a separate fixed-price service product rather than disguised as credits;
- browser success pages never grant value by themselves;
- authoritative server payment capture + verified webhook + idempotent ledger is required before granting credits/entitlements.

**No production payment system is implemented yet.** No payment SDK/API key/webhook/wallet is currently live. Provider onboarding/credentials should be requested from the user only after the testable server foundation is ready.

## 6. Approved real-time translation direction
The quality-first real-time spoken-translation candidate is direct Google Gemini API model `gemini-3.5-live-translate-preview`, implemented only after auth/wallet/payment.

Current policy:
- rough planning rate `$0.0368/min` combined speech-to-speech;
- Ultra fair-use hypothesis: 30 included minutes then 8 credits/min;
- long-lived key server-only;
- constrained ephemeral client token;
- raw microphone audio not persisted by default;
- explicit source/target language selection wins over optional detection.

Authoritative file: `docs/LIVE_TRANSLATION.md`.

## 7. Design workflow and Stitch
Codex has a Stitch MCP connection and is assigned the UI/UX/frontend-expression role to avoid overlap with core logic/security/payment/deployment work.

PR #11 is genuinely Stitch-designed:
- Stitch project `5491471407117217005`;
- design system asset `6183445483705617630`;
- merged design includes parchment/silk/charcoal surfaces, Dancheong crimson, celadon jade, mobile bottom navigation, richer Personal Color/Hanbok result cards and K-Culture presentation;
- UI spec: `docs/UI_STITCH_SPEC.md`.

Before PR #11 merge, core review corrected unsupported numerical/measurement claims while preserving the visual system. Future large UI redesigns should again use Stitch when available, preferably isolated in a dedicated UI branch/PR so core agents do not overwrite it.

## 8. Current architecture
- Next.js 16.3.3 + exact `next-intl@4.13.4`.
- P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- Static reviewed dictionaries for site localization; no runtime ML translation for static copy.
- `P0Locale` is the compile-time boundary.
- Localized public surfaces: Home, Personal Color, Hanbok, Gyeongbokgung, K-Culture, Credits.
- 36 canonical P0 URLs with reciprocal hreflang and `x-default` → English.
- `[locale]/layout.tsx` owns P0 root documents and language tags.
- deterministic six-route legacy redirects via HTTP 308.
- ordinary future AI gateway direction remains cost-bounded OpenRouter where appropriate; direct Gemini Live is the real-time translation exception.

## 9. Primary CI architecture — private MiniPC runner
The public `Kang-s-brain` repository must never be attached directly to the production MiniPC runner. The private control repository `lgkangno1-svg/korea-concierge-ci` owns the repository-scoped runner.

Current setup:
- runner `minipc-korea-concierge-ci-c49acd`;
- labels `self-hosted`, `linux`, `x64`, `minipc`;
- runner directory `/opt/github-runners/lgkangno1-svg__korea-concierge-ci`;
- dedicated service user, no runner sudo or Docker-group grant;
- private workflow fetches public source read-only;
- accepted source is `main` or exact 40-character SHA;
- exact public head goes into private `target-ref.txt` before merge;
- public GitHub-hosted workflow remains manual fallback only.

Corrected Stitch PR #11 exact head `1e2dcb8daaf6daac610e7b57785da81e64d61446` passed private MiniPC run `33085085859` with lockfile policy, frozen install, P0 i18n, Next production build, document-language and legacy-redirect checks all green.

## 10. Production deployment and Cloudflare incident
The old Japanese Node landing page was replaced by Korea Concierge Next.js on 2026-08-27. The secure exact-SHA deploy helper and systemd path watcher are installed without granting the CI runner general sudo/Docker rights.

Local origin facts from the last trustworthy diagnostic:
- `korea-concierge.service` enabled/active;
- origin port 3100;
- local `/` → 308;
- local `/en` → 200;
- `<html lang="en">` present;
- legacy Japanese marker absent.

Cloudflare is currently **intermittent**. The user observed browser Error `1033`, and private preflight has also observed repeated HTTP `530`, including a run where the sitemap request itself returned 530 repeatedly and an earlier run where `/vi/culture` alone returned 530. This points to a tunnel/edge connectivity incident rather than a deterministic Next.js route failure.

A sanitized tunnel diagnostic was added to the private deployer diagnostic workflow to inspect cloudflared service active state/restarts/process count and selected non-secret connection/error logs. Never print cloudflared tokens/command arguments into CI logs.

Do not call PR #11 production-live until:
1. final desired main SHA passes private exact-SHA CI;
2. exact SHA deploy succeeds locally;
3. Cloudflare/public `/` and `/en` checks pass;
4. public sitemap/P0 preflight is clean or any transient tunnel incident is explicitly separated from app correctness.

## 11. Open-source / research status
Promising deterministic Saju references found on GitHub include:
- `yhj1024/manseryeok`: MIT TypeScript, claims KASI-based lunar data, 24 solar-term boundaries, true-solar-time/historical-time options and Four Pillars utilities. Promising but still requires fixture/provenance verification before adoption.
- `6tail/lunar-javascript`: MIT, actively maintained reference implementation and useful cross-check candidate.

No library is adopted merely because it exists. Calendar boundaries, Korean conventions, licensing, fixtures and provenance must be verified.

Research passes should continue checking GitHub, Hugging Face and publicly searchable Threads/web practical discussions. Community tips are hypotheses; primary/official evidence wins.

## 12. Security / privacy / data / margin posture
Current Stitch UI changes add no remote AI call, payment behavior, microphone capture or new runtime dependency.

Future premium photo path requires explicit consent, EXIF stripping, image limits, purpose limitation, no sensitive-trait/identity inference, transient retention, deletion semantics, provider retention/ZDR review, server-only secrets, abuse/rate controls and fixed per-analysis supplier-cost ceilings.

Future generative K-Culture paths receive deterministic/randomized structured inputs rather than permission to invent the chart/cards/theme. Logs may contain model/version, cost, latency and structured quality/error flags, not sensitive raw prompt/photo/birth payloads.

Global payments require server-owned catalog prices, webhook signature verification, event idempotency, immutable wallet/service entitlement records and refund/reversal handling before production money is accepted.

## 13. Completed roadmap / major shipped foundations
- Step 0 ✅ product/architecture/cost/SEO/international/security baselines.
- Step 1 ✅ deterministic P0 Quick Help.
- Step 2A ✅ i18n foundation.
- Step 2B ✅ native P0 public surfaces.
- Step 2C-1A ✅ free/private Personal Color local preview.
- Step 2C-1B ✅ free deterministic Hanbok matcher.
- Step 2C-1C ✅ Credits preview/economics.
- Step 2C-2…7 ✅ executable verification, P0 SEO/document language, legacy retirement, cleanup and lockfile/supply-chain closure.
- Private MiniPC CI ✅ isolated self-hosted gate.
- Secure production deployer ✅ exact-SHA build/health/rollback path.
- Explainable personalization contract ✅.
- Stitch UI system ✅ merged via PR #11 after measurement/scoring corrections.
- Gemini Live/Ultra translation policy ✅ documented.
- Premium Naming Studio product direction ✅ defined at handoff level; detailed PRD/roadmap implementation remains.
- Global-first payment direction ✅ defined; actual checkout not yet implemented.

## 14. Exact next actions
1. Finish current Stitch production cutover and Cloudflare tunnel diagnosis; do not hide a tunnel failure as a successful public deployment.
2. Re-inspect latest main/open PRs/tree/handoff/roadmap after any concurrent change.
3. Continue Step 3A deterministic Saju input/calculation contracts and verify candidate libraries against trusted fixtures/boundaries.
4. Keep foreign-name handling separate from Four Pillars; design optional premium Naming Studio/onomastics as its own service.
5. Continue K-Culture foundations in roadmap order: Saju → zodiac/astrology → tarot mechanics → daily-fortune mechanics.
6. Build Step 4 auth/immutable wallet before accepting paid AI use.
7. Build global-first USD payment server foundation (PayPal candidate first, revalidate policy/account fit) before asking the user for merchant credentials.
8. After payment, proceed to Gemini Live and premium remote photo analysis with the privacy gates.

## 15. Deferred / do not accidentally start
- paid remote photo analysis before auth/payment/consent/provider privacy gates;
- AI Hanbok composite as the sole recommendation brain;
- bulk Hanbok visual generation without its own gate;
- recurring subscription or ML-personalized pricing without evidence;
- runtime translation model for static localization;
- RAG/embeddings/LLM for Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- fabricated birth hour or fake astrology placements from incomplete data;
- forcing foreign names into invented Hanja for Saju;
- LLM-selected Tarot cards masquerading as random draw;
- generic random daily fortune presented as personalized calculation;
- checkout before authoritative payment/wallet callback foundations;
- public Gemini microphone/session path before auth/entitlement/rate limiting;
- browser-language/IP/nationality inference;
- public repo attached directly to production MiniPC runner;
- runner general sudo/Docker access;
- production-deployment claims without successful public post-cutover evidence.

## 16. Operations / recent change history
- 2026-08-27: private `korea-concierge-ci` and isolated MiniPC runner established; public hosted CI moved to manual fallback.
- 2026-08-27: secure exact-SHA deployer bootstrapped and old Japanese landing origin replaced by Next.js production service.
- 2026-08-27: product direction corrected to premium photo-based explainable Personal Color + Hanbok, with deterministic local previews retained as free tier.
- 2026-08-27: K-Culture scope expanded to Saju/Four Pillars, Korean Zodiac, Western Astrology, Daily Fortune and Tarot.
- 2026-08-27: Premium Naming Studio direction added: modern Korean/Asian name consultation around $149–150 with questionnaire, meaning/Hanja/pronunciation/trend evidence and refinement rounds.
- 2026-08-27: payments clarified as foreign/global-first; Korean domestic checkout is not a launch priority. PayPal is the leading candidate pending final merchant/policy verification.
- 2026-08-27: Codex used Stitch MCP to produce UI branch/PR #11. Core review replaced unsupported confidence/match numbers with actual measurements and transparent deterministic scoring, and marked unimplemented K-Culture calculations as preview.
- 2026-08-27: PR #11 exact head passed MiniPC CI run `33085085859` and was squash-merged as `95a86da4554a9a027b39a5480c971aaa48939672`.
- 2026-08-27: Cloudflare Tunnel began intermittently returning 530/1033 while the local app remained healthy; sanitized tunnel diagnostics added before declaring the Stitch production cutover complete.

## 17. User action currently required
**None.** Continue autonomous diagnosis/deployment. Only request merchant/provider credentials or a narrowly scoped one-time MiniPC root action when that becomes the genuine remaining blocker.
