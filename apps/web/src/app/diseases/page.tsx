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
          <h1>Research hub</h1>
          <p className="lede">
            Disease workspaces for ALS, Parkinson&apos;s, Alzheimer&apos;s, Huntington&apos;s, and FTD.
            Open one disease at a time to inspect proteins, pathogenic variants, shared
            pathological pathways, structures, and evidence tools, without jumping to drug design.
          </p>
          <p className="meta-pill">Mechanism-first · citation-aware · not medical advice</p>
        </div>
      </header>

      <ResearchHubClient />

      <section className="section research-cite" aria-labelledby="research-cite-heading">
        <h2 id="research-cite-heading">ALS research</h2>
        <p className="hint">Selected work informing this workspace.</p>
        <ul className="research-cite-list">
          <li>
            <strong>Mahmoud Kiaei</strong>
            <span className="research-cite-meta">ALS · PFN1 · neurodegeneration</span>
            <div className="research-cite-links">
              <a
                href="https://scholar.google.com/citations?user=B4g745MAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Scholar
              </a>
              <a
                href="https://pubmed.ncbi.nlm.nih.gov/28040732/"
                target="_blank"
                rel="noopener noreferrer"
              >
                PFN1<sup>G118V</sup> ALS mouse model
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
            <span>STRING map of familial ALS genes</span>
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

      <section className="section learn-shared">
        <h2>Shared research labs</h2>
        <p className="hint">Use across diseases once you know the protein and mechanism map.</p>
        <div className="hub-grid">
          <Link href="/proteins/explore" className="hub-link">
            <strong>Structure explorer</strong>
            <span>PDB search, mutation sites, and folds</span>
          </Link>
          <Link href="/ask" className="hub-link">
            <strong>Ask a review</strong>
            <span>Structured scientific Q&amp;A with citations</span>
          </Link>
          <Link href="/biology-first" className="hub-link">
            <strong>Biology</strong>
            <span>See the disease map before designing molecules</span>
          </Link>
          <Link href="/learn" className="hub-link">
            <strong>Learning hub</strong>
            <span>Student primers for the same diseases</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
