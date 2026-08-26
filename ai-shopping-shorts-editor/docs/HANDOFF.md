# AI Shopping Shorts Editor — Project Handoff / Living Status

> 이 문서는 프로젝트의 **공식 인수인계 기준 문서(source of truth)** 다. 새 AI/개발자는 과거 채팅 기억보다 최신 GitHub source, 이 문서, `docs/LOOP_ENGINEERING.md`, 최신 `docs/loop-history/`를 먼저 확인한다.
>
> **업데이트 계약:** 코드, 설정, 테스트, CI, 비용, 보안, 제품 범위, 현재 phase, 알려진 한계, 다음 우선순위가 의미 있게 바뀌면 같은 작업 회차에서 이 문서도 갱신한다.

## 1. 프로젝트 한 줄 정의

여러 개의 상품 원본 영상을 장면 단위로 분해하고, 사용자가 제공한 **대본/SRT/TTS의 의미와 타이밍에 맞춰** 원본 구간을 재조합하여 **YouTube Shopping Shorts용 9:16 컷 편집 MP4**를 만드는 로컬 AI 보조 편집기다.

핵심은 원본 영상을 통째로 연결하는 것이 아니라, 작은 semantic segment로 나눈 뒤 narration Beat마다 가장 적합한 장면을 여러 source에서 골라 EDL(Edit Decision List)을 만드는 것이다.

## 2. 개발 의도

사용자는 자막 디자인, 효과, 음악 등 후반 작업을 직접 할 수 있다. 반복 비용이 큰 부분은 장면 탐색, 장면 의미 파악, TTS/SRT 타이밍에 맞춘 컷 길이 결정, 소스 다양성 유지, 최종 일부 컷 재검수다.

따라서 설계 원칙은 다음과 같다.

- **AI = 의미 판단 / 편집 결정**
- **FFmpeg = 결정론적 미디어 실행 엔진**
- **validated EDL = AI와 renderer 사이의 계약**
- 목표는 생성형 영상 제작이 아니라 **AI가 좋은 EDL을 안정적이고 저비용으로 만드는 것**이다.

## 3. 최종 사용자 경험 목표

1. 원본 영상 2~6개 입력
2. 대본 + TTS 입력, 가능하면 SRT 입력
3. Economy / Balanced / Quality 선택
4. 자동 컷 편집 실행
5. 결과 MP4 + QA + timeline 검토
6. 마음에 들지 않는 beat의 대체 컷 선택
7. **추가 AI 호출 없이** 재렌더

품질 목표:

- SRT/TTS 의미 경계와 컷 전환이 자연스럽다.
- 평균 시각 변화는 대략 1.5~3.2초를 지향하지만 고정 길이보다 narration 의미 경계를 우선한다.
- 의미 일치 > 소스 다양성 > 미학적 다양성 순으로 판단한다.
- 동일 segment 중복 사용을 기본 금지한다.
- 불필요한 동일 source 연속 사용을 줄인다.
- MP4, EDL, QA가 항상 같은 cut version을 가리킨다.

## 4. 제품 범위 — CUT ONLY

포함:

- 장면 탐지 / segment 정규화
- 대표 프레임 추출
- 장면 의미 분석
- 대본/SRT/TTS Beat 생성
- semantic scene matching
- EDL 생성 / repair / validation
- 9:16 FFmpeg 렌더
- 품질 모드별 AI 비용 조절
- 자동 QA
- alternative 검토 / 수동 교체 / no-AI 재렌더

현재 비포함:

- 자동 자막 스타일링
- 스티커/그래픽
- 트랜지션/줌/시각효과
- BGM/효과음
- 썸네일
- YouTube 자동 업로드
- 생성형 영상 제작

새 기능은 CUT ONLY 범위를 깨지 않는지 먼저 확인한다.

## 5. 저장소 / 현재 작업 위치

- Repository: `lgkangno1-svg/Kang-s-brain`
- Project directory: `ai-shopping-shorts-editor/`
- Active PR: `#1 — feat: bootstrap AI Shopping Shorts Editor MVP`
- Active branch: `feat/ai-shopping-shorts-editor-bootstrap`
- Base: `main`
- Loop 26 시작 시 확인한 HEAD: `ebab6c33a9d327cdde3b5649bf4aa276744648a6`
- Loop 26 제품 코드/테스트 반영 후 확인 가능한 code/test commit: `871ac990c026e1e215695d132ce41aa0adc3cd3f`

위 SHA는 snapshot이다. 다음 작업자는 반드시 PR 최신 HEAD를 다시 확인한다.

## 6. 현재 아키텍처

