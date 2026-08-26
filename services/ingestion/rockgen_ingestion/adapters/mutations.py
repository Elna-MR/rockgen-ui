"""ClinVar adapter via NCBI E-utilities — human genetic assertions only."""

from __future__ import annotations

import xml.etree.ElementTree as ET

import httpx

STATUS = "phase-1"


def fetch_clinvar_for_gene(gene_symbol: str, retmax: int = 40) -> list[dict]:
    """Search ClinVar for a gene and parse variation summaries."""
    base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    with httpx.Client(timeout=60.0) as client:
        search = client.get(
            f"{base}/esearch.fcgi",
            params={
                "db": "clinvar",
                "term": f"{gene_symbol}[gene]",
                "retmax": retmax,
                "retmode": "json",
            },
        )
        search.raise_for_status()
        ids = (search.json().get("esearchresult") or {}).get("idlist") or []
        if not ids:
            return []

        summary = client.get(
            f"{base}/esummary.fcgi",
            params={"db": "clinvar", "id": ",".join(ids), "retmode": "json"},
        )
        summary.raise_for_status()
        result = summary.json().get("result") or {}

        assertions: list[dict] = []
        for uid in ids:
            item = result.get(uid) or {}
            title = item.get("title") or ""
            # Try to extract protein change like Gly118Val / G118V
            protein_change = item.get("protein_change") or _extract_protein_change(title)
            clinical = None
            germline = item.get("germline_classification") or {}
            if isinstance(germline, dict):
                clinical = germline.get("description")
            elif isinstance(item.get("clinical_significance"), dict):
                clinical = (item.get("clinical_significance") or {}).get("description")
            conditions: list[str] = []
            for trait in item.get("trait_set") or []:
                if isinstance(trait, dict) and trait.get("trait_name"):
                    conditions.append(trait["trait_name"])
            review = None
            if isinstance(germline, dict):
                review = germline.get("last_evaluated") or germline.get("review_status")

            assertions.append(
                {
                    "clinvar_id": str(uid),
                    "title": title,
                    "protein_change": protein_change,
                    "clinical_significance": clinical,
                    "conditions": conditions,
                    "review_status": review,
                    "gene_symbol": gene_symbol,
                    "url": f"https://www.ncbi.nlm.nih.gov/clinvar/variation/{uid}/",
                    "source_system": "clinvar",
                    "source_url": f"https://www.ncbi.nlm.nih.gov/clinvar/variation/{uid}/",
                }
            )
        return assertions


def _extract_protein_change(title: str) -> str | None:
    import re

    m = re.search(r"\(p\.([A-Za-z]+[0-9]+[A-Za-z]+)\)", title)
    if m:
        return f"p.{m.group(1)}"
    m = re.search(r"\b([A-Z]\d+[A-Z])\b", title)
    if m:
        return m.group(1)
    return None


# Silence unused import warning for ET if unused — keep for future XML parse
_ = ET
