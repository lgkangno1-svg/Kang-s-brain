# Beta-wide completion pass — 2026-09-10

This pass intentionally improves the whole public beta surface instead of deepening one feature.

## User-facing

- Global shell now shows an explicit localized Beta badge.
- Desktop navigation is reduced to six product families: Explore, My Look, Personal Color, Hanbok, K-Culture and Quick Help.
- Saju and Naming remain available under K-Culture instead of consuming separate global-nav slots.
- Mobile bottom navigation is reduced from six items to five; Credits is removed from primary mobile navigation while paid checkout is intentionally disabled.
- Placeholder social marks are removed from the footer.
- A localized beta-feedback path points to the Contact surface.
- Homepage messaging now presents the site as a free beta rather than an ambiguous premium pre-launch.

## Release engineering

- New `check:beta-surface` contract verifies required public routes, recovery surfaces, trust pages, SEO files and primary shell links.
- `beta:verify` runs the complete existing quality suite, the beta-surface contract, production build and built-document language checks.
- GitHub-hosted fallback CI now runs the same broad beta verification rather than only i18n + raw `next build`.
- Free beta readiness is separated from paid-launch readiness. Dedicated auth/database/payment infrastructure is not a blocker for a free beta, but payment remains fail-closed.

## Next broad pass

After CI is green, prioritize cross-feature smoke QA, locale copy gaps, stale travel data, and first-screen/mobile usability before adding more depth to any single feature.
