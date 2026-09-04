type Props = {
  src: string;
  title: string;
};

/** Full-bleed embed for standalone structure tools (mutation inspector / peptide design). */
export function StructureToolFrame({ src, title }: Props) {
  return (
    <div className="struct-tool-frame">
      <iframe title={title} src={src} className="struct-tool-iframe" />
    </div>
  );
}
