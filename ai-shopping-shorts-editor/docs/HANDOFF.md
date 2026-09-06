# AI Shopping Shorts Editor — Project Handoff / Living Status

> 이 문서는 프로젝트의 **공식 인수인계 기준 문서(source of truth)** 다. 새 AI/개발자는 과거 채팅 기억보다 최신 GitHub source, 이 문서, `docs/LOOP_ENGINEERING.md`, 최신 `docs/loop-history/`를 먼저 확인한다.
>
> **업데이트 계약:** 코드, 설정, 테스트, CI, 비용, 보안, 제품 범위, 현재 phase, 알려진 한계, 다음 우선순위가 의미 있게 바뀌면 같은 작업 회차에서 이 문서도 갱신한다.

## 1. 프로젝트 정의

여러 개의 상품 원본 영상을 장면 단위 semantic segment로 분해하고, 사용자가 제공한 **대본/SRT/TTS의 의미와 타이밍에 맞춰** 원본 구간을 재조합하여 **YouTube Shopping Shorts용 9:16 컷 편집 MP4**를 만드는 로컬 AI 보조 편집기다.

핵심은 생성형 영상 제작이 아니라 **AI가 좋은 EDL(Edit Decision List)을 저비용·고신뢰로 만들고 FFmpeg가 그 결정을 결정론적으로 실행하는 구조**다.

## 2. 개발 의도 / 최종 목표

사용자가 반복적으로 시간을 쓰는 장면 탐색, 의미 파악, 자막/TTS 경계에 맞춘 컷 길이 결정, 여러 원본 간 장면 선택, 저품질 컷 검수를 자동화한다. 자막 디자인·효과·음악은 다른 후반 툴이 담당할 수 있으므로 현재 범위는 CUT ONLY다.

설계 원칙:

- **AI = 의미 판단 / 편집 결정**
- **FFmpeg = 미디어 실행 엔진**
- **validated EDL = AI와 renderer 사이의 계약**
- **deterministic guard first**: 로컬 규칙으로 막을 수 있는 오류는 AI 재호출로 해결하지 않는다.
- **recoverable local state**: 실패한 upload/render/save가 마지막 정상 상태를 훼손하지 않아야 한다.
- **generation coherence**: MP4, beats, segments, EDL, QA는 같은 완료 세대를 가리켜야 한다.
- **low-cost iteration**: 같은 분석 조건은 cache하고 manual replacement는 AI 0-call로 처리한다.
- **provenance before cleanup**: crash 복구에서 파일을 지울 때는 프로그램이 만든 파일임을 확실히 식별하고 age/race 조건을 보수적으로 적용한다.

최종 사용자 흐름 목표:

1. 원본 영상 2~6개 입력
2. 대본 + TTS 입력, 가능하면 SRT 입력
3. Economy / Balanced / Quality 선택
4. 자동 컷 편집 실행
5. MP4 + QA + timeline 확인
6. 마음에 들지 않는 beat의 alternative 선택
7. 추가 AI 호출 없이 재렌더

품질/신뢰성 목표:

- narration 의미 경계와 컷 전환이 자연스럽다.
- 시각 변화는 대략 1.5~3.2초를 지향하되 의미 경계를 우선한다.
- 의미 일치 > 소스 다양성 > 미학적 다양성 순으로 판단한다.
- 동일 segment 중복 사용을 기본 금지한다.
- MP4, beats, segments, EDL, QA가 항상 같은 completed cut version을 가리킨다.
- malformed AI 응답, 손상 cache, partial upload, 부분 저장, 동시 mutation, stale metadata snapshot이 정상 결과처럼 남지 않는다.
- 실패한 자동 재실행은 마지막 정상 결과물을 보존한다.
- crash 잔재 cleanup이 사용자 원본이나 현재 진행 중인 업로드를 추정으로 삭제하지 않는다.

## 3. 제품 범위 — CUT ONLY

포함:

- 장면 탐지 / segment 정규화
- 대표 프레임 추출
- Vision semantic metadata 분석
- 대본/SRT/TTS Beat 생성
- semantic scene matching
- EDL 생성 / repair / validation
- 9:16 FFmpeg 렌더
- Economy/Balanced/Quality 비용·품질 모드
- 자동 QA
- alternative 검토 / manual replacement / no-AI rerender
- local cache / telemetry / crash-safe persistence/recovery

비포함:

- 자동 자막 스타일링
- 스티커/그래픽
- 트랜지션/줌/시각효과
- BGM/효과음
- 썸네일
- YouTube 자동 업로드
- 생성형 영상 제작

## 4. 저장소 / 현재 작업 위치

