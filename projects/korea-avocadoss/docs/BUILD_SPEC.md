# Korea Concierge — Revenue-first Build Specification

**Version:** 1.0 · **Decision date:** 2026-09-07

**Status:** 사용자 승인 방향을 구체화한 구현 기준. 구현·실결제·매출 달성을 뜻하지 않는다.

**Owner goal:** 외국인 고객에게 유용한 결과를 판매하고, 실제 비용을 뺀 수익을 만든다.

**Repository:** `lgkangno1-svg/Kang-s-brain` · **Project:** `projects/korea-avocadoss`
**Production:** <https://korea.avocadoss.co.kr> · **Private CI:** `lgkangno1-svg/korea-concierge-ci`

## 0. 모든 AI agent의 시작점

이 문서가 제품·상품·UX·구현 순서의 단일 기준이다. 대화 기억이나 과거 MD를 다시 조합해 별도 사업 모델을 만들지 않는다. 사용자는 기존 MD를 그대로 따를 필요 없이 수익을 목표로 최상의 결과물을 만들도록 승인했다.

읽는 순서: **이 문서 → `PROJECT_HANDOFF.md`의 최신 항목 → 현재 코드/테스트 → 필요한 기술 참고 문서만**. `IMPLEMENTATION_ROADMAP.md`는 이 문서의 실행 인덱스다.

우선순위: 최신 사용자 지시 → 실제 코드/운영 증거 → 이 문서 → 최신 handoff → 기술 참고 자료 → 보관된 과거 기획. 코드가 목표와 다르면 코드가 이미 완성됐다고 주장하지 말고 차이를 구현 작업으로 기록한다. 과거의 가격·전체 credit wallet 선행·전체 서비스 완성 선행·스크린샷 완전 복제 의무는 새 판매 흐름을 막지 않는다. 보안·개인정보·계산의 정직성·운영 격리는 계속 지킨다.

이번 문서 변경 자체는 문서 게시만 승인받은 작업이다. 아래 구현 단계는 **후속 구현 요청을 받은 agent**의 작업 명세이며, 이 문서의 존재만으로 계정 개설·약관 동의·실결제·외부 메시지 전송 권한이 생기지 않는다.

## 1. 제품과 고객

**고객 약속:** “한국에서 나에게 어울리는 스타일을 찾고, 그 스타일로 좋은 여행 경험을 만들 수 있게 돕는다.”

첫 구매 대상은 서울 여행을 준비하거나 여행 중인 개인·커플·친구 여행객 중 한복과 사진에 관심 있는 사람이다. 초기 유입 콘텐츠는 영어로 우선 검증하되, 이미 제공 중인 `en`, `zh-CN`, `ja`, `zh-TW`, `vi`, `th`를 유지한다. 성별·인종·국적을 사진이나 언어에서 추정하지 않는다. 첫 유료 SKU는 **성인 1인의 스타일북**이다. 커플·가족 상품은 후속 실험이며 첫 버전에 여러 사람의 사진을 받지 않는다.

첫 지역: 경복궁·광화문·서촌·북촌·안국. 전국 데이터베이스를 먼저 만들지 않는다.

수익 구조:

1. 무료 체험/콘텐츠로 방문과 신뢰를 얻는다.
2. **My Korea Look**의 시각적 개인화 결과를 일회성 판매한다.
3. 검증된 한복 대여·사진 촬영·컬러 상담 제휴로 추가 수익을 만든다.
4. 실제 구매/사용 데이터가 생긴 후 커플 상품, K-Culture, Naming Studio, 묶음 패스를 확장한다.

무료 컬러 분류나 일반 AI 문장만으로 유료 가치를 주장하지 않는다. 차별점은 **큰 시각 결과 + 내 선택에 따른 비교 + 한국 현장에서 사용할 카드/동선**이다. 월매출이나 전환율을 보장하지 않는다.

## 2. 첫 상품 계약 — 이 범위로 먼저 판매한다

| 항목 | 구현 기본값 |
|---|---|
| 상품명 / 내부 SKU | **My Korea Look** / `my_korea_look_v1` |
| 단위 | 성인 1인, 스타일북 1개, 결과 내 완성된 룩 3가지 |
| 가격 가설 | **USD 12.00 일회성**. 자동 갱신 없음. 서버 가격 버전으로 관리 |
| 결과 형식 | 휴대폰용 비공개 결과 페이지 + 동일 내용의 저장용 PDF |
| 수정 | 최초 결과 완료일부터 30일 내 **성공한 수정 1회** 포함 |
| 결과 재열람 | 최초 완료일부터 90일. 결제 전 고지, 만료 전 다운로드 안내 |
| 전달 목표 | 확정 결제 후 2분 이내. 실제 성능을 측정하기 전 광고에 확정 시간으로 쓰지 않음 |
| 실패 약속 | 결제 후 15분 내 최초 결과를 전달하지 못하면 자동 전액 환불 요청. 진행 상태/문의 경로 제공 |
| 포함하지 않는 것 | 실제 한복 대여·예약·촬영비·사람의 상담·전문 대면 컬러 진단·무제한 재생성 |

수정/보관 기간은 출시 기본값이다. 변경하면 가격/약관 버전과 신규 주문에만 반영하고 이미 판매한 약속을 소급 축소하지 않는다. 법정 권리는 이 운영 약속보다 우선하며, 실제 판매 지역/상품에 맞는 환불·디지털 제공 동의 문구는 판매자가 확정해야 한다.

USD 12를 표시하면서 다른 통화/금액으로 몰래 청구하지 않는다. provider의 지원 통화/세금 설정을 확인해 서버에서 최종 총액을 결제 전에 보여준다. USD를 지원하지 않는 계약이라면 출시 전 명시적인 고정 현지통화 가격을 설정하고 전 화면에 동일하게 표시한다. 브라우저 환율 계산을 청구 기준으로 쓰지 않는다. 현재 legacy credit/Stripe SKU를 이 상품으로 자동 변환하거나 판매하지 않는다.

### 무료/유료 경계

- `/style`의 새 무료 preview: 선호도 기반 룩 1개, 기본 컬러 방향, 짧은 이유. 로그인/원격 사진 처리 없이 가능.
- 기존 `/color`의 browser-local preview, `/hanbok`의 무료 matcher/Top 3, Quick Help는 계속 무료다. 기존 무료 결과를 유료 전용으로 숨기지 않는다.
- 유료: 동의한 사진의 bounded styling observations 또는 명시적 수동 컬러 입력을 반영한 완성 룩 3개, 실질적 대안, 시각 비교, 한국어 매장 카드, 맞춤 촬영 동선, 저장/수정.
- 사진을 사용하지 않는 고객에게는 “선택한 취향·컬러 기반”이라고 표시한다. 사진 분석을 한 것처럼 표현하지 않는다. 결제 전에 두 입력 방식의 차이를 보여준다.
- 공개 샘플은 완성본 수준이어야 한다. 일반 고객의 개인정보/결과를 공개 샘플로 전환하지 않는다.

## 3. 고객에게 전달할 결과

페이지 순서: **추천 요약 → 룩 3개와 비교 → 컬러 비교 → 매장 요청 카드 → 장소/짧은 동선 → 대안/수정 → 방법·개인정보**.

각 룩에는 다음을 모두 포함한다.

