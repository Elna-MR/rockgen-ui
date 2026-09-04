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
          Evidence-weighted scientific review. Rankings and citations are deterministic; wording may
          be polished, not invented.
        </p>
      </header>
      <AskPanel />
      <p className="hint" style={{ marginTop: "1.5rem" }}>
        <Link href="/diseases">← Research hub</Link>
        {" · "}
        <Link href="/learn/als#plain-language">ALS plain language</Link>
      </p>
    </main>
  );
}
