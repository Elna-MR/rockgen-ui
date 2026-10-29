import Link from "next/link";
import { LiteratureSearch } from "@/components/LiteratureSearch";

export const metadata = { title: "Literature search — ProtScope™" };

export default async function LiteraturePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return (
    <main className="page">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · Literature
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.5rem" }}>
        <h1>Literature search</h1>
        <p className="lede">
          Search published papers on PubMed, limited to ALS by default. Results are live and not
          curated, so read the paper before relying on a claim.
        </p>
      </header>
      <LiteratureSearch initialQuery={(q || "").slice(0, 200)} />
    </main>
  );
}
