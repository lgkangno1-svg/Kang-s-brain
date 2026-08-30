#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
from PIL import Image

from service_contract import expected_job_ids

VALID_ID = re.compile(r"^(thumb_[1-2]|image_(?:[1-9]|1[0-2]))$")


def fail(errors: list[str], msg: str) -> None:
    errors.append(msg)


def load_order(run: Path) -> dict | None:
    path = run / "ORDER.json"
    if not path.exists():
        return None
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict) or "output_contract" not in data:
        raise ValueError("ORDER.json에 output_contract가 없습니다.")
    return data


def validate_dimensions(job: dict, errors: list[str]) -> None:
    jid = str(job.get("id", ""))
    width = int(job.get("width", 0))
    height = int(job.get("height", 0))
    if jid.startswith("thumb_"):
        if (width, height) != (1000, 1000):
            fail(errors, f"{jid} 썸네일 해상도는 1000x1000이어야 합니다: {(width, height)}")
    elif jid.startswith("image_"):
        if width != 860:
            fail(errors, f"{jid} 본문 가로는 860px이어야 합니다: {width}")
        if not 1500 <= height <= 3000:
            fail(errors, f"{jid} 본문 세로는 1500~3000px 범위여야 합니다: {height}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("run_dir", type=Path)
    ap.add_argument("--require-images", action="store_true")
    args = ap.parse_args()

    run = args.run_dir.resolve()
    errors: list[str] = []
    warnings: list[str] = []

    try:
        order = load_order(run)
    except Exception as exc:
        order = None
        fail(errors, f"ORDER.json 오류: {exc}")

    q_path = run / "01_q1_q10.json"
    master = run / "02_master_filled.txt"
    jobs_path = run / "04_image_jobs.json"

    # Legacy Codex runs require the TED artifacts. Service runs may use the direct master route,
    # so these files are validated when present rather than universally required.
    if order is None and not q_path.exists():
        fail(errors, "legacy run: 01_q1_q10.json 없음")
    if q_path.exists():
        q = json.loads(q_path.read_text(encoding="utf-8"))
        for i in range(1, 11):
            if not str(q.get(f"q{i}", "")).strip():
                fail(errors, f"q{i} 비어 있음")

    if order is None and not master.exists():
        fail(errors, "legacy run: 02_master_filled.txt 없음")
    if master.exists() and "[여기에 입력]" in master.read_text(encoding="utf-8"):
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

    expected_ids: list[str] = []
    by_id: dict[str, dict] = {}
    if jobs:
        ids = [str(j.get("id")) for j in jobs]
        if len(ids) != len(set(ids)):
            fail(errors, "중복 이미지 id가 있습니다.")
        unknown = [jid for jid in ids if not VALID_ID.fullmatch(jid)]
        if unknown:
            fail(errors, f"알 수 없는 이미지 id: {unknown}")

        if order:
            expected_ids = expected_job_ids(order)
        else:
            expected_ids = ["thumb_1", "thumb_2"] + [f"image_{i}" for i in range(1, 13)]
        if ids != expected_ids:
            fail(errors, f"이미지 ID/순서 불일치: expected={expected_ids} got={ids}")

        by_id = {str(j.get("id")): j for j in jobs}
        main_copies: list[tuple[str, str]] = []
        for job in jobs:
            jid = str(job.get("id"))
            validate_dimensions(job, errors)
            prompt = str(job.get("prompt", "")).strip()
            if len(prompt) < 40:
                fail(errors, f"{jid} 이미지 프롬프트가 너무 짧거나 비어 있습니다.")
            mc = str(job.get("main_copy", "")).strip()
            if mc:
                main_copies.append((jid, mc))

        seen: dict[str, str] = {}
        for jid, mc in main_copies:
            if mc in seen:
                fail(errors, f"메인 카피 완전 중복: {seen[mc]} == {jid}")
            seen[mc] = jid

    if args.require_images and jobs:
        images_dir = run / "images"
        for jid in expected_ids:
            job = by_id.get(jid)
            if not job:
                continue
            dims = (int(job.get("width", 0)), int(job.get("height", 0)))
            p = images_dir / f"{jid}.png"
            if not p.exists():
                fail(errors, f"이미지 없음: {p.name}")
                continue
            with Image.open(p) as im:
                if im.size != dims:
                    fail(errors, f"{p.name} 실제 크기 {im.size}, 기대 {dims}")

        body_jobs = [j for j in jobs if str(j.get("id", "")).startswith("image_")]
        full = run / "detail_full.png"
        if not full.exists():
            fail(errors, "detail_full.png 없음")
        else:
            expected_h = sum(int(j["height"]) for j in body_jobs)
            with Image.open(full) as im:
                if im.size != (860, expected_h):
                    fail(errors, f"detail_full.png 크기 {im.size}, 기대 {(860, expected_h)}")

    report = ["# Validation", ""]
    if errors:
        report += ["## FAIL"] + [f"- {e}" for e in errors]
    else:
        report += ["## PASS"]
        if order:
            c = order["output_contract"]
            report.append(f"- 서비스 플랜 계약 확인: thumbnails={c['thumbnail_count']} body={c['body_count']} quality={c['quality']}")
        else:
            report.append("- legacy 14장 계약 확인")
        if q_path.exists():
            report.append("- Q1~Q10 구조 확인")
        if master.exists():
            report.append("- 마스터 주입 placeholder 확인")
        report.append(f"- 이미지 작업 {len(jobs)}개 ID/순서/해상도/프롬프트 확인")
        if args.require_images:
            report.append(f"- 실제 이미지 {len(jobs)}장 + detail_full.png 크기 확인")
    if warnings:
        report += ["", "## Warnings"] + [f"- {w}" for w in warnings]
    (run / "VALIDATION.md").write_text("\n".join(report) + "\n", encoding="utf-8")

    print("\n".join(report))
    raise SystemExit(1 if errors else 0)


if __name__ == "__main__":
    main()
