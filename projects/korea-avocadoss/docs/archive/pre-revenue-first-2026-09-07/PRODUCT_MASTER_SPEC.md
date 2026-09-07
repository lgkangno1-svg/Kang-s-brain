# Korea Concierge — Product Master Spec

**역할:** 제품 목적·기획·개발·개선 판단의 최상위 기준서  
**대상:** ChatGPT / Codex / OpenCode / Stitch / 인간 개발자·리뷰어  
**저장소:** `lgkangno1-svg/Kang-s-brain`  
**프로젝트 루트:** `projects/korea-avocadoss`  
**운영 CI:** private `lgkangno1-svg/korea-concierge-ci`  
**최초 작성:** 2026-08-28

> 이 문서는 Korea Concierge의 **왜 만드는지, 누구를 위해 만드는지, 무엇을 먼저 완성해야 하는지, 어떤 개선이 좋은 개선인지**를 결정하는 장기 기준서다. 모든 material feature/UX/architecture/AI/payment/SEO 변경은 작업 전에 이 문서를 읽고 의도와 충돌하는지 확인한다.

---

## 0. 문서 사용 계약

이 문서의 역할은 `PRODUCT INTENT / NORTH STAR / IMPROVEMENT CRITERIA`다.

- `PRODUCT_MASTER_SPEC.md` — 제품 목적, 사업 방향, 고객 가치, 기능 우선순위, 개발·개선 원칙의 기준
- `PROJECT_HANDOFF.md` — 지금 실제로 어디까지 구현·검증·배포됐는지의 최신 인수인계
- `IMPLEMENTATION_ROADMAP.md` — 현재 구현 순서와 남은 단계
- private `korea-concierge-ci` incident/diagnostics — **production reliability의 최신 사실**
- 코드와 executable tests — 실제 동작의 최종 사실

충돌 시 우선순위:

1. 최신 사용자 명시 지시와 production safety/security
2. 실제 production/CI 증거
3. 이 `PRODUCT_MASTER_SPEC.md`
4. `PROJECT_HANDOFF.md` / `IMPLEMENTATION_ROADMAP.md`
5. 오래된 PRD·연구문서·과거 대화 요약

이 문서는 정적 기획서가 아니다. 제품 방향이 실제로 바뀌면 같은 material run에서 업데이트한다. 단, 현재 상태·SHA·일시 같은 휘발 정보는 handoff/private CI에 두고 이 문서에는 장기 원칙 위주로 남긴다.

---

## 1. 최종 목표

Korea Concierge는 **한국을 방문하는 외국인이 자신에게 맞는 한국 경험을 쉽고 빠르게 선택하도록 돕는 모바일 중심 개인화 서비스**다.

핵심 질문은 하나다.

> “지금 한국에서 나에게 무엇이 어울리고, 무엇을 입고, 어디를 가고, 무엇을 먹고, 어떤 한국 문화 경험을 해보면 좋을까?”

일반 여행 사이트처럼 “인기 있는 것”만 나열하는 것이 아니라, 사용자의 명시적 취향·시간·위치·여행 목적·문화 관심사를 바탕으로 **왜 이 선택이 맞는지 설명하고 바로 행동할 수 있게 만드는 것**이 차별점이다.

장기적으로는 여행 정보 사이트가 아니라 다음을 연결하는 **Korea personalization commerce layer**가 목표다.

- 개인 스타일
- 한복
- 퍼스널컬러
- K-Culture
- 사주/띠/별자리/타로/데일리 운세
- 여행 동선
- 음식/카페/장소
- 실시간 번역/컨시어지
- 로컬 업체/체험
- 프리미엄 Naming Studio

---

## 2. 첫 고객과 확장 방향

### 2.1 첫 고객

한국을 여행하는 외국인, 특히 모바일을 중심으로 여행하는 개인·커플·친구·가족 여행객.

첫 지역은 경복궁·광화문·서촌·북촌·안국을 깊게 다룬다. 얕게 전국을 덮기보다 첫 지역에서 실제로 유용하고 돈을 낼 만한 경험을 완성한 뒤 확장한다.

확장 후보:

- 인사동
- 명동
- 홍대
- 성수
- 강남
- 부산
- 제주
- 경주

