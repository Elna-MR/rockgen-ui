# Roadmap

RockGen is the scientific operating system that AI models, experiments, and therapeutic programs run on.

**Pivot (locked):** Build the **scientific backend** before more React. Organize by **scientific domain services**, not UI panels. The UI is a client.

## Honest maturity (working scores)

| Area | Score | Note |
|------|------:|------|
| Vision | 10/10 | Mechanism-first scientific OS |
| Architecture | 9/10 | Graph + engines sketched correctly |
| UI/UX | 9/10 | Audience paths exist; risk is outrunning science |
| Scientific foundation | 5→6/10 | Neo4j + claims real; Disease Intelligence Engine started |
| AI platform | 3/10 | Deterministic Ask; agents scaffold |
| Data platform | 4/10 | Curated ingest; not yet industry-scale |

**Next six months:** almost entirely scientific services + graph depth — not more pages.

## Service map (target)

```
apps/web          → client only
apps/api          → thin HTTP
services/graph    → Neo4j schema, seed, queries
services/disease  → Disease Intelligence Engine ★ (current focus)
services/evidence → claim/evidence/confidence (extract from reasoning over time)
services/protein  → protein state / compare / structures
services/dynamics → simulation jobs + backends (demo → OpenMM/GROMACS)
services/therapeutic
services/learning → experiments + feedback
services/ingestion
```

## Disease Intelligence Engine (Phase 0–1 — NOW)

Answers from Neo4j:

```
Protein
  → mutations
  → papers
  → pathways / mechanisms
  → biomarkers
  → drugs / programs / trials
  → statements → evidence → confidence
```

API:
- `GET /v1/intelligence/proteins/{uniprot_id}`
- `GET /v1/intelligence/diseases/{slug}`
- `GET /v1/intelligence/proteins/{id}/report.md`

Acceptance: editing claim/evidence fixtures + re-ingest changes mutation cards **without** editing `apps/web/src/data/*.ts` scientific twins.

## Following phases (backend-first)

2. **Evidence Engine** — every statement → evidence → paper → experiment type → confidence (retire `pfn1Dossier` timeline/pathway static twins)
3. **Protein State Engine** — proprietary state scores from graph evidence (not hardcoded profile tables forever)
4. **Scientific Reasoning** — compose disease + evidence + state (Ask is the first thin client)
5. **Simulation Manager** — jobs/queue/status/results; plug MD backends later without UI rewrite

## What we are NOT doing next

- More dashboards / encyclopedia-style UI expansion as the main push
- Molecule generation
- ChatGPT-as-scientist without graph grounding

## Year 1 engines (unchanged intent)

Protein Dynamics · Disease Mechanism · Scientific Reasoning · Therapeutic Intelligence · Continuous Learning
