import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page home-page">
      <header className="science-hero">
        <p className="eyebrow">ALS · mechanism-first biology</p>
        <h1>RockGen</h1>
        <p className="science-thesis">
          Map disease proteins and shared mechanisms before designing drugs.
        </p>
        <p className="lede">
          A calm workspace for families, students, and researchers — evidence labeled, one tool at a
          time.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/approach">
            How the approach works
          </Link>
          <Link className="btn btn-ghost" href="/diseases/als">
            Open ALS workspace
          </Link>
        </div>
      </header>

      <section className="science-band" aria-labelledby="different-heading">
        <h2 id="different-heading">How RockGen works</h2>
        <p className="hint">Three ideas borrowed from serious biotech storytelling — applied to ALS learning and research.</p>
        <div className="pillar-grid">
          <article className="pillar">
            <h3>Mechanisms first</h3>
            <p>
              Shared failure routes across genes — aggregation, cytoskeleton, transport — before any
              molecule design.
            </p>
          </article>
          <article className="pillar">
            <h3>Evidence that travels</h3>
            <p>
              Claims stay tied to evidence type and confidence: computation, cells, animals, human
              genetics.
            </p>
          </article>
          <article className="pillar">
            <h3>One decision at a time</h3>
            <p>
              Progressive tools — overview, compare, map, Ask — so the next step stays clear and
              trustworthy.
            </p>
          </article>
        </div>
      </section>

      <section className="section" aria-label="Choose how to enter">
        <h2>Enter by audience</h2>
        <div className="path-grid path-grid-3">
          <Link href="/understand" className="path-tile">
            <p className="eyebrow">Patients &amp; families</p>
            <h2>Understand ALS</h2>
            <p>Plain language on the disease, the body, and how to read research gently.</p>
          </Link>
          <Link href="/learn" className="path-tile">
            <p className="eyebrow">Students</p>
            <h2>Learn the biology</h2>
            <p>Eight modules with outcomes, check prompts, and practice in real tools.</p>
          </Link>
          <Link href="/diseases/als" className="path-tile path-tile-primary">
            <p className="eyebrow">Researchers</p>
            <h2>ALS workspace</h2>
            <p>Proteins, mechanisms, maps, and review — focused and citation-aware.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
