# hshv

HTTP headers analyzer with security scoring and recommendations.

<!-- README-I18N:START -->

**English** | [Español](./README.es.md)

<!-- README-I18N:END -->

![TanStack Start](https://img.shields.io/badge/TanStack%20Start-latest-FF3E00?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?style=flat-square)
![Better Auth](https://img.shields.io/badge/Better%20Auth-1.5-FF477E?style=flat-square)

## What This Does

Security analysis tool for HTTP headers. Evaluates the security configuration of any website, generates detailed scores, and provides actionable recommendations to improve protection.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - SSR with React Router
- **Auth**: [Better Auth](https://www.better-auth.com/) - Complete authentication
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/) - Typed validation schemas

## Getting Started

```bash
pnpm install
pnpm dev
```

## Features

### Headers Evaluation

For each security HTTP header, the system shows:

| Field | Description |
|-------|-------------|
| **Status** | ✅ Secure \| ⚠️ Needs Improvement \| ❌ Missing \| 🚨 Insecure |
| **Detected Value** | Current header value or "Not detected" |
| **Technical Description** | Explanation of the header's purpose |
| **Potential Impact** | Security risks if not configured |
| **Concrete Recommendation** | Exact code to fix the issue |

**Evaluation example:**

```
Header: X-Frame-Options
Status: ❌ Missing

Description: Prevents clickjacking attacks.
Impact: An attacker could load the site in a malicious iframe.
Recommendation: X-Frame-Options: DENY
```

### Scoring System

Generates a global score from 0-100:

| Score | Level | Description |
|-------|-------|-------------|
| 0-39 | 🔴 Critical | Very vulnerable configuration |
| 40-69 | 🟡 Poor | Essential security measures missing |
| 70-89 | 🟢 Acceptable | Basic implementation correct |
| 90-100 | ✨ Excellent | Optimal security configuration |

Includes:
- Total numeric score
- Visual bar with color gradient
- Executive summary of security status

### Export

Download reports in multiple formats:
- **HTML**: Complete report viewable in any browser
- **JSON**: Structured data for integration with other tools

### History

Stores performed analyses:
- Date and time of analysis
- Analyzed URL
- Obtained score
- Quick access to previous reports

### Dashboard

Statistics panel:
- Total analyses performed
- Average scores
- Most frequently missing headers
- Security trends

## Routing

This project uses [TanStack Router](https://tanstack.com/router) with file-based routing in `src/routes`.

### Adding a Route

Create a new file in `./src/routes`:

```tsx
// src/routes/new-route.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/new-route')({
  component: NewRouteComponent,
})

function NewRouteComponent() {
  return <div>New route</div>
}
```

### Adding Links

```tsx
import { Link } from "@tanstack/react-router"

<Link to="/about">About</Link>
```

## Server Functions

Server-side functions callable from client:

```tsx
import { createServerFn } from '@tanstack/react-start'

const getAnalysis = createServerFn({
  method: 'GET',
}).handler(async () => {
  // Your server code here
  return { result: 'data' }
})
```

## API Routes

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

export const Route = createFileRoute('/api/endpoint')({
  server: {
    handlers: {
      GET: () => json({ message: 'Hello' }),
    },
  },
})
```

## Database

Data management with Drizzle ORM:

```bash
pnpm db:generate   # Generate migrations
pnpm db:migrate    # Apply migrations
pnpm db:push       # Push schema to DB
pnpm db:pull       # Pull schema from DB
pnpm db:studio     # Open Drizzle Studio
```

## Authentication

Configure Better Auth:

1. Generate secret in `.env.local`:

```bash
pnpm dlx @better-auth/cli secret
```

2. Configure in `src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
})
```

3. Run migrations:

```bash
pnpm dlx @better-auth/cli migrate
```

## Linting & Formatting

```bash
pnpm lint    # Check code
pnpm format  # Format code
pnpm check   # Full verification
```

## Testing

```bash
pnpm test    # Run tests with Vitest
```

## Deployment

Production build:

```bash
pnpm build
```

Output is in `dist/` as a self-contained Node server:

```bash
node dist/server/index.mjs
```

Compatible with any Node host (Render, Fly.io, your own VPS, etc.).

For specific presets (Vercel, Netlify, Cloudflare, AWS Lambda): https://v3.nitro.build/deploy

## Learn More

- [TanStack Start](https://tanstack.com/start) - Official docs
- [TanStack Router](https://tanstack.com/router) - Routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Drizzle ORM](https://orm.drizzle.team/) - Typed ORM for PostgreSQL
- [Better Auth](https://www.better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI Components