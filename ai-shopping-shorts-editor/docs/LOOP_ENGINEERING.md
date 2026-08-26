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
- Quality Judge가 실제 선택 segment를 바꾼 뒤에는 review용 `alternatives`도 새 현재 상태에 맞춰 갱신한다. 새 current segment를 alternatives에 남겨 자기 자신을 교체 후보로 보여주지 말고, 직전 정상 선택은 첫 rollback 후보로 보존하며 중복 ID를 제거한다.
- 수동 컷 교체도 자동 편집과 같은 EDL 불변조건을 렌더 전에 확인해야 한다. 다른 beat가 이미 쓰는 segment를 사용자가 선택한 경우 EDL을 저장하거나 FFmpeg를 실행하기 전에 거부해야 불필요한 재렌더와 사후 QA 실패를 막을 수 있다.
- 수동 컷 교체로 current segment가 바뀌면 review용 `alternatives`도 Judge 자동 교체와 같은 규칙으로 즉시 갱신한다. 새 current segment는 목록에서 제거하고, 직전 current segment는 rollback 후보로 보존하며 중복 ID를 제거해야 연속 수동 검수에서 자기 자신을 다시 선택하거나 되돌리기 경로를 잃지 않는다.
- 수동 컷 교체는 새 EDL을 먼저 영구 저장하거나 기존 `shorts.mp4`에 직접 FFmpeg 출력하지 않는다. 후보 EDL을 먼저 검증하고 같은 디렉터리의 임시 MP4로 렌더한 뒤 성공한 경우에만 최종 영상/EDL/QA 상태를 갱신해야, FFmpeg 실패 시 디스크의 EDL은 새 컷인데 실제 영상은 이전 컷인 불일치를 막고 마지막 정상 출력도 보존할 수 있다.
- 수동 컷 교체의 마지막 publish도 `shorts.mp4`, `edl.json`, `qa.json`을 서로 독립적으로 덮어쓰지 않는다. 새 JSON까지 먼저 staging하고 기존 세 파일의 backup을 만든 뒤 commit 순서를 실행하며, 중간 rename/write 실패가 나면 이미 교체된 파일까지 이전 backup으로 복구해야 review UI와 영상/EDL/QA가 항상 같은 cut version을 가리킨다.
- EDL의 program timeline 길이와 실제 source trim 길이는 clip마다 같은 불변조건으로 검증한다. 둘이 다르면 concat 결과가 의도한 beat 길이를 보장하지 못하고 FFmpeg를 돌린 뒤 duration QA에서야 실패가 드러날 수 있으므로, 렌더 전에 허용 가능한 rounding tolerance 안에서 `programEnd-programStart === sourceEnd-sourceStart`를 확인한다.
- TTS가 있는 렌더에서는 오디오 길이를 전체 출력 길이의 기준으로 사용하지 않는다. `-shortest`는 TTS 파일이 beat/EDL 타임라인보다 조금만 짧아도 영상 자체를 조기 종료시킬 수 있으므로, 최종 출력 길이는 EDL의 program timeline으로 고정하고 오디오는 그 길이 안에서 매핑한다.
- `minBeat`보다 짧은 micro-beat는 이전 beat와 합칠 수 있을 때만 처리하면 첫 beat가 그대로 남는다. 쇼츠 시작의 0.x초 순간 컷을 줄이려면 이전 병합이 불가능한 경우 다음 beat와도 `maxBeat` 범위 안에서 안전하게 forward-merge하고 타임라인 연속성을 보존한다.
- SRT를 편집 타임라인의 source of truth로 사용할 때는 단순 공백뿐 아니라 겹치는 cue도 EDL 생성 전에 정규화해야 한다. 부분 겹침은 자막 순서를 보존한 채 다음 cue의 시작점을 직전 cue 끝으로 당기고, 완전히 직전 cue 안에 포함된 cue는 텍스트를 직전 beat에 흡수해 0/음수 길이 beat와 program overlap을 만들지 않는다.
- SRT 파일의 블록/번호 순서를 시간 순서라고 가정하지 않는다. 내보내기·수정 과정에서 cue 블록이 뒤섞여도 정상 타임라인을 겹침으로 오판하지 않도록 gap/overlap 정규화 전에 `start` 오름차순으로 정렬하고, 같은 시작 시각은 더 긴 cue를 먼저 처리한다.
- 유료 Vision batch 응답은 배열이라는 이유만으로 신뢰하지 않는다. 요청한 segment ID가 정확히 한 번씩 모두 돌아왔는지 검증하고, 누락·중복·예상 밖 ID가 하나라도 있으면 조용히 로컬 기본 메타데이터와 섞지 말고 실패로 처리해야 Planner가 부분적으로 미분석된 장면을 정상 AI 분석 결과처럼 사용하지 않는다.
- Vision 응답의 segment ID만 맞는다고 semantic metadata까지 정상이라고 가정하지 않는다. `description`, string-array 의미 필드, `shotType`, 0~1 품질/가시성/동작/confidence 숫자 필드를 프롬프트 스키마 그대로 검증하고 malformed batch는 Planner 입력 전에 거부해야 문자열 강제 변환이나 잘못된 의미 증거가 유료 분석 결과로 굳는 것을 막을 수 있다.
- Vision 응답 계약을 강화했으면 캐시 키도 계약 버전을 포함해야 한다. source hash/model/분석 설정만 같은 과거 캐시는 새 semantic schema를 우회할 수 있으므로, cache fingerprint에 명시적 schema version을 넣어 계약 변경 시 이전 캐시를 자동 무효화하고 새 분석 결과만 재사용한다.
- 캐시 key가 현재 schema와 일치해도 cache payload 자체를 신뢰하지 않는다. 파일이 수동 수정·부분 손상되거나 중복 ID가 누락 ID를 가리는 경우가 있으므로, cache hit 직전에 라이브 Vision 응답과 동일한 ID/semantic-field validator를 다시 적용하고 실패한 캐시는 재분석 대상으로 취급한다.
- Vision 캐시와 EDL/QA 같은 재사용 가능한 JSON 상태는 목적 파일에 직접 덮어쓰지 않는다. 쓰기 중 프로세스 종료·직렬화/디스크 오류가 발생하면 이전 정상 상태까지 잘릴 수 있으므로, 같은 디렉터리의 임시 파일을 완성한 뒤 atomic rename으로 교체하고 실패 시 임시 파일만 정리해 마지막 정상 파일을 보존한다.
- 유료 Planner 응답도 `choices` 배열이라는 이유만으로 정상 계획으로 취급하지 않는다. 요청한 beat ID가 정확히 한 번씩 모두 존재하는지 먼저 검증하고, 누락·중복·예상 밖 beat는 프로토콜 실패로 처리한다. 반면 segment 길이·중복·sourceStart 같은 선택 품질/제약 문제는 기존 deterministic repair 단계가 다루게 해 프로토콜 오류와 정상 auto-repair를 구분한다.
- Planner choice의 실행 필드는 타입 계약도 검증한다. `segmentId`는 비어 있지 않은 문자열, `sourceStart`는 유한한 number, `score`는 0~100 범위의 유한한 number, `alternatives`는 비어 있지 않은 문자열 ID 배열이어야 한다. 문자열 숫자·NaN·null 같은 malformed 응답을 repair 단계까지 흘리면 JavaScript 강제 변환이나 iterable 오류로 실패 원인이 숨겨질 수 있으므로, 값의 실제 범위/중복/segment 길이 같은 선택 품질 문제와 타입 프로토콜 오류를 분리한다.
- 유료 Quality Judge 응답도 부분 결과를 정상 검수처럼 적용하지 않는다. 요청한 각 beat에 대해 정확히 하나의 judgment가 있어야 하며, 누락·중복·예상 밖 beat가 있으면 해당 batch의 2차 검수를 실패로 취급해 부분 score가 조용히 EDL에 섞이는 것을 막는다.
- Quality Judge의 `score`는 단순히 `Number(...)`로 강제 변환하지 않는다. 문자열·null·비정상 숫자·0~100 범위 밖 값은 threshold 비교를 왜곡하거나 `NaN < threshold === false`로 저품질 컷을 통과시킬 수 있으므로, 유한한 number 타입이면서 0~100 범위인지 응답 계약 단계에서 검증한다.
- self-hosted CI는 GitHub Actions 성공을 제품 패치의 전제조건으로 만들지 않는다. Mini PC가 offline이거나 workflow가 queued여도 검증 가능한 변경은 branch/history에 저장하고, runner가 온라인일 때 `npm run check`와 실제 FFmpeg `npm run demo`를 추가 증거로 사용한다. 공개 저장소의 개인 self-hosted runner에서는 외부 fork PR 코드를 실행하지 않고 `GITHUB_TOKEN` 권한도 최소화한다.

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