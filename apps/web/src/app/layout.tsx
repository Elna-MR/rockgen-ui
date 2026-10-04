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
  title: "ProtScope: neurodegeneration research",
  description:
    "Map disease proteins and shared mechanisms across ALS, Parkinson’s, Alzheimer’s, and related biology, before designing drugs. Learn tracks and evidence workspaces.",
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
              ProtScope
            </Link>
            <nav className="nav" aria-label="Primary">
              <Link href="/biology-first">Biology</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/proteins/explore">Structures</Link>
              <Link href="/diseases">Research</Link>
            </nav>
          </header>
          {children}
          <footer className="site-footer">
            <div className="site-footer-inner">
              <span className="site-footer-brand">ProtScope</span>
              <p>
                Educational resource for neurodegeneration biology. Not medical advice. Care
                decisions belong with your clinical team.
              </p>
            </div>
          </footer>
        </div>
        <SiteChatbot />
      </body>
    </html>
  );
}
