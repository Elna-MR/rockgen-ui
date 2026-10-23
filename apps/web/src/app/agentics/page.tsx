import Link from "next/link";
import { AGENTICS_LIVE, BIOEMU2, PROTOSCOPE_COMPANIONS } from "@/data/agenticsHub";

export default function AgenticsPage() {
  return (
    <main className="page agentics-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Lumen
      </p>

      <header className="hub-hero">
        <h1 className="lumen-title">Lumen</h1>
        <p className="lede lumen-lede">
          Four agents for disease science. Use the live tools today. Chat opens in Beta. Educational
          only.
        </p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/ask">
            Try Ask
          </Link>
          <Link className="btn btn-ghost" href="/beta#waitlist">
            Join Beta waitlist
          </Link>
        </div>
      </header>

      <section className="section" aria-labelledby="lumen-agents-heading">
        <h2 id="lumen-agents-heading">Agents</h2>
        <ul className="lumen-agent-row">
          {PROTOSCOPE_COMPANIONS.map((c) => (
            <li key={c.slug}>
              <Link href={`/agents/${c.slug}`}>
                <strong>{c.name}</strong>
                <span>{c.focus}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="lumen-live-heading">
        <h2 id="lumen-live-heading">Open now</h2>
        <ul className="lumen-live-list">
          {AGENTICS_LIVE.map((cap) =>
            cap.href ? (
              <li key={cap.id}>
                <Link href={cap.href}>{cap.title}</Link>
              </li>
            ) : null,
          )}
        </ul>
      </section>

      <section className="section" aria-labelledby="bioemu-heading">
        <h2 id="bioemu-heading">Coming next</h2>
        <article className="lumen-feature">
          <p className="eyebrow">Structures engine · not a chat agent</p>
          <h3>{BIOEMU2.name}</h3>
          <p>
            {BIOEMU2.blurb}{" "}
            <a href={BIOEMU2.article} target="_blank" rel="noopener noreferrer">
              Introducing BioEmu2
            </a>
            {" · "}
            <a href={BIOEMU2.href} target="_blank" rel="noopener noreferrer">
              Open weights
            </a>
            .
          </p>
          <Link className="agentics-card-link" href="/proteins/explore">
            Structure explorer
          </Link>
        </article>
      </section>
    </main>
  );
}
