"""Rule-based Protein State Scores for mutation comparison.

Scores are transparent and explainable — not disease probabilities.
"""

from __future__ import annotations

from typing import Any

# Comparison cohorts by UniProt
COMPARE_KEYS_BY_PROTEIN: dict[str, tuple[str, ...]] = {
    "P07737": ("PFN1:G118V", "PFN1:C71G", "PFN1:T109M"),
    "P68366": ("TUBA4A:R320C", "TUBA4A:R215C"),
}

PROTEIN_SYMBOLS: dict[str, str] = {
    "P07737": "PFN1",
    "P68366": "TUBA4A",
}

# Backward-compatible alias
COMPARE_KEYS = COMPARE_KEYS_BY_PROTEIN["P07737"]

# Qualitative comparison cells: value + evidence anchors (claim / evidence ids)
COMPARISON_PROPERTIES: list[dict[str, Any]] = [
    {
        "id": "structural_stability",
        "property": "Structural stability",
        "cells": {
            "PFN1:G118V": {
                "value": "Reduced",
                "evidence_ids": ["ev-g118v-struct-computational", "ev-g118v-struct-invitro"],
                "claim_id": "pfn1-g118v-structural-change",
            },
            "PFN1:C71G": {
                "value": "Reduced",
                "evidence_ids": ["ev-c71g-struct-invitro"],
                "claim_id": "pfn1-c71g-structural-change",
            },
            "PFN1:T109M": {
                "value": "Altered",
                "evidence_ids": ["ev-t109m-struct-computational"],
                "claim_id": "pfn1-t109m-structural-change",
            },
        },
    },
    {
        "id": "flexibility",
        "property": "Flexibility",
        "cells": {
            "PFN1:G118V": {
                "value": "Reduced",
                "evidence_ids": ["ev-g118v-struct-computational"],
                "claim_id": "pfn1-g118v-structural-change",
            },
            "PFN1:C71G": {
                "value": "Variable",
                "evidence_ids": ["ev-c71g-struct-invitro"],
                "claim_id": "pfn1-c71g-structural-change",
            },
            "PFN1:T109M": {
                "value": "Reduced at PLP-proximal site",
                "evidence_ids": ["ev-t109m-struct-computational"],
                "claim_id": "pfn1-t109m-structural-change",
            },
        },
    },
    {
        "id": "aggregation_risk",
        "property": "Aggregation risk",
        "cells": {
            "PFN1:G118V": {
                "value": "High",
                "evidence_ids": [
                    "ev-g118v-agg-invitro",
                    "ev-g118v-agg-animal",
                    "ev-g118v-agg-computational",
                ],
                "claim_id": "pfn1-g118v-increases-aggregation",
            },
            "PFN1:C71G": {
                "value": "High",
                "evidence_ids": ["ev-c71g-agg-invitro", "ev-c71g-agg-animal"],
                "claim_id": "pfn1-c71g-increases-aggregation",
            },
            "PFN1:T109M": {
                "value": "Unclear / moderate",
                "evidence_ids": ["ev-t109m-agg-mixed"],
                "claim_id": "pfn1-t109m-aggregation",
            },
        },
    },
    {
        "id": "actin_binding",
        "property": "Actin binding",
        "cells": {
            "PFN1:G118V": {
                "value": "Impaired",
                "evidence_ids": ["ev-g118v-misfold-invitro"],
                "claim_id": "pfn1-g118v-misfolding",
                "note": "Functional disruption inferred; not all assays agree.",
            },
            "PFN1:C71G": {
                "value": "Possibly impaired",
                "evidence_ids": ["ev-c71g-struct-invitro"],
                "claim_id": "pfn1-c71g-structural-change",
                "note": "Residue sits in actin-binding face.",
            },
            "PFN1:T109M": {
                "value": "Largely preserved",
                "evidence_ids": ["ev-t109m-misfold-invitro"],
                "claim_id": "pfn1-t109m-misfolding",
                "note": "Primary effects appear PLP-proximal / local fold.",
            },
        },
    },
    {
        "id": "animal_evidence",
        "property": "Animal evidence",
        "cells": {
            "PFN1:G118V": {
                "value": "Yes",
                "evidence_ids": ["ev-g118v-agg-animal"],
                "claim_id": "pfn1-g118v-increases-aggregation",
            },
            "PFN1:C71G": {
                "value": "Yes",
                "evidence_ids": ["ev-c71g-agg-animal"],
                "claim_id": "pfn1-c71g-increases-aggregation",
            },
            "PFN1:T109M": {
                "value": "Limited",
                "evidence_ids": ["ev-t109m-agg-mixed"],
                "claim_id": "pfn1-t109m-aggregation",
            },
        },
    },
    {
        "id": "human_genetic",
        "property": "Human genetic evidence",
        "cells": {
            "PFN1:G118V": {
                "value": "Yes",
                "evidence_ids": ["ev-g118v-misfold-invitro"],
                "claim_id": "pfn1-g118v-misfolding",
            },
            "PFN1:C71G": {
                "value": "Yes",
                "evidence_ids": ["ev-c71g-human-genetic"],
                "claim_id": "pfn1-c71g-increases-aggregation",
            },
            "PFN1:T109M": {
                "value": "Yes",
                "evidence_ids": ["ev-t109m-human-genetic"],
                "claim_id": "pfn1-t109m-aggregation",
            },
        },
    },
]

