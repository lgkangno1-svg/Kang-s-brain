# Korea Concierge — Open Source / Model Discovery Log

This is the required discovery record before material feature implementation/revision. Search first, then adopt only when commercial license, maintenance, privacy, quality, runtime cost, latency, browser/mobile fit, multilingual suitability, provenance, security and margin justify it.

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
