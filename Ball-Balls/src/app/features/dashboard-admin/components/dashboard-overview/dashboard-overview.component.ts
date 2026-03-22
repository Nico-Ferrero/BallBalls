import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { loadDashboardAdminStats } from '../../store/actions';
import {
  selectDashboardAdminStats,
  selectDashboardAdminStatsError,
  selectDashboardAdminStatsLoading
} from '../../store/selectors';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, ChartModule, ButtonModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrl: './dashboard-overview.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardOverviewComponent implements OnInit {
  private readonly store = inject(Store);

  readonly stats = this.store.selectSignal(selectDashboardAdminStats);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminStatsLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminStatsError);

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminStats());
  }

  buildChartData(stats: { deportesTotal: number; pistasTotal: number; mantenimientosTotal: number; reservasTotal: number }) {
    return {
      labels: ['Deportes', 'Pistas', 'Mantenimientos', 'Reservas'],
      datasets: [
        {
          data: [stats.deportesTotal, stats.pistasTotal, stats.mantenimientosTotal, stats.reservasTotal],
          backgroundColor: ['#E63946', '#457B9D', '#A8DADC', '#1D3557']
        }
      ]
    };
  }
}
