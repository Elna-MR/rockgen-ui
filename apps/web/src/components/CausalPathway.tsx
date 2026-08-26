"use client";

import { useMemo, useState } from "react";
import { PFN1_PATHWAY, type PathwayStep } from "@/data/pfn1Dossier";
import type { EvidenceBundle } from "@/lib/api";

type Props = {
  evidence: EvidenceBundle | null;
};

function edgeClass(support: PathwayStep["support"]) {
  if (support === "experimental") return "path-edge solid";
  if (support === "computational") return "path-edge dashed";
  return "path-edge dotted";
}

export function CausalPathway({ evidence }: Props) {
  const [active, setActive] = useState<string>("aggregation");

  const detail = useMemo(() => {
    const step = PFN1_PATHWAY.find((s) => s.id === active);
    if (!step) return null;
    const rows =
      evidence?.evidence?.filter(
        (e) => !step.claimTopic || e.claim_topic === step.claimTopic
      ) || [];
    const matrixRow = evidence?.claim_matrix?.find((c) => c.topic === step.claimTopic);
    return { step, rows, matrixRow };
  }, [active, evidence]);

  return (
    <section className="section">
      <h2>Causal mechanism</h2>
      <p className="hint">
        Solid = experimentally supported · Dashed = computationally predicted · Dotted = hypothesis.
        Click a step for evidence.
      </p>
      <div className="pathway">
        {PFN1_PATHWAY.map((step, idx) => (
          <div key={step.id} className="pathway-node-wrap">
            <button
              type="button"
              className={`pathway-node ${active === step.id ? "active" : ""} support-${step.support}`}
              onClick={() => setActive(step.id)}
            >
              {step.label}
            </button>
            {idx < PFN1_PATHWAY.length - 1 && (
              <div className={edgeClass(PFN1_PATHWAY[idx + 1].support)} aria-hidden>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {detail && (
        <div className="pathway-detail">
          <h3>{detail.step.label}</h3>
          <p>{detail.step.description}</p>
          <p className="hint">
            Support style: {detail.step.support}
            {detail.matrixRow
              ? ` · Claim confidence cue: ${detail.matrixRow.confidence || "n/a"} · ${detail.matrixRow.evidence_summary}`
              : ""}
          </p>
          <h4>Supporting papers / evidence</h4>
          <ul className="list-plain">
            {detail.rows.slice(0, 6).map((r) => (
              <li key={r.evidence_id}>
                {r.source_url ? (
                  <a href={r.source_url} target="_blank" rel="noreferrer">
                    {r.citation || r.evidence_id}
                  </a>
                ) : (
                  r.citation || r.evidence_id
                )}{" "}
                · {r.evidence_type}
                {r.publication_date ? ` · ${r.publication_date}` : ""}
              </li>
            ))}
            {detail.rows.length === 0 && (
              <li className="empty">No claim-linked evidence rows for this step in Neo4j yet.</li>
            )}
          </ul>
          <p className="hint">
            Gaps for this mechanism remain listed in “What remains unknown.” Conflicting evidence is
            checked in Scientific review.
          </p>
        </div>
      )}
    </section>
  );
}
