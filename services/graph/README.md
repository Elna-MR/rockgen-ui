# services/graph

**Status:** Phase 1

Neo4j schema, constraints, seed data (ALS / PFN1), and typed query helpers used by the API.

```bash
cd services/graph
uv sync
uv run python -m rockgen_graph.seed
```
