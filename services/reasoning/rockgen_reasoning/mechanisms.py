"""Disease Mechanism Engine — similarity, maps, opportunities, cross-protein reports.

Mechanism-centric scoring (not disease probability).
"""

from __future__ import annotations

from typing import Any

LEVEL_SCORE = {"high": 3, "medium": 2, "low": 1, "none": 0}

# Display axes for similarity matrices (scientist-facing)
MATRIX_MECHANISMS = [
    ("aggregation", "Aggregation"),
    ("cytoskeleton_disruption", "Cytoskeleton"),
    ("microtubule_instability", "Microtubule"),
    ("rna_metabolism", "RNA metabolism"),
    ("axonal_transport", "Axonal transport"),
    ("stress_granules", "Stress granules"),
    ("autophagy_lysosome", "Autophagy / clearance"),
    ("neuroinflammation", "Neuroinflammation"),
    ("mitochondrial_dysfunction", "Mitochondria"),
]

# Curated fallback if graph is empty (mirrors seed IMPLICATED_IN)
CURATED_MATRIX: dict[str, dict[str, str]] = {
    "P07737": {  # PFN1
        "aggregation": "high",
        "cytoskeleton_disruption": "high",
        "microtubule_instability": "low",
        "rna_metabolism": "low",
        "axonal_transport": "medium",
        "stress_granules": "low",
        "autophagy_lysosome": "low",
        "neuroinflammation": "low",
        "mitochondrial_dysfunction": "low",
        "misfolding": "high",
        "motor_neuron_death": "high",
    },
    "P68366": {  # TUBA4A
        "aggregation": "medium",
        "cytoskeleton_disruption": "high",
        "microtubule_instability": "high",
        "rna_metabolism": "low",
        "axonal_transport": "high",
        "stress_granules": "low",
        "autophagy_lysosome": "low",
        "neuroinflammation": "low",
        "mitochondrial_dysfunction": "low",
        "misfolding": "low",
        "motor_neuron_death": "high",
    },
    "P00441": {  # SOD1
        "aggregation": "high",
        "cytoskeleton_disruption": "low",
        "microtubule_instability": "low",
        "rna_metabolism": "low",
        "axonal_transport": "medium",
        "stress_granules": "low",
        "autophagy_lysosome": "medium",
        "neuroinflammation": "low",
        "mitochondrial_dysfunction": "medium",
        "misfolding": "high",
        "motor_neuron_death": "high",
    },
    "P35637": {  # FUS
        "aggregation": "high",
        "cytoskeleton_disruption": "low",
        "microtubule_instability": "low",
        "rna_metabolism": "high",
        "axonal_transport": "medium",
        "stress_granules": "high",
        "autophagy_lysosome": "low",
        "neuroinflammation": "low",
        "mitochondrial_dysfunction": "low",
        "misfolding": "medium",
        "motor_neuron_death": "high",
    },
    "Q13148": {  # TARDBP / TDP-43
        "aggregation": "high",
        "cytoskeleton_disruption": "low",
        "microtubule_instability": "low",
        "rna_metabolism": "high",
        "axonal_transport": "medium",
        "stress_granules": "high",
        "autophagy_lysosome": "low",
        "neuroinflammation": "low",
        "mitochondrial_dysfunction": "low",
        "misfolding": "medium",
        "motor_neuron_death": "high",
    },
    "Q96CV9": {  # OPTN
        "aggregation": "medium",
        "cytoskeleton_disruption": "low",
        "microtubule_instability": "low",
        "rna_metabolism": "low",
        "axonal_transport": "low",
        "stress_granules": "low",
        "autophagy_lysosome": "medium",
        "neuroinflammation": "medium",
        "mitochondrial_dysfunction": "low",
        "misfolding": "low",
        "motor_neuron_death": "high",
    },
    "Q9UHD2": {  # TBK1
        "aggregation": "low",
        "cytoskeleton_disruption": "low",
        "microtubule_instability": "low",
        "rna_metabolism": "low",
        "axonal_transport": "low",
        "stress_granules": "low",
        "autophagy_lysosome": "medium",
        "neuroinflammation": "high",
        "mitochondrial_dysfunction": "low",
        "misfolding": "low",
        "motor_neuron_death": "high",
    },
    "Q9UHD9": {  # UBQLN2
        "aggregation": "high",
        "cytoskeleton_disruption": "low",
        "microtubule_instability": "low",
        "rna_metabolism": "low",
        "axonal_transport": "low",
        "stress_granules": "low",
        "autophagy_lysosome": "high",
        "neuroinflammation": "low",
        "mitochondrial_dysfunction": "low",
        "misfolding": "medium",
        "motor_neuron_death": "high",
    },
}

