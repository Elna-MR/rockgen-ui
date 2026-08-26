"""Ingestion CLI."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from rockgen_graph.seed import seed_graph
from rockgen_ingestion.adapters.uniprot import fetch_uniprot
from rockgen_ingestion.pipeline import ingest_pfn1, ingest_tuba4a

FIXTURES = Path(__file__).resolve().parent.parent / "fixtures" / "als_pfn1.json"


def cmd_seed_fixtures() -> None:
    data = json.loads(FIXTURES.read_text())
    print(f"Loaded fixture catalog for disease={data['disease']['slug']}")
    seed_graph()
    print("Graph seeded from fixtures + Cypher seed.")


def cmd_fetch_uniprot(accession: str) -> None:
    record = fetch_uniprot(accession)
    print(json.dumps(record, indent=2))


def cmd_ingest_pfn1() -> None:
    ingest_pfn1()


def cmd_ingest_tuba4a() -> None:
    ingest_tuba4a()


def main() -> None:
    parser = argparse.ArgumentParser(prog="rockgen-ingest")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("seed-fixtures", help="Apply ALS/PFN1 fixture seed into Neo4j")
    sub.add_parser("ingest-pfn1", help="Full PFN1 evidence intelligence ingest")
    sub.add_parser("ingest-tuba4a", help="Full TUBA4A evidence intelligence ingest")

    fetch = sub.add_parser("fetch-uniprot", help="Fetch a UniProt accession (live)")
    fetch.add_argument("accession")

    args = parser.parse_args()
    if args.command == "seed-fixtures":
        cmd_seed_fixtures()
    elif args.command == "fetch-uniprot":
        cmd_fetch_uniprot(args.accession)
    elif args.command == "ingest-pfn1":
        cmd_ingest_pfn1()
    elif args.command == "ingest-tuba4a":
        cmd_ingest_tuba4a()


if __name__ == "__main__":
    main()
