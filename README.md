# ResQd - marketing site + waitlist

Single-page Next.js site for **ResQd** (a.k.a. ResqNet), a cloud-native wildfire
emergency-response platform. Showcases the platform's features with looping
mini-animations, leaves labelled slots for screen captures, and collects
"Join the waitlist" signups straight into a Google Sheet.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4, palette tokens in `app/globals.css`
- [`motion`](https://motion.dev) for the hero scene and every feature mini-animation
- Dark **Mapbox** Static Images basemap under the map animations
  (`components/animations/MapScene.tsx`) - one shared view, one cached request.
  Token in `NEXT_PUBLIC_MAPBOX_TOKEN`; without it the scenes render with no basemap.
- Material Symbols (Google Fonts) for UI and map-marker icons
- Waitlist writes to a Google Sheet via a Google Apps Script web app - no
  database, no third-party service, no npm dependency

## Develop

```bash
cp .env.example .env.local   # fill in the values (see below)
npm install
npm run dev                  # http://localhost:3000
```

## Content

All copy lives in `lib/content.ts`; the five feature blocks are data in
`lib/features.ts`. Edit those rather than the components.

## Screen captures

All screenshots live in one place: the **Screens** gallery near the bottom of the
page. Drop PNGs into `public/screenshots/` using the names in
`public/screenshots/README.md` and each replaces its placeholder, no code change.

## Waitlist

`POST /api/waitlist` takes `{ email, organization, role }` (plus a `company`
honeypot), validates with zod, then appends one row to a Google Sheet. It is
rate-limited in-memory (`lib/rate-limit.ts`): 6/min per IP plus a 100/min global
ceiling, `429` + `Retry-After` when exceeded. Best-effort only (serverless
instances don't share memory); for a distributed flood enable the Vercel Firewall.

**One-time sheet setup:** follow the steps in
[`docs/waitlist-sheet.gs`](docs/waitlist-sheet.gs) - create the sheet, paste the
script, deploy it as a web app. You end up with a web-app URL and a shared
secret.

Then set two env vars (in `.env.local` for dev, and in the Vercel project for
Preview + Production):

| Var | Value |
| --- | --- |
| `WAITLIST_SHEET_URL` | the deployed web-app URL, ending in `/exec` |
| `WAITLIST_SHEET_SECRET` | the same long random string you put in the script |

New signups appear as rows in the sheet. That is the whole backend.

## Deploy (Vercel)

1. Push to GitHub, import the repo in Vercel (Next.js is auto-detected, no config).
2. Project -> Settings -> Environment Variables, add for Production and Preview:
   - `WAITLIST_SHEET_URL`
   - `WAITLIST_SHEET_SECRET`
   - `NEXT_PUBLIC_MAPBOX_TOKEN` (public `pk.` token, domain-restricted)
3. Deploy.

## Build

```bash
npm run build
```
