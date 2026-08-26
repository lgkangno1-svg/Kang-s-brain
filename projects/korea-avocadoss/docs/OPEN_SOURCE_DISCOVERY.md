# Korea Concierge — Open Source / Model Discovery Log

This is the required discovery record before material feature implementation/revision. Search first, then adopt only when commercial license, maintenance, privacy, quality, runtime cost, latency, browser/mobile fit, multilingual suitability, provenance, security and margin justify it.

## 2026-08-27 — Step 2C-4 locale-correct document language

### GitHub / framework review
Current Next.js 16 Route Groups / multiple-root-layout guidance and the current `amannn/next-intl` locale-layout examples were rechecked before changing the document shell.

Key findings:
- Next.js route groups do not become URL path segments, so they can separate the migration-only legacy tree from locale-prefixed pages without changing public URLs.
- Next.js supports multiple root layouts when the shared top-level `app/layout.tsx` is removed and each route group/root segment provides its own `<html>` and `<body>`.
- The current next-intl locale example lets the locale layout own `<html lang={locale}>`; this is preferable to reading pathname/headers in a shared root because it keeps the P0 locale tree statically generated and deterministic.
- `next/root-params` was also reviewed, but an ancestor `app/layout.tsx` does not provide the locale param needed for this migration shape. Forcing request/header inspection into the shared root would create unnecessary dynamic coupling.

**Decision:** use true multiple root layouts with no new dependency. `[locale]/layout.tsx` owns P0 document language and the URL-neutral `(legacy)` route group owns the temporary English document shell. Do not add browser-language inference or automatic market routing in this slice.

A build-artifact validator was added instead of another testing framework. It inspects generated `.next/server/app/**/*.html` after the production build and fails unless P0 documents use `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th` as configured in the existing locale registry.

### Hugging Face review
The installed Hugging Face connector was attempted for multilingual language-identification discovery but returned an unavailable-tool error in this run. A fresh public fallback search found language-ID models including `HPLT/OpenLID-v3` (GPL-3.0) and `facebook/fasttext-language-identification` (CC-BY-NC-4.0).

**Decision:** reject model involvement. Document `lang` is not an inference problem: it is known deterministically from the validated route locale. A language-ID model would add model/download/runtime and provenance/license complexity, could misclassify short UI copy, and provides no correctness benefit over route-to-BCP47 mapping plus generated-HTML verification. The Meta model is also non-commercially licensed, making it unsuitable for production use here.

### Executable evidence / regression caught
PR #4 CI runs intentionally acted as the gate:
- first architecture run exposed a route-depth regression after moving the legacy Personal Color page into `(legacy)`: a relative English message import became one directory too shallow;
- the import was corrected and all other moved legacy pages were inspected for the same class of relative-path issue;
- run `33005536571` then passed all P0 localization contracts, Next.js 16.3.3 optimized compilation, TypeScript, 46/46 page generation and `check:document-lang` for all six P0 locales.

### Security / privacy / cost implications
- production AI/model calls added: **0**;
- CI AI/model calls added: **0**;
- runtime dependencies added: **0**;
- customer data transfer added: **0**;
- browser-language/nationality inference added: **0**;
- payment/wallet/credit logic changed: **0**;
- incremental supplier inference cost: **0**.

### Sources reviewed
- https://nextjs.org/docs/app/api-reference/file-conventions/route-groups
- https://nextjs.org/docs/app/api-reference/file-conventions/layout
- https://github.com/amannn/next-intl/tree/main/examples/example-app-router/src/app/%5Blocale%5D
- https://github.com/amannn/next-intl/discussions/1627
- https://huggingface.co/HPLT/OpenLID-v3
- https://huggingface.co/facebook/fasttext-language-identification

## 2026-08-26 — Credits, wallet and pricing architecture

