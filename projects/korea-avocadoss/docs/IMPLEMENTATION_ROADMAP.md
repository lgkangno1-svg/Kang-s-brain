# Korea Concierge — Revenue-first Implementation Roadmap

**Updated:** 2026-09-07. Product decisions and acceptance details live only in [BUILD_SPEC.md](BUILD_SPEC.md).

| Slice | Deliverable | Status at this documentation change |
|---|---|---|
| S0 | Fresh source baseline and gap check | Source `95fe720a4d05d41eda16684a4371f72c0c4d33d6` inspected; refresh before implementation |
| S1 | 12-look catalog, three complete public stylebook samples, renderer/PDF | Not implemented by this change — next slice |
| S2 | Free style input/preview, localized sales journey and existing feature bridges | Not implemented |
| S3 | Email OTP, owner-bound orders, private storage/results | Not implemented |
| S4 | Real personalization, durable worker, revision, deletion and email recovery | Not implemented |
| S5 | One eligible provider, verified settlement, refund and test-mode E2E | Existing Stripe foundation only; full flow not implemented |
| S6 | Business/policies/live configuration, minimum QA and exact-SHA release | Not live-ready on the evidence of this docs change |
| S7 | First 20 independent paying customers and measured improvement | No revenue evidence claimed |

Start with S1 after refreshing S0. External provider setup may proceed independently. Do not make completion of Naming/Saju/live translation/Trip Passes or pixel-perfect old mockups a first-sale dependency. Existing free routes and six locales remain in scope for regression protection.

Record actual implementation/test/deploy evidence in [PROJECT_HANDOFF.md](PROJECT_HANDOFF.md); do not mark these rows done merely because a plan or UI placeholder exists.

[Previous roadmap — historical only](archive/pre-revenue-first-2026-09-07/IMPLEMENTATION_ROADMAP.md).
