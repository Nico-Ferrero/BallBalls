---
name: dashboard-components-ballballs
description: "Use when: crear o iterar componentes del feature dashboard-admin en Ball-Balls siguiendo el patron actual (components + store + routes), con PrimeNG, NgRx y estilos por variables de tema. Keywords: dashboard overview, dashboard deportes, admin modules, primeng table, dialog, chart, sweetalert."
---

# Skill: Dashboard Components Ball-Balls

## Objetivo
Construir componentes del `dashboard-admin` con el mismo patron de arquitectura ya implementado en el proyecto: feature shell + componentes por modulo + store NgRx por feature.

## Estructura obligatoria
- `src/app/features/dashboard-admin/components/<modulo>/`
- `src/app/features/dashboard-admin/store/actions.ts`
- `src/app/features/dashboard-admin/store/effects.ts`
- `src/app/features/dashboard-admin/store/reducers.ts`
- `src/app/features/dashboard-admin/store/selectors.ts`
- `src/app/features/dashboard-admin/dashboard-admin.routes.ts`

## Patron de componente
1. Componente `standalone` con `ChangeDetectionStrategy.OnPush`.
2. Carga de datos por `store.dispatch(...)` en `ngOnInit`.
3. Lectura de estado con `store.selectSignal(...)`.
4. Estados visibles: `loading`, `error`, `data`.
5. Sin logica de negocio en plantilla.

## UI y librerias
- Usar PrimeNG para tablas, dialogos y formularios (`TableModule`, `DialogModule`, `ButtonModule`, etc.).
- Usar `SweetAlert2` para confirmaciones y toasts.
- Usar `p-chart` para resumen visual en `overview` cuando haya metricas.

## Reglas de estilos
- No hardcodear paleta principal de la app en componentes nuevos.
- Preferir variables CSS: `var(--text-primary)`, `var(--bg-secondary)`, `var(--border-color)`, etc.
- Mantener estilos compactos y consistentes con dashboard existente.

## Modulos objetivo del dashboard
- overview
- deportes
- auth
- mantenimiento
- pistas
- profile
- reservas
- user

## Checklist de aceptacion
- Compila con `npm run build -- --configuration development`.
- Rutas y componentes existentes no se rompen.
- Cada modulo nuevo queda con carpeta propia y archivos base (`.ts`, `.html`, `.css`).
- El store de la feature mantiene acciones descriptivas y errores manejados.
