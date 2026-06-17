import path from "node:path";
import type { NextConfig } from "next";

// WHY: web/ lives inside the zerogub repo and consumes the package via
// `file:..`, so the symlinked module resolves *outside* this app's root.
// externalDir lets Turbopack follow it; transpilePackages is a harmless belt.
// outputFileTracingRoot pins the workspace root at the repo (the package lives
// one level up) so Next doesn't warn about the two lockfiles and traces the
// symlinked package correctly. A standalone consumer using the git dep needs
// none of this (see INTEGRATE.md).
const nextConfig: NextConfig = {
  transpilePackages: ["zerogub"],
  experimental: { externalDir: true },
  outputFileTracingRoot: path.join(import.meta.dirname, ".."),
};

export default nextConfig;
