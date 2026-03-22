import { Component, effect, input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../../../core/services/reservas.service';
import { Reserva, ReservasResponse } from '../../../../core/interfaces/Reservas/Reservas.Interface';

@Component({
  selector: 'app-profile-reservas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-reservas.component.html'
})
export class ProfileReservasComponent {
  profile = input<any>();
  
  private reservasService = inject(ReservasService);
  
  reservas = signal<Reserva[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const userProfile = this.profile();
      // Solo cargar si no estamos ya cargando y si existe el perfil con ID
      if (userProfile && userProfile.id) {
        this.cargarReservas(userProfile.id);
      } else if (!userProfile) {
        // Podría estar cargando todavía el perfil
        this.isLoading.set(true);
      } else {
        this.error.set('No se encontró el ID de usuario.');
        this.isLoading.set(false);
      }
    }, { allowSignalWrites: true });
  }

  cargarReservas(userId: string) {
    this.isLoading.set(true);
    this.reservasService.getReservasByUsuario(userId).subscribe({
      next: (response: ReservasResponse) => {
        this.reservas.set(response.reservas);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Error cargando reservas', err);
        this.error.set('No se pudieron cargar tus reservas.');
        this.isLoading.set(false);
      }
    });
  }
}