### GitHub
`amirhf/creditLedger` — MIT. Useful patterns: immutable history, idempotency, auditable balance projection and transactional thinking.  
**Decision:** adopt accounting patterns, not its heavier stack. Launch architecture remains Postgres transactions + immutable ledger + idempotency + derived balance.

### Hugging Face
`PranavSharma/dynamic-pricing-model` and `iioos/dynamic-pricing-model`.  
**Decision:** reject. Their domains do not match tourism credit economics and ML-personalized pricing harms explainability. Keep fixed public prices.

## 2026-08-26 — Free Quick Help

### GitHub
FAQ/RAG chatbot repositories including `arnobt78/Embeddable-FAQ-Seed-RAG-Chatbot-Widget--NextJS-FullStack` and `vpnsin/react-faq-chatbot`.  
**Decision:** reject runtime chatbot/RAG dependency for v1. Typed local state machine is cheaper, faster, more private and easier to localize.

### Hugging Face
Multilingual E5-style embeddings considered.  
**Decision:** defer until corpus size plus measured retrieval UX justifies embeddings.

## 2026-08-26 — Internationalization architecture

### GitHub
`amannn/next-intl` — MIT, mature Next.js App Router support. `4.13.4` is exactly pinned.  
**Decision:** use one i18n stack; explicit user locale choice always wins.

### Hugging Face
`facebook/nllb-200-distilled-600M` — broad coverage but non-commercial/research-oriented for this use.  
**Decision:** reject runtime translation; use reviewed static dictionaries.

## 2026-08-26 — Locale navigation / Quick Help / public localization QA

### GitHub
`next-intl` request/navigation/metadata patterns remain sufficient. Dependency-free Node scripts are used for dictionary and route-specific message contracts.  
**Decision:** no second i18n/SEO package.

### Hugging Face
COMET translation QA models were reviewed.  
**Decision:** no runtime/build integration while the static P0 corpus is small; model/CI weight exceeds value.

## 2026-08-26 — Gyeongbokgung localization + metadata + text expansion

`next-intl` server translation/metadata patterns rechecked; COMET candidates rechecked.  
**Decision:** keep Server Components/static P0 copy + deterministic parity. Do not enable canonical/hreflang/x-default before route parity and executable build evidence.

## 2026-08-26 — Step 2C-1A Personal Color native locale surface

### GitHub
Personal-color/skin-tone projects including `JungWooGeon/personal_color_app`, `starbucksdolcelatte/ShowMeTheColor`, `PSY222/Colorinsight` and `Randon-Myntra-HackerRamp-21/Skyn` were reviewed.

### Hugging Face
General skin/image classification candidates including `driboune/skin_type` and Google `derm-foundation` were reviewed.

**Decision:** keep in-repo browser-local deterministic preview. External projects/models did not justify image transfer, representation risk, dependency weight or supplier cost. Revisit premium vision only at Step 6 with consent/ZDR/EXIF/privacy/cost gates.

## 2026-08-27 — Step 2C-1B Hanbok native locale surface

### GitHub
`JamesAC42/hanbok` is primarily language-learning software. `seungboAn/try-on-hanbok` is a relevant later virtual-fitting reference but requires image upload, AI fitting and backend services.

### Hugging Face
Generic fashion embeddings/classifiers, virtual try-on Spaces, `daeunn/hanbok-dataset` and small Hanbok LoRA datasets were reviewed.

**Decision:** adopt none for the current free matcher. Keep user-choice-driven deterministic matching with 0 AI/provider/photo transfer. Step 7 remains the fuller recommendation gate; bulk Hanbok visual generation remains deferred.

## 2026-08-27 — Step 2C-1C Credits native locale surface

### GitHub
Fresh wallet/ledger search included `azex-ai/ledger`, whose top-up/reserve/settle patterns reinforce the existing immutable reserve/capture/release direction. Adding a Go service boundary during Step 2 would add operational risk before Step 4.