- 큰 의상 시각 자료, 사람이 읽을 수 있는 스타일명, 한 문장 설명.
- 저고리 + 치마/바지/겉옷의 색 관계, 소재/계절 고려, 헤어/장신구 조합.
- 사용자의 명시적 입력 또는 관찰 필드와 연결되는 추천 이유 3개.
- 걷기/더위/사진 분위기 등 실용적인 trade-off 1개와 alternate colorway 1개.
- 해당 의상에 어울리는 실제 장소 1개, 출처/확인일, 매장에서 확인할 사항.
- 시각 자료 바로 아래 source/creator/license 링크와 `Style illustration` 또는 `Reference photo` 등 자료의 종류.

**컬러 비교:** 따뜻한/차가운 색 등 실제로 구분되는 조합을 나란히 보여준다. 고객이 동의하면 사진 옆 컬러 패널을 사용하되, 피부를 보정하거나 다른 조명의 사진을 비교 증거처럼 쓰지 않는다. 인종·건강·미모 점수·근거 없는 매칭 확률을 생성하지 않는다.

**한국어 매장 카드:** 저고리/하의 색, 의상 분위기, 희망 장신구, 편안함 조건, 추가 요금 확인 문장을 고객 언어와 한국어로 표시한다. 기존 검수된 문장 템플릿에 허용된 선택지를 넣는다. 번역 모델이 재고/가격 약속을 추가하게 두지 않는다.

**동선:** 선택한 출발점에서 2~3시간을 쓰는 3~4개 정류장, 지도 링크, 이동 순서, 예상 시간의 근거/가정, 반납 여유시간. 특정 날짜가 없으면 휴무에 주의하는 일반 경로로 표시한다. 실시간 영업/예약 가능이라고 주장하지 않는다. 확인된 실내 대안이 없으면 우천 대안을 지어내지 말고 재계획을 안내한다.

**수정:** mood, palette, comfort, coverage, date/season, destination을 한 번에 바꿀 수 있다. 실패한 수정은 사용 횟수를 소모하지 않는다. 최초 결과는 유지하며 새 버전을 성공 저장한 뒤 현재 버전을 전환한다. 단순 재열람/언어 변경/PDF 재다운로드는 수정 횟수가 아니다.

## 4. 스타일·이미지 품질 기준

기존 경험 분류를 유지한다: `princess-prince` (부드럽고 사진 친화적), `queen-king` (단정하고 격식 있는), `royal` (화려하고 의례적인). Royal은 역사적 신분 서열의 정확한 분류가 아니라 사이트의 스타일 라벨이다.

의상 표현은 사용자가 선택한다: `chima`, `baji`, `either`. 사진에서 성별·신체 치수를 판단하지 않는다. 키/체형 점수는 첫 버전에 필요 없다. coverage는 `standard` / `more-coverage`로 명시적으로 고른다.

런타임 이미지 생성이나 사진 합성을 첫 판매의 필수 의존성으로 만들지 않는다. 첫 유료 버전은 **검수된 완성 룩 카탈로그 + 실제 선택에 따른 순위 + 사진/컬러 비교**로 구현한다. 적어도 12개의 구분되는 완성 룩을 확보하고, 각 3개 스타일/각 chima·baji 계열에 최소 2개씩 있어야 한다. 입력 제약을 만족하는 결과 3개가 없으면 결제 전에 선택지를 조정하도록 안내한다. 세 룩의 사진·문장만 복제한 결과는 금지한다.

우선순위: 사용 허용이 확인된 고품질 실제 착용 사진 → 공식 embed가 허용된 콘텐츠 → 권리를 확보한 자체 제작 스타일 illustration. 공식 press 이미지도 재사용 허가를 확인해야 하며 출처 표기만으로 상업적 사용 허가를 추정하지 않는다. 연예인/드라마 사진은 안전하게 쓸 수 있을 때 inspiration으로 추가하고, 제휴·추천·동일 의상 재고를 암시하지 않는다. 이 후보 조사 때문에 출시를 멈추지 않는다.

카탈로그 asset 필수 필드: `id`, `src`, `width`, `height`, `kind`, `altByLocale`, `sourceUrl`, `creator`, `license`, `licenseUrl`, `commercialUseEvidence`, `checkedAt`, `cropPosition`, `styleIds`, `palette`, `garmentType`, `coverage`, `seasons`, `walkingSuitability`, `accessoryIds`.

룩 카드는 4:5 비율, 의상 디테일이 남는 crop, 확대 시 읽을 수 있는 해상도(가급적 원본 가로 1200px 이상)를 사용한다. Next Image의 dimensions/sizes/allowlisted remote patterns를 적용한다. 외부 이미지가 실패하면 권리를 확보한 local fallback과 정상 출처를 표시한다. 깨진 이미지 아이콘/무한 skeleton을 방치하지 않는다. 공개 inspiration과 유료 결과의 이미지 사용 권한 범위를 각각 확인한다.

## 5. 화면·URL·내비게이션 계약

현재 Next.js App Router/next-intl를 확장한다. 새 앱으로 재작성하지 않는다. 모든 고객 URL은 `/{locale}`로 시작한다.

| Route | 목적 / 필수 동작 |
|---|---|
| `/` | 사이트 약속, 큰 결과 예시, `Find my Korean look`, 과정, 무료/유료 비교, 가격, FAQ |
| `/style` | 단계형 입력, 유효성 오류, 무료 preview, 명시적인 photo/no-photo 선택, 구매 진입 |
| `/style/sample/{slug}` | 공개 완성 샘플 3종. fictitious adult persona 또는 동의된 모델. 실제 고객 후기처럼 표시 금지 |
| `/checkout/{orderId}` | 구매자 확인, 상품/최종 통화/총액/포함 범위/수정·보관/환불/개인정보, provider checkout |
| `/checkout/success` | 기존 route 재사용. 서버 주문 상태 확인 후 확인 중/생성 중/완료/실패/환불 상태 표시 |
| `/my-results` | 이메일 인증 세션에 속한 주문·결과·수정 가능 횟수·다운로드·복구 |
| `/my-results/{orderId}` | 비공개 결과 상세. 소유권 검사, 완료본, 수정, PDF, 문의 |
| `/privacy`, `/terms`, `/refunds`, `/contact` | 실제 사업자·지원 채널·사진 처리·보관·환불 정책. footer에서 작동하는 링크 |
| 기존 `/color`, `/hanbok`, `/culture`, `/explore/gyeongbokgung` | 기존 유용한 기능 유지, 새 style 흐름으로 실제 연결 |
| 기존 `/credits` | 첫 상품 판매 시 크레딧 판매를 활성화하지 않음. 상품 안내/보유 권리 확인 링크, 준비 중인 패스는 정직하게 표시 |

표의 `/`는 locale root다. `/style/sample/*`만 indexable; checkout/auth/private results는 `noindex`, sitemap 제외, private/no-store cache다. 현재 공개 경로를 조용히 없애거나 모든 링크를 새 홈으로 돌리지 않는다. 기존 `?hanbokStyle=`/`?undertone=`는 허용 목록으로 검증하고 새 draft에 반영한다. 잘못된 값은 안전한 기본값 + 사용자 변경 가능 상태로 처리한다.

홈 순서: hero/primary CTA → 시각적인 샘플 → 3단계 사용법 → 결과에 포함되는 것 → 무료/유료 비교 → 일회성 가격 → FAQ → 실제 support/policies. 첫 스크린에 예정 기능 카드들을 구매 기능처럼 나열하지 않는다. 주요 nav는 `Style Studio`, `Explore`, `K-Culture`, `My results`, 언어 선택으로 정리한다.

