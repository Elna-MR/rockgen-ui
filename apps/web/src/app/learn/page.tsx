import Link from "next/link";
import { LearnHubClient } from "@/components/LearnHubClient";
import { ProteinField } from "@/components/ProteinField";

export default function LearnHubPage() {
  return (
    <main className="page learn-hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Learn
      </p>
      <header className="hub-hero hub-hero-visual">
        <div>
          <h1>Learning hub</h1>
          <p className="lede">
            Search and open disease tracks for students — ALS, Parkinson’s, Alzheimer’s, and related
            neurodegenerative biology. Each tile links proteins, mechanisms, and practice tools.
          </p>
          <p className="meta-pill">Mechanism-first · not medical advice · start with one disease</p>
        </div>
        <div className="hub-hero-motif" aria-hidden="true">
          <ProteinField variant="panel" />
        </div>
      </header>

      <LearnHubClient />

      <section className="section learn-shared">
        <h2>Shared student tools</h2>
        <p className="hint">Use across diseases once you know the basic map.</p>
        <div className="hub-grid">
          <Link href="/learn/guides/mental-model" className="hub-link">
            <strong>Mental model</strong>
            <span>Gene → protein → mechanism → disease</span>
          </Link>
          <Link href="/learn/guides/evidence" className="hub-link">
            <strong>Read evidence</strong>
            <span>Claim vs evidence type vs confidence</span>
          </Link>
          <Link href="/proteins/explore" className="hub-link">
            <strong>Structure lab</strong>
            <span>Search PDB folds and mutation sites</span>
          </Link>
          <Link href="/how-it-works" className="hub-link">
            <strong>How it works</strong>
            <span>The RockGen method story</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
