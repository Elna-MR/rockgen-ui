import { NextRequest, NextResponse } from "next/server";

type Hit = {
  pdb_id: string;
  title: string;
  method: string;
  chains: number;
  year: string;
  score: number;
  thumbnail: string;
  resolution: number | null;
};

async function entrySummary(pdbId: string, score: number): Promise<Hit | null> {
  try {
    const res = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`, {
      headers: { "User-Agent": "ProtScopeStructureExplorer/1.0" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const d = await res.json();
    const info = d.rcsb_entry_info || {};
    const released = d.rcsb_accession_info?.initial_release_date || "";
    return {
      pdb_id: pdbId.toUpperCase(),
      title: d.struct?.title || pdbId,
      method: (d.exptl || [])[0]?.method || "Unknown",
      chains: info.deposited_polymer_entity_instance_count ?? info.polymer_entity_count ?? 1,
      year: released.slice(0, 4) || "—",
      resolution: info.resolution_combined?.[0] ?? null,
      score,
      thumbnail: `https://cdn.rcsb.org/images/structures/${pdbId.toLowerCase()}_assembly-1.jpeg`,
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  // Known ALS genes search by UniProt accession, so every hit is that human protein.
  const uniprot = (req.nextUrl.searchParams.get("uniprot") || "").trim().toUpperCase();
  const byUniprot = /^[A-Z][A-Z0-9]{5,9}$/.test(uniprot);
  const rows = Math.min(Number(req.nextUrl.searchParams.get("rows") || 14), 24);
  if (!q && !byUniprot) {
    return NextResponse.json({ query: q, total: 0, results: [] });
  }

  try {
    const searchRes = await fetch("https://search.rcsb.org/rcsbsearch/v2/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "ProtScopeStructureExplorer/1.0",
      },
      body: JSON.stringify({
        query: byUniprot
          ? {
              type: "terminal",
              service: "text",
              parameters: {
                attribute:
                  "rcsb_polymer_entity_container_identifiers.reference_sequence_identifiers.database_accession",
                operator: "exact_match",
                value: uniprot,
              },
            }
          : {
              type: "terminal",
              service: "full_text",
              parameters: { value: q },
            },
        return_type: "entry",
        request_options: {
          paginate: { start: 0, rows },
          sort: [{ sort_by: "score", direction: "desc" }],
        },
      }),
      next: { revalidate: 600 },
    });

    if (!searchRes.ok) {
      return NextResponse.json(
        { error: `RCSB search failed (${searchRes.status})` },
        { status: 502 },
      );
    }

    const searchJson = await searchRes.json();
    const resultSet: Array<{ identifier: string; score: number }> = searchJson.result_set || [];
    const summaries = await Promise.all(
      resultSet.map((r) => entrySummary(r.identifier, r.score ?? 0)),
    );
    let results = summaries.filter(Boolean) as Hit[];
    if (byUniprot) {
      // Best resolution first; entries without one (NMR) go last.
      results = results.sort(
        (a, b) => (a.resolution ?? Infinity) - (b.resolution ?? Infinity),
      );
    }

    return NextResponse.json({
      query: q,
      uniprot: byUniprot ? uniprot : null,
      total: searchJson.total_count ?? results.length,
      results,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Search failed" },
      { status: 502 },
    );
  }
}
