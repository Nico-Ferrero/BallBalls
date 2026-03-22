import { Deporte } from '../../core/interfaces/Deportes/Deportes.Interface';
import { Mantenimiento } from '../../core/interfaces/Mantenimientos/Mantenimientos.Interface';
import { Pista } from '../../core/interfaces/Pistas/Pistas.Interface';
import { Reserva } from '../../core/interfaces/Reservas/Reservas.Interface';
import { ProfileResponse } from '../../core/interfaces/Users/ProfileResponse.interface';

export interface DashboardAdminStats {
  deportesTotal: number;
  pistasTotal: number;
  mantenimientosTotal: number;
  reservasTotal: number;
  currentUser: string;
}

export interface DashboardAdminModule {
  name: string;
  endpoints: number;
  route: string;
  summary: string;
  icon: string;
}

export interface DashboardAdminDeportesData {
  items: Deporte[];
  total: number;
}

export interface DashboardAdminPistasData {
  items: Pista[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardAdminPistasFilters {
  Nombre?: string;
  Deporte?: string;
  PrecioMin?: number;
  PrecioMax?: number;
  Disponibilidad?: string;
  Orden?: string;
}

export interface DashboardAdminAuthData {
  username: string;
  email: string;
  nombre: string;
  isAuthenticated: boolean;
}

export interface DashboardAdminMantenimientosData {
  items: Mantenimiento[];
  total: number;
}

export interface DashboardAdminReservasData {
  items: Reserva[];
  total: number;
}

export interface DashboardAdminProfileData {
  profile: ProfileResponse | null;
}

export interface DashboardAdminUserData {
  currentUser: ProfileResponse | null;
}
