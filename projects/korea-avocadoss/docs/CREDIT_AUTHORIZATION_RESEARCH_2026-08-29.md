# Credit Authorization Boundary Research — 2026-08-29

## Scope
Fresh discovery for the next sellable-MVP wallet slice: account ownership, trusted server actors and denial of browser authority before transactional persistence/payment integration.

## Official sources

### PostgreSQL transaction/locking semantics — ADOPT for upcoming persistence slice
- PostgreSQL transaction isolation: https://www.postgresql.org/docs/current/transaction-iso.html
- PostgreSQL explicit row locking: https://www.postgresql.org/docs/current/explicit-locking.html

Reasoning: future reserve/capture/release/refund persistence should serialize competing mutations for one wallet with a deterministic lock order and transaction boundary. `SELECT ... FOR UPDATE` is appropriate for a persisted wallet/ownership row; unique constraints remain the durable idempotency backstop. This slice does not add a database driver yet, so no runtime PostgreSQL claim is made.

### Stripe idempotency guidance — ADAPT
- Stripe idempotent requests: https://docs.stripe.com/api/idempotent_requests

Reasoning: retain the existing same-key/same-request replay and same-key/different-request fail-closed contract. Provider idempotency does not replace our own wallet-domain idempotency or webhook replay protection.

## GitHub discovery
Searches were run for TypeScript credit/wallet ledgers and reserve/capture/release/idempotency patterns. No newly discovered repository improved on the already documented candidates in `WALLET_LEDGER_RESEARCH_2026-08-29.md` enough to justify a runtime dependency. **REJECT new dependency for this slice** because the needed authorization boundary is small, auditable and deterministic.

## Hugging Face discovery
A fresh public search for wallet/ledger transaction models produced no implementation-grade candidate relevant to deterministic financial/credit authorization. **REJECT model use**: authorization and balance authority must be deterministic server logic, not inference.

## Public Threads/web discussion discovery
A fresh public search was attempted. No attributable Threads discussion supplied implementation-grade evidence stronger than official database/payment documentation. Community advice is therefore not adopted as authority.

## Product/security decision
**ADOPT** a narrow authorization layer in front of the already shipped ledger domain:
- account actors may reserve only their own wallet;
- verified-payment grants require a `payment_webhook` system actor;
- promotional grants require a `promotion_service` system actor;
- admin grants require a `support_admin` system actor;
- capture/release/refund require `feature_executor` or `support_admin` system authority;
- every system actor carries a non-empty audit identifier;
- browser/account state can never grant, capture, release or refund credits directly.

## Trade-offs
- License: no new dependency/license surface.
- Maintenance: small typed local module and executable invariant checks.
- Provenance: based on existing domain invariants plus official PostgreSQL/payment principles.
- Privacy: only opaque account/wallet/audit identifiers; no profile/PII payload.
- Security: fail-closed role mapping and owner checks; no client grant authority.
- Multilingual fit: language-neutral domain logic.
- Latency/bundle: negligible; no network/model call.
- Inference/API cost: zero.
- Margin: no incremental runtime cost.
- Product quality: directly closes a security gap required before real paid credits.

## Deferred
Transactional persistence, database uniqueness/row locking, authentication session verification, signed provider webhooks, replay tables and monetary refund/reversal remain separate gates. This authorization module must not be presented as a complete payment system.
