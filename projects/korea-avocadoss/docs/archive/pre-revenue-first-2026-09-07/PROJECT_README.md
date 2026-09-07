# Korea Concierge

Rebuild target for `korea.avocadoss.co.kr`.

The product is a mobile-first international visitor website combining personal color guidance, Hanbok recommendations, Gyeongbokgung-area travel/food planning, a credit wallet, global-friendly payments, and a K-Culture Lab including Saju and zodiac experiences.

## Start here before development

Before changing this project:

1. inspect latest `main`, the project tree and recent commits because another AI/developer may have changed the repository;
2. read `docs/PROJECT_HANDOFF.md` for the current implementation position, intent, completed work, blockers and exact next slice;
3. follow `docs/IMPLEMENTATION_ROADMAP.md` in order;
4. re-check the relevant source-of-truth documents before material feature changes;
5. update `docs/PROJECT_HANDOFF.md` in the same run whenever implementation status, decisions, evidence/tests, blockers, risks, costs/security implications, user actions or the next step changes.

Do not restore an older remembered code state over newer work without first reconciling the latest repository state.

## Current status

- Product baselines complete
- Free deterministic Quick Help complete by static review: 0 credits, 0 AI API calls, no external sensitive-data transfer
- P0 internationalization foundation complete for English, Simplified Chinese, Japanese, Traditional Chinese, Vietnamese and Thai
- `next-intl@4.13.4` pinned and locale request/routing foundation established
- Locale-aware navigation and accessible language selector established
- Full P0 Quick Help tree localized with deterministic dictionary/key QA
- Locale landing copy localized and `/[locale]/culture` migrated to a native localized route
- Current roadmap position: **Step 2B-4** — native localized Gyeongbokgung discovery shell + localized metadata/mobile overflow review
- Clean production build has not yet been proven in the prior execution environment; production deployment is not claimed
- Production domain is **not switched yet**; the new site must pass production-readiness/staging checks first

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Production-oriented checks should include the project's i18n validation and real Next.js build. Do not upgrade a roadmap gate from static review to build-verified without actual executable evidence.

## Product routes

Legacy/unprefixed routes remain temporarily available during localization migration. P0 locale-prefixed routes are being migrated under `/en`, `/zh-CN`, `/ja`, `/zh-TW`, `/vi`, `/th`.

Core product areas include:

- home
- personal color
- Hanbok match
- Gyeongbokgung/local discovery
- K-Culture Lab / Saju
- credits / Trip Passes

## Product / engineering source documents

Read these before making material feature changes:

- `docs/PROJECT_HANDOFF.md` — **living cross-session/cross-AI handoff; read first and update every material development run**
- `docs/IMPLEMENTATION_ROADMAP.md` — ordered implementation plan and completion gates
- `docs/PRD.md` — product baseline
- `docs/ARCHITECTURE.md` — technical architecture
- `docs/AI_ROUTING.md` — OpenRouter model, privacy, fallback and cost routing
- `docs/CREDIT_ECONOMICS.md` — **current source of truth for credit packaging and margin rules**; supersedes older credit-pack hypotheses in PRD v1.0
- `docs/SEO_AEO_GEO.md` — search / answer / generative-engine requirements
- `docs/OPEN_SOURCE_DISCOVERY.md` — GitHub + Hugging Face discovery decisions
- `docs/INTERNATIONALIZATION_MARKETS.md` — locale/market priorities and evidence rules
- `docs/SECURITY_TOKEN_EFFICIENCY.md` — security, privacy and token/cost-efficiency requirements

The existing site should not be destructively replaced until the new build passes production-readiness checks and rollback is prepared.
