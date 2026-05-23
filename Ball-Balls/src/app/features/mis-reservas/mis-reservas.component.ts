import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';

import { LucideAngularModule, Calendar, MapPin, Activity, ArrowRight, Inbox } from 'lucide-angular';

import { selectCurrentUser } from '../auth/store/selectors';
import { ProfilesService } from '../../core/services/profiles.service';
import { ReservasService } from '../../core/services/reservas.service';
import { PistasService } from '../../core/services/pistas.service';
import { AiSuggestionsService } from '../../core/services/ai-suggestions.service';
import { Reserva, ReservasResponse } from '../../core/interfaces/Reservas/Reservas.Interface';
import { Pista } from '../../core/interfaces/Pistas/Pistas.Interface';
import { ProfileResponse } from '../../core/interfaces/Users/ProfileResponse.interface';
import { cancelReserva, cancelReservaSuccess } from '../profile/store/actions';

interface PistaInfo {
  nombre: string;
  slug: string | null;
}

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonModule, DialogModule, LucideAngularModule],
  templateUrl: './mis-reservas.component.html',
  styleUrls: ['./mis-reservas.component.css']
})
export class MisReservasComponent implements OnInit {
  private store = inject(Store);
  private actions$ = inject(Actions);
  private profilesService = inject(ProfilesService);
  private reservasService = inject(ReservasService);
  private pistasService = inject(PistasService);
  readonly aiService = inject(AiSuggestionsService);

  readonly Calendar = Calendar;
  readonly MapPin = MapPin;
  readonly Activity = Activity;
  readonly ArrowRight = ArrowRight;
  readonly Inbox = Inbox;

  currentUser = this.store.selectSignal(selectCurrentUser);

  profile = signal<ProfileResponse | null>(null);
  reservas = signal<Reserva[]>([]);
  pistaIndex = signal<Record<string, PistaInfo>>({});
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

    this.loadPistaIndex();

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
        this.aiService.loadSuggestions(response.reservas);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus reservas.');
        this.isLoading.set(false);
      }
    });
  }

  private loadPistaIndex() {
    this.pistasService.getPistas({ PageSize: 1000 }).subscribe({
      next: (response) => {
        const map: Record<string, PistaInfo> = {};
        for (const p of response.items as Pista[]) {
          const nombre = p.nombre ?? p.slug ?? 'Pista';
          const slug = p.slug ?? null;
          if (p.id) map[p.id] = { nombre, slug };
          if (p.slug) map[p.slug] = { nombre, slug };
        }
        this.pistaIndex.set(map);
      },
      error: () => { /* fall back to UUID display */ }
    });
  }

  getPistaNombre(pista: string | null | undefined): string {
    if (!pista) return 'No identificada';
    return this.pistaIndex()[pista]?.nombre ?? pista;
  }

  getPistaSlug(pista: string | null | undefined): string | null {
    if (!pista) return null;
    return this.pistaIndex()[pista]?.slug ?? null;
  }

  /** Puente p-dialog [(visible)] ↔ AiSuggestionsService signal */
  get dialogVisibleValue() { return this.aiService.dialogOpen(); }
  set dialogVisibleValue(val: boolean) { val ? this.aiService.openDialog() : this.aiService.closeDialog(); }

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

  getSuggestionStatusClass(estado: string | null | undefined): string {
    if (!estado) return 'badge-available';
    const n = estado.toLowerCase();
    if (n === 'ocupada') return 'badge-occupied';
    if (n === 'mantenimiento') return 'badge-maintenance';
    return 'badge-available';
  }

  getSuggestionStatusLabel(estado: string | null | undefined): string {
    if (!estado) return 'Disponible';
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  }
}
