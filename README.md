# RockGen Scientific Platform

The scientific operating system for disease programs, protein intelligence, and evidence-backed therapeutic research.

**Phase 1 focus:** Knowledge graph + Disease / Protein workspaces (ALS + PFN1). Not proprietary AI models.

## Prerequisites

- Node.js 22+ (LTS) via nvm — tested on Node 24 LTS
- Python 3.12+ via [uv](https://github.com/astral-sh/uv)
- [Colima](https://github.com/abiosoft/colima) + Docker CLI (Docker Desktop optional)

```bash
# Toolchain (once)
nvm install --lts && nvm use --lts
uv python install 3.12
brew install colima docker docker-compose
colima start
export DOCKER_HOST=unix://$HOME/.colima/default/docker.sock
```

## Quick start

```bash
cp .env.example .env
make up          # Neo4j on :7474 / :7687
make install     # Python + Node deps
make seed        # ALS + PFN1 knowledge graph
```

Then in **two separate terminals** (do not paste the `# terminal` comments):

```bash
# Terminal A — API
cd rock-gen && make api

# Terminal B — Web (loads nvm Node from .nvmrc)
cd rock-gen && make web
```

Open [http://localhost:3000/diseases/als](http://localhost:3000/diseases/als).

If you see `Address already in use` or Node 16 errors, the stack may already be running — check with `make health`, or switch Node first:

```bash
nvm use          # uses .nvmrc → Node 24
make health
```

## Monorepo layout

| Path | Role | Status |
|------|------|--------|
| `apps/web` | Disease & Protein workspaces | Phase 1 |
| `apps/api` | FastAPI gateway | Phase 1 |
| `services/graph` | Neo4j schema, seed, queries | Phase 1 |
| `services/ingestion` | UniProt / PDB / literature adapters | Phase 1 scaffold |
| `services/ai` | LLM client interface | Scaffold |
| `services/agents` | Specialized scientific agents | Scaffold |
| `services/simulations` | Dynamics / aggregation pipelines | Scaffold |
| `services/experiments` | Lab result memory | Scaffold |
| `services/reports` | Protein health reports | Scaffold |
| `infra/` | Docker Compose (Neo4j) | Phase 1 |
| `docs/` | Architecture & roadmap | Phase 1 |

## First milestone

1. Disease Workspace (ALS)
2. Protein Workspace (PFN1)
3. Biological knowledge graph in Neo4j
4. Curated ALS literature / mutation / trial seed data

See [docs/roadmap.md](docs/roadmap.md) and [docs/architecture.md](docs/architecture.md).
