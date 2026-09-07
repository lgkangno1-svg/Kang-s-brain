# Korea Concierge

Mobile-first, multilingual Korea style and travel experiences for international visitors.

## Start here

**[Read the revenue-first BUILD_SPEC](docs/BUILD_SPEC.md)** before implementing or revising the product. It defines the first paid product **My Korea Look**, its visual results, customer journey, one-time purchase, order/fulfillment/recovery contract, privacy, implementation slices and acceptance criteria.

Then read [the newest handoff](docs/PROJECT_HANDOFF.md), [execution roadmap](docs/IMPLEMENTATION_ROADMAP.md), and fresh main/current code. [Documentation index](docs/README.md) separates current authority from historical references.

## Current source versus target

At the inspected source baseline `95fe720a4d05d41eda16684a4371f72c0c4d33d6`, the project has six-locale public pages, browser-local Personal Color, a free Hanbok matcher, palace/K-Culture content, Quick Help, and a gated Stripe foundation. The new paid stylebook, durable orders, fulfillment, and refund recovery are planned in BUILD_SPEC; this docs-only change does not implement or activate them.

First implementation slice: **three complete stylebook samples and their reusable visual renderer**, then the free-to-paid customer journey. Existing free functionality stays useful. A new credits wallet is not a prerequisite for the first one-time SKU.

## Development

Use the Node version in the current CI workflow (currently Node 22). In this project directory:

```text
npm ci --ignore-scripts --no-audit --no-fund
npm run dev
npm run build
```

`npm run build` includes the existing localization, Saju, Hanbok, payment, credit, responsive and route-recovery contracts. Inspect package.json before adding or running other checks. For runtime releases, use the existing private MiniPC exact-SHA CI/deployment flow; public GitHub-hosted CI remains manual fallback.

## Evidence and recovery

Production: <https://korea.avocadoss.co.kr>. Runtime status must be verified, not inferred from this README. Keep secrets and user photos out of code/logs/docs. Preserve concurrent user changes and any real customer entitlements.

[Previous project README](docs/archive/pre-revenue-first-2026-09-07/PROJECT_README.md) and older plans are archived for history; their old status and prices are not current authority.