PROTEIN_META: dict[str, dict[str, str]] = {
    "P07737": {"symbol": "PFN1", "name": "Profilin-1"},
    "P68366": {"symbol": "TUBA4A", "name": "Tubulin alpha-4A"},
    "P00441": {"symbol": "SOD1", "name": "Superoxide dismutase 1"},
    "P35637": {"symbol": "FUS", "name": "RNA-binding protein FUS"},
    "Q13148": {"symbol": "TARDBP", "name": "TDP-43"},
    "Q96CV9": {"symbol": "OPTN", "name": "Optineurin"},
    "Q9UHD2": {"symbol": "TBK1", "name": "TBK1"},
    "Q9UHD9": {"symbol": "UBQLN2", "name": "Ubiquilin-2"},
}

PROTEIN_PATHWAYS: dict[str, list[str]] = {
    "P07737": ["PFN1", "Actin", "Rho / cytoskeleton signaling", "Cytoskeleton disruption", "Motor neuron injury"],
    "P68366": ["TUBA4A", "Microtubule polymer", "Axonal transport", "Transport defects", "Motor neuron injury"],
}

AXIS_DEFS = [
    {"id": "cytoskeleton", "name": "Cytoskeleton", "mechanism_ids": ["cytoskeleton_disruption", "microtubule_instability"]},
    {"id": "rna_metabolism", "name": "RNA metabolism", "mechanism_ids": ["rna_metabolism", "stress_granules"]},
    {"id": "protein_homeostasis", "name": "Protein homeostasis", "mechanism_ids": ["aggregation", "misfolding", "autophagy_lysosome"]},
    {"id": "axonal_transport", "name": "Axonal transport", "mechanism_ids": ["axonal_transport"]},
    {"id": "mitochondria", "name": "Mitochondria", "mechanism_ids": ["mitochondrial_dysfunction"]},
    {"id": "neuroinflammation", "name": "Neuroinflammation", "mechanism_ids": ["neuroinflammation"]},
]


def _level(matrix: dict[str, str], mid: str) -> str:
    return matrix.get(mid, "none")


def _vec(matrix: dict[str, str], keys: list[str] | None = None) -> list[int]:
    keys = keys or [m[0] for m in MATRIX_MECHANISMS]
    return [LEVEL_SCORE.get(_level(matrix, k), 0) for k in keys]


def cosine_similarity(a: list[int], b: list[int]) -> float:
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = sum(x * x for x in a) ** 0.5
    nb = sum(y * y for y in b) ** 0.5
    if na == 0 or nb == 0:
        return 0.0
    return round(dot / (na * nb), 3)


def load_matrix_from_graph() -> dict[str, dict[str, str]] | None:
    try:
        from rockgen_graph.client import get_driver
    except Exception:  # noqa: BLE001
        return None
    try:
        driver = get_driver()
        with driver.session() as session:
            rows = session.run(
                """
                MATCH (p:Protein)-[r:IMPLICATED_IN]->(m:Mechanism)
                RETURN p.uniprot_id AS uid, m.id AS mid, r.level AS level
                """
            )
            out: dict[str, dict[str, str]] = {}
            for rec in rows:
                uid = rec["uid"]
                if not uid:
                    continue
                out.setdefault(uid, {})
                out[uid][rec["mid"]] = (rec["level"] or "medium").lower()
            return out or None
    except Exception:  # noqa: BLE001
        return None


