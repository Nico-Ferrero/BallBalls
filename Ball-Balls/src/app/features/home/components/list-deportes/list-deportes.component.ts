import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppStateInterface } from '../../../../core/types/appState.interface';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getDeportes } from '../../store/actions';
import { selectDeportesList, selectDeportesError, selectDeportesIsLoading } from '../../store/selectors';

import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-list-deportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-deportes.component.html',
  styleUrl: './list-deportes.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListDeportesComponent {
  private readonly store: Store<AppStateInterface> = inject(Store);
  private readonly router: Router = inject(Router);

  readonly isLoading$ = this.store.select(selectDeportesIsLoading);
  readonly error$ = this.store.select(selectDeportesError);
  readonly deportes$ = this.store.select(selectDeportesList);

  constructor() {
    this.fetchDeportes();
  }

  fetchDeportes() {
    this.store.dispatch(getDeportes());
  }

  onSearch(slug: string) {
    const queryParams = { Deporte: slug };
    this.router.navigate(['/pistas'], { queryParams });
  }

}
