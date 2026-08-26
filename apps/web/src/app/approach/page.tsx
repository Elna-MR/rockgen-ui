import Link from "next/link";

/**
 * Science explainer — storytelling pattern inspired by biotech modality pages
 * (e.g. Origami’s “What is protein degradation?”), adapted for RockGen’s
 * mechanism-first ALS platform. Educational — not a therapeutics pitch.
 */
export default function ApproachPage() {
  return (
    <main className="page approach-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Approach
      </p>

      <header className="science-hero approach-hero">
        <h1>Mechanism-first ALS biology</h1>
        <p className="science-thesis">
          Understand how disease proteins fail — and which shared routes matter — before designing
          molecules.
        </p>
        <p className="lede">
          RockGen is an educational and research workspace. It does not invent drugs or replace
          clinical care.
        </p>
      </header>

      <section className="science-section">
        <h2>What is a disease mechanism?</h2>
        <p className="article-body">
          A mechanism is a shared biological failure route — for example protein aggregation,
          cytoskeleton stress, or axonal transport problems. Different genes can land on the same
          route. Mapping those routes helps decide what is worth studying next.
        </p>
        <p className="article-body">
          In ALS, motor neurons are especially vulnerable. Inside those cells, many jobs must stay in
          balance: folding proteins, clearing junk, shipping cargo along long axons, and keeping the
          cell’s scaffolding stable. When those jobs fail, researchers ask which failure is primary
          and which is secondary.
        </p>
      </section>

      <section className="science-section">
        <h2>Mechanisms are different than molecule lists</h2>
        <div className="contrast-split">
          <article className="contrast-panel">
            <p className="eyebrow">Molecule-first</p>
            <h3>Jump to compounds</h3>
            <p>
              Start from a chemical idea or a single target name. Risk: optimizing a molecule before
              the disease biology is clear, or treating one gene as the whole disease.
            </p>
          </article>
          <article className="contrast-panel contrast-panel-accent">
            <p className="eyebrow">Mechanism-first</p>
            <h3>Rank biology first</h3>
            <p>
              Start from proteins, alleles, and evidence. Compare shared vs unique routes across
              genes (PFN1, TUBA4A). Prioritize what to investigate — molecule design comes later.
            </p>
          </article>
        </div>
      </section>

      <section className="science-section">
        <h2>The working chain</h2>
        <p className="hint">Same progressive order as a careful discovery program — without claiming a pipeline.</p>
        <ol className="flow-chain">
          <li>
            <strong>Gene &amp; protein</strong>
            <span>Case studies today: PFN1 (actin) and TUBA4A (microtubules).</span>
          </li>
          <li>
            <strong>Alleles &amp; structure</strong>
            <span>Which changes look disruptive — scores prioritize study, not diagnosis.</span>
          </li>
          <li>
            <strong>Shared mechanisms</strong>
            <span>Where biology converges across proteins.</span>
          </li>
          <li>
            <strong>Evidence mix</strong>
            <span>Computation, in vitro, animals, human genetics — labeled, not flattened.</span>
          </li>
          <li>
            <strong>Prioritize next work</strong>
            <span>What to investigate first; therapy design remains a later step.</span>
          </li>
        </ol>
      </section>

      <section className="science-section">
        <h2>Why this matters for ALS</h2>
        <div className="pillar-grid">
          <article className="pillar">
            <h3>Many genes, overlapping biology</h3>
            <p>
              ALS is clinically one syndrome with diverse genetics. Shared mechanisms are the
              language that connects them.
            </p>
          </article>
          <article className="pillar">
            <h3>Undruggable is not unstudyable</h3>
            <p>
              Some proteins lack classic inhibitor pockets. Understanding conformation, aggregation,
              and scaffolding still guides experiments — and future modalities.
            </p>
          </article>
          <article className="pillar">
            <h3>Trust requires limits</h3>
            <p>
              Biomarkers like NfL can reflect injury without proving one mutation’s mechanism.
              RockGen labels confidence and gaps on purpose.
            </p>
          </article>
        </div>
      </section>

      <section className="science-section science-cta">
        <h2>Continue</h2>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/diseases/als/mechanisms">
            Mechanism prioritization
          </Link>
          <Link className="btn btn-ghost" href="/learn">
            Student curriculum
          </Link>
          <Link className="btn btn-ghost" href="/understand">
            Family-friendly guides
          </Link>
        </div>
      </section>
    </main>
  );
}
