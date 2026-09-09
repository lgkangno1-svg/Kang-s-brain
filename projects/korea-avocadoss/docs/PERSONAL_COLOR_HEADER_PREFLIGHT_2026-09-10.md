# Personal Color header preflight — 2026-09-10

## PRD gap

`docs/PRD.md` designates `docs/BUILD_SPEC.md` as the active product requirements source. The launch audit still lists constrained-memory Personal Color QA as hardening. Before this slice, `validateColorUpload()` fully decoded a JPEG/PNG/WebP before enforcing the 36 MP pixel cap, so a photo that should be rejected could allocate a large bitmap first. Accepted photos were also decoded once during validation and again for analysis.

## Discovery gate

### GitHub

Fresh discovery reviewed maintained/reference implementations that read image dimensions from compressed metadata rather than decoding full pixels, including:

- `unjs/image-meta` — MIT, pure JavaScript, image type/size metadata extraction.
- `nodeca/probe-image-size` — MIT, designed to obtain dimensions while reading minimal image data.
- the `image-size` family — lightweight header-based dimension inspection.

These confirm the architecture pattern, but adding a package does not materially beat a narrow in-repository parser for the only accepted browser formats (JPEG, PNG, WebP). A dependency would expand supply-chain and bundle/maintenance surface for a small deterministic boundary.

### Hugging Face

The installed Hugging Face model-search action was attempted for image-dimension/browser metadata candidates and returned a `tool not found` connector error. This is recorded as an unavailable discovery endpoint, not as evidence that no models exist. ML inference is not justified for exact file-header dimensions in any case.

## Decision

Use a dependency-free, browser-local header preflight for JPEG SOF, PNG IHDR and WebP VP8/VP8L/VP8X dimensions. The existing 12 MB compressed-file cap bounds `arrayBuffer()` memory. Reject too-small or over-36-MP inputs before allocating a decoded bitmap. Only accepted photos proceed to the existing orientation-aware `createImageBitmap` / local `<img>` fallback analysis decoder.

This preserves:

- zero network/API calls;
- browser-local photo processing;
- existing MIME/byte/dimension/pixel limits;
- EXIF-orientation-aware analysis for accepted files;
- explicit decoder cleanup;
- no inference of race, ethnicity, nationality, health or attractiveness.

## Regression contract

`check-color-decode-recovery.mjs` requires header-first validation, JPEG/PNG/WebP parser coverage, no decode/network path in the preflight, continued orientation-aware resilient decode for analysis and resource cleanup.

## Remaining evidence

This slice reduces the code-level memory hazard but does not replace physical-device testing with rotated camera JPEGs and constrained-memory mobile browsers. Those remain launch-audit evidence items until executed on representative devices/fixtures.

Payment, Stripe, credits, account ownership and merchant behavior are unchanged and remain fail-closed.
