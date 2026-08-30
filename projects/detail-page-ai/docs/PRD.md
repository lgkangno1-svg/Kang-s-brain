# Detail Page AI — Product Requirements Document

**Status:** Bootstrap / implementation source of truth  
**Last updated:** 2026-08-30 KST  
**Project path:** `projects/detail-page-ai`  
**Customer-facing product type:** sales-conversion detail-page generation only

## 1. Product vision

Build a 24/7 fully automated Korean ecommerce detail-page generation service for food sellers. A customer should be able to submit minimal product information and arbitrary product-related uploads, pay for a plan, and receive a complete image bundle without human production work.

The service is not a prompt marketplace. Customers do not choose internal prompt engines or marketplaces. The service decides how to plan and render each order while always honoring customer-provided facts, materials, and style choices first.

## 2. Target categories

Only these categories are in MVP scope:

- Fruit
- Vegetable
- Meat
- Seafood
- Processed food

Other categories are rejected or queued for future support rather than forced through food-specific logic.

## 3. Plans

### Trial — KRW 9,900

- Thumbnail: 1
- Body images: exactly 8
- Total images: 9
- Image quality: Medium
- Reference selection budget: up to 3 strong/diverse customer uploads
- Automatic retry budget: 1 retry per failed asset
- Purpose: low-friction first purchase and quality trial

### Standard — KRW 14,900

- Thumbnails: 2
- Body images: 10–12
- Body count chosen automatically from information density and available verified material
- Total images: 12–14
- Image quality: High
- Reference selection budget: up to 6 strong/diverse customer uploads
- Automatic retry budget: up to 2 retries per failed asset
- Purpose: main production-quality package

No premium tier in MVP.

## 4. Customer order form

The form should be short. Customers should not be forced to classify their uploads or answer a long strategy questionnaire.

### Required

1. Plan: Trial / Standard
2. Product name
3. Category
4. Free-form product description
5. Main visual style
   - Male model
   - Female model
   - Farm/documentary feel
   - Product-centered
   - Premium studio
6. Model-shot count: 0 / 2 / 4 / 6
7. Overall tone
   - White
   - Beige
   - Black
   - Natural green
   - Luxury dark
8. Copy mood
   - Emotional
   - Professional
   - Trust-led
   - Sales-led
   - Gift-led
9. Information density
   - Simple
   - Standard
   - Rich
10. Highlight points (multi-select)
   - Freshness
   - Price
   - Origin
   - Taste
   - Nutrition/health information
   - Gift
   - Bulk
   - Value
11. Thumbnail style
   - Strong sales
   - Emotional
   - Premium
   - Information-led
12. Acceptance of AI image-text typo risk disclosure

### Optional

- Product composition/specification
- Sale price
- Must-include information
- Must-exclude wording/information
- Arbitrary uploads

### Omission behavior

If specification is blank, do not mention specification and do not render placeholders such as `[specification required]`.

If sale price is blank, do not show or infer price. Do not search the web for a similar product price and do not create value claims that depend on a nonexistent price.

The same omission rule applies to origin, certifications, test results, ratings, sales counts, reviews, shipping method, health efficacy, and any other unconfirmed factual claim.

When a sales axis lacks evidence, replace that section with another supported buying reason rather than exposing an internal missing-information marker to the customer.

## 5. Upload experience

There is one upload area only.

Customer copy:

> 가지고 있는 상품 사진이나 자료를 자유롭게 올려주세요. AI가 내용을 분석해 필요한 곳에 자동으로 활용합니다.

The customer does not classify files as product image, package image, certificate, review, farm image, etc.

The system classifies and ranks uploads internally.

### Candidate internal roles

- Product full shot
- Product close-up
- Cross-section / texture
- Packaging
- Delivery/unboxing
- Farm/origin scene
- Proof/certificate/test document
- Review capture
- Design reference
- Unknown

### Product Ground Truth

Uploaded real product imagery is the highest-priority visual ground truth. The generator may improve background, lighting, framing, props, surrounding context, and layout, but must not casually redesign the real product, package, label, color, shape, proportions, cultivar traits, or other identity-bearing details.

### Reference selection

Do not send every upload to every generation call.

- Remove unusable and near-duplicate material.
- Score clarity, product identity, usefulness, and role.
- Select role-diverse references.
- Trial: normally up to 3 references.
- Standard: normally up to 6 references.
- Each page should receive only the references relevant to that page.

This is both a quality and cost-control rule.

## 6. Internal prompt orchestration

