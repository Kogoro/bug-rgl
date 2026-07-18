# AGENTS.md

## Cursor Cloud specific instructions

This is a single, frontend-only **Next.js 16 (App Router, Turbopack)** app (`bug-rgl`) — a `react-grid-layout` playground. There is no backend, database, or external service; the Next.js dev server is the only service.

- Scripts live in `package.json`: `npm run dev` (dev server on http://localhost:3000), `npm run build`, `npm run start`, `npm run lint`. See `README.md` for usage.
- Dependencies are installed by the startup update script (`npm install`); no extra setup is needed.
- `next dev` uses Turbopack. It binds to port 3000 by default; the page is client-rendered (`"use client"`), so `curl` returns the shell HTML while the grid mounts in the browser.
- Node `>=20.9.0` is required (per `engines`).
