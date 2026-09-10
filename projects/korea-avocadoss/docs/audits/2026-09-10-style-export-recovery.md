# My Korea Look free-plan export and storage recovery — 2026-09-10

## Source of truth

- `docs/PRD.md` designates `docs/BUILD_SPEC.md` as the active requirements source for this run.
- `LAUNCH_FUNCTIONAL_AUDIT.md` lists My Korea Look saved-result/export QA as an open launch-hardening item.

## Gaps closed by these bounded slices

The free `/style` experience generates a deterministic three-look plan and can save/restore bounded preference choices locally. Export recovery was hardened first: clipboard denial is reported truthfully and a browser-local UTF-8 text download remains available.

This follow-up storage-recovery slice closes another visitor-facing failure mode: browsers can deny or disable `localStorage` access (for example under privacy restrictions), and the previous save/clear handlers silently swallowed those exceptions while restore could misreport an access failure as “no saved choices.”

The current behavior now:

1. derives one `planText` artifact from the currently ranked three looks, including palette, recommendation reasons, location, trade-off, Korean rental request card and photo route;
2. treats unavailable/rejected Clipboard API access as a visible localized failure and keeps browser-local UTF-8 download as an independent recovery path;
3. surfaces local storage read/write/delete failures with actionable recovery guidance in all six P0 locales, explicitly directing visitors to keep using the current plan and copy/download it instead;
4. removes malformed JSON saved under the versioned key so a corrupted payload cannot poison repeated restores;
5. continues to reject and remove structurally invalid/stale saved-plan payloads before restoration;
6. keeps stored state bounded to style, garment, tone, priority and season only;
7. keeps export/save/recovery zero-API and discloses that exported files are generated locally;
8. keeps payment, Stripe, credits, merchant activation, remote photo processing and AI unchanged/fail-closed.

## Regression contract

`scripts/check-style-plan-recovery.mjs` checks truthful clipboard failure, current-result derivation, reasons in the exported artifact, local Blob download, temporary URL cleanup, assistive status messaging, local-export disclosure, corrupt saved-data cleanup, localized device-storage recovery guidance, explicit save/read/delete failure handling and the absence of network fetches.

## Remaining gap

This does not claim that all My Korea Look hardening is complete. Locale-native catalog/result prose remains an active gap. Private paid-result persistence remains behind the current payment/identity/external-account boundary and is not activated by this slice.

## Release evidence

Candidate exact-SHA CI, merge-SHA CI, production deployment and live `/en/style` smoke must be recorded only after those gates actually pass. This document is not deployment evidence.
