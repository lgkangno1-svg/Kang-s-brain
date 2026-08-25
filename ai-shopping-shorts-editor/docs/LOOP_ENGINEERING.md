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

## Durable lessons
- AI를 쓰지 않는 deterministic fallback도 품질 점수 정렬을 실제 선택에 그대로 반영해야 한다. 후보를 품질순으로 정렬한 뒤 beat index로 회전 선택하면 낮은 품질 장면을 의도적으로 고를 수 있으므로, duration/중복/diversity 제약을 적용한 뒤 최고 점수의 남은 후보를 우선한다.
- Quality Judge가 낮은 점수 컷을 대체할 때도 초기 EDL의 불변조건을 보존해야 한다. 특히 다른 beat가 이미 사용 중인 segment를 대체 후보로 다시 선택하면 Judge API 비용을 지불한 뒤 최종 EDL 검증에서 실패할 수 있으므로, 대체 선택 시 현재 점유 segment 집합을 유지하고 중복 후보를 사전에 제외한다.
- 수동 컷 교체도 자동 편집과 같은 EDL 불변조건을 렌더 전에 확인해야 한다. 다른 beat가 이미 쓰는 segment를 사용자가 선택한 경우 EDL을 저장하거나 FFmpeg를 실행하기 전에 거부해야 불필요한 재렌더와 사후 QA 실패를 막을 수 있다.
- TTS가 있는 렌더에서는 오디오 길이를 전체 출력 길이의 기준으로 사용하지 않는다. `-shortest`는 TTS 파일이 beat/EDL 타임라인보다 조금만 짧아도 영상 자체를 조기 종료시킬 수 있으므로, 최종 출력 길이는 EDL의 program timeline으로 고정하고 오디오는 그 길이 안에서 매핑한다.

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
