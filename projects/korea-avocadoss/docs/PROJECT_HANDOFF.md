# Korea Concierge — Living Project Handoff

**Last updated:** 2026-08-26  
**Repository:** `lgkangno1-svg/Kang-s-brain`  
**Project root:** `projects/korea-avocadoss`  
**Current implementation phase:** Step 2 — Internationalized routing and language selector  
**Last completed slice:** Step 2B-4  
**Current next slice:** Step 2C-1 — native localization of remaining bridge pages (`/color`, `/hanbok`, `/credits`)  
**Status authority:** `docs/IMPLEMENTATION_ROADMAP.md` for ordered gates; this file for cross-session/cross-AI implementation context.

> This is a living handoff file. Every material run must inspect the latest `main`, recent commits and current project files before editing, assume another AI/developer may have changed the code, and update this file in the same run. Never restore an older remembered implementation over newer work without first understanding the newer change.

## 1. Product intent

Korea Concierge is a mobile-first multilingual Korea companion for international visitors. It should reduce common Korea travel/culture friction and monetize only the parts where personalization or computation creates clear incremental value.

The intended product combines:

- free deterministic Quick Help for common questions and routing;
- localized Korea travel and cultural guidance;
- Gyeongbokgung-area discovery and time-aware planning;
- personal-color and Hanbok recommendation experiences;
- a K-Culture Lab including deterministic Saju/zodiac experiences;
- an authoritative credit wallet and international-friendly payments;
- bounded AI only after deterministic/static/cache/rule/browser-local options are exhausted.

The product must **not** become an expensive generic chatbot. Gross margin, privacy, security, speed and factual reliability are first-class product requirements.

## 2. Product goal / success conditions

Success means all of the following hold together:

1. International visitors can understand and navigate core experiences in their language.
2. Common questions resolve without AI whenever practical.
3. Paid actions show a fixed credit price before execution and maintain bounded supplier cost.
4. Sensitive inputs are minimized and are not unnecessarily sent to LLMs.
5. Time-sensitive place/business facts are verified rather than treated as true merely because AI/editorial copy says so.
6. Public pages are answer-first, crawlable and locale-aware; private/account/payment/personal-result pages are noindex where appropriate.
7. Mobile layouts remain usable under CJK, Vietnamese and Thai text expansion.
8. Production is not claimed or cut over until executable build/deployment evidence and rollback readiness exist.

## 3. Non-negotiable requirements

### International visitors / locales

P0: English (`en`), Simplified Chinese (`zh-CN`), Japanese (`ja`), Traditional Chinese (`zh-TW`), Vietnamese (`vi`), Thai (`th`).  
P1: Indonesian, Malay.  
Further expansion is based on measured demand and current Korea tourism evidence.

Explicit user choices always outrank market defaults. Do not infer nationality, ethnicity, religion or individual preferences from names, faces or locale. Taiwan and Hong Kong analytics remain separable even if both use Traditional Chinese. English is the global fallback, not a US-only product.

Localization means adapting practical travel friction, content structure, dietary filters, payment expectations and acquisition/search needs where evidence supports it. Do not turn aggregate market observations into assumptions about an individual.

### Saju

Birth time is optional: exact time, rough time band and `I don't know` are all valid paths. Never fabricate a missing birth hour and never ask AI to infer it from personality.

Unknown birth time must produce only deterministic components that do not require the hour pillar, clearly labelled reduced-scope / birth time not provided, with lower pricing than full scope when monetized. Approximate time must disclose boundary uncertainty. Request city/timezone only when deterministic conversion requires it and explain why.

Calendar/pillars are computed deterministically before narrative AI. Raw birth date/time/city/name/account identifiers must never be sent to an LLM; only minimum non-identifying derived structures may be sent.

### Free Quick Help

Must remain 0 credits, 0 AI API calls, no external question transfer, button/topic-tree based, P0-localized and a router into the correct free or paid feature. Do not add RAG/embeddings/LLM unless corpus size and measured UX later justify it.

### Security

