import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    // Protected pages wait for a browser-local demo session. The automatic
    // unauthenticated render cannot validate their navigation/static shell.
    instantInsights: { validationLevel: "manual-warning" },
  },
  redirects() {
    return [{ source: "/dashboard", destination: "/", permanent: false }];
  },
};

export default nextConfig;
