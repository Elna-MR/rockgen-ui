"""Write curated claims + evidence into Neo4j; link papers by id or query_tags."""

from __future__ import annotations

from pathlib import Path

import yaml

from rockgen_graph.client import get_driver
from rockgen_ingestion.provenance import now_iso

FIXTURES = Path(__file__).resolve().parent.parent / "fixtures"
DEFAULT_CLAIMS_PATH = FIXTURES / "pfn1_claims.yaml"


def load_claims(path: Path | None = None) -> dict:
    p = path or DEFAULT_CLAIMS_PATH
    return yaml.safe_load(p.read_text())


def write_claims_and_evidence(claims_path: Path | str | None = None) -> int:
    path = Path(claims_path) if claims_path else DEFAULT_CLAIMS_PATH
    data = load_claims(path)
    driver = get_driver()
    ingested = now_iso()
    count = 0
    with driver.session() as session:
        for ph_id, name in [
            ("structural_change", "Structural change / reduced flexibility"),
            ("misfolding", "Protein misfolding"),
            ("aggregation", "Aggregation"),
            ("therapeutic_opportunity", "Therapeutic opportunity"),
            ("microtubule_instability", "Microtubule instability"),
            ("axonal_transport_defect", "Axonal transport defect"),
            ("motor_neuron_injury", "Motor neuron injury"),
        ]:
            session.run(
                """
                MERGE (ph:Phenotype {id: $id})
                SET ph.name = coalesce(ph.name, $name)
                """,
                id=ph_id,
                name=name,
            )

        for claim in data.get("claims") or []:
            rel = claim.get("relation", "ASSOCIATED_WITH")
            if rel not in {"CAUSES_CHANGE", "INCREASES_RISK", "ASSOCIATED_WITH"}:
                rel = "ASSOCIATED_WITH"

            session.run(
                """
                MERGE (c:Claim {id: $id})
                SET c.text = $text,
                    c.topic = $topic,
                    c.last_ingested_at = $ingested
                """,
                id=claim["id"],
                text=claim["text"],
                topic=claim["topic"],
                ingested=ingested,
            )

            session.run(
                f"""
                MATCH (c:Claim {{id: $id}})
                MATCH (m:Mutation {{key: $mutation_key}})
                MERGE (m)-[:{rel}]->(c)
                WITH c, m
                MATCH (ph:Phenotype {{id: $phenotype_id}})
                MERGE (c)-[:ABOUT_PHENOTYPE]->(ph)
                """,
                id=claim["id"],
                mutation_key=claim["mutation_key"],
                phenotype_id=claim.get("phenotype_id"),
            )

            for ev in claim.get("evidence") or []:
                session.run(
                    """
                    MERGE (e:Evidence {id: $id})
                    SET e.evidence_type = $evidence_type,
                        e.confidence = $confidence,
                        e.quality = $quality,
                        e.stance = $stance,
                        e.directness = $directness,
                        e.experimental_model = $experimental_model,
                        e.publication_date = $publication_date,
                        e.citation = $citation,
                        e.not_yet_validated = coalesce($not_yet_validated, false),
                        e.source_system = 'curated_claims',
                        e.last_ingested_at = $ingested
                    WITH e
                    MATCH (c:Claim {id: $claim_id})
                    MERGE (c)-[:SUPPORTED_BY]->(e)
                    WITH e
                    MATCH (m:Mutation {key: $mutation_key})
                    MERGE (e)-[:ABOUT]->(m)
                    """,
                    id=ev["id"],
                    evidence_type=ev["evidence_type"],
                    confidence=ev.get("confidence"),
                    quality=ev.get("quality") or ev.get("confidence") or "medium",
                    stance=ev.get("stance") or "support",
                    directness=ev.get("directness") or "direct",
                    experimental_model=ev.get("experimental_model"),
                    publication_date=ev.get("publication_date"),
                    citation=ev.get("citation"),
                    not_yet_validated=ev.get("not_yet_validated", False),
                    claim_id=claim["id"],
                    mutation_key=claim["mutation_key"],
                    ingested=ingested,
                )
                paper_id = ev.get("paper_id")
                if paper_id:
                    session.run(
                        """
                        MATCH (e:Evidence {id: $eid})
                        MERGE (paper:Paper {id: $paper_id})
                        ON CREATE SET paper.title = coalesce(paper.title, $citation)
                        MERGE (e)-[:FROM_PAPER]->(paper)
                        SET e.source_url = coalesce(e.source_url, paper.url)
                        """,
                        eid=ev["id"],
                        paper_id=paper_id,
                        citation=ev.get("citation"),
                    )
                else:
                    tags = ev.get("query_tags") or []
                    if tags:
                        session.run(
                            """
                            MATCH (e:Evidence {id: $eid})
                            MATCH (paper:Paper)
                            WHERE any(t IN coalesce(paper.query_tags, []) WHERE t IN $tags)
                            WITH e, paper ORDER BY paper.year DESC LIMIT 1
                            MERGE (e)-[:FROM_PAPER]->(paper)
                            SET e.source_url = paper.url
                            """,
                            eid=ev["id"],
                            tags=tags,
                        )
                count += 1

        session.run(
            """
            MATCH (sc:Phenotype {id: 'structural_change'})
            MATCH (mf:Phenotype {id: 'misfolding'})
            MATCH (ag:Phenotype {id: 'aggregation'})
            MATCH (d:Disease {slug: 'als'})
            OPTIONAL MATCH (th:Phenotype {id: 'therapeutic_opportunity'})
            MERGE (sc)-[:LEADS_TO]->(mf)
            MERGE (mf)-[:LEADS_TO]->(ag)
            MERGE (ag)-[:CONTRIBUTES_TO]->(d)
            FOREACH (_ IN CASE WHEN th IS NULL THEN [] ELSE [1] END |
              MERGE (ag)-[:SUGGESTS]->(th)
            )
            WITH sc, mf, ag
            MATCH (m:Mutation)-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(c:Claim)
            WHERE c.topic IN ['structural_change', 'misfolding', 'aggregation',
              'microtubule_instability', 'axonal_transport', 'motor_neuron_injury']
            FOREACH (_ IN CASE WHEN c.topic = 'structural_change' THEN [1] ELSE [] END |
              MERGE (m)-[:CAUSES]->(sc)
            )
            FOREACH (_ IN CASE WHEN c.topic = 'misfolding' THEN [1] ELSE [] END |
              MERGE (m)-[:CAUSES]->(mf)
            )
            FOREACH (_ IN CASE WHEN c.topic = 'aggregation' THEN [1] ELSE [] END |
              MERGE (m)-[:INCREASES_RISK]->(ag)
            )
            """
        )
        session.run(
            """
            MATCH (mt:Phenotype {id: 'microtubule_instability'})
            MATCH (ax:Phenotype {id: 'axonal_transport_defect'})
            MATCH (mn:Phenotype {id: 'motor_neuron_injury'})
            MATCH (d:Disease {slug: 'als'})
            MERGE (mt)-[:LEADS_TO]->(ax)
            MERGE (ax)-[:LEADS_TO]->(mn)
            MERGE (mn)-[:CONTRIBUTES_TO]->(d)
            WITH mt, ax, mn
            MATCH (m:Mutation)-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(c:Claim)
            WHERE c.topic IN ['microtubule_instability', 'axonal_transport', 'motor_neuron_injury']
            FOREACH (_ IN CASE WHEN c.topic = 'microtubule_instability' THEN [1] ELSE [] END |
              MERGE (m)-[:CAUSES]->(mt)
            )
            FOREACH (_ IN CASE WHEN c.topic = 'axonal_transport' THEN [1] ELSE [] END |
              MERGE (m)-[:CAUSES]->(ax)
            )
            FOREACH (_ IN CASE WHEN c.topic = 'motor_neuron_injury' THEN [1] ELSE [] END |
              MERGE (m)-[:INCREASES_RISK]->(mn)
            )
            """
        )
    return count
