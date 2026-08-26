# RockGen API — build from monorepo root (needs services/* path deps)
FROM python:3.12-slim-bookworm

COPY --from=ghcr.io/astral-sh/uv:0.8.4 /uv /usr/local/bin/uv

WORKDIR /app

# Sibling packages required by apps/api path dependencies
COPY services/graph /app/services/graph
COPY services/reasoning /app/services/reasoning
COPY services/simulations /app/services/simulations
COPY services/disease /app/services/disease
COPY apps/api /app/apps/api

WORKDIR /app/apps/api

RUN uv sync --frozen --no-dev || uv sync --no-dev

ENV PATH="/app/apps/api/.venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
