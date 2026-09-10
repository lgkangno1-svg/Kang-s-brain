# Saju Ten Gods + five-year depth discovery — 2026-09-10

## Source of truth

- Fresh main inspected at `961bdbcbf40374085d893d86c64fbca133550251`.
- `docs/PRD.md` still designates `docs/BUILD_SPEC.md` as the active requirements source.
- Owner direction prioritizes complete visitor-facing functionality before imagery or cosmetic redesign.
- Current audit marks Saju as HARDENING and calls for additional deterministic validation/depth rather than AI dependence.

## Discovery gate

GitHub discovery was performed before this material Saju subfeature revision.

- Search for `saju manseryeok four pillars typescript` returned `bunhine0452/k-saju` as a public implementation candidate. The existing Korea Concierge calendar engine is already deterministic and has its own boundary/timezone contracts; introducing another chart engine in this slice would create competing sources of truth without improving the specific interpretation gap.
- The previous Saju discovery remains relevant: `yhj1024/manseryeok`, `HwangChanho/syncfortune`, and `hoonsikim/saju` were evaluated in the immediately preceding functional Saju slice. Their useful architecture signal was to keep chart math separate from the interpretation layer.
- Hugging Face dataset and model search actions were attempted in this run. The connected endpoint returned server/tool availability errors (`dataset_search is disabled by server configuration`; `model_search not found`). No Hugging Face result is invented or adopted.

## Decision

Keep the existing zero-API deterministic calendar engine and add an auditable interpretation layer for the traditional Ten Gods relationship between the Day Master and visible heavenly stems. Extend future presentation to five consecutive annual stems while continuing to derive each year from explicit Five Elements and stem-polarity rules.

No model, dataset, package, network call, remote birth-data storage, CMS dependency, image generation, payment or credit flow is added.

## Product boundaries

- Ten Gods are displayed as symbolic traditional relationship categories, never as scores, probabilities or guaranteed events.
- Unknown birth time stays unknown; no hour pillar is fabricated.
- Name remains an optional display label and is excluded from Four Pillars mathematics.
- Five-year outlook text remains cultural/entertainment framing and explicitly excludes medical, legal, financial and investment advice.
- This slice covers visible heavenly stems only. Hidden-stem weighting, luck-pillar start-age conventions and broader historical manseryeok cross-validation remain separate deterministic validation/depth work.
