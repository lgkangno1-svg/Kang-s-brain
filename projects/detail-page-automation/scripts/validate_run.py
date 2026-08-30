#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from PIL import Image

EXPECTED = {
    "thumb_1": (1000, 1000),
    "thumb_2": (1000, 1000),
    "image_1": (860, 1800),
    "image_2": (860, 1800),
    "image_3": (860, 1800),
    "image_4": (860, 2000),
    "image_5": (860, 2000),
    "image_6": (860, 2200),
    "image_7": (860, 2000),
    "image_8": (860, 1800),
    "image_9": (860, 1800),
    "image_10": (860, 1800),
    "image_11": (860, 2500),
    "image_12": (860, 1500),
}
CHAIN = [
    "photorealistic",
    "commercial photography",
    "natural lighting",
    "clean ecommerce design",
    "highly detailed",
    "8k resolution",
]


def fail(errors: list[str], msg: str) -> None:
    errors.append(msg)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("run_dir", type=Path)
    ap.add_argument("--require-images", action="store_true")
    args = ap.parse_args()

    run = args.run_dir.resolve()
    errors: list[str] = []
    warnings: list[str] = []

    q_path = run / "01_q1_q10.json"
    master = run / "02_master_filled.txt"
    jobs_path = run / "04_image_jobs.json"

    if not q_path.exists():
        fail(errors, "01_q1_q10.json 없음")
    else:
        q = json.loads(q_path.read_text(encoding="utf-8"))
        for i in range(1, 11):
            if not str(q.get(f"q{i}", "")).strip():
                fail(errors, f"q{i} 비어 있음")

    if not master.exists():
        fail(errors, "02_master_filled.txt 없음")
    elif "[여기에 입력]" in master.read_text(encoding="utf-8"):
        fail(errors, "02_master_filled.txt에 placeholder가 남아 있음")

    jobs = []
    if not jobs_path.exists():
        fail(errors, "04_image_jobs.json 없음")
    else:
        obj = json.loads(jobs_path.read_text(encoding="utf-8"))
        jobs = obj.get("jobs", obj) if isinstance(obj, dict) else obj
        if not isinstance(jobs, list):
            fail(errors, "04_image_jobs.json 구조 오류")
            jobs = []

    if jobs:
        by_id = {str(j.get("id")): j for j in jobs}
        if set(by_id) != set(EXPECTED):
            fail(errors, f"이미지 ID 불일치: expected={list(EXPECTED)} got={list(by_id)}")
        main_copies = []
        for jid, dims in EXPECTED.items():
            j = by_id.get(jid)
            if not j:
                continue
            if (int(j.get("width", 0)), int(j.get("height", 0))) != dims:
                fail(errors, f"{jid} 해상도 오류")
            prompt = str(j.get("prompt", "")).lower()
            for term in CHAIN:
                if term not in prompt:
                    fail(errors, f"{jid} 프롬프트 필수 체인 누락: {term}")
            mc = str(j.get("main_copy", "")).strip()
            if mc:
                main_copies.append((jid, mc))
        seen = {}
        for jid, mc in main_copies:
            if mc in seen:
                fail(errors, f"메인 카피 완전 중복: {seen[mc]} == {jid}")
            seen[mc] = jid

    if args.require_images:
        images_dir = run / "images"
        for jid, dims in EXPECTED.items():
            p = images_dir / f"{jid}.png"
            if not p.exists():
                fail(errors, f"이미지 없음: {p.name}")
                continue
            with Image.open(p) as im:
                if im.size != dims:
                    fail(errors, f"{p.name} 실제 크기 {im.size}, 기대 {dims}")
        full = run / "detail_full.png"
        if not full.exists():
            fail(errors, "detail_full.png 없음")
        else:
            expected_h = sum(EXPECTED[f"image_{i}"][1] for i in range(1, 13))
            with Image.open(full) as im:
                if im.size != (860, expected_h):
                    fail(errors, f"detail_full.png 크기 {im.size}, 기대 {(860, expected_h)}")

    report = ["# Validation", ""]
    if errors:
        report += ["## FAIL"] + [f"- {e}" for e in errors]
    else:
        report += ["## PASS", "- Q1~Q10 구조 확인", "- 마스터 주입 확인", "- 14장 ID/해상도/프롬프트 체인 확인"]
        if args.require_images:
            report.append("- 실제 이미지 14장 + detail_full.png 크기 확인")
    if warnings:
        report += ["", "## Warnings"] + [f"- {w}" for w in warnings]
    (run / "VALIDATION.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    print("\n".join(report))
    raise SystemExit(1 if errors else 0)


if __name__ == "__main__":
    main()
