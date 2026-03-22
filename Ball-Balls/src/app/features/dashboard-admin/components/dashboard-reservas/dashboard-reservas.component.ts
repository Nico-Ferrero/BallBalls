import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import Swal from 'sweetalert2';
import { cancelDashboardAdminReserva, loadDashboardAdminReservas } from '../../store/actions';
import {
  selectDashboardAdminReservas,
  selectDashboardAdminReservasError,
  selectDashboardAdminReservasLoading
} from '../../store/selectors';
import { Reserva } from '../../../../core/interfaces/Reservas/Reservas.Interface';

interface EstadoOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableModule, ButtonModule, CalendarModule, DropdownModule, FullCalendarModule],
  templateUrl: './dashboard-reservas.component.html',
  styleUrl: './dashboard-reservas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardReservasComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  viewMode: 'list' | 'calendar' = 'calendar';
  first = 0;
  rows = 10;

  readonly filterForm = this.fb.group({
    fecha: [null as Date | null],
    estado: ['']
  });

  readonly reservasData = this.store.selectSignal(selectDashboardAdminReservas);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminReservasLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminReservasError);

  get calendarOptions(): CalendarOptions {
    return {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      buttonText: {
        today: 'Hoy',
        month: 'Mes',
        week: 'Semana',
        day: 'Dia'
      },
      events: this.getFilteredReservas().map((item) => this.toCalendarEvent(item)),
      eventClick: (event) => this.onCalendarEventClick(event),
      height: 700,
      nowIndicator: true
    };
  }

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminReservas({}));
  }

  setViewMode(mode: 'list' | 'calendar'): void {
    this.viewMode = mode;
  }

  reload(): void {
    const fecha = this.toApiDate(this.filterForm.controls.fecha.value);
    this.first = 0;
    this.store.dispatch(loadDashboardAdminReservas({ fecha }));
  }

  applyFilters(): void {
    const fecha = this.toApiDate(this.filterForm.controls.fecha.value);
    this.first = 0;
    this.store.dispatch(loadDashboardAdminReservas({ fecha }));
  }

  clearFilters(): void {
    this.filterForm.reset({ fecha: null, estado: '' });
    this.first = 0;
    this.store.dispatch(loadDashboardAdminReservas({}));
  }

  onPageChange(event: { first: number; rows: number }): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  getFilteredReservas(): Reserva[] {
    const estado = this.filterForm.controls.estado.value?.trim().toLowerCase();
    const items = this.reservasData()?.items ?? [];

    if (!estado) {
      return items;
    }

    return items.filter((item) => (item.estado ?? '').toLowerCase() === estado);
  }

  get estadoOptions(): EstadoOption[] {
    const values =
      this.reservasData()?.items
        .map((item) => item.estado?.trim() ?? '')
        .filter(Boolean) ?? [];

    return Array.from(new Set(values)).map((value) => ({ label: value, value }));
  }

  async cancelReserva(reserva: Reserva): Promise<void> {
    if (!reserva.publicId) {
      return;
    }

    const result = await Swal.fire({
      title: 'Cancelar reserva',
      text: `Se cancelara la reserva ${reserva.publicId}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cancelar reserva',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#E63946'
    });

    if (!result.isConfirmed) {
      return;
    }

    this.store.dispatch(cancelDashboardAdminReserva({ publicId: reserva.publicId }));
  }

  private onCalendarEventClick(eventInfo: EventClickArg): void {
    const reserva = eventInfo.event.extendedProps as Reserva;
    if (!reserva?.publicId) {
      return;
    }

    void this.cancelReserva(reserva);
  }

  private toCalendarEvent(item: Reserva): EventInput {
    const estado = (item.estado ?? '').toLowerCase();
    const color = estado === 'confirmada' ? '#2E7D32' : estado === 'cancelada' ? '#D62828' : '#457B9D';
    const start = item.fechaHoraInicio ? item.fechaHoraInicio.replace(' ', 'T') : undefined;
    const end = item.fechaHoraFin ? item.fechaHoraFin.replace(' ', 'T') : undefined;

    return {
      id: item.publicId ?? `reserva-${item.fechaHoraInicio ?? 'sin-fecha'}-${item.pista ?? 'sin-pista'}`,
      title: `${item.pista ?? 'Pista'} · ${item.usuario ?? 'Usuario'}`,
      ...(start ? { start } : {}),
      ...(end ? { end } : {}),
      backgroundColor: color,
      borderColor: color,
      extendedProps: item
    };
  }

  private toApiDate(value: Date | null): string | undefined {
    if (!value) {
      return undefined;
    }

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
