"""ALS mechanism prioritization — PFN1 vs TUBA4A workspace payloads.

Answers: which mechanisms are shared, unique, strongest, and which
intervention to investigate first (no molecule generation).
"""

from __future__ import annotations

from typing import Any

from rockgen_reasoning.mechanisms import LEVEL_SCORE, compare_proteins

PFN1 = "P07737"
TUBA4A = "P68366"

# Head-to-head mechanism rows for the ALS workspace (user-facing labels)
MECHANISM_COMPARE_ROWS: list[dict[str, Any]] = [
    {
        "id": "aggregation",
        "mechanism": "Protein aggregation",
        "pfn1": "high",
        "tuba4a": "medium",
        "evidence_strength": "high",
        "priority": "high",
        "claim_ids": [
            "pfn1-g118v-increases-aggregation",
            "pfn1-c71g-increases-aggregation",
        ],
        "paper_ids": ["pmid:25447202", "pmid:23334667", "pmid:25374358"],
        "evidence_href": "/diseases/als/compare#shared-aggregation",
        "note": "Strong for PFN1; moderate literature signals for mutant TUBA4A",
    },
    {
        "id": "cytoskeleton_disruption",
        "mechanism": "Cytoskeleton disruption",
        "pfn1": "high",
        "tuba4a": "high",
        "evidence_strength": "high",
        "priority": "high",
        "claim_ids": [
            "pfn1-g118v-structural-change",
            "pfn1-c71g-structural-change",
            "tuba4a-r320c-microtubule",
        ],
        "paper_ids": ["pmid:23334667", "pmid:25374358"],
        "evidence_href": "/diseases/als/compare#shared-cytoskeleton",
        "note": "Actin (PFN1) and microtubule (TUBA4A) converge on cytoskeletal failure",
    },
    {
        "id": "axonal_transport",
        "mechanism": "Axonal transport dysfunction",
        "pfn1": "medium",
        "tuba4a": "high",
        "evidence_strength": "medium",
        "priority": "high",
        "claim_ids": ["tuba4a-r320c-axonal-transport"],
        "paper_ids": ["pmid:25374358"],
        "evidence_href": "/diseases/als/compare#axonal-transport",
        "note": "Primary for TUBA4A; secondary / inferred for PFN1 cytoskeletal stress",
    },
    {
        "id": "misfolding",
        "mechanism": "Protein misfolding",
        "pfn1": "high",
        "tuba4a": "medium",
        "evidence_strength": "high",
        "priority": "high",
        "claim_ids": [
            "pfn1-g118v-misfolding",
            "pfn1-c71g-misfolding",
        ],
        "paper_ids": ["pmid:23334667", "pmid:25447202"],
        "evidence_href": "/proteins/P07737",
        "note": "PFN1 misfolding well supported; TUBA4A fold defects less fully resolved",
    },
    {
        "id": "gtp_binding",
        "mechanism": "GTP-binding disruption",
        "pfn1": "none",
        "tuba4a": "high",
        "evidence_strength": "medium",
        "priority": "medium",
        "claim_ids": ["tuba4a-r320c-microtubule"],
        "paper_ids": ["pmid:25374358"],
        "evidence_href": "/proteins/P68366",
        "note": "TUBA4A-specific tubulin / polymerization biology; not a PFN1 axis",
    },
]

SHARED_TREE = {
    "PFN1": [
        {"id": "aggregation", "label": "aggregation"},
        {"id": "actin_disruption", "label": "actin disruption"},
        {"id": "cytoskeleton_instability", "label": "cytoskeleton instability"},
    ],
    "TUBA4A": [
        {"id": "microtubule_instability", "label": "microtubule instability"},
        {"id": "gtp_binding", "label": "GTP-binding disruption"},
        {"id": "aggregation", "label": "aggregation"},
        {"id": "axonal_transport", "label": "axonal transport dysfunction"},
    ],
}

