"""Typed Neo4j query helpers for disease and protein workspaces."""

from __future__ import annotations

from typing import Any

from rockgen_graph.client import get_driver


def _node_props(node) -> dict[str, Any]:
    if node is None:
        return {}
    return dict(node)


def list_diseases() -> list[dict[str, Any]]:
    driver = get_driver()
    query = """
    MATCH (d:Disease)
    OPTIONAL MATCH (d)-[:ASSOCIATED_WITH]->(:Gene)-[:ENCODES]->(p:Protein)
    RETURN d AS disease, count(DISTINCT p) AS protein_count
    ORDER BY d.name
    """
    with driver.session() as session:
        rows = session.run(query)
        return [
            {**_node_props(r["disease"]), "protein_count": r["protein_count"]}
            for r in rows
        ]


def get_disease(slug: str) -> dict[str, Any] | None:
    driver = get_driver()
    query = """
    MATCH (d:Disease {slug: $slug})
    OPTIONAL MATCH (d)-[:ASSOCIATED_WITH]->(g:Gene)-[:ENCODES]->(p:Protein)
    OPTIONAL MATCH (p)-[:HAS_MUTATION]->(m:Mutation)
    OPTIONAL MATCH (b:Biomarker)-[:INDICATES]->(d)
    OPTIONAL MATCH (d)-[:STUDIED_IN]->(t:ClinicalTrial)
    OPTIONAL MATCH (d)-[:MENTIONED_IN]->(paper:Paper)
    OPTIONAL MATCH (drug:Drug)-[:INDICATED_FOR]->(d)
    OPTIONAL MATCH (prog:DrugProgram)-[:FOR_DISEASE]->(d)
    RETURN d AS disease,
           collect(DISTINCT {uniprot_id: p.uniprot_id, symbol: p.symbol, name: p.name}) AS proteins,
           collect(DISTINCT {key: m.key, hgvs_p: m.hgvs_p, significance: m.significance}) AS mutations,
           collect(DISTINCT b {.*}) AS biomarkers,
           collect(DISTINCT t {.*}) AS clinical_trials,
           collect(DISTINCT paper {.*}) AS publications,
           collect(DISTINCT drug {.*}) AS drugs,
           collect(DISTINCT prog {.*}) AS drug_programs
    """
    with driver.session() as session:
        record = session.run(query, slug=slug).single()
        if not record:
            return None

        def clean(items: list) -> list:
            return [i for i in items if i and any(v is not None for v in (i.values() if isinstance(i, dict) else [i]))]

        disease = _node_props(record["disease"])
        return {
            **disease,
            "proteins": clean(record["proteins"]),
            "mutations": clean(record["mutations"]),
            "biomarkers": clean(record["biomarkers"]),
            "clinical_trials": clean(record["clinical_trials"]),
            "publications": clean(record["publications"]),
            "drugs": clean(record["drugs"]),
            "drug_programs": clean(record["drug_programs"]),
            "experiments": [],
        }


def get_disease_graph(slug: str) -> dict[str, Any] | None:
    driver = get_driver()
    query = """
    MATCH (d:Disease {slug: $slug})
    OPTIONAL MATCH path = (d)-[*1..4]-(n)
    WITH d, collect(DISTINCT path) AS paths
    RETURN d AS disease, paths
    """
    with driver.session() as session:
        record = session.run(query, slug=slug).single()
        if not record:
            return None

        nodes: dict[str, dict] = {}
        edges: list[dict] = []
        seen_edges: set[tuple] = set()

        disease = record["disease"]
        d_id = f"Disease:{disease['slug']}"
        nodes[d_id] = {"id": d_id, "label": list(disease.labels)[0], "properties": _node_props(disease)}

        for path in record["paths"] or []:
            if path is None:
                continue
            for node in path.nodes:
                labels = list(node.labels)
                label = labels[0] if labels else "Node"
                props = _node_props(node)
                key = props.get("slug") or props.get("uniprot_id") or props.get("key") or props.get("id") or props.get("symbol") or props.get("nct_id") or str(node.element_id)
                nid = f"{label}:{key}"
                nodes[nid] = {"id": nid, "label": label, "properties": props}
            for rel in path.relationships:
                start = rel.start_node
                end = rel.end_node
                s_labels = list(start.labels)
                e_labels = list(end.labels)
                s_label = s_labels[0] if s_labels else "Node"
                e_label = e_labels[0] if e_labels else "Node"
                s_props = _node_props(start)
                e_props = _node_props(end)
                s_key = s_props.get("slug") or s_props.get("uniprot_id") or s_props.get("key") or s_props.get("id") or s_props.get("symbol") or s_props.get("nct_id") or str(start.element_id)
                e_key = e_props.get("slug") or e_props.get("uniprot_id") or e_props.get("key") or e_props.get("id") or e_props.get("symbol") or e_props.get("nct_id") or str(end.element_id)
                edge_key = (f"{s_label}:{s_key}", rel.type, f"{e_label}:{e_key}")
                if edge_key in seen_edges:
                    continue
                seen_edges.add(edge_key)
                edges.append({"source": edge_key[0], "type": rel.type, "target": edge_key[2]})

        return {"disease": _node_props(disease), "nodes": list(nodes.values()), "edges": edges}


