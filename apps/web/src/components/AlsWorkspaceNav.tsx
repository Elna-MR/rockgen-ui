import Link from "next/link";

const TABS = [
  {
    id: "hub",
    href: "/diseases/als",
    label: "ALS hub",
    blurb: "Overview · proteins",
  },
  {
    id: "mechanisms",
    href: "/diseases/als/mechanisms",
    label: "Mechanisms",
    blurb: "Shared routes first",
  },
  {
    id: "map",
    href: "/diseases/als/map",
    label: "Disease map",
    blurb: "Biology axes",
  },
  {
    id: "network",
    href: "/diseases/als/network",
    label: "Gene network",
    blurb: "STRING · fALS genes",
  },
  {
    id: "compare",
    href: "/diseases/als/compare",
    label: "Compare",
    blurb: "PFN1 vs TUBA4A",
  },
  {
    id: "evidence",
    href: "/diseases/als/evidence",
    label: "Evidence",
    blurb: "Mutations · biomarkers",
  },
] as const;

export type AlsWorkspaceTab = (typeof TABS)[number]["id"];

type Props = {
  active: AlsWorkspaceTab;
};

export function AlsWorkspaceNav({ active }: Props) {
  return (
    <nav className="struct-tabs als-tabs" aria-label="ALS research workspace">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          href={tab.href}
          className={`struct-tab ${active === tab.id ? "active" : ""}`}
          aria-current={active === tab.id ? "page" : undefined}
        >
          <strong>{tab.label}</strong>
          <span>{tab.blurb}</span>
        </Link>
      ))}
    </nav>
  );
}
