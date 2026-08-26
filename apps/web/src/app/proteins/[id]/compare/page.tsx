import Link from "next/link";
import { ProteinHealthReportPanel } from "@/components/ProteinHealthReportPanel";
import { ProteinStateScores } from "@/components/ProteinStateScores";
import {
  getMutationComparison,
  healthReportMarkdownUrl,
  type MutationComparison,
} from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export default async function MutationComparePage({ params }: Props) {
  const { id } = await params;
  let comparison: MutationComparison | null = null;
  let error: string | null = null;

  try {
    comparison = await getMutationComparison(id);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load comparison";
  }

  if (error || !comparison) {
    return (
      <main className="page page-dossier">
        <p className="error">{error ?? "Not found"}</p>
        <p className="hint">
          Mutation comparison is available for{" "}
          <Link href="/proteins/P07737/compare">PFN1 (P07737)</Link> and{" "}
          <Link href="/proteins/P68366/compare">TUBA4A (P68366)</Link>.
        </p>
      </main>
    );
  }

  const keys = comparison.mutations.map((m) => m.key);
  const variantLabel =
    comparison.variant_label || comparison.mutations.map((m) => m.variant).join(" vs ");

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> ·{" "}
        <Link href={`/proteins/${id}`}>{comparison.symbol}</Link> · Compare
      </p>
      <header className="dossier-header">
        <div>
          <p className="eyebrow">Mutation comparison</p>
          <h1>
            {comparison.symbol}
            <span className="dossier-sub"> · {variantLabel}</span>
          </h1>
          <p className="lede">{comparison.question}</p>
        </div>
        <div className="status-pill">
          <span className="eyebrow">Most disruptive</span>
          <strong>
            {comparison.most_disruptive.variant} · index{" "}
            {comparison.most_disruptive.priority_index}
          </strong>
          <div className="cta-row" style={{ marginTop: "0.75rem" }}>
            <Link className="btn btn-ghost" href={`/proteins/${id}`}>
              ← Overview
            </Link>
            <Link className="btn btn-ghost" href={`/proteins/${id}/dossier`}>
              Evidence dossier
            </Link>
            <a className="btn btn-primary" href={healthReportMarkdownUrl(id)}>
              Download report
            </a>
          </div>
        </div>
      </header>

      <section className="section">
        <h2>Ranking verdict</h2>
        <p>
          <strong>{comparison.most_disruptive.variant}</strong> ranks highest on the current
          Protein State priority index. {comparison.most_disruptive.why}
        </p>
        <p className="hint">{comparison.scoring_method.disclaimer}</p>
      </section>

      <section className="section" id="comparison-table">
        <h2>Mutation comparison</h2>
        <p className="hint">Every cell links to the claim / evidence context on the dossier.</p>
        <div className="table-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th>Property</th>
                {comparison.mutations.map((m) => (
                  <th key={m.key} id={m.key.replace(":", "-")}>
                    {m.variant}
                    <div className="hint" style={{ fontWeight: 400 }}>
                      {m.hgvs_p}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparison.comparison_table.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.property}</th>
                  {keys.map((key) => {
                    const cell = row.cells[key];
                    return (
                      <td key={key}>
                        <Link href={cell.evidence_href} className="cell-link">
                          {cell.value}
                        </Link>
                        {cell.note ? <div className="hint cell-note">{cell.note}</div> : null}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ProteinStateScores mutations={comparison.mutations} />

      <section className="section">
        <h2>Mutation profiles</h2>
        <div className="intel-grid">
          {comparison.mutations.map((m) => (
            <article key={m.key} className="intel-card">
              <p className="eyebrow">{m.binding_region}</p>
              <h3>{m.variant}</h3>
              <p>
                <strong>ClinVar / catalog status:</strong> {m.clinvar_status}
              </p>
              <p>
                <strong>Structural location:</strong> {m.structural_location}
              </p>
              <p>
                <strong>Known functional effects</strong>
              </p>
              <ul className="gap-list">
                {m.known_functional_effects.map((fx) => (
                  <li key={fx}>{fx}</li>
                ))}
              </ul>
              <p className="hint">{m.ranking_note}</p>
              <Link className="btn btn-ghost" href={`/proteins/${id}?mutation=${m.variant}`}>
                Open mutation review
              </Link>
            </article>
          ))}
        </div>
      </section>

      <ProteinHealthReportPanel uniprotId={id} />
    </main>
  );
}
