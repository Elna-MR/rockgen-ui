# apps/api

**Status:** Phase 1

FastAPI gateway over the RockGen knowledge graph.

```bash
cd apps/api
uv sync
uv run uvicorn app.main:app --reload --port 8000
```

Endpoints:
- `GET /health`
- `GET /v1/diseases`
- `GET /v1/diseases/{slug}`
- `GET /v1/diseases/{slug}/graph`
- `GET /v1/proteins/{uniprot_id}`
- `GET /v1/mutations/{key}/path`
