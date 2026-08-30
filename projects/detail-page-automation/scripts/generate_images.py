#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
from contextlib import ExitStack
import json
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
EXPECTED_IDS = ["thumb_1", "thumb_2"] + [f"image_{i}" for i in range(1, 13)]


def api_dim(n: int) -> int:
    return ((n + 15) // 16) * 16


def load_jobs(path: Path) -> list[dict]:
    data = json.loads(path.read_text(encoding="utf-8"))
    jobs = data["jobs"] if isinstance(data, dict) and "jobs" in data else data
    if not isinstance(jobs, list):
        raise SystemExit("04_image_jobs.json은 배열 또는 {'jobs': [...]} 형식이어야 합니다.")
    return jobs


def prompt_for(job: dict) -> str:
    prompt = str(job.get("prompt", "")).strip()
    main = str(job.get("main_copy", "")).strip()
    sub = str(job.get("sub_copy", "")).strip()
    points = job.get("points") or []
    exact = []
    if main:
        exact.append(f"Main Copy (Korean, render exactly): {main}")
    if sub:
        exact.append(f"Sub Copy (Korean, render exactly): {sub}")
    if points:
        exact.append("Supporting Korean text: " + " / ".join(map(str, points)))
    if exact:
        prompt += "\n\nIMPORTANT TEXT REQUIREMENTS:\n" + "\n".join(exact)
        prompt += "\nKeep Korean typography legible, correctly spelled, and commercially polished."
    return prompt


def generate_one(client, job: dict, model: str, quality: str, output_path: Path) -> None:
    width, height = int(job["width"]), int(job["height"])
    size = f"{api_dim(width)}x{api_dim(height)}"
    prompt = prompt_for(job)
    refs = [ROOT / Path(p) for p in (job.get("reference_images") or [])]
    refs = [p for p in refs if p.exists()]

    if refs:
        with ExitStack() as stack:
            files = [stack.enter_context(open(p, "rb")) for p in refs[:8]]
            result = client.images.edit(
                model=model,
                image=files,
                prompt=prompt,
                size=size,
                quality=quality,
            )
    else:
        result = client.images.generate(
            model=model,
            prompt=prompt,
            size=size,
            quality=quality,
        )

    raw = base64.b64decode(result.data[0].b64_json)
    tmp = output_path.with_suffix(".raw.png")
    tmp.write_bytes(raw)

    with Image.open(tmp) as im:
        im = im.convert("RGB")
        if im.size != (width, height):
            im = im.resize((width, height), Image.Resampling.LANCZOS)
        im.save(output_path, "PNG", optimize=True)
    tmp.unlink(missing_ok=True)


def make_detail_full(images_dir: Path, output: Path) -> None:
    paths = [images_dir / f"image_{i}.png" for i in range(1, 13)]
    if not all(p.exists() for p in paths):
        return
    opened = [Image.open(p).convert("RGB") for p in paths]
    try:
        width = 860
        height = sum(im.height for im in opened)
        canvas = Image.new("RGB", (width, height), "white")
        y = 0
        for im in opened:
            if im.width != width:
                im = im.resize((width, im.height), Image.Resampling.LANCZOS)
            canvas.paste(im, (0, y))
            y += im.height
        canvas.save(output, "PNG", optimize=True)
    finally:
        for im in opened:
            im.close()


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("jobs_json", type=Path)
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", nargs="*", default=None, help="예: --only thumb_1 image_1")
    args = ap.parse_args()

    jobs_path = args.jobs_json.resolve()
    jobs = load_jobs(jobs_path)
    run_dir = jobs_path.parent
    images_dir = run_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)

    ids = [str(j.get("id")) for j in jobs]
    unknown = [i for i in ids if i not in EXPECTED_IDS]
    if unknown:
        raise SystemExit(f"알 수 없는 이미지 id: {unknown}")

    selected = set(args.only or ids)
    model = os.getenv("IMAGE_MODEL", "gpt-image-2")
    quality = os.getenv("IMAGE_QUALITY", "medium")

    if args.dry_run:
        for job in jobs:
            if job["id"] in selected:
                print(job["id"], f'{job["width"]}x{job["height"]}',
                      "->", f'{api_dim(int(job["width"]))}x{api_dim(int(job["height"]))}')
        return

    if not os.getenv("OPENAI_API_KEY"):
        raise SystemExit("OPENAI_API_KEY가 없습니다. 이미지 프롬프트/기획은 완료할 수 있지만 실제 생성에는 1회 API 키 설정이 필요합니다.")

    try:
        from openai import OpenAI
    except ImportError:
        raise SystemExit("openai 패키지가 없습니다. `pip install -r requirements.txt`를 실행하세요.")

    client = OpenAI()
    for job in jobs:
        jid = job["id"]
        if jid not in selected:
            continue
        out = images_dir / f"{jid}.png"
        if out.exists() and not args.force:
            print(f"SKIP exists: {out.name}")
            continue
        print(f"GENERATE {jid} ({job['width']}x{job['height']}) model={model} quality={quality}")
        generate_one(client, job, model, quality, out)
        print(f"OK {out}")

    make_detail_full(images_dir, run_dir / "detail_full.png")
    if (run_dir / "detail_full.png").exists():
        print(f"OK {run_dir / 'detail_full.png'}")


if __name__ == "__main__":
    main()
