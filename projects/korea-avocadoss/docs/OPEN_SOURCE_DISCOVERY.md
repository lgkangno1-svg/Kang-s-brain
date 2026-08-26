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

- `actions/checkout` latest verified release inspected: `v7.0.1`, commit `3d3c42e5aac5ba805825da76410c181273ba90b1`. The v7 line includes safer handling for privileged fork-checkout scenarios and current dependency/security fixes.
- `actions/setup-node` latest verified release inspected: `v7.0.0`, commit `820762786026740c76f36085b0efc47a31fe5020`. Its release notes include cache-poisoning guidance and current action dependencies.
- GitHub Actions least-privilege guidance was applied by declaring only `contents: read` for the job.

**Decision:** adopt a minimal repository CI workflow rather than adding a test framework or third-party CI service. Both official actions are pinned to full commit SHAs instead of mutable tags. Checkout credentials are not persisted. The job uses Node 22, no repository secrets, a 15-minute timeout and path scoping to `projects/korea-avocadoss/**` plus the workflow file. Next telemetry is disabled in CI.

Dependency installation currently uses `npm install --ignore-scripts --no-audit --no-fund` because the project does not yet have a committed lockfile. This is sufficient to establish an executable build gate without running lifecycle scripts, but dependency reproducibility remains a known follow-up: generate/review/commit a lockfile from a trusted executable environment before treating dependency resolution as fully deterministic.

### Hugging Face reviewed

Current Hugging Face code-analysis / vulnerability-detection catalog was searched, including CodeBERT-style vulnerability classifiers, `Virtue-AI-HUB/VulnLLM-R-7B`, security coder finetunes and related models.

**Decision:** reject model-based CI for this gate. These models add model provenance, inference/runtime and false-positive/false-negative concerns and do not prove TypeScript compilation, P0 message contracts or Next.js production-build success. Static project checks + compiler/build are the correct evidence for Step 2C-2. Security-model evaluation can be revisited only for a separate measured SAST requirement.

### First executable evidence

GitHub Actions run `32994639016` on commit `e6d41d0f1bacb7cb2749ff8a36f42d3ac101df96` established the first real runner path:

- checkout: success;
- Node 22 setup: success (`v22.23.2`, npm `10.9.8`);
- dependency install: success, 53 packages;
- `npm run check:i18n`: success — 6 locales × 283 leaf keys, Quick Help 65 keys, Personal Color 38 keys, Hanbok 44 keys, Credits 3 plans + 11 paid-feature labels;
- `next build`: compiled successfully, then TypeScript failed at `src/i18n/routing.ts` because `DEFAULT_LOCALE` was typed as the broad P0/P1/P2 `SupportedLocale` union while production routing intentionally accepts P0 only.

The failure was actionable and confirmed why executable CI was required. The fix introduces `P0Locale` from `P0_LOCALES` and types `DEFAULT_LOCALE` as `P0Locale`, preserving P1/P2 market registry data without widening production routing.

### Security / privacy / cost implications

- AI/model inference added to production or CI: **0**;
- application runtime dependencies added: **0**;
- repository secrets exposed to CI: **0**;
- workflow token permission: **read-only contents/metadata**;
- checkout credential persistence: **disabled**;
- Next telemetry in CI: **disabled**;
- customer data processed: **0**;
- supplier inference cost: **0**;
- GitHub-hosted CI consumption is bounded by path filters, concurrency cancellation and a 15-minute timeout.

### Sources reviewed
- https://github.com/actions/checkout/releases/tag/v7.0.1
- https://github.com/actions/setup-node/releases/tag/v7.0.0
- https://docs.github.com/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
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
