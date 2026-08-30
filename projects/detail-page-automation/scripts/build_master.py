#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from prompt_registry import read_prompt

ROOT = Path(__file__).resolve().parents[1]
BLANK_Q = ROOT / "source" / "TED_상페_Q1-Q10_빈양식.txt"
PLACEHOLDER = "답변: [여기에 입력]"


def load_answers(path: Path) -> dict[str, str]:
    data = json.loads(path.read_text(encoding="utf-8"))
    missing = [f"q{i}" for i in range(1, 11) if not str(data.get(f"q{i}", "")).strip()]
    if missing:
        raise SystemExit(f"Q1~Q10 중 비어 있는 항목이 있습니다: {', '.join(missing)}")
    return data


def fill_template(template: str, answers: dict[str, str]) -> str:
    out = template
    for i in range(1, 11):
        answer = str(answers[f"q{i}"]).strip()
        if PLACEHOLDER not in out:
            raise SystemExit(f"템플릿 placeholder 부족: Q{i} 주입 전에 소진됨")
        out = out.replace(PLACEHOLDER, f"답변: {answer}", 1)
    if PLACEHOLDER in out:
        raise SystemExit("템플릿에 사용되지 않은 placeholder가 남았습니다.")
    return out


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("q_json", type=Path, help="runs/.../01_q1_q10.json")
    ap.add_argument("--service", action="store_true", help="제품 오너가 제공한 최신 master fingerprint를 강제합니다.")
    args = ap.parse_args()

    q_json = args.q_json.resolve()
    if not q_json.exists():
        raise SystemExit(f"파일 없음: {q_json}")
    run_dir = q_json.parent
    answers = load_answers(q_json)

    q_txt = fill_template(BLANK_Q.read_text(encoding="utf-8"), answers)
    try:
        master_source = read_prompt("ted_master_v3", require_owner_version=args.service)
    except Exception as exc:
        raise SystemExit(f"TED master 로드 실패: {exc}") from exc
    master_txt = fill_template(master_source, answers)

    (run_dir / "01_Q1_Q10.txt").write_text(q_txt, encoding="utf-8")
    (run_dir / "02_master_filled.txt").write_text(master_txt, encoding="utf-8")

    print(f"OK: {run_dir / '01_Q1_Q10.txt'}")
    print(f"OK: {run_dir / '02_master_filled.txt'}")


if __name__ == "__main__":
    main()
