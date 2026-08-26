"""Europe PMC literature adapter."""

from __future__ import annotations

import httpx

STATUS = "phase-1"

PFN1_QUERIES = [
    ("pfn1_als", "PFN1 AND ALS"),
    ("pfn1_g118v", 'PFN1 AND "G118V"'),
    ("pfn1_c71g", 'PFN1 AND ("C71G" OR "Cys71Gly" OR "p.Cys71Gly")'),
    ("pfn1_t109m", 'PFN1 AND ("T109M" OR "Thr109Met" OR "p.Thr109Met")'),
    ("pfn1_aggregation", "PFN1 AND aggregation"),
    ("pfn1_md", 'PFN1 AND ("molecular dynamics" OR biophysical)'),
]

TUBA4A_QUERIES = [
    ("tuba4a_als", "TUBA4A AND ALS"),
    ("tuba4a_mt", 'TUBA4A AND (microtubule OR tubulin)'),
    ("tuba4a_transport", 'TUBA4A AND ("axonal transport" OR axon)'),
    ("tuba4a_r320c", 'TUBA4A AND ("R320C" OR "Arg320Cys" OR "p.Arg320Cys")'),
]

# Backward-compatible alias
DEFAULT_QUERIES = PFN1_QUERIES


def fetch_europe_pmc(query: str, page_size: int = 10, query_tag: str = "") -> list[dict]:
    url = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
    params = {
        "query": query,
        "format": "json",
        "pageSize": page_size,
        "resultType": "core",
    }
    with httpx.Client(timeout=45.0) as client:
        response = client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    results = ((data.get("resultList") or {}).get("result")) or []
    papers: list[dict] = []
    for item in results:
        pmid = item.get("pmid") or item.get("id")
        if not pmid:
            continue
        doi = item.get("doi")
        authors = item.get("authorString")
        year = item.get("pubYear")
        papers.append(
            {
                "id": f"pmid:{pmid}",
                "pmid": str(pmid),
                "doi": doi,
                "title": item.get("title"),
                "abstract": item.get("abstractText") or item.get("abstract") or "",
                "authors": authors,
                "year": int(year) if year and str(year).isdigit() else None,
                "journal": item.get("journalTitle"),
                "url": f"https://europepmc.org/article/MED/{pmid}",
                "query_tag": query_tag,
                "source_system": "europe_pmc",
                "source_url": f"https://europepmc.org/article/MED/{pmid}",
            }
        )
    return papers


def fetch_literature(queries: list[tuple[str, str]], per_query: int = 8) -> list[dict]:
    seen: set[str] = set()
    out: list[dict] = []
    for tag, query in queries:
        for paper in fetch_europe_pmc(query, page_size=per_query, query_tag=tag):
            if paper["id"] in seen:
                existing = next(p for p in out if p["id"] == paper["id"])
                tags = set((existing.get("query_tags") or [existing.get("query_tag")]) + [tag])
                existing["query_tags"] = sorted(t for t in tags if t)
                continue
            seen.add(paper["id"])
            paper["query_tags"] = [tag]
            out.append(paper)
    return out


def fetch_pfn1_literature(per_query: int = 8) -> list[dict]:
    return fetch_literature(PFN1_QUERIES, per_query=per_query)


def fetch_tuba4a_literature(per_query: int = 8) -> list[dict]:
    return fetch_literature(TUBA4A_QUERIES, per_query=per_query)