SHARED_OVERLAP = [
    "Cytoskeleton failure",
    "Protein instability",
    "Aggregation",
    "Motor-neuron transport stress",
]

# Intervention hypotheses (not molecules)
RICH_OPPORTUNITIES: list[dict[str, Any]] = [
    {
        "id": "cytoskeleton_stabilization",
        "title": "Cytoskeleton stabilization",
        "summary": "Supported by PFN1 and TUBA4A — strong cross-protein relevance",
        "priority": "High",
        "priority_rank": 1,
        "confidence": 82,
        "supporting_proteins": [
            {"uniprot_id": PFN1, "symbol": "PFN1", "level": "high"},
            {"uniprot_id": TUBA4A, "symbol": "TUBA4A", "level": "high"},
        ],
        "supporting_mutations": ["PFN1:G118V", "PFN1:C71G", "TUBA4A:R320C"],
        "evidence_types": ["in_vitro", "human_genetic", "computational"],
        "pfn1_note": "Actin / profilin cytoskeletal disruption",
        "tuba4a_note": "Microtubule instability as cytoskeletal failure",
        "unresolved_questions": [
            "Can one intervention stabilize both actin- and MT-linked ALS pathways?",
            "Is cytoskeletal failure causal or secondary to aggregation in each gene?",
        ],
        "recommended_next_experiment": (
            "Side-by-side cytoskeletal integrity assay in MN models expressing "
            "PFN1 G118V vs TUBA4A R320C under matched stress conditions."
        ),
        "mechanism_ids": ["cytoskeleton_disruption", "microtubule_instability"],
    },
    {
        "id": "prevent_toxic_aggregation",
        "title": "Preventing toxic aggregation",
        "summary": "Strong for PFN1; moderate for TUBA4A",
        "priority": "High",
        "priority_rank": 2,
        "confidence": 78,
        "supporting_proteins": [
            {"uniprot_id": PFN1, "symbol": "PFN1", "level": "high"},
            {"uniprot_id": TUBA4A, "symbol": "TUBA4A", "level": "medium"},
        ],
        "supporting_mutations": ["PFN1:G118V", "PFN1:C71G", "TUBA4A:R320C"],
        "evidence_types": ["in_vitro", "animal", "human_genetic", "computational"],
        "pfn1_note": "Multi-modality aggregation package (High)",
        "tuba4a_note": "Aggregation reported but less dominant than MT defect",
        "unresolved_questions": [
            "Are TUBA4A aggregates pathogenic drivers or passengers?",
            "Does reducing PFN1 aggregation restore actin function in vivo?",
        ],
        "recommended_next_experiment": (
            "Head-to-head aggregation / solubility panel for PFN1 G118V and TUBA4A R320C "
            "with shared readouts (filter trap, FRAP, MN toxicity)."
        ),
        "mechanism_ids": ["aggregation", "misfolding"],
    },
    {
        "id": "restore_mt_gtp",
        "title": "Restoring microtubule / GTP function",
        "summary": "Specific to TUBA4A; moderate evidence",
        "priority": "Medium",
        "priority_rank": 3,
        "confidence": 58,
        "supporting_proteins": [
            {"uniprot_id": TUBA4A, "symbol": "TUBA4A", "level": "high"},
        ],
        "supporting_mutations": ["TUBA4A:R320C", "TUBA4A:R215C"],
        "evidence_types": ["in_vitro", "human_genetic"],
        "pfn1_note": "Not implicated",
        "tuba4a_note": "Core tubulin polymerization / GTP-proximal biology",
        "unresolved_questions": [
            "Which tubulin pharmacology restores axonal transport without cytotoxicity?",
            "Does GTP-site correction reduce MN injury independent of aggregation?",
        ],
        "recommended_next_experiment": (
            "Tubulin polymerization + axonal transport rescue screen in TUBA4A R320C "
            "models; include PFN1 G118V as negative-control gene."
        ),
        "mechanism_ids": ["gtp_binding", "microtubule_instability", "axonal_transport"],
    },
]


