# Korea Concierge Improvement Guide

Status: durable improvement playbook for `korea.avocadoss.co.kr`.

## Trigger

When the owner says things such as `개선해`, `알아서 개선해`, `수익성 개선`, `기능 개선`, `전환율 개선`, `SEO 개선`, `완성도 높여`, or an equivalent request, treat that as an instruction to use this guide before choosing work.

This file does not override a newer explicit owner instruction. It exists so future work starts from the same durable priorities instead of remembered chat context.

## Mandatory reading order

Before a meaningful improvement:

1. Read `AGENTS.md`.
2. Read this file.
3. Read `docs/BUILD_SPEC.md`.
4. Read the newest state in `docs/PROJECT_HANDOFF.md`.
5. Inspect the latest `main`, related open PRs, current CI/deploy evidence, and the exact files/tests affected.

Do not assume a previous chat, branch, screenshot, or old report is current.

## Improvement objective

Optimize the business as a measurable funnel, not as a feature count:

`qualified traffic -> useful free value -> trust -> product intent -> checkout readiness -> successful purchase -> delivery -> satisfied customer`

A change is valuable when it improves one of those transitions without weakening truth, reliability, privacy, margin, or user trust.

## Decision rule

Rank candidate improvements with this order:

1. Revenue or purchase-readiness impact.
2. User-value impact.
3. Evidence/confidence that the problem is real.
4. Effort and implementation risk.
5. Reversibility and ability to verify.

Prefer the smallest bounded vertical slice that can move a real metric or remove a real blocker. Avoid feature bloat, speculative redesign, and broad rewrites with no measurable business effect.

## Current priority stack

### P0 — Make the first paid SKU actually operable

The first commercial product is My Korea Look. Checkout must remain fail-closed until the complete paid path is trustworthy.

Prioritize, in order:

- durable order creation and idempotency;
- payment/webhook verification;
- ownership/entitlement state;
- private customer photo handling;
- generation/review/delivery lifecycle;
- one-revision entitlement and fulfillment rules;
- refund/support/admin visibility;
- observability for failed purchase/delivery states;
- production verification and rollback.

Do not open checkout merely because a landing page looks finished.

### P1 — Measure the pre-purchase funnel

The product already has full-value samples. Future improvements should make the path from sample consumption to purchase intent observable.

Track only truthful, privacy-safe events such as:

- style landing viewed;
- full sample opened;
- sample CTA clicked;
- purchase-intent CTA clicked;
- checkout unavailable because launch requirements are incomplete;
- checkout started when it is eventually authorized;
- checkout success/failure when payments are live.

Use these events to find the largest funnel leak before adding more features.

### P2 — Increase perceived value before asking for money

Prefer proof over hype:

- make complete example outputs easy to inspect;
- explain exactly what the customer receives;
- make the difference between free tools and the paid stylebook obvious;
- clarify turnaround/revision/privacy expectations only when operationally true;
- reduce uncertainty around photo requirements and deliverables;
- avoid unsupported urgency, fake scarcity, guarantees, or invented testimonials.

### P3 — Improve qualified acquisition

Prioritize search and content surfaces that lead naturally into the paid product or useful free tools.

Good acquisition work:

- high-intent Korea travel/style queries;
- destination-specific utility pages;
- multilingual pages with real value in all six locales;
- internal links that move users from useful free content to a relevant sample or product;
- structured data only when it matches visible truthful content.

Do not create thin page volume merely to increase indexed URLs.

### P4 — Improve unit economics and reliability

Before adding expensive AI calls, compare deterministic/cached/cheap-model approaches against actual quality requirements.

Watch:

- cost per generated stylebook;
- retry/failure cost;
- support burden;
- payment fees;
- model latency;
- unusable-generation rate;
- delivery failure rate;
- refund/revision rate once real orders exist.

The cheapest model is not automatically best; the correct target is highest contribution margin at acceptable quality.

## Guardrails

Never improve conversion by weakening truth.

Do not:

- fabricate reviews, ratings, scarcity, price comparisons, availability, or delivery promises;
- expose private photos or sensitive customer data;
- enable payment before fulfillment/ownership/refund boundaries are ready;
- remove regression guards just to make CI pass;
- claim production success without production verification;
- replace current source with an old branch or remembered implementation.

## Improvement-command execution protocol

When the owner gives a broad improvement instruction without naming a specific task:

1. Re-read the mandatory sources above.
2. Inspect current metrics/evidence if available.
3. Identify the highest-impact unblocked problem in P0-P4.
4. State the chosen problem briefly in the working update.
5. Implement one bounded vertical slice completely.
6. Add/repair tests or guards that prove the intended behavior.
7. Use the repository's branch/PR/CI/deploy rules.
8. Verify production for runtime-sensitive work.
9. Update durable handoff documentation when the operational state materially changes.
10. Continue to the next highest-impact unblocked item only if the owner delegated continued improvement.

## Definition of done

A runtime improvement is not complete because code exists. Completion requires the relevant combination of:

- implementation committed on the correct branch;
- regression coverage;
- required CI genuinely green;
- PR merged through the repository's normal process;
- production deployment when applicable;
- live verification of the changed behavior;
- no new truth/privacy/payment regressions;
- handoff/current-state documentation updated when material.

## Metric discipline

Do not claim conversion, SEO, revenue, or retention uplift without fresh evidence. If the required analytics are unavailable, explicitly label the change as a hypothesis and first improve measurement where practical.
