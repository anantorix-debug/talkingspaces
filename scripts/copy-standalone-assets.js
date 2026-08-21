// Next's standalone output (see next.config.ts) doesn't include `public/` or
// `.next/static` by default — copy them in so `.next/standalone/server.js`
// can serve the app on its own, without the rest of the repo present.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const standalone = path.join(root, ".next", "standalone");

if (!fs.existsSync(standalone)) {
  console.error("copy-standalone-assets: .next/standalone not found — did `next build` run?");
  process.exit(1);
}

fs.cpSync(path.join(root, "public"), path.join(standalone, "public"), { recursive: true });
fs.cpSync(path.join(root, ".next", "static"), path.join(standalone, ".next", "static"), {
  recursive: true,
});

console.log("copy-standalone-assets: copied public/ and .next/static into .next/standalone");