def get_protein(uniprot_id: str) -> dict[str, Any] | None:
    driver = get_driver()
    query = """
    MATCH (p:Protein {uniprot_id: $uniprot_id})
    OPTIONAL MATCH (g:Gene)-[:ENCODES]->(p)
    OPTIONAL MATCH (p)-[:HAS_MUTATION]->(m:Mutation)
    OPTIONAL MATCH (p)-[:HAS_STRUCTURE]->(s:Structure)
    OPTIONAL MATCH (p)-[:IN_PATHWAY]->(pw:Pathway)
    OPTIONAL MATCH (p)-[:INTERACTS_WITH]->(partner:Protein)
    OPTIONAL MATCH (p)-[:MENTIONED_IN]->(paper:Paper)
    OPTIONAL MATCH (m)-[:MENTIONED_IN]->(mpaper:Paper)
    OPTIONAL MATCH (prog:DrugProgram)-[:TARGETS_PROTEIN]->(p)
    RETURN p AS protein,
           g AS gene,
           collect(DISTINCT m {.*}) AS mutations,
           collect(DISTINCT s {.*}) AS structures,
           collect(DISTINCT pw {.*}) AS pathways,
           collect(DISTINCT {uniprot_id: partner.uniprot_id, symbol: partner.symbol, name: partner.name}) AS interaction_partners,
           collect(DISTINCT paper {.*}) + collect(DISTINCT mpaper {.*}) AS publications,
           collect(DISTINCT prog {.*}) AS drug_programs
    """
    with driver.session() as session:
        record = session.run(query, uniprot_id=uniprot_id).single()
        if not record or record["protein"] is None:
            return None

        def clean(items: list) -> list:
            out = []
            seen = set()
            for i in items:
                if not i or not any(v is not None for v in (i.values() if isinstance(i, dict) else [i])):
                    continue
                key = i.get("id") or i.get("key") or i.get("uniprot_id") or str(i)
                if key in seen:
                    continue
                seen.add(key)
                out.append(i)
            return out

        return {
            **_node_props(record["protein"]),
            "gene": _node_props(record["gene"]) if record["gene"] else None,
            "mutations": clean(record["mutations"]),
            "structures": clean(record["structures"]),
            "pathways": clean(record["pathways"]),
            "interaction_partners": clean(record["interaction_partners"]),
            "publications": clean(record["publications"]),
            "drug_programs": clean(record["drug_programs"]),
            "known_drugs": [],
            "simulations": [],
            "experiments": [],
        }


