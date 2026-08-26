# Korea Concierge — Open Source / Model Discovery Log

This log records the required GitHub + Hugging Face discovery pass performed before major feature implementations or material revisions.

The rule is not “use open source whenever possible.” The rule is to discover first, then adopt only when license, maintenance, privacy, quality, cost and architecture fit the product.

## 2026-08-26 — Credits, wallet and pricing architecture

### GitHub reviewed

#### `amirhf/creditLedger`
- MIT licensed reference implementation.
- Relevant patterns: immutable history, double-entry-style thinking, idempotency, transactional outbox, auditable balance projection.
- Decision: **adopt the architectural patterns, not the full stack**. Use Postgres transactions, immutable credit ledger, idempotency keys and derived balance at launch rather than its Go/Kafka/CQRS stack.

### Hugging Face reviewed
- `PranavSharma/dynamic-pricing-model` — Apache-2.0 ride-hailing regression model.
- `iioos/dynamic-pricing-model` — MIT-tagged ecommerce pricing model with little adoption evidence.
- Decision: **reject both for launch pricing**. Domains do not match tourism credit economics and personalized ML pricing would reduce explainability. Use fixed public prices and controlled experiments later.

## 2026-08-26 — Free Quick Help chatbot

### GitHub reviewed
FAQ chatbot implementations including `arnobt78/Embeddable-FAQ-Seed-RAG-Chatbot-Widget--NextJS-FullStack` and `vpnsin/react-faq-chatbot`.

Decision: **do not adopt a chatbot/RAG dependency for v1**. A typed local state machine is cheaper, faster, more private and easier to localize for a fixed-answer 0-credit helper.

### Hugging Face reviewed
Multilingual E5-style embedding models were considered for future semantic FAQ retrieval.

Decision: **defer** until the FAQ corpus is large enough to justify measured browser/server retrieval complexity.

## 2026-08-26 — Internationalization and translation architecture

### GitHub reviewed

#### `amannn/next-intl`
- MIT licensed, mature Next.js-specific i18n library with locale routing, ICU messages, Server Component support, formatting and localized pathnames.
- **Fresh re-verification correction:** the prior note claiming `4.13.7` was latest was incorrect. GitHub releases/changelog show **`4.13.4` (2026-07-23) as the latest stable release currently verifiable**.
- `4.13.3` explicitly prepared compatibility with Next.js 16.3 locale-cookie behavior; the project/course documentation was updated on 2026-08-04 for stable Next.js 16.3 `next/root-params` support.
- Decision: **adopt and exactly pin `next-intl@4.13.4`** for Step 2. Do not float minor versions during the migration.
- Implementation slice 2A adds the plugin, P0 `defineRouting` registry and validated request-time message loader, but deliberately does not activate redirect/proxy behavior until `[locale]` pages exist. This avoids turning working unprefixed routes into 404s mid-migration.
- Browser-language handling will be suggestion/negotiation only; explicit user choice always wins. No nationality/IP inference.

### Hugging Face reviewed

#### `facebook/nllb-200-distilled-600M`
- Covers 196 languages but Hugging Face currently labels it **CC-BY-NC-4.0 / CC-BY-NC**.
- Model card describes research-oriented machine translation and says it is not released for production deployment.
- Decision: **reject for Korea Concierge production/commercial localization**. Static reviewed dictionaries remain the safer, lower-cost path.

#### multilingual E5 variants
Decision: **defer for locale/FAQ routing**; no benefit for deterministic routing at current corpus size.

### Current sources
- https://github.com/amannn/next-intl/releases
- https://github.com/amannn/next-intl/blob/main/CHANGELOG.md
- https://learn.next-intl.dev/changelog
- https://next-intl.dev/
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

Re-run discovery when revisiting features. Do not assume the previous best option is still best.
