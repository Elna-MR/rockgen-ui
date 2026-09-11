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

const MODULE_LABEL: Record<string, string> = {
  rna: "RNA metabolism",
  pro: "Proteostasis / autophagy",
  cyt: "Cytoskeleton / transport",
  mit: "Mitochondria / metabolism",
  ddr: "DNA damage / cell cycle",
  oth: "Other / modifiers",
};

const MODULE_COLOR: Record<string, string> = {
  rna: "#5c7a8f",
  pro: "#4a8b86",
  cyt: "#7a6f5c",
  mit: "#6a8f7a",
  ddr: "#6b7c8a",
  oth: "#8497a7",
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
  const [selected, setSelected] = useState<FalsNode | null>(null);
  const [hideOrphans, setHideOrphans] = useState(true);

  const modules = useMemo(() => {
    const set = new Set(graph.nodes.map((n) => n.mod));
    return Array.from(set).sort();
  }, [graph.nodes]);

  const visible = useMemo(() => {
    let nodes = graph.nodes;
    if (hideOrphans) nodes = nodes.filter((n) => n.degree > 0);
    if (activeMod) nodes = nodes.filter((n) => n.mod === activeMod);
    const ids = new Set(nodes.map((n) => n.id));
    const links = graph.links.filter((l) => ids.has(l.source) && ids.has(l.target));
    return { nodes, links };
  }, [graph, activeMod, hideOrphans]);

  useEffect(() => {
    const svgEl = svgRef.current;
    const wrap = wrapRef.current;
    if (!svgEl || !wrap) return;

    const width = wrap.clientWidth || 900;
    const height = Math.max(420, Math.min(640, Math.round(width * 0.62)));

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
      .attr("stroke", "rgba(26,43,51,0.18)")
      .attr("stroke-width", (d) => 0.6 + d.w * 3.5);

    const node = g
      .append("g")
      .attr("class", "fals-nodes")
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "fals-node")
      .style("cursor", "pointer")
      .on("click", (_event, d) => setSelected(d));

    node
      .append("circle")
      .attr("r", (d) => 6 + Math.sqrt(Math.max(d.f, 0.05)) * 3.2)
      .attr("fill", (d) => MODULE_COLOR[d.mod] || MODULE_COLOR.oth)
      .attr("fill-opacity", 0.88)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5);

    node
      .append("text")
      .text((d) => d.id)
      .attr("x", 0)
      .attr("y", (d) => -(8 + Math.sqrt(Math.max(d.f, 0.05)) * 3.2))
      .attr("text-anchor", "middle")
      .attr("font-size", 10)
      .attr("fill", "#1a2b33")
      .attr("font-weight", 600);

    const simulation = forceSimulation(nodes)
      .force(
        "link",
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((d) => 70 + (1 - d.w) * 90)
          .strength((d) => 0.2 + d.w * 0.55)
      )
      .force("charge", forceManyBody().strength(-220))
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide<SimNode>().radius((d) => 14 + Math.sqrt(Math.max(d.f, 0.05)) * 3.2)
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

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [visible]);

  return (
    <div className="fals-network">
      <div className="fals-controls">
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
        <label className="fals-toggle hint">
          <input
            type="checkbox"
            checked={hideOrphans}
            onChange={(e) => setHideOrphans(e.target.checked)}
          />
          Hide unconnected genes at this score
        </label>
      </div>

      <div className="fals-stage" ref={wrapRef}>
        <svg ref={svgRef} className="fals-svg" role="img" aria-label="Familial ALS gene interaction network" />
      </div>

      <div className="fals-legend">
        {modules.map((m) => (
          <span key={m} className="fals-legend-item">
            <i style={{ background: MODULE_COLOR[m] }} />
            {MODULE_LABEL[m] || m}
          </span>
        ))}
        <span className="hint">Node size ≈ familial frequency · edge thickness ≈ STRING weight</span>
      </div>

      {selected && (
        <aside className="fals-detail" aria-live="polite">
          <h3>{selected.id}</h3>
          <p className="hint">{MODULE_LABEL[selected.mod] || selected.mod}</p>
          <ul className="learn-fact-list">
            <li>
              Approximate familial share: <strong>{selected.f}%</strong> (order-of-magnitude;
              population-dependent)
            </li>
            <li>
              Degree in this view: <strong>{selected.degree}</strong>
            </li>
            {selected.string_name && selected.string_name !== selected.id && (
              <li>STRING preferred name: {selected.string_name}</li>
            )}
          </ul>
          <button type="button" className="btn btn-ghost" onClick={() => setSelected(null)}>
            Clear selection
          </button>
        </aside>
      )}
    </div>
  );
}