```text
Browser UI
  -> local Node HTTP server
    -> streaming uploads
    -> FFprobe metadata
    -> FFmpeg scene scoring
    -> normalized semantic segments
    -> representative JPEG frames
      -> OpenCode Go Vision metadata (cached)

Script / SRT / TTS
  -> Beat timeline

Beat + semantic metadata
  -> OpenCode Go Planner/Edit Director
  -> deterministic repair + EDL validation
  -> optional Quality Vision Judge
  -> final EDL

EDL
  -> deterministic FFmpeg renderer
  -> 1080x1920 H.264/AAC MP4
  -> QA JSON

Review UI
  -> alternative selection
  -> no-AI rerender
  -> staged + transactional MP4/EDL/QA publish
```

동일 project의 장시간 mutating 작업은 server의 per-project job slot으로 보호한다. `/run`과 `/replace`는 첫 asynchronous request parse 전에 동기적으로 project slot을 선점한다. 서로 다른 project는 병렬 실행 가능하다.

## 7. AI 모델 / 연동

기본 설정:

- Vision: `deepseek-v4-flash-vision-exp`
- Planner: `deepseek-v4-flash`
- API: OpenCode Go OpenAI-compatible chat completions

모델 ID는 편집 로직과 분리된 설정값이다. renderer는 free-form AI prose를 실행하지 않고 validated EDL만 소비한다.

API key가 제공된 실제 AI 모드의 Vision/Planner 실패를 정상 AI 성공처럼 숨기지 않는다. API key가 없는 테스트 모드의 deterministic fallback은 유지한다.

## 8. 품질/비용 모드

### Economy
- 약 384px 대표 프레임
- 큰 Vision batch
- source당 후보 제한 작음
- Judge 없음
- 비용 최소화 우선

### Balanced
- 기본 모드
- 약 512px 대표 프레임
- 중간 Vision batch
- Planner 사용
- Judge 없음
- 비용/품질 균형

### Quality
- 약 640px 대표 프레임
- 더 작은 Vision batch
- 더 많은 후보
- 최종 선택 컷 Vision Judge 재평가
- 낮은 점수 컷은 EDL 불변조건을 지키며 대체

비용 원칙:

1. 전체 프레임을 AI에 보내지 않는다.
2. 대표 프레임 + batch Vision을 사용한다.
3. 동일 분석 조건은 Vision cache를 재사용한다.
4. Economy/Balanced에서는 Judge를 생략한다.
5. 수동 컷 교체는 AI 호출 0회다.
6. malformed AI 응답을 조용히 캐시하지 않는다.
7. AI 호출/토큰 증가에는 측정 가능한 품질 개선 근거가 필요하다.

## 9. 구현 완료 상태

현재 구현됨:

- 2~6개 영상 업로드
- disk streaming upload
- FFprobe metadata 검사
- FFmpeg scene-score 기반 장면 탐지
- 쇼츠용 segment normalization
- 대표 프레임 자동 추출
- Vision semantic metadata 분석
- SHA-256 Vision cache
- cache schema versioning
- cache hit payload 재검증
- SRT-first Beat timeline
- SRT 없는 경우 TTS duration/무음구간 + 대본 기반 approximate alignment
- SRT positive gap / overlap / out-of-order normalization
- 시작 micro-beat forward merge
- Planner semantic matching
- Planner ID/field protocol validation
- EDL repair/validation
- source duration == program duration invariant
- Quality Judge ID/score validation
- Judge duplicate replacement protection
- Judge replacement 후 alternatives refresh
- 1080x1920 H.264/AAC render
- TTS보다 EDL program timeline을 최종 영상 길이 기준으로 사용
- 자동 QA
- HTTP Range preview + malformed range 416
- manual replacement preflight
- manual alternatives refresh
- staged manual rerender
- MP4/EDL/QA transactional publish + rollback
- atomic JSON persistence
- API call/token/cost telemetry
- Windows launcher
- Mini PC self-hosted runner 설치/상태/제거 도구
- public repo 외부 fork PR의 개인 self-hosted runner 실행 방지
- **동일 project `/run` + `/replace` 동시 실행 race 차단**

## 10. 완료된 Loop Engineering 핵심 마일스톤

세부 근거는 `docs/loop-history/`가 authoritative history다.

