import Link from "next/link";

/** Module 01: kept as a short orient lesson inside the ALS track. */
export default function LearnAlsOrientPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · <Link href="/learn/als">ALS</Link> · Module 01
      </p>
      <header className="hub-hero">
        <h1>ALS in five ideas</h1>
        <p className="lede">
          Amyotrophic lateral sclerosis is a progressive disease of upper and lower motor neurons.
          Many genes can contribute; their products often converge on overlapping pathological
          pathways even when the proteins have different normal jobs.
        </p>
        <p className="meta-pill">~5 min · Outcome: tell the disease story in accurate, plain terms</p>
      </header>

      <ol className="learn-list">
        <li>
          <strong>Genes encode proteins.</strong> In this track you will meet{" "}
          <Link href="/proteins/P07737">PFN1</Link> (profilin-1, an actin regulator) and{" "}
          <Link href="/proteins/P68366">TUBA4A</Link> (an α-tubulin isoform that builds microtubules).
        </li>
        <li>
          <strong>Pathogenic variants can change fold and function.</strong> Some alleles increase
          aggregation propensity or stress the cytoskeleton; comparison pages highlight which
          substitutions look most disruptive in current models.
        </li>
        <li>
          <strong>Mechanisms are the shared language.</strong> Protein misfolding/aggregation,
          cytoskeletal failure, and impaired axonal transport can appear across different proteins.
        </li>
        <li>
          <strong>Evidence has types.</strong> Computation, cell assays, animal models, and human
          genetics are not interchangeable; ProtScope labels the mix.
        </li>
        <li>
          <strong>Prioritize before designing drugs.</strong> Rank pathological pathways to
          investigate; molecule design comes later.
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
        <Link className="btn btn-ghost" href="/learn/als">
          ALS learning track
        </Link>
      </div>
    </main>
  );
}
