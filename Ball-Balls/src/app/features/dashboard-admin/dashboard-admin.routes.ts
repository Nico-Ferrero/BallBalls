import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './dashboard-admin.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { DashboardDeportesComponent } from './components/dashboard-deportes/dashboard-deportes.component';
import { DashboardPistasComponent } from './components/dashboard-pistas/dashboard-pistas.component';
import { DashboardMantenimientoComponent } from './components/dashboard-mantenimiento/dashboard-mantenimiento.component';
import { DashboardReservasComponent } from './components/dashboard-reservas/dashboard-reservas.component';

export const dashboardAdminRoutes: Routes = [
  {
    path: '',
    component: DashboardAdminComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: DashboardOverviewComponent, title: 'Dashboard Resumen - Ball&Balls' },
      { path: 'deportes', component: DashboardDeportesComponent, title: 'Dashboard Deportes - Ball&Balls' },
      { path: 'pistas', component: DashboardPistasComponent, title: 'Dashboard Pistas - Ball&Balls' },
      { path: 'mantenimiento', component: DashboardMantenimientoComponent, title: 'Dashboard Mantenimiento - Ball&Balls' },
      { path: 'reservas', component: DashboardReservasComponent, title: 'Dashboard Reservas - Ball&Balls' },
  
    ]
  }
];
