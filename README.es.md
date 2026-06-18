# HSHV - HTTP Security Headers Validator

Analizador de headers HTTP con puntuación de seguridad y recomendaciones.

<!-- README-I18N:START -->

[English](./README.md) | **Español**

<!-- README-I18N:END -->

![GitHub Created At](https://img.shields.io/github/created-at/ingfranciscastillo/hshv?style=for-the-badge)
[![github_stars](https://img.shields.io/github/stars/ingfranciscastillo/hshv?style=for-the-badge)](https://github.com/ingfranciscastillo/hshv/stargazers)
[![last_commit](https://img.shields.io/github/last-commit/ingfranciscastillo/hshv?style=for-the-badge)](https://github.com/ingfranciscastillo/hshv/commits/master)
[![Live Demo](https://img.shields.io/badge/Live-Demo-1e3a8a?style=for-the-badge&logo=terminal)](https://hshv.vercel.app/)

![Preview](screenshots/Screenshot%202026-06-13%20at%2003-38-59%20HTTP%20Security%20Headers%20Validator%20—%20Analiza%20headers%20de%20seguridad.png)
![Preview](screenshots/Screenshot%202026-06-13%20at%2003-39-18%20HTTP%20Security%20Headers%20Validator%20—%20Analiza%20headers%20de%20seguridad.png)

## Qué Hace Este Proyecto

Herramienta de análisis de seguridad para headers HTTP. Evalúa la configuración de seguridad de cualquier sitio web, genera puntuaciones detalladas y proporciona recomendaciones accionables para mejorar la protección.

## Funcionalidades

- Análisis automático de headers HTTP
- Score de seguridad de 0 a 100
- Recomendaciones concretas para cada header
- Historial de análisis
- Dashboard con métricas
- Exportación HTML y JSON
- Autenticación de usuarios

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - SSR con React Router
- **Auth**: [Better Auth](https://www.better-auth.com/) - Autenticación completa
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/) - Esquemas de validación tipados

## Arquitectura

```text
Usuario ──▶ TanStack Start SSR ──▶ Server Functions ──▶ Pipeline de Análisis ──▶ Reporte
                │                                              │
           Middleware                                     PostgreSQL / Drizzle
        CSRF + Security Headers                           + Better Auth (cookies)
```

### Middleware Chain

Cada solicitud pasa por dos capas de middleware configuradas en [`src/start.ts`](src/start.ts): protección CSRF (aplicada a server functions) e inyección de headers de seguridad que establece CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy y headers de aislamiento entre orígenes en cada respuesta.

### Routing & Auth

Enrutamiento basado en archivos con [TanStack Router](https://tanstack.com/router). Rutas públicas (`/` para análisis, `/auth` para inicio de sesión) y una ruta protegida (`/history` para el dashboard) por [Better Auth](https://www.better-auth.com/) con sesiones basadas en cookies. El esquema de autenticación vive en PostgreSQL mediante el adaptador de [Drizzle ORM](https://orm.drizzle.team/) en [`src/db/schema.ts`](src/db/schema.ts).

### Pipeline de Análisis

El análisis principal (server function en [`src/lib/headers/analyze.functions.ts`](src/lib/headers/analyze.functions.ts)) sigue este flujo:

1. **Guardia SSRF** – Bloquea solicitudes a rangos de IP privadas/internas ([`src/lib/headers/ssrf.ts`](src/lib/headers/ssrf.ts))
2. **Fetch** – HTTP GET directo o Firecrawl API como respaldo
3. **Rate Limit** – 15 solicitudes/minuto por IP (en memoria)
4. **Motor de Reglas** – 11 reglas ponderadas en 3 categorías (critical, recommended, informational) en [`src/lib/headers/rules.ts`](src/lib/headers/rules.ts)
5. **Puntuación** – Suma ponderada normalizada a 0–100 con niveles de severidad en [`src/lib/headers/scoring.ts`](src/lib/headers/scoring.ts)
6. **Almacenamiento** – Reportes guardados en localStorage para historial y dashboard

### Lado Cliente

Aplicación React con [TanStack Query](https://tanstack.com/query) para estado del servidor, componentes [shadcn/ui](https://ui.shadcn.com/) y un fondo animado 3D tipo terminal renderizado con [OGL](https://github.com/oframe/ogl) y [postprocessing](https://github.com/vanruesc/postprocessing). El historial de análisis y las métricas del dashboard se persisten en localStorage.

## Headers Analizados

- Content-Security-Policy (CSP)
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Cross-Origin-Opener-Policy
- Cross-Origin-Embedder-Policy
- Cross-Origin-Resource-Policy

## Empezar

```bash
git clone https://github.com/ingfranciscastillo/hshv.git
cd hshv
pnpm install
pnpm db:push
pnpm dev
```

## Demo

Prueba la aplicación en vivo en [hshv.vercel.app](https://hshv.vercel.app/)

## Documentación

- [TanStack Start](https://tanstack.com/start) - Documentación oficial
- [TanStack Router](https://tanstack.com/router) - Routing
- [TanStack Query](https://tanstack.com/query) - Gestión de estado server
- [Drizzle ORM](https://orm.drizzle.team/) - ORM tipado para PostgreSQL
- [Better Auth](https://www.better-auth.com/) - Autenticación
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI

## Contacto

<p align="center">
  <a href="https://linkedin.com/in/ingfranciscastillo">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://www.behance.net/ingfranciscastillo">
    <img src="https://img.shields.io/badge/Behance-1769FF?style=for-the-badge&logo=behance&logoColor=white" />
  </a>
</p>
