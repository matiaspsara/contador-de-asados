# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at localhost:3000
npm run build     # Production build (use to verify TypeScript + compilation)
npm run start     # Run production build locally

npx prisma migrate dev --name <nombre>   # Run DB migrations after schema changes
npx prisma generate                      # Regenerate Prisma client after schema changes
npx prisma studio                        # Visual DB browser
```

After any change to `prisma/schema.prisma`, always run `npx prisma generate` before building.

## Environment Variables

Two separate files are needed:
- `.env` — read by Prisma CLI. Must contain `DATABASE_URL`.
- `.env.local` — read by Next.js. Must contain `DATABASE_URL` and `AUTH_SECRET`.

Both are gitignored. See `.env.local` template for required keys.

## Architecture

**Stack:** Next.js 14 (App Router) · PostgreSQL · Prisma 5 · next-auth v5 beta · Tailwind CSS · TypeScript

**Auth:** next-auth v5 beta (`next-auth@beta`) with Credentials provider (email + bcrypt password). JWT session strategy with 1-year maxAge. Config in `src/lib/auth.ts`. The `handlers`, `auth`, `signIn`, `signOut` exports are used across the app — do not use the next-auth v4 API pattern.

**Database:** Prisma 5 (not v7 — v7 broke schema.prisma `url` config). Two models: `User` (id, email, nombre, password) and `Asado` (with `cortes String[]` as a PostgreSQL array, and optional fields `carniceria`, `precioTotal`).

**Data flow:**
- Server Components (`page.tsx`, `ranking/page.tsx`) query Prisma directly — no API calls needed for reads.
- Client Components use `fetch('/api/asados', ...)` for mutations (POST/DELETE).
- `Date` objects from Prisma must be serialized (`.toISOString()`) before passing to client components.

**Key files:**
- `src/lib/auth.ts` — NextAuth config
- `src/lib/prisma.ts` — Prisma singleton (prevents hot-reload from creating multiple instances)
- `src/app/api/asados/route.ts` — GET (stats + list) and POST (create)
- `src/app/api/auth/register/route.ts` — User registration with bcrypt
- `src/components/AsadoForm.tsx` — Main form (client component, handles cortes as toggle chips and star rating with 0.5 step)
- `src/app/ranking/page.tsx` — Cross-user leaderboard, queries all users' asados for current year
