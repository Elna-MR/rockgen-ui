"""Scientific Review Engine — orchestrates deterministic review pipeline."""

from __future__ import annotations

import json
import os
from typing import Any

import httpx

from rockgen_reasoning.claim_normalizer import CLAIM_IDS, claim_topic_for, classify_question
from rockgen_reasoning.confidence import score_confidence
from rockgen_reasoning.contradiction_detector import split_by_stance
from rockgen_reasoning.gap_detector import detect_gaps
from rockgen_reasoning.graph_retriever import evidence_mix_counts, retrieve_claim_evidence
from rockgen_reasoning.hypothesis_generator import generate_hypotheses
from rockgen_reasoning.planner import plan
from rockgen_reasoning.schemas import (
    STARTER_QUESTIONS,
    CitationItem,
    EvidenceItem,
    ScientificReview,
)


def review(question: str) -> dict[str, Any]:
    qtype = classify_question(question)

    if qtype == "cross_protein_mechanism":  # type: ignore[comparison-overlap]
        from rockgen_reasoning.als_prioritization import cross_protein_mechanism_review

        return cross_protein_mechanism_review(question)

    topic = claim_topic_for(qtype, question)
    steps = plan(qtype, topic)

    bundle = retrieve_claim_evidence(claim_topic=topic)
    evidence = bundle.get("evidence") or []
    claim = bundle.get("claim") or {}
    claim_text = claim.get("text") or _default_claim_text(topic)
    claim_id = bundle.get("claim_id") or CLAIM_IDS.get(topic or "")

    if qtype == "unsupported":
        return ScientificReview(
            question=question,
            question_type=qtype,
            conclusion="Unsupported question type for this vertical",
            confidence=0,
            confidence_label="Insufficient",
            confidence_breakdown=[],
            confidence_note="This release only reviews PFN1/G118V science questions listed in starters.",
            summary="Ask one of the supported scientific review questions (structure, misfolding, aggregation, animal/human evidence, unproven, next experiment).",
            supporting_evidence=[],
            conflicting_evidence=[],
            conflicting_searched=True,
            conflicting_none_message=None,
            evidence_mix={"computational": 0, "in_vitro": 0, "animal": 0, "human_genetic": 0, "clinical": 0},
            gaps=[],
            suggested_next_steps=[],
            citations=[],
            meta={"plan": steps},
        ).model_dump()

    # Special presence queries
    if qtype == "animal_evidence":
        return _presence_review(question, qtype, topic, evidence, "animal", claim_text, claim_id, steps, bundle)

    if qtype == "human_clinical_evidence":
        return _human_clinical_review(question, qtype, topic, evidence, claim_text, claim_id, steps, bundle)

    if qtype == "unproven":
        return _unproven_review(question, qtype, topic, evidence, claim_text, claim_id, steps, bundle)

    supporting, conflicting, searched = split_by_stance(evidence, claim_text=claim_text)
    conf = score_confidence(
        supporting=[e.model_dump() for e in supporting],
        conflicting=[e.model_dump() for e in conflicting],
    )
    # Re-score with raw dicts that include not_yet_validated from graph
    support_dicts = [e for e in evidence if (e.get("stance") or "support") != "contradict"]
    conflict_dicts = [e for e in evidence if (e.get("stance") or "support") == "contradict"]
    conf = score_confidence(supporting=support_dicts, conflicting=conflict_dicts)

    mix = evidence_mix_counts(evidence)
    # Blend clinvar into human_genetic count for display when reviewing presence elsewhere
    gaps = detect_gaps(
        claim_topic=topic,
        evidence=evidence,
        clinvar=bundle.get("clinvar") or [],
        all_claims=bundle.get("all_claims") or [],
    )
    hyps = generate_hypotheses(
        claim_topic=topic,
        evidence=evidence,
        gaps=gaps,
        partners=bundle.get("partners") or [],
    )
    if qtype != "next_experiment":
        # Still show 1–2 next steps on claim reviews
        hyps = hyps[:2]
    else:
        hyps = hyps[:3]

    conclusion = _conclusion(qtype, supporting, conflicting, conf.score)
    summary = _summary(question, claim_text, supporting, conflicting, conf, mix)
    summary = _maybe_llm_polish(question, summary, supporting, conflicting, hyps)

    citations = _citations(supporting, conflicting)
    none_msg = None
    if searched and not conflicting:
        none_msg = "No directly conflicting evidence was found in the currently indexed dataset."

    return ScientificReview(
        question=question,
        question_type=qtype,
        claim_topic=topic,
        claim_id=claim_id,
        conclusion=conclusion,
        confidence=conf.score,
        confidence_label=conf.label,
        confidence_breakdown=conf.breakdown,
        confidence_note=conf.formula_note,
        contradictions_checked=True,
        summary=summary,
        supporting_evidence=supporting,
        conflicting_evidence=conflicting,
        conflicting_searched=searched,
        conflicting_none_message=none_msg,
        evidence_mix=mix,
        gaps=gaps if qtype != "next_experiment" else gaps[:4],
        suggested_next_steps=hyps,
        citations=citations,
        meta={"plan": steps, "mutation_key": "PFN1:G118V", "uniprot_id": "P07737"},
    ).model_dump()


