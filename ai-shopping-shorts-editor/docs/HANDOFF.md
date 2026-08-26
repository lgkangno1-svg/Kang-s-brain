# AI Shopping Shorts Editor — Project Handoff / Living Status

> 이 문서는 이 프로젝트의 **공식 인수인계 기준 문서(source of truth)** 다. 다른 AI, 개발자, Codex 세션이 작업을 이어받을 때 반드시 이 문서와 최신 GitHub 상태를 먼저 확인한다.
>
> **업데이트 규칙:** 코드, 설정, 테스트, CI, 비용 구조, 보안 정책, 제품 범위, 로드맵, 현재 우선순위 중 하나라도 의미 있게 바뀌면 **같은 작업 회차에서 이 문서도 갱신**한다. 이 문서만 믿고 과거 코드 상태를 가정하지 말고, 항상 최신 branch/PR/source를 먼저 대조한다.

## 1. 프로젝트 한 줄 정의

여러 개의 상품 원본 영상을 장면 단위로 잘게 분해하고, 사용자가 제공한 **대본/SRT/TTS의 의미와 시간에 맞춰** 원본 구간을 재조합하여 **YouTube Shopping Shorts용 9:16 컷 편집 MP4**를 만드는 로컬 AI 보조 편집기다.

핵심은 영상 3~4개를 통째로 이어 붙이는 것이 아니라, 각 영상을 작은 semantic segment로 나눠 **나레이션의 각 Beat마다 가장 맞는 장면을 여러 원본에서 섞어 쓰는 것**이다.

## 2. 개발 의도

사용자는 자막 디자인, 효과, 음악 등 후반 작업을 직접 할 수 있다. 가장 반복적이고 시간이 많이 드는 부분은 다음이다.

1. 여러 상품 원본 영상에서 쓸 만한 장면을 찾기
2. 장면이 무엇을 보여주는지 이해하기
3. 나레이션/TTS 타이밍에 맞춰 장면 길이를 자르기
4. 같은 원본만 연속되지 않도록 다양성을 유지하기
5. 최종 결과를 사람이 다시 검수하고 일부 컷만 빠르게 교체하기

따라서 이 프로젝트는 **AI를 의미 판단/편집 결정에 사용하고, FFmpeg를 결정론적 실행 엔진으로 사용**한다.

목표는 “AI가 영상을 생성하는 제품”이 아니라 **AI가 EDL(Edit Decision List)을 잘 만드는 제품**이다.

## 3. 최종 제품 목표

### 사용자 입장 목표

- 원본 영상 2~6개를 넣는다.
- 대본과 TTS, 가능하면 SRT를 넣는다.
- Economy / Balanced / Quality를 고른다.
- 자동 편집을 실행한다.
- AI가 각 영상의 장면을 분석하고 나레이션 의미에 맞게 컷을 재조합한다.
- 결과 MP4와 타임라인을 검토한다.
- 마음에 들지 않는 컷만 대체 후보로 바꾸고 **추가 AI 비용 없이 재렌더**한다.

### 품질 목표

- SRT/TTS Beat와 컷 전환이 자연스럽게 맞는다.
- 평균 시각 변화는 대략 1.5~3.2초 범위를 지향하되, 고정 길이보다 narration 의미 경계를 우선한다.
- 의미 일치 > 소스 다양성 > 미학적 다양성 순으로 판단한다.
- 동일 segment의 중복 사용을 기본 금지한다.
- 같은 source가 불필요하게 길게 연속되는 것을 줄인다.
- 렌더 결과와 EDL/QA 상태가 항상 같은 버전을 가리킨다.

### 비용 목표

- 전체 비디오 프레임을 AI에 보내지 않는다.
- 대표 프레임과 batch Vision을 사용한다.
- 같은 원본/같은 분석 설정은 Vision cache를 재사용한다.
- Economy/Balanced에서는 불필요한 Judge 호출을 하지 않는다.
- 사용자 수동 컷 교체는 추가 AI 호출 0회로 처리한다.
- 품질 개선 근거 없이 AI 호출 수/토큰 사용량을 늘리지 않는다.

## 4. 명확한 제품 범위

### 포함 — CUT ONLY

- 장면 탐지/segment 정규화
- 대표 프레임 추출
- 장면 의미 분석
- 대본/SRT/TTS Beat 생성
- semantic 장면 매칭
- EDL 생성/검증/repair
- 9:16 FFmpeg 렌더
- 품질 모드별 AI 비용 조절
- 결과 QA
- 대체 컷 검토/수동 교체/재렌더

### 현재 비포함

