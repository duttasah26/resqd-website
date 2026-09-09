import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A package-lock.json exists further up the tree (home directory); pin the
  // workspace root to this project so Turbopack doesn't try to infer it.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
