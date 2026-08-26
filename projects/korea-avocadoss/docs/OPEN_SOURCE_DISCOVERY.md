# Korea Concierge — Open Source / Model Discovery Log

This log records the required GitHub + Hugging Face discovery pass performed before major feature implementations or material revisions.

The rule is not “use open source whenever possible.” The rule is to discover first, then adopt only when license, maintenance, privacy, quality, cost and architecture fit the product.

## 2026-08-26 — Credits, wallet and pricing architecture

### GitHub reviewed

#### `amirhf/creditLedger`
- URL: https://github.com/amirhf/creditLedger
- README identifies the project as MIT licensed.
- Relevant patterns: immutable history, double-entry-style thinking, idempotency, transactional outbox, auditable balance projection.
- Decision: **adopt the architectural patterns, not the full stack**.
- Why: the reference implementation uses Go + Kafka/Redpanda + CQRS/microservices, which is unnecessary complexity for the Korea Concierge launch volume.
- Korea Concierge launch implementation should use Postgres transactions, an immutable credit ledger, idempotency keys and a derived wallet balance. Add an outbox/event pipeline later only if scale or integration reliability requires it.
- Expected benefit: fewer double-charge/double-credit bugs, easier refunds/disputes, auditable support history.
- Cost/latency impact: negligible at launch; materially lower ops complexity than copying the full reference architecture.

### Hugging Face reviewed

Dynamic-pricing models were found, including:

- `PranavSharma/dynamic-pricing-model` — Apache-2.0, regression model designed around ride-hailing variables; model card explicitly notes real-world limitations.
- `iioos/dynamic-pricing-model` — MIT-tagged ecommerce pricing model with little adoption evidence.

Decision: **reject both for launch pricing**.

Why:
- training domains do not match tourism AI-credit economics;
- no evidence they optimize this product's conversion, retention or margin;
- ML-driven customer-specific pricing would make checkout harder to explain and audit;
- authoritative credit accounting and public feature pricing should be deterministic.

We will instead use fixed public Trip Pass/feature prices and optimize them through controlled A/B tests after enough first-party conversion and usage data exists.

### Sources
- https://github.com/amirhf/creditLedger
- https://huggingface.co/PranavSharma/dynamic-pricing-model
- https://huggingface.co/iioos/dynamic-pricing-model

## 2026-08-26 — Free Quick Help chatbot

### GitHub reviewed

Searches for React/Next.js FAQ chatbots surfaced implementations such as:
- `arnobt78/Embeddable-FAQ-Seed-RAG-Chatbot-Widget--NextJS-FullStack`
- `vpnsin/react-faq-chatbot`

Decision: **do not adopt a chatbot/RAG dependency for the first version**.

Why:
- the requested feature is intentionally fixed-answer and zero-API;
- RAG, vector databases and generative chat add cost, privacy surface, latency and hallucination risk without improving the current button-driven use case;
- a small typed React state machine is easier to audit, localize and keep free.

Implementation: `src/features/quick-help/` contains a local conversation tree and client widget. No OpenRouter/Hugging Face request is required at runtime.

### Hugging Face reviewed

Multilingual E5-style embedding models can support semantic FAQ retrieval when the knowledge base becomes much larger.

Decision: **defer**.

Reconsider only when the FAQ set grows enough that button/topic navigation becomes cumbersome. At that point benchmark browser-local search vs. server embeddings, bundle size, latency and multilingual retrieval quality before adoption.

## 2026-08-26 — Internationalization and translation architecture

### GitHub reviewed

#### `amannn/next-intl`
- MIT licensed.
- Mature Next.js-specific i18n project with internationalized routing, ICU messages, date/number formatting, Server Component support and localized pathnames.
- npm currently reports `4.13.7` as latest; the 4.13.x changelog includes explicit Next.js 16.3 compatibility work.
- npm reports multi-million weekly downloads, which is a materially stronger maintenance/adoption signal than small template repositories found in the same search.

Decision: **adopt and pin `next-intl@4.13.7` in Step 2**, not in the Step 1 dictionary-preparation patch.

Cautions:
- keep sensitive/admin-only copy out of client translation bundles;
- load only namespaces required by a route where practical;
- use locale-prefixed public URLs with explicit user switching and browser-language suggestion, never forced nationality/IP redirection;
- add routing without breaking existing non-prefixed URLs before production cutover;
- rerun build/security checks immediately after adding the dependency.

### Hugging Face reviewed

#### `facebook/nllb-200-distilled-600M`
- broad translation coverage across the P0/P1 language families;
- Hugging Face model metadata/model card currently identifies the license as **CC-BY-NC-4.0 / CC-BY-NC**;
- the model card states it is a research model and not released for production deployment.

Decision: **reject for Korea Concierge production and commercial translation work**.

Why:
- the non-commercial license is incompatible with the intended commercial service;
- the model card itself does not position the model for production deployment;
- static product copy should be reviewed, versioned and shipped as dictionaries rather than translated at request time;
- a 600M runtime model would add compute, latency and operational complexity without eliminating native-language QA for payment, privacy and travel copy.

This supersedes the earlier softer “offline drafting candidate” note: do not incorporate NLLB-200 outputs into the commercial localization pipeline unless licensing terms materially change and are re-reviewed.

#### multilingual E5 variants

Decision: **defer for locale/FAQ routing**. They may later help multilingual semantic search, but are unnecessary for the initial deterministic Quick Help and locale architecture.

### Sources
- https://github.com/amannn/next-intl
- https://www.npmjs.com/package/next-intl
- https://huggingface.co/facebook/nllb-200-distilled-600M

## Discovery rules for future entries

For every major feature, record:

1. feature/subfeature;
2. GitHub repositories/libraries reviewed;
3. Hugging Face models/datasets/Spaces reviewed;
4. license and commercial-use status;
5. maintenance/recency/adoption signals;
6. privacy/data-provenance concerns;
7. measured or expected inference/runtime cost;
8. latency and browser/mobile suitability;
9. multilingual quality where relevant;
10. adopt / adapt / reject decision and rationale.

Re-run discovery when revisiting a feature. Do not assume the previous best option is still best.