def _presence_review(question, qtype, topic, evidence, want_type, claim_text, claim_id, steps, bundle):
    matched = [e for e in evidence if e.get("evidence_type") == want_type]
    # Also search across all topics if empty
    if not matched and topic:
        broader = retrieve_claim_evidence(claim_topic=None)
        matched = [e for e in (broader.get("evidence") or []) if e.get("evidence_type") == want_type]
        evidence = broader.get("evidence") or evidence

    supporting, conflicting, searched = split_by_stance(matched, claim_text=claim_text)
    mix = evidence_mix_counts(evidence)
    present = len(matched) > 0
    conf = score_confidence(
        supporting=matched,
        conflicting=[e for e in evidence if (e.get("stance") or "") == "contradict"],
    )
    return ScientificReview(
        question=question,
        question_type=qtype,
        claim_topic=topic,
        claim_id=claim_id,
        conclusion="Yes" if present else "No",
        confidence=min(100, 40 + 15 * len(matched)) if present else 20,
        confidence_label="High" if present and len(matched) >= 1 else "Low",
        confidence_breakdown=conf.breakdown,
        confidence_note=conf.formula_note,
        summary=(
            f"Found {len(matched)} animal-evidence record(s) linked to PFN1/G118V claims in the indexed graph."
            if present
            else "No animal-evidence nodes are currently linked to the reviewed claim set."
        ),
        supporting_evidence=supporting,
        conflicting_evidence=conflicting,
        conflicting_searched=searched,
        conflicting_none_message=(
            "No directly conflicting evidence was found in the currently indexed dataset."
            if searched and not conflicting
            else None
        ),
        evidence_mix=mix,
        gaps=detect_gaps(
            claim_topic=topic,
            evidence=evidence,
            clinvar=bundle.get("clinvar") or [],
            all_claims=bundle.get("all_claims") or [],
        ),
        suggested_next_steps=generate_hypotheses(
            claim_topic=topic,
            evidence=evidence,
            gaps=detect_gaps(
                claim_topic=topic,
                evidence=evidence,
                clinvar=bundle.get("clinvar") or [],
                all_claims=bundle.get("all_claims") or [],
            ),
            partners=bundle.get("partners") or [],
        )[:2],
        citations=_citations(supporting, conflicting),
        meta={"plan": steps},
    ).model_dump()


def _human_clinical_review(question, qtype, topic, evidence, claim_text, claim_id, steps, bundle):
    clinvar = bundle.get("clinvar") or []
    clinical = [e for e in evidence if e.get("evidence_type") in {"clinical", "human_genetic"}]
    supporting, conflicting, searched = split_by_stance(clinical, claim_text=claim_text)
    # Map ClinVar as human_genetic presence (not as aggregation paper proof)
    for cv in clinvar[:5]:
        supporting.append(
            EvidenceItem(
                evidence_id=f"clinvar:{cv.get('id')}",
                title=cv.get("title") or f"ClinVar {cv.get('id')}",
                year=None,
                evidence_type="human_genetic",
                supported_claim="ClinVar assertion for PFN1 variant (genetic evidence; not an aggregation assay)",
                stance="support",
                directness="indirect",
                quality="medium",
                citation_url=cv.get("url"),
                paper_id=None,
            )
        )
    mix = evidence_mix_counts(evidence)
    mix["human_genetic"] = mix.get("human_genetic", 0) + len(clinvar)
    has = bool(clinvar or clinical)
    return ScientificReview(
        question=question,
        question_type=qtype,
        claim_topic=topic,
        claim_id=claim_id,
        conclusion="Partial" if clinvar and not clinical else ("Yes" if has else "No"),
        confidence=55 if clinvar and not [e for e in clinical if e.get("evidence_type") == "clinical"] else (70 if has else 15),
        confidence_label="Moderate" if has else "Low",
        confidence_breakdown=score_confidence(supporting=clinical, conflicting=[]).breakdown,
        confidence_note=(
            "ClinVar is counted as human genetic evidence and is kept separate from experimental aggregation conclusions."
        ),
        summary=(
            f"{len(clinvar)} ClinVar assertion(s) and {len(clinical)} clinical/human_genetic evidence node(s) "
            "are indexed. Genetic association ≠ proof of aggregation mechanism."
            if has
            else "No human genetic or clinical evidence nodes found for this query scope."
        ),
        supporting_evidence=supporting,
        conflicting_evidence=conflicting,
        conflicting_searched=searched,
        conflicting_none_message=(
            "No directly conflicting evidence was found in the currently indexed dataset."
            if searched and not conflicting
            else None
        ),
        evidence_mix=mix,
        gaps=detect_gaps(
            claim_topic=topic,
            evidence=evidence,
            clinvar=clinvar,
            all_claims=bundle.get("all_claims") or [],
        ),
        suggested_next_steps=generate_hypotheses(
            claim_topic=topic,
            evidence=evidence,
            gaps=detect_gaps(
                claim_topic=topic,
                evidence=evidence,
                clinvar=clinvar,
                all_claims=bundle.get("all_claims") or [],
            ),
            partners=bundle.get("partners") or [],
        )[:2],
        citations=_citations(supporting, conflicting),
        meta={"plan": steps, "clinvar_count": len(clinvar)},
    ).model_dump()


