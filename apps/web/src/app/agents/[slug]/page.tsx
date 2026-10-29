import Link from "next/link";
import { notFound } from "next/navigation";
import { PulseChat } from "@/components/PulseChat";
import { getProtScopeCompanion, PROTOSCOPE_COMPANIONS } from "@/data/agenticsHub";

const PULSE_STARTERS = [
  "What does NfL tell us, and what can it not tell us?",
  "Which biomarkers can show a treatment is hitting its target?",
  "Which biomarkers can I measure in blood?",
  "Which biomarkers might identify TDP-43 pathology?",
];

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
          <span
            className={`agentics-chip ${companion.chat === "open" ? "agentics-chip-live" : "agentics-chip-soon"}`}
          >
            {companion.chat === "open" ? "Chat open" : "Chat in Beta"}
          </span>
        </div>
        <h1>{companion.name}</h1>
        <p className="lumen-tagline">{companion.focus}</p>
        <p className="science-thesis">
          {companion.name} is one of four <Link href="/agentics">Lumen</Link> agents, ProtScope&rsquo;s
          research assistants.
        </p>
        <p className="lede">
          {companion.blurb}{" "}
          {companion.slug === "pulse"
            ? "Pulse is open for questions below. Paid plans may unlock deeper sessions later — no payment today. Educational only; not medical advice."
            : `Conversation with ${companion.name} is not open for chat yet. Paid plans may unlock deeper sessions later — no payment today. Educational only; not medical advice.`}
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

      {companion.slug === "pulse" && <PulseChat starters={PULSE_STARTERS} />}

      <section className="section">
        <h2>What you can use today</h2>
        <p className="hint">
          {companion.slug === "pulse"
            ? "Pair the chat with the full biomarker explorer."
            : `Chat is not open yet. These live tools cover ${companion.focus.toLowerCase()} now.`}
        </p>
        <ul className="lumen-live-list">
          {companion.liveTools.map((t) => (
            <li key={t.href}>
              <Link href={t.href}>{t.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Questions {companion.name} is built for</h2>
        <ul className="gap-list">
          {companion.sampleQuestions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>
      </section>

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
