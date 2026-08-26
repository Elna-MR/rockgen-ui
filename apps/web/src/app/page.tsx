import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page hub-page">
      <header className="hub-hero">
        <p className="eyebrow">ALS · biology with care</p>
        <h1>RockGen</h1>
        <p className="lede">
          Plain language for families, a structured path for students, and an evidence workspace for
          researchers — each audience kept clear and uncluttered.
        </p>
      </header>

      <section className="path-grid path-grid-3" aria-label="Choose how to enter">
        <Link href="/understand" className="path-tile">
          <p className="eyebrow">Patients &amp; families</p>
          <h2>Understand ALS</h2>
          <p>What the disease is, what happens in the body, and how to read research gently.</p>
        </Link>
        <Link href="/learn" className="path-tile">
          <p className="eyebrow">Students</p>
          <h2>Learn the biology</h2>
          <p>Eight modules with outcomes, check prompts, and practice in real tools.</p>
        </Link>
        <Link href="/diseases/als" className="path-tile path-tile-primary">
          <p className="eyebrow">Researchers</p>
          <h2>ALS workspace</h2>
          <p>Proteins, mechanisms, maps, and review — one focused tool at a time.</p>
        </Link>
      </section>
    </main>
  );
}
