import Link from "next/link";

export default function LearnAlsPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · Module 01
      </p>
      <header className="hub-hero">
        <h1>ALS in five ideas</h1>
        <p className="lede">
          Amyotrophic lateral sclerosis damages motor neurons. Many genes can contribute; they often
          share overlapping biology even when the proteins look different.
        </p>
        <p className="meta-pill">~5 min · Outcome: tell the disease story without jargon</p>
      </header>

      <ol className="learn-list">
        <li>
          <strong>Genes encode proteins.</strong> In this program you will meet{" "}
          <Link href="/proteins/P07737">PFN1</Link> (actin / cell framework) and{" "}
          <Link href="/proteins/P68366">TUBA4A</Link> (microtubules).
        </li>
        <li>
          <strong>Mutations change shape and behavior.</strong> Some alleles raise aggregation or
          stress the cytoskeleton; comparison pages show which change looks most disruptive.
        </li>
        <li>
          <strong>Mechanisms are the shared language.</strong> Aggregation, cytoskeleton failure, and
          axonal transport can appear across different proteins.
        </li>
        <li>
          <strong>Evidence has types.</strong> Computation, cell assays, animals, and human genetics
          are not equal — RockGen labels the mix.
        </li>
        <li>
          <strong>Prioritize before designing drugs.</strong> Rank mechanisms to investigate; molecule
          generation comes later.
        </li>
      </ol>

      <aside className="check-panel" aria-label="Check your understanding">
        <h2>Check your understanding</h2>
        <ol>
          <li>Say the five ideas back in your own words (no looking).</li>
          <li>Which idea separates “interesting finding” from “ready for therapy design”?</li>
        </ol>
      </aside>

      <div className="cta-row" style={{ marginTop: "2rem" }}>
        <Link className="btn btn-primary" href="/learn/practice/patient-view">
          Next: patient lens
        </Link>
        <Link className="btn btn-ghost" href="/learn">
          Full curriculum
        </Link>
      </div>
    </main>
  );
}
