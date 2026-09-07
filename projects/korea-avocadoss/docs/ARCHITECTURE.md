# Korea Concierge — Architecture entry point

The current architecture contract is **[BUILD_SPEC.md](BUILD_SPEC.md), sections 7–15**: extend the current Next.js/next-intl app, use authenticated owner-bound orders and product entitlements, durable provider events/jobs, verified payments, one successful revision, private results and bounded photo retention.

Default persistence/auth when no existing approved backend is available: Supabase PostgreSQL/Auth/private Storage. Implement one eligible payment provider. Do not build a new wallet or general provider framework before the first product can be sold.

[Previous architecture — historical only](archive/pre-revenue-first-2026-09-07/ARCHITECTURE.md).