def get_mechanism_matrix() -> dict[str, dict[str, str]]:
    graph = load_matrix_from_graph()
    if graph:
        # Merge curated for any missing panel proteins
        merged = {**CURATED_MATRIX}
        for uid, levels in graph.items():
            merged[uid] = {**merged.get(uid, {}), **levels}
        return merged
    return dict(CURATED_MATRIX)


def protein_mechanism_profile(uniprot_id: str) -> dict[str, Any]:
    matrix = get_mechanism_matrix()
    levels = matrix.get(uniprot_id) or CURATED_MATRIX.get(uniprot_id) or {}
    meta = PROTEIN_META.get(uniprot_id, {"symbol": uniprot_id, "name": uniprot_id})
    return {
        "uniprot_id": uniprot_id,
        "symbol": meta["symbol"],
        "name": meta["name"],
        "levels": levels,
        "pathway_chain": PROTEIN_PATHWAYS.get(uniprot_id, [meta["symbol"], "…", "Motor neuron injury"]),
        "display": [
            {"mechanism_id": mid, "label": label, "level": _level(levels, mid)}
            for mid, label in MATRIX_MECHANISMS
        ],
    }


def mechanism_similarity(a_id: str, b_id: str) -> dict[str, Any]:
    matrix = get_mechanism_matrix()
    a = matrix.get(a_id) or CURATED_MATRIX.get(a_id, {})
    b = matrix.get(b_id) or CURATED_MATRIX.get(b_id, {})
    keys = [m[0] for m in MATRIX_MECHANISMS]
    score = cosine_similarity(_vec(a, keys), _vec(b, keys))
    shared_high = [
        mid
        for mid in keys
        if LEVEL_SCORE.get(_level(a, mid), 0) >= 2 and LEVEL_SCORE.get(_level(b, mid), 0) >= 2
    ]
    diverge = []
    for mid, label in MATRIX_MECHANISMS:
        la, lb = _level(a, mid), _level(b, mid)
        if abs(LEVEL_SCORE.get(la, 0) - LEVEL_SCORE.get(lb, 0)) >= 2:
            diverge.append({"mechanism_id": mid, "label": label, "a": la, "b": lb})
    ma = PROTEIN_META.get(a_id, {"symbol": a_id})
    mb = PROTEIN_META.get(b_id, {"symbol": b_id})
    return {
        "a": {"uniprot_id": a_id, "symbol": ma["symbol"]},
        "b": {"uniprot_id": b_id, "symbol": mb["symbol"]},
        "similarity": score,
        "shared_medium_or_high": shared_high,
        "divergences": diverge,
        "explanation": (
            f"{ma['symbol']} and {mb['symbol']} share elevated involvement in "
            f"{', '.join(shared_high) or 'few overlapping axes'}; "
            f"cosine similarity over mechanism levels = {score}."
        ),
        "disclaimer": "Mechanism Similarity Scores are biology-axis indices — not clinical risk.",
    }


def build_disease_map(slug: str = "als") -> dict[str, Any]:
    matrix = get_mechanism_matrix()
    axes = []
    for ax in AXIS_DEFS:
        proteins = []
        for uid, levels in matrix.items():
            best = max((LEVEL_SCORE.get(_level(levels, mid), 0) for mid in ax["mechanism_ids"]), default=0)
            if best >= 2:
                meta = PROTEIN_META.get(uid, {"symbol": uid, "name": uid})
                proteins.append(
                    {
                        "uniprot_id": uid,
                        "symbol": meta["symbol"],
                        "name": meta["name"],
                        "max_level": {3: "high", 2: "medium", 1: "low"}.get(best, "none"),
                        "href": f"/proteins/{uid}",
                    }
                )
        proteins.sort(key=lambda p: ({"high": 0, "medium": 1, "low": 2}.get(p["max_level"], 9), p["symbol"]))
        axes.append({**ax, "proteins": proteins})
    return {
        "disease_slug": slug,
        "title": "ALS Disease Map",
        "axes": axes,
        "panel_note": (
            "PFN1 and TUBA4A are full-depth program proteins; "
            "SOD1, FUS, TARDBP, OPTN, TBK1, UBQLN2 are curated mechanism profiles."
        ),
    }


