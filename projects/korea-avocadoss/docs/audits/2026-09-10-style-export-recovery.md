# My Korea Look free-plan export recovery — 2026-09-10

## Source of truth

- `docs/PRD.md` designates `docs/BUILD_SPEC.md` as the active requirements source for this run.
- `LAUNCH_FUNCTIONAL_AUDIT.md` lists My Korea Look saved-result/export QA as an open launch-hardening item.

## Gap closed by this slice

The free `/style` experience already generated a deterministic three-look plan and could save/restore bounded preference choices locally. Its copy action, however, used optional clipboard access in a way that could report success when the Clipboard API was unavailable, and there was no independent offline export path when copying was blocked.

This slice:

1. derives one `planText` artifact from the currently ranked three looks, including palette, recommendation reasons, location, trade-off, Korean rental request card, and photo route;
2. treats an unavailable or rejected Clipboard API as a visible localized failure instead of a false success;
3. adds a browser-local UTF-8 text download as the recovery path;
4. revokes the temporary object URL and removes the transient anchor after download;
5. keeps export/save/recovery zero-API and discloses that exported files are generated locally;
6. keeps payment, Stripe, credits, merchant activation, remote photo processing and AI unchanged/fail-closed.

## Regression contract

`scripts/check-style-plan-recovery.mjs` now checks truthful clipboard failure, current-result derivation, reasons in the exported artifact, local Blob download, temporary URL cleanup, assistive status messaging, local-export disclosure and the absence of network fetches.

## Remaining gap

This does not claim that all My Korea Look hardening is complete. Locale-native catalog/result prose and private paid-result persistence remain separate active gaps, and paid flows remain blocked by the current payment boundary and external prerequisites.

## Release evidence

Candidate exact-SHA CI, merge-SHA CI, production deployment and live `/en/style` smoke must be recorded only after those gates actually pass. This document is not deployment evidence.