영문 기준 문구:

> Find your Korean look. Make it part of your Seoul trip.
>
> Three styled looks, your Korean shop card, and a photo route — made around your preferences.
>
> Find my Korean look · See a sample · Get my stylebook — $12 one-time

가격 CTA는 서버 catalog/quote에서 렌더링하고 이 예문의 숫자를 별도 하드코딩하지 않는다. 원격 사진 분석을 시작하기 전에 동의와 이용 목적을 표시한다. CTA에 “0 AI calls”, token, model ID, internal credits 등 개발 정보를 넣지 않는다.

## 6. 디자인·다국어·접근성

현재 한국적 premium visual system을 활용한다: Hanji 계열 `#F8F5E9`, navy `#001F5B`, green `#12453A`, restrained gold `#C1A355`, serif heading + 읽기 쉬운 sans body. 기존 `stitch-*.css`를 먼저 확인하고 토큰/컴포넌트를 재사용한다. 이전 목업과의 픽셀 일치보다 새 판매 흐름의 이해·결과 이미지·모바일 가독성을 우선한다.

작은 화면에서 1열 룩 카드/명확한 비교, 넓은 화면에서 3열. 이미지 확대·비교 선택·폼·dialog 모두 키보드로 조작 가능해야 한다. 터치 target 44px, 명시적 label/focus, 색에만 의존하지 않는 설명, reduced motion, 재시도/뒤로가기 상태를 제공한다. sticky purchase 버튼은 총액과 내용을 가리지 않게 한다. 사진을 업로드하지 않아도 흐름을 완료할 수 있어야 한다.

UI 문자열은 기존 messages 구조의 새 namespace에 둔다. 6개 locale에서 입력/가격/결제/개인정보/오류/결과/이메일이 빠지지 않아야 한다. 영어를 명시적인 고객 동의 없이 다른 locale의 유료 결과로 대신 보내지 않는다. 주문에 전달 언어를 저장하고 언어별 표현만 변환할 때 추천 의미를 바꾸지 않는다.

## 7. 입력과 결과 schema

아래는 schema 계약이다. server validation에 enum/길이/개수 제한을 실제로 구현하고 TypeScript 타입만으로 검증됐다고 간주하지 않는다.

```ts
type StyleInputV1 = {
  version: 1;
  locale: 'en' | 'zh-CN' | 'ja' | 'zh-TW' | 'vi' | 'th';
  style: 'princess-prince' | 'queen-king' | 'royal';
  garment: 'chima' | 'baji' | 'either';
  palette: 'jadeIvory' | 'roseNavy' | 'moonBlue' | 'suggest';
  mood: 'elegant' | 'royal' | 'romantic' | 'minimal' | 'kdrama';
  comfort: 'walking' | 'balanced' | 'photoFirst';
  coverage: 'standard' | 'more-coverage';
  season: 'springAutumn' | 'summer' | 'winter';
  destination: 'gyeongbokgung' | 'bukchon' | 'seochon';
  visitDate?: string; // validated YYYY-MM-DD in Asia/Seoul
  photoAssetId?: string; // owned, private, unexpired asset; never an arbitrary URL
  colorSource: 'manual' | 'local-preview' | 'consented-photo';
  consentVersion?: string; // required for remote processing, recorded server-side
};
type ExplainedLook = {
  lookId: string;
  title: string;
  assetId: string;
  palette: Array<{part: string; hex: string; label: string}>;
  accessoryIds: string[];
  evidence: Array<{inputKey: string; explanation: string}>;
  tradeoff: string;
  alternativeLookId: string;
  locationId: string;
};
type StylebookV1 = {
  schemaVersion: 1;
  catalogVersion: string;
  rulesVersion: string;
  inputSnapshotId: string;
  looks: [ExplainedLook, ExplainedLook, ExplainedLook];
  colorComparison: {source: StyleInputV1['colorSource']; notes: string[]};
  shopCard: {ko: string; customerLanguage: string};
  routeId: string;
  uncertainties: string[];
  method: {photoProcessed: boolean; generatedAt: string};
};
```

개인정보/사진은 공개 URL, query string, 분석 이벤트, 오류 본문, 결제 metadata에 넣지 않는다. 입력 변경마다 immutable snapshot/version을 만들고 결제 후 다른 입력으로 바꿔치기하지 않는다.

`colorSource='consented-photo'`는 유효한 본인 `photoAssetId`와 서버에 기록된 동의를 필수로 요구한다. manual/local-preview는 원격 사진 처리를 금지하고 명시적인 palette 또는 검증된 typed 컬러 입력을 저장한다. 사진 실패·만료 시 자동으로 수동 모드로 바꾸지 않고 고객의 재선택을 새 snapshot으로 기록한다. `suggest`의 적합성 검사는 무료 local preview/수동 컬러 입력으로 먼저 할 수 있으며, 유료 remote observations는 paid가 검증된 job에서만 실행한다.

## 8. 개인화 엔진 — 예쁜 문장보다 실제 차이를 만든다

Pipeline: validate input → consent/asset validation → optional bounded photo observations → typed normalization → catalog filters/rank → distinct looks 3개 → 검수된 한국어 카드/route 구성 → bounded explanation/localization → schema/claim validation → 결과 저장.

첫 ranking 기본값(내부 rubric이며 확률이 아님): 요청 style 일치 30, palette 적합 25, comfort 적합 20, season 15, destination 배경 적합 10. garment/coverage/사용권 미확보 asset은 hard filter다. 미측정 값에 가짜 점수를 넣지 않는다. `suggest`는 유효한 관찰/수동 컬러가 없으면 고객이 palette를 고르도록 한다. 동점은 stable look ID로 결정하고 3개는 최소한 palette 또는 garment/accessory 조합이 달라야 한다. 사용자 제약 때문에 다양성을 만들 수 없으면 결제 전에 알린다.

사진 observations는 현재 조명의 visible warmth/depth/contrast/quality와 관찰 한계만 반환하도록 한다. 명시적 palette 선택은 모델 추정보다 우선한다. 낮은 사진 품질은 재촬영/수동 선택으로 처리하며 확정 진단처럼 포장하지 않는다. 사진 기반과 수동 기반 결과는 서로 구분되지만 둘 다 완성된 세 룩/실행 카드를 제공한다.

AI는 schema가 제한된 관찰·설명에만 사용한다. narrative 모델에는 원본 사진/이메일/생년월일을 보내지 않는다. 검수된 장소·asset ID·한국어 문장 밖의 업체/가격/재고를 만들어내면 출력 검증 실패다. 모델의 결과로 catalog/권한/결제 상태를 결정하지 않는다. 온사이트 미용 진단·가상 피팅·몸 치수 측정이라고 광고하지 않는다.

모델은 코드에 최신이라고 하드코딩하지 않는다. 현재 `src/lib/ai/model-policy.ts`를 확인하고 공식 SDK/API·사용권·retention·지원 언어·실측 비용을 확인한 하나의 경로를 선택한다. 테스트는 fake adapter, 운영은 실제 provider만 사용한다. 미설정/비용 초과/권한 없는 provider 상태에서는 해당 처리 경로를 비활성화한다. fallback이 입력 방식/상품 가치를 바꾸면 고객에게 알리고 재선택을 받는다.

