# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-27  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity  
**Last completed slice:** Step 2C-1B — native P0 Hanbok route + deterministic matcher  
**Exact next slice:** Step 2C-1C — native P0 Credits route using authoritative credit economics

> Cross-session/cross-AI state file. Before every material run inspect latest `main`, recent commits, current project tree, this file and `IMPLEMENTATION_ROADMAP.md`. Assume another AI/developer may have changed the repository. Never restore remembered older code over newer work without understanding it. Update this file in the same run whenever implementation status, tests, decisions, blockers, security/privacy posture, AI cost, credit economics or next step changes.

## 1. Product intent / goal

Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It connects practical Korea discovery, Gyeongbokgung planning, personal-color/Hanbok styling and K-Culture without becoming an expensive generic chatbot.

Target properties: genuinely localized; useful for free before payment; deterministic/browser-local whenever practical; privacy-first for photos and birth data; source-validated for changing travel facts; server-authoritative for credits/payments; aggressively optimized for token/provider cost and gross margin; public pages crawlable/answer-first with private/personal/payment content noindex where appropriate.

## 2. Non-negotiable requirements

- **Locales:** P0 `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`; P1 Indonesian/Malay. Explicit user choices outrank market defaults. Never infer nationality, ethnicity, religion or sensitive identity from name, face or locale. Taiwan/Hong Kong analytics stay separable. English is global fallback.
- **Saju:** exact / approximate / unknown birth time are valid. Never fabricate or AI-guess missing hour. Unknown time only returns deterministic non-hour components and must be reduced-scope/lower priced when monetized. Raw birth date/time/city/name/account identifiers never go to LLM.
- **Quick Help:** 0 credits, 0 AI, no external question transfer, P0 localized, button/topic tree. No RAG/embeddings/LLM without measured need.
- **Security:** strict authorization/validation; immutable/idempotent wallet; verified payment callbacks; rate limits; dependency pinning; data minimization; EXIF stripping before remote sensitive-media use; ZDR restrictions; safe logs; prompt instruction/data separation; source validation for AI-returned place facts; secrets server-only; no guessed CSP origins.
- **AI cost:** deterministic → static → cache → rules → browser-local → cheapest qualified Chinese OpenRouter model. Compact IDs/enums, <=5–8 candidates, short feature prompts, structured output, bounded history, one retry by default, same-model provider fallback before escalation. Record cost/tokens/provider/latency/retry/fallback without sensitive bodies; monitor p50/p95 and cost per captured credit.
- **Credits:** `CREDIT_ECONOMICS.md` is authoritative. Basic/Advanced/Ultra one-time passes + optional top-ups at launch; no subscriptions/ML personalized pricing without evidence. Fixed credits shown before paid action; immutable reserve/capture/release/refund ledger.

## 3. Source-of-truth documents

Read before material changes: `PRD.md`, `ARCHITECTURE.md`, `AI_ROUTING.md`, `CREDIT_ECONOMICS.md`, `SEO_AEO_GEO.md`, `OPEN_SOURCE_DISCOVERY.md`, `INTERNATIONALIZATION_MARKETS.md`, `SECURITY_TOKEN_EFFICIENCY.md`, `IMPLEMENTATION_ROADMAP.md`, `PROJECT_HANDOFF.md`.

## 4. Current architecture

Next.js 16.3.3 + exact `next-intl@4.13.4`. P0 locale URLs: `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`. Locale allowlisted before dictionary load. Reviewed static dictionaries only; no runtime translation ML.

Migration-only unprefixed legacy routes remain. Locale-aware navigation preserves locale. Redirect/browser-language negotiation/canonical/hreflang/x-default stay disabled until route parity + executable build evidence.

`check:i18n` now runs P0 dictionary parity, Quick Help contract, Personal Color contract and Hanbok contract. Hanbok copy is modularized under `messages/hanbok/{locale}.json`. Locale overflow CSS protects CJK/Vietnamese/Thai surfaces including Hanbok fieldsets/labels/results.

## 5. Completed status

- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input, accessibility hardening.
- Step 2A ✅ pinned i18n, validated P0 routing/request loader.
- Step 2B ✅ locale shell/navigation, full P0 Quick Help, native Home/Culture/Gyeongbokgung, metadata/freshness warning/text-expansion safeguards.
- Step 2C-1A ✅ native P0 Personal Color: entire scanner localized; browser-local deterministic analysis; locale-neutral analyzer codes/palette IDs; message contract; legacy `/color` provider regression fixed.

### Step 2C-1B ✅ Hanbok — source/data-shape review

