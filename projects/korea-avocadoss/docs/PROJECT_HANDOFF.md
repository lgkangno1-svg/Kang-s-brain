# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 3 — explainable K-Culture deterministic core  
**Last completed implementation slice:** Step 2C-7 — supply-chain reproducibility / Step 2 closure  
**Step 2 merge on main:** `bf12dc22a986a1ad14eea24055575c2f129780d8` (PR #9)  
**Step 2 main CI:** run `33070371958` — SUCCESS  
**Latest product-policy merge on main:** `ef49f718f8c3fd04bd6ad7c2d0261b071e1844ce` (PR #8 — Gemini Live translation / Ultra Family policy)  
**Primary CI:** private `lgkangno1-svg/korea-concierge-ci` repository-scoped MiniPC runner  
**Production status:** **deployed** to `korea.avocadoss.co.kr` from exact public source SHA `774fe959e135f2db70d60ade37aa69ca173cf67c`; MiniPC `korea-concierge.service` serves Next.js 16.3.3 on port `3100` behind the existing Cloudflare Tunnel.  
**Production deployment verification:** private deploy workflow run `33076411784` attempt 2 — SUCCESS; diagnostic run `33077658031` — SUCCESS; local and public `/` return 308, `/en` returns 200 with `<html lang="en">`, and the legacy Japanese landing marker is absent.  
**Exact next implementation slice:** Step 3A — deterministic Saju calculation/input contracts, followed by explainable K-Culture foundations without skipping auth/payment/privacy gates.

> This file is the cross-session/cross-AI source of current implementation context. Every material run must inspect latest `main`, recent commits, open PRs, the current project tree, this file and `IMPLEMENTATION_ROADMAP.md` before editing. Update this file in the same run whenever status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics, production deployment or the next step changes.

## 1. Product intent
Korea Concierge is a mobile-first multilingual Korea companion for international visitors. Its differentiator is not merely producing answers, but making personalized recommendations **understandable and actionable**: what the system observed/calculated, why the result follows, what alternatives exist, what uncertainty remains and what the visitor should try next.

Authoritative cross-feature contract: `docs/EXPLAINABLE_PERSONALIZATION.md`.

The shared result pattern is: concise result → 3–6 concrete evidence/reason cards → strongest alternative/counterfactual → uncertainty/material conditions → practical next actions → method/privacy disclosure. Do **not** expose or fabricate hidden chain-of-thought. Show observable evidence, deterministic factors, source-backed facts and bounded confidence instead.

International visitors may not understand Korea-specific concepts. Major services such as Saju, Korean zodiac, Western astrology, daily fortune, tarot, personal color, Hanbok conventions and other cultural tools must provide a friendly localized “What is this?” explanation, what information is needed, what the user gets, limitations/privacy and a simple example before sensitive or paid input.

### Photo-based personalization — corrected product direction
The final Personal Color and Hanbok product intent is **user photo → AI/vision-assisted analysis → explainable personalized recommendation**, not a questionnaire-only or local color-average experience.

The current browser-local Personal Color scanner and deterministic Hanbok matcher remain useful as free/private previews and fallbacks. They are not the final premium product ceiling.

Premium photo analysis must, after the proper auth/payment/privacy gates, produce only styling-relevant visible observations such as current-lighting color tendency, depth/contrast/clarity and quality warnings. It must not infer race, ethnicity, nationality, religion, health, emotion, attractiveness or identity. Remote photo processing requires explicit consent, EXIF stripping, upload limits, transient-by-default handling, provider retention/ZDR review, server-only credentials, rate limits and a fixed maximum supplier cost per analysis.

Personal Color explanations should make the visitor understand why the palette was suggested: multiple visible color observations, competing interpretation, comparison swatches/pairs, lighting limitations and practical “try this” guidance. Avoid absolute “never wear this” claims and false numerical precision.

Hanbok should combine the color profile with optional consented photo styling observations plus explicit mood, destination, weather, comfort/coverage and party context. Return complete ranked looks with jeogori/chima-or-baji color relationship, silhouette/design family, accessories, backdrop fit, trade-offs, an alternative and mirror/try-on checks. Do not infer authoritative body measurements from a photo.

Food/restaurant discovery must support explicit dietary filters including Vegan, Vegetarian, Halal-certified, Muslim-friendly, pork-free, alcohol-free, gluten-free, seafood-free and relevant allergy needs. Never infer religion/diet from locale/name. Halal-certified, Muslim-friendly, pork-free and alcohol-free are distinct claims and must not be collapsed. Sensitive dietary claims require source/evidence plus verification date and uncertainty/cross-contamination disclosures where relevant.

## 2. Non-negotiable requirements
- **P0 locales:** `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. P1: Indonesian/Malay. Explicit user choice always wins. Never infer nationality, ethnicity, religion or sensitive identity from name, face, voice or locale. Taiwan/Hong Kong analytics remain separable. English is a global fallback.
- **Saju:** exact / rough / unknown birth time are valid. Never fabricate or AI-guess a missing hour. Unknown time returns deterministic non-hour components only and must be reduced-scope/lower-priced when monetized. Raw birth inputs should not be sent to narrative AI when a minimized derived chart is sufficient.
- **K-Culture:** calculated/randomized mechanics are fixed before generative wording. Saju/astrology calculations must be deterministic; Tarot card selection must be independent of the LLM; Daily Fortune underlying daily theme must be fixed before prose generation. Cultural/fortune outputs are entertainment/reflection, not high-stakes prediction.
- **Explainability:** personalized features expose result, evidence, alternative, uncertainty, action and method/privacy. No fabricated chain-of-thought and no false precision.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict auth/validation, immutable/idempotent wallet later, verified payment callbacks, rate limits, dependency pinning, data minimization, EXIF stripping before remote sensitive-media use, ZDR/retention review, safe logs, prompt instruction/data separation, source validation for AI-returned place facts, server-only long-lived secrets and no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → remote vision/LLM only when it materially improves value. Compact typed payloads, bounded candidates/history, hard token/provider-cost ceilings, one retry by default, same-model provider fallback before escalation, p50/p95 telemetry without sensitive prompt/photo bodies.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups; no subscriptions/ML personalized pricing without evidence. Fixed credits are shown before ordinary paid actions. Metered live translation uses a fixed visible unit rate. Wallet mutations later use immutable reserve/capture/release/refund semantics.

## 3. K-Culture Lab scope
Step 3 now establishes a coherent explainable K-Culture Lab while preserving dependency order.

### Saju / Four Pillars
Exact/rough/unknown birth time; deterministic chart first; calculation separated from traditional interpretation; alternate interpretation where conventions differ; missing-time impact shown explicitly; no fabricated hour pillar.

### Korean Zodiac
Deterministic animal/sign + cultural history/context. Traditional personality/compatibility associations are labeled as tradition/entertainment rather than facts about the person.

### Western Astrology
Sun sign deterministic first. Moon/ascendant/full natal chart only after exact astronomy/timezone handling exists. Never fake an ascendant from incomplete birth-time data.

### Tarot
Start with defined 1-card and 3-card spreads. Card selection uses a documented random mechanism independent of the LLM. Show card identity, traditional symbolism/keywords, primary reading, another plausible reading and reflection/action prompt. No deterministic high-stakes prophecy.

### Daily Fortune
Do not generate generic random prose and present it as personalized calculation. Fix an underlying daily lens/theme from selected profile inputs + current date/timezone/rules, then optionally use bounded AI for natural wording. Show the “Today’s lens” so the user can see what drove the result.

## 4. Approved real-time translation direction
The user prioritizes translation quality and selected **Google Gemini 3.5 Live Translate** as the default real-time spoken-translation provider candidate.

Authoritative policy file: `docs/LIVE_TRANSLATION.md`.

Current decision:
- direct Google Gemini API model `gemini-3.5-live-translate-preview`;
- narrow exception to ordinary OpenRouter-first text/vision routing;
- current pricing snapshot about `$0.0368/min` combined effective speech-to-speech cost;
- initial Ultra/Family fair-use hypothesis: 30 included minutes per Ultra Trip Pass, then 8 credits/min;
- Ultra remains a one-time Trip Pass at launch;
- long-lived key server-only; short-lived constrained token for direct client WebSocket after server entitlement/rate-limit checks;
- raw microphone audio not persisted by default and transcript/audio bodies excluded from general/cost logs;
- explicit source/target language selection overrides optional detection.

Implementation remains after Step 4 auth/wallet and Step 5 payment. Do not add a public microphone/API-key path before entitlement controls exist.

## 5. Design workflow requirement
For future user-facing screen creation or substantial UI redesign, Stitch MCP is the design-first tool when actually available. Stitch was rechecked on 2026-08-27 and no installable/connected Stitch MCP was available. No UI in the current planning slice is claimed as Stitch-designed. Re-check before each substantial UI slice.

## 6. Current architecture
- Next.js 16.3.3 + exact `next-intl@4.13.4`.
- Production P0 URL trees: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.
- Static reviewed dictionaries only for site localization; no runtime translation ML.
- `P0Locale` is the production compile-time boundary.
- Complete localized public surfaces: Home, Personal Color, Hanbok, Gyeongbokgung, K-Culture, Credits.
- Complete P0 public URLs have self-canonical, reciprocal hreflang and `x-default` → English. Sitemap contains 36 canonical P0 URLs.
- `[locale]/layout.tsx` owns P0 root documents and emits `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th`.
- `config/legacy-redirects.json` maps six former English URLs directly to English canonical equivalents via HTTP 308.
- No browser-language, IP, nationality or market inference participates in redirects.
- Ordinary AI gateway: OpenRouter. Approved future exception: direct Google Gemini Live API for real-time spoken translation.

## 7. Primary CI architecture — private MiniPC runner
The public `Kang-s-brain` repository must not be attached directly to the production MiniPC runner. The private control repository `lgkangno1-svg/korea-concierge-ci` owns the repository-scoped runner.

Current private CI setup:
- runner `minipc-korea-concierge-ci-c49acd`;
- labels `self-hosted`, `linux`, `x64`, `minipc`;
- runner directory `/opt/github-runners/lgkangno1-svg__korea-concierge-ci`;
- dedicated service user; no sudo or Docker-group grant;
- private workflow clones public source read-only over HTTPS;
- accepted source targets only `main` or exact 40-character SHA;
- `target-ref.txt` update triggers exact-SHA verification; scheduled `main` verification is additional drift detection;
- public GitHub-hosted workflow is manual fallback only.

Required procedure before code merge: write the exact public head SHA into private `target-ref.txt`, require the MiniPC run to pass, then merge. Never weaken the private-repository boundary.

## 8. Production deployment — live
The legacy Japanese landing origin was replaced on 2026-08-27.

Current production facts:
- `korea.avocadoss.co.kr` remains behind the existing Cloudflare Tunnel;
- origin port 3100;
- `korea-concierge.service` enabled/active as dedicated unprivileged `korea-concierge` user;
- active release currently points to exact source SHA `774fe959e135f2db70d60ade37aa69ca173cf67c`;
- root deployer/systemd path installed once without granting CI sudo/Docker;
- diagnostic run `33077658031` confirmed local/public `/` 308, `/en` 200, English document language and no legacy marker;
- deploy workflow run `33076411784` attempt 2 SUCCESS proved future exact-SHA automated deployment works end to end.

Deployment remains fail-closed on unknown port owners, exact-SHA-only, unprivileged build, health-check/rollback protected and Cloudflare-post-verified.

## 9. Completed roadmap
- Step 0 ✅ product/architecture/cost/SEO/international/security baselines.
- Step 1 ✅ deterministic P0 Quick Help.
- Step 2A ✅ i18n foundation.
- Step 2B ✅ native P0 public surfaces.
- Step 2C-1A ✅ free/private Personal Color local preview.
- Step 2C-1B ✅ free deterministic Hanbok matcher.
- Step 2C-1C ✅ Credits surface/economics display.
- Step 2C-2…7 ✅ executable verification, SEO/document language, legacy retirement, cleanup, lockfile/supply-chain closure.
- Private MiniPC CI ✅ isolated self-hosted gate.
- Production deployment ✅ exact SHA live behind Cloudflare with automated deployment path proven.
- Gemini Live / Ultra Family policy ✅ documented.
- Explainable personalization product contract ✅ defined on feature branch; merge requires MiniPC exact-SHA verification.

## 10. Discovery status for current direction
Fresh GitHub search on 2026-08-27 found relevant references for photo color/palette systems, MediaPipe-style facial landmark extraction, Bazi/Saju engines, Tarot applications and astrology engines. No project was adopted automatically; implementation must review commercial license, maintenance, provenance, privacy, browser fit and correctness in its specific gate.

The installed Hugging Face model-search action was re-attempted for photo/personal-color analysis and returned `tool not found`. No HF model is adopted or claimed reviewed beyond that failed attempt. Retry at the Step 3/6 implementation gates.

## 11. Security / privacy / token / margin posture
Current planning changes add no application AI call, customer-data transfer, payment behavior, microphone capture or runtime dependency.

Future premium photo path requires explicit remote-processing consent, EXIF stripping, image limits, purpose limitation, no sensitive-trait/identity inference, transient-by-default handling, deletion semantics, provider retention/ZDR review, server-only credentials, abuse/rate controls and fixed per-analysis supplier-cost ceilings.

Future generative K-Culture paths must receive deterministic/randomized structured inputs rather than being allowed to invent the underlying chart/cards/theme. Logs/telemetry should capture model/version, cost, latency and structured quality/error flags without sensitive prompt/photo bodies.

## 12. Exact next action
1. Re-inspect latest main/recent commits/open PRs/project tree/roadmap/handoff before editing.
2. Continue Step 3A deterministic Saju input and calculation contracts; do not jump directly to narrative AI.
3. Add K-Culture deterministic foundations in roadmap order: Saju → zodiac/astrology → tarot mechanics → daily-fortune theme mechanics.
4. For each implementation slice, re-run GitHub + Hugging Face discovery; record failed tooling honestly.
5. Before code merge, verify exact public head through private MiniPC CI via `target-ref.txt`.
6. After verified merge, deploy desired exact main SHA through private deployment workflow and require local/public health checks.
7. Re-check Stitch immediately before substantial UI redesign.

## 13. Future order
- Step 3A–E: explainable deterministic K-Culture foundations.
- Step 4: auth, immutable wallet, entitlements/family sharing/rate limits.
- Step 5: international payment foundation.
- Step 5B: Gemini Live Translate Ultra/Family benefit.
- Step 6: premium photo-based explainable Personal Color.
- Step 7: photo-aware explainable Hanbok recommendations.
- Step 8: verified discovery/food evidence and dietary filters.
- Step 9: explainable itinerary/premium concierge.
- Step 10: analytics/market adaptation.

## 14. Deferred / do not accidentally start
- paid remote photo analysis before auth/payment/consent/provider privacy gates;
- AI Hanbok composite as the recommendation brain;
- bulk Hanbok visual asset generation without its own gate;
- recurring subscription or ML-personalized pricing without evidence;
- runtime translation model for static site localization;
- RAG/embeddings/LLM for Quick Help;
- Saju narrative AI before deterministic calculation/privacy boundary;
- fake astrology placements from incomplete birth data;
- LLM-selected Tarot cards masquerading as random draw;
- generic random daily-fortune prose presented as personalized calculation;
- checkout before authoritative wallet/payment callback foundations;
- public Gemini microphone/session path before auth/entitlement/rate limiting;
- browser-language/IP/nationality inference;
- attaching the public repository directly to the MiniPC runner;
- granting the private CI runner general sudo or Docker access;
- guessed CSP origins;
- production-deployment claims without successful public post-cutover evidence.

## 15. Operations / recent change history
- 2026-08-27: private `korea-concierge-ci` repository and isolated MiniPC runner established.
- 2026-08-27: MiniPC CI full production-build gate passed after dynamic redirect-test port fix.
- 2026-08-27: public hosted CI converted to manual fallback.
- 2026-08-27: secure exact-SHA deployer bootstrap installed without runner sudo/Docker rights.
- 2026-08-27: source SHA `774fe959e135f2db70d60ade37aa69ca173cf67c` cut over to production; service active on port 3100.
- 2026-08-27: diagnostic and deploy attempt 2 proved local/public health and future automated deployment.
- 2026-08-27: user clarified core premium intent: uploaded photos should drive AI-assisted Personal Color and Hanbok recommendations, with multiple understandable reasons rather than unexplained labels.
- 2026-08-27: K-Culture scope expanded to Saju/Four Pillars, Korean Zodiac, Western Astrology, Daily Fortune and Tarot under the shared explainability contract.
- 2026-08-27: Stitch unavailable; Hugging Face model-search action still failed at execution; GitHub discovery succeeded.

## 16. User action currently required
**None.** Future merchant/payment/AI-provider credentials and legal/provider-specific setup remain deferred to their roadmap gates.
