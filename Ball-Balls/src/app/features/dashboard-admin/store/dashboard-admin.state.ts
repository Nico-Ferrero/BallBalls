import { DashboardAdminStats } from '../dashboard-admin.interface';
import { DashboardAdminDeportesData } from '../dashboard-admin.interface';
import { DashboardAdminAuthData, DashboardAdminPistasData } from '../dashboard-admin.interface';
import { DashboardAdminMantenimientosData, DashboardAdminReservasData } from '../dashboard-admin.interface';
import { DashboardAdminProfileData, DashboardAdminUserData } from '../dashboard-admin.interface';

export interface DashboardAdminState {
  stats: DashboardAdminStats | null;
  deportes: DashboardAdminDeportesData | null;
  pistas: DashboardAdminPistasData | null;
  auth: DashboardAdminAuthData | null;
  mantenimientos: DashboardAdminMantenimientosData | null;
  reservas: DashboardAdminReservasData | null;
  profile: DashboardAdminProfileData | null;
  user: DashboardAdminUserData | null;
  isStatsLoading: boolean;
  isDeportesLoading: boolean;
  isPistasLoading: boolean;
  isAuthLoading: boolean;
  isMantenimientosLoading: boolean;
  isReservasLoading: boolean;
  isProfileLoading: boolean;
  isUserLoading: boolean;
  statsError: string | null;
  deportesError: string | null;
  pistasError: string | null;
  authError: string | null;
  mantenimientosError: string | null;
  reservasError: string | null;
  profileError: string | null;
  userError: string | null;
}

export const dashboardAdminInitialState: DashboardAdminState = {
  stats: null,
  deportes: null,
  pistas: null,
  auth: null,
  mantenimientos: null,
  reservas: null,
  profile: null,
  user: null,
  isStatsLoading: false,
  isDeportesLoading: false,
  isPistasLoading: false,
  isAuthLoading: false,
  isMantenimientosLoading: false,
  isReservasLoading: false,
  isProfileLoading: false,
  isUserLoading: false,
  statsError: null,
  deportesError: null,
  pistasError: null,
  authError: null,
  mantenimientosError: null,
  reservasError: null,
  profileError: null,
  userError: null
};
