import Link from "next/link";
import { AlsWorkspaceNav } from "@/components/AlsWorkspaceNav";
import { StructureToolFrame } from "@/components/StructureToolFrame";

export default function AlsNetworkPage() {
  return (
    <main className="page page-dossier page-fals-network">
      <p className="eyebrow">
        <Link href="/diseases">Research</Link> · <Link href="/diseases/als">ALS</Link> · Gene network
      </p>
      <header className="hub-hero" style={{ paddingBottom: "0.75rem" }}>
        <h1>Familial ALS gene network</h1>
        <p className="lede">
          Hand-curated interactions with therapeutic programme rings. Use Min confidence and
          Programmes only; hover a gene for pipeline detail.
        </p>
        <p className="meta-pill">46 genes · curated edges · programmes as of Sep 2026 · educational only</p>
      </header>

      <AlsWorkspaceNav active="network" />

      <StructureToolFrame
        src="/reference/fals-network.html"
        title="Familial ALS gene network with therapeutic programmes"
      />

      <p className="hint" style={{ marginTop: "1rem" }}>
        <a href="/reference/fals-network.html" target="_blank" rel="noreferrer">
          Open full-page viewer
        </a>
        {" · "}
        Rebuild STRING scores with <code>scripts/fals_string_network.py</code> if you want to swap the
        edge set later.
      </p>

      <p className="hint" style={{ marginTop: "0.75rem" }}>
        <Link href="/diseases/als">← ALS workspace</Link>
        {" · "}
        <Link href="/diseases/als/map">Disease map</Link>
        {" · "}
        <Link href="/diseases/als/mechanisms">Mechanisms</Link>
      </p>
    </main>
  );
}
