"""Evidence-grounded hypothesis generation — no unconstrained drug ideas."""

from __future__ import annotations

from rockgen_reasoning.schemas import GapItem, HypothesisItem


def generate_hypotheses(
    *,
    claim_topic: str | None,
    evidence: list[dict],
    gaps: list[GapItem],
    partners: list[dict],
) -> list[HypothesisItem]:
    evidence_ids = [e["evidence_id"] for e in evidence if e.get("evidence_id")][:8]
    steps: list[HypothesisItem] = []

    if claim_topic in {None, "aggregation", "structural_change", "misfolding"}:
        steps.append(
            HypothesisItem(
                hypothesis="G118V alters a local structural/flexibility feature that increases aggregation propensity relative to wild-type PFN1.",
                rationale="The graph links structural change and aggregation evidence for G118V; a standardized assay would quantify effect size.",
                evidence_ids=evidence_ids,
                proposed_experiment="Compare G118V with wild-type PFN1 using a standardized aggregation assay under matched expression conditions.",
            )
        )

    gap_ids = {g.id for g in gaps}
    if "gap-no-stabilizer" in gap_ids or "gap-pocket" in gap_ids:
        steps.append(
            HypothesisItem(
                hypothesis="Stabilizing the G118V-altered region may reduce PFN1 aggregation.",
                rationale="Structural and aggregation evidence coexist, but no validated stabilizer or pocket validation is indexed.",
                evidence_ids=evidence_ids,
                proposed_experiment="Test whether stabilizing the altered actin-binding / local region (biophysical stabilizer screen) reduces aggregation in vitro — not a clinical treatment claim.",
            )
        )

    actb = next((p for p in partners if (p.get("symbol") or "").upper() == "ACTB"), None)
    if actb:
        steps.append(
            HypothesisItem(
                hypothesis="The PFN1–ACTB interaction may be perturbed by G118V and contribute to aggregation-relevant phenotypes.",
                rationale=f"Knowledge graph records INTERACTS_WITH to {actb.get('symbol')} ({actb.get('uniprot_id')}).",
                evidence_ids=evidence_ids,
                proposed_experiment="Investigate the PFN1–ACTB relationship under the G118V mutation (binding / co-localization assays).",
            )
        )

    if "gap-biomarker" in gap_ids:
        steps.append(
            HypothesisItem(
                hypothesis="Aggregation-linked biomarkers may report PFN1 pathway stress in patient samples.",
                rationale="Biomarker gap detected for PFN1 aggregation; disease-level markers exist separately in the ALS workspace.",
                evidence_ids=evidence_ids,
                proposed_experiment="Evaluate candidate biomarkers associated with PFN1 aggregation in patient samples (exploratory, not diagnostic claim).",
            )
        )

    if "gap-mutation-compare" in gap_ids:
        steps.append(
            HypothesisItem(
                hypothesis="Different ALS-linked PFN1 mutations may share a common aggregation mechanism with graded severity.",
                rationale="UniProt/ClinVar list multiple PFN1 variants; comparative aggregation evidence is sparse on the graph.",
                evidence_ids=evidence_ids,
                proposed_experiment="Side-by-side aggregation assay across PFN1 variants (e.g., C71G, M114T, G118V).",
            )
        )

    # Cap to 2–3 strongest for the review card
    return steps[:3]
