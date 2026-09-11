# AI Shopping Shorts Editor

여러 개의 상품 원본 영상을 장면 단위로 분해하고, 자막/TTS 타이밍과 의미에 맞춰 다시 섞어 **9:16 YouTube Shopping Shorts용 컷 편집 MP4**를 만드는 로컬 MVP입니다.

## 현재 구현

- 원본 영상 2~6개 업로드
- FFprobe 메타데이터 검사
- FFmpeg scene score 기반 컷 후보 탐지 + 1~5초 쇼츠 단위 정규화
- 장면 대표 프레임 자동 추출 및 캐시
- OpenCode Go `deepseek-v4-flash-vision-exp`로 장면 의미 분석 (선택)
- OpenCode Go `deepseek-v4-flash`로 자막 ↔ 장면 매칭 및 소스 다양성 계획 (선택)
- SRT 우선 타이밍, 또는 TTS 길이/무음구간 + 대본 기반 Beat 생성
- Quality 모드에서 선택 컷 Vision Judge 재검수
- EDL 검증 후 FFmpeg deterministic 렌더
- 1080x1920 H.264/AAC MP4 출력
- 자동 QA: 해상도, 길이 오차, EDL 구조, API 호출/토큰 및 예상 비용 범위 집계
- API 키가 없어도 end-to-end fallback 테스트 가능
- 결과 타임라인에서 대체 컷 선택 후 AI 호출 없이 재렌더
- 외부 npm 의존성 0개

## 요구 환경

- Node.js 20+
- FFmpeg / FFprobe가 PATH에 등록되어 있어야 함
- 의미 기반 AI 편집을 사용할 경우 OpenCode Go API key

## 실행

```bash
npm start
```

브라우저에서 `http://127.0.0.1:4317` 접속 후 영상/TTS/SRT 또는 대본을 넣습니다.

API 키는 브라우저에서 해당 실행 요청에만 전송되며 프로젝트 파일에 저장하지 않습니다. 또는 환경변수를 사용할 수 있습니다.

```bash
# macOS/Linux
export OPENCODE_GO_API_KEY="..."
npm start

# Windows PowerShell
$env:OPENCODE_GO_API_KEY="..."
npm start
```

## 로컬 전체 파이프라인 데모

실제 영상이 없어도 FFmpeg로 테스트 영상을 생성해 최종 MP4까지 만듭니다.

```bash
npm run demo
```

결과: `workspace/demo/output/shorts.mp4`

## 비용/품질 모드

- `economy`: 384px 분석, 큰 Vision batch, source당 최대 60개 후보, Judge 생략.
- `balanced`: 기본. 512px 분석, source당 최대 80개 후보, Planner 사용, Judge 생략.
- `quality`: 640px 분석, source당 최대 100개 후보, 최종 선택 컷을 Vision으로 다시 평가하고 낮은 점수는 대체 후보로 교체.

같은 원본을 같은 프로젝트에서 다시 실행할 때 Vision 분석 결과를 SHA-256 기반으로 캐시합니다.

## 데이터 흐름

```text
Videos -> FFmpeg shot detection -> representative frames
       -> OpenCode Vision metadata (cached)
Script/SRT/TTS -> Beat timeline
Beat + metadata -> OpenCode Edit Director -> EDL
EDL -> validator -> FFmpeg -> shorts.mp4 -> QA
```

## 보안

- API key를 소스코드/프로젝트 JSON에 저장하지 않습니다.
- `.env`와 `workspace/`는 gitignore 처리되어 있습니다.
- 입력 영상은 로컬 workspace에만 저장됩니다.
- 영상 업로드는 메모리 전체 적재가 아니라 디스크 streaming 방식입니다.

## 알려진 한계 / 다음 우선순위

1. SRT가 없을 때 TTS forced alignment는 현재 무음구간+문장 길이 추정 방식입니다. WhisperX/aeneas류는 의존성/설치비용 때문에 MVP 기본 의존성에서 제외했습니다.
2. scene detection은 외부 Python 모델 대신 FFmpeg scene score를 기본으로 사용합니다. 향후 선택형 PySceneDetect/TransNetV2 adapter를 추가할 수 있습니다.
3. Quality Judge의 저점 장면 교체는 현재 첫 대체 후보를 사용하며, 대체 후보까지 재평가하는 2차 루프는 다음 단계입니다.
4. 대체 컷 선택/재렌더는 구현되어 있으나, 사용자 선택을 장기적으로 학습하는 preference model과 전체 타임라인 lock/regenerate UX는 다음 단계입니다.

## 라이선스

프로젝트 코드는 MIT 라이선스 예정. 포함하는 외부 모델/도구의 라이선스는 별도 준수해야 합니다. FFmpeg 배포 방식에 따라 라이선스 조건이 달라질 수 있으므로 제품 패키징 단계에서 재검토가 필요합니다.