TUBA4A_COMPARISON_PROPERTIES: list[dict[str, Any]] = [
    {
        "id": "structural_stability",
        "property": "Structural stability",
        "cells": {
            "TUBA4A:R320C": {
                "value": "Reduced / polymerization-compromised",
                "evidence_ids": ["ev-tuba-r320c-invitro"],
                "claim_id": "tuba4a-r320c-microtubule",
            },
            "TUBA4A:R215C": {
                "value": "Altered (less resolved)",
                "evidence_ids": ["ev-tuba-r320c-invitro"],
                "claim_id": "tuba4a-r320c-microtubule",
                "note": "Shared tubulin literature context; allele-specific depth thinner than R320C.",
            },
        },
    },
    {
        "id": "microtubule_dynamics",
        "property": "Microtubule dynamics",
        "cells": {
            "TUBA4A:R320C": {
                "value": "Impaired",
                "evidence_ids": ["ev-tuba-r320c-invitro"],
                "claim_id": "tuba4a-r320c-microtubule",
            },
            "TUBA4A:R215C": {
                "value": "Likely impaired",
                "evidence_ids": ["ev-tuba-r320c-human"],
                "claim_id": "tuba4a-r320c-microtubule",
            },
        },
    },
    {
        "id": "gtp_binding",
        "property": "GTP-binding / polymerization",
        "cells": {
            "TUBA4A:R320C": {
                "value": "Disrupted (GTP-proximal)",
                "evidence_ids": ["ev-tuba-r320c-invitro"],
                "claim_id": "tuba4a-r320c-microtubule",
            },
            "TUBA4A:R215C": {
                "value": "Not directly established",
                "evidence_ids": [],
                "claim_id": None,
            },
        },
    },
    {
        "id": "axonal_transport",
        "property": "Axonal transport",
        "cells": {
            "TUBA4A:R320C": {
                "value": "Impaired",
                "evidence_ids": ["ev-tuba-axonal-invitro"],
                "claim_id": "tuba4a-r320c-axonal-transport",
            },
            "TUBA4A:R215C": {
                "value": "Inferred / limited",
                "evidence_ids": ["ev-tuba-mn-genetic"],
                "claim_id": "tuba4a-r320c-mn-injury",
            },
        },
    },
    {
        "id": "aggregation_risk",
        "property": "Aggregation risk",
        "cells": {
            "TUBA4A:R320C": {
                "value": "Moderate",
                "evidence_ids": ["ev-tuba-r320c-invitro"],
                "claim_id": "tuba4a-r320c-microtubule",
                "note": "Secondary to MT defect in current model",
            },
            "TUBA4A:R215C": {
                "value": "Unclear / moderate",
                "evidence_ids": [],
                "claim_id": None,
            },
        },
    },
    {
        "id": "human_genetic",
        "property": "Human genetic evidence",
        "cells": {
            "TUBA4A:R320C": {
                "value": "Yes",
                "evidence_ids": ["ev-tuba-r320c-human"],
                "claim_id": "tuba4a-r320c-microtubule",
            },
            "TUBA4A:R215C": {
                "value": "Yes",
                "evidence_ids": ["ev-tuba-r320c-human"],
                "claim_id": "tuba4a-r320c-microtubule",
            },
        },
    },
]

