import Link from "next/link";
import {
  getDiseaseProteinCompare,
  mechanismReportMarkdownUrl,
  type ProteinCompare,
} from "@/lib/api";

type Props = { searchParams: Promise<{ ids?: string }> };

export default async function AlsCrossProteinComparePage({ searchParams }: Props) {
  const sp = await searchParams;
  const ids = sp.ids || "P07737,P68366";
  let cmp: ProteinCompare | null = null;
  let error: string | null = null;
  try {
    cmp = await getDiseaseProteinCompare("als", ids);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load comparison";
  }

  if (error || !cmp) {
    return (
      <main className="page page-dossier">
        <p className="error">{error ?? "Not found"}</p>
      </main>
    );
  }

  const [a, b] = cmp.proteins;

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Pathway compare
      </p>
      <header className="dossier-header">
        <div>
          <h1>
            {a.symbol}
            <span className="dossier-sub"> vs {b.symbol}</span>
          </h1>
          <p className="lede">
            Shared and unique disease mechanisms — different paths, same ALS endpoint.
          </p>
        </div>
        <div className="status-pill">
          <span className="eyebrow">Mechanism similarity</span>
          <strong>{cmp.similarity.similarity}</strong>
          <div className="cta-row" style={{ marginTop: "0.75rem" }}>
            <Link className="btn btn-ghost" href="/diseases/als">
              ← ALS hub
            </Link>
            <a className="btn btn-primary" href={mechanismReportMarkdownUrl("als", a.uniprot_id, b.uniprot_id)}>
              Download report
            </a>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Similarity verdict</h2>
        <p>{cmp.similarity.explanation}</p>
        <p className="hint">{cmp.shared_pathways_note}</p>
      </section>

      <section className="section">
        <h2>Pathway intelligence</h2>
        <div className="compare-pathways">
          <div className="intel-card">
            <h3>
              <Link href={`/proteins/${a.uniprot_id}`}>{a.symbol}</Link>
            </h3>
            <div className="chain">
              {a.pathway_chain.map((step, i) => (
                <span key={step} style={{ display: "contents" }}>
                  {i > 0 && <span className="chain-arrow">→</span>}
                  <span className="chain-node">{step}</span>
                </span>
              ))}
            </div>
          </div>
          <div className="intel-card">
            <h3>
              <Link href={`/proteins/${b.uniprot_id}`}>{b.symbol}</Link>
            </h3>
            <div className="chain">
              {b.pathway_chain.map((step, i) => (
                <span key={step} style={{ display: "contents" }}>
                  {i > 0 && <span className="chain-arrow">→</span>}
                  <span className="chain-node">{step}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2>Shared mechanisms</h2>
        <ul className="gap-list">
          {cmp.shared_mechanisms.map((m) => (
            <li key={m}>
              <code>{m}</code>
            </li>
          ))}
        </ul>
        <h3 style={{ marginTop: "1.25rem" }}>Unique to {a.symbol}</h3>
        <ul className="gap-list">
          {cmp.unique_to_a.map((m) => (
            <li key={m}>
              <code>{m}</code>
            </li>
          ))}
          {cmp.unique_to_a.length === 0 && <li className="hint">None at medium/high</li>}
        </ul>
        <h3 style={{ marginTop: "1.25rem" }}>Unique to {b.symbol}</h3>
        <ul className="gap-list">
          {cmp.unique_to_b.map((m) => (
            <li key={m}>
              <code>{m}</code>
            </li>
          ))}
          {cmp.unique_to_b.length === 0 && <li className="hint">None at medium/high</li>}
        </ul>
      </section>

      <section className="section">
        <h2>Mechanism level matrix</h2>
        <div className="table-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Mechanism</th>
                <th>{a.symbol}</th>
                <th>{b.symbol}</th>
              </tr>
            </thead>
            <tbody>
              {a.display.map((row, idx) => (
                <tr key={row.mechanism_id}>
                  <th scope="row">{row.label}</th>
                  <td>
                    <span className={`level-pill level-${row.level}`}>{row.level}</span>
                  </td>
                  <td>
                    <span className={`level-pill level-${b.display[idx]?.level || "none"}`}>
                      {b.display[idx]?.level || "none"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2>Shared biomarkers</h2>
        <ul className="gap-list">
          {cmp.shared_biomarkers.map((bm) => (
            <li key={bm.id}>
              <strong>{bm.name}</strong> — {bm.note}
            </li>
          ))}
        </ul>
        <h3 style={{ marginTop: "1.25rem" }}>Research gaps</h3>
        <ul className="gap-list">
          {cmp.research_gaps.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
