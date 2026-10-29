import Link from "next/link";
import { BetaWaitlistForm } from "@/components/BetaWaitlistForm";
import { BETA_COMPARISON } from "@/data/agenticsHub";

export default function BetaPage() {
  return (
    <main className="page beta-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Beta
      </p>

      <header className="hub-hero">
        <h1>Protoscope™ Beta</h1>
        <p className="science-thesis">
          Core ProtScope is free in Beta. Lumen agents come next; paid plans coming soon.
        </p>
        <p className="lede beta-lede">
          Free today: Learn, Research, Structures, and fair-use Ask. Lumen agents (Meridian, Helix,
          Allele, Pulse) are Beta; chat not open yet. No payment on this page. Educational only.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/learn">
            Start free
          </Link>
          <Link className="btn btn-ghost" href="#waitlist">
            Join Pro waitlist
          </Link>
        </div>
      </header>

      <section className="section" aria-labelledby="beta-free-heading">
        <h2 id="beta-free-heading">Free in Beta</h2>
        <ul className="home-capability-list">
          <li>
            <strong>Learn hubs</strong>
            Disease primers and student tracks for ALS and growing neurodegeneration maps.
          </li>
          <li>
            <strong>Research browse</strong>
            Disease workspaces and biology-first explainer without a paywall.
          </li>
          <li>
            <strong>Structures</strong>
            PDB search, 3D explore, mutation inspector and peptide design UI embeds.
          </li>
          <li>
            <strong>Ask (fair use)</strong>
            Evidence-weighted Scientific Review for the current supported science questions.
          </li>
        </ul>
      </section>

      <section className="section" aria-labelledby="beta-pro-heading">
        <h2 id="beta-pro-heading">Paid plans (coming soon)</h2>
        <p className="hint">
          Optional payment later for deeper Agentics and companion sessions. Not for sale yet —
          join the waitlist.
        </p>
        <ul className="home-capability-list">
          <li>
            <strong>ProtScope companion chat</strong>
            Pulse (biomarkers) can chat now. Meridian, Helix and Allele are planned. Answers come from the knowledge graph and are not validated.
          </li>
          <li>
            <strong>Expanded mutation analysis</strong>
            Broader gene and disease coverage beyond ALS demos.
          </li>
          <li>
            <strong>Peptide ligand design pipelines</strong>
            Server-backed design with saved runs (planned). Any output would be a computational hypothesis, not a validated binder.
          </li>
          <li>
            <strong>Higher Ask quotas &amp; saved workspaces</strong>
            Capacity and persistence for active research use (planned).
          </li>
        </ul>
        <div className="cta-row" style={{ marginTop: "1rem" }}>
          <Link className="btn btn-ghost" href="/agentics">
            See Lumen agents
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="beta-compare-heading">
        <h2 id="beta-compare-heading">Compare</h2>
        <div className="beta-table-wrap">
          <table className="beta-table">
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col">Free Beta</th>
                <th scope="col">Protoscope™ Pro</th>
              </tr>
            </thead>
            <tbody>
              {BETA_COMPARISON.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td>{row.free}</td>
                  <td>{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section beta-waitlist-section">
        <BetaWaitlistForm />
      </section>

      <section className="section beta-legal">
        <p className="hint">
          Protoscope™ and ProtScope refer to this educational research platform. Content is for
          learning and research orientation only and is not medical advice, diagnosis, or treatment
          guidance. No payment is collected on this page.
        </p>
      </section>
    </main>
  );
}
