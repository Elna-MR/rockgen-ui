import Link from "next/link";
import { notFound } from "next/navigation";
import { getProtScopeCompanion, PROTOSCOPE_COMPANIONS } from "@/data/agenticsHub";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PROTOSCOPE_COMPANIONS.map((a) => ({ slug: a.slug }));
}

export default async function CompanionPage({ params }: Props) {
  const { slug } = await params;
  const companion = getProtScopeCompanion(slug);
  if (!companion) notFound();

  return (
    <main className="page agent-character-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · <Link href="/agentics">Lumen</Link> · {companion.name}
      </p>

      <header className="hub-hero">
        <div className="agent-character-badges">
          <span className="agentics-chip agentics-chip-live">ProtScope agent</span>
          <span className="agentics-chip agentics-chip-pro">Beta</span>
        </div>
        <h1>{companion.name}</h1>
        <p className="lumen-tagline">{companion.focus}</p>
        <p className="science-thesis">A Lumen agent in ProtScope.</p>
        <p className="lede">
          {companion.blurb} Conversation with {companion.name} is not open for chat yet. Paid plans
          may unlock deeper sessions later — no payment today. Educational only; not medical advice.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/beta#waitlist">
            Join Beta waitlist
          </Link>
          <Link className="btn btn-ghost" href="/agentics">
            All Lumen agents
          </Link>
        </div>
      </header>

      <section className="section">
        <h2>How you will communicate</h2>
        <p className="article-body">
          When chat opens in Beta, you will message {companion.name} in ProtScope about{" "}
          {companion.focus.toLowerCase()}. Answers stay evidence-grounded like Live Ask: claims tied
          to sources, confidence scored in code, and no invented citations.
        </p>
      </section>
    </main>
  );
}
