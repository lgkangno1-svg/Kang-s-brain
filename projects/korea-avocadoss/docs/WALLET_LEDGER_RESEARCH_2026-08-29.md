# Korea Concierge — Wallet / Credit Ledger Research Gate

**Date:** 2026-08-29  
**Scope:** server-authoritative credit ledger domain foundation before provider checkout/webhook integration

## Decision summary
Korea Concierge should **ADOPT reserve → capture / release, immutable append-only ledger entries, integer credit amounts, explicit idempotency keys and no-negative-balance invariants**. The first implementation is a provider/database-neutral TypeScript domain core with executable invariants; transactional persistence and payment/webhook integration remain the next layer.

No third-party runtime wallet package is added: the current application has no database/payment dependency yet and these invariants are small enough to remain auditable while persistence is selected.

## Sources and disposition

### Official Stripe documentation — ADOPT semantics, not provider lock-in
- Sources: https://docs.stripe.com/api-v2-overview and https://docs.stripe.com/error-low-level
- Adopt: every state-changing credit command has an explicit idempotency key; exact replay cannot duplicate side effects; reuse with a different fingerprint fails closed.
- Privacy/security: opaque operation references only; no PII is required in idempotency records.
- Multilingual/latency/bundle/inference cost: language-neutral, local deterministic processing, zero AI cost.

### PostgreSQL official documentation — ADOPT for future persistence
- Sources: https://www.postgresql.org/docs/current/ddl-constraints.html and https://www.postgresql.org/docs/19/explicit-locking.html
- Adopt later: unique idempotency constraints plus transactional row/account locking for conflicting wallet writes.
- Risk: deterministic lock order; do not keep database transactions open across slow external API calls.

### GitHub `mkmbhs/ledger` — ADAPT
- Source: https://github.com/mkmbhs/ledger
- License: MIT.
- Useful patterns: authorization holds, capture/void/expire, integer units, idempotent replay, available-versus-held balance, executable invariant/concurrency tests.
- Adapt into a compact TypeScript credit domain; reject runtime adoption because Go/PostgreSQL service surface is unnecessary for this Next.js slice.

### GitHub `wuliwong/token_ledger` — ADAPT
- Source: https://github.com/wuliwong/token_ledger
- License: MIT.
- Useful patterns: reserve/capture/release for external jobs, immutable history, integer units, external IDs/idempotency, database constraints and pessimistic locking.
- Adapt parent-linked capture/release/refund semantics; reject Ruby/Rails runtime adoption.

### Hugging Face — REJECT for this layer
Wallet/blockchain language models such as `ExponentialScience/LedgerBERT` and wallet tool-call models do not improve deterministic balance correctness, privacy, latency, bundle size or margin. Ledger state transitions require no ML inference.

### Public Threads / web discussions — NO ADOPTABLE EVIDENCE
Targeted public Threads/web discovery did not surface attributable implementation-grade guidance superior to official provider/database documentation and executable open-source ledger references. Community tips are not treated as authority here.

## Product fit
- **License:** no new runtime dependency.
- **Maintenance:** compact in-repo TypeScript core using existing TypeScript dev tooling.
- **Provenance:** official provider/database docs plus MIT pattern references.
- **Privacy:** opaque wallet/usage/payment references; no traveler profile data required.
- **Security:** browser success cannot grant credits. `grant` is only a domain boundary; later server authorization/webhook code must enforce it.
- **Multilingual:** language-neutral domain model.
- **Latency:** deterministic local transition only.
- **Bundle/compute/inference cost:** no new client dependency, no AI, zero inference cost.
- **Margin:** prevents double grants/charges and guarantees failed reserved jobs can release/refund credits.
- **Product quality:** supports a fixed visible credit price before expensive feature execution.

## Executable invariants
1. Credit amounts are positive safe integers.
2. Ledger entries are append-only; corrections are new release/refund entries.
3. `available`, `reserved`, `spent` never become negative.
4. `available + reserved + spent == total granted`.
5. Reserve cannot exceed available credits.
6. Capture/release cannot exceed remaining reservation.
7. Refund cannot exceed captured-unrefunded amount.
8. Same idempotency key + same request returns the original result with no new entry.
9. Same idempotency key + different request fails closed.
10. Capture usage ID must match its reservation.

## Next persistence gate
Before production money/credits, add a server-only persistence adapter with database transactions, unique idempotency constraints, authorization/account ownership, immutable rows, audit telemetry and concurrency tests. Then wire payment provider server create/capture, verified signed webhook, replay protection and refunds. Browser-reported success must never invoke credit grant authority directly.
