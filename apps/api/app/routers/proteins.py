from fastapi import APIRouter, HTTPException

from rockgen_graph import queries

router = APIRouter(prefix="/proteins", tags=["proteins"])


@router.get("/{uniprot_id}")
def get_protein(uniprot_id: str) -> dict:
    protein = queries.get_protein(uniprot_id)
    if not protein:
        raise HTTPException(status_code=404, detail=f"Protein '{uniprot_id}' not found")
    return protein
