import Link from "next/link";
import { BetaWaitlistForm } from "@/components/BetaWaitlistForm";

const FREE_NOW = [
  { name: "Disease workspaces", note: "ALS, Parkinson's, Alzheimer's, Huntington's, FTD" },
  { name: "Structure explorer", note: "Search PDB, view folds, check mutation sites" },
  { name: "Biomarker explorer", note: "Known ALS biomarkers and their evidence" },
  { name: "Literature search", note: "Live PubMed search" },
  { name: "Ask", note: "Cited answers, fair use" },
];

const COMING = [
  { name: "Lumen companions", note: "Meridian, Helix and Allele. Pulse is already open." },
  { name: "Wider mutation analysis", note: "Genes and diseases beyond ALS" },
  { name: "Saved projects", note: "Keep and share your work" },
  { name: "Higher Ask limits", note: "More questions for active research" },
];

export default function BetaPage() {
  return (
    <main className="page beta-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Beta
      </p>

      <header className="hub-hero">
        <h1>ProtScope™ Beta</h1>
        <p className="science-thesis">The core tools are free while we build the rest.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/diseases">
            Start free
          </Link>
          <Link className="btn btn-ghost" href="#waitlist">
            Join Pro waitlist
          </Link>
        </div>
      </header>

      <section className="beta-plans" aria-label="What is free and what is coming">
        <div className="beta-plan beta-plan-free">
          <p className="beta-plan-tag">Free now</p>
          <ul>
            {FREE_NOW.map((f) => (
              <li key={f.name}>
                <strong>{f.name}</strong>
                <span>{f.note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="beta-plan">
          <p className="beta-plan-tag">Coming with Pro</p>
          <ul>
            {COMING.map((f) => (
              <li key={f.name}>
                <strong>{f.name}</strong>
                <span>{f.note}</span>
              </li>
            ))}
          </ul>
          <Link className="beta-plan-link" href="/agentics">
            See Lumen agents →
          </Link>
        </div>
      </section>

      <section className="section beta-waitlist-section">
        <BetaWaitlistForm />
      </section>

      <p className="hint beta-legal">
        Educational research platform. Not medical advice. Nothing is for sale yet.
      </p>
    </main>
  );
}