COMPARISON_PROPERTIES_BY_PROTEIN: dict[str, list[dict[str, Any]]] = {
    "P07737": COMPARISON_PROPERTIES,
    "P68366": TUBA4A_COMPARISON_PROPERTIES,
}

# Curated profiles used for Protein State Scores (explainable rule inputs)
MUTATION_PROFILES: dict[str, dict[str, Any]] = {
    "PFN1:G118V": {
        "key": "PFN1:G118V",
        "variant": "G118V",
        "hgvs_p": "p.Gly118Val",
        "position": 118,
        "from_aa": "G",
        "to_aa": "V",
        "clinvar_status": "Pathogenic / Likely pathogenic (literature)",
        "structural_location": "Core / near actin interface (pocket ~112–120)",
        "binding_region": "near actin-binding face",
        "known_functional_effects": [
            "Reduced local flexibility",
            "Increased aggregation propensity",
            "Impaired / context-dependent actin function",
        ],
        "flags": {
            "stability_reduced": True,
            "flexibility_reduced": True,
            "aggregation_high": True,
            "aggregation_moderate": False,
            "aggregation_unclear": False,
            "misfolding_supported": True,
            "actin_impaired": True,
            "actin_possibly_impaired": False,
            "plp_effect": False,
            "computational": True,
            "in_vitro": True,
            "animal": True,
            "human_genetic": True,
            "clinical": False,
            "conflicting_evidence": False,
        },
        "evidence_mix": {
            "computational": True,
            "in_vitro": True,
            "animal": True,
            "human_genetic": True,
            "clinical": False,
        },
        "overall_confidence_label": "High",
        "ranking_note": "Best-supported aggregation and structural disruption package among the three.",
    },
    "PFN1:C71G": {
        "key": "PFN1:C71G",
        "variant": "C71G",
        "hgvs_p": "p.Cys71Gly",
        "position": 71,
        "from_aa": "C",
        "to_aa": "G",
        "clinvar_status": "Pathogenic / Likely pathogenic (literature)",
        "structural_location": "Actin-binding face (residues ~59–74)",
        "binding_region": "actin-binding",
        "known_functional_effects": [
            "Structural destabilization at actin face",
            "High aggregation risk",
            "Possible actin-binding impairment",
        ],
        "flags": {
            "stability_reduced": True,
            "flexibility_reduced": False,
            "aggregation_high": True,
            "aggregation_moderate": False,
            "aggregation_unclear": False,
            "misfolding_supported": True,
            "actin_impaired": False,
            "actin_possibly_impaired": True,
            "plp_effect": False,
            "computational": False,
            "in_vitro": True,
            "animal": True,
            "human_genetic": True,
            "clinical": False,
            "conflicting_evidence": False,
        },
        "evidence_mix": {
            "computational": False,
            "in_vitro": True,
            "animal": True,
            "human_genetic": True,
            "clinical": False,
        },
        "overall_confidence_label": "High",
        "ranking_note": "Strong experimental aggregation + genetics; slightly less computational structure package than G118V.",
    },
    "PFN1:T109M": {
        "key": "PFN1:T109M",
        "variant": "T109M",
        "hgvs_p": "p.Thr109Met",
        "position": 109,
        "from_aa": "T",
        "to_aa": "M",
        "clinvar_status": "Uncertain / conflicting in indexed catalogs",
        "structural_location": "PLP-proximal / mid-domain (~109)",
        "binding_region": "PLP-proximal",
        "known_functional_effects": [
            "Local structural alteration near PLP site",
            "Aggregation risk moderate / unclear",
            "Actin binding largely preserved",
        ],
        "flags": {
            "stability_reduced": False,
            "flexibility_reduced": True,
            "aggregation_high": False,
            "aggregation_moderate": True,
            "aggregation_unclear": True,
            "misfolding_supported": False,
            "actin_impaired": False,
            "actin_possibly_impaired": False,
            "plp_effect": True,
            "computational": True,
            "in_vitro": True,
            "animal": False,
            "human_genetic": True,
            "clinical": False,
            "conflicting_evidence": True,
        },
        "evidence_mix": {
            "computational": True,
            "in_vitro": True,
            "animal": False,
            "human_genetic": True,
            "clinical": False,
        },
        "overall_confidence_label": "Moderate",
        "ranking_note": "Human association present, but aggregation/functional disruption less resolved than G118V/C71G.",
    },
    "TUBA4A:R320C": {
        "key": "TUBA4A:R320C",
        "variant": "R320C",
        "hgvs_p": "p.Arg320Cys",
        "position": 320,
        "from_aa": "R",
        "to_aa": "C",
        "clinvar_status": "Pathogenic / Likely pathogenic (literature)",
        "structural_location": "Tubulin core / GTP-proximal",
        "binding_region": "microtubule lattice",
        "known_functional_effects": [
            "Microtubule polymerization / stability defect",
            "Axonal transport impairment",
            "ALS-linked familial association",
        ],
        "flags": {
            "stability_reduced": True,
            "flexibility_reduced": True,
            "aggregation_high": False,
            "aggregation_moderate": True,
            "aggregation_unclear": False,
            "misfolding_supported": False,
            "actin_impaired": False,
            "actin_possibly_impaired": False,
            "plp_effect": False,
            "mt_impaired": True,
            "gtp_effect": True,
            "computational": False,
            "in_vitro": True,
            "animal": False,
            "human_genetic": True,
            "clinical": False,
            "conflicting_evidence": False,
        },
        "evidence_mix": {
            "computational": False,
            "in_vitro": True,
            "animal": False,
            "human_genetic": True,
            "clinical": False,
        },
        "overall_confidence_label": "High",
        "ranking_note": "Best-supported TUBA4A ALS allele in the current index (MT + transport + genetics).",
    },
    "TUBA4A:R215C": {
        "key": "TUBA4A:R215C",
        "variant": "R215C",
        "hgvs_p": "p.Arg215Cys",
        "position": 215,
        "from_aa": "R",
        "to_aa": "C",
        "clinvar_status": "Likely pathogenic (literature)",
        "structural_location": "Tubulin fold",
        "binding_region": "microtubule",
        "known_functional_effects": [
            "ALS-associated tubulin variant",
            "Likely microtubule dynamics alteration",
            "Less complete functional characterization than R320C",
        ],
        "flags": {
            "stability_reduced": True,
            "flexibility_reduced": False,
            "aggregation_high": False,
            "aggregation_moderate": True,
            "aggregation_unclear": True,
            "misfolding_supported": False,
            "actin_impaired": False,
            "actin_possibly_impaired": False,
            "plp_effect": False,
            "mt_impaired": True,
            "gtp_effect": False,
            "computational": False,
            "in_vitro": True,
            "animal": False,
            "human_genetic": True,
            "clinical": False,
            "conflicting_evidence": True,
        },
        "evidence_mix": {
            "computational": False,
            "in_vitro": True,
            "animal": False,
            "human_genetic": True,
            "clinical": False,
        },
        "overall_confidence_label": "Moderate",
        "ranking_note": "ALS-linked but thinner functional package than R320C in the current claim set.",
    },
}


