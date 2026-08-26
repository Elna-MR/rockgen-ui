import { NextRequest, NextResponse } from "next/server";

const STATIC: Record<string, string[]> = {
  "AF-P07737-F1": [
    "https://alphafold.ebi.ac.uk/files/AF-P07737-F1-model_v6.pdb",
    "https://alphafold.ebi.ac.uk/files/AF-P07737-F1-model_v4.pdb",
  ],
  "2PAV": ["https://files.rcsb.org/download/2PAV.pdb"],
};

function resolveUrls(key: string): string[] | null {
  if (STATIC[key]) return STATIC[key];
  // AlphaFold by UniProt: AF-P07737-F1
  const af = /^AF-([A-Z0-9]+)-F(\d+)$/i.exec(key);
  if (af) {
    const uid = af[1].toUpperCase();
    const f = af[2];
    return [
      `https://alphafold.ebi.ac.uk/files/AF-${uid}-F${f}-model_v6.pdb`,
      `https://alphafold.ebi.ac.uk/files/AF-${uid}-F${f}-model_v4.pdb`,
    ];
  }
  // RCSB PDB id
  if (/^[0-9][A-Za-z0-9]{3}$/.test(key)) {
    return [`https://files.rcsb.org/download/${key.toUpperCase()}.pdb`];
  }
  return null;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const key = id.replace(/\.pdb$/i, "");
  const urls = resolveUrls(key);
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
