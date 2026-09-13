# PRD — AI Shopping Shorts Auto Editor

## Problem
상품 영상 3~4개를 단순 연결하는 것이 아니라, 각 영상을 장면 단위로 잘게 분석한 뒤 사용자가 제공한 자막/TTS의 의미와 시간에 맞춰 서로 다른 원본 구간을 재조합해야 한다.

## Primary user flow
1. 원본 영상 2~6개 선택
2. 대본 입력, TTS와 SRT 선택
3. 품질 모드 선택
4. AI 자동 컷 편집 실행
5. 결과/QA/EDL 검토
6. 마음에 안 드는 컷은 alternative로 교체
7. AI 호출 없이 재렌더

## Product rules
- 자막/효과/스티커/음악은 만들지 않는다. CUT ONLY.
- 평균적인 시각적 변화는 1.5~3.2초를 목표로 한다.
- 고정 2.5초 컷이 아니라 자막/TTS Beat 경계가 우선이다.
- 의미 일치 > 소스 다양성 > 미학적 다양성 순으로 판단한다.
- 같은 segment 재사용을 기본 금지한다.
- 동일 source 3회 연속은 대체 후보가 있으면 회피한다.
- AI는 EDL을 결정하고 FFmpeg가 결정론적으로 렌더한다.

## MVP acceptance
- 2~6개 영상으로 9:16 H.264 MP4 생성
- SRT가 있으면 해당 타임라인과 출력 길이 오차 250ms 이하
- EDL gap/overlap/invalid source range 0
- API 실패 시 앱이 중단되지 않고 deterministic fallback 가능
- API key 저장 금지
- 같은 원본 AI metadata 캐시
- 수동 alternative 교체 시 추가 AI 호출 0

## AI modes
### Economy
- 384px representative frame
- Vision batch 14
- source당 최대 60 segment
- Judge 없음

### Balanced
- 512px representative frame
- Vision batch 10
- source당 최대 80 segment
- Judge 없음

### Quality
- 640px representative frame
- Vision batch 8
- source당 최대 100 segment
- 선택된 컷을 Vision Judge로 2차 검수

## Non-goals for MVP
- 자동 자막 스타일링
- 음악/효과음
- 트랜지션/줌
- 썸네일
- 유튜브 자동 업로드
- 생성형 영상 제작