def _clamp(n: int) -> int:
    return max(0, min(100, n))


def score_protein_state(profile: dict[str, Any]) -> dict[str, Any]:
    """Transparent rule-based protein-state dimensions (0–100)."""
    f = profile["flags"]
    breakdown: dict[str, list[str]] = {}

    # Structural disruption
    structural = 20
    reasons_s: list[str] = ["base 20"]
    if f["stability_reduced"]:
        structural += 35
        reasons_s.append("+35 stability reduced")
    if f["flexibility_reduced"]:
        structural += 25
        reasons_s.append("+25 flexibility reduced")
    if f.get("plp_effect"):
        structural += 10
        reasons_s.append("+10 PLP-proximal local effect")
    if f.get("gtp_effect"):
        structural += 15
        reasons_s.append("+15 GTP-proximal tubulin effect")
    if f.get("mt_impaired"):
        structural += 10
        reasons_s.append("+10 microtubule impairment")
    if f["computational"] and (f["stability_reduced"] or f["flexibility_reduced"]):
        structural += 10
        reasons_s.append("+10 computational support")
    structural = _clamp(structural)
    breakdown["structural_disruption"] = reasons_s

    # Misfolding risk
    misfold = 15
    reasons_m = ["base 15"]
    if f["misfolding_supported"]:
        misfold += 40
        reasons_m.append("+40 misfolding claim supported")
    if f["stability_reduced"]:
        misfold += 20
        reasons_m.append("+20 stability loss")
    if f["in_vitro"]:
        misfold += 15
        reasons_m.append("+15 in vitro")
    if f["conflicting_evidence"]:
        misfold -= 15
        reasons_m.append("−15 conflicting / mixed")
    misfold = _clamp(misfold)
    breakdown["misfolding_risk"] = reasons_m

    # Aggregation risk
    agg = 10
    reasons_a = ["base 10"]
    if f["aggregation_high"]:
        agg += 55
        reasons_a.append("+55 high aggregation")
    elif f["aggregation_moderate"]:
        agg += 30
        reasons_a.append("+30 moderate aggregation")
    if f["aggregation_unclear"]:
        agg -= 10
        reasons_a.append("−10 unclear findings")
    if f["animal"]:
        agg += 15
        reasons_a.append("+15 animal evidence")
    if f["in_vitro"] and f["aggregation_high"]:
        agg += 10
        reasons_a.append("+10 direct in vitro aggregation")
    agg = _clamp(agg)
    breakdown["aggregation_risk"] = reasons_a

    # Functional disruption
    functional = 15
    reasons_f = ["base 15"]
    if f.get("actin_impaired"):
        functional += 40
        reasons_f.append("+40 actin binding impaired")
    elif f.get("actin_possibly_impaired"):
        functional += 25
        reasons_f.append("+25 actin possibly impaired")
    if f.get("mt_impaired"):
        functional += 40
        reasons_f.append("+40 microtubule function impaired")
    if f.get("gtp_effect"):
        functional += 20
        reasons_f.append("+20 GTP / polymerization effect")
    if f.get("plp_effect"):
        functional += 20
        reasons_f.append("+20 PLP-site effect")
    if f["aggregation_high"]:
        functional += 15
        reasons_f.append("+15 aggregation-linked dysfunction")
    if f["conflicting_evidence"]:
        functional -= 10
        reasons_f.append("−10 mixed functional readouts")
    functional = _clamp(functional)
    breakdown["functional_disruption"] = reasons_f

    # Evidence strength
    evidence = 10
    reasons_e = ["base 10"]
    mix = profile["evidence_mix"]
    weights = {
        "computational": 12,
        "in_vitro": 22,
        "animal": 20,
        "human_genetic": 25,
        "clinical": 15,
    }
    for k, w in weights.items():
        if mix.get(k):
            evidence += w
            reasons_e.append(f"+{w} {k}")
    if f["conflicting_evidence"]:
        evidence -= 12
        reasons_e.append("−12 conflicting")
    evidence = _clamp(evidence)
    breakdown["evidence_strength"] = reasons_e

    # Human relevance
    human = 20
    reasons_h = ["base 20"]
    if f["human_genetic"]:
        human += 45
        reasons_h.append("+45 human genetic association")
    if "Pathogenic" in profile.get("clinvar_status", ""):
        human += 20
        reasons_h.append("+20 pathogenic / likely pathogenic label")
    elif "Uncertain" in profile.get("clinvar_status", ""):
        human += 5
        reasons_h.append("+5 uncertain ClinVar-like status")
    if f["animal"]:
        human += 10
        reasons_h.append("+10 animal toxicity models")
    human = _clamp(human)
    breakdown["human_relevance"] = reasons_h

    dimensions = {
        "structural_disruption": structural,
        "misfolding_risk": misfold,
        "aggregation_risk": agg,
        "functional_disruption": functional,
        "evidence_strength": evidence,
        "human_relevance": human,
    }
    # Priority index = mean of disruption dims weighted by evidence (not a disease probability)
    disruption_mean = (
        structural + misfold + agg + functional
    ) / 4.0
    priority = _clamp(int(round(disruption_mean * 0.7 + evidence * 0.2 + human * 0.1)))

    return {
        "dimensions": dimensions,
        "breakdown": breakdown,
        "priority_index": priority,
        "disclaimer": (
            "Protein State Scores are rule-based disruption / evidence indices — "
            "not disease probabilities or clinical risk scores."
        ),
    }


