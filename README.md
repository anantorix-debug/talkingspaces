# Talking Spaces Interiors

Production Next.js website + admin panel for Talking Spaces Interiors, backed by MySQL via Prisma.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript, Tailwind CSS v4
- MySQL + Prisma 6
- NextAuth v5 (Credentials, JWT sessions) with a MASTER_ADMIN / ADMIN / EDITOR role model
- Zod + React Hook Form
- Local filesystem media storage behind a swappable `StorageProvider` interface

## Local development (WAMP MySQL)

1. Start WAMP / MySQL, and create an empty database named `talkingspaces`.
2. Copy `.env.example` to `.env` and set `DATABASE_URL` (defaults to
   `mysql://root:@localhost:3306/talkingspaces`), plus generate a `NEXTAUTH_SECRET`
   (`openssl rand -base64 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`).
3. Install dependencies and set up the database:

   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev
   npx prisma db seed
   ```

   The seed script checks `NODE_ENV`: outside of `production` it inserts the
   full sample dataset (categories, projects, testimonials); in `production`
   it only creates the roles and the master admin account, so `npx prisma db
   seed` is safe to run once against the live database too — it never inserts
   placeholder content there.

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Log into `/admin/login` with the seeded master admin account:
   `admin@talkingspaces.co.in` / `ChangeMe123!` — **rotate this password immediately**
   via the Users page before using this anywhere near production data.

## Environment variables

See `.env.example` for the full list. Notably:

- `DATABASE_URL` — MySQL connection string (Prisma).
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL` — NextAuth session signing + canonical URL.
- `NEXT_PUBLIC_SITE_URL` — used for canonical URLs, sitemap, and Open Graph metadata.
- `WHATSAPP_NUMBER`, `SOCIAL_INSTAGRAM`, `SOCIAL_FACEBOOK` — not used at runtime.
  Contact/social details and the homepage hero/studio images are hardcoded in
  `lib/constants.ts` (`SITE_CONFIG`) by design — the admin Settings page only
  covers each user's own password, not site content; update that file and
  redeploy to change these.
- `MEDIA_STORAGE_DRIVER` / `MEDIA_STORAGE_PATH` — local disk storage config (see
  `lib/storage/`). Adding another backend later means adding a new `StorageProvider`
  implementation, not rewriting call sites.

Never commit `.env`.

## Production build (Hostinger Business — Web Apps, Git-deployed)

Deployed via hPanel's "Web Apps" Next.js preset (Websites → your site → Web Apps →
import from Git), which auto-detects `next build`/`next start` from this repo's
`package.json` — `server.js` below is for the alternate manual Passenger "Node.js"
app type only and is unused on this deploy path.

The build uses `output: "standalone"` (see `next.config.ts`) so the deploy only
needs the files each route actually traces, not the full `node_modules` install.
`npm run build` automatically runs `postbuild` (`scripts/copy-standalone-assets.js`)
to copy `public/` and `.next/static` into `.next/standalone/`, after which
`npm run start:standalone` (`node .next/standalone/server.js`) can serve the app
on its own. `next start` (the plain `start` script) still works unchanged against
the regular `.next` build if a given host doesn't use the standalone bundle.

## Production build (Hostinger Business — Node.js Web App, manual Passenger app)

This app runs as a plain Node.js process under Hostinger's Passenger-based Node.js
hosting — no Vercel-only features, no Docker, no serverless assumptions.

- **Node version:** 20 LTS or newer.
- In hPanel: **Websites → (your site) → Setup**, choose the **Node.js** website
  type, set the Node version, application root (where the repo is deployed),
  and set the **Application startup file** to `server.js` (Passenger requires a
  plain entry file listening on `process.env.PORT` — it does not run `npm start`
  for you; that's what `server.js` at the project root does).
- Deploy the code via hPanel's Git integration (Websites → your site → Git) or
  `git clone`/`git pull` over SSH, pointed at this repo.
- Create a MySQL database + user in hPanel (**Databases → MySQL Databases**)
  and build `DATABASE_URL` from it.
- Set all variables from `.env.example` (with production values —
  `NEXTAUTH_URL`/`NEXT_PUBLIC_SITE_URL` as the real `https://` domain) in the
  Node.js app's environment variables panel in hPanel; do not rely on a
  committed `.env` file in production.
- **Install:** `npm install` (runs `prisma generate` automatically via
  `postinstall`) — via hPanel's "NPM Install" button or over SSH.
- **Migrate:** `npx prisma migrate deploy` against the production
  `DATABASE_URL` (run once per deploy, before the app serves traffic).
- **Build:** `npm run build`.
- **Start:** handled by Passenger via the configured startup file
  (`server.js`); restart from hPanel after each deploy. To test manually over
  SSH: `npm run start:prod`.
- Ensure `storage/uploads` (or your configured `MEDIA_STORAGE_PATH`) is a
  writable, persistent directory on the host, outside the path a Git
  pull/deploy would overwrite — it is not part of the build output and must
  survive redeploys.

## Legacy URL compatibility

The old PHP site's public URLs continue to work via rewrites in `next.config.ts`:
`/about.php`, `/portfolio.php`, `/contact.php`, `/before_after.php` all serve their
Next.js equivalents at the clean URLs (`/about`, `/portfolio`, `/contact`,
`/before-after`).

## Known follow-ups

- The real Talking Spaces Interiors logo file could not be fetched automatically from
  the old site. `components/public/Logo.tsx` currently renders a styled text lockup —
  swap it for the real asset (via the Media Library) whenever it's available; no
  other component references the logo.
- Instagram/Facebook profile URLs are empty placeholders in `SITE_CONFIG`
  (`lib/constants.ts`) — set the real URLs there once confirmed.
- The Services and Contact page templates were built from the shared design system
  (no Figma frames existed for them); Projects/Categories/Before & After/Testimonials
  all come from Figma frames directly.
- Admin panel has no email-based password reset (no SMTP configured); the Master
  Admin resets other users' passwords directly from the Users page.

## Admin architecture notes

- **Categories are the parent, Services are a 1:1 child.** A `ProjectCategory`
  drives both the portfolio filters and (optionally) a public `/services/[slug]`
  page — its own `status`/`sortOrder` governs both. Admin manages both together
  under one "Categories & Services" screen; there's no separate Services CRUD.
- **Leads are unified.** The Contact page form and the Request-a-Consultation
  modal both write to a single `Lead` model (`type: ENQUIRY | CONSULTATION`),
  managed from one "Leads" screen instead of two.
- **No SEO admin, no site-content Settings admin** — see the environment
  variables section above. The admin Settings page (`/admin/settings`) only
  lets a signed-in user change their own password.