1. fallback 품질 선택 순서 수정
2. Judge duplicate replacement 차단
3. manual duplicate preflight
4. preview Range 검증
5. TTS 조기 종료 방지
6. leading micro-beat 병합
7. SRT gap continuity
8. SRT overlap normalization
9. SRT timeline order normalization
10. Vision batch ID 무결성
11. Planner beat ID 무결성
12. Judge beat ID 무결성
13. Judge score contract
14. Planner choice field contract
15. Vision semantic field contract
16. Vision cache schema version
17. cache payload validation
18. atomic JSON persistence
19. Mini PC self-hosted QA 기반
20. EDL source/program duration invariant
21. Judge alternatives refresh
22. manual alternatives refresh
23. manual rerender staging
24. MP4/EDL/QA transactional publish/rollback
25. living HANDOFF 체계 도입
26. **same-project run/replace synchronous serialization**

## 11. Loop 26 — 현재 reliability invariant

문제:

기존 `/run`과 `/replace`는 `jobs.get(id)?.running` 검사 뒤 `await bodyJson(req)`을 수행하고 나서야 `jobs.set()`을 했다. 거의 동시에 요청 두 개가 들어오면 둘 다 idle 상태를 보고 통과할 수 있었다.

현재:

- `beginProjectJob()`이 첫 `await` 전에 동기적으로 `jobs` Map에 running state를 넣는다.
- 동일 project의 두 번째 `/run` 또는 `/replace`는 즉시 409 대상이 된다.
- request parse / 초기 run setup이 실패하면 `abandonProjectJob()`으로 slot을 해제한다.
- 해제는 해당 state가 여전히 slot owner일 때만 수행해 오래된 cleanup이 새 작업을 지우지 못한다.
- 다른 project는 서로 독립적으로 실행할 수 있다.
- AI/FFmpeg 비용은 증가하지 않는다.

관련 파일:

- `src/core/project-job.mjs`
- `src/server.mjs`
- `test/project-job.test.mjs`
- `docs/loop-history/2026-08-26-26-project-job-serialization.md`

## 12. 검증 체계

핵심 명령:

```bash
npm start
npm run doctor
npm run check
npm run demo
```

- `npm run check`: Node syntax + unit/protocol tests
- `npm run demo`: synthetic videos → 실제 FFmpeg end-to-end render/QA
- `npm run doctor`: 로컬 환경 확인

초기 synthetic E2E 검증 이력: 3개 테스트 영상 → 4 beats → 1080x1920 H.264 → 9.000s, duration error 0, EDL error 0.

Loop 26 targeted validation:

- project-job helper syntax check: PASS
- same-project exclusion / safe abandon / different-project independence regression: **3/3 PASS**
- full repo `npm run check` / `npm run demo`는 이번 회차에서 실행했다고 주장하지 않는다.

GitHub Actions는 추가 evidence일 뿐 코드 commit의 필수 gate가 아니다.

## 13. Mini PC self-hosted CI

관련 파일:

- `.github/workflows/ai-shopping-shorts-editor.yml`
- `tools/minipc-runner/bootstrap.sh`
- `tools/minipc-runner/status.sh`
- `tools/minipc-runner/remove.sh`
- `docs/MINIPC_SELF_HOSTED_RUNNER.md`

workflow:

```yaml
runs-on: [self-hosted, linux, x64, minipc]
```

목표는 GitHub-hosted minutes에 의존하지 않고 실제 Ubuntu Mini PC에서 Node + FFmpeg E2E를 실행하는 것이다. 외부 fork PR은 개인 runner에서 실행하지 않고 `GITHUB_TOKEN`은 최소 권한을 사용한다.

## 14. 보안 / 데이터 원칙

절대 commit 금지:

- OpenCode Go API key
- GitHub PAT / runner token
- 원본 영상
- 생성 workspace media
- 개인 정보 / secret

추가 원칙:

- API key를 project JSON에 저장하지 않는다.
- `.env`, `workspace/`는 추적 제외한다.
- validated EDL만 renderer가 소비한다.
- AI JSON은 ID/타입/범위를 검증한다.
- cache도 schema + payload를 검증한다.
- public repo self-hosted runner에서 외부 기여 코드를 자동 실행하지 않는다.

## 15. 알려진 한계

### TTS alignment
SRT가 없으면 완전한 forced alignment가 아니다. 현재는 TTS duration/무음구간 + 문장 길이 기반 근사다.

### Scene detector
기본은 FFmpeg scene score다. PySceneDetect/TransNetV2 adapter는 향후 선택형 검토 대상이다.

### Quality replacement depth
대체 후보까지 반복 Judge하는 다단계 루프는 비용 증가 때문에 기본 적용하지 않았다.

### Preference learning
사용자의 반복 교체 선택을 장기 preference model로 학습하지 않는다.

### Timeline UX
beat lock, 일부 beat regenerate, undo/redo, richer comparison UI는 아직 후속 단계다.

