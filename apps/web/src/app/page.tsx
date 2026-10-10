import Link from "next/link";
import { MolecularHero } from "@/components/MolecularHero";

export default function HomePage() {
  return (
    <main className="home-page-editorial">
      <section className="home-hero-bleed">
        <div className="home-hero-visual" aria-hidden="true">
          <MolecularHero />
        </div>
        <div className="home-hero-scrim" aria-hidden="true" />
        <div className="home-hero-copy">
          <p className="eyebrow">Neurodegeneration research platform</p>
          <h1>ProtScope</h1>
          <p className="science-thesis">
            Map disease proteins, pathogenic variants, and shared cellular failure pathways
            before proposing therapeutics.
          </p>
          <p className="home-intro">
            ProtScope is an educational research workspace for neurodegenerative disease.
            Connect genes and proteins to pathological mechanisms such as protein misfolding,
            cytoskeletal stress, impaired axonal transport, and mitochondrial dysfunction,
            then inspect structures and evidence in one place. Educational only, not medical advice.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/learn">
              Learn
            </Link>
            <Link className="btn btn-ghost" href="/diseases">
              Research
            </Link>
          </div>
        </div>
      </section>

      <div className="page home-page-body">
        <section className="section home-paths" aria-label="Choose a path">
          <div className="path-grid path-grid-2">
            <Link href="/learn" className="path-tile path-tile-primary">
              <p className="eyebrow">Learn</p>
              <h2>Students &amp; families</h2>
              <p>
                Plain-language disease tracks. Start with how proteins and pathways fail in
                ALS, Parkinson&apos;s, Alzheimer&apos;s, and related conditions.
              </p>
            </Link>
            <Link href="/diseases" className="path-tile">
              <p className="eyebrow">Research</p>
              <h2>Scientists</h2>
              <p>
                Mechanism maps, protein structures, mutation context, and curated evidence
                tools for mechanism-first investigation.
              </p>
            </Link>
          </div>
        </section>

        <section className="section home-capabilities" aria-labelledby="capabilities-heading">
          <h2 id="capabilities-heading">What you can do here</h2>
          <ul className="home-capability-list">
            <li>
              <strong>Learn disease biology</strong>
              Follow gene → protein → pathway stories without assuming a therapeutic answer.
            </li>
            <li>
              <strong>Compare shared mechanisms</strong>
              See where diseases converge (for example aggregation or transport failure) and
              where they diverge.
            </li>
            <li>
              <strong>Inspect structures and variants</strong>
              Explore deposited protein folds and disease-linked substitutions in 3D context.
            </li>
            <li>
              <strong>Review evidence carefully</strong>
              Separate computational prediction, cell models, genetics, and clinical findings.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
