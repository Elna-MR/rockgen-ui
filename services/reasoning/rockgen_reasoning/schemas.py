"""Scientific Review schemas."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field

QuestionType = Literal[
    "structure_change",
    "misfolding",
    "aggregation",
    "animal_evidence",
    "human_clinical_evidence",
    "unproven",
    "next_experiment",
    "cross_protein_mechanism",
    "unsupported",
]

ClaimTopic = Literal[
    "structural_change",
    "misfolding",
    "aggregation",
    "therapeutic_opportunity",
]


class ConfidenceBreakdownItem(BaseModel):
    label: str
    points: int


class ConfidenceResult(BaseModel):
    score: int = Field(ge=0, le=100)
    label: Literal["High", "Moderate", "Low", "Insufficient"]
    breakdown: list[ConfidenceBreakdownItem]
    formula_note: str = (
        "Confidence reflects strength of available evidence for the conclusion, "
        "not the probability that a therapy will work."
    )


class EvidenceItem(BaseModel):
    evidence_id: str
    title: str | None = None
    year: str | int | None = None
    evidence_type: str | None = None
    supported_claim: str | None = None
    stance: Literal["support", "contradict", "neutral"] = "support"
    directness: Literal["direct", "indirect"] = "direct"
    quality: Literal["low", "medium", "high"] = "medium"
    citation_url: str | None = None
    paper_id: str | None = None


class GapItem(BaseModel):
    id: str
    text: str
    rule: str


class HypothesisItem(BaseModel):
    hypothesis: str
    rationale: str
    evidence_ids: list[str] = Field(default_factory=list)
    proposed_experiment: str


class CitationItem(BaseModel):
    id: str
    title: str | None = None
    year: str | int | None = None
    url: str | None = None
    evidence_type: str | None = None


class ScientificReview(BaseModel):
    question: str
    question_type: QuestionType
    claim_topic: str | None = None
    claim_id: str | None = None
    conclusion: str
    confidence: int
    confidence_label: str
    confidence_breakdown: list[ConfidenceBreakdownItem]
    confidence_note: str
    contradictions_checked: bool = True
    summary: str
    supporting_evidence: list[EvidenceItem]
    conflicting_evidence: list[EvidenceItem]
    conflicting_searched: bool = True
    conflicting_none_message: str | None = None
    evidence_mix: dict[str, int]
    gaps: list[GapItem]
    suggested_next_steps: list[HypothesisItem]
    citations: list[CitationItem]
    meta: dict[str, Any] = Field(default_factory=dict)


STARTER_QUESTIONS = [
    "What disease mechanisms are shared by PFN1 and TUBA4A?",
    "Does G118V change PFN1 structure?",
    "Does G118V increase misfolding?",
    "Does G118V increase aggregation?",
    "Is there animal evidence?",
    "Is there human or clinical evidence?",
    "What remains unproven?",
    "What experiment should be done next?",
]
