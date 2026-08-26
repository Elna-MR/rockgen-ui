"""Disease Mechanism Intelligence API routes."""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import PlainTextResponse

from rockgen_reasoning.mechanisms import (
    build_disease_map,
    build_disease_mechanism_report,
    build_similarity_matrix,
    compare_proteins,
    mechanism_similarity,
    protein_mechanism_profile,
    therapeutic_opportunities,
)
from rockgen_reasoning.als_prioritization import (
    build_prioritization_workspace,
    build_rich_opportunities,
)

router = APIRouter(tags=["mechanisms"])


@router.get("/diseases/{slug}/mechanism-map")
def disease_mechanism_map(slug: str) -> dict:
    if slug != "als":
        raise HTTPException(status_code=404, detail="Mechanism map available for ALS in Phase 3")
    return build_disease_map(slug)


@router.get("/diseases/{slug}/mechanism-matrix")
def disease_mechanism_matrix(slug: str) -> dict:
    if slug != "als":
        raise HTTPException(status_code=404, detail="Mechanism matrix available for ALS in Phase 3")
    return build_similarity_matrix()


@router.get("/diseases/{slug}/mechanism-prioritization")
def disease_mechanism_prioritization(slug: str) -> dict:
    if slug != "als":
        raise HTTPException(status_code=404, detail="Prioritization workspace available for ALS")
    return build_prioritization_workspace()


@router.get("/diseases/{slug}/proteins/compare")
def disease_protein_compare(
    slug: str,
    ids: str = Query("P07737,P68366", description="Comma-separated UniProt IDs"),
) -> dict:
    if slug != "als":
        raise HTTPException(status_code=404, detail="Cross-protein compare available for ALS")
    id_list = [x.strip() for x in ids.split(",") if x.strip()]
    return compare_proteins(id_list)


@router.get("/diseases/{slug}/therapeutic-opportunities")
def disease_therapeutic_opportunities(slug: str, rich: bool = Query(True)) -> dict:
    if slug != "als":
        raise HTTPException(status_code=404, detail="Therapeutic opportunities available for ALS")
    if rich:
        return build_rich_opportunities()
    return therapeutic_opportunities(slug)


@router.get("/diseases/{slug}/mechanism-report")
def disease_mechanism_report(
    slug: str,
    a: str = Query("P07737"),
    b: str = Query("P68366"),
    format: str = Query("json"),
):
    if slug != "als":
        raise HTTPException(status_code=404, detail="Mechanism report available for ALS")
    report = build_disease_mechanism_report(a, b)
    if format in {"markdown", "md"}:
        return PlainTextResponse(
            report["markdown"],
            media_type="text/markdown; charset=utf-8",
            headers={
                "Content-Disposition": 'attachment; filename="als-disease-mechanism-report.md"'
            },
        )
    return report


@router.get("/proteins/{uniprot_id}/mechanisms")
def protein_mechanisms(uniprot_id: str) -> dict:
    return protein_mechanism_profile(uniprot_id.upper())


@router.get("/mechanisms/similarity")
def mechanisms_similarity(
    a: str = Query(..., description="UniProt ID"),
    b: str = Query(..., description="UniProt ID"),
) -> dict:
    return mechanism_similarity(a.upper(), b.upper())
