import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output — trims the deploy to only the files each route
  // actually needs (see .next/standalone/server.js) instead of requiring the
  // full node_modules install at runtime. The Passenger custom server
  // (server.js at the project root) is a separate, untraced entry point and
  // keeps working unchanged against the full install; this only affects the
  // "next start" / Web Apps deploy path.
  output: "standalone",
  // Prisma's query engine binary and sharp's native binary are loaded via
  // dynamic paths that Next's file tracer can miss — force-include them so
  // the standalone bundle actually has them at runtime.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/.prisma/client/**/*", "./node_modules/sharp/**/*"],
  },
  experimental: {
    serverActions: {
      // Image uploads go through a Server Action (see app/actions/admin/upload.ts);
      // its own MAX_UPLOAD_BYTES is 1MB. This must stay slightly above that so the
      // app's friendly "too large" message can fire — multipart/form-data adds a
      // small amount of boundary/header overhead on top of the raw file bytes.
      bodySizeLimit: "2mb",
    },
  },
  async rewrites() {
    return [
      { source: "/about.php", destination: "/about" },
      { source: "/portfolio.php", destination: "/portfolio" },
      { source: "/contact.php", destination: "/contact" },
      { source: "/before_after.php", destination: "/before-after" },
    ];
  },
};

export default nextConfig;
