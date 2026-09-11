# AI Shopping Shorts Editor — Project Master Plan

> **이 문서는 이 프로젝트의 장기 기준 문서다.**
>
> 목적, 제품 방향, 개발 철학, 우선순위, 품질 기준, 비용 기준, 개선 판단 기준은 이 문서를 먼저 따른다. 구현 현황과 최신 SHA/현재 문제는 `docs/HANDOFF.md`, 세부 반복 개선 기록은 `docs/loop-history/`, 기술적 학습 규칙은 `docs/LOOP_ENGINEERING.md`가 담당한다.
>
> 과거 채팅 기억보다 최신 GitHub source와 이 문서를 우선한다. 단, 사용자가 이후 명시적으로 방향을 바꾸면 최신 사용자 지시가 이 문서보다 우선하며, 그 결정은 이 문서에도 반영한다.

## 1. 사용자가 원하는 제품

사용자는 상품 쇼츠를 만들 때 여러 개의 원본 영상을 사람이 일일이 보면서 장면을 찾고, 대본/TTS에 맞춰 1~몇 초 단위로 자르고, 서로 다른 원본을 섞어 배치하는 반복 작업을 최대한 자동화하고 싶다.

이 제품은 **원본 영상 2~6개 + 대본/SRT/TTS를 넣으면, AI가 각 영상의 의미 있는 장면을 이해하고 내레이션의 의미와 시간에 맞춰 짧은 컷들을 재조합하여 9:16 Shopping Shorts용 MP4를 만드는 로컬 자동 컷 편집기**다.

중요한 것은 여러 영상을 통째로 순서대로 붙이는 것이 아니다. 각 원본을 작은 semantic segment로 분해하고, 쇼츠 전체 타임라인 곳곳에 적합한 장면을 다시 배치하는 것이 핵심이다.

사용자는 자막 디자인, 효과, 음악 등 후반 연출은 별도 도구에서 처리할 수 있으므로 현재 제품 범위는 **CUT ONLY**다.

## 2. 최종 목표

최종 목표는 사용자가 다음 정도만 하면 되는 제품이다.

1. 상품 원본 영상 여러 개를 넣는다.
2. 대본과 TTS를 넣고, 있으면 SRT도 넣는다.
3. 비용/품질 모드를 고른다.
4. 자동 편집을 실행한다.
5. 결과 영상과 타임라인을 확인한다.
6. 마음에 들지 않는 일부 컷만 후보 중에서 바꾼다.
7. 추가 AI 비용 없이 다시 렌더한다.

좋은 결과의 정의는 단순히 오류 없이 MP4가 나오는 것이 아니다.

- 내레이션이 말하는 내용과 화면이 의미상 맞아야 한다.
- 컷 전환이 TTS/SRT 의미 경계를 자연스럽게 따라야 한다.
- 같은 영상만 길게 이어지거나 같은 segment가 반복되지 않아야 한다.
- 제품이 잘 보이고 사용 가치가 있는 장면을 우선해야 한다.
- 지나치게 짧은 flash cut이나 이유 없는 긴 정지감이 없어야 한다.
- 결과가 마음에 들지 않을 때 전체 AI 분석을 다시 돌리지 않고 쉽게 수정할 수 있어야 한다.
- 실패한 실행이 이전 정상 결과물을 깨뜨리지 않아야 한다.

## 3. 제품 철학

### 3.1 AI는 판단하고, FFmpeg는 실행한다

AI는 장면 의미 분석, 장면 선택, 편집 의사결정을 담당한다. 실제 미디어 처리는 FFmpeg/FFprobe가 결정론적으로 수행한다.

AI가 free-form으로 직접 렌더 명령을 실행하게 하지 않는다. 반드시 validated EDL(Edit Decision List)을 중간 계약으로 둔다.

```text
Video -> segmentation -> semantic metadata
Script/SRT/TTS -> beat timeline
metadata + beats -> AI edit decision
AI decision -> validated EDL
validated EDL -> deterministic FFmpeg render
```

### 3.2 AI를 많이 쓰는 것이 품질이 아니다

