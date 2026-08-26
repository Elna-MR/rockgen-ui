# Architecture

## Layering (service-first)

```
Clients (Next.js, future agents, notebooks)
    │
    ▼
API (FastAPI — thin)
    │
    ├── Disease Intelligence   services/disease
    ├── Protein Intelligence   (today: rockgen_reasoning.protein_state)
    ├── Evidence / Reasoning   services/reasoning (+ future services/evidence)
    ├── Dynamics               services/simulations
    └── Ingestion              services/ingestion
    │
    ▼
Knowledge Graph (Neo4j)  ← source of truth
```

**Rule:** UI panels are views of services. Scientific facts must not live only in `apps/web/src/data/*.ts`.

## Domain services (target ownership)

| Domain | Package | Owns |
|--------|---------|------|
| Graph | `services/graph` | Schema, constraints, seed, Cypher |
| Disease | `services/disease` | Disease/protein intelligence dossiers from graph |
| Evidence | (extract next) | Claims, support, contradictions, confidence |
| Protein | (extract next) | State scores, compare, structures |
| Dynamics | `services/simulations` | Job schema + backends (demo → MD) |
| Therapeutic | (later) | Mechanism ranking → candidates |
| Learning | (later) | Experiments feedback |

## Why Neo4j first

Biology is relationships. RockGen is **mechanism-centric**: Disease → DiseaseAxis → Mechanism ← Protein, with mutations, pathways, biomarkers, and trials attached. A graph is the source of truth; documents and vectors are secondary indexes for RAG later.

## Core graph model

| Node | Key | Notes |
|------|-----|-------|
| Disease | `slug` | e.g. `als` |
| DiseaseAxis | `id` | e.g. `cytoskeleton`, `rna_metabolism` |
| Mechanism | `id` | e.g. `aggregation`, `microtubule_instability` |
| Gene | `symbol` | e.g. `PFN1`, `TUBA4A` |
| Protein | `uniprot_id` | e.g. `P07737`, `P68366` |
| Mutation | `key` | e.g. `PFN1:G118V`, `TUBA4A:R320C` |
| Structure | `id` | PDB / AlphaFold accession |
| Pathway | `id` | Reactome / curated |
| Paper | `pmid` or `doi` | Literature |
| ClinicalTrial | `nct_id` | ClinicalTrials.gov |
| Drug | `id` | Curated / ChEMBL later |
| Biomarker | `id` | Disease indicators |
| Phenotype | `id` | Legacy causal chain nodes; link to Mechanism |
| Claim | `id` | Scientific statement |
| Evidence | `id` | Support for a claim |

### Relationships

- `Disease-[:ASSOCIATED_WITH]->Gene-[:ENCODES]->Protein`
- `Protein-[:HAS_MUTATION]->Mutation-[:LINKED_TO]->Disease`
- `Mutation-[:CAUSES]->Phenotype` (causal chain)
- `Mutation-[:CAUSES_CHANGE|INCREASES_RISK|ASSOCIATED_WITH]->Claim`
- `Claim-[:SUPPORTED_BY]->Evidence-[:FROM_PAPER]->Paper`
- `Phenotype-[:CONTRIBUTES_TO]->Disease`
- `Protein-[:IMPLICATED_IN {level}]->Mechanism`
- `Mechanism-[:LEADS_TO]->Mechanism`
- `Mechanism-[:IN_AXIS]->DiseaseAxis-[:PART_OF]->Disease`
- `Phenotype-[:MAPS_TO]->Mechanism` (bridge)
- `Protein-[:HAS_STRUCTURE]->Structure`
- `Protein-[:IN_PATHWAY]->Pathway`
- `Protein-[:INTERACTS_WITH]->Protein`
- `*-[:MENTIONED_IN]->Paper`
- `Disease-[:STUDIED_IN]->ClinicalTrial`
- `Drug-[:INDICATED_FOR]->Disease` (TARGETS→Protein later)
- `Biomarker-[:INDICATES]->Disease`

Shared axes (aggregation, axonal transport, neuroinflammation) are reusable across neurodegenerative diseases later.

## Disease Intelligence Engine

```
PFN1
  → Knowledge Graph
  → Mutations + causal paths
  → Claims + Evidence + Papers
  → Confidence (deterministic)
  → Mechanisms / pathways / biomarkers / drugs
  → Dossier + markdown report
```

Endpoints: `/v1/intelligence/proteins/{id}`, `/v1/intelligence/diseases/{slug}`.

## Protein Dynamics Engine

Molecular dynamics produces a **trajectory of conformational frames** (atomic coordinates over
time), not a folder of screenshots.

```
Structure → mutation → MD (or import) → sampled frames
    → features (RMSD, RMSF, H-bonds, Rg, hydrophobic exposure, agg risk, pockets)
    → cluster states → rare / disease-associated selection → Dynamics Report
    → (later) Therapeutic Design on few representative conformations
```

**Store:** trajectories (`.xtc`/`.dcd`), metadata, feature tables, representatives.  
**Do not store:** one million PNG files. Render images on demand for selected frames only.

PoC endpoint: `GET /v1/dynamics/pfn1/g118v` (`services/simulations`).
