"use client";

import Link from "next/link";
import { FormEvent, useEffect, useId, useRef, useState } from "react";

type Source = { id: string; title: string; href: string; section: string };
type Msg = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

const STARTERS = [
  "What is ALS?",
  "Where is the gene network?",
  "How do I use Structure explorer?",
  "What is Biology?",
  "Tell me about SOD1 programmes",
];

function renderAnswer(text: string) {
  // Light markdown: **bold** and /path links
  const parts = text.split(/(\*\*[^*]+\*\*|\/[a-z0-9][a-z0-9\-/_]*)/gi);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^\/[a-z0-9]/i.test(part) && !part.includes(" ")) {
      return (
        <Link key={i} href={part} className="site-chat-inline-link">
          {part}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function SiteChatbot() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi — I search RockGen’s Learn, Research, Structure, and gene-network material. Ask where to go or what a page covers. Not medical advice.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    inputRef.current?.focus();
  }, [open, messages, loading]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, history }),
      });
      if (!res.ok) throw new Error(`Chat failed (${res.status})`);
      const data = (await res.json()) as {
        answer: string;
        sources?: Source[];
      };
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            e instanceof Error
              ? `Sorry — ${e.message}. Try again in a moment.`
              : "Sorry — something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className={`site-chat ${open ? "site-chat-open" : ""}`}>
      {open && (
        <section
          id={panelId}
          className="site-chat-panel"
          aria-label="RockGen site guide chat"
        >
          <header className="site-chat-header">
            <div>
              <p className="site-chat-kicker">Site guide</p>
              <h2>Ask RockGen</h2>
            </div>
            <button
              type="button"
              className="site-chat-icon-btn"
              aria-label="Close chat"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="site-chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`site-chat-bubble site-chat-${m.role}`}
              >
                <p className="site-chat-text">{renderAnswer(m.content)}</p>
                {m.sources && m.sources.length > 0 && (
                  <ul className="site-chat-sources">
                    {m.sources.slice(0, 4).map((s) => (
                      <li key={s.id}>
                        <Link href={s.href} onClick={() => setOpen(false)}>
                          {s.title}
                        </Link>
                        <span>{s.section}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {loading && (
              <p className="site-chat-status" aria-live="polite">
                Searching site material…
              </p>
            )}
          </div>

          <div className="site-chat-starters" aria-label="Suggested questions">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                className="site-chat-starter"
                disabled={loading}
                onClick={() => void send(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <form className="site-chat-form" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="site-chat-input">
              Your question
            </label>
            <textarea
              id="site-chat-input"
              ref={inputRef}
              rows={2}
              value={input}
              disabled={loading}
              placeholder="Ask about pages, genes, Learn tracks…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
            />
            <button
              type="submit"
              className="btn btn-primary site-chat-send"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
          <p className="site-chat-footnote">
            Answers from indexed RockGen pages ·{" "}
            <Link href="/ask" onClick={() => setOpen(false)}>
              Scientific review (Ask)
            </Link>
          </p>
        </section>
      )}

      <button
        type="button"
        className={`site-chat-fab ${open ? "site-chat-fab-close" : ""}`}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          "Close"
        ) : (
          <>
            <svg
              className="site-chat-fab-icon"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7A2.5 2.5 0 0 1 16.5 16H10l-4 3.2V16H7.5A2.5 2.5 0 0 1 5 13.5v-7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            Ask RockGen
          </>
        )}
      </button>
    </div>
  );
}
