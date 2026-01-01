import type { NextConfig } from "next";

// Keep a single source of truth for the frontend version.
// This is injected at build time and is available in the browser as
// process.env.NEXT_PUBLIC_APP_VERSION.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("./package.json");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
  },
};

export default nextConfig;
