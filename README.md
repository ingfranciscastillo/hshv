# HSHV - HTTP Security Headers Validator

HTTP headers analyzer with security scoring and recommendations.

<!-- README-I18N:START -->

**English** | [Español](./README.es.md)

<!-- README-I18N:END -->

![GitHub Created At](https://img.shields.io/github/created-at/ingfranciscastillo/hshv?style=for-the-badge)
[![github_stars](https://img.shields.io/badge/github_stars-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ingfranciscastillo/hshv/stargazers)
[![last_commit](https://img.shields.io/github/last-commit/ingfranciscastillo/hshv?style=for-the-badge)](https://github.com/ingfranciscastillo/hshv/commits/master)
[![Live Demo](https://img.shields.io/badge/Live-Demo-1e3a8a?style=for-the-badge&logo=terminal)](https://hshv.vercel.app/)

![Preview](screenshots/Screenshot%202026-06-13%20at%2003-38-59%20HTTP%20Security%20Headers%20Validator%20—%20Analiza%20headers%20de%20seguridad.png)
![Preview](screenshots/Screenshot%202026-06-13%20at%2003-39-18%20HTTP%20Security%20Headers%20Validator%20—%20Analiza%20headers%20de%20seguridad.png)

## What This Does

Security analysis tool for HTTP headers. Evaluates the security configuration of any website, generates detailed scores, and provides actionable recommendations to improve protection.

## Features

- Automatic HTTP header analysis
- Security score from 0 to 100
- Concrete recommendations for each header
- Analysis history
- Dashboard with metrics
- HTML and JSON export
- User authentication

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - SSR with React Router
- **Auth**: [Better Auth](https://www.better-auth.com/) - Complete authentication
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/) - Typed validation schemas

## Architecture

```text
User ──▶ TanStack Start SSR ──▶ Server Functions ──▶ Analysis Pipeline ──▶ Report
                │                                          │
           Middleware                                  PostgreSQL / Drizzle
        CSRF + Security Headers                        + Better Auth (cookies)
```

### Middleware Chain

Every request passes through two layers of middleware configured in [`src/start.ts`](src/start.ts): CSRF protection (applied to server functions) and security headers injection that sets CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and cross-origin isolation headers on every response.

### Routing & Auth

File-based routing powered by [TanStack Router](https://tanstack.com/router). Public routes (`/` for analysis, `/auth` for login/signup) and a guarded route (`/history` for dashboard) protected by [Better Auth](https://www.better-auth.com/) with cookie-based sessions. Auth schema lives in PostgreSQL via the [Drizzle ORM](https://orm.drizzle.team/) adapter at [`src/db/schema.ts`](src/db/schema.ts).

### Analysis Pipeline

The core analysis (server function at [`src/lib/headers/analyze.functions.ts`](src/lib/headers/analyze.functions.ts)) follows this flow:

1. **SSRF Guard** – Blocks requests to private/internal IP ranges ([`src/lib/headers/ssrf.ts`](src/lib/headers/ssrf.ts))
2. **Fetch** – Direct HTTP GET or Firecrawl API fallback
3. **Rate Limit** – 15 requests/minute per IP (in-memory)
4. **Rules Engine** – 11 weighted rules across 3 categories (critical, recommended, informational) at [`src/lib/headers/rules.ts`](src/lib/headers/rules.ts)
5. **Scoring** – Weighted sum normalized to 0–100 with severity levels at [`src/lib/headers/scoring.ts`](src/lib/headers/scoring.ts)
6. **Storage** – Reports saved to localStorage for history and dashboard

### Client-side

React application with [TanStack Query](https://tanstack.com/query) for server state, [shadcn/ui](https://ui.shadcn.com/) components, and an animated 3D terminal background rendered with [OGL](https://github.com/oframe/ogl) and [postprocessing](https://github.com/vanruesc/postprocessing). Analysis history and dashboard metrics are persisted client-side in localStorage.

## Analyzed Headers

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Embedder-Policy
- Cross-Origin-Resource-Policy

## Getting Started

```bash
git clone https://github.com/ingfranciscastillo/hshv.git
cd hshv
pnpm install
pnpm db:push
pnpm dev
```

## Demo

Try the live application at [hshv.vercel.app](https://hshv.vercel.app/)

## Documentation

- [TanStack Start](https://tanstack.com/start) - Official docs
- [TanStack Router](https://tanstack.com/router) - Routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Drizzle ORM](https://orm.drizzle.team/) - Typed ORM for PostgreSQL
- [Better Auth](https://www.better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI Components

## Contact

<p align="center">
  <a href="https://linkedin.com/in/ingfranciscastillo">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://www.behance.net/ingfranciscastillo">
    <img src="https://img.shields.io/badge/Behance-1769FF?style=for-the-badge&logo=behance&logoColor=white" />
  </a>
</p>
