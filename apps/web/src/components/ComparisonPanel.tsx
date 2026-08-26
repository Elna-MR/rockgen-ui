import { PFN1_COMPARISON } from "@/data/pfn1Dossier";

export function ComparisonPanel() {
  return (
    <section className="section">
      <h2>Wild-type vs G118V</h2>
      <p className="hint">
        Predictions are labeled separately from experimental and animal observations — they must not
        look like proven facts.
      </p>
      <div className="table-wrap">
        <table className="evidence-table compare-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Wild type</th>
              <th>G118V</th>
              <th>Evidence basis</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {PFN1_COMPARISON.map((row) => (
              <tr key={row.property}>
                <td>{row.property}</td>
                <td>{row.wildType}</td>
                <td>{row.mutant}</td>
                <td>
                  <span className={`ev-tag ev-${row.evidenceLabel.replace(/\s+/g, "-")}`}>
                    {row.evidenceLabel}
                  </span>
                </td>
                <td>{row.confidence || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
