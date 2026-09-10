# Gyeongbokgung visit-helper functional audit — 2026-09-11

Active requirements remain `docs/BUILD_SPEC.md` through `docs/PRD.md`.

This bounded slice closes the visitor-facing gap between the deterministic palace itinerary and source-backed entry/tour constraints:

- seasonal opening and last-admission times are represented as versioned local facts with direct Royal Palaces and Tombs Center source links and `checkedAt=2026-09-10`;
- regular Tuesday closure is derived from the selected ISO date, while public-holiday exceptions fail closed to an explicit official-verification warning instead of fabricated availability;
- regular English, Japanese and Chinese guided-tour slots are exposed with six-locale visitor copy, meeting-point/duration/group caveats and a copyable visit note;
- the helper adds no AI, geolocation or runtime content fetch dependency;
- `check-gyeongbokgung-visit-helper.mjs` is part of `check:functionality` and protects seasonal cutoffs, foreign-language slots, Tuesday recovery, P0 copy, provenance links and the zero-network invariant;
- the previously registered agent-browser workflow now has its missing journey script on this candidate, covering live interactive Saju, Naming, palace planning, My Korea Look, Hanbok, Food, Nearby and mobile horizontal-overflow checks. Payment routes remain intentionally excluded.

Candidate branch: `feat/korea-palace-qa-reconcile-20260911`.
Candidate SHA at audit creation: `057fa8fdcd5233082282c0efae877be80aae1ab1`.

Do not call this production-complete until exact-SHA MiniPC CI passes, the merged SHA is re-verified, deployment succeeds and the public palace route is smoke-tested.
