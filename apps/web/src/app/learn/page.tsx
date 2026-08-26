import Link from "next/link";
import { LEARN_GUIDES, LEARN_MODULES, PRACTICE } from "@/data/alsGuide";

export default function LearnHubPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Learn
      </p>
      <header className="hub-hero">
        <h1>Learn ALS biology</h1>
        <p className="lede">
          An eight-step path: orient, read, then practice with one research tool at a time. Each
          module has a clear outcome so you know what “done” looks like.
        </p>
        <p className="meta-pill">~75 minutes total · families: use Understand instead</p>
      </header>

      <section className="section">
        <h2>Curriculum</h2>
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
        <p className="hint">Deeper reading — each ends with check-your-understanding prompts.</p>
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
        <p className="hint">Open one tool with a goal, then write short reflections before moving on.</p>
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

      <p className="hint" style={{ marginTop: "1.5rem" }}>
        Ready for full tools? <Link href="/diseases/als">Open the ALS research workspace</Link>.
      </p>
    </main>
  );
}
