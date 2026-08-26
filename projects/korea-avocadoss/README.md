# Korea Concierge

Rebuild target for `korea.avocadoss.co.kr`.

The product is a mobile-first international visitor website combining personal color guidance, Hanbok recommendations, Gyeongbokgung-area travel/food planning, a credit wallet, global-friendly payments, and a K-Culture Lab including Saju and zodiac experiences.

## Current status

- PRD v1.0 complete
- Next.js application shell scaffolded
- Product routes scaffolded
- Credit/payment architecture documented
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
- `/credits` — credit wallet / top-up

See `docs/PRD.md` and `docs/ARCHITECTURE.md` before adding features.
