# Korea Concierge — Ponytail-style full functional audit

Date: 2026-09-13  
Production: `https://korea.avocadoss.co.kr`  
Requirements authority: `docs/PRD.md` → `docs/BUILD_SPEC.md`  
Audited `main`: `a30fc702951dae97b0b167dfe7f983654bc4ae0f`

## Audit method

This review uses the installed Product Design `audit` rubric and the repository's existing "Ponytail-style audit cleanup" convention. A separately named `ponytail` plugin/skill was not exposed in this Chat runtime, so this document does not claim that a hidden or unavailable workflow was executed.

Evidence was captured before conclusions:

1. Fresh `main`, PR queue, active specification and functional-audit documents were inspected.
2. The private MiniPC CI record was checked for the exact current `main` SHA.
3. The live production stability/sitemap/locale preflight was inspected.
4. A live browser journey was executed against production with screenshots/snapshots enabled. Payment and personal-photo upload were deliberately excluded.
5. Current payment gates and release/deploy provenance were checked separately.

Live browser evidence run: `https://agent.tinyfish.ai/runs/e8facf68-c95e-46db-b80b-adbcd61e2452`

## Overall verdict

**Free-beta core functionality: PASS.**  
**Fully finished product: NOT YET.**  
**Ready to enable payment: NO — intentionally blocked by product instruction and infrastructure gates.**

The important distinction is that the customer-facing free product is now materially functional end-to-end, while final device/accessibility hardening, release-provenance cleanup, a small queue of unmerged functional improvements, and later paid ownership/fulfillment infrastructure remain.

No P0/critical live functional failure was found in the tested free-beta journeys.

## Flow audit

| Step | Journey | Health | Evidence / result |
|---|---|---|---|
| 1 | Home, navigation, Quick Help | PASS | Header routes worked, six service entries were reachable, Quick Help opened/closed, footer/trust links were present, six P0 locales were exposed, and the page clearly stated `FREE BETA — PAID CHECKOUT OFF`. |
| 2 | Personal Color | PARTIAL | Consent/privacy boundary and scanner entry worked; browser-local/no-upload/no-sensitive-inference copy was clear. No personal image was uploaded during this audit, so live pixel-analysis output was not re-tested. Source contracts cover JPEG/PNG/WebP validation, decode fallback, EXIF-orientation fixtures, clear/revoke behavior and Hanbok handoff. Real rotated-camera/constrained-memory device evidence remains a hardening item. |
| 3 | Hanbok matcher + rental finder | PASS | Preference changes materially changed recommendations; save controls worked; rental finder was reachable; no live stock/booking claim was fabricated. Source/license and source-check boundaries remain explicit. |
| 4 | Saju | PASS | Synthetic `1990-05-15`, unknown birth time, `Asia/Seoul` generated an actual deterministic reading with useful-focus/watch-for, work, resources, relationships and pace sections plus five-year practical outlook. Uncertainty was disclosed; copy and download worked. |
| 5 | Korean Naming Studio | PASS | Vibe and sound changes generated six distinct candidates with Hangul, romanization, pronunciation, Hanja example and meaning theme; shortlist/save worked; legal-name/Hanja limitation was disclosed. |
| 6 | Gyeongbokgung planner | PASS | Date/time/duration generated a timed route; source-checked walking and official-visit guidance were visible; Food and Hanbok continuation links were reachable and carried planning context. |
| 7 | Nearby + Food/Cafe | PASS | Nearby route generation, category filters, saved-only behavior, source/freshness messaging and verification links worked. Stale/unknown facts are not silently promoted to live availability. |
| 8 | My Korea Look free preview | PASS | Style, garment, palette/mood, comfort, coverage, season and destination inputs materially affected the result. Preview included visual look, rationale, practical trade-off and Korean rental-request utility; copy/download/save/restore/rental links worked. Checkout remained unavailable and the product correctly stated that secure paid photo styling is not yet enabled. |
| 9 | Dead-end/error scan | PASS | No blank page, dead primary action, visible JS crash, broken core route or misleading live-payment claim was found in the tested English journey. |
| 10 | Six-locale route/index surface | PASS | Production preflight reports 19 sitemap URLs for each of `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`, correct language tags/canonicals and zero private sitemap leaks across the enumerated public routes. |
| 11 | Cross-locale interactive behavior | PARTIAL | Route-level evidence is strong, but the full click/input journey above was run in English. Native-language interactive and editorial QA is still needed for all P0 locales before a paid launch. |
| 12 | Mobile/accessibility | PARTIAL | Responsive/static contracts exist and prior browser QA covers 390×844 home/style no-horizontal-scroll. This audit does not establish WCAG conformance, screen-reader quality, 200% zoom behavior across every route, or real-device camera/memory behavior. |

