import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardAdminState } from './dashboard-admin.state';

export const selectDashboardAdminState = createFeatureSelector<DashboardAdminState>('dashboardAdmin');

export const selectDashboardAdminStats = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.stats
);

export const selectDashboardAdminStatsLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isStatsLoading
);

export const selectDashboardAdminStatsError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.statsError
);

export const selectDashboardAdminDeportes = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.deportes
);

export const selectDashboardAdminDeportesLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isDeportesLoading
);

export const selectDashboardAdminDeportesError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.deportesError
);

export const selectDashboardAdminPistas = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.pistas
);

export const selectDashboardAdminPistasLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isPistasLoading
);

export const selectDashboardAdminPistasError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.pistasError
);

export const selectDashboardAdminAuth = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.auth
);

export const selectDashboardAdminAuthLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isAuthLoading
);

export const selectDashboardAdminAuthError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.authError
);

export const selectDashboardAdminMantenimientos = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.mantenimientos
);

export const selectDashboardAdminMantenimientosLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isMantenimientosLoading
);

export const selectDashboardAdminMantenimientosError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.mantenimientosError
);

export const selectDashboardAdminReservas = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.reservas
);

export const selectDashboardAdminReservasLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isReservasLoading
);

export const selectDashboardAdminReservasError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.reservasError
);

export const selectDashboardAdminProfile = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.profile
);

export const selectDashboardAdminProfileLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isProfileLoading
);

export const selectDashboardAdminProfileError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.profileError
);

export const selectDashboardAdminUser = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.user
);

export const selectDashboardAdminUserLoading = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.isUserLoading
);

export const selectDashboardAdminUserError = createSelector(
  selectDashboardAdminState,
  (state: DashboardAdminState) => state.userError
);