### 2.2 언어/시장

P0:

- English `en`
- Simplified Chinese `zh-CN`
- Japanese `ja`
- Traditional Chinese `zh-TW`
- Vietnamese `vi`
- Thai `th`

P1:

- Indonesian
- Malay

향후 수요가 검증되면 기타 주요 관광 시장을 추가한다.

번역만 하는 것이 아니라 **외국인 사용 방식 자체를 현지화**한다. 예를 들어 출생 시각을 정확히 모르는 사용자가 많다는 전제에서 exact / approximate / unknown을 정상 입력 상태로 제공한다.

명시적 사용자 선택이 언제나 추정보다 우선한다. 언어·이름·사진·목소리로 국적/인종/민감 특성을 추론하지 않는다.

---

## 3. 사용자가 30초 안에 느껴야 하는 가치

사이트를 처음 열었을 때 사용자는 다음을 바로 이해해야 한다.

1. **이 사이트가 무엇을 해주는지**
2. **무료로 무엇을 할 수 있는지**
3. **돈을 내면 무엇이 더 좋아지는지**
4. **왜 추천됐는지 확인할 수 있는지**
5. **모바일에서 지금 바로 쓸 수 있는지**

홈페이지가 서비스 설명서나 개발 데모처럼 보이면 실패다.

“Credits”, “AI”, “Saju engine” 같은 내부 용어보다 먼저 다음과 같은 고객 언어가 보여야 한다.

- Find my Hanbok
- Find my Colors
- Plan my Palace Day
- What should I eat nearby?
- Explore Korean Culture
- Ask Korea Concierge

유료 전환은 기능 잠금 자체가 아니라 **무료보다 분명히 더 좋은 결과**가 보여야 한다.

---

## 4. 제품 구조: Free → Premium → Commerce

### 4.1 Free layer

무료 기능은 광고판이 아니라 실제로 유용해야 한다.

예:

- Quick Help
- 기본 여행/문화 정보
- browser-local Personal Color preview
- deterministic Hanbok preference matcher
- Korean Zodiac quick result
- 공개 장소/여행 콘텐츠

무료 기능은 가능하면 zero/low AI, low latency, privacy-first로 구성한다.

### 4.2 Premium personalization

사용자가 돈을 내는 이유는 **더 깊은 개인화·시각적 결과·시간 절약·실행 가능한 추천**이어야 한다.

유료 기능 예:

- Premium Hanbok recommendation
- Premium Personal Color analysis
- Saju reading / extended reading
- AI itinerary / re-plan
- premium concierge
- photo-aware styling
- later virtual styling / image variation

### 4.3 Commerce

장기적으로는 추천을 실제 행동과 연결한다.

- 한복 대여
- 사진 촬영
- 문화 체험
- 식당/카페
- 일정/티켓/예약
- 로컬 파트너 referral

광고성 노출보다 **사용자의 선택 품질과 신뢰**가 우선이다. 스폰서/제휴 정보는 추천 근거와 분리해 명확하게 표시한다.

---

## 5. 가장 중요한 상업적 원칙

**“돈을 받기 전에, 돈을 내면 무엇을 받는지가 사이트에서 눈에 보여야 한다.”**

가격표만 있고 실제 Premium 경험이 없으면 결제를 열지 않는다.

Paid MVP의 최소 완성 루프:

1. 고객이 Premium 결과 예시/가치를 이해한다.
2. 로그인/계정이 있다.
3. 서버 권위 wallet이 있다.
4. 정확한 credit 가격을 실행 전에 보여준다.
5. 결제로 credit을 산다.
6. verified server event만 credit을 적립한다.
7. feature 실행 전에 reserve한다.
8. 성공 시 capture한다.
9. 실패 시 release/refund한다.
10. 고객이 실제 Premium 결과를 받는다.

브라우저가 “결제 성공”이라고 말하는 것만으로 credit을 지급하지 않는다.

초기에는 여행객에게 자동 갱신 구독을 강요하지 않고 **one-time Trip Pass / top-up** 방향을 우선한다. 가격·credit 소모량은 실제 API 비용, 전환율, refund/claim, p50/p95 사용량과 마진을 측정해 조정한다.

---

