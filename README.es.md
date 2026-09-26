<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/logo-dark.svg">
    <img src="./public/logo.svg" alt="HSHV" height="64">
  </picture>
</p>

<p align="center">
  Audita los headers de seguridad HTTP de cualquier sitio.<br>
  Una puntuación de 0 a 100, el riesgo detrás de cada header y una corrección lista para copiar.
</p>

<!-- README-I18N:START -->

<p align="center"><a href="./README.md">English</a> | <strong>Español</strong></p>

<!-- README-I18N:END -->

<p align="center">
  <a href="https://hshv.vercel.app/"><img src="https://img.shields.io/badge/Live-hshv.vercel.app-1a7268?style=for-the-badge" alt="Sitio en vivo"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/github/license/ingfranciscastillo/hshv?style=for-the-badge" alt="Licencia MIT"></a>
  <a href="https://github.com/ingfranciscastillo/hshv/commits/master"><img src="https://img.shields.io/github/last-commit/ingfranciscastillo/hshv?style=for-the-badge" alt="Último commit"></a>
  <a href="https://github.com/ingfranciscastillo/hshv/stargazers"><img src="https://img.shields.io/github/stars/ingfranciscastillo/hshv?style=for-the-badge" alt="Estrellas en GitHub"></a>
</p>

## Descripción

HSHV (HTTP Security Headers Validator) solicita una URL desde el servidor, lee los headers de la respuesta y los evalúa según las buenas prácticas actuales. Cada header recibe un estado, una explicación del riesgo y una recomendación lista para pegar. Los reportes se exportan en JSON o HTML, y los usuarios con sesión tienen un historial con métricas agregadas.

## Funcionalidades

- **11 reglas ponderadas** entre headers críticos, recomendados e informativos
- **Puntuación de seguridad de 0 a 100** con un nivel: excelente, aceptable, deficiente o crítico
- **Hallazgos accionables**: valor detectado, riesgo y configuración recomendada por header
- **Exportación** de cualquier reporte a JSON o HTML, o copia al portapapeles
- **Historial y dashboard**: total de análisis, puntuación promedio y headers más ausentes
- **Respaldo con Firecrawl** para sitios que bloquean las solicitudes directas desde el servidor
- **Seguro por defecto**: protección SSRF, límite de solicitudes por IP, protección CSRF y headers de seguridad estrictos en la propia app

## Cómo funciona

```text
URL ──▶ Protección SSRF ──▶ Fetch (directo o Firecrawl) ──▶ Motor de reglas ──▶ Puntuación ──▶ Reporte
```

1. **Protección SSRF**: rechaza direcciones privadas, de loopback e internas ([`ssrf.ts`](src/lib/headers/ssrf.ts)).
2. **Fetch**: solicita la página directamente, o mediante Firecrawl si está activado y la solicitud directa falla.
3. **Límite de solicitudes**: máximo 15 análisis por minuto por IP.
4. **Motor de reglas**: evalúa cada header y le asigna un estado: seguro, mejorable, ausente o inseguro ([`rules.ts`](src/lib/headers/rules.ts)).
5. **Puntuación**: promedio ponderado normalizado de 0 a 100 ([`scoring.ts`](src/lib/headers/scoring.ts)).

| Puntuación | Nivel |
| --- | --- |
| 90 a 100 | Excelente |
| 70 a 89 | Aceptable |
| 40 a 69 | Deficiente |
| 0 a 39 | Crítico |

## Headers analizados

| Header | Categoría | Peso |
| --- | --- | ---: |
| `Content-Security-Policy` | Crítico | 25 |
| `Strict-Transport-Security` | Crítico | 20 |
| `X-Frame-Options` | Crítico | 12 |
| `X-Content-Type-Options` | Crítico | 8 |
| `Referrer-Policy` | Crítico | 8 |
| `Permissions-Policy` | Crítico | 7 |
| `Cross-Origin-Opener-Policy` | Recomendado | 5 |
| `Cross-Origin-Embedder-Policy` | Recomendado | 4 |
| `Cross-Origin-Resource-Policy` | Recomendado | 4 |
| `X-Powered-By` | Informativo | 4 |
| `Server` | Informativo | 3 |

## Tech stack

| Área | Herramientas |
| --- | --- |
| Framework | [TanStack Start](https://tanstack.com/start), [TanStack Router](https://tanstack.com/router), [TanStack Query](https://tanstack.com/query), React 19 |
| Autenticación | [Better Auth](https://www.better-auth.com/) con sesiones en cookies |
| Base de datos | PostgreSQL ([Neon](https://neon.tech/)) con [Drizzle ORM](https://orm.drizzle.team/) |
| UI | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Phosphor Icons](https://phosphoricons.com/) |
| Tipografía | Newsreader, Geist y Geist Mono, servidas con [Fontsource](https://fontsource.org/) |
| Validación | [Zod](https://zod.dev/) |
| Herramientas | [Vite](https://vite.dev/), [Biome](https://biomejs.dev/), [Vitest](https://vitest.dev/) |

## Primeros pasos

### Requisitos

- [Node.js](https://nodejs.org/) 24 o superior
- [pnpm](https://pnpm.io/)
- Una base de datos PostgreSQL (sirve un proyecto gratuito de [Neon](https://neon.tech/))

### Instalación

```bash
git clone https://github.com/ingfranciscastillo/hshv.git
cd hshv
pnpm install
```

Crea un archivo `.env.local` en la raíz del proyecto:

| Variable | Obligatoria | Descripción |
| --- | :---: | --- |
| `DATABASE_URL` | Sí | Cadena de conexión de PostgreSQL |
| `BETTER_AUTH_SECRET` | Sí | Secreto aleatorio para firmar las sesiones |
| `BETTER_AUTH_URL` | Sí | URL base de la app, por ejemplo `http://localhost:3000` |
| `APP_URL` | Sí | Origen público en el que confía Better Auth |
| `FIRECRAWL_API_KEY` | No | Activa el respaldo con Firecrawl |

Después aplica el esquema e inicia el servidor de desarrollo:

```bash
pnpm db:push
pnpm dev
```

La app queda disponible en [http://localhost:3000](http://localhost:3000).

> [!NOTE]
> El historial de análisis se guarda en el `localStorage` del navegador, así que queda en el dispositivo donde se hizo cada análisis. La base de datos solo se usa para cuentas y sesiones.

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm dev` | Inicia el servidor de desarrollo en el puerto 3000 |
| `pnpm build` | Compila para producción |
| `pnpm preview` | Sirve la build de producción |
| `pnpm test` | Ejecuta las pruebas con Vitest |
| `pnpm check` | Lint y formato con Biome |
| `pnpm db:generate` | Genera migraciones de Drizzle |
| `pnpm db:migrate` | Aplica las migraciones |
| `pnpm db:push` | Envía el esquema a la base de datos |
| `pnpm db:studio` | Abre Drizzle Studio |

## Estructura del proyecto

```text
src/
├── components/hshv/   # UI de la app: header, formulario, reporte, historial
├── db/                # Cliente y esquema de Drizzle
├── lib/headers/       # Protección SSRF, reglas, puntuación, exportación, almacenamiento
├── middleware/        # Middleware de headers de seguridad
├── routes/            # Rutas por archivos (/, /auth, /history, /api/auth)
└── styles.css         # Tokens de diseño y tema
```
