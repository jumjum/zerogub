import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZeroG — the feedback layer for GitHub-native teams",
  description:
    "One-click bug & feature capture → a GitHub Issue in a repo you own. No dashboard, no seats, no lock-in. Open source.",
};

function Nav() {
  return (
    <nav className="nav">
      <a href="/" className="brand" style={{ textDecoration: "none" }}>
        <span className="mark">🎯</span> ZeroG
      </a>
      <div className="nav-links">
        <a href="/mc">Mission Control</a>
        <a href="https://github.com/jumjum/zerogub" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </div>
    </nav>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="wrap">
          <Nav />
          {children}
          <footer className="foot">
            <span>ZeroG · zerogub — MIT · © jumjum</span>
            <span>GitHub is the dashboard. You own the data.</span>
          </footer>
        </div>
      </body>
    </html>
  );
}
