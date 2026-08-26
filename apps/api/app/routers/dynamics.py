"""Protein Dynamics Engine HTTP surface."""

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import PlainTextResponse

from rockgen_simulations import compare_pfn1_wt_g118v

router = APIRouter(prefix="/dynamics", tags=["dynamics"])


@router.get("/pfn1/g118v")
def pfn1_g118v_dynamics(
    format: str = Query("json"),
    samples: int = Query(400, ge=50, le=2000),
):
    """PFN1 WT vs G118V dynamics comparison PoC."""
    report = compare_pfn1_wt_g118v(n_samples=samples)
    if format in {"markdown", "md"}:
        return PlainTextResponse(
            report["markdown"],
            media_type="text/markdown; charset=utf-8",
            headers={
                "Content-Disposition": 'attachment; filename="PFN1-G118V-dynamics-report.md"'
            },
        )
    return report


@router.get("/proteins/{uniprot_id}/mutations/{variant}")
def protein_mutation_dynamics(uniprot_id: str, variant: str, format: str = Query("json")):
    if uniprot_id.upper() == "P07737" and variant.upper().replace(" ", "") in {"G118V", "P.GLY118VAL"}:
        return pfn1_g118v_dynamics(format=format)
    raise HTTPException(
        status_code=404,
        detail="Dynamics PoC currently ships PFN1 G118V only — more mutants after OpenMM backend",
    )
