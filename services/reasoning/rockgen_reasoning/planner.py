"""Map question → research sub-questions (deterministic planner)."""

from __future__ import annotations

from rockgen_reasoning.schemas import QuestionType


def plan(question_type: QuestionType, claim_topic: str | None) -> list[str]:
    topic = claim_topic or "aggregation"
    plans: dict[str, list[str]] = {
        "structure_change": [
            f"Retrieve evidence for claim topic '{topic}'",
            "Separate support vs contradict stances",
            "Score confidence from evidence types",
            "Detect gaps for structural claim",
        ],
        "misfolding": [
            f"Retrieve evidence for claim topic '{topic}'",
            "Separate support vs contradict stances",
            "Score confidence from evidence types",
            "Detect gaps for misfolding claim",
        ],
        "aggregation": [
            f"Retrieve evidence for claim topic '{topic}'",
            "Separate support vs contradict stances",
            "Score confidence from evidence types",
            "Detect clinical / therapeutic gaps",
            "Propose graph-grounded next experiments",
        ],
        "animal_evidence": [
            "Search evidence where evidence_type = animal across PFN1/G118V claims",
            "Report presence, count, and citations",
        ],
        "human_clinical_evidence": [
            "Search human_genetic (ClinVar) and clinical evidence",
            "Keep ClinVar separate from paper aggregation conclusions",
        ],
        "unproven": [
            "List low-confidence and not_yet_validated claims",
            "List research gaps from deterministic rules",
        ],
        "next_experiment": [
            f"Review gaps for '{topic}'",
            "Generate hypotheses from graph partners and gaps only",
        ],
        "unsupported": [
            "Explain supported question types for this vertical",
        ],
    }
    return plans.get(question_type, plans["unsupported"])
