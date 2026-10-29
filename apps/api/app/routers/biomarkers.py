"""Disease biomarker catalog from the knowledge graph."""

from fastapi import APIRouter, HTTPException

from rockgen_graph import queries

router = APIRouter(tags=["biomarkers"])


@router.get("/diseases/{slug}/biomarkers")
def disease_biomarkers(slug: str) -> dict:
    if not queries.get_disease(slug):
        raise HTTPException(status_code=404, detail="Disease not found in knowledge graph")
    return {"slug": slug, "biomarkers": queries.list_biomarkers(slug)}
