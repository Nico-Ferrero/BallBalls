import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DashboardAdminModule } from './dashboard-admin.interface';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './dashboard-admin.component.html',
  styleUrl: './dashboard-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardAdminComponent implements OnInit {

  readonly storageKey = 'ballballs-theme';
  isDarkTheme = false;
  isMobileMenuOpen = false;

  readonly modules: DashboardAdminModule[] = [
    { name: 'Deportes', endpoints: 5, route: 'deportes', summary: 'Catalogo y estados', icon: 'pi pi-compass' },
    { name: 'Pistas', endpoints: 5, route: 'pistas', summary: 'Listado y disponibilidad', icon: 'pi pi-th-large' },
    { name: 'Mantenimientos', endpoints: 4, route: 'mantenimiento', summary: 'Calendario y estados', icon: 'pi pi-wrench' },
    { name: 'Reservas', endpoints: 6, route: 'reservas', summary: 'Operativa y cancelaciones', icon: 'pi pi-calendar' },
  ];

  get totalEndpoints(): number {
    return this.modules.reduce((total, item) => total + item.endpoints, 0);
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkTheme = savedTheme ? savedTheme === 'dark' : systemPrefersDark;
    this.applyTheme(this.isDarkTheme);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme(this.isDarkTheme);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
  }
}