Strict server authorization, input validation, immutable/idempotent wallet operations, signed/verified payment callbacks, auth/payment/AI rate limits, dependency pinning/review, data minimization, EXIF stripping for remote images, ZDR/data-collection restrictions for sensitive media, safe logging without sensitive prompt bodies, prompt-injection-resistant instruction/data separation and source validation for AI-returned place/business facts.

Do not guess CSP origins before real hosting/payment/analytics integrations exist. Secrets are server-only and never exposed through `NEXT_PUBLIC_*`.

### Token / supplier-cost efficiency

Before every AI call: deterministic calculation → curated/static answer → safe cache → rule ranking/filtering → browser-local computation → cheapest qualified Chinese OpenRouter model.

Send compact IDs/enums/derived facts, normally pre-filter candidates to <=5–8, use short feature-specific system prompts and structured outputs, bound history, avoid resending whole itineraries for partial replans, and allow one bounded retry by default. Same-model provider fallback precedes model escalation.

Record `usage.cost`, tokens, provider, latency, retry and fallback without sensitive prompt bodies. Monitor p50/p95 tokens and cost, retry/escalation rates and supplier cost per captured credit.

### Credit economics

`docs/CREDIT_ECONOMICS.md` is authoritative and supersedes older PRD credit-pack hypotheses. Launch assumption: one-time Basic / Advanced / Ultra Trip Passes plus optional top-ups; no subscription or ML-personalized pricing at launch.

Every paid action shows fixed credits before execution. Wallet mutations use an immutable server-authoritative ledger with atomic reserve/capture/release/refund and idempotency. Supplier-cost analysis includes payment fees, retries/fallbacks and conservative FX/payment reserves.

### SEO / AEO / GEO

Crawlability, canonicalization, sitemap/robots, locale-prefixed URLs, hreflang/x-default, metadata, internal links, Core Web Vitals, semantic HTML, media optimization, rendering/indexability, valid structured data, local-intent content and AI-crawler access are product requirements. Do not prematurely activate canonical/hreflang/locale redirect behavior before route parity and build evidence.

### Open-source discovery gate

Before materially implementing/revising a feature, search GitHub and Hugging Face. Evaluate license/commercial use, maintenance, provenance, privacy, runtime cost, latency, bundle/compute requirements, mobile fit, multilingual quality, benchmark evidence, supply-chain risk and user/margin benefit. Record adopt/adapt/reject in `docs/OPEN_SOURCE_DISCOVERY.md`.

## 4. Source-of-truth documents

