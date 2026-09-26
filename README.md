<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/logo-dark.svg">
    <img src="./public/logo.svg" alt="HSHV" height="64">
  </picture>
</p>

<p align="center">
  Audit the HTTP security headers of any website.<br>
  A 0 to 100 score, the risk behind each header, and a fix you can copy.
</p>

<!-- README-I18N:START -->

<p align="center"><strong>English</strong> | <a href="./README.es.md">Español</a></p>

<!-- README-I18N:END -->

<p align="center">
  <a href="https://hshv.vercel.app/"><img src="https://img.shields.io/badge/Live-hshv.vercel.app-1a7268?style=for-the-badge" alt="Live site"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/ingfranciscastillo/hshv?style=for-the-badge" alt="MIT License"></a>
  <a href="https://github.com/ingfranciscastillo/hshv/commits/master"><img src="https://img.shields.io/github/last-commit/ingfranciscastillo/hshv?style=for-the-badge" alt="Last commit"></a>
  <a href="https://github.com/ingfranciscastillo/hshv/stargazers"><img src="https://img.shields.io/github/stars/ingfranciscastillo/hshv?style=for-the-badge" alt="GitHub stars"></a>
</p>

## Overview

HSHV (HTTP Security Headers Validator) fetches a URL on the server, reads its response headers and grades them against current best practices. Each header gets a status, an explanation of the risk and a ready-to-paste recommendation. Reports can be exported as JSON or HTML, and signed-in users get a history view with aggregate metrics.

## Features

- **11 weighted rules** across critical, recommended and informational headers
- **Security score from 0 to 100** with a level: excellent, acceptable, deficient or critical
- **Actionable findings**: detected value, risk and recommended configuration per header
- **Export** any report to JSON or HTML, or copy it to the clipboard
- **History and dashboard**: total analyses, average score and most frequently missing headers
- **Firecrawl fallback** for sites that block direct server-side requests
- **Hardened by default**: SSRF guard, per-IP rate limiting, CSRF protection and strict security headers on the app itself

## How it works

```text
URL ──▶ SSRF guard ──▶ Fetch (direct or Firecrawl) ──▶ Rules engine ──▶ Score ──▶ Report
```

1. **SSRF guard** rejects private, loopback and internal addresses ([`ssrf.ts`](src/lib/headers/ssrf.ts)).
2. **Fetch** requests the page directly, or through Firecrawl when enabled and the direct request fails.
3. **Rate limit** caps analysis at 15 requests per minute per IP.
4. **Rules engine** evaluates each header and assigns a status: secure, improvable, missing or insecure ([`rules.ts`](src/lib/headers/rules.ts)).
5. **Scoring** computes a weighted average normalized to 0 to 100 ([`scoring.ts`](src/lib/headers/scoring.ts)).

| Score | Level |
| --- | --- |
| 90 to 100 | Excellent |
| 70 to 89 | Acceptable |
| 40 to 69 | Deficient |
| 0 to 39 | Critical |

## Analyzed headers

| Header | Category | Weight |
| --- | --- | ---: |
| `Content-Security-Policy` | Critical | 25 |
| `Strict-Transport-Security` | Critical | 20 |
| `X-Frame-Options` | Critical | 12 |
| `X-Content-Type-Options` | Critical | 8 |
| `Referrer-Policy` | Critical | 8 |
| `Permissions-Policy` | Critical | 7 |
| `Cross-Origin-Opener-Policy` | Recommended | 5 |
| `Cross-Origin-Embedder-Policy` | Recommended | 4 |
| `Cross-Origin-Resource-Policy` | Recommended | 4 |
| `X-Powered-By` | Informational | 4 |
| `Server` | Informational | 3 |

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), React 19 |
| Auth | [Better Auth](https://www.better-auth.com/) with cookie sessions |
| Database | PostgreSQL ([Neon](https://neon.tech/)) with [Drizzle ORM](https://orm.drizzle.team/) |
| UI | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Phosphor Icons](https://phosphoricons.com/) |
| Type | Newsreader, Geist and Geist Mono, self-hosted with [Fontsource](https://fontsource.org/) |
| Validation | [Zod](https://zod.dev/) |
| Tooling | [Vite](https://vite.dev/), [Biome](https://biomejs.dev/), [Vitest](https://vitest.dev/) |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 24 or later
- [pnpm](https://pnpm.io/)
- A PostgreSQL database (a free [Neon](https://neon.tech/) project works)

### Setup

```bash
git clone https://github.com/ingfranciscastillo/hshv.git
cd hshv
pnpm install
```

Create a `.env.local` file in the project root:

| Variable | Required | Description |
| --- | :---: | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Random secret used to sign sessions |
| `BETTER_AUTH_URL` | Yes | Base URL of the app, for example `http://localhost:3000` |
| `APP_URL` | Yes | Public origin trusted by Better Auth |
| `FIRECRAWL_API_KEY` | No | Enables the Firecrawl fallback |

Then push the schema and start the dev server:

```bash
pnpm db:push
pnpm dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

> [!NOTE]
> Analysis history is stored in the browser's `localStorage`, so it stays on the device where each analysis was run. The database is only used for accounts and sessions.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server on port 3000 |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview the production build |
| `pnpm test` | Run the test suite with Vitest |
| `pnpm check` | Lint and format check with Biome |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Apply migrations |
| `pnpm db:push` | Push the schema to the database |
| `pnpm db:studio` | Open Drizzle Studio |

## Project structure

```text
src/
├── components/hshv/   # App UI: header, form, report, history
├── db/                # Drizzle client and schema
├── lib/headers/       # SSRF guard, rules, scoring, export, storage
├── middleware/        # Security headers middleware
├── routes/            # File-based routes (/, /auth, /history, /api/auth)
└── styles.css         # Design tokens and theme
```