## 6. Hanbok — 가장 먼저 ‘돈 낼 이유’가 보여야 하는 기능

현재 무료 matcher는 deterministic preview로 유지하되, 결과가 단순 HEX swatch 카드에 머물러서는 안 된다.

### 6.1 Free Hanbok Preview

필수:

- 실제 lookbook처럼 보이는 시각적 의상 표현
- Top 3 추천
- 저고리/치마 또는 바지 조합
- 색상
- mood
- season
- destination
- walking/photo priority
- 액세서리
- fabric/계절 실용성
- 경복궁/북촌 등 배경 적합성
- 추천 이유
- deterministic rubric 공개

라이선스가 불명확한 실제 사진을 임의 사용하지 않는다. 실물 상품 사진이 없다면 CSS/SVG/illustration 기반 시각화임을 정직하게 보여준다.

### 6.2 Premium Hanbok

입력:

- optional consented photo
- Personal Color result
- mood
- destination
- season
- comfort
- solo / couple / family
- explicit silhouette/coverage preference where useful

결과:

- 3–5 ranked complete looks
- 큰 시각 결과
- jeogori/chima/baji palette
- accessory set
- fabric/season note
- photography backdrop/location
- practical rental guidance
- alternate colorway
- regenerate / variations
- Personal Color 연계 이유

결과 설명 순서:

**결론 → 근거 → 대안 → 불확실성 → 실제 행동 → 방법/개인정보**

금지:

- 미모 점수
- body attractiveness score
- 사진에서 민감 특성 추론
- 측정하지 않은 신체 치수 추론
- 근거 없는 AI confidence
- 실제 대여 상품이 아닌 이미지를 실제 상품처럼 표시

---

## 7. Personal Color

### 7.1 Free

무료 버전은 browser-local/private preview를 유지한다.

가능하면:

- visible undertone tendency
- depth
- contrast
- current lighting warning
- palette examples
- manual correction

숫자가 표시되면 실제 계산값 또는 명시적 rubric이어야 한다.

### 7.2 Premium

명시적 동의 후 photo-based explainable analysis.

필수 경계:

- MIME/file size validation
- EXIF stripping
- transient processing 우선
- 불필요한 원본 저장 금지
- raw photo를 narrative LLM에 직접 전달하지 않음
- observable bounded fields → typed deterministic post-processing → explanation

결과는 Hanbok으로 바로 이어져야 한다.

Personal Color 자체가 끝이 아니라 **“이 결과로 한국에서 무엇을 입고/고를지”**로 연결되는 것이 제품 가치다.

---

## 8. K-Culture: 재미있지만 계산은 정직하게

K-Culture는 한국 여행의 차별화 콘텐츠이자 유료화 후보지만, 그럴듯한 AI 문장으로 계산을 대신하지 않는다.

공통 원칙:

- deterministic mechanics first
- generative narrative second
- 계산과 전통적 해석을 분리
- 입력 부족 시 결과 범위를 줄임
- 부족한 데이터를 AI가 추측하지 않음
- 문화/엔터테인먼트 프레이밍
- 의료/법률/금융/고용 등 high-impact 결정에 사용하지 않음

### 8.1 Saju

반드시 지원:

- exact birth time
- approximate birth time
- unknown birth time

unknown은 오류가 아니라 정상 상태다. 정오 등 임의 시각을 넣지 않는다.

정확한 계산을 위해 필요한 경우에만 IANA timezone/longitude를 요구한다. 사용자가 위치나 출생 시간을 모를 때 외국인이 이해할 수 있는 UX를 제공한다.

민감한 raw birth inputs는 narrative AI로 직접 보내지 않고 계산된 whitelist-only 데이터만 보낸다.

### 8.2 Zodiac / Astrology

- Korean zodiac deterministic
- Western sun sign deterministic
- moon/ascendant/full placements는 실제 계산 기반일 때만
- missing input에서 placement를 만들지 않음

### 8.3 Tarot

- card selection은 LLM과 독립적인 documented random selection
- 1-card / 3-card부터
- card identity와 전통 symbolism 표시
- primary + alternative interpretation
- reflective framing

### 8.4 Daily Fortune

무작위 generic prose를 계산처럼 포장하지 않는다.

