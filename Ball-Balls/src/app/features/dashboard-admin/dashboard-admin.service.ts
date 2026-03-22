import { inject, Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { DeportesService } from '../../core/services/deportes.service';
import { MantenimientosService } from '../../core/services/mantenimientos.service';
import { PistasService } from '../../core/services/pistas.service';
import { ReservasService } from '../../core/services/reservas.service';
import { UsersService } from '../../core/services/users.service';
import { DashboardAdminStats } from './dashboard-admin.interface';
import { DashboardAdminDeportesData } from './dashboard-admin.interface';
import { DashboardAdminAuthData, DashboardAdminPistasData } from './dashboard-admin.interface';
import { DashboardAdminMantenimientosData, DashboardAdminReservasData } from './dashboard-admin.interface';
import { DashboardAdminProfileData, DashboardAdminUserData } from './dashboard-admin.interface';
import { PistasQueryParams } from '../../core/interfaces/Pistas/PistasRequests.Interface';
import {
  CreateDeporteRequest,
  SoftDeleteDeporteRequest,
  UpdateDeporteRequest
} from '../../core/interfaces/Deportes/DeportesRequests.Interface';
import {
  CreatePistaRequest,
  SoftDeletePistaRequest,
  UpdatePistaRequest
} from '../../core/interfaces/Pistas/PistasRequests.Interface';
import { ProfilesService } from '../../core/services/profiles.service';
import { UpdateUserRequest } from '../../core/interfaces/Users/UserRequest.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardAdminService {
  private readonly authService = inject(AuthService);
  private readonly deportesService = inject(DeportesService);
  private readonly pistasService = inject(PistasService);
  private readonly mantenimientosService = inject(MantenimientosService);
  private readonly reservasService = inject(ReservasService);
  private readonly usersService = inject(UsersService);
  private readonly profilesService = inject(ProfilesService);

  loadStats(): Observable<DashboardAdminStats> {
    return forkJoin({
      deportes: this.deportesService.getDeportes(),
      pistas: this.pistasService.getPistas({ PageNumber: 1, PageSize: 1 }),
      mantenimientos: this.mantenimientosService.getMantenimientos(),
      reservas: this.reservasService.getReservas(),
      user: this.usersService.getCurrentUser().pipe(catchError(() => of(null)))
    }).pipe(
      map(({ deportes, pistas, mantenimientos, reservas, user }) => ({
        deportesTotal: deportes.total,
        pistasTotal: pistas.totalCount,
        mantenimientosTotal: mantenimientos.total,
        reservasTotal: reservas.total,
        currentUser: user?.username ?? 'admin'
      }))
    );
  }

  loadDeportes(): Observable<DashboardAdminDeportesData> {
    return this.deportesService.getDeportes().pipe(
      map((response) => ({
        items: response.deportes ?? [],
        total: response.total
      }))
    );
  }

  createDeporte(request: CreateDeporteRequest): Observable<unknown> {
    return this.deportesService.createDeporte(request);
  }

  updateDeporte(slug: string, request: UpdateDeporteRequest): Observable<unknown> {
    return this.deportesService.updateDeporte(slug, request);
  }

  toggleDeporte(slug: string, request: SoftDeleteDeporteRequest): Observable<unknown> {
    return this.deportesService.softDeleteDeporte(slug, request);
  }

  loadPistas(params: PistasQueryParams): Observable<DashboardAdminPistasData> {
    return this.pistasService.getPistas(params).pipe(
      map((response) => ({
        items: response.items ?? [],
        total: response.totalCount,
        pageNumber: response.pageNumber,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      }))
    );
  }

  loadAuthData(): Observable<DashboardAdminAuthData> {
    return this.usersService.getCurrentUser().pipe(
      map((user) => ({
        username: user.username,
        email: user.email,
        nombre: user.nombre,
        isAuthenticated: true
      })),
      catchError(() =>
        of({
          username: '-',
          email: '-',
          nombre: '-',
          isAuthenticated: false
        })
      )
    );
  }

  loadMantenimientos(): Observable<DashboardAdminMantenimientosData> {
    return this.mantenimientosService.getMantenimientos().pipe(
      map((response) => ({
        items: response.mantenimientos ?? [],
        total: response.total
      }))
    );
  }

  loadReservas(fecha?: string): Observable<DashboardAdminReservasData> {
    const source$ = fecha ? this.reservasService.getReservasByDate(fecha) : this.reservasService.getReservas();

    return source$.pipe(
      map((response) => ({
        items: response.reservas ?? [],
        total: response.total
      }))
    );
  }

  cancelReserva(publicId: string): Observable<void> {
    return this.reservasService.cancelReserva(publicId);
  }

  createPista(request: CreatePistaRequest): Observable<unknown> {
    return this.pistasService.createPista(request);
  }

  updatePista(slug: string, request: UpdatePistaRequest): Observable<unknown> {
    return this.pistasService.updatePista(slug, request);
  }

  togglePista(slug: string, request: SoftDeletePistaRequest): Observable<unknown> {
    return this.pistasService.softDeletePista(slug, request);
  }

  loadProfileByUsername(username: string): Observable<DashboardAdminProfileData> {
    return this.profilesService.getProfile(username).pipe(
      map((profile) => ({ profile }))
    );
  }

  loadCurrentUser(): Observable<DashboardAdminUserData> {
    return this.usersService.getCurrentUser().pipe(
      map((currentUser) => ({ currentUser }))
    );
  }

  updateCurrentUser(request: UpdateUserRequest): Observable<DashboardAdminUserData> {
    return this.usersService.updateCurrentUser(request).pipe(
      map((currentUser) => ({ currentUser }))
    );
  }

  refreshSession(): Observable<unknown> {
    return this.authService.refresh();
  }

  logoutAllSessions(): Observable<boolean> {
    this.authService.logoutAll();
    return of(true);
  }
}
