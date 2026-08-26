from fastapi import APIRouter, HTTPException

from rockgen_graph import queries

router = APIRouter(tags=["evidence"])


@router.get("/proteins/{uniprot_id}/evidence")
def protein_evidence(uniprot_id: str) -> dict:
    data = queries.get_protein_evidence(uniprot_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Protein '{uniprot_id}' not found")
    return data


@router.get("/claims")
def list_claims(uniprot_id: str = "P07737") -> list:
    return queries.get_claim_matrix(uniprot_id)
