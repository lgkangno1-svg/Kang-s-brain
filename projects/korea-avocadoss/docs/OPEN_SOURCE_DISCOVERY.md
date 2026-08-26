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

## 2026-08-26 — Step 2B-1 locale navigation re-check

### GitHub / upstream documentation reviewed
- Fresh repository search found several App Router localization examples, but none provided stronger maintenance or product fit than the already selected first-party-focused `next-intl` approach.
- Current `next-intl` learning material explicitly covers top-level locale routing, navigation APIs that preserve locales, locale switching, static rendering/404 handling, and Next.js 16 updates including stable `next/root-params` guidance dated 2026-08-04.
- Decision: **continue with `next-intl` and use its `createNavigation(routing)` API** rather than adding a second routing/i18n dependency or maintaining hand-written URL replacement logic.
- Migration decision: retain existing unprefixed routes temporarily and isolate them behind a migration-only shell while locale-prefixed routes are introduced incrementally. Do not activate middleware/proxy redirects before destination route parity and build verification.

### Hugging Face re-check
- `facebook/nllb-200-distilled-600M` remains CC-BY-NC-4.0 and its current model card continues to say it is research-oriented and not released for production deployment.
- Decision unchanged: **do not add runtime translation ML**. It would add model/runtime cost, latency, privacy surface and licensing risk while reviewed static dictionaries meet the current product need at zero per-request inference cost.

### Security / performance implications
- No new network service, AI provider, embedding database or translation API was added.
- Locale switching is deterministic client navigation over an allowlisted P0 locale registry.
- Unsupported request locales continue to fail closed through the validated request config.
- The temporary legacy-shell client boundary adds some migration-time JavaScript overhead and should be removed at the Step 2C cutover rather than becoming permanent architecture.

### Current sources
- https://github.com/amannn/next-intl/releases
- https://github.com/amannn/next-intl/blob/main/CHANGELOG.md
- https://learn.next-intl.dev/changelog
- https://learn.next-intl.dev/chapters/06-routing/01-setup
- https://learn.next-intl.dev/chapters/06-routing/04-navigation-apis
- https://learn.next-intl.dev/chapters/06-routing/05-locale-switcher
- https://huggingface.co/facebook/nllb-200-distilled-600M

## 2026-08-26 — Step 2B-2 Quick Help localization + translation QA

### GitHub reviewed
- Fresh search for i18n message-key validation/parity tooling returned only weak or low-signal candidates and no maintained dependency that justified increasing supply-chain surface for a simple six-file invariant.
- Decision: **use a dependency-free Node parity checker** that flattens the English dictionary as the reference schema, then fails on missing, extra or blank P0 message leaves. The production `build` command now runs this check first.
- Quick Help's decision graph now stores message keys only; every title, answer, choice, CTA and accessibility label resolves through the active `next-intl` dictionary. This removes the previous English hard-coded second-level answers.

### Hugging Face reviewed
- `Unbabel/wmt20-comet-qe-da` is an Apache-2.0 multilingual translation quality-estimation model and is technically usable for offline translation QA.
- `Unbabel/wmt22-cometkiwi-da` is CC-BY-NC-SA-4.0 and unsuitable for the commercial production workflow.
- Decision: **do not add either model to the application or build pipeline now**. COMET would add model downloads, Python/runtime complexity and CI time for a tiny reviewed static corpus. Human/native review plus deterministic key parity provides better cost/complexity fit today. Reconsider an Apache-2.0 COMET-class evaluator only when localization volume becomes large enough to justify offline automated QA.

### Security / token / margin implications
- Quick Help remains 0 credits, 0 AI API calls and sends no question externally.
- No new runtime dependency, model, embedding store or translation API was added.
- Message parity uses local filesystem reads only and therefore adds no provider cost or sensitive-data surface.
- Localized fixed answers reduce accidental paid-model routing for common questions and preserve gross margin.

### Sources
- https://github.com/amannn/next-intl
- https://huggingface.co/Unbabel/wmt20-comet-qe-da
- https://huggingface.co/Unbabel/wmt22-cometkiwi-da

## 2026-08-26 — Step 2B-3 localized public surfaces + graph QA

### GitHub / upstream reviewed
- Re-checked the latest `amannn/next-intl` App Router guidance and example layout before editing. Current guidance continues to support validated locale segments, request messages and locale-aware navigation; the first-party example remains a better fit than adding a second i18n stack.
- `next-intl` also supports TypeScript augmentation for locale/message typing, but this slice intentionally **defers** augmentation until a verified build environment exists. Adding type augmentation now would enlarge the blast radius without solving the immediate public-copy migration.
- Decision: **adapt the existing static-dictionary architecture** by splitting growing public marketing copy into `messages/public/{locale}.json`, then merging it with the core dictionary at request time. This keeps files reviewable while preserving one runtime message object and adds no package.
- Decision: **adopt a small dependency-free graph/message checker** for Quick Help. It reads the state-machine source and fails when a referenced title/answer/choice key is absent from the English schema, complementing P0 parity checks.

### Hugging Face reviewed
- `Unbabel/wmt20-comet-qe-da` — Apache-2.0 multilingual QE model, source + translation scoring.
- `Unbabel/wmt22-comet-da` and `Unbabel/eamt22-cometinho-da` — Apache-2.0 reference-based multilingual translation evaluation models.
- `Unbabel/wmt22-cometkiwi-da` — CC-BY-NC-SA-4.0, unsuitable for the commercial workflow.
- Decision: **reject runtime/build integration for this slice**. The new corpus is still small static product copy. Installing COMET/Python/models would add CI/runtime weight and supply-chain surface with no user-visible gain. Revisit Apache-2.0 offline QA once localization volume and native-review cost justify it.

### Security / performance / margin implications
- No runtime translation, AI API, RAG, embeddings or external user-data transfer was added.
- Public copy is loaded from allowlisted locale files only after locale validation.
- K-Culture copy reinforces that unknown birth time is valid and must never be guessed.
- Added checks are filesystem-only build gates; marginal provider cost is zero.
- Static localization and zero-AI Quick Help preserve gross margin and reduce the chance that common informational queries are routed to paid inference.

### Sources
- https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/usage/configuration.mdx
- https://github.com/amannn/next-intl/blob/main/examples/example-app-router/src/app/%5Blocale%5D/layout.tsx
- https://github.com/amannn/next-intl/blob/main/docs/src/pages/docs/workflows/typescript.mdx
- https://huggingface.co/Unbabel/wmt20-comet-qe-da
- https://huggingface.co/Unbabel/wmt22-comet-da
- https://huggingface.co/Unbabel/eamt22-cometinho-da
- https://huggingface.co/Unbabel/wmt22-cometkiwi-da

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
