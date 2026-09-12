# Korea Concierge — Editorial Design Rebuild Brief

Date: 2026-09-13
Branch: `design/korea-editorial-rebuild-20260913`
Production reference: `https://korea.avocadoss.co.kr`

## Goal

Rebuild the customer-facing experience so Korea Concierge feels like a premium Korea travel styling product rather than a collection of utilities. Preserve current working functionality, multilingual coverage, privacy rules, payment fail-closed behavior, deterministic logic, existing verified content, and all user rights.

North-star promise:

> Discover the colors, Hanbok and palace experience that fit you.

The primary product story is **My Korea Look**. Personal Color, Hanbok matching, palace planning, rental-shop handoff and Korean request cards should feel like one connected journey. K-Culture/Saju and other discovery tools remain secondary exploration surfaces.

## Design direction

Name: **Contemporary Korean Editorial**

Visual character:

- premium Korean travel magazine + personal styling service;
- Hanji-inspired warm paper background, not generic white SaaS;
- ink-black typography, celadon/green secondary accents, restrained dancheong crimson and muted gold;
- large image-led editorial moments;
- serif display typography paired with a precise modern sans;
- thin borders, restrained radii, minimal shadow;
- generous whitespace and strong vertical rhythm;
- no generic bento grids, excessive pills, glassmorphism, neon gradients, dashboard aesthetics or decorative fake metrics;
- avoid repeating the same card grid section pattern through long pages.

Suggested tokens:

- Hanji Ivory: `#F6F1E8`
- Ink: `#191917`
- Celadon: `#73877B`
- Deep Korean Green: `#23483F`
- Dancheong Red: `#A8493D`
- Muted Gold: `#B89B67`
- Hairline: rgba(25,25,23,.16)

Typography direction:

- English display: Cormorant Garamond / DM Serif Display class
- Latin UI/body: Inter / Manrope class
- Korean serif fallback: Noto Serif KR class
- Korean/Asian UI fallback: Pretendard/Noto Sans CJK class
- Maintain reliable locale fallbacks for `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`.

Do not add a font dependency unless performance/licensing are acceptable. System/fallback typography is preferable to shipping a fragile design.

## Information architecture

Primary navigation should communicate outcomes, not internal feature inventory.

Desktop target:

- MY LOOK
- EXPLORE
- K-CULTURE
- SAVED (only if current saved functionality is real)
- LANGUAGE

Do not remove working routes. Navigation labels may map to existing routes/dropdowns.

Quick Help should become contextual/floating rather than compete as a top-level product card.

## Homepage rebuild

The current homepage should stop leading with six equal feature cards.

### Section 1 — Hero

Goal: one dominant action.

English copy direction:

- H1: `Your Korea, styled for you.`
- Body: `Discover the colors, Hanbok and palace experience that fit you.`
- Primary CTA: `Create My Korea Look`
- Supporting note: truthful beta/payment state only when necessary; do not let launch-infrastructure language dominate the hero.

Hero should be image-led. Prefer a rights-cleared or already-approved palace/Hanbok asset already in the project. Do not add unverified commercial-use imagery.

The next section should be visibly previewed below the fold on common laptop viewports.

### Section 2 — How it works

Three connected editorial steps, not three identical cards:

1. Find your colors
2. Find your Hanbok
3. Take it to Korea

Explain the actual existing functionality and link to working routes.

### Section 3 — Result preview

Show the value of a completed My Korea Look result before explaining more features.

Include only real fields currently supported by the product/spec, such as:

- style name;
- palette;
- Hanbok styling;
- palace/photo spot;
- Korean rental request card;
- route/visit guidance;
- saved sample link.

Reuse the complete public stylebook samples as proof instead of fabricated reviews or fake testimonials.

### Section 4 — Free tools

Personal Color and Hanbok free tools remain clearly free. Position them as useful entry points into the broader experience, not as six unrelated product tiles.

### Section 5 — Explore Korea

Gyeongbokgung/nearby food/rental content should feel like travel utility. K-Culture/Saju should appear as a separate discovery band, visually secondary to My Korea Look.

### Section 6 — Trust / privacy

Keep privacy statements concise on the homepage. Detailed photo/privacy explanation belongs at the point of photo input and in trust/privacy routes.

### Footer

Keep locale, trust, support, terms/privacy and ownership information accurate. No invented partnerships.

## Personal Color redesign

Do not change the deterministic browser-local analysis contract unless separately authorized.

UX goal: a guided sequence instead of a policy-heavy tool page.

Target flow:

1. Intro / benefit
2. Upload or supported manual path
3. concise privacy reassurance near upload
4. analysis state
5. result with palette + explanation
6. direct handoff to Hanbok matching

Long technical/privacy details should remain accessible but not dominate the first viewport.

No beauty scores, race/ethnicity inference, health inference, calibrated-probability claims or fake accuracy percentages.

## Hanbok redesign

Preserve existing matcher logic, rental finder, verified rental records, source/freshness information, Korean request card and route handoffs.

Restructure the experience as a progressive wizard/flow where possible:

1. mood/style
2. garment preference / comfort / coverage
3. destination / season / photo priority
4. recommendations
5. Korean shop request card
6. nearby rental handoff

Do not force all controls and all supporting content into the opening viewport.

Keep source/freshness metadata available but visually secondary.

## My Korea Look / Style Studio

This is the primary commercial surface.

Free preview should feel immediately useful and show the relationship between preference inputs and output.

Public samples must be easy to inspect before purchase intent.

Paid checkout must remain fail-closed until BUILD_SPEC operational requirements are actually satisfied. Do not activate Stripe/live payments or imply paid fulfillment is ready merely because the page is redesigned.

Do not remove current free value.

## Mobile rules

Mobile is not desktop shrunk down.

