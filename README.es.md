# hshv

Analizador de headers HTTP con puntuación de seguridad y recomendaciones.

<!-- README-I18N:START -->

[English](./README.md) | **Español**

<!-- README-I18N:END -->

![TanStack Start](https://img.shields.io/badge/TanStack%20Start-latest-FF3E00?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?style=flat-square)
![Better Auth](https://img.shields.io/badge/Better%20Auth-1.5-FF477E?style=flat-square)

## Qué Hace Este Proyecto

Herramienta de análisis de seguridad para headers HTTP. Evalúa la configuración de seguridad de cualquier sitio web, genera puntuaciones detalladas y proporciona recomendaciones accionables para mejorar la protección.

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) - SSR con React Router
- **Auth**: [Better Auth](https://www.better-auth.com/) - Autenticación completa
- **Database**: [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Validation**: [Zod](https://zod.dev/) - Esquemas de validación tipados

## Empezar

```bash
pnpm install
pnpm dev
```

## Funcionalidades

### Evaluación de Headers

Para cada header HTTP de seguridad, el sistema muestra:

| Campo | Descripción |
|-------|-------------|
| **Estado** | ✅ Seguro \| ⚠️ Mejorable \| ❌ Ausente \| 🚨 Inseguro |
| **Valor detectado** | El valor actual del header o "No detectado" |
| **Descripción técnica** | Explicación del propósito del header |
| **Impacto potencial** | Riesgos de seguridad si no está configurado |
| **Recomendación concreta** | Código exacto para corregir el problema |

**Ejemplo de evaluación:**

```
Header: X-Frame-Options
Estado: ❌ Ausente

Descripción: Previene ataques de clickjacking.
Impacto: Un atacante podría cargar el sitio en un iframe malicioso.
Recomendación: X-Frame-Options: DENY
```

### Sistema de Puntuación

Genera una puntuación global de 0-100:

| Score | Nivel | Descripción |
|-------|-------|-------------|
| 0-39 | 🔴 Crítico | Configuración muy vulnerable |
| 40-69 | 🟡 Deficiente | Faltan medidas de seguridad esenciales |
| 70-89 | 🟢 Aceptable | Implementación básica correcta |
| 90-100 | ✨ Excelente | Configuración de seguridad óptima |

Incluye:
- Score total numérico
- Barra visual con gradiente de color
- Resumen ejecutivo del estado de seguridad

### Exportación

Descarga reportes en múltiples formatos:
- **HTML**: Reporte completo visualizable en cualquier navegador
- **JSON**: Datos estructurados para integración con otras herramientas

### Historial

Almacena los análisis realizados:
- Fecha y hora del análisis
- URL analizada
- Puntuación obtenida
- Accede a reportes previos rápidamente

### Dashboard

Panel de estadísticas:
- Total de análisis realizados
- Promedio de puntuaciones
- Headers más frecuentemente ausentes
- Tendencias de seguridad

## Routing

Este proyecto usa [TanStack Router](https://tanstack.com/router) con routing basado en archivos en `src/routes`.

### Añadir una Ruta

Crea un nuevo archivo en `./src/routes`:

```tsx
// src/routes/nueva-ruta.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/nueva-ruta')({
  component: NuevaRutaComponent,
})

function NuevaRutaComponent() {
  return <div>Nueva ruta</div>
}
```

### Añadir Links

```tsx
import { Link } from "@tanstack/react-router"

<Link to="/about">Acerca de</Link>
```

## Server Functions

Funciones server-side que se llaman desde cliente:

```tsx
import { createServerFn } from '@tanstack/react-start'

const getAnalysis = createServerFn({
  method: 'GET',
}).handler(async () => {
  // Tu código de servidor aquí
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
      GET: () => json({ message: 'Hola' }),
    },
  },
})
```

## Base de Datos

Gestión de datos con Drizzle ORM:

```bash
pnpm db:generate   # Generar migraciones
pnpm db:migrate    # Aplicar migraciones
pnpm db:push       # Push schema a DB
pnpm db:pull       # Pull schema desde DB
pnpm db:studio     # Abrir Drizzle Studio
```

## Autenticación

Configura Better Auth:

1. Genera el secret en `.env.local`:

```bash
pnpm dlx @better-auth/cli secret
```

2. Configura en `src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth"
import { Pool } from "pg"

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
})
```

3. Ejecuta migraciones:

```bash
pnpm dlx @better-auth/cli migrate
```

## Linting & Formatting

```bash
pnpm lint    # Verificar código
pnpm format  # Formatear código
pnpm check   # Verificación completa
```

## Testing

```bash
pnpm test    # Ejecutar tests con Vitest
```

## Deployment

Build para producción:

```bash
pnpm build
```

El output está en `dist/` como un servidor Node autocontenido:

```bash
node dist/server/index.mjs
```

Compatible con cualquier host Node (Render, Fly.io, VPS propio).

Para presets específicos (Vercel, Netlify, Cloudflare, AWS Lambda): https://v3.nitro.build/deploy

## Aprender Más

- [TanStack Start](https://tanstack.com/start) - Documentación oficial
- [TanStack Router](https://tanstack.com/router) - Routing
- [TanStack Query](https://tanstack.com/query) - Gestión de estado server
- [Drizzle ORM](https://orm.drizzle.team/) - ORM tipado para PostgreSQL
- [Better Auth](https://www.better-auth.com/) - Autenticación
- [shadcn/ui](https://ui.shadcn.com/) - Componentes UI