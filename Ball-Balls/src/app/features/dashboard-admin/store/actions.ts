import { createAction, props } from '@ngrx/store';
import { DashboardAdminStats } from '../dashboard-admin.interface';
import { DashboardAdminDeportesData } from '../dashboard-admin.interface';
import { DashboardAdminAuthData, DashboardAdminPistasData } from '../dashboard-admin.interface';
import { DashboardAdminMantenimientosData, DashboardAdminReservasData } from '../dashboard-admin.interface';
import { DashboardAdminProfileData, DashboardAdminUserData } from '../dashboard-admin.interface';
import {
  CreateDeporteRequest,
  SoftDeleteDeporteRequest,
  UpdateDeporteRequest
} from '../../../core/interfaces/Deportes/DeportesRequests.Interface';
import {
  CreatePistaRequest,
  SoftDeletePistaRequest,
  UpdatePistaRequest
} from '../../../core/interfaces/Pistas/PistasRequests.Interface';
import { UpdateUserRequest } from '../../../core/interfaces/Users/UserRequest.interface';

export const loadDashboardAdminStats = createAction('[Dashboard Admin] Load Stats');

export const loadDashboardAdminStatsSuccess = createAction(
  '[Dashboard Admin] Load Stats Success',
  props<{ stats: DashboardAdminStats }>()
);

export const loadDashboardAdminStatsFailure = createAction(
  '[Dashboard Admin] Load Stats Failure',
  props<{ error: string }>()
);

export const loadDashboardAdminDeportes = createAction('[Dashboard Admin] Load Deportes');

export const loadDashboardAdminDeportesSuccess = createAction(
  '[Dashboard Admin] Load Deportes Success',
  props<{ deportes: DashboardAdminDeportesData }>()
);

export const loadDashboardAdminDeportesFailure = createAction(
  '[Dashboard Admin] Load Deportes Failure',
  props<{ error: string }>()
);

export const createDashboardAdminDeporte = createAction(
  '[Dashboard Admin] Create Deporte',
  props<{ request: CreateDeporteRequest }>()
);

export const updateDashboardAdminDeporte = createAction(
  '[Dashboard Admin] Update Deporte',
  props<{ slug: string; request: UpdateDeporteRequest }>()
);

export const toggleDashboardAdminDeporte = createAction(
  '[Dashboard Admin] Toggle Deporte Active',
  props<{ slug: string; request: SoftDeleteDeporteRequest }>()
);

export const mutateDashboardAdminDeporteFailure = createAction(
  '[Dashboard Admin] Mutate Deporte Failure',
  props<{ error: string }>()
);

export const loadDashboardAdminPistas = createAction(
  '[Dashboard Admin] Load Pistas',
  props<{
    pageNumber?: number;
    pageSize?: number;
    Nombre?: string;
    Deporte?: string;
    PrecioMin?: number;
    PrecioMax?: number;
    Disponibilidad?: string;
    Orden?: string;
  }>()
);

export const loadDashboardAdminPistasSuccess = createAction(
  '[Dashboard Admin] Load Pistas Success',
  props<{ pistas: DashboardAdminPistasData }>()
);

export const loadDashboardAdminPistasFailure = createAction(
  '[Dashboard Admin] Load Pistas Failure',
  props<{ error: string }>()
);

export const loadDashboardAdminAuth = createAction('[Dashboard Admin] Load Auth');

export const loadDashboardAdminAuthSuccess = createAction(
  '[Dashboard Admin] Load Auth Success',
  props<{ auth: DashboardAdminAuthData }>()
);

export const loadDashboardAdminAuthFailure = createAction(
  '[Dashboard Admin] Load Auth Failure',
  props<{ error: string }>()
);

export const refreshDashboardAdminSession = createAction('[Dashboard Admin] Refresh Session');
export const logoutAllDashboardAdminSessions = createAction('[Dashboard Admin] Logout All Sessions');

export const loadDashboardAdminMantenimientos = createAction('[Dashboard Admin] Load Mantenimientos');

export const loadDashboardAdminMantenimientosSuccess = createAction(
  '[Dashboard Admin] Load Mantenimientos Success',
  props<{ mantenimientos: DashboardAdminMantenimientosData }>()
);

export const loadDashboardAdminMantenimientosFailure = createAction(
  '[Dashboard Admin] Load Mantenimientos Failure',
  props<{ error: string }>()
);

export const loadDashboardAdminReservas = createAction(
  '[Dashboard Admin] Load Reservas',
  props<{ fecha?: string }>()
);

export const loadDashboardAdminReservasSuccess = createAction(
  '[Dashboard Admin] Load Reservas Success',
  props<{ reservas: DashboardAdminReservasData }>()
);

export const loadDashboardAdminReservasFailure = createAction(
  '[Dashboard Admin] Load Reservas Failure',
  props<{ error: string }>()
);

export const cancelDashboardAdminReserva = createAction(
  '[Dashboard Admin] Cancel Reserva',
  props<{ publicId: string }>()
);

export const mutateDashboardAdminReservaFailure = createAction(
  '[Dashboard Admin] Mutate Reserva Failure',
  props<{ error: string }>()
);

export const createDashboardAdminPista = createAction(
  '[Dashboard Admin] Create Pista',
  props<{ request: CreatePistaRequest }>()
);

export const updateDashboardAdminPista = createAction(
  '[Dashboard Admin] Update Pista',
  props<{ slug: string; request: UpdatePistaRequest }>()
);

export const toggleDashboardAdminPista = createAction(
  '[Dashboard Admin] Toggle Pista Active',
  props<{ slug: string; request: SoftDeletePistaRequest }>()
);

export const mutateDashboardAdminPistaFailure = createAction(
  '[Dashboard Admin] Mutate Pista Failure',
  props<{ error: string }>()
);

export const loadDashboardAdminProfile = createAction(
  '[Dashboard Admin] Load Profile',
  props<{ username: string }>()
);

export const loadDashboardAdminProfileSuccess = createAction(
  '[Dashboard Admin] Load Profile Success',
  props<{ profile: DashboardAdminProfileData }>()
);

export const loadDashboardAdminProfileFailure = createAction(
  '[Dashboard Admin] Load Profile Failure',
  props<{ error: string }>()
);

export const loadDashboardAdminUser = createAction('[Dashboard Admin] Load User');

export const loadDashboardAdminUserSuccess = createAction(
  '[Dashboard Admin] Load User Success',
  props<{ user: DashboardAdminUserData }>()
);

export const loadDashboardAdminUserFailure = createAction(
  '[Dashboard Admin] Load User Failure',
  props<{ error: string }>()
);

export const updateDashboardAdminUser = createAction(
  '[Dashboard Admin] Update User',
  props<{ request: UpdateUserRequest }>()
);

export const mutateDashboardAdminUserFailure = createAction(
  '[Dashboard Admin] Mutate User Failure',
  props<{ error: string }>()
);
