import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";

export default function HomePage() {
  return (
    <main className="page home-page home-page-visual">
      <section className="home-stage">
        <div className="home-stage-copy">
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
        </div>
        <div className="home-stage-visual" aria-hidden="true">
          <ProteinField variant="hero" />
          <p className="home-stage-caption">Fold · route · evidence</p>
        </div>
      </section>

      <section className="science-band" aria-labelledby="different-heading">
        <h2 id="different-heading">How RockGen works</h2>
        <p className="hint">
          Three ideas borrowed from serious biotech storytelling — applied to ALS learning and
          research.
        </p>
        <div className="pillar-grid">
          <article className="pillar">
            <div className="pillar-glyph" aria-hidden="true">
              <ProteinField variant="panel" />
            </div>
            <h3>Mechanisms first</h3>
            <p>
              Shared failure routes across genes — aggregation, cytoskeleton, transport — before any
              molecule design.
            </p>
          </article>
          <article className="pillar">
            <div className="pillar-glyph" aria-hidden="true">
              <span className="glyph-nodes">
                <i />
                <i />
                <i />
              </span>
            </div>
            <h3>Evidence that travels</h3>
            <p>
              Claims stay tied to evidence type and confidence: computation, cells, animals, human
              genetics.
            </p>
          </article>
          <article className="pillar">
            <div className="pillar-glyph" aria-hidden="true">
              <span className="glyph-steps">
                <i />
                <i />
                <i />
              </span>
            </div>
            <h3>One decision at a time</h3>
            <p>
              Progressive tools — overview, compare, map, Ask — so the next step stays clear and
              trustworthy.
            </p>
          </article>
        </div>
      </section>

      <section className="section" aria-label="Choose how to enter">
        <h2>Enter RockGen</h2>
        <div className="path-grid path-grid-2">
          <Link href="/learn" className="path-tile path-tile-primary">
            <p className="eyebrow">Students &amp; families</p>
            <h2>Learning hub</h2>
            <p>
              Disease tiles for ALS, Parkinson’s, Alzheimer’s, and more — plain language plus student
              tracks.
            </p>
          </Link>
          <Link href="/diseases/als" className="path-tile">
            <p className="eyebrow">Researchers</p>
            <h2>Research workspace</h2>
            <p>Proteins, mechanisms, maps, and review — focused and citation-aware.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
