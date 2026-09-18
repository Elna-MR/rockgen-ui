import { NextResponse } from "next/server";
import { getSiteKnowledge } from "@/data/siteKnowledge";
import { answerFromChunks, searchSiteKnowledge } from "@/lib/siteSearch";

export const runtime = "nodejs";

type ChatMessage = { role: "user" | "assistant"; content: string };

type Body = {
  message?: string;
  history?: ChatMessage[];
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const message = (body.message || "").trim();
  if (message.length < 2 || message.length > 2000) {
    return NextResponse.json({ error: "Message must be 2–2000 characters." }, { status: 400 });
  }

  const hits = searchSiteKnowledge(message, 6);
  const sources = hits.map((h) => ({
    id: h.id,
    title: h.title,
    href: h.href,
    section: h.section,
    score: h.score,
  }));

  let answer = answerFromChunks(message, hits);
  let mode: "site" | "site+llm" = "site";

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && hits.length) {
    try {
      answer = await polishWithOpenAI(message, hits, body.history || [], apiKey);
      mode = "site+llm";
    } catch {
      // keep retrieval answer
    }
  }

  return NextResponse.json({
    answer,
    sources,
    mode,
    corpus_size: getSiteKnowledge().length,
  });
}

async function polishWithOpenAI(
  question: string,
  hits: ReturnType<typeof searchSiteKnowledge>,
  history: ChatMessage[],
  apiKey: string,
): Promise<string> {
  const context = hits.map((h) => ({
    title: h.title,
    href: h.href,
    section: h.section,
    text: h.text.slice(0, 900),
  }));

  const system = [
    "You are RockGen’s site guide chatbot.",
    "Answer ONLY using the provided website context chunks.",
    "Prefer short, clear paragraphs. Include 1–3 markdown links to relevant href paths (e.g. /diseases/als/network).",
    "If the context is insufficient, say so and suggest which RockGen areas to open.",
    "Never invent papers, drugs, dosages, or personal medical advice.",
    "Always end with one line: Educational only — not medical advice.",
  ].join(" ");

  const recent = history
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const user = JSON.stringify({ question, recent, context }, null, 0);

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!resp.ok) {
    throw new Error(`OpenAI ${resp.status}`);
  }
  const data = (await resp.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Empty LLM response");
  return text;
}
