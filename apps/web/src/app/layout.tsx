import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import { SiteAtmosphere } from "@/components/SiteAtmosphere";
import "./globals.css";

// Pages call the live API — never prerender against a missing build-time host.
export const dynamic = "force-dynamic";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans-face",
  display: "swap",
});

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display-face",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RockGen — neurodegeneration research",
  description:
    "Map disease proteins and shared mechanisms across ALS, Parkinson’s, Alzheimer’s, and related biology — before designing drugs. Learn tracks and evidence workspaces.",
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
              RockGen
            </Link>
            <nav className="nav">
              <Link href="/mechanism-first">Mechanism first</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/proteins/explore">Structures</Link>
              <Link href="/diseases">Research</Link>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            Educational — not medical advice. Care decisions belong with your clinical team.
          </footer>
        </div>
      </body>
    </html>
  );
}
