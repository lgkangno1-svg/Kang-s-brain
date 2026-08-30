# Codex 상세페이지 자동화

상품 사진 + 상품 특징 몇 줄만으로 **Q1~Q10 → 골든서클 상세페이지 기획 → 썸네일 2장 + 상세 12장 → 최종 이미지**까지 진행하는 Codex 전용 워크플로입니다.

## 사용자가 실제로 할 일

Codex에서 이 프로젝트 폴더를 연 뒤 아래처럼 말하면 됩니다.

> 상세페이지 만들어. 상품명은 사과대추야. 국내산이고 아삭하고 달콤한 가을 제철 원물이야. 판매가는 29,900원이고 1kg 구성. 사진은 첨부했어.

그다음 Codex가 `AGENTS.md`를 읽고 제품별 `runs/...` 폴더를 만들며 자동 진행합니다.

## 입력 방법

둘 중 편한 방법 하나만 사용하세요.

1. **가장 간단함:** Codex 채팅에 사진을 첨부하고 상품 특징을 몇 줄 적기
2. `inbox/<상품명>/` 폴더를 만들고 `상품정보.txt`와 사진을 넣은 뒤 “이 상품 상세페이지 만들어”라고 하기

`templates/상품정보_간단양식.txt`는 선택사항입니다. 빈칸을 모두 채울 필요 없습니다.

## 자동 파이프라인

1. 상품 정보/이미지 분석
2. Q1~Q10 자동 작성
3. TED 양식 완성본 생성
4. 상세페이지 마스터 원문에 자동 주입
5. 골든서클/메시지 포트폴리오/중복 방지 맵 작성
6. 14장 카피 + 이미지 생성 프롬프트 작성
7. 실제 이미지 14장 생성
8. 상세 12장 세로 결합
9. 자동 검증

## 이미지 생성 1회 설정

실제 이미지까지 자동 생성하려면 OpenAI API 키를 환경 변수 `OPENAI_API_KEY`로 한 번만 등록하면 됩니다.
키는 GitHub에 저장하지 않습니다.

PowerShell 예:
```powershell
setx OPENAI_API_KEY "여기에_API_KEY"
```

새 터미널/Codex 세션부터 적용됩니다.

이미지 모델과 품질은 환경 변수로 바꿀 수 있습니다.
- `IMAGE_MODEL` 기본값: `gpt-image-2`
- `IMAGE_QUALITY` 기본값: `medium`

## 수동 실행

```bash
python scripts/build_master.py runs/<RUN>/01_q1_q10.json
python scripts/generate_images.py runs/<RUN>/04_image_jobs.json
python scripts/validate_run.py runs/<RUN> --require-images
```

## 폴더 구조

```text
AGENTS.md
source/
  TED_상페-고객님_정보요청_원본.txt
  TED_상페_Q1-Q10_빈양식.txt
  상세페이지_마스터_원문.txt
templates/
scripts/
inbox/
runs/
docs/
```

## 중요한 원칙

- Q1~Q10을 사용자에게 다시 물어보지 않고 최대한 자동 보완
- 숫자/인증/원산지/가격/검사결과 등 하드 팩트는 발명 금지
- 동일 메시지 반복 방지
- 식품은 안전성만 반복하지 않고 맛·식감·신선도·활용·가격가치 등을 균형 있게 구성
- 이미지 생성 중 실패해도 재실행하면 완료된 이미지는 건너뛰고 이어서 진행
