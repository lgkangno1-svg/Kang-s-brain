#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path
from PIL import Image, ImageOps

EXPECTED = {
    "thumb_1": (1000, 1000), "thumb_2": (1000, 1000),
    "image_1": (860, 1800), "image_2": (860, 1800), "image_3": (860, 1800),
    "image_4": (860, 2000), "image_5": (860, 2000), "image_6": (860, 2200),
    "image_7": (860, 2000), "image_8": (860, 1800), "image_9": (860, 1800),
    "image_10": (860, 1800), "image_11": (860, 2500), "image_12": (860, 1500),
}


def load_jobs(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    jobs = data.get("jobs", data) if isinstance(data, dict) else data
    if not isinstance(jobs, list):
        raise SystemExit("04_image_jobs.json 형식 오류")
    return jobs


def main() -> None:
    ap = argparse.ArgumentParser(description="Codex 이미지 생성 스킬 결과를 마스터 규격으로 정리합니다. API 호출은 하지 않습니다.")
    ap.add_argument("jobs_json", type=Path)
    args = ap.parse_args()

    jobs_path = args.jobs_json.resolve()
    run_dir = jobs_path.parent
    images_dir = run_dir / "images"
    raw_dir = images_dir / "raw"
    images_dir.mkdir(parents=True, exist_ok=True)
    jobs = load_jobs(jobs_path)
    by_id = {str(j.get("id")): j for j in jobs}
    if set(by_id) != set(EXPECTED):
        raise SystemExit("14개 이미지 ID가 마스터 규격과 일치하지 않습니다.")

    for jid, size in EXPECTED.items():
        candidates = [raw_dir / f"{jid}.png", raw_dir / f"{jid}.jpg", raw_dir / f"{jid}.jpeg", images_dir / f"{jid}.png"]
        src = next((p for p in candidates if p.exists()), None)
        if src is None:
            raise SystemExit(f"Codex 이미지 생성 스킬 결과 없음: {jid}")
        dst = images_dir / f"{jid}.png"
        with Image.open(src) as im:
            im = im.convert("RGB")
            if im.size != size:
                im = ImageOps.fit(im, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
            im.save(dst, "PNG", optimize=True)
        print(f"FINALIZE {jid} -> {size[0]}x{size[1]}")

    detail_paths = [images_dir / f"image_{i}.png" for i in range(1, 13)]
    opened = [Image.open(p).convert("RGB") for p in detail_paths]
    try:
        canvas = Image.new("RGB", (860, sum(im.height for im in opened)), "white")
        y = 0
        for im in opened:
            canvas.paste(im, (0, y)); y += im.height
        canvas.save(run_dir / "detail_full.png", "PNG", optimize=True)
    finally:
        for im in opened: im.close()
    print(f"OK {run_dir / 'detail_full.png'}")


if __name__ == "__main__":
    main()
