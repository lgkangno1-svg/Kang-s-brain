# Functional loop — Gyeongbokgung closure recovery

**Date:** 2026-09-09
**Baseline main:** `72d9b5a8011cfcfea8b57da6edf5cea3c55b25f3`
**Scope:** one non-payment functional reliability improvement in the local Gyeongbokgung itinerary journey.

## Gap

The planner already showed that Gyeongbokgung is normally closed on Tuesdays, but a visitor could still build the form state and—through stale/restored state—save or copy a timed Tuesday itinerary. That conflicts with the product rule that travel planning must not turn uncertain operating status into a usable-looking plan.

Official Royal Palaces and Tombs Center material confirms that the regular closure can move when a holiday opening applies, so the safe deterministic behavior is not to claim that every Tuesday is absolutely closed. Instead, the planner now fails closed for Tuesday itinerary generation until the visitor verifies the official notice and selects a confirmed open date.

Official verification entry point: https://royal.khs.go.kr/ROYAL/contents/R701000000.do

## Change

- derive one `closedDay` state from the selected visit date;
- disable normal route generation for an unverified Tuesday;
- refuse Tuesday save/copy actions rather than persisting a misleading itinerary;
- restoring a previously saved Tuesday plan now returns to the verification state instead of rendering route steps;
- keep the official palace information link visible for recovery;
- localize the fail-closed explanation across all six P0 locales;
- add a regression contract and wire it into `check:functionality`.

## Non-goals

No payment, Stripe, credits, merchant, AI/model, Hanbok asset-generation, or dependency changes. No claim of real-time palace status is introduced.

## Promotion rule

This slice must not reach `main` until the exact candidate SHA passes the private MiniPC CI gates. If merged, the exact merged SHA must be re-pinned and pass again before deploy-ref promotion. Runtime deployment additionally requires the existing MiniPC deploy workflow and public Cloudflare probes to pass.
