import Link from "next/link";

/** Explainer: understand disease biology before designing molecules. */
export default function BiologyFirstPage() {
  return (
    <main className="page approach-page approach-page-visual">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Biology
      </p>

      <header className="science-hero approach-hero">
        <div className="approach-hero-copy">
          <h1>Biology</h1>
          <p className="science-thesis">
            Characterize disease by investigating proteins, proteotoxicity, pathogenic variants,
            and shared cellular pathways involved in disease progression.
          </p>
          <p className="lede">
            ProtScope™ is a platform where neurodegenerative diseases can be studied by analyzing
            proteins and pathological processes.
          </p>
        </div>
        <div className="approach-hero-visual approach-hero-visual-strong" aria-hidden="true">
          <img
            src="/brand/protscope-hero-ribbon-light.png?v=plate1"
            alt=""
            width={640}
            height={360}
            draggable={false}
          />
        </div>
      </header>

      <section className="science-section">
        <h2>What is a disease mechanism, and how to investigate it?</h2>
        <p className="article-body">
          A disease mechanism is a pathological process that can impact an organ, such as the
          central nervous system, and injure vulnerable neurons. For example, proteotoxicity that
          includes protein misfolding and aggregation, endoplasmic reticulum stress, cytoskeletal
          stress, mitochondrial dysfunction, or impaired axonal transport may be involved. Genes
          and proteins that malfunction in diseases can converge on overlapping routes. Mapping
          those routes helps in understanding the details and how the events take place within an
          organ and in the body.
        </p>
        <p className="article-body">
          In the nervous system, neurons are specialized for the functions they carry out, such as
          motor neurons (upper and lower), dopaminergic neurons, cortical neurons, and striatal
          neurons. They all have machinery that normally keeps organelles working under robust
          quality control, so they can carry out neurotransmission, cargo transport, and other
          tasks while maintaining cytoskeletal integrity. When those systems are injured and
          neuronal integrity and function are affected, neurological symptoms appear in a variety
          of ways.
        </p>
        <p className="article-body">
          ProtScope™ enables you to investigate these by examining each component, starting from
          genes and proteins, and conducting AI-powered protein chemistry experiments on this site
          to discover the mechanism and identify targets.
        </p>
      </section>

      <section className="science-section">
        <h2>Biology vs jumping to molecules</h2>
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
            <p className="eyebrow">Biology</p>
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
              Biomarkers can reflect injury without proving one mutation’s mechanism. ProtScope labels
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
