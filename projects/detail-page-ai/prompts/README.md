# Prompt registry policy

The proprietary master prompt bodies are intentionally NOT committed to this public repository.

Runtime prompt identities:

- `direct_conversion_master`
  - source file supplied by product owner: `유튜브 그대로 상페 (1).txt`
  - SHA-256: `2992b68defdbafe55086a42906456931a8cc5b895f26b78ce4ee3f3ae9c2058a`
- `ted_customer_questionnaire`
  - source file supplied by product owner: `TED 상페- 고객님 정보요청.txt`
  - SHA-256: `21c2f7a3e011a3a7d3f80bc6dc670915eff5f8f98cdf7175723a623222b364ab`
- `ted_master_v3`
  - source file supplied by product owner: `마스터프롬프트 개선버전.txt`
  - SHA-256: `779478c7896a940a89b37bb37a0eecef9f85e8073a18c6ab7671b052f8002d3f`

Production must load prompt bodies from a private server-side prompt store or protected deployment secret/volume. Never expose prompt bodies to the browser, generated download bundle, logs, analytics, or customer-facing API responses.
