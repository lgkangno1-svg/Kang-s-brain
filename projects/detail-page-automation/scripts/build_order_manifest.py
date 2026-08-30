#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from service_contract import normalize_order


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("input_json", type=Path, help="customer/service order input JSON")
    ap.add_argument("--output", type=Path, default=None)
    args = ap.parse_args()

    source = args.input_json.resolve()
    payload = json.loads(source.read_text(encoding="utf-8"))
    order = normalize_order(payload)
    output = args.output.resolve() if args.output else source.parent / "ORDER.json"
    output.write_text(json.dumps(order, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: {output}")


if __name__ == "__main__":
    main()