가능한 것은 먼저 deterministic logic, cache, validation, local computation으로 해결한다.

AI 호출을 늘릴 때는 다음 중 하나가 입증되어야 한다.

- semantic match가 유의미하게 좋아진다.
- 사용자의 수동 교체율이 줄어든다.
- 실패율이 줄어든다.
- 비용 증가보다 품질 개선 가치가 크다.

단순히 더 강한 모델이나 더 많은 프레임을 보내는 것은 개선으로 간주하지 않는다.

### 3.3 마지막 정상 결과는 자산이다

업로드, 분석, 렌더, 수동 교체, JSON 저장 중 하나가 실패해도 마지막 completed generation은 가능한 한 그대로 보존한다.

MP4, beats, segments, EDL, QA는 항상 같은 완료 세대를 가리켜야 한다. mixed generation을 정상 상태로 인정하지 않는다.

### 3.4 사용자가 해야 할 일은 최소화한다

개발/운영에서도 가능한 작업은 코드와 자동화로 처리한다. 사용자가 직접 해야 하는 일은 API 로그인, OS/서버 권한, 실제 영상 제공처럼 외부 권한이 필요한 최소 작업으로 제한한다.

사용자에게 수동 작업을 요청하기 전에는 먼저 GitHub/code/configuration에서 대신 처리할 수 있는 부분이 없는지 확인한다.

## 4. 절대 유지할 제품 범위

### 포함

- 2~6개 원본 영상 입력
- streaming upload
- FFprobe media inspection
- scene/shot candidate detection
- 쇼츠용 semantic segment normalization
- representative frame extraction
- Vision semantic analysis
- script/SRT/TTS beat timeline
- semantic beat-to-scene matching
- EDL generation / repair / validation
- 9:16 deterministic FFmpeg rendering
- Economy / Balanced / Quality 모드
- 자동 QA
- AI usage/token/cost telemetry
- Vision analysis cache
- review timeline / alternatives
- manual cut replacement
- 추가 AI 호출 없는 rerender
- failure-safe persistence / recovery

### 현재 비포함

- 자막 스타일링
- 자동 스티커/그래픽
- 줌/트랜지션/화려한 효과
- BGM/효과음 생성
- 썸네일 제작
- YouTube 자동 업로드
- 생성형 영상 제작

범위를 넓히기 전에는 CUT ONLY 핵심 품질과 reliability가 충분히 검증되어야 한다.

## 5. 편집 품질의 우선순위

편집 의사결정은 기본적으로 아래 순서를 따른다.

1. **내레이션 ↔ 화면 의미 일치**
2. **제품 가시성 / usable shot quality**
3. **타이밍 자연스러움**
4. **중복 억제 / source 다양성**
5. **미학적 다양성**

단순히 source를 다양하게 섞기 위해 의미가 덜 맞는 장면을 선택하지 않는다.

### 컷 길이

- 일반적인 시각 변화는 약 1.5~3.2초를 지향한다.
- 고정 2.5초 식의 기계적 편집은 하지 않는다.
- SRT/TTS 의미 경계가 우선이다.
- 0.x초 micro-beat/flash cut은 가능한 한 병합한다.
- 긴 beat는 장면 변화가 필요한 경우 의미를 보존하며 분할할 수 있다.

### 중복 / 연속성

- 동일 segment 재사용은 기본 금지한다.
- 같은 source가 과도하게 연속되는 것을 피한다.
- 단, source 다양성 때문에 의미 일치를 희생하지 않는다.

## 6. 비용 정책

OpenCode Go 비용은 제품 품질과 함께 핵심 제품 지표다.

기본 원칙:

- 모든 프레임을 Vision에 보내지 않는다.
- representative frames를 사용한다.
- batch Vision을 사용한다.
- 동일 원본/동일 분석 조건은 cache한다.
- cache payload는 신뢰하지 않고 schema + 내용 validation을 거친다.
- Economy/Balanced에서는 불필요한 Judge를 사용하지 않는다.
- Quality Judge는 최종 선택처럼 가치가 큰 좁은 구간에만 쓴다.
- manual replacement는 기본적으로 AI 0-call이어야 한다.
- malformed AI response 때문에 재호출을 반복하는 구조를 만들지 않는다.
- API 호출, tokens, cache hit ratio, 예상 비용을 계속 측정한다.

