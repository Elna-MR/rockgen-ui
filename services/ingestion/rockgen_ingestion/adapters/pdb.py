"""RCSB PDB adapter — structures linked to a UniProt accession."""

from __future__ import annotations

import httpx

STATUS = "phase-1"


def fetch_pdb_for_uniprot(uniprot_id: str, limit: int = 15) -> list[dict]:
    search_url = "https://search.rcsb.org/rcsbsearch/v2/query"
    query = {
        "query": {
            "type": "terminal",
            "service": "text",
            "parameters": {
                "attribute": "rentity.rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession",
                "operator": "exact_match",
                "value": uniprot_id,
            },
        },
        "return_type": "entry",
        "request_options": {
            "paginate": {"start": 0, "rows": limit},
            "results_content_type": ["experimental"],
        },
    }

    try:
        with httpx.Client(timeout=45.0) as client:
            search = client.post(search_url, json=query)
            # Fallback simpler query by UniProt text if advanced attribute fails
            if search.status_code >= 400 or not (search.text or "").strip():
                query = {
                    "query": {
                        "type": "terminal",
                        "service": "full_text",
                        "parameters": {"value": uniprot_id},
                    },
                    "return_type": "entry",
                    "request_options": {"paginate": {"start": 0, "rows": limit}},
                }
                search = client.post(search_url, json=query)

            if search.status_code >= 400 or not (search.text or "").strip():
                print(
                    f"  PDB warning: empty/failed search for {uniprot_id} "
                    f"(status {search.status_code})"
                )
                return []

            try:
                payload = search.json()
            except Exception as exc:  # noqa: BLE001
                print(f"  PDB warning: non-JSON search response for {uniprot_id}: {exc}")
                return []

            ids = [hit["identifier"] for hit in payload.get("result_set") or []]

            structures: list[dict] = []
            for pdb_id in ids[:limit]:
                detail = client.get(f"https://data.rcsb.org/rest/v1/core/entry/{pdb_id}")
                if detail.status_code >= 400 or not (detail.text or "").strip():
                    continue
                try:
                    data = detail.json()
                except Exception:  # noqa: BLE001
                    continue
                method = None
                methods = data.get("exptl") or []
                if methods:
                    method = methods[0].get("method")
                resolution = None
                refine = data.get("rcsb_entry_info") or {}
                if refine.get("resolution_combined"):
                    resolution = refine["resolution_combined"][0]
                elif (data.get("rcsb_entry_info") or {}).get("resolution_combined"):
                    resolution = data["rcsb_entry_info"]["resolution_combined"][0]

                ligands: list[str] = []
                for chem in data.get("rcsb_binding_affinity") or []:
                    if chem.get("comp_id"):
                        ligands.append(chem["comp_id"])
                partners: list[str] = []
                title = (data.get("struct") or {}).get("title")

                structures.append(
                    {
                        "id": pdb_id.upper(),
                        "source": "PDB",
                        "method": method or "experimental",
                        "resolution": resolution,
                        "title": title,
                        "ligands": sorted(set(ligands))[:20],
                        "partners": partners,
                        "url": f"https://www.rcsb.org/structure/{pdb_id}",
                        "source_url": f"https://data.rcsb.org/rest/v1/core/entry/{pdb_id}",
                        "source_system": "rcsb_pdb",
                    }
                )
            return structures
    except Exception as exc:  # noqa: BLE001 — network soft-fail
        print(f"  PDB warning: {exc}")
        return []
