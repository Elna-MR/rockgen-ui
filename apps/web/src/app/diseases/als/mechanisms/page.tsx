import Link from "next/link";
import { AlsMechanismPrioritization } from "@/components/AlsMechanismPrioritization";
import { mechanismReportMarkdownUrl } from "@/lib/api";

export default function AlsMechanismsPage() {
  const reportUrl = mechanismReportMarkdownUrl("als");
  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href="/diseases/als">ALS</Link> · Mechanisms
      </p>
      <header className="dossier-header" style={{ marginBottom: "1.5rem" }}>
        <div>
          <h1>Mechanism prioritization</h1>
          <p className="lede">
            Which ALS mechanisms are shared by PFN1 and TUBA4A — and which intervention to study
            first?
          </p>
        </div>
        <a className="btn btn-ghost" href={reportUrl}>
          Download report
        </a>
      </header>
      <AlsMechanismPrioritization markdownUrl={reportUrl} />
    </main>
  );
}