## 9. 소규모 검수 fixture와 데이터

공개 sample 세 개를 아래 사례로 제작한다. “실제 고객” 후기나 모델 분석 결과로 위장하지 않는다. 성인 자체 제작 모델/illustration만 쓰거나 별도 동의가 확인된 사진을 사용한다.

| 사례 | 입력 | 결과에서 반드시 확인할 차이 |
|---|---|---|
| Soft Palace | princess-prince / chima / moonBlue / romantic / balanced / 봄·가을 / 경복궁 | 부드러운 컬러 관계, 적은 장신구, 궁궐 사진과 보행 균형 |
| Formal Walk | queen-king / baji / roseNavy / elegant / walking / 겨울 / 서촌 | 바지/겉옷 계열, 겨울 실용성, 걷기 쉬운 장신구/동선 |
| Ceremonial Photo | royal / either / jadeIvory / royal / photoFirst / 여름 / 경복궁 | 의례적 디테일, 사진 우선, 더위/무게 trade-off와 가벼운 대안 |

같은 장소의 운영 사실을 매 요청 AI 검색으로 만들지 않는다. versioned curated location records를 쓴다: `id`, localized name, address/map link, source URLs, checkedAt, opening/closure notes, source-backed accessibility facts, route role. 첫 범위 6~10개 장소로 충분하다. 영업 관련 정보는 30일 이내 확인된 자료를 우선하며 오래되면 확인 필요 배지를 표시한다. 미래 날짜의 특별 행사·재고·예약 가능성은 보장하지 않는다. source 확인 실패를 성공으로 기록하지 않는다.

## 10. 현재 소스와 재사용 경계

아래는 2026-09-07에 확인한 public source SHA `95fe720a4d05d41eda16684a4371f72c0c4d33d6`의 snapshot이며 최신 운영 버전이라는 뜻은 아니다. 후속 agent는 fresh main과 비교한다.

| 현재 경로 | 재사용 / 남은 일 |
|---|---|
| `src/features/color/` | browser-local 분석/수동 보정 재사용. premium remote pipeline은 구현 필요 |
| `src/features/hanbok/` | free matcher, visual library, personal-color bridge 재사용. 유료 catalog/ranking/result 추가 |
| `src/i18n/`, `messages/` | 6개 locale와 기존 SEO 경로 보존 |
| `src/app/stitch-*.css`, `responsive-system.css` | 기존 visual system과 responsive 상태 재사용 |
| `src/lib/payments/catalog.ts`, `stripe.ts` | legacy 상품과 Stripe 기초. 새 SKU/SDK adapter/서버 주문 결합 필요 |
| `src/app/api/checkout/stripe/route.ts` | 활성화 flag/locale guard는 있음. 실 계정 소유 주문 처리 필요 |
| `src/app/api/stripe/webhook/route.ts` | 서명 확인 뒤 로그만 남김. durable event·settlement·fulfillment 구현 필요 |
| `src/app/[locale]/checkout/success/page.tsx` | 현재 서버 결제 조회 없이 성공을 표시함. 판매 전 교체 필수 |
| `src/lib/credits/` | 기존 코드를 보존하되 첫 SKU의 선행 wallet 프로젝트로 확장하지 않음 |
| `src/lib/saju/` | 범위 밖. 기존 계약을 회귀시키지 않으며 정적 테스트 통과를 계산 정확성의 증명으로 확대하지 않음 |

권장 새 위치: `src/features/style/{input,preview,result,samples,look-catalog,ranking}`, `src/lib/{orders,fulfillment,auth,storage}`, `src/app/api/{style,orders,payments}`, `scripts/style-worker.*`, `db/migrations/`. 정확한 파일 분할은 현재 구조에 맞추되 같은 기능의 두 시스템을 만들지 않는다. 기존 Stripe endpoint를 adapter 입구로 재사용할 수 있다.

## 11. 저장소·인증·데이터 기본 결정

이미 운영 중인 managed PostgreSQL/Auth가 확인되면 이를 재사용한다. 없다면 **Supabase PostgreSQL + Supabase Auth 이메일 OTP + private Storage**를 기본 선택으로 한다. 실계정/credentials를 확보하기 전에는 local/test 환경에서 구현한다. Supabase를 선택한 경우 공식 SDK와 RLS를 사용하고 service-role key는 서버/worker에만 둔다. 브라우저의 anon key가 비밀키를 대신하는 권한이라고 오해하지 않는다.

무료 입력은 browser-local이다. 원격 사진 처리/checkout 전에 이메일 OTP로 소유자를 확인한다. password/account 작성 화면을 강제하지 않지만 서버에는 검증된 user/session이 존재해야 한다. guest draft는 현재 세션이 소유한 값만 authenticated user에게 한 번 claim할 수 있다. 다른 계정 draft/order/result를 ID로 조회하지 못하게 한다.

최소 저장 모델:

| Table | 핵심 필드 / 제약 |
|---|---|
| `style_drafts` | UUID, owner_id, immutable input_version/snapshot, locale, consent_version, expires_at |
| `photo_assets` | owner_id, draft_id, private object key, validated type/dimensions, consent_at, expires_at/deleted_at |
| `orders` | owner_id, SKU/price_version, input snapshot, locale, integer amount/currency/tax snapshot, payment_status, fulfillment_status, provider refs, delivery deadline, first_ready_at, revisions_used |
| `payment_events` | unique(provider,event_id), processing state, normalized minimum fields, received_at/processed_at; 원본 PII payload는 저장하지 않음 |
| `style_jobs` | unique(order_id,revision_no), state, attempts, next_attempt_at, lease_expires_at, fencing_token, deadline |
| `stylebooks` | unique(order_id,revision_no), private validated JSON/asset refs, catalog/rules version, ready_at, expires_at |
| `refunds` | unique provider refund ref/idempotency key, order_id, requested/confirmed/failed 상태, amount/currency/reason |
| `outbox` | unique operation key, kind(email/refund), minimal payload refs, attempts/next_attempt_at/state |

인증은 provider auth tables를 재사용한다. 새 credit wallet은 필요 없다. 기존 실제 결제/잔액 데이터가 발견되면 읽기·환불·권리를 보존하고 자동 변환하지 않는다. 클라이언트는 order/status/amount/refund/job/권한 필드를 수정할 수 없다. RLS와 서버 소유권 검사, DB unique constraints/transactions를 함께 쓴다. migrations는 staging 검증과 rollback/restore 계획을 포함한다.

## 12. 결제와 결과 지급 — 가장 중요한 구현 계약

### Provider 선택

한국 사업자이면 한국 사업자 정산을 지원하는 해외카드/PayPal PG 계약 가능 여부를 먼저 확인한다. 지원 국가의 적격 법인/계좌를 이미 가진 경우 기존 Stripe 기반을 활용할 수 있다. 2026-09-07 확인 시 Stripe 표준 판매자 지원 국가 목록에 한국은 없었다. 지원 국가·상품 심사·정산·세금·통화는 실제 계약 전에 공식 자료로 다시 확인한다. 국가를 허위로 입력하거나 새 해외 법인 설립을 기본 해결책으로 삼지 않는다.

