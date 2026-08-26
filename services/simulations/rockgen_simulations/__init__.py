"""Protein Dynamics Engine — trajectories, features, clusters (not image dumps).

PoC backends may use literature-aligned synthetic features; production backends
plug in OpenMM/GROMACS trajectories (.xtc/.dcd) without changing the report schema.
"""

from rockgen_simulations.engine import (
    compare_pfn1_wt_g118v,
    dynamics_report_markdown,
)

__all__ = ["compare_pfn1_wt_g118v", "dynamics_report_markdown"]