## CI, build and release evidence

### PASS — exact-SHA MiniPC CI

Private CI currently records:

- `source_sha=a30fc702951dae97b0b167dfe7f983654bc4ae0f`
- `target_ref=main`
- `status=success`

This is the current public `main` SHA. The public fallback workflow is intentionally manual-only; absence of public commit checks is therefore not evidence of a failed build.

The project build gate is broad: i18n/content, Saju boundaries/timezones, culture, Personal Color recovery, Gyeongbokgung helpers/maps, Nearby/Food freshness, Hanbok visual/rental contracts, My Korea Look inputs/samples/revenue/destination contracts, database/payment fail-closed contracts, credits ledger, responsive and route-recovery checks, followed by a production Next.js build.

### PASS — live route stability

Private production preflight checked 2026-09-13 and reported:

- 12/12 stability attempts successful;
- root redirect to `/en` correct;
- sitemap `200` with 114 public URLs;
- 19 URLs for each P0 locale;
- three My Korea Look sample routes present per locale;
- no private sitemap leaks;
- enumerated public routes returned `200` with expected `html lang`, canonical present and legacy shell absent;
- `failures=0`.

### RELEASE GAP — deployed SHA provenance

The last explicit deploy diagnostic records production deployment success for:

`dc1d585ebf81b53ee3d0670bfcd6159d283dd875`

while current `main`/CI is:

`a30fc702951dae97b0b167dfe7f983654bc4ae0f`.

The live site itself is healthy and contains many modern functional surfaces, but the deployment diagnostic does not prove that production equals current `main`. Before calling the product fully released, expose or record the exact production source SHA after each successful deployment and make the deploy diagnostic match it.

## Functional strengths

1. **Deterministic/local-first architecture is now real product behavior, not only a plan.** Saju, Naming, Quick Help, major travel ranking and free styling behavior work without an LLM dependency.
2. **Personal Color has a defensible privacy boundary.** Photo processing is browser-local and requires explicit acknowledgement before scanner mounting.
3. **Travel data is conservative.** Checked-at/source provenance and re-check messaging avoid pretending static facts are live reservation/inventory data.
4. **My Korea Look has a coherent free funnel.** It demonstrates recommendation value without falsely claiming remote photo analysis or opening checkout.
5. **Failure/recovery thinking is unusually strong for a beta.** Copy/download fallbacks, local persistence, stale-data guards, source freshness and route recovery have dedicated contracts.
6. **Payment remains fail-closed.** `STRIPE_CHECKOUT_ENABLED`, ownership, fulfillment and webhook-persistence gates remain false, plus code-level readiness checks.

## Highest-impact remaining findings

### P1 — Production source provenance is not clean

**Impact:** release/debug confidence.  
**Finding:** latest exact-SHA CI is green, but deployment evidence points to an older SHA.  
**Fix:** every production promotion should update one canonical deployed-SHA record only after health checks pass; live preflight should print it so source ↔ runtime can be proven in one read.

### P1 — Personal Color needs representative real-device evidence

