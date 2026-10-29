import Link from "next/link";
import { ALS_BIOMARKER_GAPS } from "@/data/alsProgram";

/** Gaps that the biomarker catalog does not close. The catalog itself lives on its own page. */
export function BiomarkerIntelligenceSection() {
  return (
    <section className="section" id="biomarkers">
      <h2>Biomarkers</h2>
      <p className="hint">
        The biomarker catalog has its own page, with filters by use, evidence level and limits.
      </p>
      <p>
        <Link className="btn btn-primary" href="/diseases/als/biomarkers">
          Open the biomarker explorer
        </Link>
      </p>

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
