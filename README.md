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
  `lib/constants.ts` (`SITE_CONFIG`) by design — there is no admin Settings page;
  update that file and redeploy to change them.
- `MEDIA_STORAGE_DRIVER` / `MEDIA_STORAGE_PATH` — local disk storage config (see
  `lib/storage/`). Adding another backend later means adding a new `StorageProvider`
  implementation, not rewriting call sites.

Never commit `.env`.

## Production build (Hostinger Business — Node.js Web App)

This app runs as a plain Node.js process — no Vercel-only features, no Docker, no
serverless assumptions.

- **Node version:** 20 LTS or newer.
- **Install:** `npm install` (runs `prisma generate` automatically via `postinstall`).
- **Migrate:** `npx prisma migrate deploy` against the production `DATABASE_URL`
  (run once per deploy, before the app serves traffic).
- **Build:** `npm run build` (Next.js `output: "standalone"`).
- **Start:** `npm start`.
- Ensure `storage/uploads` (or your configured `MEDIA_STORAGE_PATH`) is a writable,
  persistent directory on the host — it is not part of the build output and must
  survive redeploys.
- Set all variables from `.env.example` in the hosting panel's environment
  configuration; do not rely on a committed `.env` file in production.

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
- **No SEO admin / no Settings admin**, by design — see the environment variables
  section above.
