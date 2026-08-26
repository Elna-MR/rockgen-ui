# services/ingestion

**Status:** Phase 1 complete (PFN1 evidence pipeline)

```bash
make ingest-pfn1
# or
cd services/ingestion && uv run python -m rockgen_ingestion.cli ingest-pfn1
```

| Adapter | Status | Source |
|---------|--------|--------|
| uniprot | writes to Neo4j | REST UniProt |
| pdb | writes to Neo4j | RCSB Search + Entry API |
| literature | writes to Neo4j | Europe PMC |
| clinvar | writes ClinVarAssertion separately | NCBI E-utilities |
| claims | curated YAML → Claim/Evidence | `fixtures/pfn1_claims.yaml` |
