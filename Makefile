.PHONY: up down logs seed api web install lint dig health ingest-pfn1 ingest-tuba4a

COMPOSE := docker compose -f infra/docker-compose.yml
export DOCKER_HOST ?= unix://$(HOME)/.colima/default/docker.sock
export NEO4J_URI ?= bolt://localhost:7687
export NEO4J_USER ?= neo4j
export NEO4J_PASSWORD ?= rockgen-dev-password

# Prefer nvm Node LTS when available (avoids system Node 16)
NVM_INIT := export NVM_DIR="$$HOME/.nvm"; \
	[ -s "$$NVM_DIR/nvm.sh" ] && . "$$NVM_DIR/nvm.sh"; \
	[ -f .nvmrc ] && nvm use >/dev/null || nvm use default >/dev/null || true

up:
	@colima status >/dev/null 2>&1 || colima start
	$(COMPOSE) up -d
	@echo "Neo4j Browser: http://localhost:7474"

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f neo4j

health:
	@curl -sf http://localhost:8000/health | python3 -m json.tool || echo "API not running"
	@curl -sf -o /dev/null -w "web: %{http_code}\n" http://localhost:3000/ || echo "Web not running"

seed:
	cd services/graph && uv run python -m rockgen_graph.seed

ingest-pfn1:
	cd services/ingestion && uv run python -m rockgen_ingestion.cli ingest-pfn1

ingest-tuba4a:
	cd services/ingestion && uv run python -m rockgen_ingestion.cli ingest-tuba4a

install:
	cd apps/api && uv sync
	cd services/graph && uv sync
	cd services/ingestion && uv sync
	cd services/simulations && uv sync
	cd services/disease && uv sync
	@$(NVM_INIT); cd apps/web && npm install

api:
	@if lsof -iTCP:8000 -sTCP:LISTEN >/dev/null 2>&1; then \
		echo "API already listening on :8000 — open http://localhost:8000/health"; \
		curl -sf http://localhost:8000/health | python3 -m json.tool; \
	else \
		cd apps/api && uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000; \
	fi

web:
	@$(NVM_INIT); \
	if ! node -v | grep -Eq 'v(1[8-9]|[2-9][0-9])'; then \
		echo "Need Node 18+. Run: nvm use && make web"; \
		node -v; \
		exit 1; \
	fi; \
	if lsof -iTCP:3000 -sTCP:LISTEN >/dev/null 2>&1; then \
		echo "Web already listening on :3000 — open http://localhost:3000/diseases/als"; \
	else \
		cd apps/web && npm run dev; \
	fi

dig:
	@echo "=== RockGen module map ==="
	@find apps services packages docs infra -maxdepth 2 -type d | sort

lint:
	cd apps/api && uv run ruff check . || true
	@$(NVM_INIT); cd apps/web && npm run lint || true