Read before material changes:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/AI_ROUTING.md`
- `docs/CREDIT_ECONOMICS.md`
- `docs/SEO_AEO_GEO.md`
- `docs/OPEN_SOURCE_DISCOVERY.md`
- `docs/INTERNATIONALIZATION_MARKETS.md`
- `docs/SECURITY_TOKEN_EFFICIENCY.md`
- `docs/IMPLEMENTATION_ROADMAP.md`
- `docs/PROJECT_HANDOFF.md`

## 5. Current architecture snapshot

Next.js app under `projects/korea-avocadoss`, with exact `next-intl@4.13.4` pin. P0 locale URLs are `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`. Locale values are allowlisted before dictionary loading. Reviewed static dictionaries are the production localization source; runtime translation ML is intentionally absent.

Unprefixed routes remain temporarily available behind a migration-only legacy shell. Locale-aware navigation preserves locale. Some locale routes are still temporary bridges and must be converted before cutover.

Quick Help is a deterministic message-key state machine. P0 dictionary parity and Quick Help message references are deterministic build gates.

Native locale surfaces currently include Home, Culture and Gyeongbokgung. These pages use localized `title`/`description` metadata, but canonical/hreflang/x-default is intentionally not enabled yet.

`src/app/locale-overflow.css` supplies locale-scoped text-expansion safety for long CJK/Vietnamese/Thai content.

## 6. Completed implementation status

### Step 0 ✅
Product/architecture/AI routing/credit economics/SEO/internationalization/security baselines established.

### Step 1 ✅
Free Quick Help + P0 locale registry. Quick Help remains 0-credit / 0-AI / no sensitive input. Keyboard/focus/ARIA hardening completed.

### Step 2A ✅
`next-intl@4.13.4` pinned; validated P0 routing/request loader; static localization architecture; no runtime translation model.

### Step 2B-1 ✅ by static review
Locale-aware navigation, language selector, `[locale]` shell, legacy migration shell, locale-preserving Quick Help CTAs, temporary route bridges. Redirect cutover remains disabled.

### Step 2B-2 ✅ by source/data-shape review
Quick Help fully localized in P0; hard-coded English removed from graph; dictionary parity + graph/message checker wired before build.

### Step 2B-3 ✅ by source review
P0 localized landing copy; native `/[locale]/culture`; Saju copy explicitly accepts unknown birth time; public dictionaries included in parity checks.

### Step 2B-4 ✅ by source/data-shape review
Completed in this run:

- Inspected latest main/recent commits/handoff/target files before editing. Pre-run latest main was `9021cd1fd973e6d3bbf6c93ba5635304d61f62c8`; no intervening external product commit was observed before implementation.
- Replaced `/[locale]/explore/gyeongbokgung` English legacy re-export with native localized Server Component.
- Added matching `Gyeongbokgung` and `Meta` message schemas to all six P0 `messages/public/*.json` files.
- Added localized title/description metadata to native Home, Culture and Gyeongbokgung pages using `getTranslations` in `generateMetadata`.
- Did **not** add canonical/hreflang/x-default or redirects yet.
- Added explicit freshness warning: opening hours, closures, ticket rules and shop availability are time-sensitive and must be verified before departure.
- Added `src/app/locale-overflow.css` and loaded it only in locale layout. It adds zero-min-width grid children, safe overflow wrapping, CJK/Thai line breaking and narrow-screen heading/button safeguards.
- TypeScript message augmentation remains deferred because no executable build environment is currently available and it is not needed to complete this slice safely.
- Updated `docs/OPEN_SOURCE_DISCOVERY.md` and `docs/IMPLEMENTATION_ROADMAP.md`.

## 7. Step 2B-4 discovery decisions

GitHub: re-searched `amannn/next-intl`; current Next.js 16.3-oriented material continues to support the project's Server Component/request-message architecture and `getTranslations` in async `generateMetadata`. **Decision: keep/adapt existing next-intl stack; add no second i18n/SEO dependency.**

Hugging Face: re-reviewed COMET translation QA models. `Unbabel/wmt20-comet-qe-da` and `Unbabel/wmt22-comet-da` are Apache-2.0 and technically usable offline; `Unbabel/wmt22-cometkiwi-da` is CC-BY-NC-SA-4.0. **Decision: no runtime/build integration now** because current static corpus is small and COMET would add Python/model-download/CI/supply-chain cost without runtime benefit.

## 8. Verification / evidence

Available evidence:

- successful GitHub source writes for native Gyeongbokgung route, metadata, six P0 dictionaries and locale overflow CSS;
- same intended `Gyeongbokgung` + `Meta` schema added across all six P0 dictionaries, preserving the existing parity-check contract by source review;
- recent-commit inspection after implementation showed only this run's sequential commits through the roadmap update, with no observed concurrent external overwrite.

Executable verification limitation:

- attempted clean `git clone` → `npm install` → `npm run check:i18n` → `npm run build` again;
- shell failed at clone because `github.com` could not resolve (`Could not resolve host: github.com`);
- therefore `npm run check:i18n` and `next build` were not executed in this environment;
- **production build success and deployment are not claimed.**

A future run with a working checkout/network must execute install/check/build before any build-dependent gate or locale cutover is upgraded.

## 9. Security / privacy / cost / margin impact of latest slice

- New AI API calls: **0**.
- Runtime translation/model calls: **0**.
- New runtime dependencies: **0**.
- New external user-data flows: **0**.
- Credit behavior/payment behavior: unchanged.
- Supplier/token cost impact: effectively **0 incremental inference cost**.
- Margin implication: favorable/neutral; localized deterministic content resolves more user needs without paid inference.
- Security: no secret, auth, payment or AI boundary changed. Locale files remain selected only through the existing allowlisted request path.
- Factual reliability: time-sensitive palace/shop facts are explicitly separated from evergreen copy rather than hard-coded as current truth.
- Accessibility/mobile: locale text-expansion resilience improved; executable visual regression remains pending a working build environment.

## 10. Current work position / exact next slice

**Next: Step 2C-1.** Do not jump to Saju core, wallet/payment or later features before Step 2 parity unless a security/regression issue forces an exception.

Implement in this order:

1. Re-inspect latest main/recent commits/handoff/project tree.
2. Re-run GitHub + Hugging Face discovery for the selected route work.
3. Convert remaining high-value locale bridge pages to native localized content, starting with `/color`, `/hanbok`, `/credits`.
4. Preserve explicit free-vs-paid boundaries and fixed-credit-before-action messaging.
5. Add localized metadata as each route becomes native.
6. Apply/QA locale overflow safety on each new surface.
7. Keep browser-language negotiation, redirects, canonical/hreflang/x-default and locale cutover disabled until route parity and executable build evidence exist.
8. Update discovery log, roadmap and this handoff in the same run.

### Step 2 gate before cutover

- no paid flow has an English-only dead end;
- locale URLs have valid SEO alternates when enabled;
- existing navigation does not regress;
- executable i18n/build evidence exists;
- only then remove temporary legacy shell / activate locale negotiation and SEO alternates.

## 11. Later roadmap

- Step 3: deterministic Saju core with exact/approximate/unknown time and privacy-preserving derived AI payloads.
- Step 4: auth + immutable authoritative wallet.
- Step 5: international payment foundation with verified callbacks.
- Step 6: personal-color v1, browser/local first.
- Step 7: deterministic Hanbok recommendation; **bulk Hanbok visual asset generation remains deferred until separately requested.**
- Step 8: verified Gyeongbokgung place model and route ranking.
- Step 9: itinerary/premium concierge with compact prompts and hard cost ceilings.
- Step 10: analytics, market adaptation, p50/p95 AI-cost monitoring and P1/P2 locale expansion.

## 12. Deferred / do not start yet

- bulk Hanbok visual asset generation/collection;
- subscriptions without conversion evidence;
- ML-personalized pricing;
- runtime translation models;
- RAG/embeddings/LLM for current Quick Help;
- guessed CSP origins;
- automatic locale redirect/browser-language routing before parity/build evidence;
- production-deployment claims without evidence.

## 13. Mandatory workflow for every future run

1. Inspect latest main, project tree, target files and recent commits before editing.
2. Read this handoff + roadmap and identify changes from other agents.
3. Preserve completed gates unless a real regression requires reopening them.
4. Search GitHub + Hugging Face before material feature revision; log decision.
5. Implement one reviewable roadmap slice only.
6. Review navigation/mobile/accessibility/i18n/privacy/security/credits/payment/performance/SEO/AI cost/analytics/dependency risk.
7. Run real tests/build where possible; never present static review as executable proof.
8. Update relevant docs and **this handoff in the same run**.
9. Commit clearly and do not overwrite concurrent improvements.

## 14. User action required

**None currently.** Merchant credentials, production DNS/hosting, OpenRouter production key, analytics/search verification and legal review remain deferred until their corresponding gates.

## 15. Change log

### 2026-08-26 — Step 2B-4 completed

Key implementation commits in this slice include:

- `08792ee0d100e6f872f9ef75869a7dd684d09827` — native localized Gyeongbokgung route
- `30cb138dd78bd5f6eb007bef277ff3500bcdb8fe` — localized Home metadata
- `d77c96985c11ce45e2b1f6b025d00f8a44d281de` — localized Culture metadata
- `ad846182d6c4c63fa2a1382022ff78731f7229ca` through `ef7be876f9400eb6b919f7c290dc17c2d17dd744` — P0 Gyeongbokgung/metadata dictionaries
- `b32786cf17da9aeb656017298ac182c0535123ca` + `354671314d2f0dd956df24741c8392ca2aba64fb` — locale overflow safeguards
- `cfe4eafcdb4abfd00d447cf3adce8749f6ada023` — discovery log
- `6b41044aa8537b2db718b46bdbc38c0256badc22` — roadmap updated to Step 2C-1

Known blocker remains executable build verification due shell DNS failure. User action required: None. Next exact slice: Step 2C-1.
