# hshv

> HTTP headers analyzer with security scoring and recommendations.

<!-- README-I18N:START -->

**English** | [Español](./README.es.md)

<!-- README-I18N:END -->

[![Live Demo](https://img.shields.io/badge/Live-Demo-1e3a8a?style=for-the-badge&logo=terminal)](https://hshv.vercel.app/)
[![behance](https://img.shields.io/badge/behance-1769FF?style=for-the-badge&logo=behance&logoColor=white)](https://www.behance.net/ingfranciscastillo)
[![linkedin](https://img.shields.io/badge/linkedin-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/ingfranciscastillo)
[![github_stars](https://img.shields.io/github/stars/ingfranciscastillo/hshv?style=for-the-badge)](https://github.com/ingfranciscastillo/hshv/stargazers)
[![last_commit](https://img.shields.io/github/last-commit/ingfranciscastillo/hshv?style=for-the-badge)](https://github.com/ingfranciscastillo/hshv/commits/main)

![Preview](./918_1x_shots_so.png)

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
| ------- | ------------- |
| **Status** | ✅ Secure &#124; ⚠️ Needs Improvement &#124; ❌ Missing &#124; 🚨 Insecure |
| **Detected Value** | Current header value or "Not detected" |
| **Technical Description** | Explanation of the header's purpose |
| **Potential Impact** | Security risks if not configured |
| **Concrete Recommendation** | Exact code to fix the issue |

**Evaluation example:**

```text
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

## Learn More

- [TanStack Start](https://tanstack.com/start) - Official docs
- [TanStack Router](https://tanstack.com/router) - Routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Drizzle ORM](https://orm.drizzle.team/) - Typed ORM for PostgreSQL
- [Better Auth](https://www.better-auth.com/) - Authentication
- [shadcn/ui](https://ui.shadcn.com/) - UI Components
