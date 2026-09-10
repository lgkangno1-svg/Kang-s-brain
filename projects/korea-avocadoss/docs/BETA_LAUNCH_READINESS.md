# Korea Concierge — Free Beta Launch Readiness

Last updated: 2026-09-10

## Decision

The fastest safe path is to launch a **free public beta before paid checkout**. Do not hold the beta behind the dedicated database/payment stack. Paid launch remains a separate gate.

## Beta promise

The beta must let an international visitor complete useful end-to-end journeys without payment:

1. Land in one of the six P0 locales.
2. Find a clear next action from the homepage/navigation.
3. Use Personal Color, Hanbok matching, My Korea Look, Gyeongbokgung/nearby/food planning, Saju, Naming Studio, and Quick Help without dead ends.
4. Recover from invalid input or browser-local failures without losing the whole session.
5. See sources/freshness warnings for changing travel facts.
6. Understand that the site is a beta and that real checkout is not yet enabled.

## Required beta gate

A beta release candidate is acceptable only when all of the following pass:

- `npm run beta:verify` passes on the exact candidate SHA.
- Legacy redirects pass against a started production build.
- Six P0 locales build without message-key parity failures.
- Required public routes, loading/error/not-found surfaces, trust pages, robots and sitemap exist.
- Desktop navigation exposes the core product families without duplicate Saju/Naming clutter.
- Mobile bottom navigation is limited to five primary destinations; Credits is not a primary beta navigation item while checkout is disabled.
- Quick Help remains zero-API/zero-credit.
- Personal Color free path stays browser-local and has explicit consent/clear recovery.
- Travel/food/Hanbok facts expose source or freshness/verification behavior where applicable.
- Payment readiness checks remain fail-closed; no real-money checkout is enabled by the beta release.

## Beta launch blockers

These block the **free beta**:

- Production build or core contract failure.
- Broken primary route or unrecoverable client error on a core journey.
- Locale routing that strands users on an English-only or 404 path.
- Missing privacy/terms/contact surface.
- A payment path that can accept money before durable ownership/webhook/fulfillment gates are ready.
- A known privacy regression that uploads selfie/birth data unexpectedly.

## Not beta blockers

These should improve during beta but must not indefinitely delay first public feedback:

- Full native-editorial polish for every long result paragraph.
- Perfect walking-time calibration for every POI.
- Large Hanbok asset expansion.
- Paid result account persistence.
- Production payment provider onboarding.
- Advanced AI concierge features.
- Exhaustive real-device coverage beyond a representative smoke matrix.

## First beta feedback priorities

Measure or collect feedback on:

1. Can visitors understand what to do within the first screen?
2. Which free tool do they start and finish?
3. Where do they abandon a flow?
4. Do My Korea Look results feel useful enough to save/share?
5. Are travel routes and rental/food handoffs understandable on mobile?
6. Which locale has confusing or unnatural wording?
7. Which features create repeat visits or sharing intent?

## Paid launch remains separate

Do not interpret a successful free beta as permission to enable live payment. Real checkout still requires dedicated Korea Concierge auth/database ownership, durable order/event persistence, fulfillment/recovery, private result delivery, refund testing, and explicit production configuration.
