# Detail Page AI — Project Handoff

**Last updated:** 2026-08-30 KST

## Product goal

Launch a 24/7 fully automated food-category detail-page generation service. Customer-facing production type is sales-conversion only; internal prompt routing is hidden.

## Locked business decisions

- Categories: fruit / vegetable / meat / seafood / processed food.
- Trial: KRW 9,900, thumbnail 1 + body 8, Medium.
- Standard: KRW 14,900, thumbnails 2 + body 10–12, High.
- No premium tier.
- No SmartStore/Coupang purpose selector.
- No customer-facing master-prompt/production-method selector.
- Specification and sale price are optional. If blank, omit them entirely.
- One upload area. AI classifies and uses materials automatically.
- Real uploaded product material outranks generated appearance.
- Required pre-order disclosure: in-image Korean/number/text typos or distortion can occur; direct correction is difficult; regeneration may be needed and perfect correction is not guaranteed.
- Human production is not part of the operating model.

## Master prompt sources

Exact prompt bodies are intentionally excluded from this public repository.

- `유튜브 그대로 상페 (1).txt` -> direct conversion master
- `TED 상페- 고객님 정보요청.txt` -> internal Q1-Q10 scaffold
- `마스터프롬프트 개선버전.txt` -> TED/Golden Circle V3 production master

Fingerprints are stored in `prompts/README.md`.

## Current implementation

Bootstrap domain layer added:

- Plan/option catalog
- Body-count decision
- Order normalization and required disclosure acceptance
- Blank specification/price omission rules
- Hidden prompt-route decision contract
- Diverse customer-reference selector
- Customer-first prompt context/precedence
- GPT-Image-2 provider-neutral request contract
- Unit tests

## Next implementation priorities

1. Build responsive customer order form from the exact schema.
2. Add single-bucket multi-file upload with client-side previews only; classification remains server-side.
3. Add persistent DB/storage/job schema.
4. Add protected prompt registry loader with fingerprint verification.
5. Add upload classifier and evidence extractor.
6. Add generation planner and page manifest.
7. Add GPT-Image-2 adapter and usage ledger.
8. Add automated QA/retry.
9. Add ZIP packaging/download.
10. Add payment only after the generation path can pass synthetic end-to-end tests without spending real money unintentionally.

## Safety / regression rules

- Always inspect latest GitHub main/PR/branches before modifying this project.
- Never publish the proprietary prompt bodies in this public repo.
- Never infer a missing price/spec/origin/certification/test result.
- Never let prompt defaults override customer choice.
- Never regenerate successful pages just because one page failed.
- Never claim perfect in-image Korean text correction.
- No real charge should authorize generation before verified payment-webhook handling exists.

## Verification target for current bootstrap

Run:

```bash
cd projects/detail-page-ai
npm run check
npm test
```
