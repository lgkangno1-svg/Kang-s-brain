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
Fresh search covered personal-color and skin-tone analysis projects, including:

- `JungWooGeon/personal_color_app` — React Native/Expo + Teachable Machine era implementation; useful as historical UX/reference, but small adoption, older architecture and external model workflow do not justify production adoption.
- `starbucksdolcelatte/ShowMeTheColor` — research-style Python personal-color diagnosis using facial-region color features, Lab/HSV calculations and weighted comparison. Useful algorithmic reference, but not a browser-first maintained web component and lacks the product/privacy validation needed to replace current implementation.
- `PSY222/Colorinsight` and similar face/segmentation/image-classification personal-color projects — demonstrate heavier ML alternatives but add model/backend complexity and require representative validation.
- broader React/Flask skin-tone/skincare projects such as `Randon-Myntra-HackerRamp-21/Skyn` use face detection/CNN pipelines and solve a different product problem.

**Decision: adapt current in-repo deterministic browser implementation, do not adopt an external repository or model in Step 2C.** Reasons:
- current preview already avoids image upload and provider cost;
- external projects do not provide strong evidence of current maintenance, representative cross-market validation or materially better user outcomes;
- adding face recognition/segmentation/model packages increases bundle/runtime/supply-chain/privacy surface;
- locale migration should not silently turn a zero-cost preview into remote AI;
- manual correction plus clear “lighting-dependent styling estimate, not professional diagnosis” wording is safer for the current maturity level.

Implementation adaptation in this slice:
- analyzer warnings/errors are now stable typed codes rather than English text;
- palette data uses stable IDs + hex values; localized names/notes live in dictionaries;
- complete scanner UI is P0-localized;
- a dependency-free Color message contract checker is included in `check:i18n`.

### Hugging Face reviewed
Search for personal-color/skin-tone image classifiers returned general skin/image classification options including `driboune/skin_type`, while general image-classification guidance points to ViT/DeiT/ConvNeXt-class models. Google `derm-foundation` is a research foundation model for dermatology embeddings and explicitly discusses population/generalization limitations; it does not directly provide a validated personal-color styling classifier.

**Decision: reject remote/bundled Hugging Face model adoption for this preview.** Reasons:
- task mismatch: skin type/dermatology/general classification is not validated personal-color styling;
- personal-color outputs are sensitive to lighting, white balance and image capture conditions;
- external inference would introduce image-transfer/privacy obligations and supplier cost;
- bundled models add download/bundle/latency burden on international mobile visitors;
- fairness/provenance/generalization require representative validation before claiming improved quality.

Revisit at Step 6 only if a premium vision path shows measurable incremental value. Any remote media analysis must require explicit consent, ZDR/data-collection restrictions, EXIF stripping/minimization, bounded supplier cost, representative evaluation and a free/manual fallback.

### Security / privacy / token / margin implications
- AI/model/provider calls added: **0**.
- External selfie transfer added: **0**.
- Runtime dependencies added: **0**.
- Incremental inference cost: **0**.
- Browser-local sampling remains the default and avoids identity recognition.
- No race, ethnicity, nationality, religion, health or attractiveness inference is permitted.
- Manual correction remains available to reduce overconfidence in heuristic output.
- Gross-margin effect is favorable/neutral because localization improves usefulness without supplier cost.

### Sources reviewed
- https://github.com/JungWooGeon/personal_color_app
- https://github.com/starbucksdolcelatte/ShowMeTheColor
- https://github.com/PSY222/Colorinsight
- https://github.com/Randon-Myntra-HackerRamp-21/Skyn
- https://huggingface.co/driboune/skin_type
- https://huggingface.co/google/derm-foundation
- https://huggingface.co/docs/inference-providers/tasks/image-classification

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
