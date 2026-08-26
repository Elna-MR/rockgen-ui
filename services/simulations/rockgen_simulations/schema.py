"""Dynamics data contracts — store trajectories + features, never a million PNGs."""

from __future__ import annotations

from typing import Any, Literal

BackendKind = Literal["demo_literature_aligned", "openmm", "gromacs", "imported_trajectory"]


def empty_frame_features() -> dict[str, Any]:
    return {
        "rmsd_ca": 0.0,
        "rg": 0.0,
        "hbond_count": 0.0,
        "salt_bridge_count": 0.0,
        "hydrophobic_sasa_proxy": 0.0,
        "agg_propensity_proxy": 0.0,
        "pocket_volume_proxy": 0.0,
        "rmsf_peak_near_mutation": 0.0,
        "actin_interface_stability": 0.0,
    }


FEATURE_KEYS = list(empty_frame_features().keys())
