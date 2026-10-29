import { NextRequest, NextResponse } from "next/server";

const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
const PAGE_SIZE = 15;
const ALS_FILTER = '("amyotrophic lateral sclerosis"[MeSH Terms] OR "amyotrophic lateral sclerosis"[Title/Abstract] OR ALS[Title/Abstract])';

/** PubMed allows about 3 requests a second without a key, so wait and retry on a 429. */
async function pubmedFetch(url: string, headers: Record<string, string>): Promise<Response> {
  let res = await fetch(url, { headers, next: { revalidate: 3600 } });
  for (let attempt = 1; attempt <= 3 && res.status === 429; attempt++) {
    await new Promise((r) => setTimeout(r, 600 * attempt));
    res = await fetch(url, { headers, cache: "no-store" });
  }
  return res;
}

type Summary = {
  uid: string;
  title?: string;
  authors?: { name: string }[];
  source?: string;
  fulljournalname?: string;
  pubdate?: string;
  pubtype?: string[];
};

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const q = (sp.get("q") || "").trim().slice(0, 200);
  const scope = sp.get("scope") === "all" ? "all" : "als";
  const sort = sp.get("sort") === "date" ? "pub_date" : "relevance";
  const page = Math.max(0, Math.min(20, Number(sp.get("page")) || 0));

  if (q.length < 2) {
    return NextResponse.json({ error: "Enter at least two characters." }, { status: 400 });
  }

  // Quotes inside the query would break the boolean wrapper; PubMed handles plain words well.
  const clean = q.replace(/["\[\]]/g, " ");
  const term = scope === "als" ? `(${clean}) AND ${ALS_FILTER}` : clean;
  const common = "tool=protscope&retmode=json";
  const headers = { "User-Agent": "ProtScopeLiteratureSearch/1.0" };

  try {
    const searchRes = await pubmedFetch(
      `${EUTILS}/esearch.fcgi?db=pubmed&${common}&sort=${sort}&retmax=${PAGE_SIZE}&retstart=${page * PAGE_SIZE}&term=${encodeURIComponent(term)}`,
      headers,
    );
    if (!searchRes.ok) throw new Error(`PubMed search returned ${searchRes.status}`);
    const search = await searchRes.json();
    const ids: string[] = search.esearchresult?.idlist || [];
    const count = Number(search.esearchresult?.count || 0);
    if (ids.length === 0) {
      return NextResponse.json({ query: q, scope, count, page, pageSize: PAGE_SIZE, results: [] });
    }

    const sumRes = await pubmedFetch(
      `${EUTILS}/esummary.fcgi?db=pubmed&${common}&id=${ids.join(",")}`,
      headers,
    );
    if (!sumRes.ok) throw new Error(`PubMed summary returned ${sumRes.status}`);
    const sum = await sumRes.json();

    const results = ids
      .map((id) => sum.result?.[id] as Summary | undefined)
      .filter((r): r is Summary => !!r && !!r.title)
      .map((r) => ({
        pmid: r.uid,
        title: r.title!.replace(/\.$/, ""),
        authors: (r.authors || []).map((a) => a.name),
        journal: r.fulljournalname || r.source || "",
        date: r.pubdate || "",
        types: (r.pubtype || []).filter((t) =>
          ["Review", "Systematic Review", "Meta-Analysis", "Clinical Trial", "Randomized Controlled Trial", "Case Reports"].includes(t),
        ),
        url: `https://pubmed.ncbi.nlm.nih.gov/${r.uid}/`,
      }));

    return NextResponse.json({ query: q, scope, count, page, pageSize: PAGE_SIZE, results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PubMed is unavailable" },
      { status: 502 },
    );
  }
}
