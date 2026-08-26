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
