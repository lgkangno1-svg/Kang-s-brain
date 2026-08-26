# Korea Concierge — Open Source / Model Discovery Log

This is the required discovery record before material feature implementation/revision. The rule is not “use open source whenever possible”; search first, then adopt only when commercial license, maintenance, privacy, quality, runtime cost, latency, browser/mobile fit, multilingual suitability, provenance, security and margin justify it.

## 2026-08-26 — Credits, wallet and pricing architecture

### GitHub
`amirhf/creditLedger` — MIT. Useful patterns: immutable history, idempotency, auditable balance projection, transactional thinking.  
**Decision:** adopt the accounting patterns, not the Go/Kafka/CQRS stack. Launch should use Postgres transactions, immutable ledger, idempotency keys and derived balance.

### Hugging Face
`PranavSharma/dynamic-pricing-model` and `iioos/dynamic-pricing-model` were reviewed.  
**Decision:** reject for launch pricing. Training domains do not match tourism credit economics and ML-personalized pricing harms explainability. Use fixed public prices and controlled experiments later.

## 2026-08-26 — Free Quick Help

### GitHub
FAQ/RAG chatbot repositories including `arnobt78/Embeddable-FAQ-Seed-RAG-Chatbot-Widget--NextJS-FullStack` and `vpnsin/react-faq-chatbot`.  
**Decision:** reject runtime chatbot/RAG dependency for v1. Typed local state machine is cheaper, faster, more private and easier to localize.

### Hugging Face
Multilingual E5-style embeddings considered.  
**Decision:** defer until corpus size plus measured retrieval UX justifies embeddings.

## 2026-08-26 — Internationalization architecture

### GitHub
`amannn/next-intl` — MIT, mature Next.js App Router support, locale routing, Server Components, formatting, navigation. Fresh version correction established `4.13.4` as the latest verifiable stable version at the time and it is exactly pinned.  
**Decision:** adopt and keep one i18n stack. Browser-language handling remains suggestion/negotiation only after route parity; explicit user choice always wins.

### Hugging Face
`facebook/nllb-200-distilled-600M` — broad language coverage but CC-BY-NC and model card is research-oriented/not production release.  
**Decision:** reject for commercial runtime localization. Use reviewed static dictionaries.

## 2026-08-26 — Locale navigation / Quick Help / public localization QA

### GitHub
Re-checks of `next-intl` App Router navigation, request messages and metadata patterns continued to fit the architecture better than adding another routing/i18n package. Dependency-free Node scripts were preferred for dictionary parity, Quick Help graph-key checking and later route-specific message contracts.  
**Decision:** adapt existing stack, keep deterministic local build gates, no second i18n/SEO dependency.

### Hugging Face
`Unbabel/wmt20-comet-qe-da`, `Unbabel/wmt22-comet-da`, `Unbabel/eamt22-cometinho-da` (Apache-2.0) and `Unbabel/wmt22-cometkiwi-da` (non-commercial license) were reviewed for translation QA.  
**Decision:** no runtime/build integration while the static P0 corpus is small. Python/model downloads/CI and supply-chain weight exceed current value. Non-commercial variants are excluded from commercial workflow.

## 2026-08-26 — Gyeongbokgung localization + metadata + text expansion

### GitHub
`next-intl` server translation and async metadata patterns rechecked.  
**Decision:** keep `getTranslations`/Server Component pattern and locale-scoped CSS for text expansion rather than adding libraries. Do not enable canonical/hreflang/x-default before route parity and executable build evidence.

### Hugging Face
COMET translation QA models rechecked.  
**Decision:** unchanged; static reviewed P0 copy + deterministic parity remains cheaper and lower risk.

## 2026-08-26 — Step 2C-1A Personal Color native locale surface

### GitHub reviewed
Fresh search covered personal-color and skin-tone analysis projects, including `JungWooGeon/personal_color_app`, `starbucksdolcelatte/ShowMeTheColor`, `PSY222/Colorinsight` and `Randon-Myntra-HackerRamp-21/Skyn`.

**Decision: adapt current in-repo deterministic browser implementation, do not adopt an external repository or model in Step 2C.** Current preview avoids image upload/provider cost; external projects do not provide enough maintenance, representative validation or incremental user-value evidence to justify face/model dependencies. Analyzer messages therefore use stable codes, palette data uses stable IDs and copy remains in P0 dictionaries.

