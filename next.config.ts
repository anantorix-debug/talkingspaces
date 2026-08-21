import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
