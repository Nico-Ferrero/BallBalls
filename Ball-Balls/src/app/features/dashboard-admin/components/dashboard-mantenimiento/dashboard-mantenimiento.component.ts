import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { loadDashboardAdminMantenimientos } from '../../store/actions';
import {
  selectDashboardAdminMantenimientos,
  selectDashboardAdminMantenimientosError,
  selectDashboardAdminMantenimientosLoading
} from '../../store/selectors';

@Component({
  selector: 'app-dashboard-mantenimiento',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './dashboard-mantenimiento.component.html',
  styleUrl: './dashboard-mantenimiento.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMantenimientoComponent implements OnInit {
  private readonly store = inject(Store);

  readonly mantenimientosData = this.store.selectSignal(selectDashboardAdminMantenimientos);
  readonly isLoading = this.store.selectSignal(selectDashboardAdminMantenimientosLoading);
  readonly error = this.store.selectSignal(selectDashboardAdminMantenimientosError);

  ngOnInit(): void {
    this.store.dispatch(loadDashboardAdminMantenimientos());
  }

  reload(): void {
    this.store.dispatch(loadDashboardAdminMantenimientos());
  }
}