def build_mutation_comparison(uniprot_id: str = "P07737") -> dict[str, Any]:
    uid = uniprot_id.upper()
    keys = COMPARE_KEYS_BY_PROTEIN.get(uid)
    if not keys:
        raise KeyError(f"No mutation comparison cohort for {uid}")

    symbol = PROTEIN_SYMBOLS.get(uid, uid)
    props = COMPARISON_PROPERTIES_BY_PROTEIN.get(uid) or COMPARISON_PROPERTIES

    mutations = []
    for key in keys:
        profile = MUTATION_PROFILES[key]
        state = score_protein_state(profile)
        mutations.append(
            {
                **{k: profile[k] for k in profile if k != "flags"},
                "flags": profile["flags"],
                "protein_state_score": state,
            }
        )

    # Rank by priority index then aggregation then evidence
    ranked = sorted(
        mutations,
        key=lambda m: (
            m["protein_state_score"]["priority_index"],
            m["protein_state_score"]["dimensions"]["aggregation_risk"],
            m["protein_state_score"]["dimensions"]["evidence_strength"],
        ),
        reverse=True,
    )
    top = ranked[0]

    rows = []
    for prop in props:
        row = {"id": prop["id"], "property": prop["property"], "cells": {}}
        for key in keys:
            cell = prop["cells"].get(key) or {
                "value": "—",
                "evidence_ids": [],
                "claim_id": None,
            }
            row["cells"][key] = {
                "value": cell["value"],
                "claim_id": cell.get("claim_id"),
                "evidence_ids": cell.get("evidence_ids") or [],
                "note": cell.get("note"),
                "evidence_href": f"/proteins/{uid}?claim={cell.get('claim_id') or ''}",
            }
        rows.append(row)

    # Overall confidence row
    rows.append(
        {
            "id": "overall_confidence",
            "property": "Overall confidence",
            "cells": {
                key: {
                    "value": MUTATION_PROFILES[key]["overall_confidence_label"],
                    "claim_id": None,
                    "evidence_ids": [],
                    "note": MUTATION_PROFILES[key]["ranking_note"],
                    "evidence_href": f"/proteins/{uid}/compare#{key.replace(':', '-')}",
                }
                for key in keys
            },
        }
    )

    variant_label = " vs ".join(m["variant"] for m in mutations)

    return {
        "uniprot_id": uid,
        "symbol": symbol,
        "variant_label": variant_label,
        "question": f"Which {symbol} mutation is most disruptive, why, and what evidence supports that?",
        "mutations": mutations,
        "ranked_keys": [m["key"] for m in ranked],
        "most_disruptive": {
            "key": top["key"],
            "variant": top["variant"],
            "priority_index": top["protein_state_score"]["priority_index"],
            "why": top["ranking_note"],
            "top_dimensions": sorted(
                top["protein_state_score"]["dimensions"].items(),
                key=lambda x: x[1],
                reverse=True,
            )[:3],
        },
        "comparison_table": rows,
        "scoring_method": {
            "type": "rule_based",
            "dimensions": [
                "structural_disruption",
                "misfolding_risk",
                "aggregation_risk",
                "functional_disruption",
                "evidence_strength",
                "human_relevance",
            ],
            "disclaimer": top["protein_state_score"]["disclaimer"],
        },
    }