The customer does not choose a production method. Every output is a sales-conversion detail page.

The system may choose one of two hidden internal routes.

### Route A — Direct conversion master

Source supplied by product owner: `유튜브 그대로 상페 (1).txt`.

Use when the product is relatively simple, the input is sparse, or there is insufficient differentiated proof/story to justify a deeper Golden Circle sequence.

Any interactive confirmation step inside the source prompt is auto-approved in unattended production. The customer must not be blocked waiting for prompt-level approval.

### Route B — TED auto-fill → Master V3

Sources supplied by product owner:

1. `TED 상페- 고객님 정보요청.txt`
2. `마스터프롬프트 개선버전.txt`

The system automatically infers/fills Q1–Q10 from customer input and uploaded material, classifies each assertion as confirmed/safe inference/unverified, then injects the safe result into Master V3.

Use when the order contains meaningful differentiated facts, objective proof, brand principles, process evidence, or enough material to benefit from a deeper Why/How/What structure.

Customers never see or choose the route.

### Proprietary prompt protection

Exact master prompt bodies must not be committed to this public repository or returned to the browser. They are loaded server-side from a private prompt store/protected deployment volume/secret. Prompt fingerprints are tracked in `prompts/README.md` so deployments can verify the intended versions without publishing prompt IP.

## 7. Customer-first precedence

Conflicts are resolved in this exact order:

1. Uploaded real-product ground truth and objective evidence
2. Customer-confirmed text
3. Customer-selected visual/copy options
4. Purchased plan contract
5. Safe inference
6. Master-prompt defaults
7. Internal style randomization

Examples:

- Master says white background, customer selects black → black wins.
- Master says minimum 3 model shots, customer selects 0 → 0 wins.
- AI imagines red packaging, uploaded package is green → green uploaded package wins.

## 8. Variety without customer complexity

To reduce look-alike outputs without exposing dozens of controls, the system uses hidden style variation after customer choices are locked.

Possible internal dimensions:

- Hero composition family
- Crop/camera family
- Section order within supported persuasion logic
- Information-card treatment
- Typography composition
- CTA composition
- Background surface/texture
- Icon/infographic density
- Lifestyle scene choice

Randomization must never override customer choices or product truth. Use deterministic order-seeded variation so retries can reproduce a design family instead of drifting unpredictably.

## 9. Image generation model

Production target: OpenAI `gpt-image-2` through the API.

Rationale as of 2026-08-30: OpenAI documents GPT-Image-2 as its state-of-the-art image generation/editing model and notes support for high-fidelity image inputs. The provider layer must remain replaceable so quality/cost benchmarks can be rerun later.

Plan mapping:

- Trial → `quality=medium`
- Standard → `quality=high`

Do not use a consumer ChatGPT/Codex session as the unattended commercial backend. Production must use an API/provider path with explicit metering, retry control, concurrency limits, and auditable job state.

## 10. AI-generated text typo disclosure

This is a required pre-order acknowledgement.

Customer-visible disclosure:

> **AI 이미지 내 문구 오탈자 안내**  
> AI 이미지 생성 특성상 이미지 안의 한글·숫자·문구에 오탈자, 글자 깨짐 또는 왜곡이 발생할 수 있습니다. 이미지 내부에 생성된 글자는 일반 문서의 텍스트처럼 직접 수정하기 어려워 일부 결과는 이미지 재생성이 필요할 수 있으며, 재생성을 하더라도 완벽한 오탈자 교정을 보장할 수 없습니다.

Requirements:

- Show before order/payment completion.
- Require explicit acknowledgement.
- Store the disclosure version accepted by the customer.
- Run automated visual/text QA and retry obvious failures within plan limits, but never advertise a guarantee of perfect in-image Korean text.
- Do not hide this limitation in a footer-only legal page.

## 11. Factual safety

Never invent or present as fact:

- Origin
- Composition/weight/count
- Price
- Certification
- Test results
- Sugar/Brix or other measured values
- Ratings
- Review counts
- Sales counts
- Reorder proof
- Medical/health efficacy
- Shipping method
- Exclusive/No.1 claims

Safe category-level inference may be used only when it does not become a fabricated product claim.

If actual review screenshots/data are supplied, use them faithfully. If not supplied, do not manufacture fake customer identities, fake ratings, or fake purchase counts.

## 12. Automated generation pipeline