- Repository: `lgkangno1-svg/Kang-s-brain`
- Project directory: `ai-shopping-shorts-editor/`
- Active PR: `#1 — feat: bootstrap AI Shopping Shorts Editor MVP`
- Active branch: `feat/ai-shopping-shorts-editor-bootstrap`
- Base: `main`
- Loop 31 시작 HEAD: `97df9ab41fe07b8a9fa8bf6d60cf2fa445632717`
- Loop 31 code/test HEAD before docs completion: `f604597ab91cc826d35d644273e785c8cda00a1d`

SHA는 snapshot이다. 다음 작업자는 반드시 PR 최신 HEAD를 다시 확인한다.

## 5. 현재 아키텍처

```text
Browser UI
  -> local Node HTTP server
    -> same-project mutation claim
      -> fresh project.json snapshot read
    -> streaming uploads
      -> hidden unique .upload-<token>.part staging file
      -> successful stream completion
      -> opportunistic stale staging cleanup (exact pattern + >=24h only)
      -> completed upload rename
      -> project.json publish
    -> FFprobe metadata
    -> FFmpeg scene scoring
    -> normalized semantic segments
    -> representative JPEG frames
      -> OpenCode Go Vision metadata (cached + validated)

Script / SRT / TTS
  -> normalized Beat timeline

Beat + semantic metadata
  -> OpenCode Go Planner/Edit Director
  -> deterministic repair + EDL validation
  -> optional Quality Vision Judge
  -> final EDL

Automatic run
  -> render to hidden staged MP4
  -> calculate QA in memory
  -> stage beats/segments/EDL/QA JSON
  -> backup previous completed generation
  -> transactionally publish MP4 + beats + segments + EDL + QA
  -> rollback previous generation if a later publish step fails

Review UI
  -> alternative selection
  -> no-AI rerender
  -> staged + transactional MP4/EDL/QA publish
```

### Same-project mutation boundary

`jobs` Map은 사용자에게 보이는 작업 상태/결과이고, 별도 `activeMutations` Map은 프로젝트 파일 mutation 소유권을 관리한다.

동일 project에서 다음 mutation은 서로 겹칠 수 없다.

- `POST /upload`
- `POST /run`
- `POST /replace`

충돌 시 HTTP 409. 서로 다른 project 및 read-only endpoint는 불필요하게 직렬화하지 않는다.

**Loop 29 이후 불변조건:** mutating route는 lock 획득 후 `project.json`을 다시 읽은 **fresh snapshot**만 수정/실행에 사용한다. pre-lock snapshot은 존재 확인용일 뿐 mutation source of truth가 아니다.

관련 파일:

- `src/core/project-job.mjs`
- `src/core/project-mutation.mjs`
- `src/server.mjs`
- `test/project-mutation.test.mjs`

### Upload durability / recovery boundary — Loops 28 + 30

업로드 bytes는 최종 input filename으로 직접 쓰지 않는다.

1. `createUploadPaths()`가 hidden `.upload-<token>.part` staging path와 고유 final path를 만든다.
2. HTTP request stream은 staging file에만 기록한다.
3. stream이 정상 완료된 뒤 publish 단계로 들어간다.
4. publish 직전에 같은 `inputs/`에서 **정확히 `.upload-[safe-token].part` 패턴이며 24시간 이상 지난 regular file만** best-effort cleanup한다.
5. fresh/current staging file, `customer-video.part` 같은 사용자 파일, final media는 cleanup 대상이 아니다.
6. cleanup 실패는 정상 upload를 실패시키지 않는다.
7. 그 다음 `rename(staged, final)` 한다.
8. 그 다음에만 `project.json`에 final path를 등록한다.
9. metadata persistence가 실패하면 final file도 rollback 삭제한다.
10. 강제 종료가 stream 중 발생하면 project metadata는 partial file을 참조하지 않는다.
11. final filename은 고유 token을 포함해 이전 orphan이 다음 upload를 `EEXIST`로 막지 않는다.

강제 종료가 **final rename 직후~project.json commit 직전** 발생하면 완전한 unreferenced final media가 남을 수 있다. 이 파일은 자동 삭제하지 않는다. metadata에 없는 full media의 provenance/age 정책은 별도 설계 대상이다.

관련 파일:

- `src/core/upload-staging.mjs`
- `test/upload-staging.test.mjs`
- `src/server.mjs`

### Automatic-run generation transaction — Loop 31

Loop 31 이전 자동 `runProject()`는 다음 순서였다.

1. `beats.json`, `segments.json`, `edl.json`을 final work path에 먼저 저장
2. 기존 `output/shorts.mp4`에 직접 FFmpeg render
3. 마지막에 `qa.json` 저장

