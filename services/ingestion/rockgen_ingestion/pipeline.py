"""Protein evidence intelligence ingestion pipeline (PFN1, TUBA4A, …)."""

from __future__ import annotations

import json
from pathlib import Path

from rockgen_graph.seed import seed_graph
from rockgen_ingestion.adapters.literature import (
    PFN1_QUERIES,
    TUBA4A_QUERIES,
    fetch_literature,
)
from rockgen_ingestion.adapters.mutations import fetch_clinvar_for_gene
from rockgen_ingestion.adapters.pdb import fetch_pdb_for_uniprot
from rockgen_ingestion.adapters.uniprot import fetch_uniprot
from rockgen_ingestion.claims import write_claims_and_evidence
from rockgen_ingestion.writers import write_clinvar, write_papers, write_structures, write_uniprot

CACHE = Path(__file__).resolve().parent.parent / "cache"
FIXTURES = Path(__file__).resolve().parent.parent / "fixtures"


def _cache_write(name: str, payload) -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    (CACHE / name).write_text(json.dumps(payload, indent=2, default=str))


def ingest_protein(
    *,
    uniprot_id: str,
    gene: str,
    claims_path: Path | str,
    lit_queries: list[tuple[str, str]],
    disease_slug: str = "als",
    run_seed: bool = True,
) -> dict:
    """Ensure base seed, then ingest UniProt, PDB, literature, ClinVar, claims."""
    if run_seed:
        seed_graph()
    stats: dict = {"uniprot_id": uniprot_id, "gene": gene}

    print(f"→ UniProt {uniprot_id}")
    uniprot = fetch_uniprot(uniprot_id)
    _cache_write(f"uniprot_{uniprot_id}.json", uniprot)
    write_uniprot(uniprot)
    stats["uniprot_variants"] = len(uniprot.get("variants") or [])

    print(f"→ RCSB PDB structures ({uniprot_id})")
    structures = fetch_pdb_for_uniprot(uniprot_id)
    _cache_write(f"pdb_{uniprot_id}.json", structures)
    write_structures(uniprot_id, structures)
    stats["structures"] = len(structures)

    print(f"→ Europe PMC literature ({gene})")
    papers = fetch_literature(lit_queries, per_query=8)
    _cache_write(f"europe_pmc_{gene.lower()}.json", papers)
    write_papers(papers, protein_uniprot=uniprot_id, disease_slug=disease_slug)
    stats["papers"] = len(papers)

    print(f"→ ClinVar {gene}")
    try:
        clinvar = fetch_clinvar_for_gene(gene)
    except Exception as exc:  # noqa: BLE001 — network soft-fail
        print(f"  ClinVar warning: {exc}")
        clinvar = []
    _cache_write(f"clinvar_{gene.lower()}.json", clinvar)
    write_clinvar(clinvar, gene_symbol=gene, uniprot_id=uniprot_id)
    stats["clinvar"] = len(clinvar)

    print(f"→ Curated claims ({claims_path})")
    stats["evidence"] = write_claims_and_evidence(claims_path)

    print("Ingest complete:", stats)
    return stats


def ingest_pfn1(*, use_cache: bool = False) -> dict:
    return ingest_protein(
        uniprot_id="P07737",
        gene="PFN1",
        claims_path=FIXTURES / "pfn1_claims.yaml",
        lit_queries=PFN1_QUERIES,
    )


def ingest_tuba4a(*, use_cache: bool = False) -> dict:
    return ingest_protein(
        uniprot_id="P68366",
        gene="TUBA4A",
        claims_path=FIXTURES / "tuba4a_claims.yaml",
        lit_queries=TUBA4A_QUERIES,
    )
