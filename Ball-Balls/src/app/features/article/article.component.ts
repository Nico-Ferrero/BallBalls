import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { PistasService } from '../../core/services/pistas.service';
import { ReservasService } from '../../core/services/reservas.service';
import { Pista } from '../../core/interfaces/Pistas/Pistas.Interface';
import { CreateReservaRequest } from '../../core/interfaces/Reservas/ReservasRequests.Interface';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { DividerModule } from 'primeng/divider';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';

// Lucide Icons
import { LucideAngularModule, ArrowLeft, Calendar, Euro, Clock, MapPin, Activity, CheckCircle2, ShieldCheck, Star } from 'lucide-angular';
import { Stripe, StripeElements, StripePaymentElement, loadStripe } from '@stripe/stripe-js';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    RouterLink,
    FormsModule,
    ButtonModule,
    CardModule,
    ChipModule,
    BadgeModule,
    DividerModule,
    SkeletonModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    ProgressBarModule,
    LucideAngularModule
  ],
  templateUrl: './article.component.html',
  styleUrl: './article.component.css'
})
export class ArticleComponent implements OnInit {
  // Iconos
  readonly ArrowLeft = ArrowLeft;
  readonly Calendar = Calendar;
  readonly Euro = Euro;
  readonly Clock = Clock;
  readonly MapPin = MapPin;
  readonly Activity = Activity;
  readonly CheckCircle2 = CheckCircle2;
  readonly ShieldCheck = ShieldCheck;
  readonly Star = Star;

  private readonly route = inject(ActivatedRoute);
  private readonly pistasService = inject(PistasService);
  private readonly reservasService = inject(ReservasService);

  // Estados de Reserva
  fechaSeleccionada: Date | null = new Date();
  slotsSeleccionados: any[] = [];
  hoy: Date = new Date();
  slotsDisponibles: any[] = [];

  mostrarDialogoReserva = false;
  isSubmittingReserva = false;
  isLoadingSlots = false;

  // Estados de Pista
  pista: Pista | null = null;
  isLoading = true;
  error: string | null = null;

  // Stripe state
  stripe: Stripe | null = null;
  stripeElements: StripeElements | null = null;
  paymentElement: StripePaymentElement | null = null;
  clientSecret: string | null = null;
  mostrandoPago = false;
  isProcessingPayment = false;

  async ngOnInit(): Promise<void> {
    this.generarSlotsBase();
    this.stripe = await loadStripe('pk_test_51SUk4KQ3zmGQt5EBckMmmy6QZWk5hV4NF1wwpPKX5AH9B4ANk5NBIfAAeC6ENDtYbWkh707CKaDqvKX79WA1lPjn00s1m4b1C0');

    // Obtenemos el parámetro 'slug' de la ruta activa y consultamos el servicio
    this.route.paramMap.pipe(
      map(params => params.get('slug')),
      switchMap(slug => {
        this.isLoading = true;
        this.error = null;
        if (!slug) {
          throw new Error('No se proporcionó el slug de la pista.');
        }
        return this.pistasService.getPistaById(slug);
      })
    ).subscribe({
      next: (data) => {
        this.pista = data;
        this.isLoading = false;
        // Automatically fetch for today
        this.buscarReservasPorFecha();
      },
      error: (err) => {
        console.error('Error al cargar la pista:', err);
        this.error = 'No se pudo cargar la información de la pista. ' + (err.message || '');
        this.isLoading = false;
      }
    });
  }

  // Helper para clases de estado (disponible, ocupada, mantenimiento)
  getStatusSeverity(estado: string | null): "success" | "danger" | "warning" | "info" {
    if (!estado) return 'success';
    const normalized = estado.toLowerCase();
    if (normalized === 'ocupada') return 'danger';
    if (normalized === 'mantenimiento') return 'warning';
    return 'success';
  }

  // Capitalizar la primera letra del estado
  getStatusLabel(estado: string | null): string {
    if (!estado) return 'Disponible';
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  }

  generarSlotsBase() {
    this.slotsDisponibles = [];
    // Generar slots de 1 hora entre las 09:00 y las 21:00 (último slot 20:00-21:00)
    for (let i = 9; i <= 20; i++) {
      const inicio = i.toString().padStart(2, '0') + ':00';
      const fin = (i + 1).toString().padStart(2, '0') + ':00';
      this.slotsDisponibles.push({
        inicio,
        fin,
        label: `${inicio} - ${fin}`,
        disabled: false
      });
    }
  }

  buscarReservasPorFecha() {
    if (!this.fechaSeleccionada || !this.pista) return;

    this.isLoadingSlots = true;
    function pad(n: number) { return n < 10 ? '0' + n : n }
    const isoDate = this.fechaSeleccionada.getFullYear() + '-' + pad(this.fechaSeleccionada.getMonth() + 1) + '-' + pad(this.fechaSeleccionada.getDate());

    this.slotsSeleccionados = [];
    this.generarSlotsBase();

    this.reservasService.getReservasByPista(this.pista.slug!).subscribe({
      next: (response) => {
        const reservasPistaDia = response.reservas.filter(r =>
          r.fechaHoraInicio && r.fechaHoraInicio.startsWith(isoDate) && ['paid', 'pending'].includes(r.estado?.toLowerCase() || '')
        );

        reservasPistaDia.forEach(r => {
          // Extraemos hora inicio y fin de las propiedades que devuelva tu dto
          const rawHora = (r as any).horaInicio || (r as any).fechaHoraInicio;
          if (rawHora) {
            const horaOcupadaStr = rawHora.includes('T') ? rawHora.split('T')[1].substring(0, 5) : rawHora.substring(0, 5);
            const slot = this.slotsDisponibles.find(s => s.inicio === horaOcupadaStr);
            if (slot) {
              slot.disabled = true;
            }
          }
        });
        this.slotsDisponibles = [...this.slotsDisponibles];
        this.isLoadingSlots = false;
      },
      error: (err) => {
        console.error("No se pudieron cargar reservas reales", err);
        this.isLoadingSlots = false;
      }
    });
  }