def build_similarity_matrix() -> dict[str, Any]:
    matrix = get_mechanism_matrix()
    proteins = []
    for uid in PROTEIN_META:
        levels = matrix.get(uid) or CURATED_MATRIX.get(uid, {})
        meta = PROTEIN_META[uid]
        proteins.append(
            {
                "uniprot_id": uid,
                "symbol": meta["symbol"],
                "levels": {mid: _level(levels, mid) for mid, _ in MATRIX_MECHANISMS},
            }
        )
    return {
        "mechanisms": [{"id": mid, "label": label} for mid, label in MATRIX_MECHANISMS],
        "proteins": proteins,
        "disclaimer": "Levels are curated or graph-backed IMPLICATED_IN strengths.",
    }


def compare_proteins(ids: list[str]) -> dict[str, Any]:
    if len(ids) < 2:
        ids = ["P07737", "P68366"]
    a_id, b_id = ids[0], ids[1]
    a = protein_mechanism_profile(a_id)
    b = protein_mechanism_profile(b_id)
    sim = mechanism_similarity(a_id, b_id)
    a_levels, b_levels = a["levels"], b["levels"]
    all_mids = sorted(set(a_levels) | set(b_levels) | {m[0] for m in MATRIX_MECHANISMS})
    shared = [
        mid
        for mid in all_mids
        if LEVEL_SCORE.get(_level(a_levels, mid), 0) >= 2 and LEVEL_SCORE.get(_level(b_levels, mid), 0) >= 2
    ]
    unique_a = [
        mid
        for mid in all_mids
        if LEVEL_SCORE.get(_level(a_levels, mid), 0) >= 2 and LEVEL_SCORE.get(_level(b_levels, mid), 0) <= 1
    ]
    unique_b = [
        mid
        for mid in all_mids
        if LEVEL_SCORE.get(_level(b_levels, mid), 0) >= 2 and LEVEL_SCORE.get(_level(a_levels, mid), 0) <= 1
    ]
    return {
        "proteins": [a, b],
        "similarity": sim,
        "shared_mechanisms": shared,
        "unique_to_a": unique_a,
        "unique_to_b": unique_b,
        "shared_pathways_note": "Both converge on motor neuron injury / ALS clinical phenotype.",
        "shared_biomarkers": [
            {
                "id": "nfl-serum",
                "name": "Serum Neurofilament Light Chain (NfL)",
                "note": "Shared disease-progression marker; not protein-specific.",
            }
        ],
        "research_gaps": [
            f"Limited head-to-head experimental comparison of {a['symbol']} vs {b['symbol']}",
            "No shared protein-specific biomarker of target engagement",
            "Pathway overlap quantified from curated levels — expand with live pathway enrichment later",
        ],
        "pathway_chains": {
            a_id: a["pathway_chain"],
            b_id: b["pathway_chain"],
        },
    }


def therapeutic_opportunities(slug: str = "als") -> dict[str, Any]:
    matrix = get_mechanism_matrix()
    # Mechanism → proteins with ≥ medium
    buckets: dict[str, list[dict[str, str]]] = {}
    for mid, label in MATRIX_MECHANISMS + [("misfolding", "Misfolding")]:
        supporters = []
        for uid, levels in matrix.items():
            lv = _level(levels, mid)
            if LEVEL_SCORE.get(lv, 0) >= 2:
                meta = PROTEIN_META.get(uid, {"symbol": uid})
                supporters.append({"uniprot_id": uid, "symbol": meta["symbol"], "level": lv})
        if supporters:
            buckets[mid] = supporters

    opportunities = []
    for mid, supporters in buckets.items():
        label = next((l for i, l in MATRIX_MECHANISMS if i == mid), mid.replace("_", " ").title())
        n = len(supporters)
        highs = sum(1 for s in supporters if s["level"] == "high")
        # Rule-based priority
        priority_score = n * 12 + highs * 8
        if mid in {"aggregation", "cytoskeleton_disruption", "axonal_transport"}:
            priority_score += 15  # ALS-relevant axis boost
        if mid in {"rna_metabolism"} and n >= 2:
            priority_score += 10
        if priority_score >= 55:
            priority = "High"
            evidence = "Strong" if highs >= 2 else "Moderate"
        elif priority_score >= 35:
            priority = "Medium"
            evidence = "Moderate" if highs >= 1 else "Emerging"
        else:
            priority = "Low"
            evidence = "Emerging"
        opportunities.append(
            {
                "mechanism_id": mid,
                "mechanism": label,
                "supporting_proteins": supporters,
                "protein_count": n,
                "evidence": evidence,
                "priority": priority,
                "priority_score": priority_score,
                "rationale": (
                    f"{n} ALS panel protein(s) implicated at medium/high; "
                    f"{highs} at high strength."
                ),
            }
        )
    opportunities.sort(key=lambda o: (-o["priority_score"], o["mechanism"]))
    return {
        "disease_slug": slug,
        "title": "Therapeutic opportunity ranking",
        "disclaimer": (
            "Ranks biological mechanisms as intervention hypotheses — "
            "does not propose molecules or clinical treatments."
        ),
        "opportunities": opportunities,
    }


