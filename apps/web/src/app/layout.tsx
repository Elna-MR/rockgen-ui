import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";
import Link from "next/link";
import { SiteAtmosphere } from "@/components/SiteAtmosphere";
import { SiteChatbot } from "@/components/SiteChatbot";
import "./globals.css";

// Pages call the live API, never prerender against a missing build-time host.
export const dynamic = "force-dynamic";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
  style: ["normal", "italic"],
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ProtScope™ — protein folding in health, misfolding in disease",
  description:
    "ProtScope™ is a research workspace for neurodegenerative disease proteins. It links ALS genes, variants and biomarkers in a knowledge graph with evidence labels, and lets you explore experimentally solved protein structures and sequence chemistry. It does not predict structures or diagnose disease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <SiteAtmosphere />
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand">
              <img
                className="brand-mark"
                src="/brand/protscope-mark.svg?v=6"
                alt=""
                width={34}
                height={34}
              />
              <span className="brand-name">
                <span className="brand-name-prot">Prot</span>
                <span className="brand-name-scope">Scope</span>
                <sup className="brand-tm" aria-label="trademark">
                  ™
                </sup>
              </span>
            </Link>
            <nav className="nav" aria-label="Primary">
              <Link href="/biology-first">Biology</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/proteins/explore">Structures</Link>
              <Link href="/diseases">Research</Link>
              <Link href="/agentics" title="Lumen — ProtScope agents">
                Lumen
              </Link>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            <div className="site-footer-inner">
              <span className="site-footer-brand">
                <img
                  className="brand-mark brand-mark-sm"
                  src="/brand/protscope-mark.svg?v=6"
                  alt=""
                  width={20}
                  height={20}
                />
                <span className="brand-name">
                  <span className="brand-name-prot">Prot</span>
                  <span className="brand-name-scope">Scope</span>
                  <sup className="brand-tm" aria-label="trademark">
                    ™
                  </sup>
                </span>
              </span>
              <p className="site-footer-disclaimer">
                Educational only, not medical advice. ProtScope™ content does not diagnose or treat
                disease.
              </p>
              <nav className="site-footer-links" aria-label="Footer">
                <Link href="/learn">Learn</Link>
                <Link href="/diseases">Research</Link>
                <Link href="/proteins/explore">Structures</Link>
                <Link href="/agentics">Lumen</Link>
                <Link href="/partners">Research partners</Link>
                <Link href="/beta">Beta</Link>
              </nav>
            </div>
          </footer>
        </div>
        <SiteChatbot />
      </body>
    </html>
  );
}
