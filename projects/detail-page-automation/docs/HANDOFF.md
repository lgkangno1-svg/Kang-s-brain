# 상세페이지 자동화 — 인수인계 / North Star

## 개발 의도
사용자가 상품 사진과 특징 몇 줄만 제공하면 Q1~Q10 작성부터 최종 상세페이지 이미지까지 자동으로 완주하는 Codex 기반 제작 시스템을 만든다.

## 최종 목표
- 사용자 입력 최소화
- TED/골든서클 기반 설득 구조 유지
- 제품별 산출물 완전 분리
- 14장 구성과 규격 자동 준수
- 참조 상품 이미지 활용
- 별도 OpenAI API 키 없이 Codex 사용 환경 안에서 이미지 생성
- 허위 하드 팩트 생성 방지
- 결과 검증 자동화

## 현재 아키텍처
1. Codex가 `AGENTS.md`를 읽고 워크플로를 오케스트레이션
2. Q1~Q10은 `01_q1_q10.json`을 canonical source로 저장
3. `scripts/build_master.py`가 사람이 읽는 TED 양식과 filled master를 생성
4. Codex가 filled master를 기반으로 14장 전략과 `04_image_jobs.json` 생성
5. **Codex 내장 이미지 생성 스킬(GPT Image)** 이 참조 상품 사진과 14개 job prompt를 사용해 이미지를 생성
6. `scripts/generate_images.py`는 API 호출 없이 생성된 로컬 이미지만 정확한 규격으로 보정하고 `detail_full.png`를 결합
7. `scripts/validate_run.py`가 구조/규격/필수 prompt chain/중복을 검증

## 핵심 설계 결정
- LLM 판단과 이미지 생성은 사용자의 ChatGPT 로그인 기반 Codex 환경이 담당한다.
- 템플릿 주입/규격 보정/파일 검증은 deterministic Python으로 분리한다.
- 사용자에게 `OPENAI_API_KEY`를 요구하지 않는다.
- OpenAI Images API 직접 호출은 기본 경로에서 사용하지 않는다.
- 실제 제품 사진이 있으면 이미지 생성 스킬의 참조 이미지로 활용해 제품 정체성을 최대한 유지한다.
- 하드 팩트는 사용자/자료 근거 없이는 생성하지 않는다.

## 현재 완료
- 기준 원문 2개 보존
- Q1~Q10 빈 템플릿
- Codex 전용 AGENTS 워크플로
- master 자동 주입 스크립트
- Codex 이미지 생성 스킬 기반 14장 생성 규칙
- API 없는 자동 규격 보정 및 detail_full 결합
- 자동 검증 스크립트
- 사용법 README

## 다음 우선순위
1. 실제 상품 1개로 end-to-end 시험
2. Codex 이미지 생성 스킬의 한글 타이포 정확도 평가
3. 필요 시 “AI가 배경/제품 비주얼 생성 + Pillow가 한글 카피 오버레이” 하이브리드 렌더러 추가
4. 카테고리별 프롬프트 프리셋(신선식품/가공식품/생활용품 등)
5. 선택적 재생성 규칙 고도화

## 테스트
- `python scripts/build_master.py <q_json>`
- Codex 이미지 생성 스킬로 14장 생성
- `python scripts/generate_images.py <jobs_json>`
- `python scripts/validate_run.py <run_dir> --require-images`

## 회귀 주의사항
- source 원문을 임의로 축약/변형하지 않는다.
- 마스터의 14장 구조/해상도를 임의로 바꾸지 않는다.
- 같은 증거를 여러 이미지에 반복하지 않는다.
- 식품 안전/효능을 증빙 없이 단정하지 않는다.
- API 키 요구나 별도 API 과금 경로를 기본값으로 다시 넣지 않는다.

## 최근 변경 이력
- 2026-08-30: 이미지 생성 경로를 직접 OpenAI API 호출에서 Codex 내장 이미지 생성 스킬로 변경. API 키 요구 제거. Python은 후처리/결합/검증만 담당.
- 2026-08-30: 최초 자동화 부트스트랩. Q1~Q10 → filled master → 14 image jobs → image generation → validation 파이프라인 구축.
