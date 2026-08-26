import { MUTATION_BIOMARKER_MAP, type EdgeSupport } from "@/data/alsProgram";

function supportLabel(s: EdgeSupport) {
  switch (s) {
    case "supported":
      return "supported";
    case "broadly_supported":
      return "supported broadly";
    case "not_directly_validated":
      return "not directly validated";
    default:
      return "hypothetical";
  }
}

export function MutationBiomarkerMap() {
  return (
    <section className="section" id="mutation-biomarker-map">
      <h2>Mutation-to-biomarker map</h2>
      <p className="hint">
        Do not treat mutations and biomarkers as unrelated lists — but also do not imply unproven
        links. Edge labels show what evidence actually supports.
      </p>
      <div className="mb-map">
        {MUTATION_BIOMARKER_MAP.map((edge, i) => (
          <div key={`${edge.from}-${edge.to}-${i}`} className="mb-edge">
            <div className="mb-nodes">
              <span className="mb-node">{edge.from}</span>
              <span className={`mb-arrow support-${edge.support}`}>↓</span>
              <span className="mb-node">{edge.to}</span>
            </div>
            <p>
              <span className={`ev-tag support-tag-${edge.support}`}>{supportLabel(edge.support)}</span>{" "}
              <span className="hint">{edge.note}</span>
            </p>
          </div>
        ))}
      </div>
      <p className="empty" style={{ marginTop: "1rem" }}>
        Critical caution: <strong>PFN1 G118V → increased NfL</strong> is not directly validated in
        the indexed dataset.
      </p>
    </section>
  );
}
