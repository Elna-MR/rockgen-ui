import type { MutationComparison } from "@/lib/api";

type Props = {
  mutations: MutationComparison["mutations"];
};

const DIM_LABELS: Record<string, string> = {
  structural_disruption: "Structural disruption",
  misfolding_risk: "Misfolding risk",
  aggregation_risk: "Aggregation risk",
  functional_disruption: "Functional disruption",
  evidence_strength: "Evidence strength",
  human_relevance: "Human relevance",
};

export function ProteinStateScores({ mutations }: Props) {
  return (
    <section className="section" id="protein-state-scores">
      <h2>Protein State Scores</h2>
      <p className="hint">
        Heuristic, rule-based indices (0 to 100) defined by this site, across six dimensions. They
        are <strong>not</strong> experimental measurements, have not been validated against lab or
        clinical data, and are <strong>not</strong> disease probabilities. The &ldquo;why&rdquo;
        lists show the rules behind each score.
      </p>
      <div className="score-grid">
        {mutations.map((m) => {
          const s = m.protein_state_score;
          return (
            <article key={m.key} className="intel-card score-card">
              <h3>
                {m.variant}
                <span className="dossier-sub"> · priority {s.priority_index}</span>
              </h3>
              <ul className="score-list">
                {Object.entries(s.dimensions).map(([dim, val]) => (
                  <li key={dim}>
                    <div className="score-row">
                      <span>{DIM_LABELS[dim] || dim}</span>
                      <strong>{val}</strong>
                    </div>
                    <div className="score-bar">
                      <i style={{ width: `${val}%` }} />
                    </div>
                    <details className="score-why">
                      <summary>Why this score</summary>
                      <ul>
                        {(s.breakdown[dim] || []).map((r) => (
                          <li key={r}>{r}</li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
