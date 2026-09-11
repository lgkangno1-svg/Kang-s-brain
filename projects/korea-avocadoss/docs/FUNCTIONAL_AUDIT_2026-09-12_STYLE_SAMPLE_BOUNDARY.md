# Functional audit — My Korea Look public sample boundary (2026-09-12)

Active requirements: `docs/PRD.md` → `docs/BUILD_SPEC.md`.

Source baseline inspected: `c8941787b867f287e34fab0ec0dbdd420cb17642`.

## Gap

The public My Korea Look sample fixtures and sample renderer conflicted with the active first-SKU contract in two material ways:

1. Two samples modeled couples/multiple adults even though `my_korea_look_v1` is explicitly one adult and the first version must not collect or imply multi-person fulfillment.
2. The public renderer described the sample as the depth already “provided to paid clients” and used a `$12` paid-start CTA even though account ownership, private persistence, durable fulfillment/refund infrastructure and merchant eligibility remain blocked. BUILD_SPEC requires checkout to remain unavailable until those gates are verified.

The route also used wording that could be read as live crowd/inventory certainty (for example instant matched fitting and crowd-avoidance sequencing) without evidence.

## Bounded repair

- All three public personas now represent one fictitious adult.
- Shop-card examples request a similar direction and explicitly ask staff to confirm actual availability and extra charges; they do not promise inventory.
- The public banner identifies the result as a planned-product demonstration and states that paid checkout/private delivery are unavailable until production gates are verified.
- USD 12 is labeled as a planned launch price, not an active checkout offer.
- The CTA leads only to the working free preference-based preview.
- The itinerary is labeled a planning example rather than live routing/crowd information.
- A build-gated regression contract rejects reintroduction of multi-adult v1 personas or unavailable paid claims.

## Unchanged boundaries

No payment flag, Stripe/provider logic, account/auth, database, remote photo processing, AI/model, CMS, entitlement, refund or fulfillment behavior is activated by this slice. Checkout remains fail-closed.

## Release evidence required

Do not call this production-complete until the exact candidate SHA passes private MiniPC CI, the merged SHA is re-verified, the exact green main SHA is deployed, and the affected public sample route passes the normal production Cloudflare smoke gate.
