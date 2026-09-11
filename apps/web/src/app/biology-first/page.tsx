import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";

/** Explainer: understand disease biology before designing molecules. */
export default function BiologyFirstPage() {
  return (
    <main className="page approach-page approach-page-visual">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Biology first
      </p>

      <header className="science-hero approach-hero">
        <div className="approach-hero-copy">
          <h1>Biology first</h1>
          <p className="science-thesis">
            See how disease proteins fail and which shared routes matter before designing molecules.
          </p>
          <p className="lede">
            RockGen is an educational and research workspace for neurodegeneration: ALS, Parkinson’s,
            Alzheimer’s, Huntington’s, FTD, and related biology. It does not invent drugs or replace
            clinical care.
          </p>
        </div>
        <div className="approach-hero-visual" aria-hidden="true">
          <ProteinField variant="panel" />
        </div>
      </header>

      <section className="science-section">
        <h2>What is a disease mechanism?</h2>
        <p className="article-body">
          A mechanism is a shared biological failure route, for example protein aggregation,
          cytoskeleton stress, mitochondrial dysfunction, or axonal transport problems. Different
          genes and diseases can land on overlapping routes. Mapping those routes helps decide what
          is worth studying next.
        </p>
        <p className="article-body">
          Vulnerable neurons (motor, dopaminergic, cortical, striatal) keep many jobs in balance:
          folding proteins, clearing junk, shipping cargo, and keeping scaffolding stable. When those
          jobs fail, researchers ask which failure is primary and which is secondary, across diseases,
          not only one program.
        </p>
      </section>

      <section className="science-section">
        <h2>Biology first vs jumping to molecules</h2>
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
            <p className="eyebrow">Biology first</p>
            <h3>Rank the disease map first</h3>
            <p>
              Start from proteins, alleles, and evidence. Compare shared vs unique routes across
              genes and diseases. Prioritize what to investigate; molecule design comes later.
            </p>
          </article>
        </div>
      </section>

      <section className="science-section">
        <h2>The working chain</h2>
        <p className="hint">
          Same progressive order as a careful discovery program, without claiming a pipeline.
        </p>
        <ol className="flow-chain">
          <li>
            <strong>Gene &amp; protein</strong>
            <span>Case studies deepen first where the catalog is ready (e.g. ALS: PFN1, TUBA4A).</span>
          </li>
          <li>
            <strong>Alleles &amp; structure</strong>
            <span>Which changes look disruptive. Scores prioritize study, not diagnosis.</span>
          </li>
          <li>
            <strong>Shared mechanisms</strong>
            <span>Where biology converges across proteins and, over time, across diseases.</span>
          </li>
          <li>
            <strong>Evidence mix</strong>
            <span>Computation, in vitro, animals, human genetics: labeled, not flattened.</span>
          </li>
          <li>
            <strong>Prioritize next work</strong>
            <span>What to investigate first; therapy design remains a later step.</span>
          </li>
        </ol>
      </section>

      <section className="science-section">
        <h2>Why this matters</h2>
        <div className="pillar-grid">
          <article className="pillar">
            <h3>Many genes, overlapping biology</h3>
            <p>
              Neurodegenerative diseases are clinically distinct but often share failure themes.
              Mechanisms are the language that connects them without equating them.
            </p>
          </article>
          <article className="pillar">
            <h3>Undruggable is not unstudyable</h3>
            <p>
              Some proteins lack classic inhibitor pockets. Understanding conformation, aggregation,
              and scaffolding still guides experiments and future modalities.
            </p>
          </article>
          <article className="pillar">
            <h3>Trust requires limits</h3>
            <p>
              Biomarkers can reflect injury without proving one mutation’s mechanism. RockGen labels
              confidence and gaps on purpose.
            </p>
          </article>
        </div>
      </section>

      <section className="science-section science-cta">
        <h2>Continue</h2>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/learn">
            Learning hub
          </Link>
          <Link className="btn btn-ghost" href="/diseases">
            Research hub
          </Link>
          <Link className="btn btn-ghost" href="/proteins/explore">
            Structure lab
          </Link>
        </div>
      </section>
    </main>
  );
}
