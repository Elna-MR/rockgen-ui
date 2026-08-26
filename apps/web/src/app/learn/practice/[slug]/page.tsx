import Link from "next/link";
import { notFound } from "next/navigation";
import { PRACTICE, getPractice } from "@/data/alsGuide";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRACTICE.map((p) => ({ slug: p.slug }));
}

export default async function PracticeExercisePage({ params }: Props) {
  const { slug } = await params;
  const exercise = getPractice(slug);
  if (!exercise) notFound();

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · <Link href="/learn/practice">Practice</Link>
      </p>
      <header className="hub-hero">
        <h1>{exercise.title}</h1>
        <p className="lede">{exercise.goal}</p>
        <p className="meta-pill">
          {exercise.level === "intro" ? "Intro" : "Next"} · ~{exercise.minutes} min
        </p>
      </header>

      <section className="section">
        <h2>Steps</h2>
        <ol className="learn-list">
          {exercise.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </section>

      <div className="cta-row" style={{ marginTop: "1.25rem" }}>
        <Link className="btn btn-primary" href={exercise.openHref}>
          {exercise.openLabel}
        </Link>
        <Link className="btn btn-ghost" href="/learn">
          Learn hub
        </Link>
      </div>

      {exercise.reflect && exercise.reflect.length > 0 && (
        <aside className="reflect-panel" aria-label="Reflect">
          <h2>Write before you leave</h2>
          <ol>
            {exercise.reflect.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </aside>
      )}

      <p className="hint" style={{ marginTop: "1.5rem" }}>
        <Link href="/learn/practice">← All practice</Link>
      </p>
    </main>
  );
}