Test at least:

- 390px
- 430px
- 768px
- 1440px

Rules:

- 44px+ touch targets;
- no horizontal overflow;
- no desktop multi-column layouts blindly stacked without hierarchy review;
- primary CTA remains obvious;
- forms/wizards should show progress and one decision group at a time where practical;
- navigation should be simple; do not add dense icon chrome;
- long localized strings must wrap safely in all P0 locales.

## Implementation rules

1. Read `AGENTS.md`, `IMPROVEMENT_GUIDE.md`, `docs/BUILD_SPEC.md`, latest `docs/PROJECT_HANDOFF.md` before changing runtime code.
2. Preserve current working product logic unless the design change requires a small explicit adapter.
3. Do not restore archived product plans or old credit-wallet-first strategy.
4. Do not activate payments.
5. Do not fabricate partners, reviews, inventory, pricing, live availability or delivery promises.
6. Reuse real verified data and current public samples.
7. Build shared tokens/components before page-by-page overrides.
8. Reduce inline styles in customer-facing pages; move stable visual rules into the shared design system.
9. Avoid creating another parallel CSS patch layer unless necessary. Consolidate where safe.
10. Keep semantic HTML, keyboard access, focus states, contrast and reduced-motion support.

## Codex implementation sequence

### Phase A — Audit + design system

- inspect current production and current branch side by side;
- inventory all active CSS layers (`globals.css`, responsive files, Stitch files) and determine which rules are authoritative;
- identify duplicate/conflicting tokens;
- define one coherent design token layer;
- document what will be consolidated versus retained;
- no major route rewrite yet.

### Phase B — Homepage

- rebuild `/[locale]` first;
- preserve all real route links;
- replace six-equal-card hierarchy with the sections specified above;
- keep all six locales functional;
- validate responsive behavior and existing home-related contracts.

### Phase C — Style Studio

- rebuild `/[locale]/style` and public samples presentation;
- make sample proof and purchase-intent flow clear;
- preserve fail-closed checkout.

### Phase D — Personal Color

- improve hierarchy and guided flow only;
- preserve browser-local privacy and deterministic analysis.

### Phase E — Hanbok

- progressive disclosure/wizard structure;
- preserve deterministic matcher + rental shop + Korean request card + verified sources.

### Phase F — Explore / K-Culture

- align Gyeongbokgung, nearby, culture and help surfaces to the same editorial system.

### Phase G — QA

For every major phase:

- run relevant repo checks;
- run full `npm run build` before promotion;
- inspect desktop and mobile screenshots;
- compare against the intended design system;
- test all six locales for overflow;
- verify primary CTA routes and back-navigation;
- verify no payment/privacy functionality changed accidentally.

## Acceptance criteria

The redesign is not done merely because it builds.

A phase is acceptable only when:

- first viewport has one clear product story and one primary action;
- visual hierarchy is obvious without reading every paragraph;
- typography, image crops, spacing, borders and CTA treatments are consistent;
- no generic AI/SaaS visual filler was introduced;
- mobile looks intentionally designed;
- existing functional checks remain green;
- all six locales render without clipping/overflow;
- free vs paid value is truthful and understandable;
- public samples provide concrete proof;
- payment remains fail-closed until separately authorized;
- production changes are only called complete after the repository's required CI/deploy/live-verification process.

## Ready-to-paste Codex master instruction

Use this exact repository and branch. Do not create a new project.

> Work in `lgkangno1-svg/Kang-s-brain`, project root `projects/korea-avocadoss`, branch `design/korea-editorial-rebuild-20260913`. Read `AGENTS.md`, `IMPROVEMENT_GUIDE.md`, `docs/BUILD_SPEC.md`, latest `docs/PROJECT_HANDOFF.md`, and `docs/CODEX_DESIGN_REBUILD_2026-09-13.md` before editing. Your task is to transform the current customer-facing Korea Concierge UI into the `Contemporary Korean Editorial` design system described in the design brief while preserving all working functionality, all six P0 locales, privacy contracts, deterministic Personal Color/Hanbok logic, verified content provenance, and payment fail-closed behavior. Do not activate Stripe or live checkout. Do not fabricate partners, testimonials, availability, prices or product claims. Start with Phase A audit/design-system consolidation, then fully complete Phase B homepage before moving to Style Studio, Personal Color and Hanbok. For each phase, inspect the actual rendered app in a browser at 390, 430, 768 and 1440 widths, fix visible issues, and run the relevant tests plus `npm run build` before considering the phase complete. Prefer shared components/tokens over adding more ad-hoc inline styles or another patch CSS layer. Do not stop after coding: compare screenshots, fix typography/spacing/image-crop/responsive drift, and update `docs/PROJECT_HANDOFF.md` with only verified state. If production deployment requires the private exact-SHA CI path, prepare the candidate and report the exact SHA/PR; do not claim production completion without live verification.

## Recommended first Codex task

If the full master task is too broad, run this first:

> Complete only Phase A and Phase B from `docs/CODEX_DESIGN_REBUILD_2026-09-13.md`. Audit the active CSS hierarchy, consolidate a shared editorial token/component layer without breaking routes, then rebuild only `/[locale]` using the new hero → 3-step journey → real result/sample proof → free tools → explore/K-culture → trust/footer hierarchy. Preserve all six locales and all current route targets. Remove the current homepage's six-equal-card visual hierarchy and reduce infrastructure-heavy beta messaging so it does not dominate the customer value proposition, while remaining truthful about payment availability. Do not touch payment activation or backend product logic. Verify 390/430/768/1440 browser screenshots, `npm run check:i18n`, `npm run check:responsive`, `npm run check:beta-surface`, relevant functionality checks and finally `npm run build`. Commit only when the homepage is visually coherent and all required checks pass.
