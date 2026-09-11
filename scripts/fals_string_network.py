#!/usr/bin/env python3
"""
Build a familial-ALS gene interaction network from STRING and emit graph.json
in the shape consumed by the RockGen D3 force-directed viewer at
/diseases/als/network (apps/web/public/data/fals-network.json).

Usage
-----
    python fals_string_network.py                       # functional network, score >= 400
    python fals_string_network.py --physical            # physical subnetwork only
    python fals_string_network.py --score 700 --channels experiments database

Notes
-----
STRING's default `score` is the combined score, which folds in text-mining and
co-expression. For a gene set like this one -- where every member is co-mentioned
in the same ALS literature -- text-mining inflates edges between genes that have
no demonstrated physical or pathway relationship. For anything you intend to
interpret mechanistically, prefer either:

  * --physical                          (STRING's physical-subnetwork view), or
  * --channels experiments database     (recompute a score from those channels only)

Requires: requests
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import requests

STRING_API = "https://string-db.org/api"
SPECIES = 9606
CALLER = "fals-network-builder"

# gene -> (functional module, approximate % of familial ALS cases)
# Frequencies are order-of-magnitude estimates from European-ancestry cohorts and
# vary substantially by population; C9orf72 in particular is far rarer in East Asia.
GENES = {
    "TARDBP": ("rna", 4.5), "FUS": ("rna", 4.5), "MATR3": ("rna", 0.5),
    "HNRNPA1": ("rna", 0.3), "HNRNPA2B1": ("rna", 0.2), "TAF15": ("rna", 0.2),
    "EWSR1": ("rna", 0.2), "ANXA11": ("rna", 1.0), "TIA1": ("rna", 0.3),
    "ATXN2": ("rna", 1.5), "GLE1": ("rna", 0.2), "ARPP21": ("rna", 0.2),
    "C9orf72": ("pro", 35.0), "SQSTM1": ("pro", 1.0), "OPTN": ("pro", 0.8),
    "TBK1": ("pro", 1.5), "VCP": ("pro", 1.0), "UBQLN2": ("pro", 0.8),
    "CHMP2B": ("pro", 0.2), "VAPB": ("pro", 0.3), "DNAJC7": ("pro", 0.4),
    "PFN1": ("cyt", 0.5), "KIF5A": ("cyt", 1.5), "TUBA4A": ("cyt", 0.5),
    "DCTN1": ("cyt", 0.3), "NEFH": ("cyt", 0.3), "PRPH": ("cyt", 0.2),
    "ALS2": ("cyt", 0.3), "SPG11": ("cyt", 0.3),
    "SOD1": ("mit", 17.5), "CHCHD10": ("mit", 0.5), "FIG4": ("mit", 0.3),
    "SIGMAR1": ("mit", 0.3), "ANG": ("mit", 0.4), "SPTLC1": ("mit", 0.2),
    "GLT8D1": ("mit", 0.2), "DAO": ("mit", 0.2), "CAV1": ("mit", 0.2),
    "ERBB4": ("mit", 0.2),
    "NEK1": ("ddr", 2.0), "CCNF": ("ddr", 0.8), "CFAP410": ("ddr", 0.4),
    "SETX": ("ddr", 0.4),
    "UNC13A": ("oth", 0.05), "STMN2": ("oth", 0.05), "SARM1": ("oth", 0.2),
}

# STRING TSV column -> channel name
CHANNEL_COLS = {
    "neighborhood": "nscore", "fusion": "fscore", "cooccurence": "pscore",
    "coexpression": "ascore", "experiments": "escore", "database": "dscore",
    "textmining": "tscore",
}


def post_tsv(endpoint, params, retries=3):
    url = f"{STRING_API}/tsv/{endpoint}"
    for attempt in range(retries):
        r = requests.post(url, data=params, timeout=60)
        if r.ok:
            lines = r.text.rstrip("\n").split("\n")
            header = lines[0].split("\t")
            return [dict(zip(header, ln.split("\t"))) for ln in lines[1:]]
        if attempt == retries - 1:
            sys.exit(f"STRING request failed: {r.status_code} {r.reason}")
        time.sleep(2 ** attempt)


def resolve(symbols):
    """Map symbols to STRING IDs, reporting anything that fails to resolve."""
    rows = post_tsv("get_string_ids", {
        "identifiers": "\r".join(symbols), "species": SPECIES,
        "limit": 1, "echo_query": 1, "caller_identity": CALLER,
    })
    mapped = {r["queryItem"]: r["preferredName"] for r in rows}
    missing = sorted(set(symbols) - set(mapped))
    if missing:
        print(f"warning: unresolved by STRING: {', '.join(missing)}", file=sys.stderr)
    return mapped


def fetch_network(symbols, required_score, physical):
    params = {
        "identifiers": "\r".join(symbols), "species": SPECIES,
        "required_score": required_score, "caller_identity": CALLER,
    }
    if physical:
        params["network_type"] = "physical"
    return post_tsv("network", params)


def build(args):
    symbols = sorted(GENES)
    resolved = resolve(symbols)
    rows = fetch_network(symbols, args.score, args.physical)

    links, seen = [], set()
    for r in rows:
        a, b = r["preferredName_A"], r["preferredName_B"]
        if a not in GENES or b not in GENES:
            continue
        key = tuple(sorted((a, b)))
        if key in seen:
            continue
        seen.add(key)

        if args.channels:
            # Naive recombination: 1 - prod(1 - channel). Good enough for weighting
            # edge thickness; it is not STRING's own prior-corrected formula.
            p = 1.0
            for ch in args.channels:
                p *= 1.0 - float(r.get(CHANNEL_COLS[ch], 0) or 0)
            w = round(1.0 - p, 3)
            if w < args.score / 1000:
                continue
        else:
            w = round(float(r["score"]), 3)

        links.append({
            "source": key[0], "target": key[1], "w": w,
            **{ch: round(float(r.get(col, 0) or 0), 3)
               for ch, col in CHANNEL_COLS.items()},
        })

    degree = {}
    for l in links:
        degree[l["source"]] = degree.get(l["source"], 0) + 1
        degree[l["target"]] = degree.get(l["target"], 0) + 1

    nodes = [{
        "id": g, "mod": mod, "f": pct,
        "string_name": resolved.get(g), "degree": degree.get(g, 0),
    } for g, (mod, pct) in sorted(GENES.items())]

    graph = {
        "meta": {
            "source": "STRING", "species": SPECIES,
            "network_type": "physical" if args.physical else "functional",
            "required_score": args.score,
            "weight": ("recombined:" + "+".join(args.channels)) if args.channels
                      else "combined_score",
            "retrieved": time.strftime("%Y-%m-%d"),
        },
        "nodes": nodes, "links": links,
    }

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w") as fh:
        json.dump(graph, fh, indent=2)

    orphans = [n["id"] for n in nodes if n["degree"] == 0]
    print(f"{len(nodes)} nodes, {len(links)} edges -> {out_path}")
    if orphans:
        print(f"{len(orphans)} unconnected at this threshold: {', '.join(orphans)}")


if __name__ == "__main__":
    # Default into the Next.js public data path used by /diseases/als/network
    default_out = (
        Path(__file__).resolve().parents[1]
        / "apps"
        / "web"
        / "public"
        / "data"
        / "fals-network.json"
    )
    p = argparse.ArgumentParser(description=__doc__,
                                formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--score", type=int, default=400,
                   help="minimum STRING score, 0-1000 (default 400)")
    p.add_argument("--physical", action="store_true",
                   help="restrict to STRING's physical subnetwork")
    p.add_argument("--channels", nargs="*", choices=sorted(CHANNEL_COLS),
                   help="recompute weight from these evidence channels only")
    p.add_argument("--out", default=str(default_out),
                   help=f"output path (default: {default_out})")
    build(p.parse_args())
