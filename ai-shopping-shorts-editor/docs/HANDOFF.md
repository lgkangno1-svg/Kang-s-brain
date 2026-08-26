# AI Shopping Shorts Editor — Project Handoff / Living Status

> 이 문서는 프로젝트의 **공식 인수인계 기준 문서(source of truth)** 다. 새 AI/개발자는 과거 채팅 기억보다 최신 GitHub source, 이 문서, `docs/LOOP_ENGINEERING.md`, 최신 `docs/loop-history/`를 먼저 확인한다.
>
> **업데이트 계약:** 코드, 설정, 테스트, CI, 비용, 보안, 제품 범위, 현재 phase, 알려진 한계, 다음 우선순위가 의미 있게 바뀌면 같은 작업 회차에서 이 문서도 갱신한다.

## 1. 프로젝트 정의

여러 개의 상품 원본 영상을 장면 단위 semantic segment로 분해하고, 사용자가 제공한 **대본/SRT/TTS의 의미와 타이밍에 맞춰** 원본 구간을 재조합하여 **YouTube Shopping Shorts용 9:16 컷 편집 MP4**를 만드는 로컬 AI 보조 편집기다.

핵심은 생성형 영상 제작이 아니라 **AI가 좋은 EDL(Edit Decision List)을 저비용·고신뢰로 만들고 FFmpeg가 그 결정을 결정론적으로 실행하는 구조**다.

## 2. 개발 의도 / 최종 목표

사용자가 가장 반복적으로 시간을 쓰는 부분은 장면 탐색, 의미 파악, 자막/TTS 경계에 맞춘 컷 길이 결정, 여러 원본 간 장면 선택, 저품질 컷 검수다. 자막 디자인·효과·음악 등은 다른 후반 툴에서 수행할 수 있으므로 현재 범위는 CUT ONLY로 제한한다.

설계 원칙:

- **AI = 의미 판단 / 편집 결정**
- **FFmpeg = 미디어 실행 엔진**
- **validated EDL = AI와 renderer 사이의 계약**
- **deterministic guard first**: 비용이 들지 않는 로컬 검증으로 막을 수 있는 오류는 AI 재호출로 해결하지 않는다.
- **recoverable local state**: 실패한 upload/render/save가 마지막 정상 결과를 훼손하지 않아야 한다.
- **low-cost iteration**: 같은 source/analysis 조건은 cache하고 manual replacement는 AI 0-call로 처리한다.

최종 사용자 흐름 목표:

1. 원본 영상 2~6개 입력
2. 대본 + TTS 입력, 가능하면 SRT 입력
3. Economy / Balanced / Quality 선택
4. 자동 컷 편집 실행
5. MP4 + QA + timeline 확인
6. 마음에 들지 않는 beat의 alternative 선택
7. 추가 AI 호출 없이 재렌더

품질 목표:

- narration 의미 경계와 컷 전환이 자연스럽다.
- 시각 변화는 대략 1.5~3.2초를 지향하되 고정 길이보다 의미 경계를 우선한다.
- 의미 일치 > 소스 다양성 > 미학적 다양성 순으로 판단한다.
- 동일 segment 중복 사용을 기본 금지한다.
- 불필요한 동일 source 연속 사용을 줄인다.
- MP4, EDL, QA가 항상 같은 cut version을 가리킨다.
- malformed AI 응답, 손상 cache, partial upload, 부분 저장, 동시 mutation이 정상 결과처럼 남지 않는다.

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
- local cache / telemetry / crash-safe persistence

현재 비포함:

- 자동 자막 스타일링
- 스티커/그래픽
- 트랜지션/줌/시각효과
- BGM/효과음
- 썸네일
- YouTube 자동 업로드
- 생성형 영상 제작

새 기능은 CUT ONLY 범위를 깨지 않는지 먼저 확인한다.

## 4. 저장소 / 현재 작업 위치

- Repository: `lgkangno1-svg/Kang-s-brain`
- Project directory: `ai-shopping-shorts-editor/`
- Active PR: `#1 — feat: bootstrap AI Shopping Shorts Editor MVP`
- Active branch: `feat/ai-shopping-shorts-editor-bootstrap`
- Base: `main`
- Loop 28 시작 HEAD: `7dffc379b05f0cf3c05ea09fe323c8f762bdb4eb`
- Loop 28 staged-upload code HEAD: `7ba489d80f6b0a4a97fa9ca6747a100113e44ec8`

