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
};

export default withBundleAnalyzer(nextConfig);
