"""Disease Intelligence Engine API — scientific domain, not UI twin."""

from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from rockgen_disease import build_disease_intelligence, build_protein_intelligence

router = APIRouter(prefix="/intelligence", tags=["disease-intelligence"])


@router.get("/proteins/{uniprot_id}")
def protein_intelligence(uniprot_id: str):
    """
    Protein Disease Intelligence dossier from Neo4j.

    Mutations → causal paths → claims → evidence → confidence.
    """
    intel = build_protein_intelligence(uniprot_id)
    if not intel:
        raise HTTPException(status_code=404, detail="Protein not found in knowledge graph")
    return intel.model_dump()


@router.get("/diseases/{slug}")
def disease_intelligence(slug: str):
    """Disease Intelligence catalog + focus-protein dossiers."""
    intel = build_disease_intelligence(slug)
    if not intel:
        raise HTTPException(status_code=404, detail="Disease not found in knowledge graph")
    return intel.model_dump()


@router.get("/proteins/{uniprot_id}/report.md")
def protein_intelligence_markdown(uniprot_id: str):
    intel = build_protein_intelligence(uniprot_id)
    if not intel:
        raise HTTPException(status_code=404, detail="Protein not found")
    lines = [
        f"# Disease Intelligence — {intel.symbol or intel.uniprot_id}",
        "",
        f"**UniProt:** {intel.uniprot_id}",
        f"**Gene:** {intel.gene or '—'}",
        "",
        "## Mutations",
    ]
    for m in intel.mutations:
        lines.append(f"### {m.variant or m.key}")
        if m.mechanism_path:
            lines.append(f"- Mechanism path: {' → '.join(m.mechanism_path)}")
        if m.primary_statement:
            lines.append(
                f"- Primary statement: {m.primary_statement} "
                f"(confidence {m.confidence_score} / {m.confidence_label})"
            )
        lines.append(f"- Evidence mix: {', '.join(k for k, v in m.evidence_mix.items() if v) or 'none'}")
        lines.append("")
    lines.append("## Mechanisms")
    for mech in intel.mechanisms:
        lines.append(f"- **{mech.name or mech.id}** ({mech.level}) — {mech.evidence_note or ''}")
    lines.append("")
    lines.append("## Gaps")
    for g in intel.gaps:
        lines.append(f"- {g}")
    lines.append("")
    lines.append("_Source: Neo4j Disease Intelligence Engine_")
    return PlainTextResponse("\n".join(lines), media_type="text/markdown")
