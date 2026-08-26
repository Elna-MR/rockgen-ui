"""Graph fetch helpers owned by the Disease Intelligence Engine."""

from __future__ import annotations

from typing import Any

from rockgen_graph.client import get_driver
from rockgen_graph.queries import (
    get_disease,
    get_mutation_path,
    get_protein,
    get_protein_evidence,
)


def fetch_mutation_statements(uniprot_id: str) -> list[dict[str, Any]]:
    """Claims + evidence grouped by mutation — the evidence spine."""
    driver = get_driver()
    query = """
    MATCH (p:Protein {uniprot_id: $uniprot_id})-[:HAS_MUTATION]->(m:Mutation)
    OPTIONAL MATCH (m)-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(c:Claim)
    OPTIONAL MATCH (c)-[:SUPPORTED_BY]->(e:Evidence)
    OPTIONAL MATCH (e)-[:FROM_PAPER]->(paper:Paper)
    RETURN m.key AS mutation_key,
           m.hgvs_p AS hgvs_p,
           m.significance AS significance,
           m.position AS position,
           m.from_aa AS from_aa,
           m.to_aa AS to_aa,
           collect(DISTINCT {
             claim_id: c.id,
             claim_text: c.text,
             topic: c.topic,
             evidence_id: e.id,
             evidence_type: e.evidence_type,
             confidence: e.confidence,
             stance: coalesce(e.stance, 'support'),
             directness: coalesce(e.directness, 'direct'),
             quality: coalesce(e.quality, e.confidence, 'medium'),
             citation: e.citation,
             source_url: coalesce(e.source_url, paper.url),
             not_yet_validated: coalesce(e.not_yet_validated, false),
             paper_id: paper.id,
             paper_title: paper.title
           }) AS rows
    ORDER BY m.position
    """
    with driver.session() as session:
        out: list[dict[str, Any]] = []
        for r in session.run(query, uniprot_id=uniprot_id):
            rows = [row for row in (r["rows"] or []) if row and row.get("claim_id")]
            out.append(
                {
                    "mutation_key": r["mutation_key"],
                    "hgvs_p": r["hgvs_p"],
                    "significance": r["significance"],
                    "position": r["position"],
                    "from_aa": r["from_aa"],
                    "to_aa": r["to_aa"],
                    "rows": rows,
                }
            )
        return out


def fetch_protein_mechanisms(uniprot_id: str) -> list[dict[str, Any]]:
    driver = get_driver()
    query = """
    MATCH (p:Protein {uniprot_id: $uniprot_id})-[r:IMPLICATED_IN]->(m:Mechanism)
    OPTIONAL MATCH (m)-[:IN_AXIS]->(a:DiseaseAxis)
    RETURN m.id AS id,
           m.name AS name,
           r.level AS level,
           r.evidence_note AS evidence_note,
           a.id AS axis_id,
           a.name AS axis_name
    ORDER BY
      CASE r.level WHEN 'high' THEN 0 WHEN 'medium' THEN 1 WHEN 'low' THEN 2 ELSE 3 END,
      m.name
    """
    with driver.session() as session:
        return [
            {
                "id": r["id"],
                "name": r["name"],
                "level": r["level"],
                "evidence_note": r["evidence_note"],
                "axis_id": r["axis_id"],
                "axis_name": r["axis_name"],
            }
            for r in session.run(query, uniprot_id=uniprot_id)
            if r["id"]
        ]


# Re-export shared graph reads for a single import surface
__all__ = [
    "fetch_mutation_statements",
    "fetch_protein_mechanisms",
    "get_disease",
    "get_mutation_path",
    "get_protein",
    "get_protein_evidence",
]