def _display_level(lv: str) -> str:
    return {"high": "High", "medium": "Moderate", "low": "Low", "none": "None"}.get(
        (lv or "none").lower(), lv.title() if lv else "None"
    )


def build_mechanism_comparison_table() -> dict[str, Any]:
    rows = []
    for r in MECHANISM_COMPARE_ROWS:
        rows.append(
            {
                **r,
                "pfn1_label": _display_level(r["pfn1"]),
                "tuba4a_label": _display_level(r["tuba4a"]),
                "evidence_strength_label": _display_level(r["evidence_strength"]),
                "priority_label": _display_level(r["priority"]),
                "cells": {
                    "PFN1": {
                        "value": _display_level(r["pfn1"]),
                        "href": f"/proteins/{PFN1}",
                        "claim_ids": [c for c in r["claim_ids"] if c.startswith("pfn1")],
                    },
                    "TUBA4A": {
                        "value": _display_level(r["tuba4a"]),
                        "href": f"/proteins/{TUBA4A}",
                        "claim_ids": [c for c in r["claim_ids"] if c.startswith("tuba")],
                    },
                    "Evidence": {
                        "value": _display_level(r["evidence_strength"]),
                        "href": r["evidence_href"],
                        "paper_ids": r["paper_ids"],
                        "claim_ids": r["claim_ids"],
                    },
                    "Priority": {
                        "value": _display_level(r["priority"]),
                        "href": f"/diseases/als#opportunity-{RICH_OPPORTUNITIES[0]['id'] if r['priority'] == 'high' else 'restore_mt_gtp'}",
                    },
                },
            }
        )

    # Strongest combined evidence = max of min(pfn1,tuba4a) * evidence when both present, else evidence only for unique
    scored = []
    for r in MECHANISM_COMPARE_ROWS:
        p = LEVEL_SCORE.get(r["pfn1"], 0)
        t = LEVEL_SCORE.get(r["tuba4a"], 0)
        e = LEVEL_SCORE.get(r["evidence_strength"], 0)
        if p > 0 and t > 0:
            combined = min(p, t) * 10 + e * 5 + (p + t)
        else:
            combined = max(p, t) * 4 + e * 3
        scored.append((combined, r["id"], r["mechanism"]))
    scored.sort(reverse=True)
    strongest = scored[0]

    return {
        "title": "ALS mechanism comparison — PFN1 vs TUBA4A",
        "question": "Which ALS mechanism is most important to pursue, based on evidence across both proteins?",
        "rows": rows,
        "strongest_combined": {
            "mechanism_id": strongest[1],
            "mechanism": strongest[2],
            "score": strongest[0],
            "why": (
                f"{strongest[2]} has the strongest combined cross-protein evidence "
                "in the current PFN1–TUBA4A comparison set."
            ),
        },
        "first_intervention": {
            "id": RICH_OPPORTUNITIES[0]["id"],
            "title": RICH_OPPORTUNITIES[0]["title"],
            "why": RICH_OPPORTUNITIES[0]["summary"],
        },
    }


def build_shared_mechanism_graph() -> dict[str, Any]:
    return {
        "title": "Shared-mechanism graph",
        "trees": SHARED_TREE,
        "overlap": SHARED_OVERLAP,
        "overlap_title": "Shared ALS mechanisms",
        "note": (
            "Different primary lesions (actin vs microtubule) converge on "
            "cytoskeleton failure, protein instability, aggregation, and transport stress."
        ),
    }


def build_rich_opportunities() -> dict[str, Any]:
    return {
        "title": "Therapeutic opportunity ranking",
        "disclaimer": (
            "Ranks biological intervention hypotheses — does not propose molecules "
            "or clinical treatments."
        ),
        "investigate_first": RICH_OPPORTUNITIES[0],
        "opportunities": RICH_OPPORTUNITIES,
    }


