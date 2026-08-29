# Korea Concierge — Step-by-Step Implementation Roadmap

**Date:** 2026-08-29  
**Rule:** implement one reviewable slice at a time. Update `PROJECT_HANDOFF.md` in the same material run.

## Step 0 — Product baselines ✅
PRD, architecture, AI routing/cost, credit economics, SEO/AEO/GEO, discovery gate, international markets, security/token efficiency.

## Step 1 — Free Quick Help + market/locale registry ✅
0-credit, 0-AI, no external question transfer, P0 localized, keyboard/focus/ARIA hardened.

## Step 2 — Internationalized routing and language selector ✅
Completed P0 locales: `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`. Native localized Home/Culture/Gyeongbokgung/Personal Color/Hanbok/Credits, locale-preserving navigation, localized metadata, reciprocal hreflang + x-default, 36 canonical sitemap URLs, locale-correct document language, deterministic legacy 308 redirects, frozen lockfile/build verification, and retired shadowed legacy UI.

## Step 3 — K-Culture deterministic core — IN PROGRESS
- Saju calculation/input contracts: exact / approximate / unknown, IANA timezone/DST, Five Rats formula, element range bounds, provenance, PII stripping ✅
- Hanbok 3-Style Experience Lookbook (Princess/Prince, Queen/King, Royal) with 4:5 image frames and URL preset deep-links to Hanbok Matcher ✅

## Step 4 — Authoritative wallet & ledger ✅
Guest browsing, immutable ledger, atomic reserve/capture/release/refund, authorization boundaries.

## Step 5 — Stripe International Payment Foundation — CORE SHIPPED
- Primary provider: Stripe Checkout Sessions ✅
- Server-authoritative product catalog & price ID resolution (zero client amount injection) ✅
- Timing-safe HMAC-SHA256 webhook signature verification with replay tolerance ✅
- Zero PII in Stripe metadata ✅
- Localized `/checkout/success` order confirmation in 6 locales ✅
- Security & contract test suite: `scripts/check-stripe-payment-contracts.mjs` ✅

## Release gate for every material slice
1. fresh main/open PR/tree/handoff/roadmap inspection;
2. fresh production no-retry preflight;
3. isolated branch;
4. private `target-ref.txt` = exact 40-char branch head;
5. self-hosted MiniPC CI success;
6. merge only after green;
7. private `deploy-ref.txt` = exact merged SHA;
8. local origin + consecutive public Cloudflare checks;
9. full sitemap/P0 crawl before claiming production.
