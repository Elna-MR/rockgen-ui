import Link from "next/link";
import { notFound } from "next/navigation";
import { UNDERSTAND_PAGES, getUnderstandPage } from "@/data/alsGuide";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return UNDERSTAND_PAGES.map((p) => ({ slug: p.slug }));
}

export default async function AlsPlainLanguagePage({ params }: Props) {
  const { slug } = await params;
  const page = getUnderstandPage(slug);
  if (!page) notFound();

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · <Link href="/learn/als">ALS</Link> · Plain language
      </p>
      <header className="hub-hero">
        <h1>{page.title}</h1>
        <p className="lede">{page.summary}</p>
        <p className="meta-pill">For families &amp; newcomers · education only</p>
      </header>

      <article className="section">
        {page.paragraphs.map((para, i) => (
          <p key={i} className="article-body" style={{ marginBottom: "1.1rem" }}>
            {para}
          </p>
        ))}
      </article>

      {page.next && page.next.length > 0 && (
        <section className="section">
          <h2>Continue</h2>
          <div className="hub-grid">
            {page.next.map((n) => (
              <Link key={n.href} href={n.href} className="hub-link">
                <strong>{n.label}</strong>
                <span>Next</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="hint" style={{ marginTop: "1.5rem" }}>
        <Link href="/learn/als#plain-language">← ALS learn track</Link>
        {" · "}
        <Link href="/learn">All diseases</Link>
      </p>
    </main>
  );
}