def build_health_report(uniprot_id: str = "P07737") -> dict[str, Any]:
    uid = uniprot_id.upper()
    comparison = build_mutation_comparison(uid)
    symbol = comparison["symbol"]

    if uid == "P68366":
        gaps = [
            "Limited head-to-head assays comparing TUBA4A R320C vs R215C under identical conditions",
            "No validated TUBA4A-specific target-engagement biomarker",
            "Animal toxicity package thinner than PFN1 for some alleles in the current index",
            "GTP-site pharmacology remain exploratory",
        ]
        contradictions = [
            {
                "topic": "Aggregation vs transport primacy",
                "summary": "MT/transport failure may dominate TUBA4A pathogenicity relative to aggregation.",
                "evidence_ids": ["ev-tuba-axonal-invitro"],
            }
        ]
        experiments = [
            "Tubulin polymerization assay: R320C vs R215C vs WT",
            "Axonal transport rescue screen in TUBA4A R320C models",
            "Cross-check cytoskeletal phenotypes against PFN1 G118V as a parallel actin control",
        ]
        structural = (
            "R320C concentrates disruption on microtubule polymerization / GTP-proximal biology "
            "and axonal transport. R215C is ALS-associated with a thinner functional package in "
            "the current claim set."
        )
    else:
        gaps = [
            "No validated PFN1-specific biomarker in indexed evidence",
            "Limited head-to-head assays comparing G118V vs C71G vs T109M under identical conditions",
            "T109M aggregation and animal toxicity remain incompletely resolved",
            "ClinVar clinical significance labels need periodic re-ingest refresh",
            "No validated target-engagement biomarker for PFN1 stabilization",
        ]
        contradictions = [
            {
                "topic": "T109M aggregation",
                "summary": "In vitro aggregation for T109M is mixed / moderate vs consistently high for G118V and C71G.",
                "evidence_ids": ["ev-t109m-agg-mixed"],
            },
            {
                "topic": "Actin binding (G118V)",
                "summary": "Functional actin impairment is suggested but not uniformly validated across all assays.",
                "evidence_ids": ["ev-g118v-misfold-invitro"],
            },
        ]
        experiments = [
            "Side-by-side aggregation / solubility assay: G118V vs C71G vs T109M",
            "Thermal / chemical denaturation + MD panel for all three variants",
            "Actin and PLP binding competition assays with WT controls",
            "Primary neuron or iPSC motor-neuron toxicity comparison",
            "Develop conformational / oligomer assay as PFN1-specific biomarker candidate",
        ]
        structural = (
            "G118V and C71G concentrate disruption on fold stability and aggregation, "
            "with C71G sitting directly in the actin-binding face. T109M sits closer to "
            "the PLP-proximal region with milder / less resolved aggregation phenotypes."
        )

    markdown = render_health_report_markdown(comparison, gaps, contradictions, experiments)
    return {
        "uniprot_id": uid,
        "title": f"{symbol} Protein Health Report",
        "generated_for": "Protein Intelligence",
        "comparison": comparison,
        "structural_interpretation": structural,
        "research_gaps": gaps,
        "contradictions": contradictions,
        "recommended_next_experiments": experiments,
        "markdown": markdown,
    }