- visible inputs
- deterministic/rule-based daily theme first
- wording second
- practical reflective action

---

## 9. Premium Naming Studio

별도 고가 서비스로 유지한다.

목표 가격대: 약 **USD 149–150**.

결과:

- curated Top 3–5
- Hangul
- pronunciation
- romanization
- optional validated Hanja
- meaning
- naming rationale
- Korean naturalness
- 세대감/인상
- international pronunciation
- pitfalls
- traditional Saju/onomastics가 사용되면 현대 언어적 평가와 명확히 분리

외국 이름에 존재하지 않는 Hanja 의미를 지어내지 않는다.

---

## 10. Travel / Concierge

여행 추천은 “많이 보여주기”가 아니라 **지금 행동할 수 있는 답**을 주는 것이 목표다.

예:

- 한복 입은 상태에서 남은 대여시간 기준 루트
- 현재 위치 기준 식사/카페
- 사진 장소
- 가족/유모차/걷기 강도
- 예산
- dietary preference
- 부분 re-plan

장소 데이터는 다음을 구분한다.

- verified current fact
- source freshness/date
- editorial recommendation
- AI personalization

식이/알레르기/접근성처럼 잘못 안내했을 때 손해가 큰 정보는 근거 없는 추정 금지.

---

## 11. Design North Star

Stitch 방향은 **전체 제품의 시각 언어**로 사용한다. 단순히 색 토큰만 적용해서 “Stitch 적용 완료”라고 하지 않는다.

사용자가 실제로 체감해야 한다.

### 원하는 인상

- contemporary Korean
- premium but warm
- travel/lifestyle product
- mobile-first
- visual-first
- 야외에서도 읽기 쉬움
- 과하게 전통적이거나 올드하지 않음
- generic SaaS/admin dashboard처럼 보이지 않음

기본 방향:

- warm parchment
- silk white
- charcoal ink
- Dancheong crimson
- celadon jade
- 충분한 whitespace
- 큰 visual hierarchy
- 명확한 card composition
- 고품질 hero

### 화면 개선 기준

리디자인을 했는데 사용자가 “별로 바뀐 게 없다”고 느끼면 완료가 아니다.

Home / Hanbok / Color / Culture / Credits가 서로 다른 프로토타입처럼 보이지 않고 **하나의 브랜드 제품**처럼 보여야 한다.

필수:

- 44px 이상 touch target
- keyboard focus
- responsive mobile layout
- P0 locale에서 layout 파손 없음
- 긴 중국어/베트남어/태국어에서도 UI 안정

---

## 12. Explainable Personalization Contract

모든 개인화 기능은 가능한 한 아래 구조를 따른다.

1. **결론** — 사용자가 가장 먼저 알아야 할 것
2. **근거** — 관찰/계산/선택에서 나온 3–6개 설명
3. **대안** — 두 번째로 좋은 선택 또는 counterfactual
4. **불확실성** — 입력·조명·전통 convention 등 무엇이 결과를 바꿀 수 있는지
5. **실제 행동** — 지금 무엇을 하면 되는지
6. **방법/개인정보** — 무엇을 사용했고 무엇을 저장/전송했는지

Chain-of-thought를 노출하거나 생성하지 않는다. 사용자에게 필요한 것은 내부 추론 과정이 아니라 **검증 가능한 이유**다.

---

## 13. 숫자 사용 기준

숫자는 적극적으로 써도 되지만 다음 중 하나여야 한다.

- 실제 측정
- deterministic calculation
- verified source
- 문서화된 rubric
- 실제 비용/매출/전환 데이터

금지 예:

- 근거 없는 96% match
- 임의 AI confidence
- 보기 좋으라고 넣은 4.9/5.0
- 측정하지 않은 정확도

숫자가 사용자 의사결정에 영향을 주면 **산출 기준을 코드/문서로 추적 가능**해야 한다.

---

## 14. Payment / Wallet 개발 헌법

Global-first foreign customer가 launch payer다.

PayPal/해외카드 결제는 fresh merchant/policy 검증 후 provider abstraction으로 붙인다.

필수:

