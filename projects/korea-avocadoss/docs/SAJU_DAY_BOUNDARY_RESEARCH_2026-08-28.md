# Saju 23:00 / 00:00 / 01:00 Day-Boundary Research — 2026-08-28

## Decision
Korea Concierge will not present one late-Zi school as universal truth. The calculation contract exposes three explicit convention choices and keeps their behavior executable-tested.

| Policy | 23:00–23:59 displayed Day Pillar | 23:00–23:59 Hour-Pillar day-stem basis | 00:00 onward |
|---|---|---|---|
| `midnight` | supplied civil date | supplied civil date | caller has moved to next civil date |
| `jasi` | following day | following day | caller has moved to next civil date |
| `splitJasi` | supplied civil date | following day | caller has moved to next civil date |

All three use 子 for 23:00–00:59 and 丑 beginning at 01:00. The policy changes only the convention-dependent late-Zi date frame; it is not a complete calendar engine.

## Evidence adopted

### 6tail `lunar-java` — ADAPT, not authority
MIT-licensed and actively maintained. `EightChar.java` explicitly documents two schools: sect 2 treats late-Zi Day Pillar as the current day; sect 1 treats it as the following day. This is useful independent implementation evidence for the `jasi`/current-day distinction, but a library is not its own cultural authority.

Source: https://github.com/6tail/lunar-java/blob/master/src/main/java/com/nlf/calendar/EightChar.java

### Pillarwise deterministic date/hour atlas — ADAPT
The 2005-06-15 reference lists Day Pillar 庚午 and Zi-hour pillar 丙子 under its early-Zi civil reference, while explicitly acknowledging a late-Zi school that moves 23:00–24:00 to the next day. Its 2005-06-16 page independently lists the next civil Day Pillar as 辛未.

Sources:
- https://pillarwise.io/bazi-chart/2005/06/15/zi-hour
- https://pillarwise.io/bazi-chart/2005/06/16

### BaziInsight split behavior — ADAPT as corroboration
An unrelated implementation documents a midnight Day-Pillar rollover while the hour calculation reacts at 23:00. That is the exact distinction modeled by `splitJasi`: displayed Day Pillar stays on the civil date during late Zi, while the hour-stem basis advances.

Source: https://www.baziinsight.com/learn/bazi-day-boundary

## Trusted fixture sample
Reference adjacent dates:
- 2005-06-15 civil Day Pillar: 庚午
- 2005-06-16 civil Day Pillar: 辛未

At 23:00 on the first civil date:
- `midnight` → Day 庚午 / Hour 丙子
- `jasi` → Day 辛未 / Hour 戊子
- `splitJasi` → Day 庚午 / Hour 戊子

At 00:00 on 2005-06-16 all three converge to Day 辛未 / Hour 戊子. At 01:00 all converge to Day 辛未 / Hour 己丑.

The Hour Pillars are checked by the deterministic Five-Rat stem rule in `scripts/check-saju-day-boundary-policy.mjs`; they are not LLM-generated values.

## Discovery log
- GitHub: adopted 6tail's explicit sect semantics as implementation evidence; no runtime dependency added.
- Hugging Face: model-search invocation was unavailable in this environment, so no HF model/dataset evidence is claimed.
- Threads/web discussion search: no attributable primary-quality Threads evidence was found; community posts are not used as truth.
- Public web: Pillarwise and BaziInsight are treated as independent corroboration only, not official astronomy sources.

## Product implications
1. Beginner UX must describe the convention in plain language and show the alternative result when 23:00–23:59 is material.
2. No confidence percentage is attached to a school choice.
3. True-solar correction can move a recorded clock time across 23:00/01:00; that remains a separate pending fixture gate.
4. Unknown birth time never receives an inferred late-Zi policy outcome or invented hour pillar.
5. A future calculator dependency must reproduce these fixtures under the selected policy before adoption.
