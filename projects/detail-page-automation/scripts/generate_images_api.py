#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
from contextlib import ExitStack
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import time

from PIL import Image, ImageOps

from service_contract import expected_job_ids

ROOT = Path(__file__).resolve().parents[1]


def load_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def load_jobs(path: Path) -> list[dict]:
    obj = load_json(path)
    jobs = obj.get("jobs", obj) if isinstance(obj, dict) else obj
    if not isinstance(jobs, list):
        raise SystemExit("04_image_jobs.json 형식 오류")
    return jobs


def build_prompt(job: dict) -> str:
    prompt = str(job.get("prompt", "")).strip()
    if not prompt:
        raise ValueError(f"{job.get('id')} prompt is empty")
    main = str(job.get("main_copy", "")).strip()
    sub = str(job.get("sub_copy", "")).strip()
    points = [str(x).strip() for x in (job.get("points") or []) if str(x).strip()]
    exact = []
    if main:
        exact.append(f"Main Copy (Korean, render exactly): {main}")
    if sub:
        exact.append(f"Sub Copy (Korean, render exactly): {sub}")
    if points:
        exact.append("Supporting Korean text: " + " / ".join(points))
    if exact:
        prompt += "\n\nIMPORTANT TEXT REQUIREMENTS:\n" + "\n".join(exact)
        prompt += "\nKeep Korean typography legible and correctly spelled. Do not add unrequested factual claims."
    return prompt


def reference_paths(job: dict, limit: int) -> list[Path]:
    result: list[Path] = []
    for raw in job.get("reference_images") or []:
        p = Path(str(raw))
        if not p.is_absolute():
            p = ROOT / p
        if p.exists() and p.is_file():
            result.append(p)
        if len(result) >= limit:
            break
    return result


def usage_dict(result) -> dict:
    usage = getattr(result, "usage", None)
    if usage is None:
        return {}
    if hasattr(usage, "model_dump"):
        return usage.model_dump(exclude_none=True)
    if isinstance(usage, dict):
        return usage
    return {"raw": str(usage)}


def append_usage(run_dir: Path, record: dict) -> None:
    with (run_dir / "provider_usage.jsonl").open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")


def generate_one(client, job: dict, *, model: str, quality: str, max_refs: int, output_path: Path):
    width, height = int(job["width"]), int(job["height"])
    prompt = build_prompt(job)
    refs = reference_paths(job, max_refs)
    size = f"{width}x{height}"

    if refs:
        with ExitStack() as stack:
            files = [stack.enter_context(open(path, "rb")) for path in refs]
            result = client.images.edit(model=model, image=files, prompt=prompt, size=size, quality=quality)
    else:
        result = client.images.generate(model=model, prompt=prompt, size=size, quality=quality)

    if not result.data or not result.data[0].b64_json:
        raise RuntimeError("image provider returned no b64_json")
    raw = base64.b64decode(result.data[0].b64_json)
    tmp = output_path.with_suffix(".provider.png")
    tmp.write_bytes(raw)

    with Image.open(tmp) as im:
        im = im.convert("RGB")
        if im.size != (width, height):
            im = ImageOps.fit(im, (width, height), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
        im.save(output_path, "PNG", optimize=True)
    tmp.unlink(missing_ok=True)
    return result, refs


def make_detail_full(run_dir: Path, jobs: list[dict]) -> None:
    body = [job for job in jobs if str(job.get("id", "")).startswith("image_")]
    body.sort(key=lambda job: int(str(job["id"]).split("_")[1]))
    images_dir = run_dir / "images"
    paths = [images_dir / f"{job['id']}.png" for job in body]
    if not paths or not all(path.exists() for path in paths):
        return
    opened = [Image.open(path).convert("RGB") for path in paths]
    try:
        canvas = Image.new("RGB", (860, sum(im.height for im in opened)), "white")
        y = 0
        for im in opened:
            if im.width != 860:
                im = ImageOps.fit(im, (860, im.height), method=Image.Resampling.LANCZOS)
            canvas.paste(im, (0, y))
            y += im.height
        canvas.save(run_dir / "detail_full.png", "PNG", optimize=True)
    finally:
        for im in opened:
            im.close()


def main() -> None:
    ap = argparse.ArgumentParser(description="24시간 서비스용 GPT Image API worker")
    ap.add_argument("jobs_json", type=Path)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--only", nargs="*", default=None)
    args = ap.parse_args()

    jobs_path = args.jobs_json.resolve()
    run_dir = jobs_path.parent
    order_path = run_dir / "ORDER.json"
    if not order_path.exists():
        raise SystemExit("서비스 API worker는 ORDER.json이 필수입니다.")
    order = load_json(order_path)
    jobs = load_jobs(jobs_path)
    ids = [str(job.get("id")) for job in jobs]
    expected = expected_job_ids(order)
    if ids != expected:
        raise SystemExit(f"ORDER.json과 image jobs 불일치: expected={expected} got={ids}")

    contract = order["output_contract"]
    model = os.getenv("DETAIL_IMAGE_MODEL", "gpt-image-2")
    quality = str(contract["quality"])
    max_refs = int(contract["max_reference_images"])
    retry_limit = int(contract["retry_limit_per_asset"])
    selected = set(args.only or ids)

    if args.dry_run:
        print(json.dumps({
            "model": model,
            "quality": quality,
            "job_count": len(jobs),
            "max_reference_images": max_refs,
            "retry_limit_per_asset": retry_limit,
            "selected": [jid for jid in ids if jid in selected],
        }, ensure_ascii=False, indent=2))
        return

    if not os.getenv("OPENAI_API_KEY"):
        raise SystemExit("서비스 worker에 OPENAI_API_KEY가 설정되지 않았습니다.")

    try:
        from openai import OpenAI
    except ImportError as exc:
        raise SystemExit("서비스 의존성 설치 필요: pip install -r requirements-service.txt") from exc

    images_dir = run_dir / "images"
    images_dir.mkdir(parents=True, exist_ok=True)
    client = OpenAI()

    for job in jobs:
        jid = str(job["id"])
        if jid not in selected:
            continue
        output = images_dir / f"{jid}.png"
        if output.exists():
            print(f"SKIP exists: {jid}")
            continue

        last_error: Exception | None = None
        for attempt in range(retry_limit + 1):
            started = datetime.now(timezone.utc).isoformat()
            try:
                print(f"GENERATE {jid} attempt={attempt + 1}/{retry_limit + 1} quality={quality}")
                result, refs = generate_one(client, job, model=model, quality=quality, max_refs=max_refs, output_path=output)
                append_usage(run_dir, {
                    "at": started,
                    "provider": "openai",
                    "model": model,
                    "quality": quality,
                    "asset_id": jid,
                    "attempt": attempt + 1,
                    "reference_count": len(refs),
                    "status": "success",
                    "usage": usage_dict(result),
                })
                last_error = None
                break
            except Exception as exc:
                last_error = exc
                append_usage(run_dir, {
                    "at": started,
                    "provider": "openai",
                    "model": model,
                    "quality": quality,
                    "asset_id": jid,
                    "attempt": attempt + 1,
                    "status": "failed",
                    "error_type": type(exc).__name__,
                })
                if attempt < retry_limit:
                    time.sleep(min(2 ** attempt, 8))
        if last_error is not None:
            raise last_error

    make_detail_full(run_dir, jobs)
    print("OK service generation")


if __name__ == "__main__":
    main()