- 자동 자막 스타일링
- 스티커/그래픽
- 효과/트랜지션/줌
- 배경음악/효과음
- 썸네일
- YouTube 자동 업로드
- 생성형 영상 제작

새 기능을 추가할 때 CUT ONLY 범위를 깨지 않는지 먼저 확인한다.

## 5. 현재 저장소 / 작업 위치

- Repository: `lgkangno1-svg/Kang-s-brain`
- Project directory: `ai-shopping-shorts-editor/`
- Active PR: `#1 — feat: bootstrap AI Shopping Shorts Editor MVP`
- Active branch: `feat/ai-shopping-shorts-editor-bootstrap`
- Base branch: `main`
- 이 문서 작성 직전 확인한 starting HEAD: `db3cbfce98ec07f78f0d61ee1232e0cf0d1ee3e7`
- 당시 PR 규모: 138 commits / 61 changed files

중요: 위 SHA/통계는 snapshot이다. 작업 시작 시 `PR #1` 또는 successor PR의 최신 HEAD를 다시 확인해야 한다.

## 6. 현재 아키텍처

```text
Browser UI
  -> local Node HTTP server
    -> streaming uploads
    -> FFprobe metadata
    -> FFmpeg scene scoring
    -> normalized short semantic segments
    -> representative JPEG frames
      -> OpenCode Go Vision metadata (cached)

Script / SRT / TTS
  -> Beat timeline

Beat + semantic segment metadata
  -> OpenCode Go Edit Director / Planner
  -> deterministic repair + EDL validation
  -> optional Quality Vision Judge
  -> final EDL

EDL
  -> deterministic FFmpeg renderer
  -> 1080x1920 H.264/AAC MP4
  -> QA JSON

Review UI
  -> alternative clip selection
  -> no-AI rerender transaction
```

## 7. 현재 AI 모델 / 연동

기본 설정:

- Vision: `deepseek-v4-flash-vision-exp`
- Planner: `deepseek-v4-flash`
- API: OpenCode Go OpenAI-compatible chat completions

모델 ID는 편집 로직과 분리된 설정값으로 취급한다. 모델 교체가 EDL/renderer 구조를 깨뜨리지 않아야 한다.

실제 AI 모드에서 API key가 제공됐는데 Vision/Planner가 실패한 경우, “AI 편집 성공”처럼 조용히 deterministic fallback으로 위장하지 않는 방향으로 강화되어 있다. API key가 없는 테스트 모드의 deterministic fallback은 유지한다.

## 8. 현재 품질 모드

### Economy

- 대표 프레임 약 384px
- 큰 Vision batch
- source당 후보 수 제한을 더 작게 유지
- Judge 생략
- 비용 최소화 우선

### Balanced

- 기본 모드
- 대표 프레임 약 512px
- 중간 Vision batch
- Planner 사용
- Judge 생략
- 비용/품질 균형

### Quality

- 대표 프레임 약 640px
- 더 작은 Vision batch
- 더 많은 후보
- 선택된 컷을 start/mid/end 관점의 Vision Judge로 2차 평가
- 낮은 점수 컷은 EDL 불변조건을 보존하면서 대체 후보로 교체

## 9. 구현 완료 상태

현재 MVP에는 다음이 구현되어 있다.

- 2~6개 영상 업로드
- 업로드 디스크 streaming
- FFprobe metadata 검사
- FFmpeg scene score 기반 장면 탐지
- 짧은 쇼츠용 segment normalization
- 대표 프레임 자동 추출
- Vision semantic metadata 분석
- SHA-256 기반 Vision cache
- cache schema versioning
- cache hit 시 payload 재검증
- SRT-first Beat timeline
- SRT 없는 경우 TTS 길이/무음구간 + 대본 기반 approximate alignment
- SRT gap/overlap/out-of-order normalization
- 첫 micro-beat forward merge
- Planner semantic scene matching
- Planner protocol/field validation
- EDL repair/validation
- source/program duration invariant validation
- Quality Judge protocol/score validation
- Judge replacement duplicate protection
- Judge 교체 후 alternatives refresh
- 1080x1920 H.264/AAC FFmpeg render
- TTS보다 EDL program timeline을 최종 영상 길이 기준으로 사용
- 자동 QA
- HTTP Range 기반 영상 preview
- malformed Range 416 처리
- 수동 alternative 교체 전 preflight 검증
- 수동 교체 후 alternatives refresh
- 수동 재렌더 staging
- 수동 재렌더의 MP4/EDL/QA transactional publish + rollback
- atomic JSON persistence
- API call/token/cost telemetry
- Windows launcher
- Mini PC self-hosted GitHub Actions runner용 설치/상태/제거 스크립트
- public repo의 외부 fork PR이 개인 self-hosted runner에서 실행되지 않도록 workflow 제한

