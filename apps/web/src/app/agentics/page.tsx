import Link from "next/link";
import { AGENTICS_LIVE, BIOEMU2, PROTOSCOPE_COMPANIONS } from "@/data/agenticsHub";

const STEPS = [
  {
    title: "You ask",
    text: "Pick the agent for your topic and ask in plain language.",
  },
  {
    title: "It checks the graph",
    text: "Answers come from the ProtScope knowledge graph: proteins, variants, biomarkers and evidence.",
  },
  {
    title: "You see the evidence",
    text: "Each claim carries a confidence level scored in code. No invented citations.",
  },
];

export default function AgenticsPage() {
  return (
    <main className="page agentics-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Lumen
      </p>

      <header className="hub-hero">
        <h1 className="lumen-title">Lumen</h1>
        <p className="lumen-tagline">ProtScope&rsquo;s research agents</p>
        <p className="lede lumen-lede">
          Lumen is the name for the set of agents inside ProtScope. Each agent covers one part of
          neurodegeneration research and answers only from the evidence in the knowledge graph.
          Educational only, not medical advice.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/agents/pulse">
            Chat with Pulse
          </Link>
          <Link className="btn btn-ghost" href="/beta#waitlist">
            Join Beta waitlist
          </Link>
        </div>
      </header>

      <section className="section" aria-labelledby="lumen-how-heading">
        <h2 id="lumen-how-heading">How Lumen works</h2>
        <ol className="lumen-steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="lumen-step-num" aria-hidden="true">
                {i + 1}
              </span>
              <strong>{s.title}</strong>
              <span>{s.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="lumen-agents-heading">
        <h2 id="lumen-agents-heading">The four agents</h2>
        <p className="hint">
          Pulse can chat today. The other three are in Beta: their tools are live, and chat opens
          later.
        </p>
        <ul className="lumen-cards">
          {PROTOSCOPE_COMPANIONS.map((c) => {
            const tool = c.liveTools[0];
            return (
              <li key={c.slug} className="lumen-card">
                <div className="lumen-card-top">
                  <h3>{c.name}</h3>
                  <span
                    className={`agentics-chip ${c.chat === "open" ? "agentics-chip-live" : "agentics-chip-soon"}`}
                  >
                    {c.chat === "open" ? "Chat open" : "Chat in Beta"}
                  </span>
                </div>
                <p className="agentics-companion-focus">{c.focus}</p>
                <p>{c.blurb}</p>
                <p className="lumen-card-q">
                  <span>Example</span> &ldquo;{c.sampleQuestions[0]}&rdquo;
                </p>
                <div className="lumen-card-actions">
                  <Link className="btn btn-primary" href={`/agents/${c.slug}`}>
                    {c.chat === "open" ? `Chat with ${c.name}` : `About ${c.name}`}
                  </Link>
                  {c.chat !== "open" && tool && (
                    <Link className="btn btn-ghost" href={tool.href}>
                      {tool.label}
                    </Link>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="section" aria-labelledby="lumen-live-heading">
        <h2 id="lumen-live-heading">Tools you can use now</h2>
        <p className="hint">
          Live today, no waitlist. Each agent page links the tools that cover its topic.
        </p>
        <ul className="lumen-tools">
          {AGENTICS_LIVE.map((cap) =>
            cap.href ? (
              <li key={cap.id}>
                <Link href={cap.href} className="lumen-tool">
                  <span className="agentics-chip agentics-chip-live">Live</span>
                  <strong>{cap.title}</strong>
                  <span className="lumen-tool-blurb">{cap.blurb}</span>
                  <span className="lumen-tool-cta">{cap.ctaLabel ?? "Open"} &rarr;</span>
                </Link>
              </li>
            ) : null,
          )}
        </ul>
      </section>

      <section className="section" aria-labelledby="bioemu-heading">
        <h2 id="bioemu-heading">Coming next</h2>
        <article className="lumen-next">
          <div>
            <span className="agentics-chip agentics-chip-soon">Not live yet</span>
            <h3>{BIOEMU2.name}</h3>
            <p className="lumen-next-kind">Structures engine · not a chat agent</p>
          </div>
          <div>
            <p>{BIOEMU2.blurb}</p>
            <p className="lumen-next-links">
              <a href={BIOEMU2.article} target="_blank" rel="noopener noreferrer">
                Introducing BioEmu2
              </a>
              <a href={BIOEMU2.href} target="_blank" rel="noopener noreferrer">
                Open weights
              </a>
              <Link href="/proteins/explore">Structure explorer today</Link>
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
