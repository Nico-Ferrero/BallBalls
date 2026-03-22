import { createReducer, on } from '@ngrx/store';
import * as DashboardAdminActions from './actions';
import { DashboardAdminState, dashboardAdminInitialState } from './dashboard-admin.state';

export const dashboardAdminReducer = createReducer<DashboardAdminState>(
  dashboardAdminInitialState,
  on(DashboardAdminActions.loadDashboardAdminStats, (state) => ({
    ...state,
    isStatsLoading: true,
    statsError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminStatsSuccess, (state, { stats }) => ({
    ...state,
    stats,
    isStatsLoading: false,
    statsError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminStatsFailure, (state, { error }) => ({
    ...state,
    isStatsLoading: false,
    statsError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminDeportes, (state) => ({
    ...state,
    isDeportesLoading: true,
    deportesError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminDeportesSuccess, (state, { deportes }) => ({
    ...state,
    deportes,
    isDeportesLoading: false,
    deportesError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminDeportesFailure, (state, { error }) => ({
    ...state,
    isDeportesLoading: false,
    deportesError: error
  })),
  on(DashboardAdminActions.mutateDashboardAdminDeporteFailure, (state, { error }) => ({
    ...state,
    isDeportesLoading: false,
    deportesError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminPistas, (state) => ({
    ...state,
    isPistasLoading: true,
    pistasError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminPistasSuccess, (state, { pistas }) => ({
    ...state,
    pistas,
    isPistasLoading: false,
    pistasError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminPistasFailure, (state, { error }) => ({
    ...state,
    isPistasLoading: false,
    pistasError: error
  })),
  on(DashboardAdminActions.mutateDashboardAdminPistaFailure, (state, { error }) => ({
    ...state,
    isPistasLoading: false,
    pistasError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminAuth, (state) => ({
    ...state,
    isAuthLoading: true,
    authError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminAuthSuccess, (state, { auth }) => ({
    ...state,
    auth,
    isAuthLoading: false,
    authError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminAuthFailure, (state, { error }) => ({
    ...state,
    isAuthLoading: false,
    authError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminMantenimientos, (state) => ({
    ...state,
    isMantenimientosLoading: true,
    mantenimientosError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminMantenimientosSuccess, (state, { mantenimientos }) => ({
    ...state,
    mantenimientos,
    isMantenimientosLoading: false,
    mantenimientosError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminMantenimientosFailure, (state, { error }) => ({
    ...state,
    isMantenimientosLoading: false,
    mantenimientosError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminReservas, (state) => ({
    ...state,
    isReservasLoading: true,
    reservasError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminReservasSuccess, (state, { reservas }) => ({
    ...state,
    reservas,
    isReservasLoading: false,
    reservasError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminReservasFailure, (state, { error }) => ({
    ...state,
    isReservasLoading: false,
    reservasError: error
  })),
  on(DashboardAdminActions.mutateDashboardAdminReservaFailure, (state, { error }) => ({
    ...state,
    isReservasLoading: false,
    reservasError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminProfile, (state) => ({
    ...state,
    isProfileLoading: true,
    profileError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    isProfileLoading: false,
    profileError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminProfileFailure, (state, { error }) => ({
    ...state,
    isProfileLoading: false,
    profileError: error
  })),
  on(DashboardAdminActions.loadDashboardAdminUser, (state) => ({
    ...state,
    isUserLoading: true,
    userError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isUserLoading: false,
    userError: null
  })),
  on(DashboardAdminActions.loadDashboardAdminUserFailure, (state, { error }) => ({
    ...state,
    isUserLoading: false,
    userError: error
  })),
  on(DashboardAdminActions.mutateDashboardAdminUserFailure, (state, { error }) => ({
    ...state,
    isUserLoading: false,
    userError: error
  }))
);
