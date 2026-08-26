# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-26  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current phase:** Step 2 — internationalized routing / locale parity  
**Last completed slice:** Step 2C-1A — native P0 Personal Color  
**Exact next slice:** Step 2C-1B — native P0 Hanbok route and controls

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

`check:i18n` runs P0 dictionary parity, Quick Help graph/message contract and Personal Color message contract. Locale overflow CSS protects CJK/Vietnamese/Thai surfaces.

## 5. Completed status

- Step 0 ✅ baselines.
- Step 1 ✅ deterministic P0 Quick Help, 0-AI/0-credit/no sensitive input, accessibility hardening.
- Step 2A ✅ pinned i18n, validated P0 routing/request loader.
- Step 2B ✅ locale shell/navigation, full P0 Quick Help, native Home/Culture/Gyeongbokgung, metadata/freshness warning/text-expansion safeguards.

### Step 2C-1A ✅ Personal Color — source/data-shape review

Latest run completed:
- inspected latest main/recent commits/handoff first; no pre-run concurrent external product change observed;
- `/[locale]/color` converted from English re-export to native localized Server Component with localized title/description metadata;
- entire interactive `ColorScanner` localized across six P0 locales: upload guidance, controls, result labels, corrections, warnings/errors, privacy copy and nine Hanbok palettes;
- analyzer warnings/errors changed from English strings to stable typed codes;
- palette data changed to stable IDs + hex values, with human copy in dictionaries;
- added `check-color-message-keys.mjs` and wired it into `check:i18n`;
- browser-local pixel analysis preserved: local object URL + `createImageBitmap` + Canvas sampling; no AI/model/API/image upload;
- explicit “lighting-dependent styling estimate, not professional diagnosis” and no identity/race/ethnicity/nationality/religion/health/attractiveness inference;
- regression review found that the legacy unprefixed `/color` route would otherwise render `ColorScanner` without a `next-intl` provider. Fixed by wrapping only that legacy scanner in an English `NextIntlClientProvider`, preserving the migration promise that old links keep working until cutover.

## 6. Latest discovery decision

GitHub personal-color repositories reviewed include older React Native/Teachable Machine and Python Lab/HSV research implementations. They provide algorithmic references but do not justify replacing the current local preview due to maintenance, validation, dependency and privacy concerns.

Hugging Face search found general skin/image classifiers, including skin-type models, but not a clearly validated personal-color styling model with representative cross-market evidence. Remote inference would add image-transfer/privacy obligations and provider cost; bundled models add mobile download/latency and fairness/provenance risk.

**Decision:** keep deterministic browser-local preview now. Revisit premium remote vision only at Step 6 if it creates measurable incremental value, with explicit consent, ZDR/data-collection controls, EXIF minimization, representative validation, bounded supplier cost and free/manual fallback.

## 7. Verification / blocker

Evidence: GitHub source writes for native Color page, scanner localization, locale-neutral analyzer codes, palette IDs, all six P0 dictionaries, message-contract gate and legacy-route provider fix.

Execution limitation: current shell still cannot resolve `github.com` (`Could not resolve host: github.com`), so clean clone → `npm install` → `npm run check:i18n` → `npm run build` cannot be proven here. Production build/deployment is **not claimed**. A future environment with working checkout/network must run these before Step 2 cutover.

## 8. Security / privacy / cost / margin impact

- New AI calls: 0.
- Runtime translation/model calls: 0.
- New runtime dependencies: 0.
- New external selfie/user-data transfer: 0.
- Credit/payment behavior: unchanged.
- Incremental inference/provider cost: 0.
- Margin: favorable/neutral; localized free local compute improves utility without supplier cost.
- Manual correction remains because lighting/simple heuristics can be wrong.

## 9. Exact next slice — Step 2C-1B native P0 Hanbok

Next run:
1. inspect latest main/recent commits/tree/handoff;
2. inspect `/[locale]/hanbok`, legacy Hanbok components/data and every user-facing string;
3. rerun GitHub + Hugging Face discovery for Hanbok/recommendation logic;
4. convert locale route and every interactive control/result to P0 native copy;
5. keep deterministic ranking before AI and **do not start bulk Hanbok visual assets**;
6. add localized metadata/message-contract checks where useful;
7. review CJK/Thai/Vietnamese overflow, keyboard use and form labels;
8. keep paid/free boundaries explicit and keep locale/canonical cutover disabled;
9. update discovery log, roadmap and this handoff.

Then Step 2C-1C localizes Credits using `CREDIT_ECONOMICS.md`. Only after all required routes plus executable build evidence should Step 2C-2 enable canonical/hreflang/x-default, locale sitemap, safe locale negotiation and remove legacy shell.

## 10. Later roadmap / deferred

Step 3 deterministic Saju; Step 4 auth + immutable wallet; Step 5 international payments; Step 6 Personal Color validation/premium boundary; Step 7 deterministic Hanbok v1; Step 8 verified Gyeongbokgung place model; Step 9 compact-cost itinerary; Step 10 analytics/p50-p95 cost + market expansion.

Deferred: bulk Hanbok visual asset generation unless separately requested; subscriptions without evidence; ML personalized pricing; runtime translation models; current-size Quick Help RAG/LLM; guessed CSP origins; automatic locale/canonical cutover before parity/build evidence; production claims without executable evidence.

## 11. Current user action required

**None.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred to their corresponding gates.
