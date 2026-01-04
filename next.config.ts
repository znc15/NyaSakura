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
  webpack: (config, { dev }) => {
    if (dev) {
      const extraIgnored = ["**/System Volume Information/**"];
      const existingIgnored = config.watchOptions?.ignored;

      const normalizedExisting = Array.isArray(existingIgnored)
        ? existingIgnored.filter((v: unknown): v is string => typeof v === "string" && v.trim() !== "")
        : typeof existingIgnored === "string" && existingIgnored.trim() !== ""
          ? [existingIgnored]
          : [];

      const mergedIgnored = [...normalizedExisting, ...extraIgnored];

      config.watchOptions = {
        ...(config.watchOptions ?? {}),
        ignored: mergedIgnored,
      };
    }

    return config;
  },
};

export default nextConfig;
