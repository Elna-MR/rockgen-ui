"""Response shapes for the Disease Intelligence Engine."""

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class EvidenceRef(BaseModel):
    evidence_id: str
    evidence_type: str | None = None
    confidence: str | None = None
    stance: str | None = None
    citation: str | None = None
    source_url: str | None = None
    paper_id: str | None = None
    paper_title: str | None = None
    not_yet_validated: bool = False


class StatementIntel(BaseModel):
    """A scientific statement with evidence chain + confidence."""

    claim_id: str
    statement: str
    topic: str | None = None
    mutation_key: str | None = None
    evidence: list[EvidenceRef] = Field(default_factory=list)
    evidence_mix: dict[str, bool] = Field(default_factory=dict)
    confidence_score: int = 0
    confidence_label: str = "Insufficient"
    confidence_breakdown: list[dict[str, Any]] = Field(default_factory=list)
    validated: bool = False


class MutationIntel(BaseModel):
    key: str
    variant: str | None = None
    hgvs_p: str | None = None
    significance: str | None = None
    gene: str | None = None
    protein_symbol: str | None = None
    protein_name: str | None = None
    uniprot_id: str | None = None
    disease_association: str | None = None
    mechanism_path: list[str] = Field(default_factory=list)
    clinvar: list[dict[str, Any]] = Field(default_factory=list)
    statements: list[StatementIntel] = Field(default_factory=list)
    evidence_mix: dict[str, bool] = Field(default_factory=dict)
    paper_count: int = 0
    confidence_score: int | None = None
    confidence_label: str | None = None
    primary_statement: str | None = None
    review_question: str | None = None
    dossier_href: str | None = None


class MechanismIntel(BaseModel):
    id: str
    name: str | None = None
    level: str | None = None
    axis_id: str | None = None
    axis_name: str | None = None
    evidence_note: str | None = None


class BiomarkerIntel(BaseModel):
    id: str
    name: str | None = None
    description: str | None = None
    role: str | None = None
    specificity_note: str | None = None


class ProteinIntelligence(BaseModel):
    """Disease intelligence dossier for one protein — graph source of truth."""

    engine: Literal["disease_intelligence"] = "disease_intelligence"
    uniprot_id: str
    symbol: str | None = None
    name: str | None = None
    gene: str | None = None
    function: str | None = None
    mutations: list[MutationIntel] = Field(default_factory=list)
    statements: list[StatementIntel] = Field(default_factory=list)
    mechanisms: list[MechanismIntel] = Field(default_factory=list)
    pathways: list[dict[str, Any]] = Field(default_factory=list)
    papers: list[dict[str, Any]] = Field(default_factory=list)
    structures: list[dict[str, Any]] = Field(default_factory=list)
    interaction_partners: list[dict[str, Any]] = Field(default_factory=list)
    biomarkers: list[BiomarkerIntel] = Field(default_factory=list)
    drugs: list[dict[str, Any]] = Field(default_factory=list)
    drug_programs: list[dict[str, Any]] = Field(default_factory=list)
    clinical_trials: list[dict[str, Any]] = Field(default_factory=list)
    experiments: list[dict[str, Any]] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    source: Literal["neo4j"] = "neo4j"


class DiseaseIntelligence(BaseModel):
    engine: Literal["disease_intelligence"] = "disease_intelligence"
    slug: str
    name: str | None = None
    synopsis: str | None = None
    proteins: list[dict[str, Any]] = Field(default_factory=list)
    focus_proteins: list[ProteinIntelligence] = Field(default_factory=list)
    biomarkers: list[BiomarkerIntel] = Field(default_factory=list)
    drugs: list[dict[str, Any]] = Field(default_factory=list)
    drug_programs: list[dict[str, Any]] = Field(default_factory=list)
    clinical_trials: list[dict[str, Any]] = Field(default_factory=list)
    publications: list[dict[str, Any]] = Field(default_factory=list)
    mutations_index: list[dict[str, Any]] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    source: Literal["neo4j"] = "neo4j"