한 번에 **하나의 실제 provider adapter**만 구현한다. 주문 로직은 provider와 분리하지만 범용 결제 프레임워크를 만들지 않는다. 필요한 기능은 `createCheckout`, `retrieveVerifiedPayment`, `verifyAndNormalizeEvent`, `requestRefund` 네 개다. Stripe 선택 시 현재 지원 official SDK의 Checkout Sessions + hosted Checkout + SDK webhook 검증을 사용한다. 최신이라는 이유만으로 SDK/API 버전을 자동 갱신하지 말고 구현 시 확인한 호환 버전을 lockfile에 고정한다. 직접 카드번호를 받거나 저장하지 않는다.

공통 flag `PAYMENTS_ENABLED=false`를 기본으로 한다. Stripe 경로가 남아 있다면 기존 `STRIPE_CHECKOUT_ENABLED`도 보존하고 두 flag/선택 provider/config를 모두 확인한다. flag만 켜졌다고 readiness가 통과하지 않는다. 실제 merchant/catalog/auth/DB/job worker/email/refund/정책 정보가 준비되지 않으면 checkout은 `503 CHECKOUT_UNAVAILABLE`이며 고객은 계속 무료 체험/샘플을 사용할 수 있다.

### 정상 흐름

1. 인증된 사용자 + 검증된 draft/version + 허용 SKU로 서버 quote를 만든다. 상품·가격·통화·세금·언어·정책 버전은 서버가 고정한다.
2. 주문을 DB에 먼저 저장한다. 같은 구매 의도의 재요청은 소유자가 같은 idempotency key로 기존 주문/checkout을 반환한다.
3. provider 세션에 opaque order ID와 SKU만 보낸다. 결제 처리를 위한 이메일은 provider의 필요한 고객 필드에만 전달하며 metadata에 복제하지 않는다. 사진·생년월일·취향·분석 결과는 보내지 않는다.
4. 서명 검증된 이벤트 또는 서버 provider 조회로 실제 결제 상태를 확인한다. provider 계정/환경(test/live), 세션/주문 ID, SKU, 최종 amount/currency와 주문 quote를 대조한다.
5. **paid가 확인된 주문만** DB transaction에서 paid 상태 + 최초 style job을 생성한다. 이벤트/주문 row lock과 unique constraints로 중복 알림·다른 이벤트 ID의 같은 결제가 하나의 결과 지급으로 연결되게 한다.
6. worker가 결과를 만들고 검증한 뒤 ready 상태와 이메일 outbox를 같은 transaction으로 저장한다. 고객은 로그인된 결과 페이지에서 즉시 읽을 수 있다. 이메일 실패가 이미 생성된 결과를 없애지 않는다.

Stripe `checkout.session.completed`도 `payment_status`를 확인해야 한다. 지연 결제는 확인 중 상태를 유지하며 실제 성공 이벤트/조회 후 지급한다. 서명 timestamp 허용 범위는 영속적인 이벤트 중복 방지를 대신하지 않는다. 성공 URL의 `session_id`, 클라이언트의 success flag, webhook 수신 로그만으로 paid/ready를 표시하지 않는다.

### 상태·동시성·환불

서로 다른 상태를 섞지 않는다.

- `payment_status`: pending / paid / failed / expired / refund_pending / refunded / disputed.
- `fulfillment_status`: not_started / queued / running / ready / retrying / failed / cancelled.
- UI는 두 상태를 서버에서 함께 읽는다. paid+running은 “결제 확인, 결과 생성 중”, paid+ready만 “내 스타일북 보기”다.

이벤트 순서 역전은 provider의 최신 상태 조회와 허용된 상태 전이로 처리한다. 오래된 completed 이벤트가 refunded/disputed 상태를 다시 paid로 덮어쓰지 못한다. provider 호출을 DB lock 안에서 오래 기다리지 말고 결과를 재검증한 transaction으로 적용한다. DB/event 저장 실패는 provider가 재시도할 수 있는 실패 응답을 반환하고, 이미 durable event로 접수한 경우에는 내부 재처리가 이어져야 한다.

무료 공개 preview를 제외한 결과 열람·수정·PDF는 매번 owner + 지급 권한을 확인한다. refund_pending/refunded/disputed 및 결과 만료 시 열람·수정·다운로드를 차단한다. 비공개 PDF/결과 asset은 매 요청 owner와 현재 권한을 검사하는 서버 경로로 제공하고 직접 접근 가능한 storage signed URL을 고객에게 발급하지 않는다. 이미 전달된 파일은 회수할 수 없으며 회수를 약속하지 않는다. dispute 취소/승소 등 재개는 검증된 provider 상태에 따른 명시적 복구이며 자동적인 재결제는 하지 않는다.

결제한 고객이 브라우저를 닫거나 success 페이지가 로드되지 않아도 지급한다. 결제 요청 timeout 시 새 주문을 무작정 생성하지 않고 같은 intent/session을 조회한다. pending 결제와 stuck event를 5분 주기로 대사하고, 실패/미확인 상태를 paid로 추측하지 않는다.

전체 결과 환불은 재사용 가능한 idempotency key로 provider에 요청하고 DB에는 requested/confirmed/failed를 분리한다. 요청 성공과 실제 환불 완료를 같은 상태로 표시하지 않는다. 첫 버전은 전액 환불만 노출하며 부분 환불은 운영자가 검증된 provider 도구로 처리하고 주문 권한을 별도로 검토한다. 단순 변심 정책/법정 취소권은 확정된 판매 정책을 적용하고 “디지털이므로 무조건 환불 불가”라고 작성하지 않는다.

자동 환불 또는 승인된 환불 실행은 ready commit과 같은 주문 row lock을 사용해 `payment_status=refund_pending`, 진행 job 취소, 고유 환불 outbox 생성을 한 transaction으로 확정한다. 단순 고객 환불 신청은 실행 승인과 구분한다. provider 요청 실패·재시도 중에는 refund_pending을 유지하며 검증된 명시적 복구 없이 paid로 되돌리지 않는다.

## 13. 내구성 있는 생성·수정·복구

첫 구현은 기존 프로젝트 안의 Node worker 하나와 PostgreSQL job table이면 충분하다. 메모리 배열, HTTP 응답 후 실행되는 unawaited promise, webhook 내부 긴 AI 호출로 지급을 구현하지 않는다. 별도 Redis/대규모 workflow 제품은 필요해진 뒤 판단한다.

worker는 DB에서 `FOR UPDATE SKIP LOCKED` 또는 동등한 원자적 claim으로 job을 얻고 lease/fencing token을 발급받는다. 만료된 worker가 결과를 늦게 써도 최신 token과 맞지 않으면 commit하지 못한다. process 재시작 후 작업이 복구돼야 한다. 하나의 worker라도 동일 주문 중복 요청 테스트를 통과해야 한다.

최초/수정 모두 최대 3회 시도, 제한된 backoff(예: 10초/30초), hard provider timeout, 주문 비용 상한을 적용한다. 입력/권리/동의 오류는 자동 반복하지 않는다. 같은 immutable 입력의 동일 job을 재사용하고 partial asset/text를 무조건 다시 생성하지 않는다.

수정 요청은 owner/기간/revisions_used/활성 job을 transaction 안에서 검사한다. concurrent 요청은 같은 revision job을 반환하거나 `409 REVISION_IN_PROGRESS`다. 성공한 revision 저장 시에만 `revisions_used=1`을 확정하며 첫 결과는 유지한다. 날짜/season 등이 모순되면 결제나 수정 실행 전에 고객이 수정하게 한다.

