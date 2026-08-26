"""UniProt REST adapter — fetch full protein profile for graph writeback."""

from __future__ import annotations

import httpx


def fetch_uniprot(accession: str) -> dict:
    url = f"https://rest.uniprot.org/uniprotkb/{accession}.json"
    with httpx.Client(timeout=45.0) as client:
        response = client.get(url, headers={"Accept": "application/json"})
        response.raise_for_status()
        data = response.json()

    sequence = data.get("sequence") or {}
    genes = data.get("genes") or []
    gene_symbol = None
    if genes:
        gene_symbol = ((genes[0].get("geneName") or {}).get("value"))

    function_texts: list[str] = []
    for comment in data.get("comments") or []:
        if comment.get("commentType") == "FUNCTION":
            for text in comment.get("texts") or []:
                if text.get("value"):
                    function_texts.append(text["value"])

    xrefs: dict[str, list[str]] = {}
    for xref in data.get("uniProtKBCrossReferences") or []:
        db = xref.get("database")
        iid = xref.get("id")
        if db and iid:
            xrefs.setdefault(db, []).append(iid)

    variants: list[dict] = []
    for feature in data.get("features") or []:
        if feature.get("type") not in {"Natural variant", "Mutagenesis"}:
            continue
        loc = feature.get("location") or {}
        start = (loc.get("start") or {}).get("value")
        alt = feature.get("alternativeSequence") or {}
        original = alt.get("originalSequence") or feature.get("original")
        alts = alt.get("alternativeSequences") or []
        variation = alts[0] if alts else feature.get("variation")
        if isinstance(variation, list):
            variation = variation[0] if variation else None
        if not start or not original or not variation:
            continue
        desc = feature.get("description") or ""
        if not desc:
            for t in feature.get("descriptions") or []:
                if t.get("value"):
                    desc = t["value"]
                    break
        variants.append(
            {
                "position": int(start),
                "from_aa": original,
                "to_aa": variation,
                "description": desc,
                "feature_type": feature.get("type"),
                "feature_id": feature.get("featureId"),
            }
        )

    return {
        "uniprot_id": data.get("primaryAccession", accession),
        "uniProtkbId": data.get("uniProtkbId"),
        "organism": (data.get("organism") or {}).get("scientificName"),
        "length": sequence.get("length"),
        "sequence": sequence.get("value"),
        "protein_name": (
            ((data.get("proteinDescription") or {}).get("recommendedName") or {}).get("fullName") or {}
        ).get("value"),
        "gene_symbol": gene_symbol,
        "function": " ".join(function_texts)[:4000] if function_texts else None,
        "xrefs": xrefs,
        "variants": variants,
        "source_url": url,
        "source_system": "uniprot",
    }