- auth/account ownership
- server-owned product catalog
- server-owned amount
- immutable ledger
- authoritative balance
- reserve
- capture
- release
- refund/reversal
- idempotency
- no negative balance
- signed/verified webhook
- replay protection
- duplicate webhook safe
- audit telemetry
- browser success never grants entitlement

Provider credential이 없으면 실제 결제를 성공한 척하지 않는다. credential boundary 직전까지 구현하고 마지막 실제 blocker만 남긴다.

---

## 15. AI 사용 원칙: 품질과 마진을 동시에

AI는 제품 가치가 올라가는 곳에만 쓴다.

우선순위:

1. deterministic/local solution
2. cheap bounded model
3. stronger model only where measured quality gain justifies cost

불필요한 AI 호출을 줄인다.

- deterministic filter before LLM
- compact typed payload
- cache safe results
- partial regeneration
- no repeated analysis for unchanged input
- hard token/output limits
- provider cost telemetry
- p50/p95 cost monitoring

사용자에게 token-variable 가격을 넘기지 않고 feature당 고정 credit 가격을 보여준다.

Raw PII를 narrative model로 보내지 않는다.

---

## 16. Security / Privacy Hard Gates

아래는 개선 점수와 무관한 **veto condition**이다. 하나라도 위반하면 출시하지 않는다.

- secret/client exposure
- payment authority가 browser에 있음
- raw sensitive PII를 불필요하게 AI에 전달
- authorization 누락
- wallet idempotency/atomicity 누락
- production runner에 일반 sudo/Docker 권한 부여
- public repo PR이 production MiniPC에서 직접 실행될 수 있음
- Cloudflare reliability gate를 retry로 숨김
- 잘못된 Saju/astrology 계산을 확정 결과처럼 제공
- 허위 상품/후기/장소 정보

사진/출생정보는 최소 수집·최소 보존·삭제 가능성을 기본으로 한다.

---

## 17. Production Reliability Hard Gate

Production reliability는 기능 개발보다 우선한다.

Cloudflare incident가 열려 있을 때는 product patch를 하지 않는다.

정식 closure 조건:

1. MiniPC local Next.js origin healthy
2. **서로 다른 scheduled Tunnel Stability Watch 2회** 모두 sample clean
3. no 1033 / 530 / 502
4. full sitemap/P0 crawl clean

Manual/push run은 scheduled closure 증거를 대신하지 못한다.

한 번 성공할 때까지 retry하는 방식은 안정성 증거가 아니다.

Docker cloudflared는 Korea tunnel이라고 확인되기 전에는 건드리지 않는다. runner에 문제 해결 목적으로 sudo/Docker 권한을 추가하지 않는다.

**운영상 incident 상태의 최종 source of truth는 private `korea-concierge-ci` evidence다.** Public handoff 문구보다 private evidence가 최신이면 private evidence를 따른다.

---

## 18. 빠른 개발 원칙

속도는 안전 기준을 낮추는 것이 아니라 **쓸모없는 대기와 과도한 연구를 없애는 것**이다.

### 해야 할 것

- vertical slice 단위로 실제 고객 경험까지 끝낸다.
- 구현 가능한데 문서만 쓰고 멈추지 않는다.
- 서로 독립된 조사/구현/테스트는 병렬화한다.
- 사용자에게 물어보기 전에 repo/docs/tests/공식문서에서 먼저 해결한다.
- final blocker가 아니면 사용자 행동을 요구하지 않는다.
- 같은 날 구현→테스트→CI→merge→deploy까지 가능한 범위는 끝낸다.

### 하지 말 것

- 장시간 speculative research만 수행
- 고객이 못 보는 infrastructure만 계속 개선
- 한 기능을 끝내기 전에 관련 없는 기능을 여러 개 시작
- 이미 존재하는 기능을 다시 만드는 작업
- “나중에 연결”만 반복해 paid flow가 영원히 완성되지 않는 상태

현재 제품에서는 **판매 가능한 vertical loop를 완성하는 것**이 매우 중요하다. Saju deterministic correctness는 유지·진행하되, 장기간 상업적 MVP를 막아서는 안 된다.

---

## 19. 개선 우선순위 Rubric

Reliability/Security/Privacy/Truthfulness hard gate를 모두 통과한 후보만 아래 점수로 우선순위를 비교한다.

