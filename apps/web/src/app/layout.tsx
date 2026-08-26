import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "RockGen — Understand, learn, and research ALS",
  description:
    "Plain-language ALS guides for patients and families, learning paths for students, and an evidence workspace for researchers.",
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
              <Link href="/understand">Understand</Link>
              <Link href="/learn">Learn</Link>
              <Link href="/diseases/als">Research</Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