### Hugging Face reviewed
General skin/image classification candidates including `driboune/skin_type` and Google `derm-foundation` were reviewed. They do not directly provide validated personal-color styling and introduce image-transfer/bundle/generalization concerns.

**Decision:** reject remote/bundled model adoption for the free preview. Revisit only at Step 6 with explicit consent, ZDR/data-collection restrictions, EXIF minimization, representative validation, bounded supplier cost and a free/manual fallback.

### Security / privacy / token / margin implications
AI/model/provider calls 0; external selfie transfer 0; runtime dependencies 0; incremental inference cost 0; no sensitive identity inference permitted.

## 2026-08-27 — Step 2C-1B Hanbok native locale surface

### GitHub reviewed
Fresh search for Hanbok/recommendation projects found:

- `JamesAC42/hanbok` — despite its name, it is primarily a general language-learning product with sentence/grammar/cultural analysis and optional LLM integrations. It does not solve Hanbok styling recommendation and would add unrelated Redis/Mongo/API complexity.
- `seungboAn/try-on-hanbok` — Flutter/Supabase Hanbok virtual-fitting application with user image upload and AI-based try-on. It is relevant as a later UX reference, but adopting its stack now would prematurely add remote media storage, AI inference, backend dependencies and privacy obligations.
- other repositories returned by a `hanbok` search were small research/frontend/trend projects without clear evidence of maintained, commercially suitable recommendation logic for the current Next.js product.

**Decision:** do not adopt an external Hanbok stack for Step 2C. Implement only a small deterministic matcher in the existing Next.js app. User-selected color, mood and trip comfort drive the preview; explicit choices outrank market defaults. Step 7 remains the gate for a fuller recommendation engine.

### Hugging Face reviewed
Fresh Hugging Face search found:

- generic fashion models such as FashionCLIP/FashionSigLIP-style embeddings and clothing classifiers;
- multiple virtual try-on Spaces, including Kolors-based and diffusion-based try-on demos;
- `daeunn/hanbok-dataset`, a small Hanbok image/caption dataset with 784 rows visible in the dataset viewer;
- small Hanbok LoRA datasets such as `AIARTCHAN/lora-Hanbok_LoRA_V2`, which has only a handful of rows and is aimed at image generation rather than validated recommendation.

**Decision:** reject model/Space/dataset adoption for the current free matcher. Generic fashion embeddings do not provide validated Hanbok-specific recommendation quality; virtual try-on requires photo transfer and heavier inference; small Hanbok datasets do not establish representative coverage, commercial provenance or recommendation accuracy. Keep the current preview model-free and cost-free.

Revisit premium virtual try-on later only if it produces measurable conversion/user value and after commercial license/data provenance, representative Hanbok coverage, image privacy/ZDR, EXIF stripping, latency and per-generation supplier cost are all acceptable. Premium execution must display a fixed credit price before confirmation.

### Implementation adaptation
- native P0 `/[locale]/hanbok` route with localized metadata;
- deterministic client-side radio controls for color direction, mood and trip priority;
- stable option IDs with human copy in separate `messages/hanbok/{locale}.json` bundles;
- P0 parity + Hanbok message-contract checks before build;
- CJK/Thai/Vietnamese text-expansion styles for fieldsets, labels and result facts;
- no bulk Hanbok visual asset generation started.

### Security / privacy / token / margin implications
- AI/model/provider calls added: **0**;
- photo upload/external user-data transfer added: **0**;
- runtime dependencies added: **0**;
- credits charged by the free matcher: **0**;
- incremental inference/provider cost: **0**;
- market/nationality/profile inference: **0**;
- gross-margin effect: favorable/neutral because localized value increases with no supplier cost.

### Sources reviewed
- https://github.com/JamesAC42/hanbok
- https://github.com/seungboAn/try-on-hanbok
- https://huggingface.co/models?other=fashion
- https://huggingface.co/spaces?q=try-on
- https://huggingface.co/datasets/daeunn/hanbok-dataset
- https://huggingface.co/datasets/AIARTCHAN/lora-Hanbok_LoRA_V2

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
