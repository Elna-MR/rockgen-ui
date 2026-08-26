"""Idempotent Neo4j writers for ingestion results."""

from __future__ import annotations

from rockgen_graph.client import get_driver
from rockgen_ingestion.provenance import now_iso


def write_uniprot(record: dict) -> None:
    driver = get_driver()
    ingested = now_iso()
    with driver.session() as session:
        session.run(
            """
            MERGE (p:Protein {uniprot_id: $uniprot_id})
            SET p.name = coalesce($protein_name, p.name),
                p.symbol = coalesce($gene_symbol, p.symbol),
                p.organism = coalesce($organism, p.organism),
                p.length = coalesce($length, p.length),
                p.sequence = coalesce($sequence, p.sequence),
                p.function = coalesce($function, p.function),
                p.source_system = $source_system,
                p.source_url = $source_url,
                p.last_ingested_at = $ingested
            WITH p
            FOREACH (_ IN CASE WHEN $gene_symbol IS NULL THEN [] ELSE [1] END |
              MERGE (g:Gene {symbol: $gene_symbol})
              SET g.source_system = $source_system, g.last_ingested_at = $ingested
              MERGE (g)-[:ENCODES]->(p)
            )
            """,
            **{
                "uniprot_id": record["uniprot_id"],
                "protein_name": record.get("protein_name"),
                "gene_symbol": record.get("gene_symbol"),
                "organism": record.get("organism"),
                "length": record.get("length"),
                "sequence": record.get("sequence"),
                "function": record.get("function"),
                "source_system": record.get("source_system", "uniprot"),
                "source_url": record.get("source_url"),
                "ingested": ingested,
            },
        )
        gene = record.get("gene_symbol") or "PFN1"
        for v in record.get("variants") or []:
            key = f"{gene}:{v['from_aa']}{v['position']}{v['to_aa']}"
            session.run(
                """
                MATCH (p:Protein {uniprot_id: $uniprot_id})
                MERGE (m:Mutation {key: $key})
                SET m.gene_symbol = $gene,
                    m.protein_uniprot = $uniprot_id,
                    m.position = $position,
                    m.from_aa = $from_aa,
                    m.to_aa = $to_aa,
                    m.hgvs_p = $hgvs_p,
                    m.description = coalesce($description, m.description),
                    m.source_system = 'uniprot',
                    m.last_ingested_at = $ingested
                MERGE (p)-[:HAS_MUTATION]->(m)
                """,
                uniprot_id=record["uniprot_id"],
                key=key,
                gene=gene,
                position=v["position"],
                from_aa=v["from_aa"],
                to_aa=v["to_aa"],
                hgvs_p=f"p.{v['from_aa']}{v['position']}{v['to_aa']}",
                description=v.get("description"),
                ingested=ingested,
            )


def write_structures(uniprot_id: str, structures: list[dict]) -> None:
    driver = get_driver()
    ingested = now_iso()
    with driver.session() as session:
        for s in structures:
            session.run(
                """
                MATCH (p:Protein {uniprot_id: $uniprot_id})
                MERGE (st:Structure {id: $id})
                SET st.source = $source,
                    st.method = $method,
                    st.resolution = $resolution,
                    st.title = $title,
                    st.ligands = $ligands,
                    st.url = $url,
                    st.source_system = $source_system,
                    st.source_url = $source_url,
                    st.last_ingested_at = $ingested
                MERGE (p)-[:HAS_STRUCTURE]->(st)
                """,
                uniprot_id=uniprot_id,
                id=s["id"],
                source=s.get("source", "PDB"),
                method=s.get("method"),
                resolution=s.get("resolution"),
                title=s.get("title"),
                ligands=s.get("ligands") or [],
                url=s.get("url"),
                source_system=s.get("source_system", "rcsb_pdb"),
                source_url=s.get("source_url"),
                ingested=ingested,
            )


