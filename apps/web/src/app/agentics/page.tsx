import Link from "next/link";
import { AGENTICS_COMING, AGENTICS_LIVE, PROTOSCOPE_COMPANIONS } from "@/data/agenticsHub";

function statusClass(status: "live" | "coming_soon", tier: "free" | "pro") {
  if (status === "live") return "agentics-chip agentics-chip-live";
  if (tier === "pro") return "agentics-chip agentics-chip-pro";
  return "agentics-chip agentics-chip-soon";
}

function statusLabel(status: "live" | "coming_soon", tier: "free" | "pro") {
  if (status === "live") return "Live";
  if (tier === "pro") return "Beta · pay later";
  return "Coming soon";
}

export default function AgenticsPage() {
  return (
    <main className="page agentics-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Lumen
      </p>

      <header className="hub-hero">
        <div className="agent-character-badges">
          <span className="agentics-chip agentics-chip-live">ProtScope agents</span>
          <span className="agentics-chip agentics-chip-pro">Beta</span>
        </div>
        <h1 className="lumen-title">Lumen</h1>
        <p className="lumen-tagline">ProtScope agents</p>
        <p className="science-thesis">
          Evidence-grounded ProtScope agents, not ungrounded chatbot science.
        </p>
        <p className="lede lumen-lede">
          Beta: use live tools now; chat with Meridian, Helix, Allele, and Pulse later. No payment
          yet. Educational only.
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

      <section className="section" aria-labelledby="agentics-live-heading">
        <h2 id="agentics-live-heading">Live now</h2>
        <p className="hint">Working surfaces you can open today.</p>
        <div className="agentics-grid">
          {AGENTICS_LIVE.map((cap) => (
            <article key={cap.id} className="agentics-card">
              <div className="agentics-card-top">
                <span className={statusClass(cap.status, cap.tier)}>
                  {statusLabel(cap.status, cap.tier)}
                </span>
              </div>
              <h3>{cap.title}</h3>
              <p>{cap.blurb}</p>
              {cap.href ? (
                <Link className="agentics-card-link" href={cap.href}>
                  {cap.ctaLabel ?? "Open"}
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="agentics-companions-heading">
        <h2 id="agentics-companions-heading">Meet the ProtScope agents</h2>
        <p className="hint">
          Lumen agents you will chat with in Beta. Conversation is not open yet; payment options may
          follow later.
        </p>
        <div className="agentics-grid">
          {PROTOSCOPE_COMPANIONS.map((c) => (
            <article key={c.slug} className="agentics-card agentics-card-soon">
              <div className="agentics-card-top">
                <span className="agentics-chip agentics-chip-live">ProtScope agent</span>
                <span className="agentics-chip agentics-chip-pro">Beta</span>
              </div>
              <h3>{c.name}</h3>
              <p className="agentics-companion-focus">{c.focus}</p>
              <p>{c.blurb}</p>
              <Link className="agentics-card-link" href={`/agents/${c.slug}`}>
                Meet {c.name}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="agentics-soon-heading">
        <h2 id="agentics-soon-heading">Coming in Beta</h2>
        <p className="hint">
          Deeper Lumen analysis pipelines. Paid unlocks may come later — join the waitlist for
          updates.
        </p>
        <div className="agentics-grid">
          {AGENTICS_COMING.map((cap) => (
            <article key={cap.id} className="agentics-card agentics-card-soon">
              <div className="agentics-card-top">
                <span className={statusClass(cap.status, cap.tier)}>
                  {statusLabel(cap.status, cap.tier)}
                </span>
              </div>
              <h3>{cap.title}</h3>
              <p>{cap.blurb}</p>
              <Link className="agentics-card-link" href="/beta#waitlist">
                {cap.ctaLabel ?? "Join waitlist"}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section agentics-grounding" aria-labelledby="agentics-ground-heading">
        <h2 id="agentics-ground-heading">How grounding works</h2>
        <p className="article-body">
          Live Scientific Review pulls claims and evidence from the knowledge graph, then scores
          confidence in application code. Optional language polish does not invent citations. We do
          not present scaffolded multi-agent workflows as if they were already running.
        </p>
        <p className="article-body">
          Working chain: gene and protein → alleles and structure → shared mechanisms → evidence →
          design later. Educational only; not medical advice.
        </p>
      </section>

      <section className="section" aria-labelledby="agentics-roadmap-heading">
        <h2 id="agentics-roadmap-heading">Near-term Lumen roadmap</h2>
        <ul className="home-capability-list">
          <li>
            <strong>Mutation analysis depth</strong>
            Broader disease-gene coverage beyond the current ALS demos.
          </li>
          <li>
            <strong>Peptide ligand design</strong>
            Server-backed pipelines with auditability, beyond the free exploration UI.
          </li>
          <li>
            <strong>Agent conversations</strong>
            Chat with Meridian, Helix, Allele, and Pulse over graph-grounded science.
          </li>
        </ul>
        <div className="cta-row" style={{ marginTop: "1.25rem" }}>
          <Link className="btn btn-primary" href="/beta">
            Beta waitlist
          </Link>
        </div>
      </section>
    </main>
  );
}