총 100점:

- **사용자가 바로 체감하는 가치 — 25점**
- **매출/전환/구매 이유 강화 — 20점**
- **핵심 user journey 완성도 — 20점**
- **글로벌/다국어 usability — 10점**
- **비용·마진·latency 개선 — 10점**
- **testability/maintainability — 10점**
- **Korea Concierge만의 차별성 — 5점**

평가 원칙:

- 점수는 PR/기획에서 근거와 함께 기록할 때만 의미가 있다.
- “코드가 깨끗해졌다”만으로 높은 우선순위를 주지 않는다.
- 고객이 돈을 내는 이유가 강해지고 핵심 journey를 완성하는 변경은 높게 평가한다.
- reliability/security issue는 100점짜리 feature보다 먼저 처리한다.

---

## 20. 현재 상업적 MVP 우선순위

Reliability가 formal close된 뒤, 다음 판매 루프를 가장 빨리 완성한다.

### P0-A — 체감 디자인 완성

- Stitch 방향을 실제 production 화면에 충분히 반영
- Home / Hanbok / Color / Credits를 하나의 premium product로 통일
- mobile hero / CTA / result hierarchy 개선

### P0-B — Hanbok 가치 완성

- Free lookbook visual upgrade
- Premium result UX
- 실제 유료 결과가 무엇인지 명확한 preview
- Personal Color bridge

### P0-C — Auth + Wallet

- account
- immutable ledger
- reserve/capture/release/refund
- idempotency

### P0-D — Payment-ready

- provider abstraction
- checkout
- webhook
- refund/reversal
- credential boundary까지 완성

### P0-E — Premium Personal Color

- consented photo pipeline contract
- privacy gates
- premium result
- Hanbok 연결

### 병행 lane — Step 3 deterministic K-Culture

현재 검증된 Saju foundations를 회귀시키지 않고 다음 deterministic gates를 진행한다. 단, 연구만 길게 계속하며 paid MVP의 완성을 미루지 않는다.

---

## 21. Research / Discovery 기준

의미 있는 feature/subfeature 시작 전 fresh discovery를 한다.

가능한 소스:

- GitHub
- Hugging Face
- official docs
- publicly searchable web
- Threads/community discussions

Community tip은 hypothesis다. adoption 전에 교차검증한다.

각 후보에 대해 가능한 범위에서 기록:

- ADOPT / ADAPT / REJECT
- license
- maintenance
- provenance
- privacy
- security
- multilingual fit
- latency
- bundle/compute
- inference/API cost
- margin
- product quality

도구/소스가 unavailable이면 unavailable이라고 기록한다. 증거가 없는 검색을 한 척하지 않는다.

Research는 구현을 위한 gate이지 구현을 대체하지 않는다.

---

## 22. 개발 시작 전 필수 절차

모든 material run은 기억한 코드 상태를 믿지 않는다.

시작 전에:

1. latest public main
2. recent commits
3. open PRs
4. full `projects/korea-avocadoss` tree
5. `PRODUCT_MASTER_SPEC.md`
6. `IMPLEMENTATION_ROADMAP.md`
7. `PROJECT_HANDOFF.md`
8. relevant implementation docs
9. private CI latest commits/workflows
10. most recent reliability evidence
11. fresh live-site preflight

다른 Codex/AI/개발자가 중간에 바꿨을 가능성을 항상 전제로 한다.

---

## 23. Git / CI / Deploy 규칙

Public product repo를 production runner에 직접 붙이지 않는다.

Material product change:

1. latest main 기반 isolated branch
2. 구현/테스트
3. `PROJECT_HANDOFF.md` update
4. exact public branch head SHA 확보
5. private `target-ref.txt` = exact 40-char SHA
6. MiniPC self-hosted CI success
7. green 후 merge
8. exact merged SHA 확보
9. private `deploy-ref.txt` = exact merged SHA
10. secure deploy
11. local origin check
12. consecutive public checks
13. full sitemap/P0 crawl

Public GitHub-hosted CI는 manual fallback이다.

Secret, token, credential, token-bearing command, private environment 값을 로그/문서/대화에 남기지 않는다.

---

## 24. Definition of Done

