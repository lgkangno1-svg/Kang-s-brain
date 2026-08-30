# Protected master prompt registry

서비스 기준 마스터 프롬프트 원문은 공개 저장소의 브라우저/클라이언트 코드에 노출하지 않는다. 아래 SHA-256은 2026-08-30 제품 오너가 제공한 원본 파일 기준이다.

| Runtime ID | Owner source filename | Required SHA-256 |
|---|---|---|
| `direct_conversion_master` | `유튜브 그대로 상페 (1).txt` | `2992b68defdbafe55086a42906456931a8cc5b895f26b78ce4ee3f3ae9c2058a` |
| `ted_customer_questionnaire` | `TED 상페- 고객님 정보요청.txt` | `21c2f7a3e011a3a7d3f80bc6dc670915eff5f8f98cdf7175723a623222b364ab` |
| `ted_master_v3` | `마스터프롬프트 개선버전.txt` | `779478c7896a940a89b37bb37a0eecef9f85e8073a18c6ab7671b052f8002d3f` |

## Runtime environment paths

- `DETAIL_DIRECT_MASTER_PATH`
- `DETAIL_TED_QUESTIONNAIRE_PATH`
- `DETAIL_TED_MASTER_PATH`

24시간 서비스 worker는 서버의 private/protected volume 또는 private prompt store에서 위 파일을 읽는다. 실제 prompt 원문을 고객 API 응답, 로그, 분석 이벤트, ZIP 결과물에 포함하지 않는다.

기존 `source/` 파일은 과거 Codex 부트스트랩 호환용일 수 있으며, 위 fingerprint와 일치한다고 검증되지 않은 파일을 최신 제품 오너 마스터라고 가정하지 않는다.