따라서 render/저장 실패 시 서로 다른 세대의 artifact가 섞일 수 있었다.

Loop 31 이후:

1. beats/segments/EDL은 메모리에서 준비하되 final authoritative path에 먼저 publish하지 않는다.
2. FFmpeg는 hidden staged MP4에 render한다.
3. QA도 메모리에서 계산한다.
4. beats/segments/EDL/QA JSON을 staged sibling에 완성한다.
5. 이전 completed generation의 존재하는 artifact를 backup한다.
6. 다음 artifact를 하나의 rollback-aware commit set으로 publish한다.
   - `output/shorts.mp4`
   - `work/beats.json`
   - `work/segments.json`
   - `work/edl.json`
   - `output/qa.json`
7. 중간 rename 실패 시 이미 새로 publish한 artifact를 제거하고 backup을 복원한다.
8. staging/backup debris는 best-effort cleanup한다.

**불변조건:** failed automatic rerun은 마지막 completed generation을 논리적으로 보존해야 한다. Review UI/EDL/QA/manual replacement가 mixed generation을 정상 결과로 읽어서는 안 된다.

관련 파일:

- `src/core/artifact-commit.mjs`
- `src/core/pipeline.mjs`
- `test/artifact-commit.test.mjs`

한계: 이 transaction은 실행 중 예외에 대해 rollback-safe하지만, 여러 파일 rename 사이에 **하드 전원 손실/프로세스 강제 종료**가 발생하면 JavaScript rollback이 실행되지 못한다. 이 아주 짧은 window까지 제거하려면 generation-directory + atomic current-manifest/pointer 구조가 필요할 수 있으나, 실제 fault evidence 없이 복잡도를 먼저 늘리지 않는다.

## 6. AI 모델 / 연동

기본 설정:

- Vision: `deepseek-v4-flash-vision-exp`
- Planner: `deepseek-v4-flash`
- API: OpenCode Go OpenAI-compatible chat completions

모델 ID는 편집 로직과 분리된 설정값이다. renderer는 free-form AI prose를 실행하지 않고 validated EDL만 소비한다.

실제 AI 모드에서는 Vision/Planner/Judge protocol failure를 정상 AI 성공처럼 숨기지 않는다. API key 없는 테스트 모드의 deterministic fallback은 유지한다.

## 7. 품질 / 비용 모드

### Economy
- 약 384px 대표 프레임
- 큰 Vision batch
- source당 후보 제한 작음
- Judge 없음
- 비용 최소화 우선

### Balanced
- 기본 모드
- 약 512px 대표 프레임
- Planner 사용
- Judge 없음
- 비용/품질 균형

### Quality
- 약 640px 대표 프레임
- 더 많은 후보
- 최종 선택 컷 Vision Judge 재평가
- 낮은 점수 컷은 EDL 불변조건을 지키며 대체

비용 원칙:

1. 전체 프레임을 AI에 보내지 않는다.
2. 대표 프레임 + batch Vision을 사용한다.
3. 동일 분석 조건은 Vision cache를 재사용한다.
4. Economy/Balanced에서는 Judge를 생략한다.
5. manual replacement는 AI 호출 0회다.
6. malformed AI 응답을 cache하지 않는다.
7. AI 호출/토큰 증가에는 측정 가능한 품질 개선 근거가 필요하다.
8. correctness/reliability/recovery guard는 deterministic local logic을 우선한다.

Loop 31은 OpenCode Go call/token 또는 FFmpeg encode 횟수를 늘리지 않는다. 이전 completed MP4를 보호하기 위해 commit 단계에서 local file backup/copy/rename 비용만 추가된다.

## 8. 현재 구현 완료 상태

현재 구현됨:

- 2~6개 영상 업로드
- disk streaming upload
- hidden unique staging upload + completed-file publish
- metadata persistence 실패 시 published upload rollback
- 24시간 이상 된 tool-owned `.upload-*.part` opportunistic cleanup
- FFprobe metadata 검사
- FFmpeg scene-score 기반 장면 탐지
- 쇼츠용 segment normalization
- 대표 프레임 추출
- Vision semantic metadata 분석
- SHA-256 Vision cache
- cache schema versioning
- cache-hit payload 재검증
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
- **automatic run staged render + MP4/beats/segments/EDL/QA transactional publish/rollback**
- HTTP Range preview + malformed range 416
- manual replacement preflight
- manual alternatives refresh
- staged manual rerender
- manual MP4/EDL/QA transactional publish + rollback
- atomic JSON persistence
- API call/token/cost telemetry
- Windows launcher
- Mini PC self-hosted runner 설치/상태/제거 도구
- public repo 외부 fork PR의 개인 self-hosted runner 실행 방지
- 동일 project upload/run/replace mutation serialization
- mutation claim 이후 fresh project snapshot 재조회
- living HANDOFF 체계