def build_prioritization_workspace() -> dict[str, Any]:
    comparison = build_mechanism_comparison_table()
    graph = build_shared_mechanism_graph()
    opps = build_rich_opportunities()
    cmp = compare_proteins([PFN1, TUBA4A])
    answers = {
        "shared": SHARED_OVERLAP,
        "unique_pfn1": ["Actin disruption / profilin pathway", "Strong misfolding–aggregation cascade"],
        "unique_tuba4a": ["Microtubule instability", "GTP-binding disruption", "Primary axonal transport defect"],
        "strongest_combined": comparison["strongest_combined"],
        "investigate_first": {
            "title": opps["investigate_first"]["title"],
            "why": opps["investigate_first"]["summary"],
        },
        "missing_evidence": [
            "Head-to-head PFN1 vs TUBA4A assays under identical conditions",
            "PFN1- or TUBA4A-specific target-engagement biomarkers",
            "Whether cytoskeleton stabilization rescues both genotypes",
            "Causal weight of aggregation in TUBA4A ALS vs transport failure",
        ],
    }
    return {
        "disease_slug": "als",
        "workspace": "mechanism_prioritization",
        "comparison": comparison,
        "shared_graph": graph,
        "opportunities": opps,
        "protein_compare": cmp,
        "definition_of_done": answers,
    }


def build_enhanced_mechanism_report() -> dict[str, Any]:
    ws = build_prioritization_workspace()
    md = render_prioritization_report_markdown(ws)
    return {
        "title": "ALS Disease Mechanism Report — PFN1 vs TUBA4A",
        "als_overview": (
            "ALS involves multiple genes that converge on motor-neuron death through "
            "overlapping mechanisms. PFN1 emphasizes actin/cytoskeleton and aggregation; "
            "TUBA4A emphasizes microtubule/GTP biology and axonal transport — with shared "
            "cytoskeletal failure and aggregation stress."
        ),
        "prioritization": ws,
        "markdown": md,
    }


def render_prioritization_report_markdown(ws: dict[str, Any]) -> str:
    c = ws["comparison"]
    g = ws["shared_graph"]
    o = ws["opportunities"]
    d = ws["definition_of_done"]
    lines = [
        "# ALS Disease Mechanism Report",
        "",
        "## ALS mechanism overview",
        "",
        (
            "PFN1 and TUBA4A illustrate how distinct molecular lesions can feed shared "
            "ALS biology: cytoskeleton failure, protein instability, aggregation, and "
            "motor-neuron transport stress."
        ),
        "",
        "## PFN1 vs TUBA4A comparison",
        "",
        "| Mechanism | PFN1 | TUBA4A | Evidence | Priority |",
        "| --- | --- | --- | --- | --- |",
    ]
    for r in c["rows"]:
        lines.append(
            f"| {r['mechanism']} | {r['pfn1_label']} | {r['tuba4a_label']} | "
            f"{r['evidence_strength_label']} | {r['priority_label']} |"
        )
    lines += ["", "## Shared pathways / mechanisms", ""]
    for item in g["overlap"]:
        lines.append(f"- {item}")
    lines += ["", "### PFN1 tree", ""]
    for n in g["trees"]["PFN1"]:
        lines.append(f"- {n['label']}")
    lines += ["", "### TUBA4A tree", ""]
    for n in g["trees"]["TUBA4A"]:
        lines.append(f"- {n['label']}")
    lines += ["", "## Ranked therapeutic opportunities", ""]
    for opp in o["opportunities"]:
        syms = ", ".join(s["symbol"] for s in opp["supporting_proteins"])
        lines.append(f"### {opp['priority_rank']}. {opp['title']} ({opp['priority']})")
        lines.append("")
        lines.append(f"- **Summary:** {opp['summary']}")
        lines.append(f"- **Supporting proteins:** {syms}")
        lines.append(f"- **Supporting mutations:** {', '.join(opp['supporting_mutations'])}")
        lines.append(f"- **Evidence types:** {', '.join(opp['evidence_types'])}")
        lines.append(f"- **Confidence:** {opp['confidence']}")
        lines.append(f"- **Next experiment:** {opp['recommended_next_experiment']}")
        lines.append("")
    lines += [
        "## Evidence gaps",
        "",
    ]
    for g0 in d["missing_evidence"]:
        lines.append(f"- {g0}")
    lines += [
        "",
        "## Definition-of-done answers",
        "",
        f"- **Shared:** {'; '.join(d['shared'])}",
        f"- **Unique PFN1:** {'; '.join(d['unique_pfn1'])}",
        f"- **Unique TUBA4A:** {'; '.join(d['unique_tuba4a'])}",
        f"- **Strongest combined:** {d['strongest_combined']['mechanism']} — {d['strongest_combined']['why']}",
        f"- **Investigate first:** {d['investigate_first']['title']} — {d['investigate_first']['why']}",
        "",
        "---",
        "*RockGen Disease Mechanism Engine — prioritization workspace.*",
        "",
    ]
    return "\n".join(lines)


