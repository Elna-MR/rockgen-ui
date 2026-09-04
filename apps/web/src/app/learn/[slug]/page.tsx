import Link from "next/link";
import { notFound } from "next/navigation";
import { ProteinField } from "@/components/ProteinField";
import { getLearnDisease, LEARN_DISEASES } from "@/data/learnHub";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEARN_DISEASES.filter((d) => d.slug !== "als").map((d) => ({ slug: d.slug }));
}

export default async function LearnDiseasePage({ params }: Props) {
  const { slug } = await params;
  if (slug === "als") notFound();
  const disease = getLearnDisease(slug);
  if (!disease) notFound();

  return (
    <main className="page learn-disease-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · {disease.shortName}
      </p>
      <header className="hub-hero hub-hero-visual">
        <div>
          <p className="learn-disease-kicker">
            {disease.category} · {disease.status === "ready" ? "Full track" : "Growing primer"}
          </p>
          <h1>{disease.shortName}</h1>
          <p className="science-thesis science-thesis-compact">{disease.tagline}</p>
          <p className="lede">{disease.summary}</p>
          <p className="meta-pill">
            {disease.modules} modules · {disease.minutes}
          </p>
        </div>
        <div className="hub-hero-motif" aria-hidden="true">
          <ProteinField variant="panel" />
        </div>
      </header>

      <section className="section" id="overview">
        <h2>Key ideas for students</h2>
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

      <section className="section">
        <h2>Learning track</h2>
        <p className="hint">Short path for this disease — then reuse shared RockGen labs.</p>
        <ol className="curriculum">
          {disease.track.map((step, i) => (
            <li key={step.title}>
              <Link href={step.href} className="curriculum-row">
                <span className="curriculum-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="curriculum-body">
                  <h3>{step.title}</h3>
                  <p>
                    <span className="curriculum-kind">{step.kind}</span>
                    {step.blurb}
                  </p>
                </div>
                <span className="curriculum-meta">{step.minutes}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <aside className="check-panel" aria-label="Study tip">
        <h2>Study tip</h2>
        <p>
          Compare this disease with <Link href="/learn/als">ALS</Link> using the same vocabulary:
          protein → local structure change → shared mechanism → evidence type. Do not treat these
          primers as clinical guidance.
        </p>
      </aside>

      <div className="cta-row" style={{ marginTop: "1.75rem" }}>
        <Link className="btn btn-primary" href={disease.track[0]?.href || "/learn"}>
          Start this track
        </Link>
        <Link className="btn btn-ghost" href="/proteins/explore">
          Structure lab
        </Link>
        <Link className="btn btn-ghost" href="/learn">
          All diseases
        </Link>
      </div>
    </main>
  );
}
