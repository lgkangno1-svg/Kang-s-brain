from __future__ import annotations

from typing import Any

CATEGORIES = {"fruit", "vegetable", "meat", "seafood", "processed_food"}
INFO_DENSITIES = {"simple", "standard", "rich"}
MAIN_VISUAL_STYLES = {"male_model", "female_model", "farm_documentary", "product_only", "premium_studio"}
MODEL_SHOT_COUNTS = {0, 2, 4, 6}
TONES = {"white", "beige", "black", "natural_green", "luxury_dark"}
COPY_MOODS = {"emotional", "professional", "trust", "sales", "gift"}
THUMBNAIL_STYLES = {"strong_sales", "emotional", "premium", "information"}
HIGHLIGHTS = {"freshness", "price", "origin", "taste", "nutrition", "gift", "bulk", "value"}

DISCLOSURE_ID = "image-text-risk-v1"
DISCLOSURE_TEXT = (
    "AI 이미지 생성 특성상 이미지 안의 한글·숫자·문구에 오탈자, 글자 깨짐 또는 왜곡이 발생할 수 있습니다. "
    "이미지 내부에 생성된 글자는 일반 문서의 텍스트처럼 직접 수정하기 어려워 일부 결과는 이미지 재생성이 필요할 수 있으며, "
    "재생성을 하더라도 완벽한 오탈자 교정을 보장할 수 없습니다."
)

PLANS = {
    "trial": {"price_krw": 9900, "thumbnail_count": 1, "quality": "medium", "max_refs": 3, "retry_limit": 1},
    "standard": {"price_krw": 14900, "thumbnail_count": 2, "quality": "high", "max_refs": 6, "retry_limit": 2},
}


def _clean(value: Any) -> str | None:
    if value is None:
        return None
    value = str(value).strip()
    return value or None


def _require_enum(name: str, value: Any, allowed: set[Any]) -> Any:
    if value not in allowed:
        raise ValueError(f"invalid {name}: {value!r}")
    return value


def choose_body_count(plan_id: str, info_density: str, verified_fact_count: int = 0) -> int:
    if plan_id == "trial":
        return 8
    if plan_id != "standard":
        raise ValueError(f"unknown plan: {plan_id}")
    if info_density == "simple":
        return 10
    if info_density == "rich" and verified_fact_count >= 6:
        return 12
    return 11


def choose_prompt_route(*, confirmed_evidence_count: int = 0, differentiated_fact_count: int = 0, has_proof_document: bool = False, description_length: int = 0) -> str:
    score = min(3, confirmed_evidence_count) + min(3, differentiated_fact_count)
    score += 2 if has_proof_document else 0
    score += 1 if description_length >= 500 else 0
    return "ted_autofill_then_master_v3" if score >= 4 else "direct_conversion_master"


def normalize_order(payload: dict[str, Any]) -> dict[str, Any]:
    plan_id = _require_enum("plan_id", payload.get("plan_id"), set(PLANS))
    category = _require_enum("category", payload.get("category"), CATEGORIES)
    info_density = _require_enum("info_density", payload.get("info_density", "standard"), INFO_DENSITIES)
    if payload.get("accepted_image_text_risk") is not True:
        raise ValueError(f"required disclosure not accepted: {DISCLOSURE_ID}")

    product_name = _clean(payload.get("product_name"))
    description = _clean(payload.get("product_description"))
    if not product_name:
        raise ValueError("product_name is required")
    if not description:
        raise ValueError("product_description is required")

    model_shot_count = int(payload.get("model_shot_count", 0))
    _require_enum("model_shot_count", model_shot_count, MODEL_SHOT_COUNTS)
    main_visual_style = _require_enum("main_visual_style", payload.get("main_visual_style", "product_only"), MAIN_VISUAL_STYLES)
    tone = _require_enum("tone", payload.get("tone", "white"), TONES)
    copy_mood = _require_enum("copy_mood", payload.get("copy_mood", "sales"), COPY_MOODS)
    thumbnail_style = _require_enum("thumbnail_style", payload.get("thumbnail_style", "strong_sales"), THUMBNAIL_STYLES)

    highlights = list(dict.fromkeys(payload.get("highlight_points") or []))
    for item in highlights:
        _require_enum("highlight_point", item, HIGHLIGHTS)

    verified_fact_count = int(payload.get("verified_fact_count", 0))
    body_count = choose_body_count(plan_id, info_density, verified_fact_count)
    plan = PLANS[plan_id]
    specification = _clean(payload.get("specification"))
    sale_price = _clean(payload.get("sale_price"))

    return {
        "schema_version": 1,
        "plan_id": plan_id,
        "product_name": product_name,
        "category": category,
        "product_description": description,
        "specification": specification,
        "sale_price": sale_price,
        "main_visual_style": main_visual_style,
        "model_shot_count": model_shot_count,
        "tone": tone,
        "copy_mood": copy_mood,
        "info_density": info_density,
        "highlight_points": highlights,
        "thumbnail_style": thumbnail_style,
        "must_include": _clean(payload.get("must_include")),
        "must_exclude": _clean(payload.get("must_exclude")),
        "uploads": list(payload.get("uploads") or []),
        "accepted_disclosure_id": DISCLOSURE_ID,
        "output_contract": {
            "thumbnail_count": plan["thumbnail_count"],
            "body_count": body_count,
            "total_count": plan["thumbnail_count"] + body_count,
            "quality": plan["quality"],
            "max_reference_images": plan["max_refs"],
            "retry_limit_per_asset": plan["retry_limit"],
        },
        "omissions": {
            "specification": specification is None,
            "sale_price": sale_price is None,
        },
    }


def expected_job_ids(order: dict[str, Any]) -> list[str]:
    c = order["output_contract"]
    return [f"thumb_{i}" for i in range(1, c["thumbnail_count"] + 1)] + [f"image_{i}" for i in range(1, c["body_count"] + 1)]