def _unproven_review(question, qtype, topic, evidence, claim_text, claim_id, steps, bundle):
    gaps = detect_gaps(
        claim_topic=topic or "aggregation",
        evidence=evidence if evidence else retrieve_claim_evidence(claim_topic="aggregation").get("evidence") or [],
        clinvar=bundle.get("clinvar") or [],
        all_claims=bundle.get("all_claims") or [],
    )
    weak = [
        c
        for c in (bundle.get("all_claims") or [])
        if True in (c.get("flags") or []) or c.get("topic") == "therapeutic_opportunity"
    ]
    supporting, conflicting, searched = split_by_stance(evidence, claim_text=claim_text)
    summary_bits = [g.text for g in gaps[:5]]
    if weak:
        summary_bits = [f"Weak/unvalidated claim: {w.get('text')}" for w in weak] + summary_bits
    return ScientificReview(
        question=question,
        question_type=qtype,
        claim_topic=topic,
        claim_id=claim_id,
        conclusion="Multiple open gaps",
        confidence=0,
        confidence_label="Insufficient",
        confidence_breakdown=[],
        confidence_note="This mode lists what is not yet proven; confidence is not assigned to a positive claim.",
        summary="; ".join(summary_bits) if summary_bits else "No gaps flagged.",
        supporting_evidence=supporting,
        conflicting_evidence=conflicting,
        conflicting_searched=searched,
        conflicting_none_message=(
            "No directly conflicting evidence was found in the currently indexed dataset."
            if searched and not conflicting
            else None
        ),
        evidence_mix=evidence_mix_counts(evidence),
        gaps=gaps,
        suggested_next_steps=generate_hypotheses(
            claim_topic=topic or "aggregation",
            evidence=evidence,
            gaps=gaps,
            partners=bundle.get("partners") or [],
        ),
        citations=_citations(supporting, conflicting),
        meta={"plan": steps},
    ).model_dump()


def _conclusion(qtype, supporting, conflicting, score) -> str:
    if conflicting and len(conflicting) >= len(supporting):
        return "Unclear"
    if not supporting:
        return "Insufficient evidence"
    if score >= 45:
        return "Yes"
    if score >= 20:
        return "Possibly"
    return "Insufficient evidence"


def _summary(question, claim_text, supporting, conflicting, conf, mix) -> str:
    parts = []
    types = [k for k, v in mix.items() if v > 0]
    if types:
        parts.append(
            f"Evidence mix for “{claim_text}”: " + ", ".join(f"{t}×{mix[t]}" for t in types) + "."
        )
    else:
        parts.append(f"No supporting experimental evidence indexed yet for “{claim_text}”.")
    parts.append(f"Deterministic confidence = {conf.score}/100 ({conf.label}).")
    if conflicting:
        parts.append(f"{len(conflicting)} conflicting evidence item(s) were found and reduce confidence.")
    else:
        parts.append("Contradiction search ran; no opposing stance records were indexed.")
    return " ".join(parts)


def _default_claim_text(topic: str | None) -> str:
    return {
        "structural_change": "G118V changes PFN1 structure / flexibility",
        "misfolding": "G118V promotes PFN1 misfolding",
        "aggregation": "G118V increases aggregation of PFN1",
        "therapeutic_opportunity": "A drug will stabilize PFN1 / reduce toxic aggregation",
    }.get(topic or "", "PFN1 G118V claim")


def _citations(supporting: list[EvidenceItem], conflicting: list[EvidenceItem]) -> list[CitationItem]:
    seen: set[str] = set()
    out: list[CitationItem] = []
    for e in list(supporting) + list(conflicting):
        cid = e.paper_id or e.evidence_id
        if cid in seen:
            continue
        seen.add(cid)
        out.append(
            CitationItem(
                id=cid,
                title=e.title,
                year=e.year,
                url=e.citation_url,
                evidence_type=e.evidence_type,
            )
        )
    return out


def _maybe_llm_polish(question, summary, supporting, conflicting, hyps) -> str:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        return summary
    try:
        payload = {
            "question": question,
            "deterministic_summary": summary,
            "supporting_ids": [e.evidence_id for e in supporting],
            "conflicting_ids": [e.evidence_id for e in conflicting],
            "hypotheses": [h.hypothesis for h in hyps],
        }
        with httpx.Client(timeout=40.0) as client:
            resp = client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": os.environ.get("OPENAI_MODEL", "gpt-4o-mini"),
                    "temperature": 0.2,
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "Rewrite the scientific summary in 2-4 clear sentences. "
                                "Do not add papers, confidence numbers, or claims absent from the JSON. "
                                "Do not invent contradictions."
                            ),
                        },
                        {"role": "user", "content": json.dumps(payload)},
                    ],
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"].strip()
    except Exception:
        return summary


__all__ = ["review", "STARTER_QUESTIONS"]
