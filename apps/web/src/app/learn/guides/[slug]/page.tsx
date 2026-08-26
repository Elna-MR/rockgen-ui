import Link from "next/link";
import { notFound } from "next/navigation";
import { LEARN_GUIDES, getLearnGuide } from "@/data/alsGuide";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return LEARN_GUIDES.map((g) => ({ slug: g.slug }));
}

export default async function LearnGuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getLearnGuide(slug);
  if (!guide) notFound();

  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/learn">Learn</Link> · <Link href="/learn/guides">Guides</Link>
      </p>
      <header className="hub-hero">
        <h1>{guide.title}</h1>
        <p className="lede">{guide.summary}</p>
      </header>

      <article className="section">
        {guide.paragraphs.map((para, i) => (
          <p key={i} className="article-body" style={{ marginBottom: "1.1rem" }}>
            {para}
          </p>
        ))}
      </article>

      {guide.next && guide.next.length > 0 && (
        <section className="section">
          <h2>Continue</h2>
          <div className="hub-grid">
            {guide.next.map((n) => (
              <Link key={n.href} href={n.href} className="hub-link">
                <strong>{n.label}</strong>
                <span>Next</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <p className="hint" style={{ marginTop: "1.5rem" }}>
        <Link href="/learn">← Learn hub</Link>
      </p>
    </main>
  );
}
