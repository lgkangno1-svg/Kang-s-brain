# Korea Concierge — Open Source / Model Discovery Log

This is the required discovery record before material feature implementation/revision. Search first, then adopt only when commercial license, maintenance, privacy, quality, runtime cost, latency, browser/mobile fit, multilingual suitability, provenance, security and margin justify it.

## 2026-08-26 — Credits, wallet and pricing architecture

### GitHub
`amirhf/creditLedger` — MIT. Useful patterns: immutable history, idempotency, auditable balance projection, transactional thinking.  
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

### GitHub reviewed
Fresh wallet/ledger search was compared with the already-adopted immutable-ledger direction. A recent `azex-ai/ledger` result is a production-oriented double-entry ledger with examples for top-up wallets, reserve/settle and credits. Those concepts reinforce the existing reserve/capture/release and immutable transaction requirements, but adopting a Go ledger engine during Step 2 localization would introduce an unnecessary service/runtime boundary before Step 4 auth/wallet work.

The existing in-repo `src/lib/credits/economics.ts` already centralizes launch Trip Passes, refill packs, feature credit prices and margin assumptions. The localized UI therefore reads numeric prices/credits directly from that module instead of duplicating numbers in translation files.

**Decision:** adapt the existing in-repo economics catalog now; defer any external ledger implementation until Step 4. When Step 4 begins, re-search ledger libraries and compare them against a minimal Postgres transaction implementation before deciding.

### Hugging Face reviewed
Fresh search again surfaced dynamic-pricing models including:

- `iioos/dynamic-pricing-model` — MIT, ecommerce pricing/forecasting oriented;
- `PranavSharma/dynamic-pricing-model` — Apache-2.0, ride-price regression; the model card states real-world limitations and the training domain is ride pricing;
- dynamic-pricing demo Spaces aimed at inventory/demand pricing.

**Decision:** reject all for launch customer pricing. They do not improve a fixed-credit travel product's trust or margin control and would make prices harder to audit. Korea Concierge will not vary customer prices using nationality, profile traits or ML. Public launch pricing remains deterministic and server-authoritative.

### Implementation adaptation
- `/[locale]/credits` is now native P0 content rather than an English re-export;
- numeric Basic/Advanced/Ultra, refill and feature-credit values are read from `economics.ts` only;
- translation bundles contain labels/descriptions, not authoritative numeric prices;
- feature rows show fixed credits before confirmation semantics;
- the page explicitly labels itself a pricing preview and does not expose a fake checkout before Step 4/5 wallet/payment gates;
- a dependency-free build contract derives plan/paid-feature IDs from `economics.ts` and verifies matching English message keys;
- P0 parity now includes the modular credits bundle.

### Security / privacy / token / margin implications
- AI/model/provider calls added: **0**;
- runtime dependencies added: **0**;
- external personal-data transfer added: **0**;
- ML/dynamic personalized pricing: **0**;
- checkout/payment mutation surface added: **0**;
- numeric price duplication in locale copy: **0**;
- incremental inference/provider cost: **0**;
- gross-margin effect: neutral/favorable because pricing clarity/localization improves without supplier cost.

### Sources reviewed
- https://github.com/azex-ai/ledger
- https://huggingface.co/iioos/dynamic-pricing-model
- https://huggingface.co/PranavSharma/dynamic-pricing-model

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
