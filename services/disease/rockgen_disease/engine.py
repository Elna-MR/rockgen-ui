"""Assemble Disease Intelligence from the knowledge graph."""

from __future__ import annotations

from typing import Any

from rockgen_reasoning.confidence import score_confidence
from rockgen_reasoning.evidence_ranker import normalize_type

from rockgen_disease.graph_ops import (
    fetch_mutation_statements,
    fetch_protein_mechanisms,
    get_disease,
    get_mutation_path,
    get_protein,
)
from rockgen_disease.schema import (
    BiomarkerIntel,
    DiseaseIntelligence,
    EvidenceRef,
    MechanismIntel,
    MutationIntel,
    ProteinIntelligence,
    StatementIntel,
)

MIX_KEYS = ("computational", "in_vitro", "animal", "human_genetic", "clinical")

# Focus proteins for deep ALS intelligence (others stay in index only)
ALS_FOCUS = ("P07737", "P68366")


def _empty_mix() -> dict[str, bool]:
    return {k: False for k in MIX_KEYS}


def _variant_from_key(key: str | None, hgvs_p: str | None = None) -> str | None:
    if not key:
        return None
    if ":" in key:
        return key.split(":", 1)[1]
    if hgvs_p and hgvs_p.startswith("p."):
        return hgvs_p[2:]
    return key


def _evidence_mix(items: list[dict[str, Any]]) -> dict[str, bool]:
    mix = _empty_mix()
    for e in items:
        if e.get("not_yet_validated"):
            continue
        t = normalize_type(e.get("evidence_type"))
        if t in mix:
            mix[t] = True
    return mix


