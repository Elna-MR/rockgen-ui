"""Normalize user questions to claim topics and question types."""

from __future__ import annotations

from rockgen_reasoning.schemas import QuestionType

TOPIC_BY_TYPE: dict[str, str | None] = {
    "structure_change": "structural_change",
    "misfolding": "misfolding",
    "aggregation": "aggregation",
    "animal_evidence": None,  # across topics or default aggregation
    "human_clinical_evidence": None,
    "unproven": None,
    "next_experiment": "aggregation",
    "unsupported": None,
}

CLAIM_IDS: dict[str, str] = {
    "structural_change": "pfn1-g118v-structural-change",
    "misfolding": "pfn1-g118v-misfolding",
    "aggregation": "pfn1-g118v-increases-aggregation",
    "therapeutic_opportunity": "pfn1-therapeutic-opportunity",
}


def classify_question(question: str) -> QuestionType:
    q = question.lower()

    if (
        ("shared" in q and "mechanism" in q)
        or ("pfn1" in q and "tuba4a" in q and ("mechanism" in q or "share" in q or "common" in q))
        or "disease mechanisms are shared" in q
    ):
        return "cross_protein_mechanism"  # type: ignore[return-value]

    if any(w in q for w in ("next experiment", "what experiment", "should be done next", "next step")):
        return "next_experiment"
    if any(w in q for w in ("unproven", "not proven", "remain", "missing evidence", "what remains")):
        return "unproven"
    if ("human" in q or "clinical" in q or "clinvar" in q or "patient" in q) and (
        "evidence" in q or "is there" in q or "any" in q
    ):
        return "human_clinical_evidence"
    if "animal" in q or "mouse" in q:
        return "animal_evidence"
    if "aggregat" in q:
        return "aggregation"
    if "misfold" in q:
        return "misfolding"
    if "structure" in q or "flexib" in q or "conform" in q:
        return "structure_change"
    # default: treat as aggregation claim review for PFN1 vertical
    if "g118v" in q or "pfn1" in q:
        return "aggregation"
    return "unsupported"


def claim_topic_for(question_type: QuestionType, question: str) -> str | None:
    topic = TOPIC_BY_TYPE.get(question_type)
    if topic:
        return topic
    if question_type in {"animal_evidence", "human_clinical_evidence", "unproven"}:
        # Prefer aggregation as the primary scientific claim under review unless structured
        q = question.lower()
        if "structure" in q:
            return "structural_change"
        if "misfold" in q:
            return "misfolding"
        return "aggregation"
    return None
