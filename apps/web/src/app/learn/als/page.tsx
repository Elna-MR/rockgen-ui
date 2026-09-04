import Link from "next/link";
import { ProteinField } from "@/components/ProteinField";
import { LEARN_GUIDES, LEARN_MODULES, PRACTICE, UNDERSTAND_PAGES } from "@/data/alsGuide";
import { getLearnDisease } from "@/data/learnHub";

export default function LearnAlsTrackPage() {
  const disease = getLearnDisease("als")!;

  return (
    <main className="page learn-disease-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · ALS
      </p>
      <header className="hub-hero hub-hero-visual">
        <div>
          <p className="learn-disease-kicker">
            {disease.category} · {disease.status === "ready" ? "Full track" : "Growing"}
          </p>
          <h1>{disease.shortName}</h1>
          <p className="science-thesis science-thesis-compact">{disease.tagline}</p>
          <p className="lede">
            One ALS learning home for families and students — plain-language primers, then the deeper
            curriculum and practice labs. Educational only; not medical advice.
          </p>
          <p className="meta-pill">
            {disease.modules} modules · {disease.minutes} · plain language included
          </p>
        </div>
        <div className="hub-hero-motif" aria-hidden="true">
          <ProteinField variant="panel" />
        </div>
      </header>

      <section className="section" id="plain-language">
        <h2>Plain language</h2>
        <p className="hint">
          Start here if you are new to ALS biology — written for families and first-time readers.
        </p>
        <div className="hub-grid">
          {UNDERSTAND_PAGES.map((p) => (
            <Link key={p.slug} href={`/learn/als/plain/${p.slug}`} className="hub-link">
              <strong>{p.title}</strong>
              <span>
                {p.minutes ? `${p.minutes} min · ` : ""}
                {p.summary}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section" id="overview">
        <h2>Key ideas</h2>
        <ul className="learn-fact-list">
          {disease.keyFacts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Proteins to know</h2>
        <div className="learn-protein-grid">
          {disease.proteins.map((p) => (
            <div key={p.symbol} className="learn-protein-card">
              {p.href ? (
                <Link href={p.href}>
                  <strong>{p.symbol}</strong>
                </Link>
              ) : (
                <strong>{p.symbol}</strong>
              )}
              <span className="hint">{p.name}</span>
              <p>{p.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Mechanism words</h2>
        <div className="chip-row">
          {disease.mechanisms.map((m) => (
            <span key={m} className="chip chip-static">
              {m}
            </span>
          ))}
        </div>
      </section>

      <section className="section" id="curriculum">
        <h2>Student curriculum</h2>
        <p className="hint">Follow in order the first time. Jump ahead only if you already know the outcome.</p>
        <ol className="curriculum">
          {LEARN_MODULES.map((m) => (
            <li key={m.id}>
              <Link href={m.href} className="curriculum-row">
                <span className="curriculum-num">{String(m.number).padStart(2, "0")}</span>
                <div className="curriculum-body">
                  <h3>{m.title}</h3>
                  <p>
                    <span className="curriculum-kind">{m.kind}</span>
                    {m.outcome}
                  </p>
                </div>
                <span className="curriculum-meta">{m.minutes}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <h2>Guides</h2>
        <div className="hub-grid">
          {LEARN_GUIDES.map((g) => (
            <Link key={g.slug} href={`/learn/guides/${g.slug}`} className="hub-link">
              <strong>{g.title}</strong>
              <span>
                {g.minutes ? `${g.minutes} min · ` : ""}
                {g.summary}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Practice lab</h2>
        <div className="hub-grid">
          {PRACTICE.map((p) => (
            <Link key={p.slug} href={`/learn/practice/${p.slug}`} className="hub-link">
              <strong>{p.title}</strong>
              <span>
                {p.level === "intro" ? "Intro" : "Next"} · {p.minutes} min — {p.goal}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="cta-row" style={{ marginTop: "1.5rem" }}>
        <Link className="btn btn-primary" href="/learn/als/plain/what-is-als">
          Start plain language
        </Link>
        <Link className="btn btn-ghost" href="/learn/als/orient">
          Student module 01
        </Link>
        <Link className="btn btn-ghost" href="/diseases/als">
          ALS research workspace
        </Link>
        <Link className="btn btn-ghost" href="/learn">
          All diseases
        </Link>
      </div>
    </main>
  );
}