**Impact:** one of the main acquisition/personalization flows can still fail on device-specific image decoding or memory pressure.  
**Finding:** code/fixture protection is strong, but this audit intentionally did not upload a user's photo and cannot substitute for iOS/Android camera files.  
**Fix:** maintain a rights-safe non-personal rotated-camera fixture set and run current Safari/iOS + Chrome/Android decode/analyze/clear journeys, including a constrained-memory case.

### P1 — P0 language interactive QA is thinner than route QA

**Impact:** long Japanese/Vietnamese/Thai copy can create interaction/overflow/accessibility defects despite valid routes.  
**Fix:** repeat the core browser journey for all six P0 locales at desktop + narrow mobile, including form labels, validation, copy/download, local storage and keyboard flow.

### P1 — Open PR queue makes “finished” ambiguous

At audit time, current functional candidates still include:

- **#128** — public My Korea Look sample localization/accessibility/provenance: high-value candidate; verify and promote if clean.
- **#127** — Nearby route recovery around verified closures: high-value bug-recovery candidate; verify and promote if clean.
- **#126** — source-backed Food Finder station-proximity sorting/refresh: current high-value candidate; verify and promote if clean.
- **#124** — Personal Color/Hanbok → My Korea Look continuity: valuable but based on an earlier main; rebase/diff against current behavior before promotion.
- **#121** — Food Finder venue localization: valuable for P0 launch; rebase/diff before promotion.
- **#119** — stale Hanbok rental schedule fail-closed behavior: valuable safety candidate; rebase/diff before promotion.
- **#118** — integrated Hanbok + palace + food day planner: high product value but should be reconciled against current independent flows before promotion.
- **#117** — official-source freshness release guard: useful release gate; should supersede **#113** rather than both remaining open.

Likely stale/overlapping cleanup candidates after diff review:

- **#120** is superseded in intent by newer **#126**.
- **#113** is explicitly superseded by **#117**.
- **#85** describes palace entry/tour behavior already present in current main/live product; close if no unique diff remains.
- **#122** is a design-redesign proposal and should stay deferred while the current instruction is functionality-first.

Optional enhancements rather than completion blockers: #108, #109, #110.

## Accessibility / UX audit notes

The tested live flow had clear labels, state feedback and working primary actions, but this is **not a WCAG conformance audit**. Remaining evidence should cover:

- keyboard-only completion of Saju, Naming, Palace, Food/Nearby and My Korea Look;
- visible focus and logical tab order in all P0 locales;
- 200% desktop zoom and 320–390 px screens across every core route;
- screen-reader naming for upload, save/shortlist, disclosure, result changes and expandable rental/request sections;
- announcements for dynamically regenerated recommendations and error/recovery states;
- touch targets and fixed bottom navigation/Quick Help interaction on iOS safe areas.

## Payment boundary

Payment was deliberately excluded from this audit and should remain disabled per the current product instruction.

Before real money can open, BUILD_SPEC still requires dedicated Korea Auth/DB, owner-bound order creation, durable/idempotent payment events, private result/version/PDF persistence, retryable fulfillment, revision accounting, cancellation/refund recovery and test-mode E2E. None of those requirements should be weakened merely because the free beta now passes its functional journey.

## Completion call

### What can be called complete now

- Core **free-beta** customer journeys are operational.
- Saju and Naming are real functions, not placeholders.
- Personal Color privacy/scanner entry, Hanbok recommendation/rental discovery, Gyeongbokgung/Nearby/Food planning and My Korea Look free preview are usable.
- Latest `main` passes the private MiniPC exact-SHA verification gate.
- Public six-locale route/sitemap/canonical health is green.

### What cannot be called complete yet

- production == latest-main provenance;
- representative real-device Personal Color QA;
- six-locale full interactive/mobile/accessibility evidence;
- final reconciliation of the high-value open functional PRs;
- paid ownership/fulfillment/payment stack (intentionally deferred).

**Final audit decision: `FREE BETA FUNCTIONAL PASS / PRODUCT HARDENING REQUIRED / PAYMENT NOT READY`.**