## 9. Loop Engineering 마일스톤

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
24. manual MP4/EDL/QA transactional publish/rollback
25. living HANDOFF 체계 도입
26. same-project run/replace synchronous serialization
27. upload/run/replace 공통 mutation serialization
28. upload staging + unique publish path + metadata-failure rollback
29. mutation claim 후 fresh `project.json` snapshot 재조회로 stale overwrite 차단
30. tool-owned stale `.upload-*.part` age/provenance cleanup 정책 구현
31. **automatic run MP4/beats/segments/EDL/QA transactional publish/rollback**

## 10. Loop 31 변경 요약

### 문제

자동 rerun이 새 work JSON을 먼저 publish하고 기존 최종 MP4에 직접 렌더했기 때문에, FFmpeg 또는 이후 JSON 저장 실패 시 mixed generation이 남을 수 있었다.

### 해결

- `commitRunArtifacts()` 추가
- automatic run의 final work JSON 선저장 제거
- FFmpeg output을 hidden staged MP4로 변경
- render/QA 성공 후 MP4 + beats + segments + EDL + QA를 하나의 rollback-aware artifact set으로 commit
- 중간 publish 실패 시 이전 completed artifact 복원

### 비용 영향

- OpenCode Go call/token 증가 없음
- FFmpeg encode 횟수 증가 없음
- local backup/copy/rename 오버헤드만 추가

상세 기록: `docs/loop-history/2026-08-27-31-automatic-run-artifact-transaction.md`

## 11. 검증 체계

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

최근 targeted validation:

- Loop 26 project-job helper: PASS
- Loop 27 project-mutation helper: PASS
- Loop 28 upload staging: PASS
- Loop 29 fresh snapshot: PASS
- Loop 30 upload cleanup isolated Node validation: 2/2 PASS
- **Loop 31 automatic-run artifact transaction isolated Node validation: 2/2 PASS**
  - later EDL rename failure → old video/beats/segments/EDL/QA 모두 복원, transaction debris 0
  - success path → five artifacts 모두 같은 new version으로 publish, transaction debris 0
- Loop 31 transaction helper `node --check`: PASS

현재 자동 실행환경에서 fresh repository clone 기반 full `npm run check`/`npm run demo`가 항상 가능한 것은 아니다. 실행하지 못한 full check를 성공했다고 주장하지 않는다. GitHub Actions는 추가 evidence이지 patch의 필수 gate가 아니다.

## 12. Mini PC self-hosted CI

관련 파일:

- `.github/workflows/ai-shopping-shorts-editor.yml`
- `tools/minipc-runner/bootstrap.sh`
- `tools/minipc-runner/status.sh`
- `tools/minipc-runner/remove.sh`
- `docs/MINIPC_SELF_HOSTED_RUNNER.md`

목표:

- GitHub-hosted minutes에 의존하지 않는다.
- Mini PC의 Node 22+, FFmpeg, FFprobe에서 실제 검증한다.
- 외부 fork PR은 개인 self-hosted runner에서 실행하지 않는다.
- workflow token 권한은 최소화한다.

## 13. 보안 / 데이터 원칙

- API key를 source/project JSON에 저장하지 않는다.
- `.env`와 `workspace/`를 Git에서 제외한다.
- 원본 영상/TTS/SRT는 GitHub에 commit하지 않는다.
- upload는 disk streaming한다.
- path에 `safeFilename()`을 사용한다.
- malformed Range는 416 처리한다.
- public repository self-hosted runner에서 외부 fork 코드를 자동 실행하지 않는다.
- AI response는 ID/type/range contract를 검증한 뒤 사용한다.
- partial upload는 project metadata에 publish하지 않는다.
- mutating route는 lock 전 snapshot을 persist source로 사용하지 않는다.
- cleanup은 exact tool-owned staging pattern과 충분한 age 조건 없이 사용자 media를 삭제하지 않는다.
- failed automatic run은 이전 authoritative output generation을 가능한 범위에서 rollback 보존한다.

## 14. 알려진 한계 / 리스크

