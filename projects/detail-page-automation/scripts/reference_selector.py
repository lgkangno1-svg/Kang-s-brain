from __future__ import annotations

from typing import Any

ROLE_BONUS = {
    "product_full": 0.22,
    "product_closeup": 0.20,
    "cross_section": 0.20,
    "packaging": 0.16,
    "delivery": 0.12,
    "farm": 0.10,
    "proof_document": 0.18,
    "review_capture": 0.14,
    "design_reference": 0.05,
    "unknown": 0.0,
}


def _score(file: dict[str, Any]) -> float:
    quality = float(file.get("quality_score", 0))
    identity = float(file.get("product_identity_score", 0))
    usefulness = float(file.get("usefulness_score", 0))
    return quality * 0.35 + identity * 0.35 + usefulness * 0.30 + ROLE_BONUS.get(str(file.get("role", "unknown")), 0)


def select_references(files: list[dict[str, Any]], max_count: int) -> list[dict[str, Any]]:
    """Prefer clear, product-faithful, role-diverse files and skip near-duplicate groups."""
    eligible = [dict(item) for item in files if item and item.get("usable", True) is not False]
    eligible.sort(key=_score, reverse=True)

    selected: list[dict[str, Any]] = []
    duplicate_groups: set[str] = set()
    roles: set[str] = set()

    for item in eligible:
        if len(selected) >= max_count:
            break
        group = item.get("duplicate_group_id")
        role = str(item.get("role", "unknown"))
        if group and group in duplicate_groups:
            continue
        if role in roles:
            continue
        selected.append(item)
        roles.add(role)
        if group:
            duplicate_groups.add(str(group))

    for item in eligible:
        if len(selected) >= max_count:
            break
        if any(picked.get("id") == item.get("id") for picked in selected):
            continue
        group = item.get("duplicate_group_id")
        if group and str(group) in duplicate_groups:
            continue
        selected.append(item)
        if group:
            duplicate_groups.add(str(group))

    return selected