def write_papers(papers: list[dict], *, protein_uniprot: str = "P07737", disease_slug: str = "als") -> None:
    driver = get_driver()
    ingested = now_iso()
    with driver.session() as session:
        for paper in papers:
            session.run(
                """
                MERGE (paper:Paper {id: $id})
                SET paper.pmid = $pmid,
                    paper.doi = $doi,
                    paper.title = $title,
                    paper.abstract = $abstract,
                    paper.authors = $authors,
                    paper.year = $year,
                    paper.journal = $journal,
                    paper.url = $url,
                    paper.query_tags = $query_tags,
                    paper.source_system = $source_system,
                    paper.source_url = $source_url,
                    paper.last_ingested_at = $ingested
                WITH paper
                OPTIONAL MATCH (p:Protein {uniprot_id: $uniprot_id})
                FOREACH (_ IN CASE WHEN p IS NULL THEN [] ELSE [1] END | MERGE (p)-[:MENTIONED_IN]->(paper))
                WITH paper
                OPTIONAL MATCH (d:Disease {slug: $disease_slug})
                FOREACH (_ IN CASE WHEN d IS NULL THEN [] ELSE [1] END | MERGE (d)-[:MENTIONED_IN]->(paper))
                """,
                id=paper["id"],
                pmid=paper.get("pmid"),
                doi=paper.get("doi"),
                title=paper.get("title"),
                abstract=(paper.get("abstract") or "")[:8000],
                authors=paper.get("authors"),
                year=paper.get("year"),
                journal=paper.get("journal"),
                url=paper.get("url"),
                query_tags=paper.get("query_tags") or ([paper.get("query_tag")] if paper.get("query_tag") else []),
                source_system=paper.get("source_system", "europe_pmc"),
                source_url=paper.get("source_url"),
                ingested=ingested,
                uniprot_id=protein_uniprot,
                disease_slug=disease_slug,
            )
            tags = paper.get("query_tags") or []
            if "pfn1_g118v" in tags or "g118v" in (paper.get("title") or "").lower():
                session.run(
                    """
                    MATCH (m:Mutation {key: 'PFN1:G118V'})
                    MATCH (paper:Paper {id: $id})
                    MERGE (m)-[:MENTIONED_IN]->(paper)
                    """,
                    id=paper["id"],
                )


def write_clinvar(assertions: list[dict], *, gene_symbol: str = "PFN1", uniprot_id: str = "P07737") -> None:
    driver = get_driver()
    ingested = now_iso()
    with driver.session() as session:
        for a in assertions:
            mut_key = None
            pc = a.get("protein_change")
            if pc:
                # normalize p.Gly118Val or G118V → key
                mut_key = _mutation_key_from_protein_change(gene_symbol, pc)

            session.run(
                """
                MERGE (c:ClinVarAssertion {id: $clinvar_id})
                SET c.title = $title,
                    c.protein_change = $protein_change,
                    c.clinical_significance = $clinical_significance,
                    c.conditions = $conditions,
                    c.review_status = $review_status,
                    c.gene_symbol = $gene_symbol,
                    c.url = $url,
                    c.source_system = 'clinvar',
                    c.source_url = $source_url,
                    c.last_ingested_at = $ingested
                """,
                clinvar_id=a["clinvar_id"],
                title=a.get("title"),
                protein_change=pc,
                clinical_significance=a.get("clinical_significance"),
                conditions=a.get("conditions") or [],
                review_status=a.get("review_status"),
                gene_symbol=gene_symbol,
                url=a.get("url"),
                source_url=a.get("source_url"),
                ingested=ingested,
            )
            if mut_key:
                session.run(
                    """
                    MATCH (p:Protein {uniprot_id: $uniprot_id})
                    MERGE (m:Mutation {key: $key})
                    SET m.gene_symbol = $gene,
                        m.protein_uniprot = $uniprot_id,
                        m.hgvs_p = coalesce(m.hgvs_p, $protein_change),
                        m.source_system = coalesce(m.source_system, 'clinvar'),
                        m.last_ingested_at = $ingested
                    MERGE (p)-[:HAS_MUTATION]->(m)
                    WITH m
                    MATCH (c:ClinVarAssertion {id: $clinvar_id})
                    MERGE (m)-[:HAS_CLINVAR_ASSERTION]->(c)
                    """,
                    uniprot_id=uniprot_id,
                    key=mut_key,
                    gene=gene_symbol,
                    protein_change=pc,
                    clinvar_id=a["clinvar_id"],
                    ingested=ingested,
                )


def _mutation_key_from_protein_change(gene: str, protein_change: str) -> str | None:
    import re

    aa3 = {
        "Ala": "A", "Arg": "R", "Asn": "N", "Asp": "D", "Cys": "C", "Gln": "Q", "Glu": "E",
        "Gly": "G", "His": "H", "Ile": "I", "Leu": "L", "Lys": "K", "Met": "M", "Phe": "F",
        "Pro": "P", "Ser": "S", "Thr": "T", "Trp": "W", "Tyr": "Y", "Val": "V",
    }
    pc = protein_change.strip()
    m = re.match(r"p\.([A-Za-z]{3})(\d+)([A-Za-z]{3})", pc)
    if m:
        a = aa3.get(m.group(1)[:1].upper() + m.group(1)[1:].lower(), m.group(1)[0])
        b = aa3.get(m.group(3)[:1].upper() + m.group(3)[1:].lower(), m.group(3)[0])
        return f"{gene}:{a}{m.group(2)}{b}"
    m = re.match(r"([A-Z])(\d+)([A-Z])", pc)
    if m:
        return f"{gene}:{m.group(1)}{m.group(2)}{m.group(3)}"
    if "118" in pc and ("Val" in pc or pc.endswith("V")) and ("Gly" in pc or "G" in pc):
        return f"{gene}:G118V"
    return None
