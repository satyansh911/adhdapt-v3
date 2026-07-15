import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

// Enable with: ANALYZE=true npx next build
// Opens interactive treemaps of the client/server bundles in .next/analyze.
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false,
  },
  // Pin the workspace root so Next doesn't guess it from a parent-directory
  // lockfile (pnpm-lock.yaml two folders up).
  turbopack: {
    root: process.cwd(),
  },
  // The app source type-checks cleanly via `tsc --noEmit`, but Next 16.2.1's
  // Turbopack emits a malformed generated `routes.d.ts` that fails the build's
  // type-check step. Keep builds (incl. Vercel) unblocked until that upstream
  // bug is fixed; run `tsc` in CI/pre-commit for real type safety.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withBundleAnalyzer(nextConfig);
