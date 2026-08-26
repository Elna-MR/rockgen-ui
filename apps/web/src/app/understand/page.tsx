import Link from "next/link";
import { UNDERSTAND_PAGES } from "@/data/alsGuide";

export default function UnderstandHubPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Understand
      </p>
      <header className="hub-hero">
        <h1>Understand ALS</h1>
        <p className="lede">
          Plain language for patients and families. Read at your own pace. This is education — not a
          diagnosis or treatment plan.
        </p>
      </header>

      <section className="section">
        <h2>Start here</h2>
        <div className="hub-grid">
          {UNDERSTAND_PAGES.map((p) => (
            <Link key={p.slug} href={`/understand/${p.slug}`} className="hub-link">
              <strong>{p.title}</strong>
              <span>{p.summary}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Also on this site</h2>
        <div className="hub-grid hub-grid-compact">
          <Link href="/learn" className="hub-link">
            <strong>Students</strong>
            <span>Learn biology with guides and practice.</span>
          </Link>
          <Link href="/diseases/als" className="hub-link">
            <strong>Researchers</strong>
            <span>ALS evidence workspace.</span>
          </Link>
        </div>
      </section>

      <p className="hint" style={{ marginTop: "1.5rem" }}>
        Always talk with your ALS clinic or physician about personal medical questions.
      </p>
    </main>
  );
}
