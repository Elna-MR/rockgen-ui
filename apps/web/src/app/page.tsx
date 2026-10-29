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
          <p className="eyebrow">Protein folding in health, Protein misfolding in disease.</p>
          <h1 className="brand-title">
            <span className="brand-name-prot">Prot</span>
            <span className="brand-name-scope">Scope</span>
            <sup className="brand-tm" aria-label="trademark">
              ™
            </sup>
          </h1>
          <p className="science-thesis">
            Map disease proteins, pathogenic variants, and shared cellular failure pathways
            before proposing therapeutics.
          </p>
          <p className="home-intro">
            ProtScope™ is a research workspace for neurodegenerative disease proteins. It links
            ALS genes, variants and biomarkers in a knowledge graph with evidence labels, and lets
            you explore experimentally solved structures.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/diseases">
              Explore diseases
            </Link>
            <Link className="btn btn-ghost" href="/proteins/explore">
              Open structures
            </Link>
          </div>
        </div>
      </section>

      <div className="page home-page-body">
        <section className="section home-paths" aria-label="Choose a path">
          <div className="path-grid path-grid-2">
            <Link href="/diseases#primers" className="path-tile path-tile-primary">
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
              <Link href="/diseases#primers">
                <strong>Learn disease biology</strong>
                <span>Follow gene → protein → pathway stories without assuming a therapeutic answer.</span>
                <em>Start learning →</em>
              </Link>
            </li>
            <li>
              <Link href="/diseases/als/mechanisms">
                <strong>Compare shared mechanisms</strong>
                <span>
                  See where PFN1 and TUBA4A share failure routes, such as aggregation or transport
                  stress, and where they differ.
                </span>
                <em>Open mechanisms →</em>
              </Link>
            </li>
            <li>
              <Link href="/proteins/explore">
                <strong>Explore structures and variants</strong>
                <span>
                  Search experimentally solved protein structures and check where an ALS variant
                  sits on them.
                </span>
                <em>Open structures →</em>
              </Link>
            </li>
            <li>
              <Link href="/diseases/als/evidence">
                <strong>Review evidence carefully</strong>
                <span>
                  Each claim is labeled as computational prediction, cell model, genetics or
                  clinical finding, with its limits.
                </span>
                <em>Open evidence →</em>
              </Link>
            </li>
          </ul>
        </section>

        <section className="section home-agentics-cta" aria-labelledby="home-agentics-heading">
          <h2 id="home-agentics-heading">Lumen</h2>
          <p className="hint">
            Lumen is ProtScope&rsquo;s set of four research agents. Pulse (biomarkers) can chat today;
            Meridian, Helix and Allele open in Beta.
          </p>
          <div className="cta-row">
            <Link className="btn btn-primary" href="/agentics">
              Meet Lumen
            </Link>
            <Link className="btn btn-ghost" href="/beta#waitlist">
              Join Beta waitlist
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
