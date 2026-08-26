import { NextRequest, NextResponse } from "next/server";

const ALLOWED: Record<string, string[]> = {
  "AF-P07737-F1": [
    "https://alphafold.ebi.ac.uk/files/AF-P07737-F1-model_v6.pdb",
    "https://alphafold.ebi.ac.uk/files/AF-P07737-F1-model_v4.pdb",
  ],
  "2PAV": ["https://files.rcsb.org/download/2PAV.pdb"],
};

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const key = id.replace(/\.pdb$/i, "");

  // Prefer bundled public file when present (served by Next statically);
  // this route is a live-fetch fallback for CORS / upstream freshness.
  const urls = ALLOWED[key];
  if (!urls) {
    return NextResponse.json({ error: `Unknown structure ${key}` }, { status: 404 });
  }

  let lastError = "fetch failed";
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "RockGenStructureProxy/1.0" },
        next: { revalidate: 86400 },
      });
      if (!res.ok) {
        lastError = `${url} → ${res.status}`;
        continue;
      }
      const text = await res.text();
      if (!text.includes("ATOM") && !text.includes("HETATM")) {
        lastError = `${url} → empty/invalid PDB`;
        continue;
      }
      return new NextResponse(text, {
        status: 200,
        headers: {
          "Content-Type": "chemical/x-pdb",
          "Cache-Control": "public, max-age=86400",
        },
      });
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
    }
  }

  return NextResponse.json({ error: lastError }, { status: 502 });
}