### Remaining project mutation concurrency
Loop 26은 `/run`과 `/replace`를 직렬화했다. **`/upload`는 아직 같은 project job slot을 사용하지 않는다.** upload 중 `project.json`을 수정하므로, run 중 upload가 실제 UI/API에서 가능한지와 snapshot 일관성 문제가 있는지 다음 reliability 후보로 확인해야 한다.

## 16. 개발 로드맵

### Phase A — 현재: Correctness & Reliability

목표: 잘못된 EDL/캐시/AI 응답/파일 상태가 정상처럼 남는 경로 제거.

남은 후보:

- upload/project metadata mutation vs active run/replace
- transactional publish의 남은 crash window
- corrupt/stale project state recovery
- renderer/QA invariant 누락
- server/project path safety
- 대용량 입력의 disk/memory failure path

### Phase B — Semantic Edit Quality

- beat별 relevance calibration
- narration action/product-part/use-scene 매칭 강화
- repeated source / visually similar shot penalty
- intro hook 품질 가중치
- product visibility와 visual quality 분리
- Judge가 manual replacement rate를 실제 줄이는지 측정
- 로컬 preference signal 검토

### Phase C — Timing Quality

- non-SRT TTS alignment 정밀화
- 긴 문장 semantic sub-beat
- speech pause + visual cut boundary 결합
- 너무 빠른 consecutive cut 억제
- hook/CTA 구간별 beat 정책

### Phase D — Review UX

- beat lock
- 특정 beat regenerate
- alternative preview 개선
- reason/score 비교
- undo/redo 또는 rollback stack
- timeline source diversity 경고

### Phase E — Cost / Performance

- Planner candidate prefilter
- adaptive Vision batch
- cache observability/hit ratio
- duplicate frame extraction 제거
- disk cleanup
- Mini PC runtime/memory profiling

### Phase F — Productization

MVP 안정화 이후:

- 별도 repo 분리 검토
- 패키징/배포
- FFmpeg 라이선스 검토
- config migration
- project export/import
- 사용자 편의 개선

## 17. 현재 다음 최우선 가설

**활성 `/run` 또는 `/replace` 동안 `/upload`가 같은 project의 `project.json`과 inputs를 수정할 수 있는지 확인한다.**

검토 기준:

- 실제 UI에서 가능한가
- API를 직접 호출하면 가능한가
- run이 읽은 project snapshot과 disk `project.json`이 달라질 수 있는가
- video prefix 계산(`project.videos.length + 1`)의 concurrent collision 가능성이 있는가
- 가장 작은 해결책이 upload 거부(409)인지, staging인지, 더 넓은 mutator lock인지

읽기 전용 status/preview와 다른 project까지 불필요하게 막는 broad global lock은 피한다.

## 18. 작업 시작 체크리스트

1. PR #1 또는 successor 최신 HEAD 확인
2. 이 `docs/HANDOFF.md` 확인
3. `docs/LOOP_ENGINEERING.md` 확인
4. 최신 `docs/loop-history/` 확인
5. 변경 대상 최신 source 확인
6. 다른 AI/개발자의 중간 변경 가능성 확인
7. 한 번에 증거 있는 개선 1개 선택
8. regression test 추가
9. 가능한 환경에서 targeted/check/demo 검증
10. GitHub commit
11. loop-history 작성
12. **HANDOFF 동시 갱신**

## 19. 중요 파일 지도

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
│   │   ├── project-job.mjs      # same-project long-job serialization
│   │   └── utils.mjs
│   └── public/
├── scripts/
│   ├── demo.mjs
│   └── doctor.mjs
├── test/
│   └── project-job.test.mjs
├── tools/minipc-runner/
├── docs/
│   ├── HANDOFF.md               # 현재 상태/목표/로드맵 source of truth
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── LOOP_ENGINEERING.md
│   ├── MINIPC_SELF_HOSTED_RUNNER.md
│   └── loop-history/
└── workspace/                   # local generated data; commit 금지
```

## 20. 현재 사용자에게 필요한 수동 작업

제품 코드 개선은 가능한 한 GitHub에서 진행한다.

Mini PC self-hosted QA를 실제 online 상태로 만들려면 사용자가 Mini PC에서 runner installer를 한 번 실행해야 한다. 절차는 `docs/MINIPC_SELF_HOSTED_RUNNER.md`를 따른다.

API key, 원본 영상, 개인 자료를 GitHub에 올리도록 요구하지 않는다.

---

### 유지 원칙

**최신 GitHub 확인 → HANDOFF/LOOP/history 읽기 → 증거 기반 개선 1개 → regression validation → commit → loop-history → HANDOFF 갱신.**
