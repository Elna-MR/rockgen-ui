"use client";

import { FormEvent, useState } from "react";
import { apiBase } from "@/lib/apiBase";

type PulseReply = {
  answer: string;
  biomarker_ids: string[];
  sources: { name: string; url: string }[];
  caveat: string;
  suggestions: string[];
  grounded_in: string;
};

type Turn = { question: string; reply?: PulseReply; error?: string };

export function PulseChat({ starters }: { starters: string[] }) {
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask(question: string) {
    const q = question.trim();
    if (q.length < 2 || busy) return;
    setBusy(true);
    setInput("");
    const index = turns.length;
    setTurns((t) => [...t, { question: q }]);
    try {
      const res = await fetch(`${apiBase()}/v1/pulse/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      if (!res.ok) throw new Error(`Pulse returned ${res.status}`);
      const reply = (await res.json()) as PulseReply;
      setTurns((t) => t.map((x, i) => (i === index ? { ...x, reply } : x)));
    } catch (e) {
      const error = e instanceof Error ? e.message : "Pulse is unavailable";
      setTurns((t) => t.map((x, i) => (i === index ? { ...x, error } : x)));
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  return (
    <section className="section" aria-labelledby="pulse-chat-heading">
      <h2 id="pulse-chat-heading">Ask Pulse</h2>
      <p className="hint">
        Pulse answers only from the ALS biomarkers in the knowledge graph. It is not a language
        model, so it cannot add facts the graph does not hold. Educational only.
      </p>

      {turns.length === 0 && (
        <div className="cta-row">
          {starters.map((s) => (
            <button key={s} type="button" className="btn btn-ghost" onClick={() => void ask(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      <div aria-live="polite">
        {turns.map((t, i) => (
          <article key={i} className="intel-card" style={{ marginTop: "1rem" }}>
            <p className="eyebrow">You asked</p>
            <p>
              <strong>{t.question}</strong>
            </p>
            {!t.reply && !t.error && <p className="hint">Checking the graph…</p>}
            {t.error && <p className="hint">Could not reach Pulse ({t.error}). Is the API running?</p>}
            {t.reply && (
              <>
                <p style={{ whiteSpace: "pre-line" }}>{t.reply.answer}</p>
                {t.reply.sources.length > 0 && (
                  <p className="hint">
                    <strong>Candidate data:</strong>{" "}
                    {t.reply.sources.map((s, j) => (
                      <span key={s.url + s.name}>
                        {j > 0 && ", "}
                        <a href={s.url} target="_blank" rel="noreferrer">
                          {s.name}
                        </a>
                      </span>
                    ))}
                  </p>
                )}
                <p className="hint">
                  Grounded in {t.reply.grounded_in}. {t.reply.caveat}
                </p>
              </>
            )}
          </article>
        ))}
      </div>

      <form onSubmit={onSubmit} className="cta-row" style={{ marginTop: "1rem" }}>
        <label htmlFor="pulse-input" className="sr-only">
          Ask Pulse about ALS biomarkers
        </label>
        <input
          id="pulse-input"
          type="text"
          value={input}
          maxLength={1000}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about an ALS biomarker…"
          style={{ flex: 1, minWidth: "16rem", padding: "0.6rem 0.8rem" }}
        />
        <button type="submit" className="btn btn-primary" disabled={busy || input.trim().length < 2}>
          Ask
        </button>
      </form>
    </section>
  );
}