def render_health_report_markdown(
    comparison: dict[str, Any],
    gaps: list[str],
    contradictions: list[dict[str, Any]],
    experiments: list[str],
) -> str:
    symbol = comparison.get("symbol", "Protein")
    variants = [m["variant"] for m in comparison["mutations"]]
    lines = [
        f"# {symbol} Protein Health Report",
        "",
        "> Protein State Scores are disruption / evidence indices — **not** disease probabilities.",
        "",
        "## Protein overview",
        "",
        f"- **Symbol:** {symbol}",
        f"- **UniProt:** {comparison['uniprot_id']}",
        "- **Program:** ALS",
        f"- **Compared mutations:** {', '.join(variants)}",
        "",
        "## Decision question",
        "",
        comparison["question"],
        "",
        f"**Most disruptive (current ranking):** {comparison['most_disruptive']['variant']} "
        f"(priority index {comparison['most_disruptive']['priority_index']})",
        "",
        comparison["most_disruptive"]["why"],
        "",
        "## Mutation comparison",
        "",
    ]
    # Table header
    variants = [m["variant"] for m in comparison["mutations"]]
    keys = [m["key"] for m in comparison["mutations"]]
    lines.append("| Property | " + " | ".join(variants) + " |")
    lines.append("| --- | " + " | ".join(["---"] * len(variants)) + " |")
    for row in comparison["comparison_table"]:
        vals = [row["cells"][k]["value"] for k in keys]
        lines.append(f"| {row['property']} | " + " | ".join(vals) + " |")

    lines += ["", "## Protein State Scores", ""]
    for m in comparison["mutations"]:
        s = m["protein_state_score"]
        lines.append(f"### {m['variant']}")
        lines.append("")
        for dim, val in s["dimensions"].items():
            lines.append(f"- **{dim.replace('_', ' ').title()}:** {val}")
            for reason in s["breakdown"][dim]:
                lines.append(f"  - {reason}")
        lines.append(f"- **Priority index:** {s['priority_index']}")
        lines.append("")

    lines += [
        "## Structural interpretation",
        "",
    ]
    for m in comparison["mutations"]:
        lines.append(f"- **{m['variant']}:** {m['ranking_note']}")
    lines += [
        "",
        "## Contradictions / unresolved tensions",
        "",
    ]
    for c in contradictions:
        lines.append(f"- **{c['topic']}:** {c['summary']}")

    lines += ["", "## Research gaps", ""]
    for g in gaps:
        lines.append(f"- {g}")

    lines += ["", "## Recommended next experiments", ""]
    for e in experiments:
        lines.append(f"- {e}")

    lines += [
        "",
        "---",
        "*Generated by RockGen Protein Intelligence Phase 1.*",
        "",
    ]
    return "\n".join(lines)
