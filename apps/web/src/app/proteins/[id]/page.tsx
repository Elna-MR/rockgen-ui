import Link from "next/link";
import { ProteinViewerClient } from "@/components/ProteinViewerClient";
import { getProtein, getProteinEvidence } from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export default async function ProteinOverviewPage({ params }: Props) {
  const { id } = await params;
  let protein: Awaited<ReturnType<typeof getProtein>> | null = null;
  let error: string | null = null;

  try {
    protein = await getProtein(id);
    // Warm evidence cache / ensure ingest without expanding UI
    await getProteinEvidence(id).catch(() => null);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load protein";
  }

  if (error || !protein) {
    return (
      <main className="page">
        <p className="error">{error ?? "Not found"}</p>
      </main>
    );
  }

  const isPfn1 = protein.uniprot_id === "P07737" || protein.symbol === "PFN1";
  const isTuba = protein.uniprot_id === "P68366";
  const functionText = protein.function;
  const hasCompare = isPfn1 || isTuba;

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Protein
      </p>
      <header className="hub-hero">
        <h1>{protein.symbol}</h1>
        <p className="lede">
          {protein.name}
          <span className="hint">
            {" "}
            · UniProt {protein.uniprot_id}
            {protein.length ? ` · ${protein.length} aa` : ""}
          </span>
        </p>
        {functionText && <p className="hint">{functionText}</p>}
      </header>

      <section className="section">
        <h2>Workspace</h2>
        <p className="hint">Open one tool at a time.</p>
        <div className="hub-grid">
          {hasCompare && (
            <Link href={`/proteins/${protein.uniprot_id}/compare`} className="hub-link">
              <strong>Compare mutations</strong>
              <span>Which allele looks most disruptive, with state scores.</span>
            </Link>
          )}
          {isPfn1 && (
            <Link href={`/proteins/${protein.uniprot_id}/dynamics`} className="hub-link">
              <strong>Dynamics</strong>
              <span>WT vs G118V conformational states (Protein Dynamics Engine).</span>
            </Link>
          )}
          {(isPfn1 || isTuba) && (
            <Link href={`/proteins/${protein.uniprot_id}/dossier`} className="hub-link">
              <strong>Evidence dossier</strong>
              <span>Pathway, timeline, gaps, sequence, and ask.</span>
            </Link>
          )}
          <Link href={`/proteins/${protein.uniprot_id}/structure`} className="hub-link">
            <strong>Structure explorer</strong>
            <span>Search and inspect primary → quaternary detail.</span>
          </Link>
          <Link href="/diseases/als/mechanisms" className="hub-link">
            <strong>ALS mechanisms</strong>
            <span>How this protein sits in cross-protein prioritization.</span>
          </Link>
          <Link href="/ask" className="hub-link">
            <strong>Ask</strong>
            <span>Structured scientific review questions.</span>
          </Link>
        </div>
      </section>

      {isPfn1 && (
        <section className="section">
          <h2>Structure</h2>
          <p className="hint">Interact here; deeper dynamics live on the Dynamics page.</p>
          <ProteinViewerClient />
        </section>
      )}

      {!isPfn1 && protein.mutations?.length > 0 && (
        <section className="section">
          <h2>Known mutations</h2>
          <ul className="gap-list">
            {protein.mutations.slice(0, 8).map((m) => (
              <li key={m.key}>
                <strong>{m.hgvs_p || m.key}</strong>
                {m.significance ? ` — ${m.significance}` : ""}
              </li>
            ))}
          </ul>
          {hasCompare && (
            <p className="hint" style={{ marginTop: "0.75rem" }}>
              <Link href={`/proteins/${protein.uniprot_id}/compare`}>Open full comparison →</Link>
            </p>
          )}
        </section>
      )}
    </main>
  );
}
