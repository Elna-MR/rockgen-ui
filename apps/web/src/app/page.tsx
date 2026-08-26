import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page hub-page">
      <header className="hub-hero">
        <p className="eyebrow">ALS — understand · learn · research</p>
        <h1>RockGen</h1>
        <p className="lede">
          One place for families to understand ALS in plain language, for students to learn the
          biology, and for researchers to work with evidence — without mixing every audience into
          one crowded page.
        </p>
      </header>

      <section className="path-grid path-grid-3" aria-label="Choose how to enter">
        <Link href="/understand" className="path-tile">
          <p className="eyebrow">Patients &amp; families</p>
          <h2>Understand ALS</h2>
          <p>What the disease is, what happens in the body, and how to read research claims gently.</p>
        </Link>
        <Link href="/learn" className="path-tile">
          <p className="eyebrow">Students</p>
          <h2>Learn the biology</h2>
          <p>Guides and practice that build from plain language into real research tools.</p>
        </Link>
        <Link href="/diseases/als" className="path-tile path-tile-primary">
          <p className="eyebrow">Researchers</p>
          <h2>ALS workspace</h2>
          <p>Proteins, mechanisms, maps, and scientific review — one tool at a time.</p>
        </Link>
      </section>

      <p className="hint hub-quiet">
        Educational site — not medical advice. Care decisions belong with your clinical team.
      </p>
    </main>
  );
}