### Hugging Face
Dynamic pricing candidates including `iioos/dynamic-pricing-model` (MIT, ecommerce-oriented) and `PranavSharma/dynamic-pricing-model` (Apache-2.0, ride-price regression) were rechecked.

**Decision:** keep the in-repo deterministic economics catalog; defer external ledger choice until Step 4; reject ML personalized pricing. Numeric prices/credits remain authoritative only in `src/lib/credits/economics.ts` and locale bundles contain copy only.

## 2026-08-27 — Step 2C-2 executable CI verification

### GitHub reviewed
Official GitHub Actions and current security guidance were rechecked before introducing CI.

- `actions/checkout` verified release `v7.0.1`, commit `3d3c42e5aac5ba805825da76410c181273ba90b1`.
- `actions/setup-node` verified release `v7.0.0`, commit `820762786026740c76f36085b0efc47a31fe5020`.
- GitHub Actions least-privilege guidance informed `contents: read`, no persisted checkout credentials and no repository secrets.

**Decision:** adopt a minimal repository CI workflow instead of a new test framework or third-party CI. Official actions are full-SHA pinned; Node 22, 15-minute timeout, path scoping, concurrency cancellation and disabled Next telemetry are used.

Dependency installation currently uses `npm install --ignore-scripts --no-audit --no-fund` because no lockfile is committed. This establishes executable build evidence without lifecycle scripts, but dependency reproducibility remains a later supply-chain follow-up. Generate/review/commit a lockfile from a trusted environment; do not fabricate one manually.

### Hugging Face reviewed
Code-analysis/vulnerability models including CodeBERT-style classifiers, `Virtue-AI-HUB/VulnLLM-R-7B` and security coder finetunes were reviewed.

**Decision:** reject model-based CI for this gate. They add provenance/inference/false-result risk and do not prove TypeScript compilation, message contracts or a Next.js production build. Revisit only under a separate measured SAST requirement.

### Executable evidence and regressions caught

**Run `32994639016`** established the first runner path:
- checkout/Node/install succeeded;
- all P0 i18n contracts succeeded;
- Next compiled;
- TypeScript caught `DEFAULT_LOCALE` typed as broad P0/P1/P2 `SupportedLocale` while production routing is P0 only.

**Fix:** introduce `P0Locale = (typeof P0_LOCALES)[number]` and type `DEFAULT_LOCALE` as P0. Planned P1/P2 market registry values no longer widen production routing.

**Run `32995135203`** passed TypeScript and then caught prerender failure on migration-only unprefixed routes because global Quick Help used translations without a client provider.

**Fix:** wrap only legacy Quick Help in an English `NextIntlClientProvider`; locale-prefixed routes keep the regular locale provider.

**Run `32995294201` — SUCCESS:** 
- dependency install: success, 53 packages;
- P0 message parity: 6 locales × 283 leaf keys;
- Quick Help: 65 referenced keys;
- Personal Color: 38 keys;
- Hanbok: 44 keys;
- Credits: 3 plans + 11 paid feature labels from `economics.ts`;
- optimized production compilation: success;
- TypeScript: success;
- page-data collection: success;
- static generation: 46/46 pages;
- output confirmed P0 Home, Color, Credits, Culture, Gyeongbokgung and Hanbok paths.

The successful build still logged next-intl `ENVIRONMENT_FALLBACK` noise for the client-only legacy provider. Official next-intl guidance/discussion confirms that a client provider which cannot inherit server configuration should receive an explicit `timeZone`. The Korea-local legacy fallback now uses `Asia/Seoul` explicitly; this is a warning-cleanup change, not locale inference or user profiling.

### Security / privacy / cost implications
- AI/model inference in production/CI: **0**;
- application runtime dependencies added: **0**;
- repository secrets exposed: **0**;
- workflow token: **read-only contents/metadata**;
- checkout credential persistence: **disabled**;
- Next telemetry: **disabled**;
- customer data processed by CI: **0**;
- supplier inference cost: **0**;
- CI consumption bounded by path filters, concurrency cancellation and timeout.

