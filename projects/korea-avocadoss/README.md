# Korea Concierge

Rebuild target for `korea.avocadoss.co.kr`.

The product is a mobile-first international visitor website combining personal color guidance, Hanbok recommendations, Gyeongbokgung-area travel/food planning, a credit wallet, global-friendly payments, and a K-Culture Lab including Saju and zodiac experiences.

## Current status

- PRD v1.0 complete
- Next.js application shell scaffolded
- Product routes scaffolded
- OpenRouter AI routing policy documented
- SEO / AEO / GEO operating standard documented
- One-time Basic / Advanced / Ultra Trip Pass credit economy implemented as a launch hypothesis
- Open-source discovery log established for GitHub + Hugging Face reviews
- Production domain is **not switched yet**; the new site must pass staging QA first

## Local development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Product routes

- `/` — home
- `/color` — personal color
- `/hanbok` — Hanbok match
- `/explore/gyeongbokgung` — local guide
- `/culture` — K-Culture Lab
- `/credits` — credit wallet / Trip Passes

## Product / engineering source documents

Read these before making material feature changes:

- `docs/PRD.md` — product baseline
- `docs/ARCHITECTURE.md` — technical architecture
- `docs/AI_ROUTING.md` — OpenRouter model and privacy routing
- `docs/CREDIT_ECONOMICS.md` — **current source of truth for credit packaging and margin rules**; supersedes older credit-pack hypotheses in PRD v1.0
- `docs/SEO_AEO_GEO.md` — search / answer / generative-engine requirements
- `docs/OPEN_SOURCE_DISCOVERY.md` — GitHub + Hugging Face discovery decisions

The existing site should not be destructively replaced until the new build passes production-readiness checks and rollback is prepared.
