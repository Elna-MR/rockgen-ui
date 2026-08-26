import Link from "next/link";
import { LEARN_GUIDES, PRACTICE } from "@/data/alsGuide";

export default function LearnHubPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Learn
      </p>
      <header className="hub-hero">
        <h1>Learn ALS biology</h1>
        <p className="lede">
          For students: build a clear picture of the disease, then practise with one research tool at
          a time. Families who want gentler language can start with Understand.
        </p>
      </header>

      <section className="section">
        <h2>Path</h2>
        <ol className="learn-list">
          <li>
            <strong>Orient</strong> —{" "}
            <Link href="/learn/als">ALS in five ideas</Link> or skim{" "}
            <Link href="/understand">Understand</Link> once.
          </li>
          <li>
            <strong>Read a guide</strong> — pick one article below.
          </li>
          <li>
            <strong>Practice</strong> — open one workspace page with a clear goal.
          </li>
        </ol>
      </section>

      <section className="section">
        <h2>Guides</h2>
        <div className="hub-grid">
          {LEARN_GUIDES.map((g) => (
            <Link key={g.slug} href={`/learn/guides/${g.slug}`} className="hub-link">
              <strong>{g.title}</strong>
              <span>{g.summary}</span>
            </Link>
          ))}
          <Link href="/learn/als" className="hub-link">
            <strong>ALS in five ideas</strong>
            <span>Short tour before deeper tools.</span>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Practice</h2>
        <div className="hub-grid">
          {PRACTICE.map((p) => (
            <Link key={p.slug} href={`/learn/practice/${p.slug}`} className="hub-link">
              <strong>{p.title}</strong>
              <span>
                {p.level === "intro" ? "Intro" : "Next"} — {p.goal}
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
