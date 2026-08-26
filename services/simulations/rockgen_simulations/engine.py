"""Protein Dynamics Engine orchestration."""

from __future__ import annotations

from typing import Any

from rockgen_simulations.backends.demo import generate_demo_trajectory
from rockgen_simulations.clustering import cluster_frames
from rockgen_simulations.schema import FEATURE_KEYS


def _mean_features(samples: list[dict[str, Any]]) -> dict[str, float]:
    if not samples:
        return {k: 0.0 for k in FEATURE_KEYS}
    n = len(samples)
    return {
        k: round(sum(s["features"][k] for s in samples) / n, 4)
        for k in FEATURE_KEYS
    }


def _delta(a: dict[str, float], b: dict[str, float]) -> dict[str, float]:
    return {k: round(b[k] - a[k], 4) for k in FEATURE_KEYS}


def compare_pfn1_wt_g118v(
    *,
    n_nominal_frames: int = 1_000_000,
    n_samples: int = 400,
    wt_clusters: int = 5,
    mut_clusters: int = 8,
) -> dict[str, Any]:
    """PFN1 WT vs G118V dynamics comparison PoC."""
    wt = generate_demo_trajectory(
        label="PFN1_WT",
        mutant=False,
        n_nominal_frames=n_nominal_frames,
        n_samples=n_samples,
        seed=11,
    )
    mut = generate_demo_trajectory(
        label="PFN1_G118V",
        mutant=True,
        n_nominal_frames=n_nominal_frames,
        n_samples=n_samples,
        seed=11,
    )

    wt_cl = cluster_frames(wt["samples"], k=wt_clusters, seed=11)
    mut_cl = cluster_frames(mut["samples"], k=mut_clusters, seed=99)

    wt_mean = _mean_features(wt["samples"])
    mut_mean = _mean_features(mut["samples"])
    delta = _delta(wt_mean, mut_mean)

    # Disease-associated = mutant clusters with high disease score not matched in WT top scores
    wt_top = {c["cluster_id"]: c["disease_relevance_score"] for c in wt_cl["clusters"][:3]}
    disease_states = [
        c
        for c in mut_cl["clusters"]
        if c["disease_relevance_score"] >= 0.55
        and c["disease_relevance_score"] > (max(wt_top.values()) if wt_top else 0.4)
    ][:3]

    transient_pockets = [
        c
        for c in mut_cl["clusters"]
        if c["druggability_score"] >= 0.35 and c["fraction"] < 0.2
    ][:2]

    summary = {
        "normal_protein_states": wt_cl["k"],
        "mutant_protein_states": mut_cl["k"],
        "disease_associated_state_detected": len(disease_states) > 0,
        "hydrophobic_exposure": "Increased" if delta["hydrophobic_sasa_proxy"] > 0.08 else "Similar",
        "aggregation_risk": "Increased" if delta["agg_propensity_proxy"] > 0.1 else "Similar",
        "actin_binding_region_stability": (
            "Reduced" if delta["actin_interface_stability"] < -0.08 else "Similar"
        ),
        "potential_transient_pocket": "Detected" if transient_pockets else "Not detected",
        "flexibility_near_g118": "Increased" if delta["rmsf_peak_near_mutation"] > 0.1 else "Similar",
        "hydrogen_bonding": "Reduced" if delta["hbond_count"] < -0.05 else "Similar",
    }

    report = {
        "title": "PFN1 G118V Dynamics Report",
        "engine": "protein_dynamics",
        "backend": "demo_literature_aligned",
        "disclaimer": wt["disclaimer"],
        "storage_policy": (
            "Trajectory frames are stored as coordinates/features (and later .xtc/.dcd), "
            "not as one million PNG screenshots. Images are rendered on demand for selected frames."
        ),
        "comparison": {
            "protein": "PFN1",
            "uniprot_id": "P07737",
            "wild_type": "WT",
            "mutant": "G118V",
            "n_frames_nominal_each": n_nominal_frames,
            "n_samples_each": n_samples,
        },
        "summary": summary,
        "mean_features": {"WT": wt_mean, "G118V": mut_mean, "delta_mutant_minus_wt": delta},
        "wild_type": {
            "trajectory_meta": {k: wt[k] for k in wt if k != "samples"},
            "clusters": wt_cl["clusters"],
        },
        "mutant": {
            "trajectory_meta": {k: mut[k] for k in mut if k != "samples"},
            "clusters": mut_cl["clusters"],
        },
        "disease_associated_states": disease_states,
        "transient_druggable_pockets": transient_pockets,
        "pipeline": [
            "Load WT and mutant structure context",
            "Generate / import MD trajectory frames (sampled)",
            "Extract RMSD, Rg, H-bonds, hydrophobic exposure, agg risk, pocket proxies",
            "Cluster conformations",
            "Identify mutant-enriched / rare disease-associated states",
            "Rank transient druggable pockets for Therapeutic Design (later)",
        ],
        "next_backend": [
            "Connect OpenMM short vacuum/implicit-solvent runs for PFN1 WT vs G118V",
            "Store .dcd/.xtc + feature parquet; never rasterize all frames",
            "Re-run clustering on real features; keep this report schema",
        ],
    }
    report["markdown"] = dynamics_report_markdown(report)
    return report


def dynamics_report_markdown(report: dict[str, Any]) -> str:
    s = report["summary"]
    lines = [
        f"# {report['title']}",
        "",
        f"> Backend: `{report['backend']}` — {report['disclaimer']}",
        "",
        "## Snapshot",
        "",
        f"- **Normal protein states:** {s['normal_protein_states']}",
        f"- **Mutant protein states:** {s['mutant_protein_states']}",
        f"- **Disease-associated state detected:** {'Yes' if s['disease_associated_state_detected'] else 'No'}",
        f"- **Hydrophobic exposure:** {s['hydrophobic_exposure']}",
        f"- **Aggregation risk:** {s['aggregation_risk']}",
        f"- **Actin-binding region stability:** {s['actin_binding_region_stability']}",
        f"- **Potential transient pocket:** {s['potential_transient_pocket']}",
        f"- **Flexibility near G118:** {s['flexibility_near_g118']}",
        f"- **Hydrogen bonding:** {s['hydrogen_bonding']}",
        "",
        "## What changed (mutant − WT feature means)",
        "",
    ]
    delta = report["mean_features"]["delta_mutant_minus_wt"]
    for k, v in delta.items():
        lines.append(f"- `{k}`: {v:+.3f}")
    lines += ["", "## Disease-associated mutant states", ""]
    for st in report["disease_associated_states"]:
        lines.append(
            f"- Cluster {st['cluster_id']}: fraction {st['fraction']}, "
            f"disease score {st['disease_relevance_score']}, "
            f"rep frame {st['representative_frame']}"
        )
    if not report["disease_associated_states"]:
        lines.append("- None ranked above threshold")
    lines += ["", "## Transient pockets", ""]
    for p in report["transient_druggable_pockets"]:
        lines.append(
            f"- Cluster {p['cluster_id']}: druggability {p['druggability_score']}, "
            f"fraction {p['fraction']}"
        )
    if not report["transient_druggable_pockets"]:
        lines.append("- None detected at current thresholds")
    lines += [
        "",
        "## Storage policy",
        "",
        report["storage_policy"],
        "",
        "## Pipeline",
        "",
    ]
    for step in report["pipeline"]:
        lines.append(f"1. {step}")
    lines += ["", "---", "*RockGen Protein Dynamics Engine (PoC).*", ""]
    return "\n".join(lines)
