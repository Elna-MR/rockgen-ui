import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";
import { ResearchHubClient } from "@/components/ResearchHubClient";

export default function ResearchHubPage() {
  return (
    <main className="page learn-hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Research
      </p>
      <header className="hub-hero hub-hero-visual">
        <div>
          <h1>Research hub</h1>
          <p className="lede">
            Disease workspaces for ALS, Parkinson’s, Alzheimer’s, Huntington’s, and FTD —
            mechanisms, proteins, structures, and evidence tools. Open one disease at a time.
          </p>
          <p className="meta-pill">Mechanism-first · citation-aware · not medical advice</p>
        </div>
        <div className="hub-hero-motif" aria-hidden="true">
          <ProteinField variant="panel" />
        </div>
      </header>

      <ResearchHubClient />

      <section className="section learn-shared">
        <h2>Shared research labs</h2>
        <p className="hint">Use across diseases once you know the protein and mechanism map.</p>
        <div className="hub-grid">
          <Link href="/proteins/explore" className="hub-link">
            <strong>Structure explorer</strong>
            <span>PDB search, mutation sites, and folds</span>
          </Link>
          <Link href="/ask" className="hub-link">
            <strong>Ask a review</strong>
            <span>Structured scientific Q&amp;A with citations</span>
          </Link>
          <Link href="/mechanism-first" className="hub-link">
            <strong>Mechanism first</strong>
            <span>Prioritize routes before molecule design</span>
          </Link>
          <Link href="/learn" className="hub-link">
            <strong>Learning hub</strong>
            <span>Student primers for the same diseases</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
