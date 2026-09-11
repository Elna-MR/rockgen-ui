import { readFile } from "fs/promises";
import path from "path";
import Link from "next/link";
import { FalsNetworkGraph, type FalsGraph } from "@/components/FalsNetworkGraph";

async function loadGraph(): Promise<FalsGraph> {
  const file = path.join(process.cwd(), "public", "data", "fals-network.json");
  const raw = await readFile(file, "utf8");
  return JSON.parse(raw) as FalsGraph;
}

export default async function AlsNetworkPage() {
  const graph = await loadGraph();
  const edgeCount = graph.links.length;
  const connected = graph.nodes.filter((n) => n.degree > 0).length;

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · <Link href="/diseases/als">ALS</Link> · Gene network
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.75rem" }}>
        <h1>Familial ALS gene network</h1>
        <p className="lede">
          STRING interaction map across familial ALS genes, colored by functional module. Prefer the
          physical subnetwork for mechanistic reading; text-mining alone can over-connect co-mentioned
          genes.
        </p>
        <p className="meta-pill">
          {graph.meta.source} · {graph.meta.network_type} · score ≥ {graph.meta.required_score} ·{" "}
          {connected} connected / {graph.nodes.length} genes · {edgeCount} edges · retrieved{" "}
          {graph.meta.retrieved}
        </p>
      </header>

      <FalsNetworkGraph graph={graph} />

      <section className="section" style={{ marginTop: "1.5rem" }}>
        <h2>How to read this</h2>
        <ul className="learn-fact-list">
          <li>
            Edges are STRING evidence weights, not clinical causality. Thick edges mean stronger
            database/experiment support in this export.
          </li>
          <li>
            Rebuild with{" "}
            <code>scripts/fals_string_network.py --physical</code> (writes{" "}
            <code>apps/web/public/data/fals-network.json</code>).
          </li>
          <li>Educational research aid only — not a diagnosis or treatment tool.</li>
        </ul>
      </section>

      <p className="hint" style={{ marginTop: "1.25rem" }}>
        <Link href="/diseases/als">← ALS workspace</Link>
        {" · "}
        <Link href="/diseases/als/map">Disease map</Link>
        {" · "}
        <Link href="/diseases/als/mechanisms">Mechanisms</Link>
      </p>
    </main>
  );
}
