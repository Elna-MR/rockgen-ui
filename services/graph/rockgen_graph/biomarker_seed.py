"""ALS fluid-biomarker seed: what each marker can and cannot tell you.

Curated summaries, not ingested claims. Each entry carries a `curation_status` so the UI can say
that citations still need review before the content is used outside the team.
"""

from __future__ import annotations

from typing import Any

CURATION_STATUS = "curated_pending_citation_review"

# context_of_use: diagnostic | prognostic | pharmacodynamic | stratification
# evidence_level: strong | moderate | emerging
BIOMARKERS: list[dict[str, Any]] = [
    {
        "id": "nfl-serum",
        "name": "Neurofilament light chain (NfL)",
        "specimen": ["serum", "plasma", "CSF"],
        "context_of_use": ["prognostic", "pharmacodynamic"],
        "evidence_level": "strong",
        "evidence_note": (
            "Consistently elevated in ALS and tracks progression rate and survival. Plasma NfL "
            "reduction was used as a surrogate endpoint in the tofersen (SOD1) review."
        ),
        "limitation": "Rises in many neurological diseases; cannot diagnose ALS on its own.",
        "axes": [],
    },
    {
        "id": "pnfh",
        "name": "Phosphorylated neurofilament heavy chain (pNfH)",
        "specimen": ["CSF", "serum", "plasma"],
        "context_of_use": ["prognostic", "pharmacodynamic"],
        "evidence_level": "strong",
        "evidence_note": (
            "Behaves like NfL as a marker of axonal injury, with prognostic value reported "
            "in CSF and blood."
        ),
        "limitation": "Same low disease specificity as NfL; assays differ between labs.",
        "axes": [],
    },
    {
        "id": "chit1-csf",
        "name": "Chitotriosidase 1 (CHIT1)",
        "specimen": ["CSF"],
        "context_of_use": ["prognostic", "pharmacodynamic"],
        "evidence_level": "moderate",
        "evidence_note": (
            "Reflects microglial activation. Higher CSF levels are reported in ALS and relate "
            "to faster progression in several cohorts."
        ),
        "limitation": "Needs a lumbar puncture; also raised in other neuroinflammatory conditions.",
        "axes": ["neuroinflammation"],
    },
    {
        "id": "stmn2-truncated",
        "name": "Truncated STMN2 (cryptic exon)",
        "specimen": ["CSF", "neuronal tissue"],
        "context_of_use": ["diagnostic", "stratification", "pharmacodynamic"],
        "evidence_level": "emerging",
        "evidence_note": (
            "Loss of nuclear TDP-43 lets a cryptic exon into STMN2 RNA. Truncated STMN2 signals "
            "TDP-43 loss of function, and fluid assays are under development."
        ),
        "limitation": "Assays are early and not validated across cohorts or against NfL.",
        "axes": ["rna_metabolism"],
    },
    {
        "id": "tdp43-seed-amp",
        "name": "TDP-43 seed amplification assay",
        "specimen": ["CSF"],
        "context_of_use": ["diagnostic", "stratification"],
        "evidence_level": "emerging",
        "evidence_note": (
            "Seed amplification (RT-QuIC style) aims to detect misfolded TDP-43 in fluid, which "
            "could identify the TDP-43 pathology present in most ALS."
        ),
        "limitation": "Research use only; sensitivity and specificity are not established.",
        "axes": ["protein_homeostasis"],
    },
]

_UPSERT = """
MATCH (d:Disease {slug: $slug})
MERGE (b:Biomarker {id: $id})
SET b.name = $name,
    b.specimen = $specimen,
    b.context_of_use = $context_of_use,
    b.evidence_level = $evidence_level,
    b.evidence_note = $evidence_note,
    b.limitation = $limitation,
    b.curation_status = $curation_status
MERGE (b)-[:INDICATES]->(d)
WITH b
UNWIND $axes AS axis_id
MATCH (ax:DiseaseAxis {id: axis_id})
MERGE (b)-[:REFLECTS]->(ax)
"""

def seed_biomarkers(session, slug: str = "als") -> None:
    for b in BIOMARKERS:
        params = {**b, "slug": slug, "curation_status": CURATION_STATUS}
        session.run(_UPSERT, params)
    seed_data_sources(session)


# Target ALS Data Engine collections, from its public collections page. Which analytes each
# collection actually holds is unconfirmed until we have an account, so the biomarker links
# below are candidates only.
DATA_ENGINE_URL = "https://dataengine.targetals.org/collections"

DATA_SOURCES: list[dict[str, Any]] = [
    {
        "id": "tals-natural-history",
        "name": "Global Natural History Study",
        "description": "Longitudinal biofluid data from people with ALS and healthy controls.",
        "informs": ["nfl-serum", "pnfh", "chit1-csf"],
    },
    {
        "id": "tals-community-clinics",
        "name": "Community Based Clinics",
        "description": "One-time blood samples from a large clinic-based cohort.",
        "informs": ["nfl-serum", "pnfh"],
    },
    {
        "id": "tals-postmortem",
        "name": "Postmortem Tissue Core",
        "description": "Brain and spinal cord tissue from ALS, FTD, ALS-FTD and control donors.",
        "informs": ["stmn2-truncated", "tdp43-seed-amp"],
    },
    {
        "id": "tals-stem-cell",
        "name": "Stem Cell Core",
        "description": "iPSC and motor neuron lines from ALS and non-neurological subjects.",
        "informs": ["stmn2-truncated"],
    },
]

_UPSERT_SOURCE = """
MERGE (s:DataSource {id: $id})
SET s.name = $name,
    s.provider = 'Target ALS Data Engine',
    s.description = $description,
    s.url = $url,
    s.access_status = 'not_connected'
WITH s
UNWIND $informs AS bio_id
MATCH (b:Biomarker {id: bio_id})
MERGE (s)-[:CAN_INFORM]->(b)
"""


def seed_data_sources(session) -> None:
    for src in DATA_SOURCES:
        session.run(_UPSERT_SOURCE, {**src, "url": DATA_ENGINE_URL})