  seleccionarSlot(slot: any) {
    if (slot.disabled) return;

    const index = this.slotsSeleccionados.findIndex(s => s.inicio === slot.inicio);
    if (index > -1) {
      const temp = [...this.slotsSeleccionados];
      temp.splice(index, 1);
      if (temp.length > 0 && !this.sonContiguos(temp)) {
        this.slotsSeleccionados = [];
      } else {
        this.slotsSeleccionados.splice(index, 1);
      }
    } else {
      const temp = [...this.slotsSeleccionados, slot];
      temp.sort((a, b) => a.inicio.localeCompare(b.inicio));
      if (!this.sonContiguos(temp)) {
        this.slotsSeleccionados = [slot];
      } else {
        this.slotsSeleccionados.push(slot);
        this.slotsSeleccionados.sort((a, b) => a.inicio.localeCompare(b.inicio));
      }
    }
  }

  private sonContiguos(slots: any[]): boolean {
    if (slots.length <= 1) return true;
    for (let i = 0; i < slots.length - 1; i++) {
      if (slots[i].fin !== slots[i + 1].inicio) {
        return false;
      }
    }
    return true;
  }

  get isSlotSeleccionado() {
    return (slot: any) => this.slotsSeleccionados.some(s => s.inicio === slot.inicio);
  }

  get precioTotal() {
    if (!this.pista) return 0;
    return this.pista.precio * this.slotsSeleccionados.length;
  }

  abrirDialogoReserva() {
    this.cerrarModal(); // Hard reset
    this.mostrarDialogoReserva = true;
    if (!this.fechaSeleccionada) {
      this.fechaSeleccionada = new Date();
      this.buscarReservasPorFecha();
    }
  }

  confirmarReserva() {
    if (!this.fechaSeleccionada || this.slotsSeleccionados.length === 0 || !this.pista) return;

    this.isSubmittingReserva = true;
    function pad(n: number) { return n < 10 ? '0' + n : n }
    const isoDate = this.fechaSeleccionada.getFullYear() + '-' + pad(this.fechaSeleccionada.getMonth() + 1) + '-' + pad(this.fechaSeleccionada.getDate());

    const horaInicio = this.slotsSeleccionados[0].inicio;
    const horaFin = this.slotsSeleccionados[this.slotsSeleccionados.length - 1].fin;

    const request: CreateReservaRequest = {
      pista: this.pista.slug,
      fecha: isoDate,
      horaInicio: horaInicio,
      horaFin: horaFin,
      estado: 'PENDING',
      tipo: 'Regular',
      club: 'Default'
    };

    this.reservasService.createPaymentIntent(request).subscribe({
      next: (res) => {
        this.isSubmittingReserva = false;
        this.clientSecret = res.clientSecret;
        this.mostrandoPago = true;

        setTimeout(() => this.initStripeElements(), 0);
      },
      error: (err) => {
        this.isSubmittingReserva = false;
        let msg = 'Error al procesar la reserva';
        if (err.error) {
          msg = err.error.detail || err.error.message || err.error.title || err.message || msg;
        }
        Swal.fire({ icon: 'error', title: 'Error de Reserva', text: msg, confirmButtonColor: '#ef4444' });
      }
    });
  }

  initStripeElements() {
    if (!this.stripe || !this.clientSecret) return;

    this.stripeElements = this.stripe.elements({
      clientSecret: this.clientSecret,
      appearance: { theme: 'stripe' }
    });

    this.paymentElement = this.stripeElements.create('payment');
    this.paymentElement.mount('#payment-element');
  }

  async pagarReserva() {
    if (!this.stripe || !this.stripeElements) return;

    this.isProcessingPayment = true;

    const { error } = await this.stripe.confirmPayment({
      elements: this.stripeElements,
      confirmParams: {
        return_url: window.location.href
      },
      redirect: 'if_required'
    });

    this.isProcessingPayment = false;

    if (error) {
      Swal.fire('Pago Denegado', error.message, 'error');
    } else {
      Swal.fire({
        icon: 'success',
        title: '¡Reserva Confirmada!',
        text: 'Tu pago ha sido procesado exitosamente.',
        confirmButtonColor: '#10b981'
      });
      this.cerrarModal();
      this.fechaSeleccionada = new Date();
      this.slotsSeleccionados = [];
      this.buscarReservasPorFecha();
    }
  }

  cerrarModal() {
    this.mostrarDialogoReserva = false;
    this.mostrandoPago = false;
    this.clientSecret = null;
    if (this.paymentElement) {
      this.paymentElement.destroy();
      this.paymentElement = null;
    }
  }
}
