"""Cluster conformational feature vectors into major states."""

from __future__ import annotations

import math
import random
from typing import Any

from rockgen_simulations.schema import FEATURE_KEYS


def _dist(a: list[float], b: list[float]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def cluster_frames(
    samples: list[dict[str, Any]],
    *,
    k: int = 6,
    seed: int = 42,
    max_iter: int = 25,
) -> dict[str, Any]:
    """Lloyd k-means on feature vectors; returns clusters + assignments."""
    rng = random.Random(seed)
    if not samples:
        return {"k": 0, "clusters": [], "assignments": []}

    vecs = [[float(s["features"][key]) for key in FEATURE_KEYS] for s in samples]
    n = len(vecs)
    k = min(k, n)
    centroids = [vecs[i] for i in rng.sample(range(n), k)]

    assignments = [0] * n
    for _ in range(max_iter):
        changed = False
        for i, v in enumerate(vecs):
            best = min(range(k), key=lambda c: _dist(v, centroids[c]))
            if assignments[i] != best:
                assignments[i] = best
                changed = True
        # update
        for c in range(k):
            members = [vecs[i] for i, a in enumerate(assignments) if a == c]
            if not members:
                centroids[c] = vecs[rng.randrange(n)]
                continue
            dim = len(members[0])
            centroids[c] = [sum(m[d] for m in members) / len(members) for d in range(dim)]
        if not changed:
            break

    clusters = []
    for c in range(k):
        idxs = [i for i, a in enumerate(assignments) if a == c]
        if not idxs:
            continue
        size = len(idxs)
        mean = {
            FEATURE_KEYS[d]: round(sum(vecs[i][d] for i in idxs) / size, 4)
            for d in range(len(FEATURE_KEYS))
        }
        # representative = closest to centroid
        rep = min(idxs, key=lambda i: _dist(vecs[i], centroids[c]))
        # disease score proxy
        disease_score = (
            mean["agg_propensity_proxy"] * 0.35
            + mean["hydrophobic_sasa_proxy"] * 0.25
            + mean["rmsf_peak_near_mutation"] * 0.2
            + (1.0 - mean["actin_interface_stability"]) * 0.1
            + mean["pocket_volume_proxy"] * 0.1
        )
        clusters.append(
            {
                "cluster_id": c,
                "size": size,
                "fraction": round(size / n, 4),
                "representative_sample_index": rep,
                "representative_frame": samples[rep].get("frame_index"),
                "mean_features": mean,
                "disease_relevance_score": round(disease_score, 4),
                "druggability_score": round(mean["pocket_volume_proxy"] * (0.5 + mean["agg_propensity_proxy"] * 0.5), 4),
            }
        )
    clusters.sort(key=lambda x: -x["disease_relevance_score"])
    return {"k": len(clusters), "clusters": clusters, "assignments": assignments}
