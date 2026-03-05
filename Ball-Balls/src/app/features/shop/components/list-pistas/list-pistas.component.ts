import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../core/types/appState.interface';
import { selectPistas, selectPistasIsLoading, selectPistasError } from '../../store/selectors';
import { loadPistas } from '../../store/actions';
import { FiltrosPistasComponent } from '../filtros-pistas/filtros-pistas.component';
import { LucideAngularModule, MapPin, Users, Euro, Activity, Clock, Heart } from 'lucide-angular';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-list-pistas',
  standalone: true,
  imports: [CommonModule, RouterLink, FiltrosPistasComponent, LucideAngularModule, PaginatorModule],
  templateUrl: './list-pistas.component.html',
  styleUrl: './list-pistas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListPistasComponent {
  readonly MapPin = MapPin;
  readonly Users = Users;
  readonly Euro = Euro;
  readonly Activity = Activity;
  readonly Clock = Clock;
  readonly Heart = Heart;

  private readonly store = inject(Store<AppStateInterface>);
  private readonly route = inject(ActivatedRoute);

  readonly isLoading$ = this.store.select(selectPistasIsLoading);
  readonly pistas$ = this.store.select(selectPistas);
  readonly error$ = this.store.select(selectPistasError);

  readonly skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  constructor() {
    this.fetchPistas();
  }

  fetchPistas(pageNumber = 1, pageSize = 6) {
    const queryParams = this.route.snapshot.queryParams;
    this.store.dispatch(loadPistas({
      params: {
        ...queryParams,
        PageNumber: pageNumber,
        PageSize: pageSize
      }
    }));
  }

  onPageChange(event: PaginatorState) {
    const pageNumber = (event.first! / event.rows!) + 1;
    const pageSize = event.rows!;
    this.fetchPistas(pageNumber, pageSize);
  }

  getStatusClass(estado: string | undefined): string {
    if (!estado) return 'badge-available';
    const normalized = estado.toLowerCase();
    if (normalized === 'ocupada') return 'badge-occupied';
    if (normalized === 'mantenimiento') return 'badge-maintenance';
    return 'badge-available';
  }

  getStatusLabel(estado: string | undefined): string {
    if (!estado) return 'Disponible';
    return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
  }
}
