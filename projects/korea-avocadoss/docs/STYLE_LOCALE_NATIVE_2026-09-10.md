# My Korea Look — locale-native result slice (2026-09-10)

Source of truth: `docs/PRD.md` -> active `docs/BUILD_SPEC.md`.

## Gap closed
The six-locale `/style` flow previously localized headings and controls but still exposed many option values and generated recommendation explanations in English. This slice keeps the deterministic local ranking contract while making visitor-selected vocabulary and generated result guidance locale-native for `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, and `th`.

## User-visible behavior
- style, garment, palette, mood, comfort, coverage, season and destination options render with locale-specific labels;
- generated recommendation summary and three input-linked evidence lines are written in the active locale;
- practical trade-off and route freshness/real-time disclaimer are written in the active locale;
- copy/download preserves the same localized guidance;
- proper place names, licensed asset/source/creator/license facts, Korean shop card and map-stop names are not machine-invented or silently rewritten.

## Default three-look coverage recovery
Production deploy verification exposed a real default-flow defect: the default `standard` coverage selection was treated as exact equality even though the verified catalog had only two exact-standard records, so the page could not render the promised three-look result and correctly failed the public feature smoke.

Coverage is now interpreted as a minimum requirement. `standard` may include a verified more-covered look, while `more-coverage` remains a strict hard constraint and can never return a standard-coverage look. No catalog asset was reclassified and no synthetic look was added. The regression contract checks that both the default eligible catalog and the strict more-coverage subset can produce three verified results.

## Catalog display localization follow-up (2026-09-11)
A fresh PRD-vs-source audit found a remaining non-English leak in the result cards and exported text: curated English look titles, English palette names and raw kebab-case accessory IDs were still rendered directly.

The ranking result now applies a display-only locale overlay for the five non-English P0 locales:
- result names are deterministic locale-native style/garment/look labels rather than invented translations of the licensed catalog's editorial English title;
- palette display preserves the exact verified hex value while replacing English color prose with localized top/bottom/accent roles;
- known Korean cultural accessories use stable localized labels; unknown accessory IDs fail safely to a localized numbered accessory label rather than exposing an internal identifier;
- English keeps the original curated catalog wording unchanged;
- source URLs, creator, license, checked provenance, Korean rental request text, visual alt/source data and deterministic ranking facts are not changed.

This overlay is applied inside `rankStyleInputV1`, so the card UI plus copy/download paths receive the same localized display values without adding client fetches, AI calls, CMS reads or payment behavior.

## Architecture / cost
Ranking remains deterministic and browser-local. No network request, AI model, checkout, payment, remote photo processing, CMS call or new dependency is added. GitHub discovery did not identify a maintained dependency that materially improves deterministic localized-label rendering. The connected Hugging Face model-search endpoint returned `Tool model_search not found`; no model dependency is justified for curated labels/templates.

## Verification contract
`scripts/check-style-result-depth.mjs` requires `StyleConsultationV5`, six locale dictionaries, locale-native option vocabulary and localized result template functions while retaining source, shop-card, route, copy/download, storage recovery and zero-network/payment guards. It also requires the locale-aware catalog display overlay, exact source hex preservation and English source-wording preservation. `scripts/check-style-full-input.mjs` protects the minimum-coverage semantics and verified three-result catalog capacity.