최초 결과의 delivery deadline은 provider가 검증한 실제 결제 완료 시각 + 15분이다. 지연 결제는 실제 완료 전까지 pending이며, 완료 통지가 늦어 이미 deadline을 넘겼다면 생성 대신 자동 환불 요청으로 전환한다. 최초 ready commit만 이 deadline을 검사한다. 수정은 `first_ready_at + 30일` 이내 접수 여부와 별도 15분 job timeout을 검사하며 최초 delivery deadline을 적용하지 않는다.

모든 ready commit은 주문이 아직 paid이고 refund_pending/refunded/disputed가 아닌지 다시 검사한다. 최초 결과가 deadline 내 ready가 아니면 reconciliation이 failed/cancelled + refund_pending + 환불 outbox를 원자적으로 생성한다. 재시도 중인 작업도 이 경계를 따른다. 자동 환불 요청 실패는 운영 알림 + 같은 key의 재시도이며 성공한 척하지 않는다. 수정 실패는 원본 접근을 유지하고 수정 가능 횟수를 돌려준다; 그것만으로 최초 결과 전체를 자동 환불하지 않는다.

운영 명령에는 주문 상태 조회, 만료 lease 재처리, payment 대사, 환불 상태 확인, 이메일 재발송이 필요하다. 고객 데이터/비밀키를 로그에 출력하지 않는 서버 전용 명령으로 제공하고 공개 admin endpoint를 만들지 않는다. worker와 주기적 대사는 기존 승인된 deployment 경로로 운영하며 runner에 일반 sudo/Docker 권한을 부여하지 않는다. worker 미실행은 checkout readiness 실패다.

## 14. API 경계와 테스트 가능한 오류

API 경로는 이 계약을 따른다. 인증/CSRF/rate limit은 cookie 기반 mutation 모두에 적용하고 raw signature webhook은 해당 provider 검증으로 구분한다.

| Endpoint | 계약 |
|---|---|
| `POST /api/style/drafts` | 검증된 input을 인증 owner에 저장. 과대 body/unknown enum/타인 asset 거부 |
| `POST /api/style/uploads` | 인증+동의 후 제한된 private upload 경로. 완료 시 decode/검증을 통과한 asset만 사용 |
| `POST /api/orders` | draft ID/version + SKU + idempotency key만 받음. 서버 quote/주문 생성 |
| `POST /api/orders/{id}/checkout` | 소유권/준비 상태/quote 유효성 확인. client amount/currency/priceId/userId/returnUrl 거부 |
| `POST /api/payments/{provider}/webhook` | raw body signature → durable event → 검증된 정산/환불 state. legacy Stripe route를 같은 처리기로 연결 가능 |
| `GET /api/orders/{id}` | owner의 sanitized payment/fulfillment 상태만, private/no-store |
| `GET /api/orders/{id}/result` | owner + 접근권한 확인 후 완성 result; 타인 요청은 존재 여부를 누설하지 않는 404 |
| `POST /api/orders/{id}/revision` | 허용 input patch와 version, 수정 기간/횟수/concurrency 검사 |
| `GET /api/orders/{id}/download` | 매 요청 owner+권한+만료 검사 후 private/no-store PDF stream. 직접 storage download URL 발급 금지 |
| `POST /api/orders/{id}/refund-request` | owner가 사유를 제출. 이미 환불 중이면 같은 상태 반환, 정책/자동 실패 환불과 분리 |

오류 vocabulary: `AUTH_REQUIRED`, `VALIDATION_ERROR`, `PHOTO_RETRY_REQUIRED`, `CHECKOUT_UNAVAILABLE`, `PAYMENT_PENDING`, `GENERATION_RETRYING`, `REVISION_IN_PROGRESS`, `REVISION_LIMIT_REACHED`, `RESULT_EXPIRED`, `REFUND_PENDING`, `SUPPORT_REQUIRED`. HTTP는 401/404/409/422/429/503 등 의미에 맞게 쓰고 원문 SDK/DB 오류나 secret을 고객에게 반환하지 않는다.

return URL은 서버의 고정 site origin + 허용 locale/path에서 구성한다. 외부 URL/query를 입력받아 redirect하지 않는다. 주문 ID가 있더라도 소유권 검사를 생략하지 않는다. PDF에 첨부된 사진/asset은 서버가 허용한 경로만 사용해 SSRF를 막는다.

## 15. 개인정보·보관·고객 신뢰

- 사진은 성인 본인 1명만; 타인의 사진/미성년 사진을 제출하지 않도록 입력 시 안내한다. 사진으로 연령을 추측해 통과시키지 않는다.
- JPEG/PNG/WebP, 10MB 이하, 디코딩 후 20MP 이하, 최소 가로·세로 512px. MIME뿐 아니라 실제 decoder로 검사하며 SVG/애니메이션/외부 URL은 받지 않는다. 실패는 재촬영/수동 입력으로 복구한다.
- EXIF 제거 후 축소된 processing copy만 명시된 remote vision provider로 전송한다. private upload URL은 5분 이내 만료, object path 추측 불가, 다른 계정 접근 불가.
- 원본/처리 사진은 작업 완료/실패 후 즉시 삭제하며 모든 임시 파일을 포함해 최대 24시간 TTL. raw 사진은 backup/telemetry/analytics/email에 넣지 않는다. 삭제 job과 만료 접근 차단을 모두 구현한다.
- 장기 결과에는 사진 원본 대신 palette/검수된 의상 visual/최소 관찰 필드를 저장한다. 고객 사진 비교는 사진이 유효할 때 또는 재열람 때 본인이 다시 제공했을 때만 제공하고, PDF에도 원본 얼굴을 기본 포함하지 않는다. 90일 사진 보관을 암묵적으로 약속하지 않는다.
- 사진 재사용이 필요한 수정에는 새 업로드/동의를 받고, 없으면 수동 컬러 입력으로 명시적으로 전환한다.
- 미구매 draft는 최종 활동 후 7일에 삭제한다. 구매 시 주문 전용 immutable input snapshot을 보존하며 draft 삭제가 주문 snapshot·결과를 연쇄 삭제하지 않게 한다. 모든 결과 버전과 필요한 스타일 snapshot은 `first_ready_at + 90일`에 만료·삭제하며 수정으로 기간을 연장하지 않는다. 고객의 조기 삭제 요청은 별도로 적용한다. 결제/법정 보관 기록은 스타일 데이터와 분리하고 실제 판매자 의무에 맞는 기간을 확정한다.
- provider의 보관/data-use/처리 지역 조건을 실제 계약으로 확인하고 고객에게 설명한다. 사실 확인 없이 “어디에도 저장되지 않는다”, “100% private”라고 광고하지 않는다.
- 이메일 OTP/거래 결과 전달만 수행한다. 마케팅 수신 동의는 별도이며 구매 조건으로 강제하지 않는다. 이미지/입력/결과를 광고 프로파일에 사용하지 않는다.
- 사업자 이름/문의처/응답 목표(기본 2영업일)/영수증/정책 링크가 실제로 작동해야 한다. 응답 가능한 운영자가 없으면 상담/검수 서비스를 판매하지 않는다.

## 16. 가격·비용·전환 측정

가격은 고객 가치 가설이다. “AI 원가가 싸다”는 근거로 사용자 가치나 이익이 검증됐다고 판단하지 않는다. raw API cost만으로 순이익을 계산하지 않는다.

