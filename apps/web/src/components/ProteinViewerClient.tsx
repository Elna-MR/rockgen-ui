"use client";

import dynamic from "next/dynamic";

const ProteinViewer3D = dynamic(
  () => import("@/components/ProteinViewer3D").then((m) => m.ProteinViewer3D),
  {
    ssr: false,
    loading: () => <div className="viewer-canvas viewer-skeleton">Loading 3D viewer…</div>,
  }
);

export function ProteinViewerClient() {
  return <ProteinViewer3D />;
}
