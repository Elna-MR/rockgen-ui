import Link from "next/link";
import { AskPanel } from "@/components/AskPanel";

export default function AskPage() {
  return (
    <main className="page hub-page">
      <p className="eyebrow">
        <Link href="/">Home</Link> · Ask
      </p>
      <header className="hub-hero">
        <h1>Ask</h1>
        <p className="lede">
          Ask a science question and get a structured review: what the evidence supports, what
          conflicts with it, and what is still unproven.
        </p>
        <p className="hint">
          Ask reviews a limited, curated evidence set about PFN1 G118V. It can be incomplete or
          wrong, its confidence labels come from fixed rules, and it is not medical advice.
        </p>
      </header>
      <AskPanel />
      <p className="hint" style={{ marginTop: "1.5rem" }}>
        <Link href="/diseases">← Research hub</Link>
        {" · "}
        <Link href="/diseases/primers/als#plain-language">ALS plain language</Link>
      </p>
    </main>
  );
}
