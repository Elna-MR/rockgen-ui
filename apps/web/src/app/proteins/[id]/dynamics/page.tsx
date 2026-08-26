import Link from "next/link";
import { DynamicsReportPanel } from "@/components/DynamicsReportPanel";

type Props = { params: Promise<{ id: string }> };

export default async function ProteinDynamicsPage({ params }: Props) {
  const { id } = await params;
  if (id.toUpperCase() !== "P07737") {
    return (
      <main className="page hub-page">
        <p className="error">Dynamics PoC is currently available for PFN1 (P07737).</p>
        <Link href={`/proteins/${id}`}>← Back</Link>
      </main>
    );
  }

  return (
    <main className="page page-dossier">
      <p className="eyebrow">
        <Link href={`/proteins/${id}`}>PFN1</Link> · Dynamics
      </p>
      <DynamicsReportPanel />
    </main>
  );
}
