"""Contradiction detection — always search, then report."""

from __future__ import annotations

from rockgen_reasoning.evidence_ranker import rank_evidence
from rockgen_reasoning.schemas import EvidenceItem


def split_by_stance(
    evidence: list[dict],
    *,
    claim_text: str | None,
) -> tuple[list[EvidenceItem], list[EvidenceItem], bool]:
    """Return (supporting, conflicting, searched_flag). Always searches."""
    supporting_raw: list[dict] = []
    conflicting_raw: list[dict] = []

    for e in evidence:
        stance = (e.get("stance") or "support").lower()
        if stance == "contradict":
            conflicting_raw.append(e)
        elif stance == "neutral":
            continue
        else:
            if e.get("not_yet_validated"):
                continue
            supporting_raw.append(e)

    supporting = [_to_item(e, claim_text) for e in rank_evidence(supporting_raw)]
    conflicting = [_to_item(e, claim_text) for e in rank_evidence(conflicting_raw)]
    return supporting, conflicting, True


def _to_item(e: dict, claim_text: str | None) -> EvidenceItem:
    stance = e.get("stance") or "support"
    if stance not in {"support", "contradict", "neutral"}:
        stance = "support"
    directness = e.get("directness") or "direct"
    if directness not in {"direct", "indirect"}:
        directness = "direct"
    quality = (e.get("quality") or e.get("confidence") or "medium").lower()
    if quality not in {"low", "medium", "high"}:
        quality = "medium"
    return EvidenceItem(
        evidence_id=e["evidence_id"],
        title=e.get("paper_title") or e.get("citation"),
        year=e.get("paper_year") or e.get("publication_date"),
        evidence_type=e.get("evidence_type"),
        supported_claim=e.get("claim_text") or claim_text,
        stance=stance,  # type: ignore[arg-type]
        directness=directness,  # type: ignore[arg-type]
        quality=quality,  # type: ignore[arg-type]
        citation_url=e.get("paper_url") or e.get("source_url"),
        paper_id=e.get("paper_id"),
    )
