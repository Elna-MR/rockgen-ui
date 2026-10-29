import Link from "next/link";
import { ResearchHubClient } from "@/components/ResearchHubClient";

export default function ResearchHubPage() {
  return (
    <main className="page learn-hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Research
      </p>
      <header className="hub-hero">
        <div>
          <h1>Research and learning hub</h1>
          <p className="lede">
            Pick a neurodegenerative disease to open its workspace: protein maps, mutation
            context, structures and cited evidence. Each disease also has a plain-language primer
            if you are new to the biology.
          </p>
          <p className="meta-pill">Mechanism-first · citation-aware · not medical advice</p>
        </div>
      </header>

      <ResearchHubClient />

      <section className="section research-cite" aria-labelledby="research-cite-heading">
        <h2 id="research-cite-heading">ALS research</h2>
        <p className="hint">Selected published work informing this workspace.</p>
        <ul className="research-cite-list">
          <li>
            <strong>Animal model of PFN1-linked ALS</strong>
            <span className="research-cite-meta">ALS · PFN1 · neurodegeneration</span>
            <div className="research-cite-links">
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/28040732/"
                target="_blank"
                rel="noopener noreferrer"
              >
                PFN1<sup>G118V</sup> ALS mouse model (PubMed)
              </a>
            </div>
          </li>
        </ul>
      </section>

      <section className="section learn-shared">
        <h2>ALS ready tools</h2>
        <p className="hint">Deepest workspace today, including the familial gene network.</p>
        <div className="hub-grid">
          <Link href="/diseases/als" className="hub-link">
            <strong>ALS workspace</strong>
            <span>Overview, proteins, and full tool set</span>
          </Link>
          <Link href="/diseases/als/network" className="hub-link">
            <strong>Gene network</strong>
            <span>Curated map of familial ALS genes</span>
          </Link>
          <Link href="/diseases/als/mechanisms" className="hub-link">
            <strong>Mechanisms</strong>
            <span>Prioritize shared routes across PFN1 and TUBA4A</span>
          </Link>
          <Link href="/diseases/als/map" className="hub-link">
            <strong>Disease map</strong>
            <span>Browse ALS by biology axis</span>
          </Link>
        </div>
      </section>

      <section className="section learn-shared" id="primers">
        <h2>New to the biology? Start here</h2>
        <p className="hint">Student primers, guides and practice. Each disease workspace above also links to its own primer.</p>
        <div className="hub-grid">
          <Link href="/diseases/primers/als" className="hub-link">
            <strong>ALS primer</strong>
            <span>Plain-language track and student curriculum</span>
          </Link>
          <Link href="/diseases/primers/guides/mental-model" className="hub-link">
            <strong>Mental model</strong>
            <span>Gene → protein → mechanism → disease</span>
          </Link>
          <Link href="/diseases/primers/guides/evidence" className="hub-link">
            <strong>Read evidence</strong>
            <span>Claim vs evidence type vs confidence</span>
          </Link>
          <Link href="/diseases/primers/practice" className="hub-link">
            <strong>Practice</strong>
            <span>Short exercises using the real tools</span>
          </Link>
        </div>
      </section>

      <section className="section learn-shared">
        <h2>Shared research labs</h2>
        <p className="hint">Use across diseases once you know the protein and mechanism map.</p>
        <div className="hub-grid">
          <Link href="/proteins/explore" className="hub-link">
            <strong>Structure explorer</strong>
            <span>PDB search, mutation sites, and folds</span>
          </Link>
          <Link href="/diseases/literature" className="hub-link">
            <strong>Literature search</strong>
            <span>Live PubMed search, ALS papers by default</span>
          </Link>
          <Link href="/ask" className="hub-link">
            <strong>Ask a review</strong>
            <span>Structured scientific Q&amp;A with citations</span>
          </Link>
          <Link href="/biology-first" className="hub-link">
            <strong>Biology</strong>
            <span>Read the biology background for these proteins and pathways</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
