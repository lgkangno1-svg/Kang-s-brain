# Saju functional reading expansion — 2026-09-10

## Source of truth and priority

- Fresh `main` inspected at `ad4921bb57a3d84d2e023a0f0c51c4d1aaac1e78`.
- `docs/PRD.md` still designates `docs/BUILD_SPEC.md` as the active requirements source.
- Latest owner direction explicitly prioritizes completing core end-to-end functionality before image generation, visual redesign or cosmetic hardening.
- The prior `/culture/saju` experience calculated pillars/elements/zodiac but did not provide the visitor-facing future reading the owner expects from a Saju feature.

## Discovery gate

A major Saju revision triggered GitHub + Hugging Face discovery before implementation.

- `yhj1024/manseryeok`: maintained TypeScript Korean Four Pillars library, MIT, KASI-oriented calendar data, zero runtime dependencies and roughly 40 KB according to its current README. Korea Concierge already uses an adapted deterministic solar-term approach credited to this project, so adding another calendar dependency would duplicate the current core rather than improve this slice.
- `HwangChanho/syncfortune`: useful reference architecture separating deterministic chart math from an interpretation layer and exposing annual/monthly timelines. It is React Native-oriented and includes broader dependencies/features that are unnecessary for this web slice. No package was adopted.
- `hoonsikim/saju`: MIT public reference with a client-side Four Pillars engine and built-in rule-based reading fallback. This supports the zero-API rule-layer direction, but copying a second chart engine would create competing calculation sources. No package was adopted.
- Hugging Face discovery found `brandonrhie/korean-public-figures-saju` (CC BY-SA 4.0 dataset card; public-figure birth dates and computed Saju). It is designed for empirical research, not visitor interpretation. Using public-figure outcomes to predict an individual visitor's future would add questionable provenance and no necessary product value, so it was rejected.
- The connected Hugging Face model-search action returned a tool availability error during this run; public Hugging Face search evidence was used instead and no model was adopted.

Decision: keep the existing browser-local deterministic calendar engine, add a small auditable rule interpretation layer, and keep AI/API cost at zero.

## Functional gap closed by this slice

The new Saju flow keeps exact / rough / unknown birth-time handling and adds:

1. optional visitor name used only as a result label, explicitly excluded from Four Pillars math;
2. deterministic Day Master element and yin/yang polarity;
3. strongest/weakest Five Elements summary, explicitly marked partial when birth time is unresolved;
4. a localized core symbolic reading tied to the Day Master rather than generic random prose;
5. current-year and next-year outlooks derived from explicit Five Elements generation/control relations with the year's heavenly stem;
6. useful-focus and caution guidance for each annual outlook while avoiding guaranteed claims and financial/medical/legal advice;
7. copy and local UTF-8 text download recovery paths;
8. no persistence of raw birth details and no fetch/AI call;
9. six P0 locale shells and annual-reading text.

Unknown birth time remains unknown; the existing engine continues to omit the hour pillar and carry uncertainty instead of silently using noon or Seoul.

## Scope not claimed

This is a meaningful visitor-facing Saju reading, not a claim that the entire traditional Myeongri corpus is implemented. Ten Gods, hidden stems, luck-pillar start-age conventions, relationship structures and broader KASI/manseryeok historical cross-validation remain potential future depth work. They should be added only as deterministic, testable slices with clearly documented conventions.

Payment, credits, Stripe, CMS, remote birth-data storage and AI generation are unchanged and remain outside this slice.
