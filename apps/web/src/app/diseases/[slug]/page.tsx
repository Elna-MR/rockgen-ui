import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";
import { ALS_FALLBACK } from "@/data/alsFallback";
import { getDisease, mechanismReportMarkdownUrl } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

const PROGRAM_FOCUS = new Set(["P07737", "P68366"]);

export default async function DiseaseHubPage({ params }: Props) {
  const { slug } = await params;
  let disease: Awaited<ReturnType<typeof getDisease>> | null = null;
  let offline = false;

  try {
    disease = await getDisease(slug);
  } catch {
    if (slug === "als") {
      disease = ALS_FALLBACK;
      offline = true;
    }
  }

  if (!disease) {
    return (
      <main className="page">
        <p className="error">Disease not found.</p>
        <p className="hint" style={{ marginTop: "0.75rem" }}>
          <Link href="/diseases/als">Back to ALS workspace</Link>
        </p>
      </main>
    );
  }

  const isAls = slug === "als";
  const focus = disease.proteins.filter((p) => PROGRAM_FOCUS.has(p.uniprot_id));
  const others = disease.proteins.filter((p) => !PROGRAM_FOCUS.has(p.uniprot_id));

  if (!isAls) {
    return (
      <main className="page hub-page">
        <h1>{disease.name}</h1>
        <p className="lede">{disease.synopsis}</p>
        <div className="hub-grid">
          {disease.proteins.map((p) => (
            <Link key={p.uniprot_id} href={`/proteins/${p.uniprot_id}`} className="hub-link">
              <strong>{p.symbol}</strong>
              <span>{p.name}</span>
            </Link>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Disease
      </p>
      <header className="hub-hero hub-hero-visual">
        <div>
          <h1>ALS</h1>
          <p className="science-thesis science-thesis-compact">
            Shared mechanisms across program proteins — then prioritize what to study next.
          </p>
          <p className="lede">{disease.synopsis}</p>
          {offline && (
            <p className="hint" style={{ marginTop: "0.65rem" }}>
              Live graph catalog is offline — showing the local ALS panel so you can keep navigating.
            </p>
          )}
          <div className="cta-row" style={{ marginTop: "1.25rem" }}>
            <Link className="btn btn-primary" href="/diseases/als/mechanisms">
              Mechanisms
            </Link>
            <Link className="btn btn-ghost" href="/approach">
              Why mechanism-first
            </Link>
          </div>
        </div>
        <div className="hub-hero-motif" aria-hidden="true">
          <ProteinField variant="panel" />
        </div>
      </header>

      <section className="section">
        <h2>Start here</h2>
        <div className="hub-grid">
          <Link href="/diseases/als/mechanisms" className="hub-link">
            <strong>Mechanisms</strong>
            <span>What is shared between PFN1 and TUBA4A — and what to investigate first.</span>
          </Link>
          <Link href="/proteins/explore" className="hub-link">
            <strong>Structure explorer</strong>
            <span>Search a protein — primary chemistry through 3D and assembly.</span>
          </Link>
          <Link href="/diseases/als/map" className="hub-link">
            <strong>Disease map</strong>
            <span>Browse ALS by biology axis (cytoskeleton, RNA, proteostasis…).</span>
          </Link>
          <Link href="/diseases/als/compare" className="hub-link">
            <strong>Pathway compare</strong>
            <span>Side-by-side causal paths for PFN1 vs TUBA4A.</span>
          </Link>
          <Link href="/diseases/als/evidence" className="hub-link">
            <strong>Mutations &amp; biomarkers</strong>
            <span>Mutation intelligence, NfL context, and research gaps.</span>
          </Link>
          <Link href="/ask" className="hub-link">
            <strong>Ask a review</strong>
            <span>Structured scientific Q&amp;A with citations.</span>
          </Link>
          <a href={mechanismReportMarkdownUrl("als")} className="hub-link">
            <strong>Download report</strong>
            <span>Disease Mechanism Report (Markdown).</span>
          </a>
        </div>
      </section>

      <section className="section">
        <h2>Program proteins</h2>
        <p className="hint">Open one protein at a time — overview first, tools second.</p>
        <div className="hub-grid hub-grid-compact">
          {focus.map((p) => (
            <Link key={p.uniprot_id} href={`/proteins/${p.uniprot_id}`} className="hub-link">
              <strong>{p.symbol}</strong>
              <span>
                {p.name} · {p.uniprot_id}
              </span>
            </Link>
          ))}
        </div>
        {others.length > 0 && (
          <details className="quiet-details">
            <summary>Other panel proteins ({others.length})</summary>
            <div className="hub-grid hub-grid-compact" style={{ marginTop: "0.75rem" }}>
              {others.map((p) => (
                <Link key={p.uniprot_id} href={`/proteins/${p.uniprot_id}`} className="hub-link">
                  <strong>{p.symbol}</strong>
                  <span>{p.uniprot_id}</span>
                </Link>
              ))}
            </div>
          </details>
        )}
      </section>

      <p className="hint" style={{ marginTop: "1.5rem" }}>
        New here?{" "}
        <Link href="/understand">Understand ALS</Link> (families) or{" "}
        <Link href="/learn">Learn</Link> (students).
      </p>
    </main>
  );
}
