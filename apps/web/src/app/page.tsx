import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";

export default function HomePage() {
  return (
    <main className="page home-page home-page-visual">
      <section className="home-stage">
        <div className="home-stage-copy">
          <p className="eyebrow">Neurodegeneration biology workspace</p>
          <h1>RockGen</h1>
          <p className="science-thesis">
            Learn and research disease proteins across ALS, Parkinson’s, Alzheimer’s, and related
            biology — mechanisms before molecules.
          </p>
          <p className="lede">
            Plain-language tracks for families and students. Citation-aware tools for researchers.
            One disease, one decision at a time.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/learn">
              Start learning
            </Link>
            <Link className="btn btn-ghost" href="/diseases">
              Open research
            </Link>
          </div>
        </div>
        <div className="home-stage-visual" aria-hidden="true">
          <ProteinField variant="hero" />
          <p className="home-stage-caption">Protein · mechanism · evidence</p>
        </div>
      </section>

      <section className="science-band" aria-labelledby="different-heading">
        <h2 id="different-heading">What you get</h2>
        <p className="hint">
          Built for serious biology storytelling — without drowning you in a dashboard.
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
        <h2>Choose a path</h2>
        <div className="path-grid path-grid-2">
          <Link href="/learn" className="path-tile path-tile-primary">
            <p className="eyebrow">Students &amp; families</p>
            <h2>Learning hub</h2>
            <p>
              Disease tiles with plain language and student tracks — ALS, Parkinson’s, Alzheimer’s,
              and more.
            </p>
          </Link>
          <Link href="/diseases" className="path-tile">
            <p className="eyebrow">Researchers</p>
            <h2>Research hub</h2>
            <p>
              Disease workspaces for mechanisms, maps, structures, and citation-aware review.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}
