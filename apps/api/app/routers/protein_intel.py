from fastapi import APIRouter, HTTPException
from fastapi.responses import PlainTextResponse

from rockgen_reasoning.protein_state import (
    COMPARE_KEYS_BY_PROTEIN,
    build_health_report,
    build_mutation_comparison,
)

router = APIRouter(prefix="/proteins", tags=["proteins"])


@router.get("/{uniprot_id}/compare")
def compare_mutations(uniprot_id: str) -> dict:
    uid = uniprot_id.upper()
    if uid not in COMPARE_KEYS_BY_PROTEIN:
        supported = ", ".join(sorted(COMPARE_KEYS_BY_PROTEIN))
        raise HTTPException(
            status_code=404,
            detail=f"Mutation comparison not available for '{uid}'. Supported: {supported}",
        )
    return build_mutation_comparison(uid)


@router.get("/{uniprot_id}/health-report")
def protein_health_report(uniprot_id: str, format: str = "json"):
    uid = uniprot_id.upper()
    if uid not in COMPARE_KEYS_BY_PROTEIN:
        supported = ", ".join(sorted(COMPARE_KEYS_BY_PROTEIN))
        raise HTTPException(
            status_code=404,
            detail=f"Protein Health Report not available for '{uid}'. Supported: {supported}",
        )
    report = build_health_report(uid)
    if format == "markdown" or format == "md":
        filename = f"{report['comparison']['symbol']}-protein-health-report.md"
        return PlainTextResponse(
            report["markdown"],
            media_type="text/markdown; charset=utf-8",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )
    return report