def cross_protein_mechanism_review(question: str) -> dict[str, Any]:
    """Scientific review style response for shared PFN1–TUBA4A mechanisms."""
    ws = build_prioritization_workspace()
    c = ws["comparison"]
    o = ws["opportunities"]
    d = ws["definition_of_done"]

    citations = []
    for r in c["rows"]:
        for pid in r.get("paper_ids") or []:
            if not any(x["id"] == pid for x in citations):
                citations.append(
                    {
                        "id": pid,
                        "title": pid,
                        "url": f"https://pubmed.ncbi.nlm.nih.gov/{pid.replace('pmid:', '')}/",
                    }
                )

    contradictions = [
        {
            "topic": "Aggregation primacy",
            "summary": (
                "Aggregation is High for PFN1 but Moderate for TUBA4A — "
                "transport/MT failure may dominate TUBA4A pathogenicity."
            ),
        },
        {
            "topic": "GTP-binding",
            "summary": "GTP-binding disruption is TUBA4A-unique; no PFN1 support.",
        },
    ]

    return {
        "question": question,
        "question_type": "cross_protein_mechanism",
        "conclusion": (
            "PFN1 and TUBA4A share cytoskeleton failure, protein instability/aggregation "
            "stress, and transport-related MN vulnerability, via distinct primary lesions."
        ),
        "confidence": 72,
        "confidence_label": "Moderate–High",
        "summary": (
            "Cross-protein synthesis: actin-linked PFN1 pathology and microtubule-linked "
            "TUBA4A pathology converge on shared ALS mechanisms. Strongest combined "
            f"evidence currently centers on **{c['strongest_combined']['mechanism']}**. "
            f"First intervention to investigate: **{o['investigate_first']['title']}**."
        ),
        "shared_mechanisms": d["shared"],
        "unique_mechanisms": {
            "PFN1": d["unique_pfn1"],
            "TUBA4A": d["unique_tuba4a"],
        },
        "evidence_strength": [
            {
                "mechanism": r["mechanism"],
                "pfn1": r["pfn1_label"],
                "tuba4a": r["tuba4a_label"],
                "combined": r["evidence_strength_label"],
            }
            for r in c["rows"]
        ],
        "contradictions": contradictions,
        "gaps": [{"text": g} for g in d["missing_evidence"]],
        "therapeutic_implications": [
            {
                "title": opp["title"],
                "priority": opp["priority"],
                "confidence": opp["confidence"],
                "summary": opp["summary"],
            }
            for opp in o["opportunities"]
        ],
        "supporting_evidence": [
            {
                "claim_id": cid,
                "citation": cid,
                "evidence_type": "curated_claim",
            }
            for r in c["rows"]
            for cid in (r.get("claim_ids") or [])
        ][:12],
        "citations": citations,
        "meta": {
            "proteins": ["PFN1", "TUBA4A"],
            "uniprot_ids": [PFN1, TUBA4A],
            "strongest_combined": c["strongest_combined"],
            "investigate_first": o["investigate_first"],
            "engine": "disease_mechanism",
        },
    }
