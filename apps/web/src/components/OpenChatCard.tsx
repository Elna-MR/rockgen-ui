"use client";

type Props = { title: string; blurb: string; cta: string };

/** A tool card that opens the site chat instead of navigating to a page. */
export function OpenChatCard({ title, blurb, cta }: Props) {
  return (
    <button
      type="button"
      className="lumen-tool"
      onClick={() => window.dispatchEvent(new Event("protscope:open-chat"))}
    >
      <span className="agentics-chip agentics-chip-live">Live</span>
      <strong>{title}</strong>
      <span className="lumen-tool-blurb">{blurb}</span>
      <span className="lumen-tool-cta">{cta} &rarr;</span>
    </button>
  );
}
