---
name: angular-ballballs-architecture
description: "Use when: crear o refactorizar codigo Angular en Ball-Balls siguiendo la arquitectura existente (core/services + interfaces + features), sin romper la logica actual, y construyendo componentes eficientes con pocas lineas. Keywords: dashboard-admin, ngrx, servicios, interfaces, swagger, clean component."
---

# Skill: Angular Ball-Balls Architecture

## Objetivo
Construir codigo nuevo en Angular respetando la arquitectura actual del proyecto Ball-Balls y priorizando componentes pequenos, legibles y eficientes.

## Arquitectura que debes respetar
- `src/app/core/interfaces`: contratos de request/response/state.
- `src/app/core/services`: acceso HTTP y logica de API.
- `src/app/features/<feature>/components`: subcomponentes visuales de la feature.
- `src/app/features/<feature>/store`: `actions.ts`, `effects.ts`, `reducers.ts`, `selectors.ts`.
- `src/app/features/<feature>/<feature>.routes.ts`: rutas hijas cuando la feature tiene modulos internos.
- `src/app/features/<feature>/<feature>.component.ts`: shell/orquestador de la feature.
- Componentes `standalone`, `ChangeDetectionStrategy.OnPush` cuando aplique.

## Regla obligatoria de estructura
- Cada nueva feature debe crearse con `components/` y `store/`, incluso si la primera iteracion usa placeholders.
- Evitar carpetas alternativas para UI modular (por ejemplo `submodules/`) si rompen el patron de features existente.
- Para rutas con `children`, usar `loadChildren` desde `app.routes.ts` hacia `<feature>.routes.ts`.
- Si la feature usa NgRx, registrar `provideState` y `provideEffects` en la ruta padre de la feature.

## Reglas de implementacion
- No inventar DTOs en componentes. Si falta contrato, crearlo en `core/interfaces` o en la feature cuando sea view-model de UI.
- Consumir API via services existentes (`deportes`, `pistas`, `mantenimientos`, `reservas`, `users`, `profiles`, `auth`).
- Si el endpoint usa envelope `{ body: ... }`, tipar el envelope en interfaces y reutilizarlo en servicios.
- Mantener nullabilidad alineada con Swagger (`string | null` cuando corresponda).
- Evitar duplicacion: centralizar agregacion de datos de pantalla en un service/facade de feature.

## Componentes eficientes (pocas lineas)
- Mantener el componente como orquestador de estado UI: `loading`, `error`, `vm`.
- Mover transformaciones repetitivas a funciones puras o a service.
- Usar `takeUntilDestroyed` para suscripciones cortas y seguras.
- Preferir `readonly` y estructuras inmutables.
- Evitar mas de una responsabilidad por metodo.

## Patron recomendado para nueva feature
1. Crear `*.interface.ts` de view model en la feature.
2. Crear `*.service.ts` de feature que agregue llamadas a `core/services`.
3. Crear estructura minima:
   - `components/` con subcomponentes por modulo
   - `store/actions.ts`
   - `store/effects.ts`
   - `store/reducers.ts`
   - `store/selectors.ts`
4. Implementar componente standalone minimo:
   - estado con `signal`
   - `loadData()`
   - plantilla con estados `loading/error/data`
5. Conectar ruta en `app.routes.ts` y `<feature>.routes.ts`.

## Modulos Swagger del dashboard-admin
- Auth (4 endpoints)
- Deportes (5 endpoints)
- Mantenimiento (4 endpoints)
- Pistas (5 endpoints)
- Profile (1 endpoint)
- Reservas (6 endpoints)
- User (2 endpoints)

## Criterios de aceptacion
- Compila sin errores TypeScript.
- Mantiene convenciones de nombres actuales.
- No introduce logica de negocio en HTML.
- El componente final es corto y facil de mantener.