첫 SKU 기본 운영 상한: 최초+포함 수정의 text/vision 호출 합계 **USD 0.60/order**. 이는 provider 가격 사실이 아니라 서버에서 강제할 예산이다. static 카탈로그 visual을 사용해 런타임 이미지 생성 비용을 배제한다. 공급자별 실제 청구와 retry를 측정하고 예산 안에서 품질이 나오지 않으면 판매 전 경로/가격을 수정한다. 이미 결제한 주문에서 비용 초과를 숨겨 저품질 결과로 바꾸지 않는다.

기록: SKU/price version, net collected amount, payment/FX/tax 처리 비용, AI/infra 비용, 실패/재시도, 환불/chargeback, 지원 시간. 사진·이메일·자유 입력은 분석 이벤트에 넣지 않는다. 내부 목표는 첫 상품의 p95 변동비가 세금 제외 수입의 25% 이내이고 획득 비용까지 감안해 양의 contribution을 만드는 것이다. 실제 수치가 생기기 전에는 목표라고 표시한다.

Funnel events: `style_started`, `free_preview_ready`, `sample_viewed`, `offer_viewed`, `checkout_started`, `payment_verified`, `stylebook_ready`, `result_opened`, `result_saved`, `revision_requested`, `refund_confirmed`, `merchant_clicked`. 결제·ready·환불은 서버 event로 중복 제거한다. 개인정보/동의 조건에 맞는 first-party 분석만 사용한다.

첫 검증 표본은 **지인 제외 유료 고객 20명**이다. 이것만으로 product-market fit이라고 선언하지 않는다. 최소한 유입 출처/offer 전환/결제 실패/결과 열람/저장/지원·환불 사유를 함께 본다. 이탈 위치에 따라 유입·샘플 가치·가격·checkout·결과 품질 중 하나를 개선한다. 작은 표본에서 가격/화면/채널을 동시에 바꿔 원인을 잃지 않는다.

검증되지 않은 대규모 광고 집행은 기본 작업 범위가 아니다. 초기 허가된 사진/자체 샘플로 스타일 비교·궁궐 배경별 코디 콘텐츠를 만들고, 허용 preset을 담은 `/style` URL로 연결한다. 유료 광고/외부 게시/파트너 연락은 실제 사용자 권한과 예산이 있을 때만 실행한다. 후기·매출·재고·파트너 로고를 만들어내지 않는다.

## 17. 후속 수익 기능의 진입 조건

| 후보 | 추가하는 조건 / 경계 |
|---|---|
| 커플 스타일북 | 첫 20명 피드백에서 수요 확인 + 두 사람의 각각 동의/권한/원가 측정. 첫 SKU를 몰래 다인 상품으로 확장하지 않음 |
| 대여·촬영·컬러 상담 referral | 실제 affiliate/파트너 승인과 추적·수수료 조건 확인. 일반 링크를 넣고 매출 발생이라고 보고하지 않음 |
| 사주/K-Culture 유료 | 계산·입력 불확실성·문화적 설명과 실제 상품 샘플 완성. 미래 예측 정확성을 판매하지 않음 |
| Naming Studio | 한국어 자연스러움/한자 의미/발음 검수, 수정·담당자 운영 확보. 과거 $149–150는 후보 가격일 뿐 확정 매출/첫 SKU 아님 |
| Trip Pass/credits | 여러 유료 기능의 반복 구매와 묶음 수요가 실제로 확인될 때. 그 시점에 별도 wallet 명세/마이그레이션 검토 |
| 실시간 통역 | 품질·지연·원가·현장 사용 수요·분 단위 entitlement를 검증한 뒤. 과거 특정 모델/포함 분수는 출시 약속 아님 |

## 18. 실행 순서 — 다른 agent가 바로 시작할 작업

각 slice는 이전 완료 상태를 확인하고 이어간다. 먼저 거대한 research matrix/전체 플랫폼 재작성/새 디자인 시스템을 만들지 않는다.

| Slice | 구현 범위 | 완료 증거 |
|---|---|---|
| S0 · Fresh baseline | 최신 main/관련 branch/PR/현재 runtime 차이, 아래 live blockers 확인 | handoff에 source SHA와 현재 기능/목표 차이, 5줄 이내 다음 작업 |
| S1 · 판매 결과 샘플 | 카탈로그 최소 12개, fixture 3개, 결과 renderer, 공개 sample route, 출처/기본 PDF | 실제 모바일/desktop에서 세 샘플 열람, 이미지 정상, 샘플이라는 표기 |
| S2 · 무료→유료 진입 | `/style` 입력, local free preview, 기존 color/hanbok bridge, 홈/가격/FAQ/상태, 6개 locale | 무료 완료→샘플→offer 동선 작동, 기존 무료 기능 유지 |
| S3 · 계정·주문·private 저장 | 이메일 OTP, owner/RLS, migrations, input snapshots, private result skeleton, fake payment adapter | 두 계정 간 격리, 재로그인/재열람, client 가격 조작 거부 |
| S4 · 실제 유료 결과 엔진 | photo consent/validation, catalog ranking/설명, worker, revision, PDF, TTL, email outbox | fixture별 결과 차이, 모델 실패/restart/중복 요청 복구. 테스트 주문만 사용 |
| S5 · Provider 결합 | 적격 provider 하나, checkout, signature/settlement, durable events, 대사, refunds | test-mode 결제→실제 결과→재수령→환불. 성공 URL만으로 결과 접근 불가 |
| S6 · 판매 시작 | 실제 정책/사업자/지원, live config, 최소 검증, exact-SHA release, 운영 준비 | 승인된 live activation, 실제 환경의 결과/환불/알림 확인. 실제 고객 결제는 별도 증거 |
| S7 · 첫 20명 개선 | 허가된 유입·funnel·구매자 피드백·원가 | 실제 데이터에 따른 한 가지 개선과 결과 기록 |

S1의 public sample은 항상 볼 수 있다. S3~S5가 미완료면 checkout을 disabled 상태로 유지하고 “구매 가능”이라고 표시하지 않는다. provider 계약 확인은 S0부터 비동기로 진행할 수 있으며 외부 대기 중에도 S1~S4를 진행한다. 운영자 정보/credentials를 임의로 만들지 않고, 꼭 필요한 사용자 설정을 한 번에 정리한다.

## 19. 최소 검증과 판매 차단 조건

모든 작은 변경에 수십 개의 새 검증을 추가하지 않는다. 코드/화면 변경은 기존 `npm run build`(내장 contract tests 포함), 변경한 영역의 핵심 테스트, broken image, 주요 렌더링, 치명적 회귀를 확인한다. 같은 SHA에서 통과한 테스트를 이유 없이 반복하지 않는다. 문서-only 변경은 링크/상호 모순/변경 범위를 확인하고 불필요한 runtime 배포를 하지 않는다.

첫 paid release에서 추가로 필수인 시나리오:

