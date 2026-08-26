"""Deterministic research-gap rules for PFN1/G118V."""

from __future__ import annotations

from rockgen_reasoning.graph_retriever import evidence_mix_counts
from rockgen_reasoning.schemas import GapItem


def detect_gaps(
    *,
    claim_topic: str | None,
    evidence: list[dict],
    clinvar: list[dict],
    all_claims: list[dict],
) -> list[GapItem]:
    mix = evidence_mix_counts(evidence)
    gaps: list[GapItem] = []

    has_comp = mix["computational"] > 0
    has_vitro = mix["in_vitro"] > 0
    has_animal = mix["animal"] > 0
    has_clinical = mix["clinical"] > 0
    has_human = mix["human_genetic"] > 0 or bool(clinvar)

    if has_comp and has_vitro and has_animal and not has_clinical:
        gaps.append(
            GapItem(
                id="gap-no-clinical",
                text="No clinical validation for this claim",
                rule="computational + in_vitro + animal present AND clinical absent",
            )
        )

    if claim_topic == "aggregation" and not has_human:
        gaps.append(
            GapItem(
                id="gap-limited-human",
                text="Limited human patient evidence linking G118V aggregation to clinical outcomes",
                rule="aggregation claim without human_genetic/clinical evidence on the claim",
            )
        )

    therapeutic = next((c for c in all_claims if c.get("topic") == "therapeutic_opportunity"), None)
    if therapeutic:
        flags = therapeutic.get("flags") or []
        if True in flags or "therapeutic" in (therapeutic.get("topic") or ""):
            gaps.append(
                GapItem(
                    id="gap-no-stabilizer",
                    text="No validated PFN1-stabilizing compound",
                    rule="therapeutic_opportunity claim is not_yet_validated",
                )
            )

    gaps.append(
        GapItem(
            id="gap-no-survival",
            text="No direct proof that preventing PFN1 aggregation improves survival",
            rule="survival endpoint studies not present in indexed evidence graph",
        )
    )
    gaps.append(
        GapItem(
            id="gap-biomarker",
            text="Limited biomarker evidence specific to PFN1 aggregation in patients",
            rule="no claim-scoped biomarker evidence nodes for PFN1 aggregation",
        )
    )
    gaps.append(
        GapItem(
            id="gap-mutation-compare",
            text="Insufficient systematic comparison across PFN1 mutations (e.g., C71G vs G118V)",
            rule="multi-mutation comparative assay evidence not indexed",
        )
    )
    gaps.append(
        GapItem(
            id="gap-pocket",
            text="No experimental validation for a predicted drug-binding pocket on PFN1",
            rule="pocket validation evidence absent (by design before therapeutic phase)",
        )
    )

    # Deduplicate by id
    seen: set[str] = set()
    out: list[GapItem] = []
    for g in gaps:
        if g.id in seen:
            continue
        seen.add(g.id)
        out.append(g)
    return out
