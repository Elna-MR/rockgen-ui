import { ALS_BIOMARKER_GAPS, ALS_BIOMARKER_INTEL } from "@/data/alsProgram";

export function BiomarkerIntelligenceSection() {
  return (
    <section className="section" id="biomarkers">
      <h2>Biomarker intelligence</h2>
      <p className="hint">
        How do we detect, track, or measure disease and treatment response? Purpose and specificity
        matter as much as the analyte name.
      </p>
      <div className="intel-grid">
        {ALS_BIOMARKER_INTEL.map((b) => (
          <article key={b.id} className="intel-card biomarker-card">
            <p className="eyebrow">{b.biomarkerType}</p>
            <h3>{b.name}</h3>
            <p>
              <strong>Role:</strong> {b.role}
            </p>
            <p>
              <strong>Purpose:</strong> {b.purpose.join(" · ")}
            </p>
            <p>
              <strong>Sample:</strong> {b.specimen.join(", ")}
            </p>
            <p>
              <strong>What it tells us:</strong> {b.whatItTellsUs}
            </p>
            <p>
              <strong>ALS specificity:</strong> {b.diseaseSpecificity}
            </p>
            <p>
              <strong>PFN1-specific:</strong> {b.pfn1Specific ? "Yes" : "No"}
            </p>
            <p>
              <strong>Clinical maturity:</strong> {b.clinicalMaturity}
            </p>
            <p className="hint">
              <strong>RockGen connection:</strong> {b.rockgenConnection}
            </p>
            <p className="hint">
              Linked mutation context: {b.linkedMutation}
              {b.linkedTrial ? ` · Trial: ${b.linkedTrial}` : ""}
            </p>
          </article>
        ))}
      </div>

      <div className="gap-panel">
        <h3>What is missing?</h3>
        <p className="hint">
          NfL tracks neuronal injury; it does not prove PFN1 is misfolding. Platform gaps to close:
        </p>
        <ul className="gap-list">
          {ALS_BIOMARKER_GAPS.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
