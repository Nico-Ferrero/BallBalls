import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as DashboardAdminActions from './actions';
import { DashboardAdminService } from '../dashboard-admin.service';
import Swal from 'sweetalert2';

@Injectable()
export class DashboardAdminEffects {
  private readonly actions$ = inject(Actions);
  private readonly dashboardAdminService = inject(DashboardAdminService);

  loadStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminStats),
      mergeMap(() =>
        this.dashboardAdminService.loadStats().pipe(
          map((stats) => DashboardAdminActions.loadDashboardAdminStatsSuccess({ stats })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminStatsFailure({ error: 'No se pudieron cargar las metricas del panel.' })))
        )
      )
    )
  );

  loadDeportes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminDeportes),
      mergeMap(() =>
        this.dashboardAdminService.loadDeportes().pipe(
          map((deportes) => DashboardAdminActions.loadDashboardAdminDeportesSuccess({ deportes })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminDeportesFailure({ error: 'No se pudieron cargar los deportes.' })))
        )
      )
    )
  );

  loadPistas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminPistas),
      mergeMap(({ pageNumber, pageSize, Nombre, Deporte, PrecioMin, PrecioMax, Disponibilidad, Orden }) =>
        this.dashboardAdminService.loadPistas({
          PageNumber: pageNumber ?? 1,
          PageSize: pageSize ?? 10,
          Nombre,
          Deporte,
          PrecioMin,
          PrecioMax,
          Disponibilidad,
          Orden
        }).pipe(
          map((pistas) => DashboardAdminActions.loadDashboardAdminPistasSuccess({ pistas })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminPistasFailure({ error: 'No se pudieron cargar las pistas.' })))
        )
      )
    )
  );

  loadAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminAuth),
      mergeMap(() =>
        this.dashboardAdminService.loadAuthData().pipe(
          map((auth) => DashboardAdminActions.loadDashboardAdminAuthSuccess({ auth })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminAuthFailure({ error: 'No se pudieron cargar los datos de sesion actual.' })))
        )
      )
    )
  );

  refreshSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.refreshDashboardAdminSession),
      mergeMap(() =>
        this.dashboardAdminService.refreshSession().pipe(
          map(() => {
            this.showSuccessToast('Sesion renovada correctamente.');
            return DashboardAdminActions.loadDashboardAdminAuth();
          }),
          catchError(() => {
            this.showErrorToast('No se pudo renovar la sesion actual.');
            return of(DashboardAdminActions.loadDashboardAdminAuth());
          })
        )
      )
    )
  );

  logoutAllSessions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.logoutAllDashboardAdminSessions),
      mergeMap(() =>
        this.dashboardAdminService.logoutAllSessions().pipe(
          map(() => {
            this.showSuccessToast('Se cerraron todas las sesiones activas.');
            return DashboardAdminActions.loadDashboardAdminAuth();
          }),
          catchError(() => {
            this.showErrorToast('No se pudieron cerrar todas las sesiones.');
            return of(DashboardAdminActions.loadDashboardAdminAuth());
          })
        )
      )
    )
  );

  loadMantenimientos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminMantenimientos),
      mergeMap(() =>
        this.dashboardAdminService.loadMantenimientos().pipe(
          map((mantenimientos) => DashboardAdminActions.loadDashboardAdminMantenimientosSuccess({ mantenimientos })),
          catchError(() =>
            of(DashboardAdminActions.loadDashboardAdminMantenimientosFailure({ error: 'No se pudieron cargar los mantenimientos.' }))
          )
        )
      )
    )
  );

  loadReservas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminReservas),
      mergeMap(({ fecha }) =>
        this.dashboardAdminService.loadReservas(fecha).pipe(
          map((reservas) => DashboardAdminActions.loadDashboardAdminReservasSuccess({ reservas })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminReservasFailure({ error: 'No se pudieron cargar las reservas.' })))
        )
      )
    )
  );

  createPista$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.createDashboardAdminPista),
      mergeMap(({ request }) =>
        this.dashboardAdminService.createPista(request).pipe(
          map(() => {
            this.showSuccessToast('Pista creada correctamente.');
            return DashboardAdminActions.loadDashboardAdminPistas({ pageNumber: 1, pageSize: 10 });
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminPistaFailure({ error: 'No se pudo crear la pista.' })))
        )
      )
    )
  );

  updatePista$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.updateDashboardAdminPista),
      mergeMap(({ slug, request }) =>
        this.dashboardAdminService.updatePista(slug, request).pipe(
          map(() => {
            this.showSuccessToast('Pista actualizada correctamente.');
            return DashboardAdminActions.loadDashboardAdminPistas({ pageNumber: 1, pageSize: 10 });
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminPistaFailure({ error: 'No se pudo actualizar la pista.' })))
        )
      )
    )
  );

  togglePista$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.toggleDashboardAdminPista),
      mergeMap(({ slug, request }) =>
        this.dashboardAdminService.togglePista(slug, request).pipe(
          map(() => {
            this.showSuccessToast(request.isActive ? 'Pista activada.' : 'Pista desactivada.');
            return DashboardAdminActions.loadDashboardAdminPistas({ pageNumber: 1, pageSize: 10 });
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminPistaFailure({ error: 'No se pudo cambiar el estado de la pista.' })))
        )
      )
    )
  );

  cancelReserva$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.cancelDashboardAdminReserva),
      mergeMap(({ publicId }) =>
        this.dashboardAdminService.cancelReserva(publicId).pipe(
          map(() => {
            this.showSuccessToast('Reserva cancelada correctamente.');
            return DashboardAdminActions.loadDashboardAdminReservas({});
          }),
          catchError(() =>
            of(DashboardAdminActions.mutateDashboardAdminReservaFailure({ error: 'No se pudo cancelar la reserva.' }))
          )
        )
      )
    )
  );

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminProfile),
      mergeMap(({ username }) =>
        this.dashboardAdminService.loadProfileByUsername(username).pipe(
          map((profile) => DashboardAdminActions.loadDashboardAdminProfileSuccess({ profile })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminProfileFailure({ error: 'No se pudo cargar el perfil.' })))
        )
      )
    )
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.loadDashboardAdminUser),
      mergeMap(() =>
        this.dashboardAdminService.loadCurrentUser().pipe(
          map((user) => DashboardAdminActions.loadDashboardAdminUserSuccess({ user })),
          catchError(() => of(DashboardAdminActions.loadDashboardAdminUserFailure({ error: 'No se pudo cargar el usuario actual.' })))
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.updateDashboardAdminUser),
      mergeMap(({ request }) =>
        this.dashboardAdminService.updateCurrentUser(request).pipe(
          map((user) => {
            this.showSuccessToast('Usuario actualizado correctamente.');
            return DashboardAdminActions.loadDashboardAdminUserSuccess({ user });
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminUserFailure({ error: 'No se pudo actualizar el usuario.' })))
        )
      )
    )
  );

  createDeporte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.createDashboardAdminDeporte),
      mergeMap(({ request }) =>
        this.dashboardAdminService.createDeporte(request).pipe(
          map(() => {
            this.showSuccessToast('Deporte creado correctamente.');
            return DashboardAdminActions.loadDashboardAdminDeportes();
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminDeporteFailure({ error: 'No se pudo crear el deporte.' })))
        )
      )
    )
  );

  updateDeporte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.updateDashboardAdminDeporte),
      mergeMap(({ slug, request }) =>
        this.dashboardAdminService.updateDeporte(slug, request).pipe(
          map(() => {
            this.showSuccessToast('Deporte actualizado correctamente.');
            return DashboardAdminActions.loadDashboardAdminDeportes();
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminDeporteFailure({ error: 'No se pudo actualizar el deporte.' })))
        )
      )
    )
  );

  toggleDeporte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardAdminActions.toggleDashboardAdminDeporte),
      mergeMap(({ slug, request }) =>
        this.dashboardAdminService.toggleDeporte(slug, request).pipe(
          map(() => {
            this.showSuccessToast(request.isActive ? 'Deporte activado.' : 'Deporte desactivado.');
            return DashboardAdminActions.loadDashboardAdminDeportes();
          }),
          catchError(() => of(DashboardAdminActions.mutateDashboardAdminDeporteFailure({ error: 'No se pudo cambiar el estado del deporte.' })))
        )
      )
    )
  );

  mutateDeporteFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardAdminActions.mutateDashboardAdminDeporteFailure),
        map(({ error }) => this.showErrorToast(error))
      ),
    { dispatch: false }
  );

  mutateReservaFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardAdminActions.mutateDashboardAdminReservaFailure),
        map(({ error }) => this.showErrorToast(error))
      ),
    { dispatch: false }
  );

  mutateUserFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardAdminActions.mutateDashboardAdminUserFailure),
        map(({ error }) => this.showErrorToast(error))
      ),
    { dispatch: false }
  );

  mutatePistaFailureToast$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(DashboardAdminActions.mutateDashboardAdminPistaFailure),
        map(({ error }) => this.showErrorToast(error))
      ),
    { dispatch: false }
  );

  private showSuccessToast(message: string): void {
    const palette = this.getToastPalette();

    void Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2400,
      timerProgressBar: true,
      icon: 'success',
      title: message,
      background: palette.background,
      color: palette.color
    });
  }

  private showErrorToast(message: string): void {
    const palette = this.getToastPalette();

    void Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2800,
      timerProgressBar: true,
      icon: 'error',
      title: message,
      background: palette.background,
      color: palette.color
    });
  }

  private getToastPalette(): { background: string; color: string } {
    const isDark = document?.documentElement?.classList.contains('dark') ?? false;

    return isDark
      ? { background: '#1D3557', color: '#F1FAEE' }
      : { background: '#FFFFFF', color: '#1D3557' };
  }
}
