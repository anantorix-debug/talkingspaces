/* eslint-disable @typescript-eslint/no-require-imports */
// Passenger (Hostinger's Node.js "Business" hosting) requires a plain JS entry
// file it can `require()` directly and that listens on the PORT it injects —
// it does not run `npm start`/`next start` for you. This is that entry file;
// point hPanel's "Application startup file" at it.
const { createServer } = require("http");
const next = require("next");

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res);
  }).listen(port, () => {
    console.log(`Ready on port ${port}`);
  });
});
