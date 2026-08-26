import Link from "next/link";
import { PRACTICE } from "@/data/alsGuide";

export default function PracticeIndexPage() {
  const intro = PRACTICE.filter((p) => p.level === "intro");
  const next = PRACTICE.filter((p) => p.level === "next");

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · Practice
      </p>
      <header className="hub-hero">
        <h1>Practice</h1>
        <p className="lede">One exercise, one goal, then write a short reflection before moving on.</p>
      </header>

      <section className="section">
        <h2>Intro</h2>
        <div className="hub-grid">
          {intro.map((p) => (
            <Link key={p.slug} href={`/learn/practice/${p.slug}`} className="hub-link">
              <strong>{p.title}</strong>
              <span>{p.goal}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Next</h2>
        <div className="hub-grid">
          {next.map((p) => (
            <Link key={p.slug} href={`/learn/practice/${p.slug}`} className="hub-link">
              <strong>{p.title}</strong>
              <span>{p.goal}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
