from fastapi import APIRouter, HTTPException

from rockgen_graph import queries

router = APIRouter(prefix="/diseases", tags=["diseases"])


@router.get("")
def list_diseases() -> list[dict]:
    return queries.list_diseases()


@router.get("/{slug}")
def get_disease(slug: str) -> dict:
    disease = queries.get_disease(slug)
    if not disease:
        raise HTTPException(status_code=404, detail=f"Disease '{slug}' not found")
    return disease


@router.get("/{slug}/graph")
def get_disease_graph(slug: str) -> dict:
    graph = queries.get_disease_graph(slug)
    if not graph:
        raise HTTPException(status_code=404, detail=f"Disease '{slug}' not found")
    return graph
