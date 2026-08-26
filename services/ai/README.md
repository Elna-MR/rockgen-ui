# services/ai

**Status:** Phase 2 MVP (single evidence Q&A)

```bash
cd services/ai
uv sync
# Used by apps/api POST /v1/ask
```

Set `OPENAI_API_KEY` for LLM answers; otherwise deterministic template answers cite the graph.
