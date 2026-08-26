"""Literature-aligned demo trajectory features for PFN1 WT vs G118V.

Does NOT claim experimental MD. Produces sampled feature streams shaped like
signals reported in PFN1 ALS MD / biophysical literature so the platform can
prove clustering → disease-state selection → report UX.

Swap this backend for OpenMM/GROMACS without changing report consumers.
"""

from __future__ import annotations

import math
import random
from typing import Any

from rockgen_simulations.schema import FEATURE_KEYS, empty_frame_features


def _clamp(x: float, lo: float = 0.0, hi: float = 1.0) -> float:
    return max(lo, min(hi, x))


def generate_demo_trajectory(
    *,
    label: str,
    mutant: bool,
    n_nominal_frames: int = 1_000_000,
    n_samples: int = 400,
    seed: int = 7,
) -> dict[str, Any]:
    """Return trajectory metadata + sparsely sampled per-frame features."""
    rng = random.Random(seed + (100 if mutant else 0))
    samples: list[dict[str, Any]] = []

    # Literature-aligned baselines (normalized proxies 0–1 where noted)
    # Mutant: higher RMSD/RMSF near 118, higher hydrophobic exposure / agg, lower H-bonds / actin stability
    base = {
        "rmsd_ca": 0.22 if not mutant else 0.38,
        "rg": 0.48 if not mutant else 0.55,
        "hbond_count": 0.72 if not mutant else 0.55,
        "salt_bridge_count": 0.60 if not mutant else 0.52,
        "hydrophobic_sasa_proxy": 0.35 if not mutant else 0.62,
        "agg_propensity_proxy": 0.28 if not mutant else 0.74,
        "pocket_volume_proxy": 0.18 if not mutant else 0.45,
        "rmsf_peak_near_mutation": 0.25 if not mutant else 0.78,
        "actin_interface_stability": 0.75 if not mutant else 0.42,
    }

    # Occasional rare high-agg / open-pocket excursions (more common in mutant)
    rare_rate = 0.02 if not mutant else 0.08

    for i in range(n_samples):
        frame_index = int(i * (n_nominal_frames / max(n_samples, 1)))
        t = i / max(n_samples - 1, 1)
        # slow drift + oscillation
        drift = 0.04 * math.sin(2 * math.pi * t * 3.0)
        noise = lambda s: rng.gauss(0, s)  # noqa: E731

        feats = empty_frame_features()
        for key in FEATURE_KEYS:
            feats[key] = _clamp(base[key] + drift * (0.5 if "hbond" in key or "actin" in key else 1.0) + noise(0.035))

        if rng.random() < rare_rate:
            feats["agg_propensity_proxy"] = _clamp(feats["agg_propensity_proxy"] + 0.25)
            feats["hydrophobic_sasa_proxy"] = _clamp(feats["hydrophobic_sasa_proxy"] + 0.2)
            feats["pocket_volume_proxy"] = _clamp(feats["pocket_volume_proxy"] + 0.3)
            feats["rmsd_ca"] = _clamp(feats["rmsd_ca"] + 0.12)
            rare = True
        else:
            rare = False

        samples.append(
            {
                "sample_index": i,
                "frame_index": frame_index,
                "time_ns_proxy": round(frame_index / n_nominal_frames * 100.0, 4),  # pretend 100 ns
                "features": {k: round(float(feats[k]), 4) for k in FEATURE_KEYS},
                "flags": {"rare_excursion": rare},
            }
        )

    return {
        "label": label,
        "backend": "demo_literature_aligned",
        "disclaimer": (
            "Demo trajectory features aligned to published PFN1 G118V dynamics / biophysics "
            "signals — not a raw experimental MD run. Replace with OpenMM/GROMACS trajectories."
        ),
        "protein": "PFN1",
        "uniprot_id": "P07737",
        "variant": "G118V" if mutant else "WT",
        "mutant": mutant,
        "n_frames_nominal": n_nominal_frames,
        "n_samples_stored": n_samples,
        "storage_note": (
            "Stores sampled feature vectors + metadata only — not one million PNG images. "
            "Coordinates / .xtc would live in object storage when a real backend is connected."
        ),
        "mutation_site": 118,
        "samples": samples,
    }
