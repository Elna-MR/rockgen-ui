import { PFN1_TIMELINE } from "@/data/pfn1Dossier";

export function EvidenceTimeline() {
  return (
    <section className="section">
      <h2>Evidence timeline</h2>
      <p className="hint">How the G118V / PFN1 conclusion evolved across study types.</p>
      <ol className="dossier-timeline">
        {PFN1_TIMELINE.map((item, i) => (
          <li key={`${item.year}-${i}`}>
            <span className="badge">{item.year}</span>
            <span className={`badge badge-${item.evidence_type}`}>{item.evidence_type}</span>
            <div>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.title}
                </a>
              ) : (
                <strong>{item.title}</strong>
              )}
              {item.paper_id && <p className="hint">{item.paper_id}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
