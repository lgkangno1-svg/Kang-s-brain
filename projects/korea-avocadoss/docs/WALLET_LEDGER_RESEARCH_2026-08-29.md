# Korea Concierge — Wallet / Credit Ledger Research Gate

**Date:** 2026-08-29  
**Scope:** server-authoritative credit ledger domain foundation before provider checkout/webhook integration

## Decision summary

Korea Concierge should **ADOPT the reserve → capture / release lifecycle, immutable append-only ledger entries, integer credit amounts, explicit idempotency keys, and no-negative-available-balance invariants**. The first implementation is a provider/database-neutral TypeScript domain core with executable invariants; PostgreSQL persistence and provider webhook integration remain the next layer.

This slice deliberately avoids runtime adoption of a third-party wallet package. The current application has no database/payment dependency yet, and the core invariants are small enough to keep auditable and dependency-free while the storage contract is still being selected.

## Sources and disposition

### Official Stripe documentation — ADOPT semantics, not provider lock-in
- Source: https://docs.stripe.com/api-v2-overview and https://docs.stripe.com/error-low-level
- Evidence used: write operations need idempotent retry semantics because network failures and retries are normal; repeated use of one idempotency key must not duplicate side effects.
- Adopt: explicit idempotency key on every state-changing credit command and conflict detection when the same key is reused with a different request fingerprint.
- Privacy/security: no PII required in the idempotency record; use opaque operation references.
- Multilingual fit: language-neutral.
- Latency/bundle/inference cost: no model or client bundle cost.

### PostgreSQL official documentation — ADOPT for future persistence layer
- Source: https://www.postgresql.org/docs/current/ddl-constraints.html and https://www.postgresql.org/docs/19/explicit-locking.html
- Evidence used: unique constraints provide a database backstop for duplicate keys; row-level locking can serialize conflicting account writes inside transactions.
- Adopt later: unique idempotency constraint plus transactional row/account locking when the persistence adapter lands.
- Security/maintenance: mature upstream database semantics; no application runtime package required for this domain slice.
- Risk: locking order must be deterministic to avoid deadlocks; transactions must not span slow external API calls.

### GitHub `mkmbhs/ledger` — ADAPT
- Source: https://github.com/mkmbhs/ledger
- License: MIT.
- Useful pattern: authorization holds, capture/void/expire, integer units, idempotent replay, available-versus-held balance, executable concurrency/invariant tests.
- Adapt: mirror the lifecycle and invariants in a small TypeScript credit domain rather than importing a Go/PostgreSQL implementation.
- Reject runtime adoption: language/runtime mismatch and unnecessary operational surface for the current Next.js app.
- Maintenance/provenance: public source with explicit MIT license; treated as pattern evidence, not authority.

### GitHub `wuliwong/token_ledger` — ADAPT
- Source: https://github.com/wuliwong/token_ledger
- License: MIT.
- Useful pattern: reserve/capture/release for external API jobs, immutable transaction history, integer token units, external IDs for idempotency, database constraints and pessimistic locking.
- Adapt: parent-link capture/release/refund entries and integer credits.
- Reject runtime adoption: Ruby/Rails dependency does not fit this codebase.

### Hugging Face search — REJECT for this layer
Search surfaced wallet/blockchain language models such as `ExponentialScience/LedgerBERT` and unrelated wallet tool-call models. None improves deterministic balance correctness, idempotency, privacy, latency, bundle size or margin for a credit ledger. No model is needed for ledger state transitions.

### Public Threads / web discussion search — NO ADOPTABLE EVIDENCE
A targeted public Threads search did not surface attributable, implementation-grade guidance superior to official payment/database documentation and executable open-source ledger references. Community advice is therefore not used as an implementation authority for this slice.

## Product fit

- **License:** no new runtime dependency added.
- **Maintenance:** compact in-repo TypeScript core, executable with existing TypeScript dev dependency.
- **Provenance:** official provider/database docs + MIT reference implementations.
- **Privacy:** wallet state needs opaque wallet/usage/payment references, not raw traveler profile data.
- **Security:** browser success cannot grant credits; `grant` is a trusted-server command boundary and later persistence/webhook code must enforce that boundary.
- **Multilingual:** ledger is language-neutral; customer-visible labels remain in i18n.
- **Latency:** local deterministic state transition only.
- **Bundle/compute:** no AI or new package.
- **Inference cost:** zero.
- **Margin:** prevents double grants/double charges and guarantees failed reserved feature work can release/refund credits.
- **Product quality:** enables the paid MVP to safely show a fixed credit price before an expensive feature call.

## Invariants for the implementation

1. Credit amounts are positive safe integers.
2. Ledger entries are append-only; corrections are new release/refund entries.
3. `available`, `reserved`, and `spent` buckets never become negative.
4. `available + reserved + spent == total granted`.
5. Reserve cannot exceed available credits.
6. Capture/release cannot exceed the remaining reservation.
7. Refund cannot exceed the unrefunded captured amount.
8. Same idempotency key + same request returns the original result without a new entry.
9. Same idempotency key + different request fails closed.
10. A capture must match the usage ID of its reservation.

## Next persistence gate

Before production money/credits, implement a server-only persistence adapter with database transactions, unique idempotency constraints, authorization/account ownership, immutable rows, audit telemetry, and concurrency tests. Then wire payment provider server create/capture + verified signed webhook + replay protection. Browser-reported success must never call `grant` directly.
