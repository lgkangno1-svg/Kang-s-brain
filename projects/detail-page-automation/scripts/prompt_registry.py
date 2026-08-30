from __future__ import annotations

import hashlib
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PROMPTS = {
    "direct_conversion_master": {
        "env": "DETAIL_DIRECT_MASTER_PATH",
        "sha256": "2992b68defdbafe55086a42906456931a8cc5b895f26b78ce4ee3f3ae9c2058a",
        "fallback": None,
    },
    "ted_customer_questionnaire": {
        "env": "DETAIL_TED_QUESTIONNAIRE_PATH",
        "sha256": "21c2f7a3e011a3a7d3f80bc6dc670915eff5f8f98cdf7175723a623222b364ab",
        "fallback": ROOT / "source" / "TED_상페-고객님_정보요청_원본.txt",
    },
    "ted_master_v3": {
        "env": "DETAIL_TED_MASTER_PATH",
        "sha256": "779478c7896a940a89b37bb37a0eecef9f85e8073a18c6ab7671b052f8002d3f",
        "fallback": ROOT / "source" / "상세페이지_마스터_원문.txt",
    },
}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def resolve_prompt(prompt_id: str, *, require_owner_version: bool = False) -> Path:
    spec = PROMPTS[prompt_id]
    configured = os.getenv(spec["env"])
    path = Path(configured).expanduser().resolve() if configured else spec["fallback"]
    if path is None:
        raise FileNotFoundError(f"{prompt_id}: set {spec['env']}")
    path = Path(path).resolve()
    if not path.exists():
        raise FileNotFoundError(f"{prompt_id}: prompt file not found: {path}")
    if require_owner_version:
        actual = sha256_file(path)
        if actual != spec["sha256"]:
            raise ValueError(f"{prompt_id}: prompt fingerprint mismatch; expected product-owner version")
    return path


def read_prompt(prompt_id: str, *, require_owner_version: bool = False) -> str:
    return resolve_prompt(prompt_id, require_owner_version=require_owner_version).read_text(encoding="utf-8")