1. **SRT 없는 TTS alignment**는 forced alignment가 아니라 무음구간+문장 길이 추정이다.
2. scene detection은 FFmpeg scene score 기반이며 별도 TransNet/PySceneDetect adapter는 아직 없다.
3. Quality Judge는 제한된 replacement 정책이며 다단 재평가 loop는 없다.
4. 사용자 manual 선택을 장기 학습하는 preference model은 없다.
5. process restart 후 in-memory job/mutation status는 사라진다.
6. crash가 upload final rename 직후 project metadata commit 전에 발생하면 **완전하지만 unreferenced orphan input**이 남을 수 있다. 자동 삭제 정책은 아직 없다.
7. 24h stale staging cleanup은 새 successful upload 시 opportunistic하게 실행되므로, 더 이상 업로드가 없으면 오래된 `.part`는 그대로 남을 수 있다.
8. 여러 독립 server process가 같은 workspace를 공유하는 것을 막는 cross-process lock은 없다.
9. automatic-run artifact transaction은 실행 중 예외에는 rollback-safe하지만, multi-file commit 중 hard power/process loss가 발생하면 rollback 자체가 실행되지 못할 수 있다.
10. 전체 실제 상품영상 품질 benchmark corpus는 아직 부족하다.

## 15. 개발 로드맵

### Phase A — Reliability / state integrity (현재)

완료:

- AI response contracts
- cache validation/versioning
- atomic JSON
- transactional manual rerender
- project mutation serialization
- staged upload publish
- post-claim fresh project snapshot
- age/provenance 기반 stale staging cleanup
- **transactional automatic-run completed generation publish**

남은 후보:

- automatic artifact commit hard-crash window가 실제 문제인지 fault-injection으로 측정
- metadata에 없는 full orphan upload의 provenance/age 정책
- cross-process workspace ownership/lock 필요성 평가
- disk-full/permission failure injection coverage

### Phase B — Timing quality

- SRT 없는 TTS alignment 품질 개선 가능성 검토
- 긴/짧은 narration beat 분할 정책 개선
- source boundary 근처 trim 안정성

### Phase C — Semantic edit quality

- caption↔visual benchmark set 구축
- Planner candidate ranking 개선
- Quality Judge replacement precision 측정
- same-source run/diversity tuning

### Phase D — Cost optimization

- 실제 cache-hit ratio 측정
- Vision batch/token budget 최적화
- quality gain 없는 Judge/API 호출 제거

### Phase E — Review UX

- timeline lock/regenerate
- replacement comparison UX
- manual replacement rate 계측

### Phase F — Packaging / release readiness

- Windows/Mini PC 실행 UX 단순화
- dependency/license 재검토
- recovery/backup UX
- representative real-video acceptance suite

## 16. 다음 작업 우선순위

가장 먼저 검토할 후보:

**automatic artifact transaction의 remaining hard-crash window가 실제 운용에서 의미 있는지 증거를 먼저 수집한다.** Mini PC에서 process-kill/disk-failure fault injection으로 multi-file commit 중단 시 결과를 관찰할 수 있다. 실제 위험이 확인되면 generation-directory + atomic manifest/pointer 구조를 검토하고, 그렇지 않으면 복잡도를 늘리지 않는다.

그 다음:

- disk-full/permission failure injection coverage
- metadata에 없는 full orphan media provenance/age 정책
- cross-process workspace ownership 문제가 실제 운용에서 필요한지 평가

## 17. 새 AI/개발자 작업 시작 체크리스트

1. PR #1 또는 successor 최신 HEAD 확인
2. `HANDOFF.md` 읽기
3. `LOOP_ENGINEERING.md` 읽기
4. 최신 `docs/loop-history/` 읽기
5. 변경 대상 source/test 직접 확인
6. 한 회차에 가장 가치 높은 개선 1개 선택
7. regression test 추가
8. 가능한 targeted/full check 수행
9. loop-history 기록
10. 의미 있는 상태 변화면 HANDOFF 같은 회차에 업데이트
11. secrets/media/workspace가 Git diff에 없는지 확인

## 18. 사용자가 직접 해야 할 수 있는 일

현재 코드 개선 자체에는 사용자 수동 작업이 필수는 아니다.

Mini PC self-hosted CI를 아직 등록하지 않았다면 사용자가 Mini PC에 SSH 접속해 runner bootstrap을 한 번 실행해야 한다. 이후 patch/commit 자체는 Actions 상태와 독립적으로 계속할 수 있다.

## 19. 인수인계 핵심 한 문장

**이 프로젝트는 AI가 의미적으로 좋은 컷을 고르고, 결정론적 검증/캐시/transaction/staging/fresh-snapshot/recovery/FFmpeg가 그 결정을 싸고 안전하게 실행하는 CUT ONLY 쇼츠 편집기로 발전시키며, 모든 의미 있는 변경은 GitHub source + loop-history + 이 HANDOFF에 남긴다.**
