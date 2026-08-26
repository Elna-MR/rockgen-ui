import { NextRequest, NextResponse } from "next/server";

type Polymer = {
  entity_id: string;
  chain_ids: string[];
  sequence: string;
  uniprot_ids: string[];
  organism?: string;
  type?: string;
};

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const pdbId = id.toUpperCase();
  if (!/^[0-9][A-Z0-9]{3}$/.test(pdbId)) {
    return NextResponse.json({ error: "Invalid PDB id" }, { status: 400 });
  }

  try {
    const entryRes = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbId}`, {
      headers: { "User-Agent": "RockGenStructureExplorer/1.0" },
      next: { revalidate: 86400 },
    });
    if (!entryRes.ok) {
      return NextResponse.json({ error: `Entry ${pdbId} not found` }, { status: 404 });
    }
    const entry = await entryRes.json();
    const info = entry.rcsb_entry_info || {};
    const ids = entry.rcsb_entry_container_identifiers || {};
    const polymerEntityIds: string[] = ids.polymer_entity_ids || ["1"];

    const polymers: Polymer[] = [];
    for (const eid of polymerEntityIds) {
      const polyRes = await fetch(`https://data.rcsb.org/rest/v1/core/polymer_entity/${pdbId}/${eid}`, {
        headers: { "User-Agent": "RockGenStructureExplorer/1.0" },
        next: { revalidate: 86400 },
      });
      if (!polyRes.ok) continue;
      const poly = await polyRes.json();
      const seq =
        poly.entity_poly?.pdbx_seq_one_letter_code_can ||
        poly.entity_poly?.pdbx_seq_one_letter_code ||
        "";
      const clean = String(seq).replace(/\s+/g, "");
      if (!clean) continue;
      const src = poly.rcsb_entity_source_organism?.[0];
      polymers.push({
        entity_id: String(eid),
        chain_ids: poly.rcsb_polymer_entity_container_identifiers?.auth_asym_ids || [],
        sequence: clean,
        uniprot_ids: poly.rcsb_polymer_entity_container_identifiers?.uniprot_ids || [],
        organism: src?.ncbi_scientific_name || src?.scientific_name,
        type: poly.entity_poly?.type,
      });
    }

    const primary = polymers.find((p) => (p.type || "").includes("polypeptide")) || polymers[0];

    return NextResponse.json({
      pdb_id: pdbId,
      title: entry.struct?.title || pdbId,
      method: (entry.exptl || [])[0]?.method || "Unknown",
      released: entry.rcsb_accession_info?.initial_release_date || null,
      deposited_chains: info.deposited_polymer_entity_instance_count ?? null,
      distinct_proteins: info.polymer_entity_count ?? polymers.length,
      assembly_mass_kda: info.molecular_weight ?? null,
      resolution: (info.resolution_combined || [])[0] ?? null,
      polymers,
      primary,
      rcsb_url: `https://www.rcsb.org/structure/${pdbId}`,
      thumbnail: `https://cdn.rcsb.org/images/structures/${pdbId.toLowerCase()}_assembly-1.jpeg`,
      coordinate_url: `/api/structures/${pdbId}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to load entry" },
      { status: 502 },
    );
  }
}
