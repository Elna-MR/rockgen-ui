"""Disease Intelligence Engine — scientific domain service.

Answers from the knowledge graph (not static UI twins):

  Protein → mutations → papers → pathways → mechanisms
         → biomarkers → drugs/programs → trials
         → statements with evidence + confidence

UI and agents are clients of this service.
"""

from rockgen_disease.engine import (
    build_disease_intelligence,
    build_protein_intelligence,
)

__all__ = [
    "build_disease_intelligence",
    "build_protein_intelligence",
]
