import { Component, effect, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ReservasService } from '../../../../core/services/reservas.service';
import { PistasService } from '../../../../core/services/pistas.service';
import { Reserva, ReservasResponse } from '../../../../core/interfaces/Reservas/Reservas.Interface';
import { Pista } from '../../../../core/interfaces/Pistas/Pistas.Interface';
import { cancelReserva, cancelReservaSuccess } from '../../store/actions';
import Swal from 'sweetalert2';

interface PistaInfo {
  nombre: string;
  slug: string | null;
}

@Component({
  selector: 'app-profile-reservas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile-reservas.component.html',
  styleUrl: './profile-reservas.component.css'
})
export class ProfileReservasComponent {
  profile = input<any>();

  private reservasService = inject(ReservasService);
  private pistasService   = inject(PistasService);
  private store           = inject(Store);
  private actions$        = inject(Actions);

  reservas    = signal<Reserva[]>([]);
  pistaIndex  = signal<Record<string, PistaInfo>>({});
  isLoading   = signal(true);
  error       = signal<string | null>(null);
  cancellingId = signal<string | null>(null);

  constructor() {
    this.loadPistaIndex();

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
}