1. no-photo 및 유효한 consented photo가 각기 올바른 표시로 완성된 세 룩을 낸다. 사진 저품질/잘못된 파일/동의 거부는 복구 가능하다.
2. mood/palette/comfort 변경이 검수 fixture에서 의미 있는 결과 차이를 만들고, 추천 이유가 실제 입력과 맞는다.
3. 360px 모바일/desktop에서 주요 흐름이 렌더링되고 6개 locale의 핵심 결제·정책·오류 문구가 누락되지 않는다. keyboard/form/focus 확인.
4. 유효한 주문만 checkout 가능. amount/currency/priceId/userId/returnUrl 주입, unknown SKU, 타인 draft/asset/order/result/PDF, 미설정 secrets/flags를 거부한다.
5. invalid signature, unpaid completed event, duplicate/reordered/delayed events, provider timeout을 처리한다. 한 번의 paid 주문에 한 번만 최초 결과를 지급한다.
6. 결제 후 브라우저 종료, worker 강제 재시작, 두 worker의 같은 job, 같은 수정 동시 요청에서 유실/중복/이중 수정 차감이 없다.
7. refund가 generation 중 도착해도 결과 권한이 되살아나지 않는다. delivery deadline, refund 재시도, 이메일 실패, 재열람/다운로드를 확인한다.
8. 사진 TTL/EXIF 제거/비공개 storage/로그 최소화가 실제로 적용되고 구매 결과·사진이 public cache/sitemap에 노출되지 않는다.

unit/integration 테스트는 mock SDK/고정 fixture를 사용한다. 실제 provider는 명시적인 test-mode E2E에서만 호출한다. 실제 비용이 드는 테스트/실거래는 사용자 승인 범위에서만 수행한다. 테스트 성공을 실제 구매/매출 또는 production 배포 성공으로 확대하지 않는다.

판매 차단: 결과 제공 기능 부재, 다른 사용자 데이터 접근, 중복 결제/지급, 거짓 성공 화면, 핵심 이미지 실패, 권리 없는 콘텐츠, 미확인 merchant eligibility, 정책/문의처 미설정, worker/refund 복구 불가. 이 상태에서 flag만 켜지 않는다.

## 20. Release와 handoff

GitHub public source에 production runner를 직접 연결하지 않는다. runtime 변경은 최신 main 기반 isolated branch → 필요한 검증 → exact feature SHA의 private MiniPC CI → PR merge → exact merged SHA의 승인된 배포 → local/public/sitemap/P0 smoke 순서를 따른다. 다른 agent 변경은 보존하고 관련 branch의 겹치는 변경만 확인한다.

운영 기본 경계: `korea-concierge.service`, origin `127.0.0.1:3100`, private CI-controlled deployment, 별도의 Korea tunnel. 일반 sudo/Docker/host 권한을 runner에 추가하지 않는다. unrelated n8n/tunnel을 수정하지 않는다. 실제 530/1033/502 등 incident가 열려 있으면 runtime release를 멈추고 최신 private evidence로 해결한다. 오래된 MD의 incident 상태/고정 SHA를 최신 사실로 취급하지 않는다.

문서-only 게시에는 앱 배포나 production flag 변경이 필요 없다. docs-only PR 검증 범위를 설명하고 main에 반영된 파일을 확인한다. 후속 구현이 시작되면 최신 workflow가 요구하는 실제 release gate를 다시 읽는다.

handoff 최신 항목에는 실제 변경, source/PR/CI/deploy 증거(있는 것만), 통과한 테스트, 미완료, 다음 slice, 사용자만 할 수 있는 설정을 기록한다. 기존 이력은 보존하고 과거 스냅샷은 표시한다. 구조/가격을 바꿀 경우 이 명세의 관련 절과 decision log를 함께 수정한다.

## 21. 출시 전 외부 설정 — 개발을 멈추지 않는 명시적 경계

다음은 저장소만으로 확정할 수 없다. 다른 구현을 먼저 진행하고 실제 필요 시 묶어서 요청한다. 비밀값을 채팅/MD에 붙여 넣으라고 하지 않는다.

- 실제 판매자 사업자 국가·이름·주소·지원 이메일·정산 계정·provider 심사.
- 선택한 DB/Auth/Storage 프로젝트와 transactional email sender/domain 인증.
- 적격 결제 provider의 test/live key, webhook secret, 서버 catalog Price ID/통화/세금 설정.
- photo/text provider의 서버 key와 해당 서비스의 데이터 처리 조건.
- 판매자에게 적용되는 약관·디지털 제공/환불·보관 정책의 확정.
- 실제 사용 권리가 확인된 이미지/제휴 계약이 필요한 경우 그 허가.

credential이 없어도 구현·mock 테스트·공개 샘플·testable migration까지 진행할 수 있다. 외부 설정이 없는데 live-ready/결제 완료/고객 수령 성공이라고 보고하지 않는다.

## 22. 변경 결정 기록과 참고

2026-09-07 사용자 승인 방향을 구체화하며 결정:

- 사업 목표를 실제 판매와 contribution으로 둔다. 첫 상품은 My Korea Look, USD 12 가설, 성인 1인/성공 수정 1회.
- 첫 구매는 단품 권한으로 구현한다. 전 기능 공용 credits/Trip Pass는 초기 필수 의존성에서 제외한다.
- 큰 시각 결과와 현장 실행 정보를 결합한다. PDF는 보관 수단, 원격 모델/실시간 생성 이미지는 가치 자체가 아니다.
- 6개 언어와 기존 무료 기능을 보존한다. Naming/사주/통역/커머스는 각각 준비된 상품으로 후속 확장한다.
- 과거 기획과 운영 이력은 삭제로 소실시키지 않고 보관/상태 표시한다. 아래 공식 링크의 provider 사실은 구현 시 다시 확인한다.

짧은 근거와 공식 참고(2026-09-07 확인/조회):

- [무료 컬러 분석 사례](https://colorwise.me/welcome): 단순 분류만으로 유료 차별화를 주장할 수 없음.
- [한국 현장 컬러 상담 상품](https://www.klook.com/en-US/activity/113112-seoul-personal-color-test/): 실행 가능한 스타일링을 결합하는 사례. 우리 온라인 상품의 지불 의사를 증명하지는 않음.
- [Stripe 판매자 지원 국가](https://stripe.com/global), [Toss 해외결제](https://docs.tosspayments.com/guides/v2/learn/foreign-payment): 고객 카드 지원과 판매자 가입/정산 자격 구분.
- [Stripe Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment): redirect에 의존하지 않는 서버 지급과 중복 대응.
- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [이메일 passwordless auth](https://supabase.com/docs/guides/auth/auth-email-passwordless): 기본 저장소/인증 후보의 공식 구현 참고.
- [Klook affiliate](https://affiliate.klook.com/): 별도 승인/계약 후 referral 수익 연결.

## 23. 다음 구현 agent에게 줄 실행 문장

> Korea Concierge의 `docs/BUILD_SPEC.md`를 읽고 최신 main 및 `PROJECT_HANDOFF.md`의 현재 상태를 확인하라. 미완료인 가장 앞의 slice부터 실제 고객 결과까지 구현하라. 첫 목표는 My Korea Look의 세 가지 판매 샘플과 개인화 흐름이며, 최종 목표는 적격 해외 고객의 일회성 결제 → 비공개 스타일북 수령 → 재열람/수정/환불 복구다. 기존 무료 기능/6개 언어/사용자 변경을 보존하고, 과거 Trip Pass나 전체 서비스 선행 기획을 첫 판매의 필수 의존성으로 복원하지 마라. 외부 설정이 필요하면 독립 작업을 먼저 마치고 정확한 설정만 요청하라. 구현·테스트·CI·배포·실결제·매출을 구분해 사실대로 보고하라.
