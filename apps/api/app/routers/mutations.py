from fastapi import APIRouter, HTTPException

from rockgen_graph import queries

router = APIRouter(prefix="/mutations", tags=["mutations"])


@router.get("/{mutation_key:path}/path")
def get_mutation_path(mutation_key: str) -> dict:
    path = queries.get_mutation_path(mutation_key)
    if not path:
        raise HTTPException(status_code=404, detail=f"Mutation '{mutation_key}' not found")
    return path
