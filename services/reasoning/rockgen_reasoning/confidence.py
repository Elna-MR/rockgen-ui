"""Transparent confidence scoring — never invented by an LLM."""

from __future__ import annotations

from rockgen_reasoning.evidence_ranker import BASE_WEIGHTS, normalize_type
from rockgen_reasoning.schemas import ConfidenceBreakdownItem, ConfidenceResult


def score_confidence(
    *,
    supporting: list[dict],
    conflicting: list[dict],
) -> ConfidenceResult:
    breakdown: list[ConfidenceBreakdownItem] = []
    raw = 0
    seen_types: set[str] = set()

    for e in supporting:
        if e.get("not_yet_validated"):
            continue
        t = normalize_type(e.get("evidence_type"))
        if not t or t in seen_types:
            continue
        # One base weight per type (independent modality), then note replications
        weight = BASE_WEIGHTS.get(t, 5)
        seen_types.add(t)
        raw += weight
        breakdown.append(ConfidenceBreakdownItem(label=f"{t.replace('_', ' ').title()} evidence", points=weight))

    # Independent replication: ≥2 items of same experimental type
    type_counts: dict[str, int] = {}
    for e in supporting:
        if e.get("not_yet_validated"):
            continue
        t = normalize_type(e.get("evidence_type"))
        if t:
            type_counts[t] = type_counts.get(t, 0) + 1
    if any(c >= 2 for c in type_counts.values()):
        raw += 10
        breakdown.append(ConfidenceBreakdownItem(label="Independent replication within a modality", points=10))

    # Direct relevance bonus if majority direct
    directs = [e for e in supporting if (e.get("directness") or "direct") == "direct" and not e.get("not_yet_validated")]
    if supporting and len(directs) >= max(1, len([e for e in supporting if not e.get("not_yet_validated")]) // 2):
        raw += 5
        breakdown.append(ConfidenceBreakdownItem(label="Direct relevance to the claim", points=5))

    # Quality bonus for high-quality items
    if any((e.get("quality") or "").lower() == "high" for e in supporting):
        raw += 5
        breakdown.append(ConfidenceBreakdownItem(label="High-quality source present", points=5))

    # Contradiction penalties
    if conflicting:
        penalty = min(40, 15 * len(conflicting))
        raw -= penalty
        breakdown.append(ConfidenceBreakdownItem(label="Contradictory evidence present", points=-penalty))
    else:
        raw += 5
        breakdown.append(
            ConfidenceBreakdownItem(
                label="No contradictory evidence found in indexed set",
                points=5,
            )
        )

    # Weak/indirect only → soft penalty
    active = [e for e in supporting if not e.get("not_yet_validated")]
    if active and all((e.get("directness") or "direct") == "indirect" for e in active):
        raw -= 10
        breakdown.append(ConfidenceBreakdownItem(label="Only indirect methods", points=-10))

    score = max(0, min(100, raw))
    if score >= 75:
        label = "High"
    elif score >= 45:
        label = "Moderate"
    elif score >= 20:
        label = "Low"
    else:
        label = "Insufficient"

    return ConfidenceResult(score=score, label=label, breakdown=breakdown)
