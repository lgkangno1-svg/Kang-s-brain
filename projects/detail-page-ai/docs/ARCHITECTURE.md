# Detail Page AI — Architecture

## System boundary

The service is an asynchronous paid generation pipeline. The browser must never call the image provider with a secret key or receive proprietary master-prompt bodies.

## Target components

1. **Web UI** — order form, uploads, acknowledgement, payment, status, downloads.
2. **Application API** — validates order contract and creates immutable generation plan snapshots.
3. **Postgres** — durable orders/jobs/steps/cost/audit state.
4. **Private object storage** — original uploads, normalized references, generated assets, ZIP bundles.
5. **Generation worker** — server-side planning, reference selection, prompt orchestration, image generation, QA and retries.
6. **n8n watchdog** — detects stale/failed jobs and notifies operator; not the source of truth for job state.
7. **Provider adapters** — image provider and text planner are replaceable interfaces.

## Recommended first production topology

- Frontend/API: Next.js or equivalent server-capable web runtime.
- DB/storage: Supabase Postgres + private Storage or equivalent.
- Worker: Node 22 process on the always-on MiniPC.
- Watchdog: n8n periodic stale-job query and operator alert.
- Image: OpenAI GPT-Image-2 API.

The production deployment choice can change without changing the domain contracts in `src/`.

## Job state machine

`draft -> awaiting_payment -> queued -> preprocessing -> planning -> generating -> qa -> packaging -> complete`

Failure side states:

- `blocked_input`
- `failed_retryable`
- `failed_terminal`
- `cancelled`

Once payment is implemented, transition into `queued` is authorized only by a verified server-side payment event.

## Prompt/IP boundary

The public repository stores only prompt IDs and SHA-256 fingerprints. Exact prompt text lives server-side in a protected prompt registry. Worker logs record prompt ID/version, not full prompt bodies.

## Upload processing

- All files enter one customer-facing upload bucket.
- Server validates type/size/signature and stores privately.
- Classifier returns role, quality, product-identity score, utility score, evidence metadata and duplicate group.
- Reference selector chooses a small diverse subset.
- Page planner requests only page-relevant reference IDs.

## Fact model

Every extracted assertion should carry provenance:

- `confirmed_customer_text`
- `confirmed_upload`
- `safe_inference`
- `unverified`

Only confirmed/safe-inference material can enter generation, and safe inference cannot masquerade as a measured or product-specific fact.

## Cost ledger

Track at minimum:

- provider
- model
- request kind
- order ID
- asset/page ID
- input text tokens/cost where available
- input image tokens/cost where available
- output image tokens/cost where available
- retry number
- final success/failure

## Idempotency

- Order submission: idempotency key.
- Payment webhook: provider event ID unique constraint.
- Worker claim: atomic job lease.
- Per-page generation: deterministic page key + attempt number.
- Packaging: output manifest hash.

## Public-repo constraint

Do not commit:

- master prompt bodies
- API keys
- private customer samples
- production signed URLs
- raw certification/review uploads
