import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SkeletonModule } from 'primeng/skeleton';
import Swal from 'sweetalert2';

import { LucideAngularModule, Calendar, MapPin, Activity, ArrowRight, Inbox } from 'lucide-angular';

import { selectCurrentUser } from '../auth/store/selectors';
import { ProfilesService } from '../../core/services/profiles.service';
import { ReservasService } from '../../core/services/reservas.service';
import { PistasService } from '../../core/services/pistas.service';
import { Reserva, ReservasResponse } from '../../core/interfaces/Reservas/Reservas.Interface';
import { ProfileResponse } from '../../core/interfaces/Users/ProfileResponse.interface';
import { cancelReserva, cancelReservaSuccess } from '../profile/store/actions';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonModule, LucideAngularModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private profilesService = inject(ProfilesService);
  private reservasService = inject(ReservasService);
  private pistasService = inject(PistasService);

  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Activity = Activity;
  readonly ArrowRight = ArrowRight;
  readonly Inbox = Inbox;

  currentUser = this.store.selectSignal(selectCurrentUser);

  profile = signal<ProfileResponse | null>(null);
  reservas = signal<Reserva[]>([]);
  pistaNames = signal<Record<string, string>>({});
  isLoading = signal(true);
  error = signal<string | null>(null);
  cancellingId = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.currentUser();
    if (!user?.username) {
      this.error.set('Debes iniciar sesión para ver tus reservas.');
      this.isLoading.set(false);
      return;
    }

    this.profilesService.getProfile(user.username).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.cargarReservas(profile.id);
      },
      error: () => {
        this.error.set('No se pudo cargar tu perfil.');
        this.isLoading.set(false);
      }
    });

    this.actions$.pipe(ofType(cancelReservaSuccess)).subscribe(({ publicId }) => {
      this.cancellingId.set(null);
      this.reservas.update(lista =>
        lista.map(r => r.publicId === publicId ? { ...r, estado: 'CANCELLED' } : r)
      );
    });
  }

  private cargarReservas(userId: string) {
    this.isLoading.set(true);
    this.reservasService.getReservasByUsuario(userId).subscribe({
      next: (response: ReservasResponse) => {
        this.reservas.set(response.reservas);
        this.isLoading.set(false);
        this.resolvePistaNames(response.reservas);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus reservas.');
        this.isLoading.set(false);
      }
    });
  }

  private resolvePistaNames(reservas: Reserva[]) {
    const ids = Array.from(new Set(
      reservas.map(r => r.pista).filter((p): p is string => !!p)
    ));
    if (ids.length === 0) return;

    const lookups = ids.map(id =>
      this.pistasService.getPistaById(id).pipe(
        map(pista => ({ id, nombre: pista.nombre ?? id, slug: pista.slug ?? id })),
        catchError(() => of({ id, nombre: id, slug: id }))
      )
    );

    forkJoin(lookups).subscribe(results => {
      const map: Record<string, string> = {};
      const slugs: Record<string, string> = {};
      for (const r of results) {
        map[r.id] = r.nombre;
        slugs[r.id] = r.slug;
      }
      this.pistaNames.set(map);
      this.pistaSlugs.set(slugs);
    });
  }

  pistaSlugs = signal<Record<string, string>>({});

  getPistaNombre(pista: string | null | undefined): string {
    if (!pista) return 'No identificada';
    return this.pistaNames()[pista] ?? pista;
  }

  getPistaSlug(pista: string | null | undefined): string | null {
    if (!pista) return null;
    return this.pistaSlugs()[pista] ?? null;
  }

  isUpcoming(reserva: Reserva): boolean {
    if (!reserva.fechaHoraInicio) return false;
    const estado = (reserva.estado ?? '').toUpperCase();
    if (estado === 'CANCELLED') return false;
    return new Date(reserva.fechaHoraInicio).getTime() >= Date.now();
  }

  upcomingReservas() {
    return this.reservas()
      .filter(r => this.isUpcoming(r))
      .sort((a, b) => new Date(a.fechaHoraInicio ?? 0).getTime() - new Date(b.fechaHoraInicio ?? 0).getTime());
  }

  pastReservas() {
    return this.reservas()
      .filter(r => !this.isUpcoming(r))
      .sort((a, b) => new Date(b.fechaHoraInicio ?? 0).getTime() - new Date(a.fechaHoraInicio ?? 0).getTime());
  }

  totalGastado(): number {
    return this.reservas()
      .filter(r => (r.estado ?? '').toUpperCase() === 'PAID')
      .reduce((acc, r) => acc + (r.precioTotal ?? 0), 0);
  }

  onCancelarReserva(publicId: string) {
    Swal.fire({
      title: '¿Cancelar esta reserva?',
      text: 'Si el pago fue completado, se procesará el reembolso automáticamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar reserva',
      cancelButtonText: 'Volver',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#1e1e2d',
      color: '#fff'
    }).then(result => {
      if (result.isConfirmed) {
        this.cancellingId.set(publicId);
        this.store.dispatch(cancelReserva({ publicId }));
      }
    });
  }

  estadoBadgeClass(estado: string | null | undefined): string {
    const n = (estado ?? '').toUpperCase();
    if (n === 'PAID') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    if (n === 'PENDING') return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    if (n === 'CANCELLED') return 'bg-red-500/10 text-red-600 border-red-500/20';
    return 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border-color)]';
  }

  estadoLabel(estado: string | null | undefined): string {
    const n = (estado ?? '').toUpperCase();
    if (n === 'PAID') return 'Pagada';
    if (n === 'PENDING') return 'Pendiente';
    if (n === 'CANCELLED') return 'Cancelada';
    return n || 'Desconocido';
  }
}