def _group_claim_rows(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    by_claim: dict[str, dict[str, Any]] = {}
    for row in rows:
        cid = row.get("claim_id")
        if not cid:
            continue
        bucket = by_claim.setdefault(
            cid,
            {
                "claim_id": cid,
                "claim_text": row.get("claim_text"),
                "topic": row.get("topic"),
                "evidence": [],
            },
        )
        if row.get("evidence_id"):
            bucket["evidence"].append(row)
    return list(by_claim.values())


def _statement_from_claim(
    *,
    claim: dict[str, Any],
    mutation_key: str | None,
) -> StatementIntel:
    evidence_rows = claim.get("evidence") or []
    supporting = [
        e
        for e in evidence_rows
        if (e.get("stance") or "support") != "contradict" and not e.get("not_yet_validated")
    ]
    conflicting = [e for e in evidence_rows if (e.get("stance") or "") == "contradict"]
    conf = score_confidence(supporting=supporting, conflicting=conflicting)
    refs = [
        EvidenceRef(
            evidence_id=e["evidence_id"],
            evidence_type=normalize_type(e.get("evidence_type")),
            confidence=e.get("confidence"),
            stance=e.get("stance"),
            citation=e.get("citation"),
            source_url=e.get("source_url"),
            paper_id=e.get("paper_id"),
            paper_title=e.get("paper_title"),
            not_yet_validated=bool(e.get("not_yet_validated")),
        )
        for e in evidence_rows
        if e.get("evidence_id")
    ]
    return StatementIntel(
        claim_id=claim["claim_id"],
        statement=claim.get("claim_text") or claim["claim_id"],
        topic=claim.get("topic"),
        mutation_key=mutation_key,
        evidence=refs,
        evidence_mix=_evidence_mix(evidence_rows),
        confidence_score=conf.score,
        confidence_label=conf.label,
        confidence_breakdown=[b.model_dump() for b in conf.breakdown],
        validated=bool(evidence_rows) and not any(e.get("not_yet_validated") for e in evidence_rows),
    )


def _pick_primary_statement(statements: list[StatementIntel]) -> StatementIntel | None:
    if not statements:
        return None
    # Prefer aggregation / structural claims, then highest confidence
    def rank(s: StatementIntel) -> tuple:
        topic = (s.topic or "").lower()
        text = s.statement.lower()
        prefer = 0
        if "aggregat" in topic or "aggregat" in text:
            prefer = 3
        elif "misfold" in topic or "misfold" in text:
            prefer = 2
        elif "structur" in topic or "structur" in text:
            prefer = 1
        return (prefer, s.confidence_score)

    return sorted(statements, key=rank, reverse=True)[0]


def _review_question(variant: str | None, statement: StatementIntel | None) -> str | None:
    if statement and "aggregat" in statement.statement.lower() and variant:
        return f"Does {variant} increase aggregation?"
    if statement:
        return f"What evidence supports: {statement.statement[:80]}?"
    if variant:
        return f"What is known about {variant}?"
    return None


def _infer_gaps(protein: ProteinIntelligence) -> list[str]:
    gaps: list[str] = []
    if not protein.experiments:
        gaps.append("No linked experiments in the graph yet — Continuous Learning layer is empty.")
    if not protein.biomarkers:
        gaps.append("No disease biomarkers linked for this protein context in the current graph.")
    mix_all = _empty_mix()
    for m in protein.mutations:
        for k, v in m.evidence_mix.items():
            mix_all[k] = mix_all[k] or v
    if not mix_all.get("clinical"):
        gaps.append("No clinical evidence modality indexed for this protein's claims.")
    if protein.uniprot_id == "P07737":
        gaps.append("No validated PFN1-specific biomarker (e.g. conformational / oligomer assay) in graph.")
        gaps.append("No indexed evidence that G118V specifically elevates NfL vs other ALS drivers.")
    if not any(s.confidence_score >= 75 for s in protein.statements):
        gaps.append("No high-confidence statements yet — ingest deeper claim evidence or expand fixtures.")
    return gaps


def build_protein_intelligence(uniprot_id: str) -> ProteinIntelligence | None:
    """
    Disease Intelligence for one protein.

    Graph → mutations → causal paths → claims → evidence → confidence.
    """
    uid = uniprot_id.strip().upper()
    protein = get_protein(uid)
    if not protein:
        return None

    gene = (protein.get("gene") or {}).get("symbol") or protein.get("symbol")
    mutation_packs = fetch_mutation_statements(uid)
    mechanisms = [
        MechanismIntel(**m) for m in fetch_protein_mechanisms(uid) if m.get("id")
    ]

    mutations: list[MutationIntel] = []
    all_statements: list[StatementIntel] = []
    paper_ids: set[str] = set()

    for pack in mutation_packs:
        mkey = pack["mutation_key"]
        if not mkey:
            continue
        path = get_mutation_path(mkey) or {}
        chain = [
            step.get("name") or step.get("id")
            for step in (path.get("causal_chain") or [])
            if step.get("name") or step.get("id")
        ]
        claim_groups = _group_claim_rows(pack.get("rows") or [])
        statements = [
            _statement_from_claim(claim=c, mutation_key=mkey) for c in claim_groups if c.get("claim_id")
        ]
        all_statements.extend(statements)
        primary = _pick_primary_statement(statements)

        all_ev: list[dict[str, Any]] = []
        for c in claim_groups:
            all_ev.extend(c.get("evidence") or [])
        for e in all_ev:
            if e.get("paper_id"):
                paper_ids.add(e["paper_id"])

        variant = _variant_from_key(mkey, pack.get("hgvs_p"))
        mix = _evidence_mix(all_ev)
        # Roll up confidence from primary statement, else best statement
        best = primary or (max(statements, key=lambda s: s.confidence_score) if statements else None)

        mutations.append(
            MutationIntel(
                key=mkey,
                variant=variant,
                hgvs_p=pack.get("hgvs_p"),
                significance=pack.get("significance") or (path.get("mutation") or {}).get("significance"),
                gene=gene,
                protein_symbol=protein.get("symbol"),
                protein_name=protein.get("name"),
                uniprot_id=uid,
                disease_association=pack.get("significance")
                or (path.get("mutation") or {}).get("description")
                or "Linked in program graph",
                mechanism_path=chain,
                clinvar=path.get("clinvar_assertions") or [],
                statements=statements,
                evidence_mix=mix,
                paper_count=len({e.get("paper_id") for e in all_ev if e.get("paper_id")}),
                confidence_score=best.confidence_score if best else None,
                confidence_label=best.confidence_label if best else None,
                primary_statement=best.statement if best else None,
                review_question=_review_question(variant, best),
                dossier_href=f"/proteins/{uid}",
            )
        )

    # Disease-context objects (ALS biomarkers / drugs / trials)
    disease = get_disease("als") or {}
    biomarkers = [
        BiomarkerIntel(
            id=b.get("id") or "",
            name=b.get("name"),
            description=b.get("description"),
            role=b.get("role") or b.get("description"),
            specificity_note=(
                "Disease / injury context marker — not automatically protein- or mutation-specific."
            ),
        )
        for b in (disease.get("biomarkers") or [])
        if b and b.get("id")
    ]

    papers = [
        {k: p.get(k) for k in ("id", "title", "year", "url", "pmid", "doi") if p.get(k)}
        for p in (protein.get("publications") or [])
        if p and p.get("id")
    ]
    # Merge evidence paper ids missing from protein MENTIONED_IN
    known = {p["id"] for p in papers}
    for pid in paper_ids:
        if pid not in known:
            papers.append({"id": pid})

    intel = ProteinIntelligence(
        uniprot_id=uid,
        symbol=protein.get("symbol"),
        name=protein.get("name"),
        gene=gene,
        function=protein.get("function"),
        mutations=mutations,
        statements=all_statements,
        mechanisms=mechanisms,
        pathways=protein.get("pathways") or [],
        papers=papers,
        structures=protein.get("structures") or [],
        interaction_partners=protein.get("interaction_partners") or [],
        biomarkers=biomarkers,
        drugs=disease.get("drugs") or [],
        drug_programs=protein.get("drug_programs") or disease.get("drug_programs") or [],
        clinical_trials=disease.get("clinical_trials") or [],
        experiments=protein.get("experiments") or [],
    )
    intel.gaps = _infer_gaps(intel)
    return intel


def build_disease_intelligence(
    slug: str,
    *,
    focus_uniprot_ids: tuple[str, ...] | None = None,
) -> DiseaseIntelligence | None:
    """Disease-level intelligence: catalog + deep dossiers for focus proteins."""
    disease = get_disease(slug)
    if not disease:
        return None

    focus = focus_uniprot_ids
    if focus is None and slug == "als":
        focus = ALS_FOCUS
    focus = focus or ()

    focus_proteins: list[ProteinIntelligence] = []
    for uid in focus:
        pi = build_protein_intelligence(uid)
        if pi:
            focus_proteins.append(pi)

    biomarkers = [
        BiomarkerIntel(
            id=b.get("id") or "",
            name=b.get("name"),
            description=b.get("description"),
            role=b.get("role") or b.get("description"),
            specificity_note="Disease-level biomarker — interpret with clinical context.",
        )
        for b in (disease.get("biomarkers") or [])
        if b and b.get("id")
    ]

    gaps = [
        "Experiments node set is empty — Simulation Manager / Learning services not wired.",
        "Therapeutic opportunities still partially curated outside live drug–target edges.",
    ]
    for fp in focus_proteins:
        gaps.extend(fp.gaps)

    # de-dupe gaps preserving order
    seen: set[str] = set()
    unique_gaps: list[str] = []
    for g in gaps:
        if g not in seen:
            seen.add(g)
            unique_gaps.append(g)

    return DiseaseIntelligence(
        slug=slug,
        name=disease.get("name"),
        synopsis=disease.get("synopsis"),
        proteins=[
            p
            for p in (disease.get("proteins") or [])
            if p and p.get("uniprot_id")
        ],
        focus_proteins=focus_proteins,
        biomarkers=biomarkers,
        drugs=disease.get("drugs") or [],
        drug_programs=disease.get("drug_programs") or [],
        clinical_trials=disease.get("clinical_trials") or [],
        publications=disease.get("publications") or [],
        mutations_index=disease.get("mutations") or [],
        gaps=unique_gaps,
    )
