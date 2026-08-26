"""Evidence ranking helpers (deterministic)."""

from __future__ import annotations

TYPE_ALIASES = {
    "computational_prediction": "computational",
    "computational": "computational",
    "in_vitro": "in_vitro",
    "animal": "animal",
    "human_genetic": "human_genetic",
    "clinical": "clinical",
    "curated_expert": "curated_expert",
    "curated_claims": "curated_expert",
}

BASE_WEIGHTS = {
    "computational": 15,
    "in_vitro": 25,
    "animal": 30,
    "human_genetic": 25,
    "clinical": 40,
    "curated_expert": 10,
}

QUALITY_ADJ = {"high": 5, "medium": 0, "low": -5}
DIRECTNESS_ADJ = {"direct": 5, "indirect": -5}


def normalize_type(evidence_type: str | None) -> str | None:
    if not evidence_type:
        return None
    return TYPE_ALIASES.get(evidence_type, evidence_type)


def rank_evidence(items: list[dict]) -> list[dict]:
    """Sort supporting evidence by type weight, quality, directness."""

    def score(e: dict) -> tuple:
        t = normalize_type(e.get("evidence_type")) or ""
        base = BASE_WEIGHTS.get(t, 5)
        q = QUALITY_ADJ.get((e.get("quality") or "medium").lower(), 0)
        d = DIRECTNESS_ADJ.get((e.get("directness") or "direct").lower(), 0)
        return (base + q + d, e.get("publication_date") or "")

    return sorted(items, key=score, reverse=True)