## 10. 반복 개선에서 이미 해결한 주요 문제

세부 기록은 `docs/loop-history/`가 authoritative history다. 주요 흐름은 다음과 같다.

1. deterministic fallback이 낮은 품질 후보를 beat index 때문에 선택하던 문제 수정
2. Quality Judge가 이미 사용 중인 segment를 대체 후보로 골라 유료 호출 후 EDL 실패하던 문제 수정
3. 수동 교체 duplicate를 FFmpeg 전에 차단
4. 영상 preview HTTP Range 파서 강화
5. TTS가 짧을 때 `-shortest` 때문에 영상이 조기 종료되는 문제 수정
6. 시작 micro-beat가 순간 컷으로 남는 문제 수정
7. SRT positive gap 연속성 정규화
8. SRT overlap 정규화
9. 뒤섞인 SRT block을 실제 시간순으로 정렬
10. Vision batch ID completeness/uniqueness 검증
11. Planner beat ID completeness/uniqueness 검증
12. Judge beat ID completeness/uniqueness 검증
13. Judge score 0~100 finite number 계약 검증
14. Planner choice 필드 타입/범위 계약 검증
15. Vision semantic metadata 필드 계약 검증
16. Vision cache schema version 도입
17. cache hit payload 자체 검증
18. JSON atomic persistence
19. Mini PC self-hosted QA 기반 구성
20. EDL source duration == program duration invariant 강화
21. Judge 교체 후 alternatives refresh
22. 수동 교체 후 alternatives refresh
23. 수동 rerender staging으로 기존 정상 출력 보존
24. 수동 rerender MP4/EDL/QA transactional publish 및 중간 실패 rollback

## 11. 검증 체계

`package.json`의 핵심 명령:

```bash
npm start
npm run doctor
npm run check
npm run demo
```

의미:

- `npm run check`: Node syntax + unit/protocol regression tests
- `npm run demo`: synthetic source videos를 생성해 실제 FFmpeg end-to-end 렌더/QA
- `npm run doctor`: 로컬 환경/도구 점검

초기 synthetic E2E에서 3개 테스트 영상 → 4 beats → 1080x1920 H.264 → 9.000s, duration error 0, EDL error 0 결과를 확인한 이력이 있다.

GitHub Actions 성공 여부는 코드 수정/commit의 필수 전제조건이 아니다. Mini PC self-hosted runner가 online이면 추가 검증 증거로 `npm run check`와 `npm run demo`를 자동 실행한다.

## 12. Mini PC self-hosted CI

목적은 GitHub-hosted Actions minutes에 의존하지 않고 집의 Ubuntu Mini PC에서 실제 Node + FFmpeg E2E를 실행하는 것이다.

관련 파일:

- `.github/workflows/ai-shopping-shorts-editor.yml`
- `tools/minipc-runner/bootstrap.sh`
- `tools/minipc-runner/status.sh`
- `tools/minipc-runner/remove.sh`
- `docs/MINIPC_SELF_HOSTED_RUNNER.md`

workflow runner:

```yaml
runs-on: [self-hosted, linux, x64, minipc]
```

보안상 외부 fork PR 코드는 개인 Mini PC runner에서 실행하지 않는다. `GITHUB_TOKEN`도 최소 `contents: read` 권한을 사용한다.

## 13. 보안 원칙

절대 commit하지 않는다.

- OpenCode Go API key
- GitHub PAT / runner registration token
- 사용자 원본 영상
- 생성된 workspace media
- 개인 정보
- 기타 secret

추가 원칙:

- API key는 프로젝트 JSON에 저장하지 않는다.
- `.env`, `workspace/`는 저장소 추적 대상에서 제외한다.
- renderer가 free-form AI prose를 직접 실행하지 않는다. validated EDL만 소비한다.
- AI JSON은 배열이라는 이유만으로 신뢰하지 않고 ID/타입/범위를 검증한다.
- 캐시도 신뢰 경계로 보고 schema + payload를 검증한다.
- public repository self-hosted runner는 외부 기여 코드를 자동 실행하지 않는다.

## 14. 비용 최적화 원칙

API 비용을 줄이는 우선순위:

1. AI에 보내는 프레임 수를 줄인다.
2. 대표 프레임 해상도를 mode에 따라 제한한다.
3. Vision을 batch 처리한다.
4. 동일 분석은 cache한다.
5. Planner/Judge prompt를 짧고 구조화한다.
6. Judge는 Quality에서만 사용한다.
7. 사용자가 대체 컷을 직접 고를 때 AI를 다시 부르지 않는다.
8. 잘못된 AI 응답은 조용히 캐시하지 않는다.
9. API 비용 증가가 있으면 반드시 측정 가능한 품질 개선 근거를 남긴다.

## 15. 알려진 한계

### TTS alignment

SRT가 없는 경우 완전한 forced alignment가 아니다. 현재는 TTS duration/무음구간과 문장 길이를 이용한 근사 방식이다. WhisperX/aeneas 계열은 MVP 기본 의존성에서 제외되어 있다.

### Scene detector

현재 기본은 FFmpeg scene score다. PySceneDetect/TransNetV2 같은 adapter는 향후 선택형으로 검토할 수 있다.

### Quality replacement depth

Quality Judge가 낮은 컷을 대체한 뒤 그 대체 후보를 또 Judge하는 다단계 루프는 비용 증가 때문에 기본 적용하지 않았다.

### Preference learning

사용자가 반복적으로 어떤 대체 컷을 선호했는지를 장기 학습하는 preference model은 아직 없다.

### Timeline UX

전체 timeline lock / 일부 beat만 regenerate / preference 기반 재생성 같은 고급 검수 UX는 아직 다음 단계다.

## 16. 앞으로의 개발 플랜

우선순위는 “기능 수”가 아니라 **실제 쇼츠 결과의 품질/안정성/비용 효율**이다.

### Phase A — 현재 진행 중: Correctness & Reliability

목표: 잘못된 EDL/캐시/AI 응답/렌더 상태가 정상처럼 남는 경로를 최대한 제거한다.

계속 볼 항목:

- 동시 수동 rerender 또는 동일 project 동시 실행 race
- transactional artifact publish의 남은 crash window
- corrupt/stale project state recovery
- renderer/QA 불변조건 누락
- server/project path 보안 및 localhost 노출 범위
- 대용량 입력에서 memory/disk failure path

### Phase B — Semantic Edit Quality

목표: “기술적으로 정상인 영상”에서 “사람이 보기에도 잘 편집된 쇼핑 쇼츠”로 간다.

후보:

- beat별 scene relevance 점수 calibration
- narration의 행동/제품 부위/사용 장면과 clip 의미 매칭 강화
- 반복 source/유사 shot penalty 정교화
- intro hook 구간의 품질 가중치
- product visibility와 visual quality의 역할 분리
- Judge가 실제 manual replacement rate를 줄이는지 측정
- 사용자의 교체 이력을 로컬 preference signal로 활용

### Phase C — Timing Quality

목표: TTS/SRT와 시각 컷의 리듬을 더 자연스럽게 만든다.

후보:

- non-SRT TTS alignment 정밀화
- 긴 문장 내부 semantic sub-beat 분할
- speech pause와 visual cut 경계 결합
- 너무 빠른 consecutive cut 억제
- 초반 hook과 CTA 구간별 다른 beat 정책

### Phase D — Review UX

목표: AI가 100% 맞히지 못해도 사람이 아주 빠르게 마무리할 수 있게 한다.

후보:

- beat lock
- 특정 beat만 regenerate
- alternative preview 개선
- 이유/score 비교 표시
- undo/redo 또는 명시적 rollback stack
- timeline에서 source 다양성/중복 경고

### Phase E — Cost / Performance Hardening

목표: 영상 수와 길이가 늘어도 비용과 대기시간이 과도하게 증가하지 않게 한다.

후보:

- Planner에 모든 segment를 그대로 보내지 않고 저비용 prefilter
- adaptive Vision batch
- cache observability / hit ratio 개선
- frame extraction 중복 작업 제거
- 대형 프로젝트 disk cleanup 정책
- Mini PC에서 실제 runtime/memory profiling

### Phase F — Productization

MVP 안정화 이후에만 진행한다.

- 별도 repository 분리 검토
- 배포/패키징
- FFmpeg 라이선스/배포 방식 재검토
- 설정 migration
- project export/import
- 사용성 개선

## 17. 다음 작업 후보

이 문서 작성 시점의 우선 후보는 다음과 같다.

**동일 project에 대한 동시 실행/수동 rerender race가 실제 server/UI 경로에서 가능한지 확인하고, 가능하면 project-level serialization/lock을 추가하는 것.**

이유:

- JSON atomic write와 수동 artifact transaction은 단일 작업 내부의 torn state를 크게 줄였다.
- 하지만 서로 다른 두 요청이 동시에 같은 project state를 수정하면 각각 정상적인 transaction이어도 last-writer-wins 또는 서로의 staging/backup과 충돌할 수 있다.
- AI 비용 증가 없이 reliability를 높일 수 있는 영역이다.

단, 다음 회차에서는 이 가설을 바로 구현하지 말고 최신 source를 먼저 읽어 실제 concurrency 경로가 있는지 증거를 확인해야 한다.

## 18. 개발자가 작업 시작 전에 반드시 할 일

1. PR #1 또는 successor PR의 최신 HEAD 확인
2. 최근 commit/changed files 확인
3. 이 `docs/HANDOFF.md` 확인
4. `docs/LOOP_ENGINEERING.md` 확인
5. 최신 `docs/loop-history/` 기록 확인
6. 변경 대상 source를 실제 최신 branch에서 읽기
7. 다른 AI/개발자가 중간에 변경했을 가능성을 전제로 충돌/회귀 위험 확인
8. 이전 대화에서 기억한 코드 상태를 최신이라고 가정하지 않기

## 19. 한 회차의 작업 규칙

자동/반복 개선은 기본적으로 한 번에 **증거가 있는 고가치 개선 1개**를 우선한다.

1. 최신 상태 검사
2. 문제와 증거 정의
3. 가장 작은 안전한 patch 설계
4. regression test 추가
5. 가능한 환경에서 `npm run check`
6. 가능한 환경에서 synthetic FFmpeg `npm run demo`
7. Actions unavailable/queued를 blocker로 사용하지 않기
8. 검증된 변경을 branch/PR에 commit
9. `docs/loop-history/YYYY-MM-DD-NN-topic.md` 기록
10. durable lesson이면 `docs/LOOP_ENGINEERING.md` 갱신
11. **항상 이 `docs/HANDOFF.md`의 Current status / completed work / roadmap / next best hypothesis 중 관련 부분을 갱신**

안전하게 정당화할 변경이 없으면 제품 코드를 억지로 바꾸지 않는다.

## 20. 인수인계 파일 유지 계약

이 문서는 선택 문서가 아니다.

다음 중 하나가 바뀌면 반드시 같은 회차에 업데이트한다.

- 개발 목표/제품 의도
- 구현 완료 기능
- 주요 아키텍처
- AI 모델/비용 정책
- 테스트/검증 방식
- CI/Mini PC 운영
- 보안 원칙
- 알려진 한계
- 완료된 loop milestone
- 현재 branch/PR 상태
- 다음 우선순위
- 사용자에게 필요한 수동 작업

새 AI가 투입되었을 때 과거 채팅을 읽지 않아도 이 문서 + GitHub history만으로 작업을 이어갈 수 있는 수준을 유지한다.

## 21. 중요한 파일 지도

```text
ai-shopping-shorts-editor/
├── README.md
├── package.json
├── src/
│   ├── server.mjs
│   ├── core/
│   │   ├── beats.mjs
│   │   ├── editor.mjs
│   │   ├── media.mjs
│   │   ├── opencode.mjs
│   │   ├── pipeline.mjs
│   │   ├── process.mjs
│   │   └── utils.mjs
│   └── public/
├── scripts/
│   ├── demo.mjs
│   └── doctor.mjs
├── test/
├── tools/minipc-runner/
├── docs/
│   ├── HANDOFF.md              # 이 문서: 현재 상태/목표/로드맵 source of truth
│   ├── PRD.md                  # 제품 요구사항/범위
│   ├── ARCHITECTURE.md         # 구조
│   ├── LOOP_ENGINEERING.md     # 반복 개선 프로토콜/누적 교훈
│   ├── MINIPC_SELF_HOSTED_RUNNER.md
│   └── loop-history/           # 각 개선 회차의 증거/검증/rollback 기록
└── workspace/                  # 로컬 생성물, commit 금지
```

## 22. 사용자에게 필요한 현재 수동 작업

제품 코드 개선 자체는 가능한 한 GitHub에서 자동으로 진행한다.

Mini PC self-hosted QA를 실제 활성화하려면 사용자가 Mini PC에서 한 번 runner installer를 실행해야 한다. 자세한 절차는 `docs/MINIPC_SELF_HOSTED_RUNNER.md`를 따른다.

이외에는 API key, 원본 영상, 개인 자료를 GitHub에 올리도록 요구하지 않는다.

---

### 유지 원칙 요약

**최신 GitHub를 먼저 읽고 → 한 가지 증거 기반 개선을 하고 → 테스트/검증하고 → loop-history를 남기고 → HANDOFF.md를 반드시 갱신한다.**
