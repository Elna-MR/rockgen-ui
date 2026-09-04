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
  title: "RockGen — ALS biology workspace",
  description:
    "Map ALS disease proteins and shared mechanisms before designing drugs. Guides for families, a learning path for students, and an evidence workspace for researchers.",
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
              <Link href="/approach">Approach</Link>
              <Link href="/understand">Understand</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/proteins/explore">Structures</Link>
              <Link href="/diseases/als">Research</Link>
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
