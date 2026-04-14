import { Component, effect, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { DialogModule } from 'primeng/dialog';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva, ReservasResponse } from '../../../../core/interfaces/Reservas/Reservas.Interface';
import { AiSuggestionsService } from '../../../../core/services/ai-suggestions.service';
import { cancelReserva, cancelReservaSuccess } from '../../store/actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink, DialogModule],
  templateUrl: './profile-reservas.component.html',
  styleUrl: './profile-reservas.component.css'
})
export class ProfileReservasComponent {
  profile = input<any>();

  private reservasService = inject(ReservasService);
  readonly aiService      = inject(AiSuggestionsService);
  private store           = inject(Store);
  private actions$        = inject(Actions);

  // Historial
  reservas    = signal<Reserva[]>([]);
  isLoading   = signal(true);
  error       = signal<string | null>(null);
  cancellingId = signal<string | null>(null);

  constructor() {
    effect(() => {
      const userProfile = this.profile();
      if (userProfile && userProfile.id) {
        this.cargarReservas(userProfile.id);
      } else if (!userProfile) {
        this.isLoading.set(true);
      } else {
        this.error.set('No se encontró el ID de usuario.');
        this.isLoading.set(false);
      }
    }, { allowSignalWrites: true });

    this.actions$.pipe(ofType(cancelReservaSuccess)).subscribe(({ publicId }) => {
      this.cancellingId.set(null);
      this.reservas.update(lista =>
        lista.map(r => r.publicId === publicId ? { ...r, estado: 'CANCELLED' } : r)
      );
    });
  }

  cargarReservas(userId: string) {
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

  /** Puente p-dialog [(visible)] ↔ AiSuggestionsService signal */
  get dialogVisibleValue() { return this.aiService.dialogOpen(); }
  set dialogVisibleValue(val: boolean) { val ? this.aiService.openDialog() : this.aiService.closeDialog(); }

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
      color: '#fff',
    }).then(result => {
      if (result.isConfirmed) {
        this.cancellingId.set(publicId);
        this.store.dispatch(cancelReserva({ publicId }));
      }
    });
  }

  getStatusClass(estado: string | null | undefined): string {
    if (!estado) return 'badge-available';
    const n = estado.toLowerCase();
    if (n === 'ocupada')       return 'badge-occupied';
    if (n === 'mantenimiento') return 'badge-maintenance';
    return 'badge-available';
  }

  getStatusLabel(estado: string | null | undefined): string {
    if (!estado) return 'Disponible';
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  }
}