기능이 “완료”되려면 단순히 코드가 존재해서는 안 된다.

필수:

- 고객이 볼 수 있는 실제 outcome이 있음
- 무료/유료 경계가 정직함
- paid feature라면 실제 credit lifecycle과 연결되거나 명확한 credential-only blocker 상태
- P0 locale parity
- accessibility 기본 충족
- privacy/security 경계 충족
- 필요한 deterministic/unit/integration test
- production build 통과
- exact-head MiniPC CI 통과
- merge/deploy가 필요한 변경은 exact SHA production 검증
- handoff 최신화

“UI만 있고 backend 없음”, “가격표만 있고 결제 없음”, “AI 버튼만 있고 실제 결과 없음”은 sellable feature의 Done이 아니다.

---

## 25. Agent / Developer 운영 규칙

AI/개발자는 가능한 한 자율적으로 진행한다.

- 사용자가 해줘야만 하는 일을 제외하고 먼저 끝낸다.
- 질문으로 개발을 멈추지 않는다.
- reversible reasonable decision은 스스로 한다.
- 다른 AI 변경을 덮어쓰지 않는다.
- 사실이 확인되지 않으면 완료라고 보고하지 않는다.
- tool output/CI run/SHA/deploy 결과를 절대 만들어내지 않는다.

사용자 보고는 필요할 때만 짧게:

- 완료
- 검증
- 다음 단계
- 내가 해줄 일

사용자 action이 없으면 `없음`이라고 명확히 한다.

---

## 26. 이 프로젝트가 실패하는 패턴

다음 상태가 오래 지속되면 방향을 바로잡는다.

- 기술 기반은 많지만 돈 낼 기능이 안 보임
- Stitch가 병합됐지만 화면 변화가 체감되지 않음
- credits 가격은 있는데 실제 wallet/checkout이 없음
- Hanbok 추천은 있는데 실제 look visual이 없음
- Premium이라고 적혀 있지만 free와 결과 차이가 없음
- AI 연구만 계속되고 customer journey가 완성되지 않음
- 숫자는 많지만 근거가 없음
- 외국인 대상인데 한국 사용자 전제 UX를 씀
- CI가 자주 깨지는데 feature를 계속 쌓음
- reliability 문제가 열린 상태에서 production feature를 밀어넣음

---

## 27. 성공 판단

Korea Concierge가 좋은 방향으로 가고 있는지는 다음 질문으로 판단한다.

### 고객

- 처음 보는 외국인이 30초 안에 서비스 가치를 이해하는가?
- 무료 기능만으로도 쓸모가 있는가?
- Premium이 왜 돈을 받을 만한지 보이는가?
- 추천 이유를 이해할 수 있는가?
- 지금 서울에서 바로 행동할 수 있는가?

### 사업

- 결제→credit→feature→result 루프가 안전하게 완성됐는가?
- feature별 실제 원가와 margin을 측정할 수 있는가?
- 반복 사용/upgrade 이유가 있는가?
- 로컬 commerce로 연결 가능한가?

### 기술

- intermittent production failure를 숨기지 않는가?
- exact SHA 기준으로 재현·검증 가능한가?
- 사용자 데이터와 payment authority가 서버에서 보호되는가?
- deterministic truth와 AI wording이 분리돼 있는가?
- 다른 AI/개발자가 이어받아도 현재 상태와 다음 우선순위를 알 수 있는가?

이 질문에 대한 답을 계속 좋아지게 만드는 것이 모든 개선의 목적이다.

---

## 28. 현재 운영 주의사항 — 2026-08-28 snapshot

이 항목은 참고 snapshot이며 최신 사실은 private CI evidence를 다시 읽는다.

작성 시점 기준 private evidence에는 scheduled Tunnel Stability Watch healthy sample이 **1/2**만 persisted되어 있었고, fresh live-site preflight는 8/8 no-retry + sitemap 36 + P0 36/36 + failures=0이었다. 따라서 public handoff의 과거 `incident closed` 표현만 보고 reliability를 닫았다고 가정하면 안 된다.

Formal closure가 확인될 때까지 runtime product patch는 보류하고, 이후 위 P0-A~P0-E와 Step 3 lane을 진행한다.
