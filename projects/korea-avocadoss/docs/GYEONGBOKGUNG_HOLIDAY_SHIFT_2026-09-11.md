# Gyeongbokgung 2026 holiday-shift evidence — 2026-09-11

## Scope

This note records the bounded correction to the browser-local Gyeongbokgung route planner. It does not claim live opening status and does not replace the Royal Palaces and Tombs Center notice board.

## Primary-source rule

The Royal Palaces and Tombs Center has published holiday-opening notices explaining that, under the palace/tomb viewing rules, when a palace's regular closure is opened for a public holiday, the closure moves to the first following non-holiday. A 2025 Lunar New Year notice explicitly moved Gyeongbokgung's Tuesday closure from January 28 to Friday January 31 because the intervening dates were holidays. The 2025 Chuseok notice repeats the same first-non-holiday closure rule.

Sources checked 2026-09-11:

- Royal Palaces and Tombs Center holiday-opening notice: https://royal.khs.go.kr/ROYAL/contents/R403000000.do?id=20250114143712391964&page=1&schBdcode=all&schGroupCode=all&schM=view&viewCount=10
- Royal Palaces and Tombs Center Chuseok notice quoting the first-non-holiday rule: https://royal.khs.go.kr/ROYAL/contents/R403000000.do?id=20250924095500106191&page=1&schBdcode=all&schGroupCode=all&schM=view&viewCount=10
- Korea Customs Service 2026 national-holiday calendar: https://www.customs.go.kr/engportal/cm/cntnts/cntntsView.do?cntntsId=7401&mi=13284

## 2026 deterministic dates

The official 2026 holiday calendar places two Gyeongbokgung regular Tuesday closure dates inside public-holiday periods:

- 2026-02-17 (Tue), Seollal: treat as holiday-open for the planner; the first following non-holiday after the Feb 16-18 holiday block is 2026-02-19 (Thu), which the planner treats as the shifted closure.
- 2026-05-05 (Tue), Children's Day: treat as holiday-open for the planner; the next non-holiday is 2026-05-06 (Wed), which the planner treats as the shifted closure.

All other Tuesdays remain conservatively blocked unless a verified date-specific exception is added. The planner does not infer future-year holiday shifts from a generic calendar algorithm and does not claim live availability.

## Product behavior

`GyeongbokgungPlannerV2` now resolves closure through `isClosedDay()` rather than a raw weekday check. New and restored saved plans use the same rule so stale localStorage cannot bypass a shifted closure. The existing official-information link remains visible for visitors to verify current notices.

Regression coverage is part of `scripts/check-gyeongbokgung-map-handoff.mjs`, which now fails if the verified holiday-open Tuesdays, shifted closures, or restore-path revalidation are removed.

No payment, CMS, AI, photo-processing, account, or remote-routing behavior changed.