def get_mutation_path(mutation_key: str) -> dict[str, Any] | None:
    """Traverse mutation → structural change → misfolding → aggregation → disease / therapy."""
    driver = get_driver()
    query = """
    MATCH (m:Mutation {key: $key})
    OPTIONAL MATCH (p:Protein)-[:HAS_MUTATION]->(m)
    OPTIONAL MATCH path = (m)-[:CAUSES|INCREASES_RISK|LEADS_TO|CONTRIBUTES_TO|SUGGESTS*1..6]->(endpoint)
    OPTIONAL MATCH (m)-[:HAS_CLINVAR_ASSERTION]->(cv:ClinVarAssertion)
    RETURN m AS mutation,
           p AS protein,
           collect(DISTINCT path) AS paths,
           collect(DISTINCT cv {.*}) AS clinvar
    """
    with driver.session() as session:
        record = session.run(query, key=mutation_key).single()
        if not record or record["mutation"] is None:
            return None

        preferred_order = [
            "structural_change",
            "misfolding",
            "aggregation",
            "als",
            "therapeutic_opportunity",
        ]
        chain: list[dict] = []
        seen: set[str] = set()
        for path in record["paths"] or []:
            if path is None:
                continue
            for node in path.nodes:
                props = _node_props(node)
                labels = list(node.labels)
                label = labels[0] if labels else "Node"
                if label == "Mutation" or label == "Claim":
                    continue
                nid = props.get("id") or props.get("key") or props.get("slug") or props.get("uniprot_id")
                if not nid or nid in seen:
                    continue
                if label not in {"Phenotype", "Disease"}:
                    continue
                seen.add(nid)
                chain.append(
                    {
                        "label": label,
                        "id": nid,
                        "name": props.get("name") or props.get("hgvs_p") or nid,
                        "properties": props,
                    }
                )

        def sort_key(item: dict) -> tuple:
            try:
                return (preferred_order.index(item["id"]), item["id"])
            except ValueError:
                return (len(preferred_order), item["id"])

        chain.sort(key=sort_key)

        clinvar = [c for c in (record["clinvar"] or []) if c and c.get("id")]
        return {
            "mutation": _node_props(record["mutation"]),
            "protein": _node_props(record["protein"]) if record["protein"] else None,
            "causal_chain": chain,
            "clinvar_assertions": clinvar,
        }


def get_protein_evidence(uniprot_id: str) -> dict[str, Any] | None:
    driver = get_driver()
    query = """
    MATCH (p:Protein {uniprot_id: $uniprot_id})
    OPTIONAL MATCH (p)-[:HAS_MUTATION]->(m:Mutation)
    OPTIONAL MATCH (m)-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(claim:Claim)
    OPTIONAL MATCH (claim)-[:SUPPORTED_BY]->(e:Evidence)
    OPTIONAL MATCH (e)-[:FROM_PAPER]->(paper:Paper)
    OPTIONAL MATCH (m)-[:HAS_CLINVAR_ASSERTION]->(cv:ClinVarAssertion)
    OPTIONAL MATCH (p)-[:HAS_STRUCTURE]->(s:Structure)
    OPTIONAL MATCH (p)-[:MENTIONED_IN]->(pp:Paper)
    RETURN p AS protein,
           collect(DISTINCT m {.*}) AS mutations,
           collect(DISTINCT claim {.*, evidence_id: e.id}) AS claim_links,
           collect(DISTINCT {
             claim_id: claim.id,
             claim_text: claim.text,
             claim_topic: claim.topic,
             evidence: e {.*, stance: coalesce(e.stance, 'support'), directness: coalesce(e.directness, 'direct'), quality: coalesce(e.quality, e.confidence, 'medium')},
             paper: paper {.*}
           }) AS evidence_rows,
           collect(DISTINCT cv {.*}) AS clinvar,
           collect(DISTINCT s {.*}) AS structures,
           collect(DISTINCT pp {.*}) AS papers
    """
    with driver.session() as session:
        record = session.run(query, uniprot_id=uniprot_id).single()
        if not record or record["protein"] is None:
            return None

        evidence_rows = []
        seen_ev: set[str] = set()
        for row in record["evidence_rows"] or []:
            if not row or not row.get("claim_id"):
                continue
            ev = row.get("evidence") or {}
            eid = ev.get("id")
            if not eid or eid in seen_ev:
                continue
            seen_ev.add(eid)
            paper = row.get("paper") or {}
            evidence_rows.append(
                {
                    "claim_id": row["claim_id"],
                    "claim_text": row.get("claim_text"),
                    "claim_topic": row.get("claim_topic"),
                    "evidence_id": eid,
                    "evidence_type": ev.get("evidence_type"),
                    "confidence": ev.get("confidence"),
                    "stance": ev.get("stance") or "support",
                    "directness": ev.get("directness") or "direct",
                    "quality": ev.get("quality") or ev.get("confidence") or "medium",
                    "experimental_model": ev.get("experimental_model"),
                    "publication_date": ev.get("publication_date"),
                    "citation": ev.get("citation"),
                    "not_yet_validated": ev.get("not_yet_validated", False),
                    "source_url": ev.get("source_url") or paper.get("url"),
                    "paper": {k: paper.get(k) for k in ("id", "title", "year", "url", "pmid", "doi") if paper.get(k)},
                }
            )

        timeline = sorted(
            evidence_rows,
            key=lambda r: (r.get("publication_date") or "9999", r.get("citation") or ""),
        )

        return {
            "protein": _node_props(record["protein"]),
            "mutations": [m for m in (record["mutations"] or []) if m and m.get("key")],
            "structures": [s for s in (record["structures"] or []) if s and s.get("id")],
            "clinvar_assertions": [c for c in (record["clinvar"] or []) if c and c.get("id")],
            "papers": [p for p in (record["papers"] or []) if p and p.get("id")],
            "evidence": evidence_rows,
            "timeline": timeline,
            "claim_matrix": get_claim_matrix(uniprot_id) or [],
        }


