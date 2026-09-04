import Link from "next/link";

const TABS = [
  {
    id: "explore",
    href: "/proteins/explore",
    label: "Structure",
    blurb: "PDB search · chemistry · 3D",
  },
  {
    id: "inspect",
    href: "/proteins/inspect",
    label: "Mutation inspector",
    blurb: "Burial · neighbours · clash",
  },
  {
    id: "design",
    href: "/proteins/design",
    label: "Peptide design",
    blurb: "Complement binders at the site",
  },
] as const;

export type StructureTab = (typeof TABS)[number]["id"];

type Props = {
  active: StructureTab;
  /** Optional mutation / protein query forwarded to tool pages */
  query?: string;
};

export function StructureWorkspaceNav({ active, query }: Props) {
  const q = query?.trim();
  const suffix = q ? `?q=${encodeURIComponent(q)}` : "";

  return (
    <nav className="struct-tabs" aria-label="Structure workspace">
      {TABS.map((tab) => {
        const href =
          tab.id === "explore"
            ? q
              ? `/proteins/explore?q=${encodeURIComponent(q)}`
              : tab.href
            : `${tab.href}${suffix}`;
        return (
          <Link
            key={tab.id}
            href={href}
            className={`struct-tab ${active === tab.id ? "active" : ""}`}
            aria-current={active === tab.id ? "page" : undefined}
          >
            <strong>{tab.label}</strong>
            <span>{tab.blurb}</span>
          </Link>
        );
      })}
    </nav>
  );
}