Latest run completed:
- inspected latest main/recent commits/roadmap/handoff/Hanbok source first; pre-run main was `1a1047d4...` and no unexplained concurrent project change was observed;
- replaced `/[locale]/hanbok` English re-export bridge with a native localized Server Component and locale-specific metadata;
- added `HanbokMatcher`, a free client-side deterministic preview with three explicit inputs: color direction, mood, and trip/walking priority;
- matcher result is derived from stable option IDs and rules only; no AI/model/provider call, no photo upload, no external user-data transfer and no credit charge;
- all P0 locales have dedicated `messages/hanbok/{locale}.json` bundles; request loader merges them after locale allowlist validation;
- explicit user choice outranks market defaults; matcher does not infer nationality, ethnicity, religion or profile traits;
- free/paid boundary is explicit: future premium virtual try-on/AI styling must show fixed credit price and photo/privacy terms before confirmation;
- added Hanbok bundle to cross-locale parity validation and added `check-hanbok-message-keys.mjs` to `check:i18n`;
- hardened Hanbok responsive layout for CJK, Thai and Vietnamese expansion;
- did **not** start the deferred bulk Hanbok visual asset project;
- Step 7 remains the gate for a fuller Hanbok recommendation engine; this is only the zero-cost localized preview needed for Step 2 parity.

## 6. Latest discovery decision

### GitHub
`JamesAC42/hanbok` was inspected and is primarily a language-learning product, not Hanbok styling recommendation. `seungboAn/try-on-hanbok` is a relevant virtual-fitting UX reference but depends on image upload, AI fitting and Supabase/backend services.

### Hugging Face
Fresh search found generic fashion classifiers/embeddings, multiple virtual try-on Spaces, `daeunn/hanbok-dataset` (784-row image/caption dataset visible in viewer) and very small Hanbok LoRA datasets such as `AIARTCHAN/lora-Hanbok_LoRA_V2`.

**Decision:** adopt none for the current matcher. None provides enough Hanbok-specific recommendation validation and commercial provenance to justify remote-media privacy, large-model latency, runtime/supply-chain complexity or supplier cost. Revisit premium virtual try-on later only after explicit consent, commercial license/data provenance review, representative Hanbok coverage, ZDR/EXIF controls, latency targets and fixed-credit economics are proven.

Full record: `docs/OPEN_SOURCE_DISCOVERY.md`.

## 7. Verification / blocker

Evidence available: GitHub source writes for native Hanbok route, deterministic matcher, six P0 Hanbok bundles, request loader merge, parity/contract gates, responsive CSS, roadmap/discovery/handoff updates.

Executable verification was attempted again on 2026-08-27 using clean clone → install → `npm run check:i18n` → build. The shell failed at clone with `Could not resolve host: github.com`. Therefore executable i18n/build success and production deployment are **not claimed**. A future environment with working GitHub DNS must run the full path before Step 2 cutover.

## 8. Security / privacy / token / margin impact

- New AI calls: 0.
- Runtime translation/model calls: 0.
- New runtime dependencies: 0.
- New external image/user-data transfer: 0.
- Credits charged by Hanbok preview: 0.
- Credit/payment behavior otherwise: unchanged.
- Incremental inference/provider cost: 0.
- Gross-margin effect: favorable/neutral; localized interactive utility increased without supplier cost.
- No identity/nationality/ethnicity/religion profiling introduced.

## 9. Exact next slice — Step 2C-1C native P0 Credits

Next run:
1. inspect latest main/recent commits/tree/handoff first;
2. read `CREDIT_ECONOMICS.md` in full before changing credits UI;
3. inspect legacy `/credits`, localized bridge and every displayed pack/feature price;
4. re-run GitHub + Hugging Face discovery for wallet/credit UX patterns; do not adopt ML pricing;
5. convert `/[locale]/credits` to native P0 content with localized metadata and controls/content;
6. keep public pack/action credit values deterministic and sourced from one in-repo authority rather than duplicated ad-hoc numbers;
7. make fixed credit cost visible before any paid action; clearly distinguish currently implemented preview/architecture from future live checkout;
8. preserve server-authoritative ledger/reserve/capture/release/refund requirements for later auth/payment steps;
9. add message-contract/parity checks and mobile/accessibility hardening as needed;
10. keep locale redirect/canonical/hreflang cutover disabled until executable build evidence and route parity;
11. update discovery log, roadmap and this handoff.

Only after Step 2C-1C plus executable build evidence should Step 2C-2 consider canonical/hreflang/x-default, locale sitemap/negotiation and legacy-shell removal.

## 10. Later roadmap / deferred

Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color validation/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung place model; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 cost + market expansion.

Deferred: bulk Hanbok visual asset generation unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; automatic locale/canonical cutover before parity/build evidence; production claims without executable evidence.

## 11. Current user action required

**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their corresponding gates.
