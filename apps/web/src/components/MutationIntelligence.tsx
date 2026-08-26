import Link from "next/link";
import type { MutationIntelCard } from "@/lib/api";

type MixKey = "computational" | "in_vitro" | "animal" | "human_genetic" | "clinical";

const MIX_LABELS: [MixKey, string][] = [
  ["computational", "Computational"],
  ["in_vitro", "In vitro"],
  ["animal", "Animal"],
  ["human_genetic", "Human genetic"],
  ["clinical", "Clinical"],
];

type Props = {
  mutations: MutationIntelCard[];
  sourceNote?: string;
};

export function MutationIntelligenceSection({ mutations, sourceNote }: Props) {
  if (!mutations.length) {
    return (
      <section className="section" id="mutations">
        <h2>Mutation intelligence</h2>
        <p className="error">No mutations returned from the Disease Intelligence Engine.</p>
        <p className="hint">Seed + ingest the graph, then reload.</p>
      </section>
    );
  }

  return (
    <section className="section" id="mutations">
      <h2>Mutation intelligence</h2>
      <p className="hint">
        Cards are built by the Disease Intelligence Engine from Neo4j claims and evidence — not a
        static UI twin.
      </p>
      <div className="intel-grid">
        {mutations.map((m) => {
          const mix = m.evidence_mix || {};
          const path =
            m.mechanism_path?.length > 0
              ? m.mechanism_path.join(" → ")
              : m.primary_statement || "—";
          return (
            <article key={m.key} className="intel-card mutation-card">
              <p className="eyebrow">
                {m.gene || "—"} / {m.protein_name || m.protein_symbol || "—"}
              </p>
              <h3>
                {m.variant || m.key}
                {m.hgvs_p ? <span className="dossier-sub"> · {m.hgvs_p}</span> : null}
              </h3>
              <p className="lede">{m.disease_association || m.significance || "Linked in graph"}</p>
              {m.clinvar?.length ? (
                <p>
                  <strong>ClinVar:</strong>{" "}
                  {m.clinvar
                    .map((c) => c.clinical_significance || c.id)
                    .filter(Boolean)
                    .join("; ")}
                </p>
              ) : null}
              <p>
                <strong>Mechanism path:</strong> {path}
              </p>
              {m.primary_statement ? (
                <p>
                  <strong>Primary statement:</strong> {m.primary_statement}
                </p>
              ) : null}

              <h4>Evidence</h4>
              <ul className="mix-list">
                {MIX_LABELS.map(([key, label]) => (
                  <li key={key}>
                    <span>{label}</span>
                    <span className="mix-marks">{mix[key] ? "✓" : "—"}</span>
                  </li>
                ))}
              </ul>

              <p className="confidence-score">
                Confidence:{" "}
                {m.confidence_score != null
                  ? `${m.confidence_score} — ${m.confidence_label || "—"}`
                  : m.confidence_label || "Insufficient"}
              </p>
              <p className="hint">
                {m.paper_count} paper id(s) linked · {m.statements?.length || 0} statement(s)
              </p>

              <div className="cta-row">
                <Link className="btn btn-primary" href={m.dossier_href || `/proteins/${m.uniprot_id}`}>
                  Open protein
                </Link>
                {m.review_question ? (
                  <Link
                    className="btn btn-ghost"
                    href={`/ask?q=${encodeURIComponent(m.review_question)}`}
                  >
                    Ask review
                  </Link>
                ) : (
                  <Link className="btn btn-ghost" href={`/proteins/${m.uniprot_id}/compare`}>
                    Compare
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
      {sourceNote ? <p className="hint" style={{ marginTop: "0.75rem" }}>{sourceNote}</p> : null}
    </section>
  );
}
