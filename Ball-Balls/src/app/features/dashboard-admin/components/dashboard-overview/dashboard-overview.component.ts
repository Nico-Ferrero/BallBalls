import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import {
  loadDashboardAdminMantenimientos,
  loadDashboardAdminPistas,
  loadDashboardAdminReservas,
  loadDashboardAdminStats
} from '../../store/actions';
import {
  selectDashboardAdminMantenimientos,
  selectDashboardAdminPistas,
  selectDashboardAdminReservas,
  selectDashboardAdminStats,
  selectDashboardAdminStatsError,
  selectDashboardAdminStatsLoading
} from '../../store/selectors';
import { Reserva } from '../../../../core/interfaces/Reservas/Reservas.Interface';
import { Pista } from '../../../../core/interfaces/Pistas/Pistas.Interface';
import { Mantenimiento } from '../../../../core/interfaces/Mantenimientos/Mantenimientos.Interface';
import { revealOnView } from '../../shared/motion.util';

interface KpiTile {
  key: string;
  label: string;
  value: string;
  delta?: string;
  trend?: 'up' | 'down' | 'flat';
  icon: string;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, ChartModule, ButtonModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardOverviewComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly store = inject(Store);

  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLElement>;
  private stopReveal: () => void = () => undefined;

  readonly stats = this.store.selectSignal(selectDashboardAdminStats);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminStatsLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminStatsError);
  readonly reservas = this.store.selectSignal(selectDashboardAdminReservas);
  readonly pistas = this.store.selectSignal(selectDashboardAdminPistas);
  readonly mantenimientos = this.store.selectSignal(selectDashboardAdminMantenimientos);

  readonly kpis = computed<KpiTile[]>(() => {
    const s = this.stats();
    const reservas = this.reservas()?.items ?? [];
    const pistas = this.pistas()?.items ?? [];
    const mantenimientos = this.mantenimientos()?.items ?? [];

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reservasHoy = reservas.filter((r) => {
      if (!r.fechaHoraInicio) return false;
      const t = new Date(r.fechaHoraInicio).getTime();
      return t >= startOfToday.getTime() && t < startOfTomorrow.getTime();
    }).length;

    const reservasUltimos7 = reservas.filter((r) => {
      if (!r.fechaHoraInicio) return false;
      const t = new Date(r.fechaHoraInicio).getTime();
      return t >= sevenDaysAgo.getTime() && t < startOfTomorrow.getTime();
    }).length;

    const reservasPagadas = reservas.filter((r) => (r.estado ?? '').toUpperCase() === 'PAID');
    const ingresos = reservasPagadas.reduce((acc, r) => acc + (r.precioTotal ?? 0), 0);

    const pistasActivas = pistas.filter((p) => p.isActive).length;
    const mantenimientosActivos = mantenimientos.filter((m) => m.isActive).length;

    return [
      {
        key: 'pistas',
        label: 'Pistas activas',
        value: `${pistasActivas}`,
        delta: `${s?.pistasTotal ?? pistas.length} totales`,
        trend: 'flat',
        icon: 'pi pi-th-large'
      },
      {
        key: 'reservas-hoy',
        label: 'Reservas hoy',
        value: `${reservasHoy}`,
        delta: `${reservasUltimos7} últimos 7 días`,
        trend: reservasHoy > 0 ? 'up' : 'flat',
        icon: 'pi pi-calendar-plus'
      },
      {
        key: 'ingresos',
        label: 'Ingresos confirmados',
        value: this.formatCurrency(ingresos),
        delta: `${reservasPagadas.length} reservas pagadas`,
        trend: ingresos > 0 ? 'up' : 'flat',
        icon: 'pi pi-euro'
      },
      {
        key: 'mantenimientos',
        label: 'Mantenimientos activos',
        value: `${mantenimientosActivos}`,
        delta: `${s?.mantenimientosTotal ?? mantenimientos.length} totales`,
        trend: 'flat',
        icon: 'pi pi-wrench'
      }
    ];
  });

  /** Reservas agrupadas por estado para el doughnut. */
  readonly reservasPorEstado = computed(() => {
    const items = this.reservas()?.items ?? [];
    const groups = new Map<string, number>();
    for (const r of items) {
      const key = (r.estado ?? 'SIN ESTADO').toUpperCase();
      groups.set(key, (groups.get(key) ?? 0) + 1);
    }
    return groups;
  });

  /** Reservas por día (últimos 7 días) para el bar chart. */
  readonly reservasPorDia = computed(() => {
    const items = this.reservas()?.items ?? [];
    const buckets: { label: string; date: Date; count: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      buckets.push({
        label: day.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        date: day,
        count: 0
      });
    }

    for (const r of items) {
      if (!r.fechaHoraInicio) continue;
      const t = new Date(r.fechaHoraInicio);
      t.setHours(0, 0, 0, 0);
      const bucket = buckets.find((b) => b.date.getTime() === t.getTime());
      if (bucket) bucket.count += 1;
    }

    return buckets;
  });

  /** Top 5 pistas por número de reservas. */
  readonly topPistas = computed(() => {
    const reservas = this.reservas()?.items ?? [];
    const counts = new Map<string, number>();
    for (const r of reservas) {
      if (!r.pista) continue;
      counts.set(r.pista, (counts.get(r.pista) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([nombre, count]) => ({ nombre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  });

  /** Próximos 5 mantenimientos activos. */
  readonly proximosMantenimientos = computed<Mantenimiento[]>(() => {
    const items = this.mantenimientos()?.items ?? [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return items
      .filter((m) => m.isActive && !!m.fecha)
      .filter((m) => new Date(m.fecha as string).getTime() >= today.getTime())
      .sort((a, b) => new Date(a.fecha as string).getTime() - new Date(b.fecha as string).getTime())
      .slice(0, 5);
  });

  /** Últimas 6 reservas creadas (orden estable: por fechaHoraInicio descendente). */
  readonly ultimasReservas = computed<Reserva[]>(() => {
    const items = this.reservas()?.items ?? [];
    return [...items]
      .filter((r) => !!r.fechaHoraInicio)
      .sort((a, b) => new Date(b.fechaHoraInicio as string).getTime() - new Date(a.fechaHoraInicio as string).getTime())
      .slice(0, 6);
  });

  readonly doughnutData = computed(() => {
    const groups = this.reservasPorEstado();
    const labels = Array.from(groups.keys());
    const data = Array.from(groups.values());
    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map((l) => this.estadoColor(l)),
          borderWidth: 0,
          hoverOffset: 6
        }
      ]
    };
  });

  readonly doughnutOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { usePointStyle: true, boxWidth: 8, font: { size: 11 } }
      }
    }
  };

  readonly barData = computed(() => {
    const buckets = this.reservasPorDia();
    return {
      labels: buckets.map((b) => b.label),
      datasets: [
        {
          label: 'Reservas',
          data: buckets.map((b) => b.count),
          backgroundColor: 'rgba(230, 57, 70, 0.18)',
          borderColor: '#E63946',
          borderWidth: 1.5,
          borderRadius: 8,
          maxBarThickness: 32
        }
      ]
    };
  });

  readonly barOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 10 } } },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: { size: 10 } },
        grid: { color: 'rgba(168, 218, 220, 0.18)' }
      }
    }
  };

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminStats());
    this.store.dispatch(loadDashboardAdminReservas({}));
    this.store.dispatch(loadDashboardAdminPistas({ pageNumber: 1, pageSize: 50 }));
    this.store.dispatch(loadDashboardAdminMantenimientos());
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.stopReveal = revealOnView(this.hostRef.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.stopReveal();
  }

  reload(): void {
    this.store.dispatch(loadDashboardAdminStats());
    this.store.dispatch(loadDashboardAdminReservas({}));
  }

  estadoColor(estado: string): string {
    switch (estado.toUpperCase()) {
      case 'PAID':
      case 'CONFIRMADA':
      case 'CONFIRMED':
        return '#2E7D32';
      case 'PENDING':
      case 'PENDIENTE':
        return '#F4A261';
      case 'CANCELADA':
      case 'CANCELLED':
        return '#D62828';
      default:
        return '#457B9D';
    }
  }

  estadoPillClass(estado: string | null | undefined): string {
    const v = (estado ?? '').toUpperCase();
    if (v === 'PAID' || v === 'CONFIRMADA' || v === 'CONFIRMED') return 'pill pill--success';
    if (v === 'PENDING' || v === 'PENDIENTE') return 'pill pill--warning';
    if (v === 'CANCELADA' || v === 'CANCELLED') return 'pill pill--danger';
    return 'pill pill--info';
  }

  trackKpi(_: number, k: KpiTile) { return k.key; }
  trackReserva(_: number, r: Reserva) { return r.publicId ?? `${r.fechaHoraInicio}-${r.pista}`; }
  trackMantenimiento(_: number, m: Mantenimiento) { return m.publicId ?? `${m.fecha}-${m.slugPista}`; }
  trackPista(_: number, p: { nombre: string }) { return p.nombre; }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(value);
  }

  /** Heat intensity for top pistas bar */
  barIntensity(count: number): number {
    const max = this.topPistas()[0]?.count ?? 1;
    return Math.max(0.08, count / Math.max(1, max));
  }
}
