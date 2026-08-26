"""Retrieve claim-scoped evidence from Neo4j for scientific review."""

from __future__ import annotations

from typing import Any

from rockgen_graph.client import get_driver
from rockgen_reasoning.claim_normalizer import CLAIM_IDS


def retrieve_claim_evidence(
    *,
    claim_topic: str | None,
    mutation_key: str = "PFN1:G118V",
    uniprot_id: str = "P07737",
) -> dict[str, Any]:
    driver = get_driver()
    claim_id = CLAIM_IDS.get(claim_topic or "", None)

    with driver.session() as session:
        if claim_id:
            rows = list(
                session.run(
                    """
                    MATCH (c:Claim {id: $claim_id})
                    OPTIONAL MATCH (c)-[:SUPPORTED_BY]->(e:Evidence)
                    OPTIONAL MATCH (e)-[:FROM_PAPER]->(paper:Paper)
                    OPTIONAL MATCH (m:Mutation {key: $mutation_key})-[:HAS_CLINVAR_ASSERTION]->(cv:ClinVarAssertion)
                    OPTIONAL MATCH (p:Protein {uniprot_id: $uniprot_id})-[:INTERACTS_WITH]->(partner:Protein)
                    RETURN c {.*} AS claim,
                           collect(DISTINCT {
                             evidence_id: e.id,
                             evidence_type: e.evidence_type,
                             confidence: e.confidence,
                             experimental_model: e.experimental_model,
                             publication_date: e.publication_date,
                             citation: e.citation,
                             stance: coalesce(e.stance, 'support'),
                             directness: coalesce(e.directness, 'direct'),
                             quality: coalesce(e.quality, e.confidence, 'medium'),
                             not_yet_validated: coalesce(e.not_yet_validated, false),
                             source_url: coalesce(e.source_url, paper.url),
                             paper_id: paper.id,
                             paper_title: paper.title,
                             paper_year: paper.year,
                             paper_url: paper.url
                           }) AS evidence,
                           collect(DISTINCT cv {.*}) AS clinvar,
                           collect(DISTINCT {uniprot_id: partner.uniprot_id, symbol: partner.symbol, name: partner.name}) AS partners
                    """,
                    claim_id=claim_id,
                    mutation_key=mutation_key,
                    uniprot_id=uniprot_id,
                )
            )
        else:
            rows = list(
                session.run(
                    """
                    MATCH (m:Mutation {key: $mutation_key})-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(c:Claim)
                    OPTIONAL MATCH (c)-[:SUPPORTED_BY]->(e:Evidence)
                    OPTIONAL MATCH (e)-[:FROM_PAPER]->(paper:Paper)
                    OPTIONAL MATCH (m)-[:HAS_CLINVAR_ASSERTION]->(cv:ClinVarAssertion)
                    OPTIONAL MATCH (p:Protein {uniprot_id: $uniprot_id})-[:INTERACTS_WITH]->(partner:Protein)
                    RETURN null AS claim,
                           collect(DISTINCT {
                             evidence_id: e.id,
                             evidence_type: e.evidence_type,
                             confidence: e.confidence,
                             experimental_model: e.experimental_model,
                             publication_date: e.publication_date,
                             citation: e.citation,
                             stance: coalesce(e.stance, 'support'),
                             directness: coalesce(e.directness, 'direct'),
                             quality: coalesce(e.quality, e.confidence, 'medium'),
                             not_yet_validated: coalesce(e.not_yet_validated, false),
                             source_url: coalesce(e.source_url, paper.url),
                             paper_id: paper.id,
                             paper_title: paper.title,
                             paper_year: paper.year,
                             paper_url: paper.url,
                             claim_id: c.id,
                             claim_text: c.text,
                             claim_topic: c.topic
                           }) AS evidence,
                           collect(DISTINCT cv {.*}) AS clinvar,
                           collect(DISTINCT {uniprot_id: partner.uniprot_id, symbol: partner.symbol, name: partner.name}) AS partners
                    """,
                    mutation_key=mutation_key,
                    uniprot_id=uniprot_id,
                )
            )

        if not rows:
            return {
                "claim": None,
                "claim_id": claim_id,
                "claim_topic": claim_topic,
                "evidence": [],
                "clinvar": [],
                "partners": [],
                "all_claims": [],
            }

        record = rows[0]
        evidence = [e for e in (record["evidence"] or []) if e and e.get("evidence_id")]
        clinvar = [c for c in (record["clinvar"] or []) if c and c.get("id")]
        partners = [p for p in (record["partners"] or []) if p and p.get("uniprot_id")]
        claim = dict(record["claim"]) if record["claim"] else None

        all_claims = list(
            session.run(
                """
                MATCH (m:Mutation {key: $mutation_key})-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(c:Claim)
                OPTIONAL MATCH (c)-[:SUPPORTED_BY]->(e:Evidence)
                RETURN c.id AS id, c.text AS text, c.topic AS topic,
                       collect(DISTINCT e.evidence_type) AS types,
                       collect(DISTINCT e.confidence) AS confidences,
                       collect(DISTINCT coalesce(e.not_yet_validated, false)) AS flags
                """,
                mutation_key=mutation_key,
            )
        )

        return {
            "claim": claim,
            "claim_id": claim_id or (claim or {}).get("id"),
            "claim_topic": claim_topic or (claim or {}).get("topic"),
            "evidence": evidence,
            "clinvar": clinvar,
            "partners": partners,
            "all_claims": [dict(r) for r in all_claims],
        }


def evidence_mix_counts(evidence: list[dict]) -> dict[str, int]:
    keys = {
        "computational_prediction": "computational",
        "in_vitro": "in_vitro",
        "animal": "animal",
        "human_genetic": "human_genetic",
        "clinical": "clinical",
        "curated_expert": "curated_expert",
    }
    mix = {v: 0 for v in ["computational", "in_vitro", "animal", "human_genetic", "clinical"]}
    for e in evidence:
        if (e.get("stance") or "support") == "contradict":
            continue
        if e.get("not_yet_validated"):
            continue
        et = e.get("evidence_type") or ""
        bucket = keys.get(et)
        if bucket in mix:
            mix[bucket] += 1
    return mix
