# Loop Engineering Protocol

반복 개선은 기능 추가보다 실제 실패를 먼저 줄인다.

## Every loop
1. 현재 branch와 최근 변경 검토
2. `npm run check`
3. `npm run demo`
4. 다음 네 축에서 한 가지 이상의 병목을 찾는다.
   - semantic match quality
   - cut timing / continuity
   - API calls / token use
   - runtime / memory / UX
5. 가장 영향이 큰 한 항목만 또는 서로 독립적인 소수 항목을 수정
6. unit/integration regression test 추가
7. demo/QA 재실행
8. 실패 시 수정 또는 revert
9. 변경 이유와 trade-off 기록

## Quality metrics
- Caption↔visual judge score
- duplicate segment rate
- same-source run length
- output duration error
- invalid EDL count
- manual replacement rate after user review

## Cost metrics
- Vision calls
- Planner calls
- Judge calls
- prompt/completion/cached tokens
- estimated off-peak/peak USD range
- cache hit ratio

## Stop conditions
- 테스트가 깨진 상태로 merge 금지
- API 비용이 늘면 품질 개선 근거 필요
- UI 기능 때문에 renderer determinism을 희생하지 않는다.
- 공개 저장소에 API key/원본 영상/개인 데이터를 commit하지 않는다.