1. Receive order form and uploads.
2. Validate required acknowledgement and fixed plan contract.
3. Normalize blank optional fields to `null` and mark them omitted.
4. Store uploads privately and strip unsafe metadata where appropriate.
5. Classify uploads and detect near-duplicates.
6. Extract confirmed facts/evidence.
7. Select the internal prompt route.
8. Build a customer-first prompt context.
9. Generate the page architecture and copy.
10. Run semantic/factual audit before image spend.
11. Select page-specific reference material.
12. Generate thumbnails/body images using the plan quality.
13. Run automated image QA:
    - Generation failure
    - Product identity drift
    - Severe text corruption/obvious typo risk
    - Duplicate/near-duplicate pages
    - Missing required customer information
    - Forbidden wording
14. Retry only failed assets within plan limits.
15. Upload final assets.
16. Produce ordered ZIP plus individual downloads.
17. Mark job complete and expose result page.

## 13. 24/7 architecture target

Recommended production split:

- Web app: responsive customer order/status/download UI
- API: order validation, signed upload, payment state, job state
- Database: orders, jobs, upload metadata, generation steps, outputs, disclosure version, cost ledger
- Private object storage: customer uploads and outputs
- Generation worker: long-running Node worker on MiniPC or equivalent always-on runtime
- n8n/watchdog: stale-job detection, retry escalation, operator notifications
- Image provider: OpenAI GPT-Image-2 adapter
- Text/planning provider: replaceable low-cost model adapter after benchmark

Payment provider is deliberately not locked in this bootstrap. No paid generation job may start until a verified payment event exists once payment is implemented.

## 14. Cost controls

- Hard output-count limits from the purchased plan.
- Hard retry caps per asset.
- Reference selection instead of attaching every upload to every call.
- Separate planning/fact audit from expensive image generation.
- Generate only pages that passed factual/semantic preflight.
- Re-render only failed pages, not the whole order.
- Record provider usage/cost per job and per asset.
- Add daily/monthly spend guardrails before public launch.

## 15. Security and privacy

- Never expose API keys or proprietary master prompt bodies to client code.
- Validate MIME type and file signature; reject unsupported executable/archive content in MVP.
- Use signed/private object URLs, not public buckets for customer uploads.
- Avoid logging raw customer uploads or sensitive extracted text unnecessarily.
- Define retention/deletion policy before public launch.
- Do not send customer files to providers not required for the selected processing step.

## 16. MVP acceptance criteria

The first functional MVP is accepted when:

1. A customer can submit the final short order form.
2. Blank specification/price are truly omitted from prompt context and output architecture.
3. Required typo disclosure cannot be bypassed.
4. Customer uploads enter one bucket and are internally classified/selected.
5. The internal route is chosen without customer involvement.
6. Customer choice overrides conflicting prompt defaults.
7. Trial always produces 1 thumbnail + 8 body targets at Medium.
8. Standard produces 2 thumbnails + 10–12 body targets at High.
9. Failed assets retry without regenerating successful assets.
10. No unconfirmed claim is promoted into a customer-facing fact.
11. Result assets are ordered and downloadable as individual files and ZIP.
12. Job and provider cost state are auditable.

## 17. Delivery roadmap

### Phase 0 — Foundation (current)

- PRD
- Order schema
- Plan contracts
- Disclosure contract
- Prompt route contract
- Reference selector
- Provider-neutral image request contract
- Unit tests

### Phase 1 — Web intake

- Responsive order form
- Upload UX
- Validation
- Order preview/summary
- Status page shell

### Phase 2 — Durable backend

- Database schema
- Private storage
- Job queue/worker protocol
- Prompt registry
- Upload classifier
- Cost ledger

### Phase 3 — Generation integration

- GPT-Image-2 adapter
- Text planning adapter
- Q1–Q10 auto-fill pipeline
- Architecture/copy audit
- Page-by-page image generation
- Retry/QC

### Phase 4 — Commerce

- Payment integration
- Webhook verification/idempotency
- Paid-job authorization boundary
- Refund/cancellation policy implementation after business policy is approved

### Phase 5 — Production

- Result ZIP/downloads
- Observability
- n8n watchdog/alerts
- Rate limiting/abuse protection
- Retention/deletion controls
- Production smoke tests
- Cost and conversion dashboard

## 18. Out of scope for initial MVP

- Customer-facing choice between SmartStore/Coupang modes
- Customer-facing choice between master prompts
- Premium tier
- Manual designer production
- Guaranteed perfect Korean text rendering inside AI images
- Fabricated reviews, ratings, sales counts, certifications, or measured claims
- Unlimited revisions/retries
