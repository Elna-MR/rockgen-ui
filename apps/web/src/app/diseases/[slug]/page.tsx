import Link from "next/link";
import { notFound } from "next/navigation";
import { ProteinField } from "@/components/ProteinField";
import { ALS_FALLBACK } from "@/data/alsFallback";
import { getResearchDisease, RESEARCH_DISEASES } from "@/data/researchHub";
import { getDisease, mechanismReportMarkdownUrl } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

const PROGRAM_FOCUS = new Set(["P07737", "P68366"]);

export function generateStaticParams() {
  return RESEARCH_DISEASES.map((d) => ({ slug: d.slug }));
}

export default async function DiseaseHubPage({ params }: Props) {
  const { slug } = await params;
  const catalog = getResearchDisease(slug);

  if (slug !== "als") {
    if (!catalog) notFound();

    return (
      <main className="page learn-disease-page">
        <p className="eyebrow">
          <Link href="/diseases">Research</Link> · {catalog.shortName}
        </p>
        <header className="hub-hero hub-hero-visual">
          <div>
            <p className="learn-disease-kicker">
              {catalog.category} · {catalog.status === "ready" ? "Full workspace" : "Growing workspace"}
            </p>
            <h1>{catalog.shortName}</h1>
            <p className="science-thesis science-thesis-compact">{catalog.tagline}</p>
            <p className="lede">{catalog.synopsis}</p>
            <p className="meta-pill">
              {catalog.tools.filter((t) => t.status === "ready").length} tools ready · research framing
            </p>
          </div>
          <div className="hub-hero-motif" aria-hidden="true">
            <ProteinField variant="panel" />
          </div>
        </header>

        <section className="section">
          <h2>Research notes</h2>
          <ul className="learn-fact-list">
            {catalog.researchNotes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </section>

        <section className="section">
          <h2>Proteins in scope</h2>
          <div className="learn-protein-grid">
            {catalog.proteins.map((p) => (
              <div key={p.symbol} className="learn-protein-card">
                {p.href ? (
                  <Link href={p.href}>
                    <strong>{p.symbol}</strong>
                  </Link>
                ) : (
                  <strong>{p.symbol}</strong>
                )}
                <span className="hint">{p.name}</span>
                <p>{p.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Mechanism words</h2>
          <div className="chip-row">
            {catalog.mechanisms.map((m) => (
              <span key={m} className="chip chip-static">
                {m}
              </span>
            ))}
          </div>
        </section>

        <section className="section">
          <h2>Tools</h2>
          <p className="hint">Ready links open now; “Soon” marks disease-specific maps still expanding.</p>
          <div className="hub-grid">
            {catalog.tools.map((t) =>
              t.status === "ready" ? (
                <Link key={t.title} href={t.href} className="hub-link">
                  <strong>{t.title}</strong>
                  <span>{t.summary}</span>
                </Link>
              ) : (
                <div key={t.title} className="hub-link hub-link-muted" aria-disabled="true">
                  <strong>
                    {t.title} <span className="hint">· Soon</span>
                  </strong>
                  <span>{t.summary}</span>
                </div>
              )
            )}
          </div>
        </section>

        <div className="cta-row" style={{ marginTop: "1.75rem" }}>
          <Link
            className="btn btn-primary"
            href={catalog.tools.find((t) => t.status === "ready")?.href || "/diseases"}
          >
            Open a ready tool
          </Link>
          <Link className="btn btn-ghost" href={`/learn/${catalog.slug}`}>
            Student primer
          </Link>
          <Link className="btn btn-ghost" href="/diseases">
            All research diseases
          </Link>
        </div>
      </main>
    );
  }

  let disease: Awaited<ReturnType<typeof getDisease>> | null = null;
  let offline = false;

  try {
    disease = await getDisease(slug);
  } catch {
    disease = ALS_FALLBACK;
    offline = true;
  }

  if (!disease) {
    return (
      <main className="page">
        <p className="error">Disease not found.</p>
        <p className="hint" style={{ marginTop: "0.75rem" }}>
          <Link href="/diseases">Back to Research hub</Link>
        </p>
      </main>
    );
  }

  const focus = disease.proteins.filter((p) => PROGRAM_FOCUS.has(p.uniprot_id));
  const others = disease.proteins.filter((p) => !PROGRAM_FOCUS.has(p.uniprot_id));

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · ALS
      </p>
      <header className="hub-hero hub-hero-visual">
        <div>
          <p className="learn-disease-kicker">Motor neuron · Full workspace</p>
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
            <Link className="btn btn-ghost" href="/diseases">
              All diseases
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
        New here? Start with{" "}
        <Link href="/learn">Learn</Link> — disease primers and the ALS track — or browse{" "}
        <Link href="/diseases">all research diseases</Link>.
      </p>
    </main>
  );
}
