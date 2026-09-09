# Functional loop — Personal Color mobile camera memory hardening

Date: 2026-09-10
Candidate branch: `fix/korea-color-mobile-memory-20260910`
Active requirements: `docs/BUILD_SPEC.md` as designated by `docs/PRD.md`

## Gap selected

`LAUNCH_FUNCTIONAL_AUDIT.md` keeps Personal Color in HARDENING and specifically calls out camera-orientation and low-memory/device coverage. The existing browser-local flow validated a selected photo by decoding the original `File`, released that bitmap, retained the original full-resolution `File`, and decoded it again when analysis started. A valid upload could be as large as 36 MP.

## Bounded improvement

- Keep JPEG/PNG/WebP, 12 MB, minimum-dimension, and 36 MP safety validation.
- Explicitly apply browser-native `imageOrientation: 'from-image'` when decoding camera photos.
- Normalize the validated image in-browser to a maximum 1280 px longest edge while preserving aspect ratio.
- Re-encode into a browser-local Blob, which removes original file metadata from the retained working copy.
- Release the original full-resolution `ImageBitmap` immediately after normalization.
- Retain and preview only the bounded Blob; subsequent visible-tone analysis consumes that same bounded Blob.
- Keep the entire flow zero-API and preserve existing error/recovery, manual correction, and Personal Color → Hanbok handoff behavior.

This is a working-set and privacy hardening change, not a claim that every mobile camera/browser combination has now been fixture-tested.

## Regression guard

`scripts/check-color-photo-processing.mjs`, wired into `check:functionality`, requires:

- a 720–1600 px bounded working-image contract (implementation uses 1280 px);
- explicit camera-orientation handling;
- aspect-ratio-preserving local normalization;
- full-resolution bitmap release;
- normalized Blob use for both preview and analysis;
- no retention of the original selected `File` in scanner state;
- no network/AI call in photo preparation or visible-tone analysis.

## Discovery decision

A GitHub reference search did not identify a maintained dependency that materially improves this narrow browser-native normalization path. Hugging Face model/dataset discovery was attempted but the available connector returned disabled/not-found tool errors; no model is needed for the problem. Adding EXIF/CV/ML dependencies would increase bundle, supply-chain, privacy, and maintenance cost without improving the deterministic browser-native result, so this slice adds no dependency or model.

## Release status

Promotion remains blocked until the exact candidate SHA passes the private MiniPC CI gate, then the exact merged SHA passes again and the runtime-affecting release is deployed and publicly smoke-checked. Payment/Stripe/credits remain fail-closed and unchanged.