비용 최적화 때문에 semantic quality가 명백히 떨어지면 안 되고, 품질 향상이라는 이유만으로 비용을 무제한 늘려서도 안 된다.

## 7. 신뢰성 / 데이터 안전 기준

다음은 기능보다 우선하는 불변조건이다.

- API key와 secret을 repository에 commit하지 않는다.
- 원본 사용자 영상을 GitHub에 commit하지 않는다.
- workspace/generated media를 commit하지 않는다.
- upload 중 partial file을 정상 input으로 등록하지 않는다.
- 같은 project의 `/upload`, `/run`, `/replace` mutation은 충돌하지 않게 serialize한다.
- lock 획득 전 stale `project.json` snapshot으로 최신 상태를 덮지 않는다.
- AI response는 ID/type/range/schema contract를 검증한다.
- cache hit도 live response와 같은 수준으로 검증한다.
- EDL은 gap/overlap/source range/program duration invariant를 만족해야 한다.
- failed rerender/run은 마지막 정상 generation을 가능한 한 보존한다.
- multi-artifact publish 중 실패하면 rollback한다.
- crash residue cleanup은 provenance가 명확한 tool-owned file만 보수적으로 처리한다.

## 8. UX 원칙

사용자에게 편집 시스템 내부 구조를 이해하도록 요구하지 않는다.

우선 UX는 다음과 같다.

- 파일 넣기
- 대본/TTS/SRT 넣기
- 품질 모드 선택
- 실행
- 결과 확인
- 마음에 안 드는 컷만 교체

EDL/QA/API telemetry는 고급 사용자와 디버깅에 유용하지만, 일반 사용 흐름을 복잡하게 만들면 안 된다.

오류 메시지는 가능한 한 다음을 알려야 한다.

- 무엇이 실패했는지
- 기존 결과가 보존되었는지
- 다시 시도해도 되는지
- 사용자가 실제로 해야 할 일이 있는지

## 9. 개선 우선순위

새 기능보다 아래 순서를 우선한다.

### P0 — 결과 신뢰성

- 데이터 손상 / mixed generation 방지
- mutation race 방지
- invalid EDL 방지
- malformed AI response 방지
- crash/restart recovery

### P1 — semantic edit quality

- caption/TTS ↔ visual match
- 제품이 잘 보이는 usable shot 선택
- 중복/동일 source 연속 억제
- Quality Judge 실효성
- manual replacement rate 감소

### P2 — TTS/SRT 타이밍

- gap/overlap/out-of-order cue
- micro-beat
- long beat
- SRT 없는 TTS alignment 품질
- final duration accuracy

### P3 — 비용/속도

- Vision payload 절감
- cache hit ratio
- planner input 축소
- 불필요한 AI retry 제거
- memory/runtime/FFmpeg 효율

### P4 — review UX

- 더 빠른 alternative 비교
- current/previous segment rollback
- timeline lock/regenerate
- QA를 이해하기 쉬운 형태로 노출

P0~P4가 안정된 이후에만 CUT ONLY 밖의 기능을 검토한다.

## 10. 개선안을 채택하는 기준

모든 개선은 다음 질문을 통과해야 한다.

1. 실제 문제나 실패 근거가 있는가?
2. 사용자가 체감할 품질/속도/신뢰성/비용 개선인가?
3. 더 단순한 deterministic 해결책은 없는가?
4. API 비용을 늘린다면 그만한 품질 근거가 있는가?
5. CUT ONLY 범위를 흐리지 않는가?
6. 기존 정상 동작을 회귀시키지 않는가?
7. targeted test 또는 E2E 검증 방법이 있는가?
8. rollback 가능한가?
9. 문서/HANDOFF가 새 상태와 일치하는가?

근거가 약하면 억지로 코드를 바꾸지 않는다. **NO-OP도 올바른 엔지니어링 결과**다.

## 11. 측정해야 할 핵심 지표

### 품질

