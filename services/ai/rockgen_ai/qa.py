"""Evidence-backed Q&A — single retrieval + generation path (no multi-agent)."""

from __future__ import annotations

import json
import os
from typing import Any

import httpx

from rockgen_graph import queries

STARTER_QUESTIONS = [
    "Why is the PFN1 G118V mutation dangerous?",
    "What evidence shows that mutant PFN1 aggregates?",
    "Which studies are computational and which are experimental?",
    "What remains scientifically unproven?",
    "What therapeutic hypothesis follows from these findings?",
]


def classify_entities(question: str) -> dict[str, str]:
    q = question.lower()
    mutation_key = "PFN1:G118V"
    uniprot_id = "P07737"
    disease = "als"
    if "tuba4a" in q:
        # reserved for future reuse — still default to PFN1 for this milestone
        pass
    if "g118v" in q or "118" in q:
        mutation_key = "PFN1:G118V"
    return {"mutation_key": mutation_key, "uniprot_id": uniprot_id, "disease": disease}


def answer_question(question: str) -> dict[str, Any]:
    entities = classify_entities(question)
    context = queries.retrieve_for_question(
        mutation_key=entities["mutation_key"],
        uniprot_id=entities["uniprot_id"],
    )
    citations = _citations_from_context(context)
    evidence_levels = sorted(
        {
            e.get("evidence_type")
            for e in context.get("evidence") or []
            if e.get("evidence_type")
        }
    )
    unproven = [
        {
            "claim": u.get("claim"),
            "topic": u.get("topic"),
            "reason": "low confidence or not yet validated",
        }
        for u in context.get("unproven") or []
    ]

    api_key = os.environ.get("OPENAI_API_KEY")
    if api_key:
        try:
            answer = _openai_answer(question, context, api_key)
        except Exception as exc:  # noqa: BLE001
            answer = _template_answer(question, context) + f"\n\n_(LLM unavailable: {exc}; template answer used.)_"
    else:
        answer = _template_answer(question, context)

    return {
        "question": question,
        "answer": answer,
        "entities": entities,
        "citations": citations,
        "evidence_levels": evidence_levels,
        "unproven": unproven,
        "causal_chain": context.get("causal_chain") or [],
    }


def _citations_from_context(context: dict) -> list[dict]:
    seen: set[str] = set()
    out: list[dict] = []
    for e in context.get("evidence") or []:
        paper = e.get("paper") or {}
        cid = paper.get("id") or e.get("evidence_id")
        if not cid or cid in seen:
            continue
        seen.add(cid)
        out.append(
            {
                "id": cid,
                "title": paper.get("title") or e.get("citation"),
                "year": paper.get("year") or e.get("publication_date"),
                "url": paper.get("url") or e.get("source_url"),
                "evidence_type": e.get("evidence_type"),
                "confidence": e.get("confidence"),
            }
        )
    for p in context.get("papers") or []:
        if p.get("id") and p["id"] not in seen:
            seen.add(p["id"])
            out.append(
                {
                    "id": p["id"],
                    "title": p.get("title"),
                    "year": p.get("year"),
                    "url": p.get("url"),
                    "evidence_type": None,
                    "confidence": None,
                }
            )
    return out[:25]


def _template_answer(question: str, context: dict) -> str:
    q = question.lower()
    chain = context.get("causal_chain") or []
    chain_txt = " → ".join(c.get("name") or c.get("id") for c in chain) if chain else "not yet linked"
    claims = context.get("claims") or []
    evidence = context.get("evidence") or []

    if "unproven" in q or "not proven" in q or "remain" in q:
        lines = ["Based on the RockGen evidence graph, these points remain weakly supported or unvalidated:"]
        for u in context.get("unproven") or []:
            lines.append(f"- {u.get('claim')} (topic: {u.get('topic')})")
        if len(lines) == 1:
            lines.append("- No low-confidence claims are currently flagged.")
        lines.append("\nCitations are limited to papers already stored in Neo4j.")
        return "\n".join(lines)

    if "computational" in q or "experimental" in q or "which studies" in q:
        by_type: dict[str, list[str]] = {}
        for e in evidence:
            t = e.get("evidence_type") or "unknown"
            by_type.setdefault(t, []).append(e.get("citation") or e.get("evidence_id"))
        lines = ["Evidence types currently linked to PFN1/G118V claims:"]
        for t, items in sorted(by_type.items()):
            lines.append(f"\n{t}:")
            for item in items[:5]:
                lines.append(f"- {item}")
        return "\n".join(lines)

    if "therapeutic" in q or "hypothesis" in q or "drug" in q:
        therap = [c for c in claims if "therapeutic" in (c.get("topic") or "")]
        if therap:
            c = therap[0]
            return (
                f"Therapeutic hypothesis on the graph: {c.get('claim')}. "
                f"Evidence summary: {c.get('evidence_summary')}; confidence={c.get('confidence')}. "
                "This is marked as not yet clinically validated and must not be overstated."
            )
        return "No therapeutic hypothesis claim is present in the graph yet."

    if "aggregat" in q:
        agg = [c for c in claims if c.get("topic") == "aggregation"]
        bits = []
        for c in agg:
            bits.append(f"{c.get('claim')} — evidence: {c.get('evidence_summary')} (confidence {c.get('confidence')})")
        cites = [e.get("citation") for e in evidence if e.get("claim_topic") == "aggregation"]
        return (
            "Aggregation evidence for mutant PFN1:\n- "
            + "\n- ".join(bits or ["No aggregation claim found"])
            + "\n\nSupporting citations on graph: "
            + "; ".join(c for c in cites if c)
        )

    # default: why dangerous
    claim_lines = [f"- {c.get('claim')} [{c.get('evidence_summary')}]" for c in claims]
    return (
        f"In the RockGen knowledge graph, {context.get('mutation_key')} is linked along the path:\n"
        f"{chain_txt}\n\n"
        "Major claims with evidence types:\n"
        + ("\n".join(claim_lines) if claim_lines else "- No claims linked yet; run `make ingest-pfn1`.")
        + "\n\nAnswer is constrained to stored graph evidence; ClinVar assertions are kept separate from paper-derived claims."
    )


def _openai_answer(question: str, context: dict, api_key: str) -> str:
    system = (
        "You are RockGen's evidence scientist. Answer ONLY using the JSON context. "
        "Cite paper ids (pmid:...) when making claims. "
        "Distinguish computational vs experimental vs animal vs human_genetic evidence. "
        "Explicitly call out what is unproven. Do not invent papers or results."
    )
    user = json.dumps({"question": question, "context": context}, default=str)
    with httpx.Client(timeout=60.0) as client:
        resp = client.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                "temperature": 0.2,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
            },
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
