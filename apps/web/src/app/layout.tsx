import type { Metadata } from "next";
import { DM_Sans, Source_Serif_4 } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Pages call the live API — never prerender against a missing build-time host.
export const dynamic = "force-dynamic";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "RockGen — Mechanism-first ALS biology",
  description:
    "Map ALS disease proteins and shared mechanisms before designing drugs. Guides for families, a learning path for students, and an evidence workspace for researchers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable}`}>
        <div className="shell">
          <header className="topbar">
            <Link href="/" className="brand">
              RockGen
            </Link>
            <nav className="nav">
              <Link href="/approach">Approach</Link>
              <Link href="/understand">Understand</Link>
              <Link href="/learn">Learn</Link>
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
