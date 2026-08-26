# Korea Concierge — Open Source Discovery Log

This log records the mandatory GitHub + Hugging Face discovery pass performed before implementing or materially revising a feature. It is intentionally lightweight; candidates are re-checked when a feature is revisited.

## 2026-08-26 — Credit economy / AI cost metering

### GitHub candidates reviewed

#### OpenMeter — `openmeterio/openmeter`
- Purpose: real-time usage metering, billing, entitlements, prepaid credits and LLM cost tracking.
- License/maintenance: open-source project; active 2026 development/release activity observed.
- Useful patterns: immutable usage events, separate metering from billing, prepaid grants, feature entitlements, LLM token/cost dimensions.
- Decision: **pattern adopted; platform not integrated yet**.
- Why: Korea Concierge needs a small, auditable prepaid ledger first. Adding a full external billing/metering service during MVP would increase operational complexity without enough usage volume to justify it.
- Revisit when: usage volume, B2B merchant billing, subscriptions or multiple metered products make an external meter economical.
- Cost/latency impact: no runtime dependency added; zero incremental request latency.

#### Lago — `getlago/lago`
- Purpose: open-source metering/usage billing with prepaid credits and hybrid pricing.
- Useful patterns: prepaid funds reduce AI bad-debt risk; separate pricing configuration from payment execution; usage-event-driven charging.
- Decision: **pattern adopted; no dependency added**.
- Why: reinforces prepaid credits and configurable pricing, but is broader than launch needs.

### Hugging Face candidates reviewed

#### `Qwen/Qwen3-30B-A3B-Instruct-2507`
- License: Apache-2.0 on the Hugging Face model card.
- Architecture: 30.5B total / ~3.3B activated MoE, 262K native context, non-thinking instruction model.
- Decision: **retain as low-cost default text candidate through OpenRouter**, not self-hosted for MVP.
- Why: permissive model license and strong multilingual/instruction/tool capabilities; self-hosting the weight footprint would add GPU/ops cost that is unnecessary at current scale.
- Cost/latency impact: OpenRouter observed price on 2026-08-26 is substantially below premium frontier models; hard feature caps remain required.

#### DeepSeek V3.2
- Decision: **retain as escalation/reasoning candidate through OpenRouter**.
- Why: current OpenRouter route is inexpensive for multi-constraint reasoning, but more costly than Qwen Tier 1 and therefore not the default for simple copy.

### Implementation resulting from discovery

- Added `src/lib/credits/economics.ts` with centralized Basic / Advanced / Ultra pack configuration, feature credit prices, conservative cost assumptions and a margin-protection floor.
- Added `docs/CREDIT_ECONOMY.md` with cost accounting, p95 margin guardrails and repricing rules.
- Chose not to add OpenMeter/Lago dependencies during MVP; their event/ledger separation is incorporated into the architecture instead.

### Sources re-check

- GitHub: `openmeterio/openmeter`, `getlago/lago`
- Hugging Face: `Qwen/Qwen3-30B-A3B-Instruct-2507`
- OpenRouter model pricing pages for Qwen3 30B A3B Instruct 2507 and DeepSeek V3.2