def build_disease_mechanism_report(a_id: str = "P07737", b_id: str = "P68366") -> dict[str, Any]:
    # Prefer the prioritization-grade report for the PFN1 vs TUBA4A pair
    if {a_id.upper(), b_id.upper()} == {"P07737", "P68366"}:
        from rockgen_reasoning.als_prioritization import build_enhanced_mechanism_report

        return build_enhanced_mechanism_report()

    cmp = compare_proteins([a_id, b_id])
    opps = therapeutic_opportunities()
    a, b = cmp["proteins"]
    md = render_mechanism_report_markdown(cmp, opps)
    return {
        "title": f"Disease Mechanism Report: {a['symbol']} vs {b['symbol']}",
        "comparison": cmp,
        "opportunities": [
            o
            for o in opps["opportunities"]
            if any(s["uniprot_id"] in {a_id, b_id} for s in o["supporting_proteins"])
        ][:8],
        "markdown": md,
    }


def render_mechanism_report_markdown(cmp: dict[str, Any], opps: dict[str, Any]) -> str:
    a, b = cmp["proteins"]
    lines = [
        f"# Disease Mechanism Report: {a['symbol']} vs {b['symbol']}",
        "",
        "> Mechanism-centric synthesis — not a clinical treatment recommendation.",
        "",
        "## Shared mechanisms",
        "",
    ]
    for mid in cmp["shared_mechanisms"]:
        lines.append(f"- `{mid}`")
    lines += ["", f"## Unique to {a['symbol']}", ""]
    for mid in cmp["unique_to_a"]:
        lines.append(f"- `{mid}`")
    lines += ["", f"## Unique to {b['symbol']}", ""]
    for mid in cmp["unique_to_b"]:
        lines.append(f"- `{mid}`")
    lines += [
        "",
        "## Pathway chains",
        "",
        f"- **{a['symbol']}:** " + " → ".join(a["pathway_chain"]),
        f"- **{b['symbol']}:** " + " → ".join(b["pathway_chain"]),
        "",
        "## Shared biomarkers",
        "",
    ]
    for bm in cmp["shared_biomarkers"]:
        lines.append(f"- **{bm['name']}** — {bm['note']}")
    lines += ["", "## Research gaps", ""]
    for g in cmp["research_gaps"]:
        lines.append(f"- {g}")
    lines += ["", "## Potential common therapeutic opportunities", ""]
    for o in opps["opportunities"][:6]:
        if any(s["uniprot_id"] in {a["uniprot_id"], b["uniprot_id"]} for s in o["supporting_proteins"]):
            syms = ", ".join(s["symbol"] for s in o["supporting_proteins"])
            lines.append(
                f"- **{o['mechanism']}** — proteins: {syms}; evidence {o['evidence']}; priority {o['priority']}"
            )
    sim = cmp["similarity"]
    lines += [
        "",
        "## Similarity",
        "",
        f"Score: **{sim['similarity']}** — {sim['explanation']}",
        "",
        "---",
        "*Generated by RockGen Disease Mechanism Engine.*",
        "",
    ]
    return "\n".join(lines)