- caption↔visual judge score
- manual replacement rate
- duplicate segment rate
- same-source run length
- invalid EDL count
- output duration error
- render/QA failure rate

### 비용

- Vision calls
- Planner calls
- Judge calls
- prompt/completion/cached tokens
- cache hit ratio
- 영상 1개당 AI supplier cost

### 성능/안정성

- end-to-end processing time
- peak memory
- FFmpeg failure rate
- recovery/rollback failures
- stale/partial artifact incidents

숫자가 아직 측정되지 않은 지표는 추정치를 성과처럼 보고하지 않는다.

## 12. 개발 방식

모든 개발/개선 회차는 다음 흐름을 기본으로 한다.

```text
latest GitHub branch/PR/source 확인
        ↓
PROJECT_MASTER_PLAN.md 확인
        ↓
HANDOFF.md + 최신 loop-history 확인
        ↓
가장 가치 높은 실제 문제 1개 선택
        ↓
최소 범위 수정
        ↓
targeted test / npm run check / FFmpeg demo 가능한 만큼 검증
        ↓
회귀/보안/비용 영향 확인
        ↓
commit
        ↓
loop-history 기록
        ↓
HANDOFF.md 최신화
```

GitHub Actions availability나 GitHub-hosted minutes 부족은 제품 패치 자체의 blocker로 사용하지 않는다. Mini PC self-hosted runner가 있으면 추가 검증 증거로 사용한다.

## 13. 문서 역할 / 우선순위

충돌이 있을 때 기본 우선순위는 다음과 같다.

1. **사용자의 최신 명시적 지시**
2. **`docs/PROJECT_MASTER_PLAN.md`** — 목적/기획/개선 기준
3. **최신 GitHub source + tests** — 실제 구현 사실
4. **`docs/HANDOFF.md`** — 현재 상태/완료/로드맵/사용자 액션
5. **`docs/ARCHITECTURE.md` / `docs/PRD.md`** — 상세 설계/초기 요구사항
6. **`docs/LOOP_ENGINEERING.md`** — 반복 개선 운영 규칙과 durable lessons
7. **`docs/loop-history/`** — 각 회차의 근거와 변경 역사

문서가 실제 코드와 다르면 사실관계는 최신 source/tests를 따른 뒤 문서를 고친다. 그러나 제품 방향이 이 Master Plan과 충돌한다면 임의로 방향을 바꾸지 말고 명시적인 제품 결정으로 처리한다.

## 14. 현재 사용자 운영 원칙

개발자는 가능한 일을 최대한 스스로 처리하고 사용자가 반드시 해야 하는 작업만 짧게 요청한다.

사용자에게 보고할 때 기본 형식은 짧게 유지한다.

- 완료
- 검증
- 다음 단계
- 내가 해줄 일

세부 기술 근거는 GitHub 문서와 loop-history에 남긴다.

## 15. 장기 완료 기준

제품이 “완성도 높은 자동 컷 편집기”라고 부를 수 있으려면 최소한 다음이 충족되어야 한다.

- 대표적인 실제 상품 영상 조합에서 의미 매칭 품질이 안정적이다.
- TTS/SRT 길이가 달라져도 timeline/MP4가 깨지지 않는다.
- 반복 실행에서 cache와 비용 제어가 안정적이다.
- AI malformed response가 잘못된 EDL로 이어지지 않는다.
- upload/run/replace 실패와 일반적인 crash 상황에서 이전 정상 결과가 보존된다.
- 사용자는 대부분의 영상을 자동 편집 후 소수 컷만 수정하면 된다.
- Mini PC 또는 로컬 환경에서 unit/protocol test + synthetic FFmpeg E2E를 반복 검증할 수 있다.
- 새 AI/개발자가 과거 채팅 없이 이 문서와 HANDOFF만 읽고 안전하게 이어서 작업할 수 있다.

---

**이 문서는 단순 설명서가 아니라 프로젝트의 제품 헌장(Product/Engineering Constitution)이다.** 의미 있는 방향 변경이 있을 때만 수정하고, 일상적인 구현 진척과 SHA는 `HANDOFF.md`에서 관리한다.