SHA는 snapshot이다. 다음 작업자는 반드시 PR 최신 HEAD를 다시 확인한다.

## 5. 현재 아키텍처

```text
Browser UI
  -> local Node HTTP server
    -> streaming uploads
      -> hidden unique .part staging file
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

EDL
  -> deterministic FFmpeg renderer
  -> 1080x1920 H.264/AAC MP4
  -> QA JSON

Review UI
  -> alternative selection
  -> no-AI rerender
  -> staged + transactional MP4/EDL/QA publish
```

### Same-project mutation boundary

`jobs` Map은 사용자에게 보이는 작업 상태/결과 저장소이고, 별도 `activeMutations` Map은 프로젝트 파일 mutation 소유권을 관리한다.

동일 project에서 다음 mutation은 서로 겹칠 수 없다.

- `POST /upload`
- `POST /run`
- `POST /replace`

충돌 시 HTTP 409. 서로 다른 project는 병렬 실행 가능하다. read-only status/EDL/segments/QA/video endpoint는 이 lock으로 막지 않는다.

관련 파일:

- `src/core/project-job.mjs`
- `src/core/project-mutation.mjs`
- `src/server.mjs`

### Upload durability boundary — Loop 28

업로드 bytes를 더 이상 최종 input filename으로 직접 쓰지 않는다.

1. `createUploadPaths()`가 hidden `.upload-<token>.part` staging path와 고유 final path를 만든다.
2. HTTP request stream은 staging file에만 기록한다.
3. stream이 정상 완료된 뒤 `rename(staged, final)` 한다.
4. 그 다음에만 `project.json`에 final path를 등록한다.
5. metadata persistence가 실패하면 final file도 rollback 삭제한다.
6. 강제 종료가 stream 중 발생하면 project metadata는 그 partial file을 참조하지 않는다.
7. final filename에 고유 token이 포함되어 이전 orphan이 다음 upload를 `EEXIST`로 막지 않는다.

강제 종료가 **final rename 직후~project.json commit 직전** 발생하면 완전한 orphan final file이 남을 수는 있다. 하지만 project metadata가 참조하지 않고 이름 충돌도 일으키지 않으므로 정상 input으로 오인되지 않는다. stale orphan cleanup은 별도 recovery 정책으로 다뤄야 하며, 사용자 media를 추정으로 삭제하지 않는다.

관련 파일:

- `src/core/upload-staging.mjs`
- `test/upload-staging.test.mjs`
- `src/server.mjs`

## 6. AI 모델 / 연동

기본 설정:

- Vision: `deepseek-v4-flash-vision-exp`
- Planner: `deepseek-v4-flash`
- API: OpenCode Go OpenAI-compatible chat completions

모델 ID는 편집 로직과 분리된 설정값이다. renderer는 free-form AI prose를 실행하지 않고 validated EDL만 소비한다.

API key가 있는 실제 AI 모드에서는 Vision/Planner/Judge protocol failure를 정상 AI 성공처럼 숨기지 않는다. API key가 없는 테스트 모드의 deterministic fallback은 유지한다.

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
8. correctness/reliability guard는 deterministic local logic을 우선한다.

## 8. 현재 구현 완료 상태

현재 구현됨:

- 2~6개 영상 업로드
- disk streaming upload
- **hidden unique staging upload + completed-file publish**
- **metadata persistence 실패 시 published upload rollback**
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
- 동일 project upload/run/replace mutation serialization
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
24. MP4/EDL/QA transactional publish/rollback
25. living HANDOFF 체계 도입
26. same-project run/replace synchronous serialization
27. upload/run/replace 공통 mutation serialization
28. **upload staging + unique publish path + metadata-failure rollback**

## 10. Loop 28 변경 요약

### 문제

기존 upload는 HTTP stream을 곧바로 `inputs/<final-name>`에 `wx`로 기록했다. 예외가 발생하면 삭제했지만 프로세스 종료/전원 장애는 catch/finally를 실행하지 않으므로 partial file이 final filename으로 남을 수 있었다. project.json에는 없더라도 다음 동일 upload path와 충돌해 `EEXIST`를 만들 가능성이 있었다.

### 해결