### Sources reviewed
- https://github.com/actions/checkout/releases/tag/v7.0.1
- https://github.com/actions/setup-node/releases/tag/v7.0.0
- https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- https://github.com/amannn/next-intl/discussions/670
- https://huggingface.co/models?other=vulnerability-detection
- https://huggingface.co/models?other=code-analysis

## 2026-08-27 — Step 2C-3 P0 SEO locale cutover

### GitHub / framework review
`amannn/next-intl` remains the appropriate i18n dependency; no second SEO/i18n package is justified. Current Next.js Metadata API guidance was rechecked for generated metadata, canonical URLs, robots and sitemap generation. The existing project can express reciprocal language alternates and sitemap alternates with built-in `Metadata` / `MetadataRoute` types.

**Decision:** implement a small in-repo SEO helper instead of adding `next-sitemap` or another runtime/build dependency. Centralize the production origin, six complete public locale paths, BCP47 hreflang mapping and URL generation so page metadata and sitemap cannot drift independently.

### Hugging Face review
The Hugging Face connector search was attempted but unavailable in this run. A fallback public Hugging Face search surfaced SEO/AEO site examples rather than a model capable of validating canonical/hreflang/sitemap correctness.

**Decision:** reject ML/model involvement. SEO alternate correctness is deterministic configuration and compiler/build validation work; model inference would add cost/provenance risk without improving correctness.

### Implementation / correctness decisions
- self-canonical URL on each complete P0 localized public page;
- reciprocal language alternates for `en`, `zh-Hans`, `ja`, `zh-Hant`, `vi`, `th` plus `x-default` pointing to English;
- sitemap now contains only the **36 canonical P0 URLs** (6 complete public route shapes × 6 locales), not migration-only unprefixed duplicates;
- sitemap language alternates use the same centralized URL map as page metadata;
- removed build-time `lastModified: new Date()` because it falsely implied every stable page changed on every build; truthful last-modified values can be added only when real content-review timestamps exist;
- robots keeps public content crawlable, explicitly allows `OAI-SearchBot`, and extends sensitive account/saved/checkout/personal-result exclusions to P0-prefixed future paths;
- browser-language auto-routing and `LegacyShell` removal remain deliberately out of scope for this rollback-sensitive slice.

### Executable evidence
PR #3 workflow run `32999919664` passed dependency install, all P0 localization contracts and the Next.js 16.3.3 production build. This proves the Metadata/Sitemap/Robots TypeScript shapes compile and static generation remains valid. It is build evidence, not deployment or search-engine indexing evidence.

### Security / privacy / cost impact
- application AI/model calls: **0**;
- runtime dependencies added: **0**;
- customer data transfer added: **0**;
- secrets/payment/wallet behavior changed: **0**;
- supplier inference cost: **0**;
- public crawler access is broadened only through correct localized discovery; private/result route exclusions are stricter.

### Sources reviewed
- https://github.com/amannn/next-intl
- https://nextjs.org/learn/dashboard-app/adding-metadata
- https://nextjs.org/learn/seo/canonical
- https://nextjs.org/learn/seo/xml-sitemaps
- https://nextjs.org/learn/seo/metatags
- https://huggingface.co/spaces/VIDraft/AI/commit/03abde981ce8f3e0efe92c5f878071b561ef6d89

## Discovery rules for future entries

For every major feature/subfeature record:
1. feature/subfeature;
2. GitHub repositories/libraries reviewed;
3. Hugging Face models/datasets/Spaces reviewed;
4. commercial license status;
5. maintenance/recency/adoption signals;
6. privacy/data provenance;
7. inference/runtime cost and latency;
8. browser/mobile fit;
9. multilingual/market fit;
10. security/supply-chain risk;
11. expected user/margin benefit;
12. adopt / adapt / reject decision and rationale.

Re-search whenever revisiting a feature. Never assume the previous best option remains best.
