# Emil Kowalski — Referencia de motion & micro-interacciones

Emil Kowalski (https://emilkowal.ski/, https://github.com/emilkowalski) es referente
de animaciones de resorte (spring physics), motion natural y micro-interacciones en
React. Sus librerías son **React-only**, así que en este proyecto Angular usamos
ports / equivalentes.

## Librerías originales (React) — sólo referencia

| Librería | Función | Repo |
|---|---|---|
| Sonner | Toasts con animaciones de resorte | https://github.com/emilkowalski/sonner |
| Vaul | Drawer / bottom-sheet con física natural | https://github.com/emilkowalski/vaul |
| ContextMenu | Menús contextuales animados | https://github.com/emilkowalski/contextmenu |
| Anim | Experimentos de animación | https://github.com/emilkowalski/anim |

## Equivalentes instalados en este proyecto

### 1. `ngx-sonner@1.0.0` (port oficial de Sonner)
- Autor: tutkli — https://github.com/tutkli/ngx-sonner
- Compatible con Angular 17.3+
- API casi idéntica: `<ngx-sonner-toaster />` en el shell + `toast()` desde
  cualquier punto.

```ts
// app.component.ts
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  standalone: true,
  imports: [NgxSonnerToaster, /* ... */],
  template: `<ngx-sonner-toaster position="bottom-right" theme="system" />`
})
```

```ts
// cualquier servicio/componente
import { toast } from 'ngx-sonner';

toast('Reserva creada');
toast.success('Pago confirmado');
toast.error('Error al crear la reserva');
toast.promise(reservasService.createReserva(req), {
  loading: 'Creando reserva...',
  success: 'Reserva creada',
  error: (e) => `Error: ${e.message}`
});
```

### 2. `motion@12.x` (Motion One — framework-agnostic)
- Librería de Matt Perry; funciona en Angular nativo vía Web Animations API.
- Provee `animate`, `spring`, `inView`, `scroll`, `stagger`.

```ts
import { animate, spring } from 'motion';

// Spring physics
animate(this.cardRef.nativeElement,
  { y: [20, 0], opacity: [0, 1] },
  { easing: spring({ stiffness: 200, damping: 20 }) }
);

// Scroll-linked
scroll(animate(this.heroRef.nativeElement, { opacity: [0, 1] }));
```

### 3. Drawer / Bottom Sheet (Vaul no portado)
Vaul no tiene port a Angular. Usar lo que ya está disponible:

- **`@angular/cdk`** (ya instalado): `BottomSheet` y `Overlay` para construir
  drawers customizados con spring de `motion`.
- **`primeng@17.18.15`** (ya instalado): componente `p-sidebar` / `p-drawer`.

Para conseguir el feel de Vaul (drag-to-dismiss, spring snap):
```ts
// usar CDK BottomSheet + @angular/cdk/drag-drop + motion para snap
```

## Principios estéticos a copiar de Emil

1. **Spring sobre easing**: nunca uses `ease-in-out` de 300ms. Usa spring
   physics. `stiffness: 200, damping: 20` es un buen default.
2. **Movimiento corto, no lento**: 200-400ms con spring, no 600ms con ease.
3. **Stagger sutil**: en listas, retrasa 30-60ms por item, no 100+.
4. **Origen del movimiento**: las cosas entran desde donde "vienen" (toast
   desde abajo si está abajo, drawer desde el borde).
5. **Drag elástico**: cualquier elemento arrastrable debe resistir más allá
   de su límite (rubber-band), no parar en seco.
6. **Sin estados intermedios**: el spring lleva del A al B sin "frenos".
   Evita `linear` o `ease-out` salvo en animaciones de loading.
7. **Hover delicado**: scale 1.02-1.05, no 1.1. Translate -2px, no -8px.

## Referencias de motion en uso aquí

Después de instalar, ejemplos prácticos:
- Toasts de éxito al crear/cancelar reservas → `ngx-sonner`
- Animación de entrada de cards de pistas → `motion` con stagger
- Drawer móvil para filtros de tienda → CDK BottomSheet + motion spring
- Confirmaciones de pago → toast.promise

## Recursos

- https://emilkowal.ski/ui — artículos sobre design eng
- https://motion.dev/docs/spring — spring config reference
- https://github.com/tutkli/ngx-sonner — port Angular
- https://tutkli.github.io/ngx-sonner/ — playground del port