def get_claim_matrix(uniprot_id: str) -> list[dict[str, Any]]:
    driver = get_driver()
    query = """
    MATCH (p:Protein {uniprot_id: $uniprot_id})-[:HAS_MUTATION]->(m:Mutation)
    MATCH (m)-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->(c:Claim)
    OPTIONAL MATCH (c)-[:SUPPORTED_BY]->(e:Evidence)
    OPTIONAL MATCH (e)-[:FROM_PAPER]->(paper:Paper)
    RETURN c.id AS claim_id,
           c.text AS claim_text,
           c.topic AS topic,
           collect(DISTINCT e.evidence_type) AS evidence_types,
           collect(DISTINCT e.confidence) AS confidences,
           collect(DISTINCT {
             evidence_id: e.id,
             evidence_type: e.evidence_type,
             confidence: e.confidence,
             citation: e.citation,
             not_yet_validated: e.not_yet_validated,
             paper_id: paper.id,
             paper_title: paper.title,
             url: coalesce(e.source_url, paper.url)
           }) AS sources
    ORDER BY c.topic
    """
    with driver.session() as session:
        rows = []
        for r in session.run(query, uniprot_id=uniprot_id):
            sources = [s for s in (r["sources"] or []) if s and s.get("evidence_id")]
            types = [t for t in (r["evidence_types"] or []) if t]
            confidences = [c for c in (r["confidences"] or []) if c]
            validated = not any(s.get("not_yet_validated") for s in sources)
            rows.append(
                {
                    "claim_id": r["claim_id"],
                    "claim": r["claim_text"],
                    "topic": r["topic"],
                    "evidence_types": types,
                    "evidence_summary": " + ".join(types) if types else "none",
                    "confidence": confidences[0] if confidences else None,
                    "validated": validated,
                    "sources": sources,
                }
            )
        return rows


def retrieve_for_question(
    *,
    mutation_key: str = "PFN1:G118V",
    uniprot_id: str = "P07737",
) -> dict[str, Any]:
    """Context pack for evidence-backed Q&A — only graph facts."""
    path = get_mutation_path(mutation_key) or {}
    evidence = get_protein_evidence(uniprot_id) or {}
    matrix = evidence.get("claim_matrix") or []
    papers = evidence.get("papers") or []
    return {
        "mutation_key": mutation_key,
        "uniprot_id": uniprot_id,
        "causal_chain": path.get("causal_chain") or [],
        "mutation": path.get("mutation"),
        "claims": matrix,
        "evidence": evidence.get("evidence") or [],
        "clinvar": evidence.get("clinvar_assertions") or path.get("clinvar_assertions") or [],
        "papers": [
            {
                "id": p.get("id"),
                "title": p.get("title"),
                "year": p.get("year"),
                "url": p.get("url"),
                "abstract": (p.get("abstract") or "")[:600],
            }
            for p in papers
            if p.get("id")
        ],
        "unproven": [
            c for c in matrix if (not c.get("validated")) or c.get("confidence") == "low" or "therapeutic" in (c.get("topic") or "")
        ],
    }
