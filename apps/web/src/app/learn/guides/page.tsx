import Link from "next/link";
import { LEARN_GUIDES } from "@/data/alsGuide";

export default function GuidesIndexPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · Guides
      </p>
      <header className="hub-hero">
        <h1>Guides</h1>
        <p className="lede">Readings with check prompts — then practice in real tools.</p>
      </header>
      <div className="hub-grid">
        {LEARN_GUIDES.map((g) => (
          <Link key={g.slug} href={`/learn/guides/${g.slug}`} className="hub-link">
            <strong>{g.title}</strong>
            <span>{g.summary}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
