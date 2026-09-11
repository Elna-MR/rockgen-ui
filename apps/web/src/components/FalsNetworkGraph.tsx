"use client";

import {
  drag,
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  select,
} from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  geneHoverText,
  getGeneDetail,
  MODULE_COLOR,
  MODULE_LABEL,
  primaryProgrammeStatus,
  STATUS_COLOR,
  STATUS_LABEL,
} from "@/data/falsGeneMeta";

export type FalsNode = {
  id: string;
  mod: string;
  f: number;
  string_name?: string | null;
  degree: number;
};

export type FalsLink = {
  source: string;
  target: string;
  w: number;
  experiments?: number;
  database?: number;
  textmining?: number;
};

export type FalsGraph = {
  meta: {
    source: string;
    species: number;
    network_type: string;
    required_score: number;
    weight: string;
    retrieved: string;
  };
  nodes: FalsNode[];
  links: FalsLink[];
};

type SimNode = FalsNode & { x?: number; y?: number; fx?: number | null; fy?: number | null };
type SimLink = {
  source: string | SimNode;
  target: string | SimNode;
  w: number;
};

type Props = {
  graph: FalsGraph;
};

export function FalsNetworkGraph({ graph }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [activeMod, setActiveMod] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [minConfidence, setMinConfidence] = useState(0.5);
  const [minFamilialPct, setMinFamilialPct] = useState(0);
  /** Per-gene connection emphasis 0–100; lower hides weaker edges for that gene. */
  const [geneBars, setGeneBars] = useState<Record<string, number>>({});
  const [detailOpen, setDetailOpen] = useState(true);
  const [programmesOnly, setProgrammesOnly] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const modules = useMemo(() => {
    const set = new Set(graph.nodes.map((n) => n.mod));
    return Array.from(set).sort();
  }, [graph.nodes]);

  const barFor = (id: string, fallbackF: number) =>
    geneBars[id] ?? Math.min(100, Math.max(5, fallbackF * 2.2));

  const visible = useMemo(() => {
    let nodes = graph.nodes.filter((n) => n.f >= minFamilialPct);
    if (activeMod) nodes = nodes.filter((n) => n.mod === activeMod);
    if (programmesOnly) nodes = nodes.filter((n) => primaryProgrammeStatus(n.id));
    const ids = new Set(nodes.map((n) => n.id));

    const links = graph.links.filter((l) => {
      if (!ids.has(l.source) || !ids.has(l.target)) return false;
      if (l.w < minConfidence) return false;
      const src = graph.nodes.find((n) => n.id === l.source);
      const tgt = graph.nodes.find((n) => n.id === l.target);
      if (!src || !tgt) return false;
      // Gene bars act as local connection gates: edge must clear both genes' bar thresholds.
      const needA = barFor(src.id, src.f) / 100;
      const needB = barFor(tgt.id, tgt.f) / 100;
      const gate = Math.min(needA, needB);
      return l.w >= gate * 0.35 + minConfidence * 0.65;
    });

    const linked = new Set<string>();
    for (const l of links) {
      linked.add(l.source);
      linked.add(l.target);
    }
    // Keep selected gene even if temporarily isolated after filtering.
    if (selectedId) linked.add(selectedId);
    nodes = nodes.filter((n) => linked.has(n.id) || n.f >= Math.max(minFamilialPct, 1));

    // When programmes-only, keep edges among programme genes; dimming handled in render.
    return { nodes, links };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, activeMod, minConfidence, minFamilialPct, geneBars, selectedId, programmesOnly]);

  const selected = useMemo(
    () => graph.nodes.find((n) => n.id === selectedId) || null,
    [graph.nodes, selectedId]
  );

  const neighbors = useMemo(() => {
    if (!selected) return [] as { id: string; w: number }[];
    return visible.links
      .filter((l) => l.source === selected.id || l.target === selected.id)
      .map((l) => ({
        id: l.source === selected.id ? l.target : l.source,
        w: l.w,
      }))
      .sort((a, b) => b.w - a.w);
  }, [selected, visible.links]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const wrap = wrapRef.current;
    if (!svgEl || !wrap) return;

    const width = wrap.clientWidth || 900;
    const height = Math.max(460, Math.min(680, Math.round(width * 0.64)));

    const svg = select(svgEl);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%").attr("height", height);

    const nodes: SimNode[] = visible.nodes.map((n) => ({ ...n }));
    const links: SimLink[] = visible.links.map((l) => ({
      source: l.source,
      target: l.target,
      w: l.w,
    }));

    const g = svg.append("g");

    const link = g
      .append("g")
      .attr("class", "fals-links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "rgba(26,43,51,0.2)")
      .attr("stroke-width", (d) => 0.7 + d.w * 4);

    const node = g
      .append("g")
      .attr("class", "fals-nodes")
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "fals-node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        setSelectedId(d.id);
        setDetailOpen(true);
      })
      .on("mouseenter", (event, d) => {
        setHoverId(d.id);
        const rect = wrap.getBoundingClientRect();
        setTooltip({
          x: Math.min(rect.width - 240, Math.max(8, event.clientX - rect.left + 12)),
          y: Math.max(8, event.clientY - rect.top - 8),
          text: geneHoverText(d.id, d.f),
        });
      })
      .on("mousemove", (event) => {
        const rect = wrap.getBoundingClientRect();
        setTooltip((prev) =>
          prev
            ? {
                ...prev,
                x: Math.min(rect.width - 240, Math.max(8, event.clientX - rect.left + 12)),
                y: Math.max(8, event.clientY - rect.top - 8),
              }
            : prev
        );
      })
      .on("mouseleave", () => {
        setHoverId(null);
        setTooltip(null);
      });

    node
      .append("circle")
      .attr("class", "fals-node-ring")
      .attr("r", (d) => {
        const base = 7 + Math.sqrt(Math.max(d.f, 0.05)) * 3.4;
        return primaryProgrammeStatus(d.id) ? base + 3.5 : 0;
      })
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const st = primaryProgrammeStatus(d.id);
        return st ? STATUS_COLOR[st] : "transparent";
      })
      .attr("stroke-width", 2.5)
      .attr("stroke-dasharray", (d) =>
        primaryProgrammeStatus(d.id) === "preclinical" ? "3 3" : null
      );

    node
      .append("circle")
      .attr("r", (d) => 7 + Math.sqrt(Math.max(d.f, 0.05)) * 3.4)
      .attr("fill", (d) => MODULE_COLOR[d.mod] || MODULE_COLOR.oth)
      .attr("fill-opacity", (d) => (selectedId === d.id ? 1 : 0.9))
      .attr("stroke", (d) => (selectedId === d.id ? "#1a2b33" : "#fff"))
      .attr("stroke-width", (d) => (selectedId === d.id ? 2.25 : 1.4));

    // Frequency / connection bar under each gene
    node.each(function (d) {
      const el = select(this);
      const r = 7 + Math.sqrt(Math.max(d.f, 0.05)) * 3.4;
      const barW = 28;
      const pct = barFor(d.id, d.f);
      el.append("rect")
        .attr("x", -barW / 2)
        .attr("y", r + 4)
        .attr("width", barW)
        .attr("height", 4)
        .attr("rx", 2)
        .attr("fill", "rgba(26,43,51,0.12)");
      el.append("rect")
        .attr("class", "fals-node-bar-fill")
        .attr("x", -barW / 2)
        .attr("y", r + 4)
        .attr("width", (barW * pct) / 100)
        .attr("height", 4)
        .attr("rx", 2)
        .attr("fill", MODULE_COLOR[d.mod] || MODULE_COLOR.oth);
    });

    node
      .append("text")
      .text((d) => d.id)
      .attr("x", 0)
      .attr("y", (d) => -(10 + Math.sqrt(Math.max(d.f, 0.05)) * 3.4))
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "#1a2b33")
      .attr("font-weight", 600);

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((d) => 65 + (1 - d.w) * 100)
          .strength((d) => 0.18 + d.w * 0.6)
      )
      .force("charge", forceManyBody().strength(-240))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide<SimNode>().radius((d) => 18 + Math.sqrt(Math.max(d.f, 0.05)) * 3.4)
      );

    node.call(
      drag<SVGGElement, SimNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.25).restart();
          d.fx = d.x ?? null;
          d.fy = d.y ?? null;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    const neighborIds = new Set<string>();
    if (hoverId) {
      for (const l of links) {
        const a = typeof l.source === "string" ? l.source : l.source.id;
        const b = typeof l.target === "string" ? l.target : l.target.id;
        if (a === hoverId) neighborIds.add(b);
        if (b === hoverId) neighborIds.add(a);
      }
      neighborIds.add(hoverId);
    }

    node.style("opacity", (d) => {
      if (!hoverId) return 1;
      return neighborIds.has(d.id) ? 1 : 0.15;
    });
    link.style("opacity", (d) => {
      if (!hoverId) return 1;
      const a = typeof d.source === "string" ? d.source : d.source.id;
      const b = typeof d.target === "string" ? d.target : d.target.id;
      return a === hoverId || b === hoverId ? 1 : 0.06;
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    const onBg = () => {
      /* keep selection; only clear via panel */
    };
    svg.on("click", onBg);

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, selectedId, hoverId]);

  function resetFilters() {
    setMinConfidence(0.5);
    setMinFamilialPct(0);
    setGeneBars({});
    setActiveMod(null);
    setSelectedId(null);
    setProgrammesOnly(false);
    setHoverId(null);
    setTooltip(null);
  }

  function setSelectedBar(value: number) {
    if (!selected) return;
    setGeneBars((prev) => ({ ...prev, [selected.id]: value }));
  }

  const detail = selected ? getGeneDetail(selected.id) : null;
  const selectedBar = selected ? barFor(selected.id, selected.f) : 50;
  const status = selected ? primaryProgrammeStatus(selected.id) : null;

  return (
    <div className="fals-network">
      <div className="fals-controls">
        <p className="hint fals-lead">
          Node size is approximate share of familial ALS cases; colour is functional module; edge
          thickness is curated interaction confidence. Ringed nodes have a named drug candidate —
          hover for programmes, click for notes and the local gene map. Bars change which links stay
          visible.
        </p>

        <div className="fals-sliders">
          <label className="fals-slider">
            <span>Min confidence</span>
            <input
              type="range"
              min={0.4}
              max={0.9}
              step={0.05}
              value={minConfidence}
              onChange={(e) => setMinConfidence(Number(e.target.value))}
            />
            <strong>{minConfidence.toFixed(2)}</strong>
          </label>
          <label className="fals-slider">
            <span>Min familial %</span>
            <input
              type="range"
              min={0}
              max={20}
              step={0.5}
              value={minFamilialPct}
              onChange={(e) => setMinFamilialPct(Number(e.target.value))}
            />
            <strong>{minFamilialPct.toFixed(1)}%</strong>
          </label>
          <button
            type="button"
            className={`btn btn-ghost ${programmesOnly ? "chip-active" : ""}`}
            onClick={() => setProgrammesOnly((v) => !v)}
          >
            Programmes only
          </button>
          <button type="button" className="btn btn-ghost" onClick={resetFilters}>
            Reset
          </button>
        </div>

        <div className="chip-row">
          <button
            type="button"
            className={`chip ${activeMod === null ? "chip-active" : ""}`}
            onClick={() => setActiveMod(null)}
          >
            All modules
          </button>
          {modules.map((m) => (
            <button
              key={m}
              type="button"
              className={`chip ${activeMod === m ? "chip-active" : ""}`}
              onClick={() => setActiveMod(m)}
            >
              {MODULE_LABEL[m] || m}
            </button>
          ))}
        </div>
      </div>

      <div className="fals-stage" ref={wrapRef}>
        <svg ref={svgRef} className="fals-svg" role="img" aria-label="Familial ALS gene interaction network" />
        {tooltip && (
          <div className="fals-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            {tooltip.text}
          </div>
        )}
      </div>

      <div className="fals-legend">
        {modules.map((m) => (
          <span key={m} className="fals-legend-item">
            <i style={{ background: MODULE_COLOR[m] }} />
            {MODULE_LABEL[m] || m}
          </span>
        ))}
        {(Object.keys(STATUS_LABEL) as Array<keyof typeof STATUS_LABEL>).map((s) => (
          <span key={s} className="fals-legend-item">
            <i className="fals-legend-ring" style={{ borderColor: STATUS_COLOR[s] }} />
            {STATUS_LABEL[s]}
          </span>
        ))}
      </div>

      {selected && detail && (
        <aside className={`fals-detail fals-drop ${detailOpen ? "open" : ""}`} aria-live="polite">
          <div className="fals-detail-head">
            <div>
              <h3>{selected.id}</h3>
              <p className="hint">
                {detail.fullName}
                {detail.locus ? ` · ${detail.locus}` : ""}
              </p>
            </div>
            <div className="fals-detail-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setDetailOpen((v) => !v)}>
                {detailOpen ? "Collapse" : "Expand"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setSelectedId(null)}>
                Close
              </button>
            </div>
          </div>

          {detailOpen && (
            <>
              <p className="article-body" style={{ marginBottom: "0.85rem" }}>
                {detail.summary}
              </p>
              {detail.hoverNote && (
                <p className="fals-pipeline-note">
                  <strong>Pipeline note:</strong> {detail.hoverNote}
                </p>
              )}

              <ul className="learn-fact-list">
                <li>
                  Approximate familial share: <strong>~{selected.f}%</strong> of fALS
                  (order-of-magnitude; population-dependent)
                </li>
                <li>
                  Module: <strong>{MODULE_LABEL[selected.mod] || selected.mod}</strong>
                </li>
                <li>
                  Visible neighbors at current filters: <strong>{neighbors.length}</strong>
                </li>
                {status && (
                  <li>
                    Programme status:{" "}
                    <strong style={{ color: STATUS_COLOR[status] }}>{STATUS_LABEL[status]}</strong>
                  </li>
                )}
              </ul>

              <label className="fals-slider fals-gene-bar">
                <span>
                  Connection bar for {selected.id}
                  <em> — raise to keep more edges, lower to prune weaker links</em>
                </span>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={1}
                  value={selectedBar}
                  onChange={(e) => setSelectedBar(Number(e.target.value))}
                />
                <strong>{Math.round(selectedBar)}%</strong>
              </label>

              {detail.programmes && detail.programmes.length > 0 && (
                <div className="fals-programmes">
                  <h4>Programmes</h4>
                  <ul>
                    {detail.programmes.map((p) => (
                      <li key={p.name}>
                        <span
                          className="fals-prog-dot"
                          style={{ background: STATUS_COLOR[p.status] }}
                        />
                        <strong>{p.name}</strong>
                        <span className="hint">
                          {STATUS_LABEL[p.status]}
                          {p.note ? ` — ${p.note}` : ""}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="fals-gene-map">
                <h4>Gene map — {selected.id} neighborhood</h4>
                <p className="hint">Local interaction map at the current confidence / bar settings.</p>
                <svg viewBox="0 0 360 200" className="fals-mini-map" aria-label={`${selected.id} neighbor map`}>
                  <circle cx="180" cy="100" r="18" fill={MODULE_COLOR[selected.mod]} />
                  <text x="180" y="104" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="700">
                    {selected.id}
                  </text>
                  {neighbors.slice(0, 8).map((n, i) => {
                    const angle = (-Math.PI / 2) + (i / Math.max(neighbors.length, 1)) * Math.PI * 2;
                    const x = 180 + Math.cos(angle) * 110;
                    const y = 100 + Math.sin(angle) * 70;
                    const meta = graph.nodes.find((g) => g.id === n.id);
                    return (
                      <g key={n.id}>
                        <line
                          x1="180"
                          y1="100"
                          x2={x}
                          y2={y}
                          stroke="rgba(26,43,51,0.25)"
                          strokeWidth={0.8 + n.w * 3}
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="11"
                          fill={MODULE_COLOR[meta?.mod || "oth"]}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedId(n.id)}
                        />
                        <text
                          x={x}
                          y={y - 16}
                          textAnchor="middle"
                          fontSize="8"
                          fill="#1a2b33"
                          fontWeight="600"
                        >
                          {n.id}
                        </text>
                      </g>
                    );
                  })}
                  {neighbors.length === 0 && (
                    <text x="180" y="160" textAnchor="middle" fontSize="10" fill="#8497a7">
                      No neighbors at this filter — lower confidence or raise this gene&apos;s bar
                    </text>
                  )}
                </svg>
                {neighbors.length > 0 && (
                  <ul className="fals-neighbor-list">
                    {neighbors.map((n) => {
                      const meta = graph.nodes.find((g) => g.id === n.id);
                      const note = getGeneDetail(n.id);
                      return (
                        <li key={n.id}>
                          <button type="button" className="fals-neighbor-btn" onClick={() => setSelectedId(n.id)}>
                            <strong>{n.id}</strong>
                            <span>
                              conf {n.w.toFixed(2)}
                              {meta ? ` · ~${meta.f}%` : ""}
                              {primaryProgrammeStatus(n.id)
                                ? ` · ${STATUS_LABEL[primaryProgrammeStatus(n.id)!]}`
                                : ""}
                            </span>
                            <span className="hint">{note.summary}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </aside>
      )}
    </div>
  );
}