- `src/core/upload-staging.mjs` 추가
- upload를 hidden unique `.part`에 먼저 기록
- stream 완료 후에만 final filename으로 rename
- final filename에 고유 token 포함
- rename 후 project metadata commit
- metadata commit 실패 시 final file rollback
- 실패한 staging은 best-effort 삭제
- 사용자 원본/AI secret에는 변화 없음

### 비용 영향

- OpenCode Go call/token 증가 없음
- FFmpeg 증가 없음
- 동일 파일시스템 rename 1회 추가
- 작은 local filesystem bookkeeping만 증가

상세 기록: `docs/loop-history/2026-08-27-28-upload-staging-durability.md`

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

초기 synthetic E2E 이력: 3개 테스트 영상 → 4 beats → 1080x1920 H.264 → 9.000s, duration error 0, EDL error 0.

최근 targeted validation:

- Loop 26 project-job helper: 3/3 PASS
- Loop 27 project-mutation helper: 3/3 PASS
- Loop 28 `upload-staging.mjs` syntax: PASS
- Loop 28 targeted runtime:
  - unique staging/final path: PASS
  - metadata persistence failure removes staged/final artifact: PASS
  - successful persistence keeps final artifact: PASS

현재 자동 실행환경에서 full repository clone/npm check/demo가 항상 가능한 것은 아니다. 실행하지 못한 full check를 성공했다고 주장하지 않는다. GitHub Actions는 추가 evidence이지 제품 patch의 필수 gate가 아니다. Mini PC runner가 online이면 `npm run check`와 실제 FFmpeg `npm run demo`를 수행한다.

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

## 14. 알려진 한계 / 리스크

1. **SRT 없는 TTS alignment**는 forced alignment가 아니라 무음구간+문장 길이 추정이다.
2. scene detection은 FFmpeg scene score 기반이며 별도 TransNet/PySceneDetect adapter는 아직 없다.
3. Quality Judge는 제한된 replacement 정책이며 다단 재평가 loop는 없다.
4. 사용자 manual 선택을 장기 학습하는 preference model은 없다.
5. process restart 후 in-memory job/mutation status는 사라진다.
6. crash가 upload final rename 직후 project metadata commit 전에 발생하면 **완전하지만 unreferenced orphan input**이 남을 수 있다. 현재는 정상 input으로 오인되거나 다음 upload를 막지 않지만 stale cleanup 정책은 미구현이다.
7. mutation claim보다 앞서 공통 project snapshot을 읽는 server 경로가 있어, 극단적인 interleaving에서 stale project snapshot 가능성이 있는지 재검토할 가치가 있다.
8. 전체 실제 상품영상 품질 benchmark corpus는 아직 부족하다.

## 15. 개발 로드맵

### Phase A — Reliability / state integrity (현재)

목표: AI나 FFmpeg 품질 개선보다 먼저 잘못된 상태가 정상 결과로 남지 않게 한다.

완료:

- AI response contracts
- cache validation/versioning
- atomic JSON
- transactional manual rerender
- project mutation serialization
- staged upload publish

남은 후보:

- mutation ownership보다 앞선 stale project read 가능성 검토
- stale `.part` / orphan full upload의 안전한 startup recovery 정책
- interrupted run의 work/output artifact provenance 점검
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

**`server.mjs`가 project mutation을 claim하기 전에 `project.json`을 읽는 현재 순서가, 거의 동시에 요청이 들어오는 극단적 interleaving에서 stale project snapshot을 허용하는지 검증한다.** 실제 race가 확인되면 mutation claim 이후 최신 project를 다시 읽는 최소 수정이 우선이다.

그 다음:

- 오래된 `.upload-*.part`를 언제 안전하게 지울 수 있는지 정책화
- metadata에 없는 full orphan file은 자동 삭제하지 말고 provenance/age evidence를 먼저 정의

## 17. 새 AI/개발자 작업 시작 체크리스트

1. PR #1 또는 successor의 최신 HEAD 확인
2. 이 `HANDOFF.md` 읽기
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

**이 프로젝트는 AI가 의미적으로 좋은 컷을 고르고, 결정론적 검증/캐시/transaction/staging/FFmpeg가 그 결정을 싸고 안전하게 실행하는 CUT ONLY 쇼츠 편집기로 발전시키며, 모든 의미 있는 변경은 GitHub source + loop-history + 이 HANDOFF에 남긴다.**
