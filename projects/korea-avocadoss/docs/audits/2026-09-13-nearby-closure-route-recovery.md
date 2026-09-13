# Nearby Explorer — closed-stop route recovery audit

Date: 2026-09-13
Base main SHA: `a30fc702951dae97b0b167dfe7f983654bc4ae0f`
Candidate branch: `feat/korea-nearby-freshness-20260913`

## Problem

Nearby Explorer already omitted source-verified closures before building a route. The `easy` 2–3 hour path is ordered `Gwanghwamun Square → Gwanghwamun Tourist Information Center → Insadong`. On a verified information-center closure date, the center was correctly skipped, but the route core then tried to continue from Gwanghwamun Square to Insadong without a calibrated direct walking leg. Because missing legs intentionally fail closed, the valid remainder of the itinerary was stranded at Gwanghwamun Square.

The walking-leg table also contained the same `Gwanghwamun Square → Tourist Information Center` entry twice.

## Change

- Added one source-traceable `Gwanghwamun Square → Insadong` walking leg at a conservative 15 minutes, using the same current route reference already used for the adjacent visitor-area path.
- Kept the normal `Tourist Information Center → Insadong` leg unchanged for open days.
- Removed the duplicate `Gwanghwamun Square → Tourist Information Center` calibration record.
- Preserved the existing sequence: source-verified closed stops are skipped first, then the next candidate resolves its walking leg from the last stop actually added.
- Preserved fail-closed behavior for genuinely unknown walking pairs; no duration is invented.
- Added `check-nearby-closure-route-recovery.mjs` to the main `check:functionality` gate so the fallback leg, provenance text, normal leg, duplicate rejection, and zero-API/zero-AI invariants regress together.

## User effect

A visitor choosing a date when the optional Gwanghwamun Tourist Information Center is known closed can still receive the remaining source-backed Gwanghwamun → Insadong route when it fits the selected time budget, instead of receiving an unnecessarily truncated itinerary.

## Boundaries

This is deterministic itinerary recovery, not live routing. Walking time remains a planning estimate and the UI continues to hand off to provider-native walking directions for current conditions. No real-time opening, inventory, reservation, price, accessibility or traffic claim is added. Payment, account, ownership, Stripe and AI behavior are unchanged and remain fail-closed where already gated.

## Verification status

The new regression contract is wired into `npm run check:functionality`. This document does not claim a successful exact-SHA MiniPC build, merge, deployment or live-browser verification until those separate checks are observed.
