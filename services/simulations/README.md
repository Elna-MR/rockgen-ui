# Protein Dynamics Engine
#
# Status: PoC — literature-aligned demo features for PFN1 WT vs G118V.
#
# What we store: trajectory metadata, sampled atomic/feature coordinates,
# cluster summaries, representative frame indices.
# What we do NOT store: one million PNG screenshots.
#
# Next: OpenMM/GROMACS backends that write .xtc/.dcd + feature tables into
# the same report schema (`compare_pfn1_wt_g118v`).

from rockgen_simulations.engine import compare_pfn1_wt_g118v, dynamics_report_markdown

__all__ = ["compare_pfn1_wt_g118v", "dynamics_report_markdown"]
